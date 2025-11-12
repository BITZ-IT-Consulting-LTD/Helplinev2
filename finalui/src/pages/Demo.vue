<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold mb-4">SIP Call Testing</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Agent 1 (Extension 101) -->
      <div class="p-4 border-2 border-gray-300 rounded-lg">
        <h3 class="mb-3 text-lg font-semibold">Agent 1 - Extension 101</h3>

        <div class="space-y-2 mb-4 text-sm">
          <div><strong>Registered:</strong> <span :class="agent1.registered ? 'text-green-600' : 'text-red-600'">{{ agent1.registered ? 'Yes' : 'No' }}</span></div>
          <div><strong>Connection:</strong> <span :class="agent1.connected ? 'text-green-600' : 'text-red-600'">{{ agent1.connected ? 'Connected' : 'Disconnected' }}</span></div>
          <div v-if="agent1.callStatus"><strong>Call Status:</strong> {{ agent1.callStatus }}</div>
        </div>

        <div class="flex flex-col gap-2">
          <button 
            @click="startAgent(agent1, '101')" 
            :disabled="agent1.registered || agent1.starting"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Start (Register)
          </button>
          
          <button 
            @click="makeCall(agent1, '102')" 
            :disabled="!agent1.registered || agent1.inCall"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Call Extension 102
          </button>
          
          <button 
            @click="hangup(agent1)" 
            :disabled="!agent1.inCall"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Hang Up
          </button>
          
          <button 
            @click="stopAgent(agent1)" 
            :disabled="!agent1.registered || agent1.stopping"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Stop (Unregister)
          </button>
        </div>

        <audio ref="remoteAudio1" autoplay playsinline class="hidden"></audio>
      </div>

      <!-- Agent 2 (Extension 102) -->
      <div class="p-4 border-2 border-gray-300 rounded-lg">
        <h3 class="mb-3 text-lg font-semibold">Agent 2 - Extension 102</h3>

        <div class="space-y-2 mb-4 text-sm">
          <div><strong>Registered:</strong> <span :class="agent2.registered ? 'text-green-600' : 'text-red-600'">{{ agent2.registered ? 'Yes' : 'No' }}</span></div>
          <div><strong>Connection:</strong> <span :class="agent2.connected ? 'text-green-600' : 'text-red-600'">{{ agent2.connected ? 'Connected' : 'Disconnected' }}</span></div>
          <div v-if="agent2.callStatus"><strong>Call Status:</strong> {{ agent2.callStatus }}</div>
        </div>

        <div class="flex flex-col gap-2">
          <button 
            @click="startAgent(agent2, '102')" 
            :disabled="agent2.registered || agent2.starting"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Start (Register)
          </button>
          
          <button 
            @click="makeCall(agent2, '101')" 
            :disabled="!agent2.registered || agent2.inCall"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Call Extension 101
          </button>
          
          <button 
            @click="hangup(agent2)" 
            :disabled="!agent2.inCall"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Hang Up
          </button>
          
          <button 
            @click="stopAgent(agent2)" 
            :disabled="!agent2.registered || agent2.stopping"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Stop (Unregister)
          </button>
        </div>

        <audio ref="remoteAudio2" autoplay playsinline class="hidden"></audio>
      </div>
    </div>
  </div>
</template>

<script>
import * as SIP from "sip.js";

