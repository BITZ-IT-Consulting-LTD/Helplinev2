<template>
  <div class="space-y-6">
    <div class="max-w-md mx-auto">
      <!-- Single Agent (Extension 100) -->
      <div class="p-6 border border-gray-700 rounded-lg bg-gray-800 shadow-xl">
        <h3 class="mb-4 text-xl font-semibold text-center text-gray-100">SIP Agent - Extension 100</h3>

        <div class="space-y-2 mb-6 text-sm">
          <div class="flex justify-between items-center bg-gray-900/40 p-3 rounded border border-gray-700">
            <span class="text-gray-400 font-medium">Registered:</span>
            <span :class="agent.registered ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'">
              {{ agent.registered ? 'Yes' : 'No' }}
            </span>
          </div>
          <div class="flex justify-between items-center bg-gray-900/40 p-3 rounded border border-gray-700">
            <span class="text-gray-400 font-medium">Connection:</span>
            <span :class="agent.connected ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'">
              {{ agent.connected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
          <div v-if="agent.callStatus" class="bg-blue-600/20 border border-blue-600/50 p-3 rounded">
            <p class="text-sm font-medium text-blue-400">{{ agent.callStatus }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <button 
            @click="startAgent" 
            :disabled="agent.registered || agent.starting"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
          >
            <i-mdi-play class="w-5 h-5" />
            {{ agent.starting ? 'Starting...' : 'Start (Register)' }}
          </button>
          
          <button 
            @click="hangup" 
            :disabled="!agent.inCall"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
          >
            <i-mdi-phone-hangup class="w-5 h-5" />
            Hang Up
          </button>
          
          <button 
            @click="stopAgent" 
            :disabled="!agent.registered || agent.stopping"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
          >
            <i-mdi-stop class="w-5 h-5" />
            {{ agent.stopping ? 'Stopping...' : 'Stop (Unregister)' }}
          </button>
        </div>

        <audio ref="remoteAudio" autoplay playsinline class="hidden"></audio>
      </div>
    </div>
  </div>
</template>

<script>
import * as SIP from "sip.js";

export default {
  name: "SipAgentView",
  data() {
    return {
      agent: {
        ua: null,
        registerer: null,
        registered: false,
        connected: false,
        starting: false,
        stopping: false,
        session: null,
        inCall: false,
        callStatus: '',
        localStream: null,
        extension: '100'
      }
    };
  },
  methods: {
    setupMediaStreams(session, audioRef) {
      const pc = session.sessionDescriptionHandler.peerConnection;

      // Setup remote audio (incoming)
      const inboundStream = new MediaStream();
      pc.getReceivers().forEach((receiver) => {
        if (receiver.track && receiver.track.kind === "audio") {
          inboundStream.addTrack(receiver.track);
        }
      });
      
      if (inboundStream.getTracks().length > 0) {
        audioRef.srcObject = inboundStream;
        audioRef.play().catch(err => console.error("Play failed:", err));
      }

      // Log track status
      console.log(`[${this.agent.extension}] Local tracks:`, this.agent.localStream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
      console.log(`[${this.agent.extension}] Remote tracks:`, inboundStream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
    },

    async handleIncomingCall(invitation) {
      console.log(`[${this.agent.extension}] Incoming call:`, invitation);
      this.agent.callStatus = 'Incoming call...';

      try {
        if (!this.agent.localStream) {
          this.agent.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log(`[${this.agent.extension}] Got microphone access`);
        }

        this.agent.session = invitation;
        this.agent.inCall = true;

        invitation.stateChange.addListener((state) => {
          console.log(`[${this.agent.extension}] Call state:`, state);
          
          if (state === SIP.SessionState.Established) {
            this.agent.callStatus = 'Connected';
            this.setupMediaStreams(invitation, this.$refs.remoteAudio);
          } else if (state === SIP.SessionState.Terminated) {
            this.agent.inCall = false;
            this.agent.session = null;
            this.agent.callStatus = 'Call ended';
            this.$refs.remoteAudio.srcObject = null;
          }
        });

        await invitation.accept({
          sessionDescriptionHandlerOptions: {
            constraints: { audio: true, video: false }
          }
        });

        // Manually add local stream to peer connection after accept
        const pc = invitation.sessionDescriptionHandler.peerConnection;
        this.agent.localStream.getTracks().forEach(track => {
          const sender = pc.addTrack(track, this.agent.localStream);
          console.log(`[${this.agent.extension}] Added local track:`, track.kind, sender);
        });

        this.agent.callStatus = 'Call in progress';

      } catch (err) {
        console.error(`[${this.agent.extension}] Error handling incoming call:`, err);
        this.agent.callStatus = 'Error accepting call';
      }
    },

    startAgent() {
      this.agent.starting = true;
      
      try {
        const uri = SIP.UserAgent.makeURI(`sip:${this.agent.extension}@demo-openchs.bitz-itc.com`);
        if (!uri) throw new Error("Invalid SIP URI");

        const config = {
          uri,
          authorizationUsername: this.agent.extension,
          authorizationPassword: "23kdefrtgos09812100",
          displayName: this.agent.extension,
          transportOptions: {
            server: "wss://demo-openchs.bitz-itc.com:8089/ws",
            traceSip: true,
          },
          log: { level: "log" },
          delegate: {
            onInvite: (invitation) => this.handleIncomingCall(invitation)
          }
        };

        console.log(`[${this.agent.extension}] Starting SIP agent`);
        this.agent.ua = new SIP.UserAgent(config);

        this.agent.ua.transport.onConnect = () => {
          console.log(`[${this.agent.extension}] Transport connected`);
          this.agent.connected = true;
        };

        this.agent.ua.transport.onDisconnect = (error) => {
          console.warn(`[${this.agent.extension}] Transport disconnected`, error);
          this.agent.connected = false;
          this.agent.registered = false;
        };

        this.agent.ua.start()
          .then(() => {
            console.log(`[${this.agent.extension}] SIP Agent started`);
            this.agent.registerer = new SIP.Registerer(this.agent.ua);

            this.agent.registerer.stateChange.addListener((state) => {
              if (state === SIP.RegistererState.Registered) {
                console.log(`[${this.agent.extension}] Registered`);
                this.agent.registered = true;
              } else if (state === SIP.RegistererState.Unregistered) {
                console.log(`[${this.agent.extension}] Unregistered`);
                this.agent.registered = false;
              }
            });

            this.agent.registerer.register();
          })
          .catch(err => console.error(`[${this.agent.extension}] Failed to start:`, err))
          .finally(() => this.agent.starting = false);

      } catch (err) {
        console.error(`[${this.agent.extension}] Error starting agent:`, err);
        this.agent.starting = false;
      }
    },

    hangup() {
      if (this.agent.session) {
        try {
          this.agent.session.bye();
          console.log(`[${this.agent.extension}] Hung up`);
        } catch (err) {
          console.error(`[${this.agent.extension}] Error hanging up:`, err);
        }
      }
    },

    stopAgent() {
      if (!this.agent.registerer || !this.agent.ua) return;
      
      this.agent.stopping = true;
      this.agent.registerer.unregister()
        .then(() => {
          console.log(`[${this.agent.extension}] Unregistered`);
          return this.agent.ua.stop();
        })
        .then(() => {
          this.agent.connected = false;
          this.agent.registered = false;
          this.agent.ua = null;
          this.agent.registerer = null;
          this.agent.callStatus = '';
          
          if (this.agent.localStream) {
            this.agent.localStream.getTracks().forEach(track => track.stop());
            this.agent.localStream = null;
          }
        })
        .catch(err => console.error(`[${this.agent.extension}] Error stopping:`, err))
        .finally(() => this.agent.stopping = false);
    }
  },
  beforeUnmount() {
    // Cleanup when component is destroyed
    if (this.agent.registered) {
      this.stopAgent();
    }
  }
};
</script>