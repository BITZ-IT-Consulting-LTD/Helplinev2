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

      <!-- ROW 2: Main Content (Two Columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CallDetailsCard from '@/components/qa-create/CallDetailsCard.vue'
import QASectionNav from '@/components/qa-create/QASectionNav.vue'
import CreateQA from '@/components/qa-create/CreateQA.vue'

const router = useRouter()
const route = useRoute()
const createQARef = ref(null)

// Active section state
const activeSection = ref(0)

// Section scores (updated from CreateQA component)
const sectionScores = ref([0, 0, 0, 0, 0, 0, 0])

// Call data from route params or backend (empty by default)
const callData = reactive({
  chanUniqueid: route.params.chanUniqueid || route.query.chanUniqueid || '',
  callDateTime: route.params.callDateTime || route.query.callDateTime || '',
  reporter: route.params.reporter || route.query.reporter || '',
  direction: route.params.direction || route.query.direction || '',
  phone: route.params.phone || route.query.phone || '',
  extension: route.params.extension || route.query.extension || '',
  waitTime: route.params.waitTime || route.query.waitTime || '',
  hangupStatus: route.params.hangupStatus || route.query.hangupStatus || '',
  talkTime: route.params.talkTime || route.query.talkTime || ''
})

// Sections with scores for navigation
const sectionsWithScores = computed(() => [
  { name: 'Opening Phrase', score: sectionScores.value[0] },
  { name: 'Listening Skills', score: sectionScores.value[1] },
  { name: 'Communication', score: sectionScores.value[2] },
  { name: 'Proactive', score: sectionScores.value[3] },
  { name: 'Resolution', score: sectionScores.value[4] },
  { name: 'Hold Management', score: sectionScores.value[5] },
  { name: 'Call Closing', score: sectionScores.value[6] },
  { name: 'Submit', score: 0 } // Submit section (no score, just feedback)
])

// Navigation methods
const changeSection = (index) => {
  activeSection.value = index
  // Smooth scroll to top of form
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
    // Show success and redirect
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