export default {
  name: "SIPTest",
  data() {
    return {
      agent1: {
        ua: null,
        registerer: null,
        registered: false,
        connected: false,
        starting: false,
        stopping: false,
        session: null,
        inCall: false,
        callStatus: '',
        localStream: null
      },
      agent2: {
        ua: null,
        registerer: null,
        registered: false,
        connected: false,
        starting: false,
        stopping: false,
        session: null,
        inCall: false,
        callStatus: '',
        localStream: null
      }
    };
  },
  methods: {
    async handleIncomingCall(agent, audioRef, invitation) {
      console.log(`[${agent.extension}] Incoming call:`, invitation);
      agent.callStatus = 'Incoming call...';

      try {
        if (!agent.localStream) {
          agent.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        await invitation.accept({
          sessionDescriptionHandlerOptions: {
            constraints: { audio: true, video: false },
            localStream: agent.localStream
          }
        });

        agent.session = invitation;
        agent.inCall = true;
        agent.callStatus = 'Call in progress';

        invitation.stateChange.addListener((state) => {
          console.log(`[${agent.extension}] Call state:`, state);
          
          if (state === SIP.SessionState.Established) {
            const pc = invitation.sessionDescriptionHandler.peerConnection;

            agent.localStream.getTracks().forEach(track => {
              pc.addTrack(track, agent.localStream);
            });

            const inboundStream = new MediaStream();
            pc.getReceivers().forEach((receiver) => {
              if (receiver.track && receiver.track.kind === "audio") {
                inboundStream.addTrack(receiver.track);
              }
            });
            
            audioRef.srcObject = inboundStream;
            audioRef.play().catch(err => console.error("Play failed:", err));
            agent.callStatus = 'Connected';
          } else if (state === SIP.SessionState.Terminated) {
            agent.inCall = false;
            agent.session = null;
            agent.callStatus = 'Call ended';
            audioRef.srcObject = null;
          }
        });

      } catch (err) {
        console.error(`[${agent.extension}] Error handling incoming call:`, err);
        agent.callStatus = 'Error accepting call';
      }
    },

    startAgent(agent, extension) {
      agent.starting = true;
      agent.extension = extension;
      
      try {
        const uri = SIP.UserAgent.makeURI(`sip:${extension}@demo-openchs.bitz-itc.com`);
        if (!uri) throw new Error("Invalid SIP URI");

        const audioRef = extension === '101' ? this.$refs.remoteAudio1 : this.$refs.remoteAudio2;

        const config = {
          uri,
          authorizationUsername: extension,
          authorizationPassword: "23kdefrtgos09812100",
          displayName: extension,
          transportOptions: {
            server: "wss://demo-openchs.bitz-itc.com:8089/ws",
            traceSip: true,
          },
          log: { level: "log" },
          delegate: {
            onInvite: (invitation) => this.handleIncomingCall(agent, audioRef, invitation)
          }
        };

        console.log(`[${extension}] Starting SIP agent`);
        agent.ua = new SIP.UserAgent(config);

        agent.ua.transport.onConnect = () => {
          console.log(`[${extension}] Transport connected`);
          agent.connected = true;
        };

        agent.ua.transport.onDisconnect = (error) => {
          console.warn(`[${extension}] Transport disconnected`, error);
          agent.connected = false;
          agent.registered = false;
        };

        agent.ua.start()
          .then(() => {
            console.log(`[${extension}] SIP Agent started`);
            agent.registerer = new SIP.Registerer(agent.ua);

            agent.registerer.stateChange.addListener((state) => {
              if (state === SIP.RegistererState.Registered) {
                console.log(`[${extension}] Registered`);
                agent.registered = true;
              } else if (state === SIP.RegistererState.Unregistered) {
                console.log(`[${extension}] Unregistered`);
                agent.registered = false;
              }
            });

            agent.registerer.register();
          })
          .catch(err => console.error(`[${extension}] Failed to start:`, err))
          .finally(() => agent.starting = false);

      } catch (err) {
        console.error(`[${extension}] Error starting agent:`, err);
        agent.starting = false;
      }
    },

    async makeCall(agent, targetExtension) {
      try {
        agent.callStatus = `Calling ${targetExtension}...`;
        
        if (!agent.localStream) {
          agent.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        const target = SIP.UserAgent.makeURI(`sip:${targetExtension}@demo-openchs.bitz-itc.com`);
        const inviter = new SIP.Inviter(agent.ua, target);
        
        agent.session = inviter;
        agent.inCall = true;

        const audioRef = agent.extension === '101' ? this.$refs.remoteAudio1 : this.$refs.remoteAudio2;

        inviter.stateChange.addListener((state) => {
          console.log(`[${agent.extension}] Outgoing call state:`, state);
          
          if (state === SIP.SessionState.Establishing) {
            agent.callStatus = 'Ringing...';
          } else if (state === SIP.SessionState.Established) {
            const pc = inviter.sessionDescriptionHandler.peerConnection;

            agent.localStream.getTracks().forEach(track => {
              pc.addTrack(track, agent.localStream);
            });

            const inboundStream = new MediaStream();
            pc.getReceivers().forEach((receiver) => {
              if (receiver.track && receiver.track.kind === "audio") {
                inboundStream.addTrack(receiver.track);
              }
            });
            
            audioRef.srcObject = inboundStream;
            audioRef.play().catch(err => console.error("Play failed:", err));
            agent.callStatus = 'Connected';
          } else if (state === SIP.SessionState.Terminated) {
            agent.inCall = false;
            agent.session = null;
            agent.callStatus = 'Call ended';
            audioRef.srcObject = null;
          }
        });

        await inviter.invite({
          sessionDescriptionHandlerOptions: {
            constraints: { audio: true, video: false },
            localStream: agent.localStream
          }
        });

        console.log(`[${agent.extension}] Call initiated to ${targetExtension}`);

      } catch (err) {
        console.error(`[${agent.extension}] Error making call:`, err);
        agent.callStatus = 'Call failed';
        agent.inCall = false;
        agent.session = null;
      }
    },

    hangup(agent) {
      if (agent.session) {
        try {
          agent.session.bye();
          console.log(`[${agent.extension}] Hung up`);
        } catch (err) {
          console.error(`[${agent.extension}] Error hanging up:`, err);
        }
      }
    },

    stopAgent(agent) {
      if (!agent.registerer || !agent.ua) return;
      
      agent.stopping = true;
      agent.registerer.unregister()
        .then(() => {
          console.log(`[${agent.extension}] Unregistered`);
          return agent.ua.stop();
        })
        .then(() => {
          agent.connected = false;
          agent.registered = false;
          agent.ua = null;
          agent.registerer = null;
          agent.callStatus = '';
          
          if (agent.localStream) {
            agent.localStream.getTracks().forEach(track => track.stop());
            agent.localStream = null;
          }
        })
        .catch(err => console.error(`[${agent.extension}] Error stopping:`, err))
        .finally(() => agent.stopping = false);
    }
  }
};
</script>