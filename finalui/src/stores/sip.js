import { defineStore } from 'pinia';
import * as SIP from "sip.js";
import { useAuthStore } from './auth';
import { useUserStore } from './users';

export const useSipStore = defineStore('sip', {
    state: () => ({
        ua: null,
        registerer: null,
        session: null,
        registered: false,
        connected: false,
        starting: false,
        stopping: false,
        inCall: false,
        callStatus: '',
        localStream: null,
        extension: null,
        showIncomingPopup: false,
        incomingInvitation: null,
        isMuted: false,
        callStartTime: null,
        showDisposition: false,
        lastCallUniqueId: null,
    }),

    actions: {
        async fetchExtension() {
            try {
                const authStore = useAuthStore();
                const userStore = useUserStore();
                const userId = authStore.userId;

                if (!userId) throw new Error('User ID not found');

                const userData = await userStore.viewUser(userId);
                const user = userData?.users?.[0];
                const extenIndex = userData?.users_k?.exten?.[0];

                if (!user || !extenIndex) throw new Error('Extension mapping not found');

                this.extension = user[extenIndex];
                return this.extension;
            } catch (err) {
                console.error('Failed to fetch extension:', err);
                throw err;
            }
        },

        async startAgent() {
            if (this.starting || this.registered) return;
            this.starting = true;

            try {
                if (!this.extension) await this.fetchExtension();

                const uri = SIP.UserAgent.makeURI(`sip:${this.extension}@demo-openchs.bitz-itc.com`);
                const config = {
                    uri,
                    authorizationUsername: this.extension,
                    authorizationPassword: "23kdefrtgos09812100",
                    displayName: this.extension,
                    transportOptions: {
                        server: "wss://demo-openchs.bitz-itc.com:8089/ws",
                        traceSip: true,
                    },
                    delegate: {
                        onInvite: (invitation) => this.handleIncomingCall(invitation)
                    }
                };

                this.ua = new SIP.UserAgent(config);

                this.ua.transport.onConnect = () => {
                    this.connected = true;
                };

                this.ua.transport.onDisconnect = () => {
                    this.connected = false;
                    this.registered = false;
                };

                await this.ua.start();
                this.registerer = new SIP.Registerer(this.ua);

                this.registerer.stateChange.addListener((state) => {
                    this.registered = state === SIP.RegistererState.Registered;
                });

                await this.registerer.register();
            } catch (err) {
                console.error('SIP Agent start failed:', err);
            } finally {
                this.starting = false;
            }
        },

        handleIncomingCall(invitation) {
            this.incomingInvitation = invitation;
            this.showIncomingPopup = true;
            this.callStatus = 'Incoming call...';

            invitation.stateChange.addListener((state) => {
                if (state === SIP.SessionState.Terminated) {
                    this.resetCallState();
                }
            });
        },

        async answerCall() {
            if (!this.incomingInvitation) return;

            try {
                this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.session = this.incomingInvitation;
                this.showIncomingPopup = false;
                this.inCall = true;
                this.callStartTime = Date.now();

                this.session.stateChange.addListener((state) => {
                    if (state === SIP.SessionState.Established) {
                        this.callStatus = 'Connected';
                        this.setupMedia();
                    } else if (state === SIP.SessionState.Terminated) {
                        this.endCall();
                    }
                });

                await this.session.accept({
                    sessionDescriptionHandlerOptions: {
                        constraints: { audio: true, video: false }
                    }
                });

                const pc = this.session.sessionDescriptionHandler.peerConnection;
                this.localStream.getTracks().forEach(track => {
                    pc.addTrack(track, this.localStream);
                });

            } catch (err) {
                console.error('Failed to answer call:', err);
                this.resetCallState();
            }
        },

        declineCall() {
            if (this.incomingInvitation) {
                this.incomingInvitation.reject();
            }
            this.resetCallState();
        },

        setupMedia() {
            const pc = this.session.sessionDescriptionHandler.peerConnection;
            const inboundStream = new MediaStream();
            pc.getReceivers().forEach((receiver) => {
                if (receiver.track && receiver.track.kind === "audio") {
                    inboundStream.addTrack(receiver.track);
                }
            });

            // We'll use a global audio element managed by the Softphone component
            return inboundStream;
        },

        async hangup() {
            if (this.session) {
                try {
                    await this.session.bye();
                } catch (err) {
                    console.error('Hangup error:', err);
                }
            }
            this.endCall();
        },

        endCall() {
            this.inCall = false;
            this.callStatus = 'Call ended';
            this.showDisposition = true;
            // In a real app, we'd get the actual uniqueid from the SIP headers or backend
            this.lastCallUniqueId = this.session?.request?.getHeader('X-Asterisk-Uniqueid') || 'mock-' + Date.now();

            if (this.localStream) {
                this.localStream.getTracks().forEach(track => track.stop());
                this.localStream = null;
            }
            this.session = null;
            this.incomingInvitation = null;
        },

        resetCallState() {
            this.showIncomingPopup = false;
            this.incomingInvitation = null;
            this.inCall = false;
            this.callStatus = '';
        },

        toggleMute() {
            if (!this.session) return;
            this.isMuted = !this.isMuted;

            const pc = this.session.sessionDescriptionHandler.peerConnection;
            pc.getSenders().forEach(sender => {
                if (sender.track) sender.track.enabled = !this.isMuted;
            });
        },

        submitDisposition(reason) {
            console.log('Submitting disposition:', { uniqueid: this.lastCallUniqueId, reason });
            this.showDisposition = false;
            // Logic to save disposition via API would go here
        }
    }
});
