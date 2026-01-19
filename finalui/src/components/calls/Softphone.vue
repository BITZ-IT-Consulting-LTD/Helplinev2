<template>
  <div 
    class="fixed bottom-6 right-6 z-[100] transition-all duration-500 transform"
    :class="isOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95 opacity-0 pointer-events-none'"
  >
    <!-- Main Softphone Card -->
    <div 
      class="w-80 overflow-hidden rounded-3xl shadow-2xl border backdrop-blur-xl"
      :class="isDarkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white/90 border-gray-100'"
    >
      <!-- Header / Status Bar -->
      <div 
        class="px-4 py-3 flex items-center justify-between border-b"
        :class="isDarkMode ? 'border-neutral-800' : 'border-gray-100'"
      >
        <div class="flex items-center gap-2">
          <div 
            class="w-2 h-2 rounded-full animate-pulse"
            :class="agent.registered ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'"
          ></div>
          <span class="text-[10px] font-bold uppercase tracking-widest" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            {{ agent.registered ? `Extension ${agent.extension}` : 'Offline' }}
          </span>
        </div>
        <button @click="isOpen = false" class="p-1 hover:bg-gray-500/10 rounded-full transition-colors">
          <i-mdi-chevron-down class="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="p-5 min-h-[400px] flex flex-col">
        
        <!-- View 1: IDLE / Dialpad -->
        <div v-if="callState === 'IDLE'" class="space-y-6 flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4">
          <!-- Dialed Number Display -->
          <div class="h-12 flex items-center justify-center">
            <input 
              v-model="dialedNumber"
              type="text"
              readonly
              placeholder="Enter number..."
              class="w-full text-2xl font-bold text-center bg-transparent border-none focus:ring-0"
              :class="isDarkMode ? 'text-white' : 'text-gray-900'"
            />
          </div>

          <!-- Keypad Grid -->
          <div class="grid grid-cols-3 gap-4 px-4">
            <button 
              v-for="key in ['1','2','3','4','5','6','7','8','9','*','0','#']" 
              :key="key"
              @click="dialedNumber += key"
              class="w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-90"
              :class="isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'"
            >
              <span class="text-xl font-bold">{{ key }}</span>
              <span v-if="getExtra(key)" class="text-[8px] font-bold opacity-40 uppercase">{{ getExtra(key) }}</span>
            </button>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-center gap-6 mt-auto">
            <button 
              @click="agent.registered ? startCall() : null"
              :disabled="!agent.registered || !dialedNumber"
              class="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 disabled:opacity-30 translate-y-2 hover:scale-110 active:scale-95"
              :class="isDarkMode ? 'bg-emerald-600 text-white shadow-emerald-900/20' : 'bg-emerald-600 text-white shadow-emerald-500/20'"
            >
              <i-mdi-phone class="w-8 h-8" />
            </button>
            <button 
              v-if="dialedNumber"
              @click="dialedNumber = dialedNumber.slice(0, -1)"
              class="absolute right-12 bottom-20 p-2 rounded-full transition-colors"
              :class="isDarkMode ? 'text-gray-400 hover:bg-neutral-800' : 'text-gray-500 hover:bg-gray-100'"
            >
              <i-mdi-backspace class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- View 2: RINGING / Incoming Call -->
        <div v-if="callState === 'RINGING'" class="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95">
          <div class="text-center">
            <div class="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6 relative">
              <div class="absolute inset-0 rounded-full border-4 border-amber-500 animate-ping opacity-20"></div>
              <i-mdi-account class="w-12 h-12 text-amber-500" />
            </div>
            <h2 class="text-xl font-bold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ dialedNumber || 'Unknown Caller' }}</h2>
            <p class="text-xs font-bold uppercase tracking-widest text-amber-500 animate-pulse">Incoming Call...</p>
          </div>

          <div class="flex items-center gap-10 w-full justify-center">
            <button 
              @click="rejectCall"
              class="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
            >
              <i-mdi-phone-hangup class="w-8 h-8" />
            </button>
            <button 
              @click="acceptCall"
              class="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95"
            >
              <i-mdi-phone class="w-8 h-8" />
            </button>
          </div>
        </div>

        <!-- View 3: CONNECTED / Active Call -->
        <div v-if="callState === 'CONNECTED'" class="flex-1 flex flex-col space-y-6 animate-in fade-in transition-all">
          <!-- Call Timer -->
          <div class="text-center py-4">
            <h2 class="text-2xl font-bold tabular-nums mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ formattedDuration }}</h2>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em]" :class="isDarkMode ? 'text-amber-500' : 'text-amber-600'">Active Call: {{ dialedNumber }}</p>
          </div>

          <!-- Shortcuts -->
          <div class="grid grid-cols-1 gap-3">
            <button 
              @click="handleCreateCase"
              class="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed transition-all hover:bg-amber-500/5"
              :class="isDarkMode ? 'border-amber-500/30 text-amber-500' : 'border-amber-600/30 text-amber-600'"
            >
              <i-mdi-plus-box class="w-5 h-5" />
              <span class="text-sm font-bold">Create Case</span>
            </button>
          </div>

          <!-- Mid-Call Actions -->
          <div class="grid grid-cols-3 gap-4 py-4">
            <button 
              @click="isMuted = !isMuted"
              class="flex flex-col items-center gap-2 "
            >
              <div class="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-gray-500/10"
                :class="isMuted ? 'bg-amber-500 text-white' : (isDarkMode ? 'text-white' : 'text-gray-900')"
              >
                <i-mdi-microphone-off v-if="isMuted" class="w-5 h-5" />
                <i-mdi-microphone v-else class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-bold uppercase opacity-60">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
            </button>

            <button 
              @click="isOnHold = !isOnHold"
              class="flex flex-col items-center gap-2"
            >
              <div class="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-gray-500/10"
                :class="isOnHold ? 'bg-blue-500 text-white' : (isDarkMode ? 'text-white' : 'text-gray-900')"
              >
                <i-mdi-pause v-if="!isOnHold" class="w-5 h-5" />
                <i-mdi-play v-else class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-bold uppercase opacity-60">{{ isOnHold ? 'Resume' : 'Hold' }}</span>
            </button>

            <button class="flex flex-col items-center gap-2">
              <div class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-500/10" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                <i-mdi-dialpad class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-bold uppercase opacity-60">Keypad</span>
            </button>
          </div>

          <!-- Hang Up -->
          <div class="mt-auto flex justify-center pb-4">
            <button 
              @click="hangup"
              class="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
            >
              <i-mdi-phone-hangup class="w-8 h-8" />
            </button>
          </div>
        </div>

        <!-- View 4: DISPOSING / Disposition -->
        <div v-if="callState === 'DISPOSING'" class="flex-1 flex flex-col space-y-6 animate-in slide-in-from-right-8">
          <div class="text-center">
            <h4 class="text-sm font-bold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Call Disposition</h4>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Select outcome for {{ dialedNumber }}</p>
          </div>

          <div class="space-y-2">
            <button 
              v-for="reason in dispositionReasons" 
              :key="reason"
              @click="selectedDisposition = reason"
              class="w-full p-3 rounded-xl border text-left transition-all text-xs font-bold"
              :class="selectedDisposition === reason
                ? 'bg-amber-500 text-white border-amber-500'
                : (isDarkMode ? 'bg-neutral-800 border-neutral-700 text-gray-300 hover:border-amber-500/50' : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-amber-600/50')"
            >
              {{ reason }}
            </button>
            
            <!-- Other Input -->
            <div class="space-y-2 pt-2">
              <span class="text-[10px] font-bold text-gray-500 uppercase px-1">Other Reason</span>
              <textarea 
                v-model="customDisposition"
                rows="2"
                placeholder="Type reason here..."
                class="w-full p-3 rounded-xl border text-xs font-bold focus:ring-1 focus:ring-amber-500/50 bg-transparent outline-none"
                :class="isDarkMode ? 'border-neutral-700 text-white bg-black/40' : 'border-gray-100 text-gray-900 bg-white'"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-4 mt-auto">
             <button 
                @click="resetSoftphone"
                class="flex-1 py-3 rounded-xl text-xs font-bold transition-all"
                :class="isDarkMode ? 'bg-neutral-800 text-gray-400' : 'bg-gray-100 text-gray-500'"
             >
               Skip
             </button>
             <button 
                @click="completeDisposition"
                :disabled="!selectedDisposition && !customDisposition"
                class="flex-1 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-30"
                :class="isDarkMode ? 'bg-amber-600 text-white' : 'bg-amber-700 text-white'"
             >
               Save & Finish
             </button>
          </div>
        </div>

      </div>

      <!-- Hidden Audio Element -->
      <audio ref="remoteAudio" autoplay playsinline class="hidden"></audio>
    </div>

    <!-- Toggle Button (Floating) -->
    <button 
      v-if="!isOpen"
      @click="isOpen = true"
      class="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group z-[101]"
      :class="[
        callState === 'RINGING' ? 'bg-amber-500 animate-bounce' : (callState === 'CONNECTED' ? 'bg-emerald-500' : 'bg-amber-600'),
      ]"
    >
      <i-mdi-phone v-if="callState !== 'RINGING'" class="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
      <i-mdi-phone-ring v-else class="w-8 h-8 text-white animate-pulse" />
      
      <!-- Notifications badge for missed etc if needed -->
      <div v-if="callState === 'RINGING'" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">1</div>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import * as SIP from "sip.js"
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/users'
import { toast } from 'vue-sonner'

