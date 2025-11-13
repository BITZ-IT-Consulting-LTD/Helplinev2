<template>
  <div class="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
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

          <!-- Comment field -->
          <QACommentField
            v-if="qaData.sections[activeSection].commentKey"
            v-model="formData[qaData.sections[activeSection].commentKey]"
            :label="qaData.sections[activeSection].commentLabel"
          />
        </QASection>
      </div>

      <!-- Submit Section -->
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
      <div class="flex items-center justify-between pt-6 border-t border-gray-700 mt-6">
        <button
          v-if="activeSection > 0"
          type="button"
          @click="previousSection"
          class="px-6 py-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg font-semibold hover:bg-gray-600 transition-all flex items-center gap-2"
        >
          <i-mdi-chevron-left class="w-5 h-5" />
          Previous
        </button>
        
        <div v-else></div>

        <button
          v-if="activeSection < qaData.sections.length"
          type="button"
          @click="nextSection"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2"
        >
          Next
          <i-mdi-chevron-right class="w-5 h-5" />
        </button>
        
        <button
          v-else
          type="submit"
          :disabled="qaStore.loading || !isFormValid"
          class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="qaStore.loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <i-mdi-check v-else class="w-5 h-5" />
          <span>{{ qaStore.loading ? 'Submitting...' : 'Submit QA' }}</span>
        </button>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="mt-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg">
        <p class="text-sm font-semibold text-green-400 flex items-center gap-2">
          <i-mdi-check-circle class="w-5 h-5" />
          {{ successMessage }}
        </p>
      </div>

      <div v-if="qaStore.error" class="mt-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
        <p class="text-sm font-semibold text-red-400 flex items-center gap-2">
          <i-mdi-alert-circle class="w-5 h-5" />
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

const formData = reactive({
  chan_uniqueid: '1761627874.2',
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

const calculateSectionScore = (sectionIndex) => {
  const section = qaData.sections[sectionIndex]
  const fields = section.fields
  
  let totalPoints = 0
  let maxPoints = fields.length
  
  fields.forEach(field => {
    const value = formData[field.key]
    if (value === '2') totalPoints += 1
    else if (value === '1') totalPoints += 0.5
  })
  
  return maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0
}

const sectionScores = computed(() => {
  return qaData.sections.map((_, index) => calculateSectionScore(index))
})

watch(sectionScores, (newScores) => {
  emit('section-scores-updated', newScores)
}, { deep: true })

const isFormValid = computed(() => {
  const ratingFields = qaData.sections.flatMap(s => s.fields.map(f => f.key))
  const allRatingsFilled = ratingFields.every(key => formData[key] !== '')
  const feedbackFilled = formData.feedback.trim() !== ''
  
  return allRatingsFilled && feedbackFilled
})

const nextSection = () => {
  emit('next-section')
}

const previousSection = () => {
  emit('previous-section')
}

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