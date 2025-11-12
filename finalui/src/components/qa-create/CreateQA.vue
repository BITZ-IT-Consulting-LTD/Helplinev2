<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
    <form @submit.prevent="handleSubmit">
      <!-- Active Section Display -->
      <div v-if="activeSection < qaData.sections.length" class="animate-fadeIn">
        <QASection :title="qaData.sections[activeSection].title">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <QARatingField
              v-for="field in qaData.sections[activeSection].fields"
              :key="field.key"
              v-model="formData[field.key]"
              :label="field.label"
              :name="field.key"
              required
            />
          </div>

          <!-- Comment field if section has one -->
          <QACommentField
            v-if="qaData.sections[activeSection].commentKey"
            v-model="formData[qaData.sections[activeSection].commentKey]"
            :label="qaData.sections[activeSection].commentLabel"
          />
        </QASection>
      </div>

      <!-- Submit Section (Feedback Only) -->
      <div v-else class="animate-fadeIn">
        <QASection title="Overall Feedback & Submit">
          <QACommentField
            v-model="formData.feedback"
            label="Overall Feedback *"
            :rows="6"
            placeholder="Enter comprehensive feedback about the call quality..."
            required
          />
        </QASection>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between pt-6 border-t-2 border-gray-200 dark:border-gray-700 mt-6">
        <button
          v-if="activeSection > 0"
          type="button"
          @click="previousSection"
          class="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11 1l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          Previous
        </button>
        
        <div v-else></div>

        <button
          v-if="activeSection < qaData.sections.length"
          type="button"
          @click="nextSection"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg flex items-center gap-2"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 1l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
        
        <button
          v-else
          type="submit"
          :disabled="qaStore.loading || !isFormValid"
          class="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="qaStore.loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <svg v-else width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
          <span>{{ qaStore.loading ? 'Submitting...' : 'Submit QA' }}</span>
        </button>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 rounded-lg">
        <p class="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          {{ successMessage }}
        </p>
      </div>

      <div v-if="qaStore.error" class="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-500 rounded-lg">
        <p class="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          {{ qaStore.error }}
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useQAStore } from '@/stores/qas'
import QASection from './QASection.vue'
import QARatingField from './QARatingField.vue'
import QACommentField from './QACommentField.vue'

const props = defineProps({
  activeSection: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['qa-submitted', 'section-scores-updated'])

const qaStore = useQAStore()
const successMessage = ref('')

// QA Data Structure with all sections
const qaData = reactive({
  sections: [
    {
      title: 'Opening Phrase',
      fields: [{ key: 'opening_phrase', label: 'Opening Phrase Rating' }],
      commentKey: 'opening_phrase_comments',
      commentLabel: 'Opening Phrase Comments'
    },
    {
      title: 'Listening Skills',
      fields: [
        { key: 'non_interrupting', label: 'Non Interrupting' },
        { key: 'empathy', label: 'Empathy' },
        { key: 'paraphrasing', label: 'Paraphrasing' }
      ],
      commentKey: 'listening_comments',
      commentLabel: 'Listening Comments'
    },
    {
      title: 'Communication Skills',
      fields: [
        { key: 'courteous', label: 'Courteous' },
        { key: 'grammar', label: 'Grammar' },
        { key: 'nonhesitant', label: 'Non Hesitant' },
        { key: 'educative', label: 'Educative' }
      ],
      commentKey: null,
      commentLabel: null
    },
    {
      title: 'Proactive Approach',
      fields: [
        { key: 'procedure_adherance', label: 'Procedure Adherence' },
        { key: 'extra_mile_willingness', label: 'Extra Mile Willingness' },
        { key: 'consults', label: 'Consults' },
        { key: 'follows_up_on_case_updates', label: 'Follows Up On Case Updates' }
      ],
      commentKey: 'pro_active_comments',
      commentLabel: 'Proactive Comments'
    },
    {
      title: 'Resolution',
      fields: [
        { key: 'accuracy', label: 'Accuracy' },
        { key: 'confirms_client_satisfaction', label: 'Confirms Client Satisfaction' }
      ],
      commentKey: 'resolution_comments',
      commentLabel: 'Resolution Comments'
    },
    {
      title: 'Hold Management',
      fields: [
        { key: 'notifies_hold', label: 'Notifies Hold' },
        { key: 'updates_hold', label: 'Updates Hold' }
      ],
      commentKey: 'hold_comments',
      commentLabel: 'Hold Comments'
    },
    {
      title: 'Call Closing',
      fields: [{ key: 'call_closing_coutesy', label: 'Call Closing Courtesy' }],
      commentKey: 'call_closing_comments',
      commentLabel: 'Call Closing Comments'
    }
  ]
})

// Form data - empty by default
const formData = reactive({
  chan_uniqueid: '1761627874.2', // Hardcoded for now
  opening_phrase: '',
  opening_phrase_comments: '',
  non_interrupting: '',
  empathy: '',
  paraphrasing: '',
  listening_comments: '',
  courteous: '',
  grammar: '',
  nonhesitant: '',
  educative: '',
  procedure_adherance: '',
  extra_mile_willingness: '',
  consults: '',
  follows_up_on_case_updates: '',
  pro_active_comments: '',
  accuracy: '',
  confirms_client_satisfaction: '',
  resolution_comments: '',
  notifies_hold: '',
  updates_hold: '',
  hold_comments: '',
  call_closing_coutesy: '',
  call_closing_comments: '',
  feedback: ''
})

// Calculate score for a section (Yes=1, Partially=0.5, No=0)
const calculateSectionScore = (sectionIndex) => {
  const section = qaData.sections[sectionIndex]
  const fields = section.fields
  
  let totalPoints = 0
  let maxPoints = fields.length
  
  fields.forEach(field => {
    const value = formData[field.key]
    if (value === '2') totalPoints += 1 // Yes
    else if (value === '1') totalPoints += 0.5 // Partially
    // No (0) adds 0 points
  })
  
  return maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0
}

// Calculate all section scores
const sectionScores = computed(() => {
  return qaData.sections.map((_, index) => calculateSectionScore(index))
})

// Watch scores and emit updates
watch(sectionScores, (newScores) => {
  emit('section-scores-updated', newScores)
}, { deep: true })

// Form validation
const isFormValid = computed(() => {
  // Check all rating fields are filled
  const ratingFields = qaData.sections.flatMap(s => s.fields.map(f => f.key))
  const allRatingsFilled = ratingFields.every(key => formData[key] !== '')
  
  // Check feedback is filled
  const feedbackFilled = formData.feedback.trim() !== ''
  
  return allRatingsFilled && feedbackFilled
})

// Navigation
const nextSection = () => {
  emit('next-section')
}

const previousSection = () => {
  emit('previous-section')
}

// Submit handler
const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert('Please fill in all required fields (all ratings and feedback)')
    return
  }

  try {
    console.log('Submitting QA with payload:', formData)
    
    const response = await qaStore.createQA(formData)
    
    console.log('QA created successfully:', response)
    successMessage.value = 'QA submitted successfully!'
    
    emit('qa-submitted', { success: true, data: response })
    
  } catch (error) {
    console.error('Failed to create QA:', error)
    emit('qa-submitted', { success: false, error })
  }
}

// Expose section scores for parent component
defineExpose({
  sectionScores
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>