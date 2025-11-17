<template>
  <div class="space-y-6">
    <div v-for="(group, date) in groupedQAs" :key="date" class="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
      <!-- Date Header -->
      <div class="bg-gray-900/60 px-6 py-3 border-b border-gray-700">
        <h3 class="text-sm font-semibold text-blue-400 flex items-center gap-2">
          <i-mdi-calendar class="w-4 h-4" />
          {{ date }}
        </h3>
      </div>

      <!-- QA Records List -->
      <div class="divide-y divide-gray-700">
        <div 
          v-for="qa in group" 
          :key="getFieldValue(qa, 'id')"
          class="p-6 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer"
          @click="viewQADetails(qa)"
        >
          <div class="flex items-start gap-4">
            <!-- Icon & Score -->
            <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex flex-col items-center justify-center border border-blue-600/30">
              <span class="text-2xl font-bold text-blue-400">{{ calculateScore(qa) }}%</span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 class="text-sm font-semibold text-gray-100">
                    QA #{{ getFieldValue(qa, 'id') }}
                  </h4>
                  <p class="text-xs text-gray-400 mt-1">
                    Call: {{ getFieldValue(qa, 'chan_uniqueid') }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">Evaluated on</p>
                  <p class="text-sm text-gray-300">{{ formatTimestamp(getFieldValue(qa, 'created_on')) }}</p>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Opening</p>
                  <p class="text-sm font-medium" :class="getRatingColor(getFieldValue(qa, 'opening_phrase'))">
                    {{ getRatingText(getFieldValue(qa, 'opening_phrase')) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Communication</p>
                  <p class="text-sm font-medium" :class="getRatingColor(getFieldValue(qa, 'courteous'))">
                    {{ getRatingText(getFieldValue(qa, 'courteous')) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Resolution</p>
                  <p class="text-sm font-medium" :class="getRatingColor(getFieldValue(qa, 'accuracy'))">
                    {{ getRatingText(getFieldValue(qa, 'accuracy')) }}
                  </p>
                </div>
              </div>

              <div v-if="getFieldValue(qa, 'feedback')" class="mt-3 pt-3 border-t border-gray-700">
                <p class="text-xs text-gray-500 mb-1">Feedback</p>
                <p class="text-sm text-gray-300 line-clamp-2">{{ getFieldValue(qa, 'feedback') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="Object.keys(groupedQAs).length === 0" class="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-12 text-center">
      <i-mdi-clipboard-check-outline class="w-16 h-16 mx-auto text-gray-600 mb-4" />
      <p class="text-gray-500">No QA records found</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  qas: {
    type: Array,
    default: () => []
  },
  qas_k: {
    type: Object,
    default: () => ({})
  }
})

// Helper to get field value from array
const getFieldValue = (qa, fieldName) => {
  const index = props.qas_k[fieldName]?.[0]
  return index !== undefined ? qa[index] : ''
}

// Group QAs by date
const groupedQAs = computed(() => {
  const groups = {}
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  props.qas.forEach(qa => {
    const timestamp = getFieldValue(qa, 'created_on')
    if (!timestamp || timestamp === '0') return

    const date = new Date(parseInt(timestamp) * 1000)
    let label

    if (date.toDateString() === today.toDateString()) {
      label = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday'
    } else {
      label = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    if (!groups[label]) groups[label] = []
    groups[label].push(qa)
  })

  return groups
})

// Calculate overall score
const calculateScore = (qa) => {
  const fields = [
    'opening_phrase', 'non_interrupting', 'empathy', 'paraphrasing',
    'courteous', 'grammar', 'nonhesitant', 'educative',
    'procedure_adherance', 'extra_mile_willingness', 'consults',
    'follows_up_on_case_updates', 'accuracy', 'confirms_client_satisfaction',
    'notifies_hold', 'updates_hold', 'call_closing_coutesy'
  ]

  let totalPoints = 0
  let maxPoints = fields.length

  fields.forEach(field => {
    const value = getFieldValue(qa, field)
    if (value === '2') totalPoints += 1
    else if (value === '1') totalPoints += 0.5
  })

  return maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0
}

// Get rating color class
const getRatingColor = (value) => {
  if (value === '2') return 'text-green-400'
  if (value === '1') return 'text-yellow-400'
  return 'text-red-400'
}

// Get rating text
const getRatingText = (value) => {
  if (value === '2') return 'Excellent'
  if (value === '1') return 'Average'
  if (value === '0') return 'Poor'
  return 'N/A'
}

// Format unix timestamp to readable date
const formatTimestamp = (timestamp) => {
  if (!timestamp || timestamp === '0') return '-'
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// View QA details
const viewQADetails = (qa) => {
  const qaId = getFieldValue(qa, 'id')
  console.log('Viewing QA details for:', qaId)
  // Navigate to QA details page if needed
  // router.push({ name: 'QADetails', params: { id: qaId } })
}
</script>