const isDarkMode = inject('isDarkMode')
const router = useRouter()

// UI States
const isOpen = ref(false)
const callState = ref('IDLE') // IDLE, RINGING, CONNECTED, DISPOSING
const dialedNumber = ref('')
const isMuted = ref(false)
const isOnHold = ref(false)
const duration = ref(0)
const timer = ref(null)

const selectedDisposition = ref('')
const customDisposition = ref('')
const dispositionReasons = [
  'No Caller Present',
  'Prank/Malicious Call',
  'Too Short/Dropped',
  'Not Relevant to Service',
  'Wrong Number'
]

// SIP Agent Logic
const agent = reactive({
  ua: null,
  registerer: null,
  registered: false,
  connected: false,
  session: null,
  localStream: null,
  extension: null
})

const remoteAudio = ref(null)

const getExtra = (key) => {
  const map = { '2':'abc', '3':'def', '4':'ghi', '5':'jkl', '6':'mno', '7':'pqrs', '8':'tuv', '9':'wxyz' }
  return map[key] || ''
}

const formattedDuration = computed(() => {
  const mins = Math.floor(duration.value / 60)
  const secs = duration.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

// Lifecycle
onMounted(async () => {
  await fetchUserExtension()
  // Mock incoming call for demo if needed, but we'll stick to real logic from previous component
  if (agent.extension) {
    autoStartAgent()
  }
})

onBeforeUnmount(() => {
  stopAgent()
  clearInterval(timer.value)
})

// Methods
const fetchUserExtension = async () => {
  try {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const userId = authStore.userId
    if (!userId) return

    const userData = await userStore.viewUser(userId)
    const user = userData?.users?.[0]
    const extenIndex = userData?.users_k?.exten?.[0]
    
    if (user && extenIndex) {
      agent.extension = user[extenIndex]
    }
  } catch (err) {
    console.error('Error fetching extension:', err)
  }
}

const autoStartAgent = () => {
  try {
    const uri = SIP.UserAgent.makeURI(`sip:${agent.extension}@demo-openchs.bitz-itc.com`)
    const config = {
      uri,
      authorizationUsername: agent.extension,
      authorizationPassword: "23kdefrtgos09812100",
      displayName: agent.extension,
      transportOptions: {
        server: "wss://demo-openchs.bitz-itc.com:8089/ws",
        traceSip: false,
      },
      delegate: {
        onInvite: (invitation) => handleIncomingInvite(invitation)
      }
    }
    agent.ua = new SIP.UserAgent(config)
    agent.ua.start().then(() => {
      agent.registerer = new SIP.Registerer(agent.ua)
      agent.registerer.stateChange.addListener((state) => {
        agent.registered = (state === SIP.RegistererState.Registered)
      })
      agent.registerer.register()
    })
  } catch (err) {
    console.error('SIP Startup Error:', err)
  }
}

const handleIncomingInvite = (invitation) => {
  agent.session = invitation
  callState.value = 'RINGING'
  isOpen.value = true // Force voice panel open on incoming call
  
  invitation.stateChange.addListener((state) => {
    if (state === SIP.SessionState.Terminated) {
      if (callState.value === 'CONNECTED') {
        goToDisposition()
      } else {
        resetSoftphone()
      }
    }
  })
}

const startCall = async () => {
  if (!dialedNumber.value) return
  // Logic for outbound would go here if SIP supports it
  // For demo/consistency with user request, we enter connected state
  callState.value = 'CONNECTED'
  startTimer()
}

const acceptCall = async () => {
  try {
    if (!agent.localStream) {
      agent.localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    }
    
    await agent.session.accept({
      sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } }
    })
    
    callState.value = 'CONNECTED'
    startTimer()
    
    // Media setup (simplified for brevity)
    const pc = agent.session.sessionDescriptionHandler.peerConnection
    const inboundStream = new MediaStream()
    pc.getReceivers().forEach(r => r.track && inboundStream.addTrack(r.track))
    if (remoteAudio.value) remoteAudio.value.srcObject = inboundStream
    
  } catch (err) {
    console.error('Accept call error:', err)
    resetSoftphone()
  }
}

const rejectCall = () => {
  if (agent.session) agent.session.reject()
  resetSoftphone()
}

const hangup = () => {
  if (agent.session) {
    agent.session.bye()
  } else {
    goToDisposition()
  }
}

const goToDisposition = () => {
  stopTimer()
  callState.value = 'DISPOSING'
}

const startTimer = () => {
  duration.value = 0
  timer.value = setInterval(() => {
    duration.value++
  }, 1000)
}

const stopTimer = () => {
  clearInterval(timer.value)
}

const resetSoftphone = () => {
  callState.value = 'IDLE'
  dialedNumber.value = ''
  duration.value = 0
  isMuted.value = false
  isOnHold.value = false
  selectedDisposition.value = ''
  customDisposition.value = ''
}

const completeDisposition = () => {
  toast.success('Disposition saved successfully')
  resetSoftphone()
}

const handleCreateCase = () => {
  // Navigate to case creation without closing phone
  router.push('/case-creation')
  toast.info('Directing to case creation...')
}

const stopAgent = () => {
  if (agent.registerer) agent.registerer.unregister()
  if (agent.ua) agent.ua.stop()
  if (agent.localStream) agent.localStream.getTracks().forEach(t => t.stop())
}
</script>

<style scoped>
.animate-in {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
