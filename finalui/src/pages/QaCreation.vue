<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
    <div class="max-w-[1800px] mx-auto flex flex-col gap-6">
      <!-- ROW 1: Page Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border-l-4 border-blue-500">
        <div class="flex items-center gap-4 mb-2">
          <button 
            @click="goBack"
            class="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-600 dark:text-blue-400">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quality Assurance Evaluation
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Review and evaluate call quality based on established criteria
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- ROW 2: Main Content (Two Columns) -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- LEFT COLUMN: Call Details (Sticky) -->
        <div class="lg:col-span-4 xl:col-span-3">
          <CallDetailsCard :call-data="callData" />
        </div>

        <!-- RIGHT COLUMN: Two Rows -->
        <div class="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <!-- RIGHT COLUMN - ROW 1: Section Navigation -->
          <QASectionNav 
            :sections="sectionsWithScores"
            :active-section="activeSection"
            @change-section="changeSection"
          />

          <!-- RIGHT COLUMN - ROW 2: Active Form Section -->
          <CreateQA 
            ref="createQARef"
            :active-section="activeSection"
            :chan-uniqueid="callData.chanUniqueid"
            @qa-submitted="handleQASubmitted"
            @next-section="nextSection"
            @previous-section="previousSection"
            @section-scores-updated="updateSectionScores"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCallStore } from '@/stores/calls'
import CallDetailsCard from '@/components/qa-create/CallDetailsCard.vue'
import QASectionNav from '@/components/qa-create/QASectionNav.vue'
import CreateQA from '@/components/qa-create/CreateQA.vue'

const router = useRouter()
const route = useRoute()
const callStore = useCallStore()
const createQARef = ref(null)

// Loading and error states
const loading = ref(false)
const error = ref(null)

// Active section state
const activeSection = ref(0)

// Section scores (updated from CreateQA component)
const sectionScores = ref([0, 0, 0, 0, 0, 0, 0])

// Get chanUniqueid from route params/query
// TODO: Remove hardcoded fallback after testing
const chanUniqueid = route.params.chanUniqueid || route.query.chanUniqueid || '1761627874.2'

// Call data (will be populated from API)
const callData = reactive({
  chanUniqueid: chanUniqueid,
  callDateTime: '',
  reporter: '',
  direction: '',
  phone: '',
  extension: '',
  waitTime: '',
  hangupStatus: '',
  talkTime: ''
})

onMounted(async () => {
  if (!chanUniqueid) {
    error.value = 'No call ID provided'
    return
  }

  loading.value = true
  error.value = null

  try {
    // Fetch calls list
await callStore.listCalls()

// Get the call by uniqueid using getter
const call = callStore.getCallById(chanUniqueid)

if (!call) {
  error.value = 'Call not found'
  return
}

// Use calls_k from store
const k = callStore.calls_k

    // Get indexes from call_k (first element in array is the index)
    const chanTsIndex = parseInt(k.chan_ts[0])        // index 1 - Date
    const usrNameIndex = parseInt(k.usr_name[0])      // index 6 - Extension CID Name (reporter)
    const vectorIndex = parseInt(k.vector[0])         // index 25 - Direction
    const phoneIndex = parseInt(k.phone[0])           // index 4 - Phone
    const usrIndex = parseInt(k.usr[0])               // index 5 - Extension
    const waitTimeTotIndex = parseInt(k.wait_time_tot[0]) // index 10 - Wait Time
    const hangupStatusIndex = parseInt(k.hangup_status[0]) // index 14 - Hangup Status
    const talkTimeIndex = parseInt(k.talk_time[0])    // index 11 - Talk Time

    // Populate callData with mapped values from call array
    callData.chanUniqueid = chanUniqueid
    callData.callDateTime = call[chanTsIndex] || ''
    callData.reporter = call[usrNameIndex] || ''
    callData.direction = call[vectorIndex] || ''
    callData.phone = call[phoneIndex] || ''
    callData.extension = call[usrIndex] || ''
    callData.waitTime = formatTime(call[waitTimeTotIndex]) || ''
    callData.hangupStatus = call[hangupStatusIndex] || ''
    callData.talkTime = formatTime(call[talkTimeIndex]) || ''

  } catch (err) {
    console.error('Failed to load call data:', err)
    error.value = 'Failed to load call data. Please try again.'
  } finally {
    loading.value = false
  }
})

// Format time (seconds to mm:ss or hh:mm:ss)
const formatTime = (seconds) => {
  if (!seconds || seconds === '0') return '00:00'
  
  const sec = parseInt(seconds)
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const secs = sec % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Sections with scores for navigation
const sectionsWithScores = computed(() => [
  { name: 'Opening Phrase', score: sectionScores.value[0] },
  { name: 'Listening Skills', score: sectionScores.value[1] },
  { name: 'Communication', score: sectionScores.value[2] },
  { name: 'Proactive', score: sectionScores.value[3] },
  { name: 'Resolution', score: sectionScores.value[4] },
  { name: 'Hold Management', score: sectionScores.value[5] },
  { name: 'Call Closing', score: sectionScores.value[6] },
  { name: 'Submit', score: 0 }
])

// Navigation methods
const changeSection = (index) => {
  activeSection.value = index
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const nextSection = () => {
  if (activeSection.value < sectionsWithScores.value.length - 1) {
    activeSection.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousSection = () => {
  if (activeSection.value > 0) {
    activeSection.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Update section scores from CreateQA
const updateSectionScores = (scores) => {
  sectionScores.value = scores
}

// Handle QA submission
const handleQASubmitted = (result) => {
  console.log('QA Submitted:', result)
  
  if (result.success) {
    setTimeout(() => {
      router.push('/qa')
    }, 2000)
  }
}

// Go back
const goBack = () => {
  router.push('/qa')
}
</script>