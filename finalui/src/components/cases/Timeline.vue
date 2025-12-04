<template>
  <div 
    class="relative border-l-2 pl-6 space-y-6"
    :class="isDarkMode ? 'border-gray-700' : 'border-gray-300'"
  >
    <div
      v-for="caseItem in cases"
      :key="cases_k.id ? caseItem[cases_k.id[0]] : caseItem.id"
      @click="selectCase(caseItem)"
      class="relative shadow-xl rounded-lg p-6 border cursor-pointer transition-all duration-200"
      :class="isDarkMode 
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50' 
        : 'bg-white border-gray-200 hover:bg-gray-50'"
    >
      <!-- Timeline Dot -->
      <div 
        class="absolute -left-[1.875rem] top-6 w-6 h-6 rounded-full border-4"
        :class="isDarkMode 
          ? 'bg-blue-500 border-gray-900' 
          : 'bg-amber-600 border-gray-50'"
      ></div>

      <!-- Case Info -->
      <h3 
        class="text-lg font-semibold"
        :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'"
      >
        Case {{ getValue(caseItem, 'id') }}
      </h3>
      <p 
        class="text-sm mt-1"
        :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
      >
        Created on: {{ formatDate(getValue(caseItem, 'dt')) }}
      </p>
      <p 
        class="text-sm mt-1"
        :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
      >
        Created by: {{ getValue(caseItem, 'created_by') || 'N/A' }}
      </p>

      <!-- Labels -->
      <div class="flex flex-wrap gap-2 mt-4">
        <!-- Priority -->
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-semibold uppercase border',
            getPriorityClass(getValue(caseItem, 'priority'))
          ]"
        >
          Priority: {{ getPriorityText(getValue(caseItem, 'priority')) }}
        </span>

        <!-- Status -->
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-semibold uppercase border',
            getStatusClass(getValue(caseItem, 'status'))
          ]"
        >
          Status: {{ getStatusText(getValue(caseItem, 'status')) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  cases: Array,
  cases_k: Object,
})

const emit = defineEmits(['select-case'])

// Inject theme
const isDarkMode = inject('isDarkMode')

// ✅ FIXED: Emit case ID only
const selectCase = (caseItem) => {
  const caseId = getValue(caseItem, 'id')
  console.log('📤 Timeline emitting case ID:', caseId)
  emit('select-case', caseId)
}

// Map the array-style structure
const getValue = (caseItem, key) => {
  if (!props.cases_k?.[key]) return null
  return caseItem[props.cases_k[key][0]]
}

// Format timestamps nicely
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const value =
    timestamp < 10000000000 ? timestamp * 1000 : timestamp * 3600 * 1000
  return new Date(value).toLocaleString()
}

// --- Priority ---
const getPriorityClass = (priority) => {
  switch (String(priority)) {
    case '3':
      return isDarkMode.value
        ? 'bg-red-600/20 text-red-400 border-red-600/30'
        : 'bg-red-100 text-red-700 border-red-300'
    case '2':
      return isDarkMode.value
        ? 'bg-amber-600/20 text-amber-400 border-amber-600/30'
        : 'bg-amber-100 text-amber-700 border-amber-300'
    case '1':
    default:
      return isDarkMode.value
        ? 'bg-green-600/20 text-green-400 border-green-600/30'
        : 'bg-green-100 text-green-700 border-green-300'
  }
}

const getPriorityText = (priority) => {
  switch (String(priority)) {
    case '3':
      return 'High'
    case '2':
      return 'Medium'
    case '1':
      return 'Low'
    default:
      return 'Unknown'
  }
}

// --- Status ---
const getStatusClass = (status) => {
  switch (String(status)) {
    case '2':
      return isDarkMode.value
        ? 'bg-green-600/20 text-green-400 border-green-600/30'
        : 'bg-green-100 text-green-700 border-green-300'
    case '1':
    default:
      return isDarkMode.value
        ? 'bg-amber-600/20 text-amber-400 border-amber-600/30'
        : 'bg-amber-100 text-amber-700 border-amber-300'
  }
}

const getStatusText = (status) => {
  switch (String(status)) {
    case '2':
      return 'Closed'
    case '1':
      return 'Open'
    default:
      return 'Unknown'
  }
}
</script>