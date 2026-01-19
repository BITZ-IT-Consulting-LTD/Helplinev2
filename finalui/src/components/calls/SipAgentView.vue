<template>
  <div class="space-y-6">
    <div class="max-w-md mx-auto">
      <!-- Loading state -->
      <div 
        v-if="loadingExtension" 
        class="p-6 border rounded-lg shadow-xl"
        :class="isDarkMode 
          ? 'border-transparent bg-gray-800' 
          : 'border-transparent bg-white'"
      >
        <div class="flex items-center justify-center py-8">
          <div 
            class="animate-spin rounded-full h-8 w-8 border-b-2"
            :class="isDarkMode ? 'border-blue-500' : 'border-amber-600'"
          ></div>
          <span 
            class="ml-3"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            Loading extension...
          </span>
        </div>
      </div>

      <!-- Error state -->
      <div 
        v-else-if="extensionError" 
        class="p-6 border rounded-lg shadow-xl"
        :class="isDarkMode 
          ? 'border-red-700 bg-red-900/20' 
          : 'border-red-300 bg-red-50'"
      >
        <p 
          class="text-center"
          :class="isDarkMode ? 'text-red-400' : 'text-red-700'"
        >
          {{ extensionError }}
        </p>
      </div>

      <!-- SIP Agent -->
      <div 
        v-else 
        class="p-6 border rounded-lg shadow-xl"
        :class="isDarkMode 
          ? 'border-transparent bg-gray-800' 
          : 'border-transparent bg-white'"
      >
        <h3 
          class="mb-4 text-xl font-semibold text-center"
          :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'"
        >
          SIP Agent - Extension {{ agent.extension }}
        </h3>

        <div class="space-y-2 mb-6 text-sm">
          <div 
            class="flex justify-between items-center p-3 rounded border"
            :class="isDarkMode 
              ? 'bg-gray-900/40 border-transparent' 
              : 'bg-gray-50 border-transparent'"
          >
            <span 
              class="font-medium"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              Registered:
            </span>
            <span 
              class="font-semibold"
              :class="agent.registered 
                ? (isDarkMode ? 'text-green-400' : 'text-green-700') 
                : (isDarkMode ? 'text-red-400' : 'text-red-700')"
            >
              {{ agent.registered ? 'Yes' : 'No' }}
            </span>
          </div>
          
          <div 
            class="flex justify-between items-center p-3 rounded border"
            :class="isDarkMode 
              ? 'bg-gray-900/40 border-transparent' 
              : 'bg-gray-50 border-transparent'"
          >
            <span 
              class="font-medium"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              Connection:
            </span>
            <span 
              class="font-semibold"
              :class="agent.connected 
                ? (isDarkMode ? 'text-green-400' : 'text-green-700') 
                : (isDarkMode ? 'text-red-400' : 'text-red-700')"
            >
              {{ agent.connected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
          
          <div 
            v-if="agent.callStatus" 
            class="p-3 rounded border"
            :class="isDarkMode 
              ? 'bg-amber-600/20 border-amber-600/50' 
              : 'bg-amber-50 border-amber-300'"
          >
            <p 
              class="text-sm font-medium"
              :class="isDarkMode ? 'text-amber-500' : 'text-blue-700'"
            >
              {{ agent.callStatus }}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <button 
            @click="startAgent" 
            :disabled="agent.registered || agent.starting"
            class="px-6 py-3 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            :class="agent.registered || agent.starting
              ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-300')
              : (isDarkMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-700 hover:bg-amber-800')"
          >
            <i-mdi-play class="w-5 h-5" />
            {{ agent.starting ? 'Starting...' : 'Start (Register)' }}
          </button>
          
          <button 
            @click="hangup" 
            :disabled="!agent.inCall"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
            :class="!agent.inCall && !isDarkMode ? 'disabled:bg-gray-300' : ''"
          >
            <i-mdi-phone-hangup class="w-5 h-5" />
            Hang Up
          </button>
          
          <button 
            @click="stopAgent" 
            :disabled="!agent.registered || agent.stopping"
            class="px-6 py-3 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            :class="!agent.registered || agent.stopping
              ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-300')
              : (isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600')"
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
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/users';
import { inject } from 'vue';

export default {
  name: "SipAgentView",
  setup() {
    const isDarkMode = inject('isDarkMode');
    return { isDarkMode };
  },
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
        extension: null
      },
      loadingExtension: true,
      extensionError: null
    };
  },
  async mounted() {
    await this.fetchUserExtension();
  },
  methods: {
    async fetchUserExtension() {
      this.loadingExtension = true;
      this.extensionError = null;

      try {
        const authStore = useAuthStore();
        const userStore = useUserStore();

        const userId = authStore.userId;
        
        if (!userId) {
          throw new Error('User ID not found. Please log in again.');
        }

        console.log('📞 Fetching extension for user ID:', userId);

        // Fetch user details
        const userData = await userStore.viewUser(userId);
        
        console.log('👤 User data received:', userData);

        // Access first user from users array
        const user = userData?.users?.[0];
        
        if (!user) {
          throw new Error('User data not found.');
        }

        console.log('📋 User array:', user);

        // Get the extension index from users_k mapping
        const extenIndex = userData?.users_k?.exten?.[0];
        
        console.log('🔢 Extension index from users_k:', extenIndex);

        if (!extenIndex) {
          throw new Error('Extension mapping not found.');
        }

        // Access extension value from user array using the index
        const extension = user[extenIndex];
        
        console.log('📱 Extension value:', extension);

        if (!extension) {
          throw new Error('Extension not assigned to this user.');
        }

        this.agent.extension = extension;
        console.log('✅ SIP Extension set to:', extension);

      } catch (err) {
        console.error('❌ Error fetching extension:', err);
        this.extensionError = err.message || 'Failed to load extension';
      } finally {
        this.loadingExtension = false;
      }
    },

    setupMediaStreams(session, audioRef) {
      const pc = session.sessionDescriptionHandler.peerConnection;

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
    if (this.agent.registered) {
      this.stopAgent();
    }
  }
};
</script>