<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="(section, index) in sections"
        :key="index"
        @click="$emit('change-section', index)"
        :class="[
          'px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2',
          activeSection === index 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        <span>{{ section.name }}</span>
        <span 
          v-if="index < sections.length - 1"
          :class="[
            'px-2 py-0.5 rounded-full text-xs font-bold',
            getScoreColor(section.score)
          ]"
        >
          {{ section.score }}%
        </span>
      </button>

      <!-- Submit Section (Last) -->
      <button
        @click="$emit('change-section', sections.length - 1)"
        :class="[
          'px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 flex items-center gap-2',
          activeSection === sections.length - 1
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
            : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600'
        ]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg>
        <span>Submit</span>
        <span class="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
          Total: {{ totalScore }}%
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sections: {
    type: Array,
    required: true
  },
  activeSection: {
    type: Number,
    default: 0
  }
})

defineEmits(['change-section'])

const totalScore = computed(() => {
  const scores = props.sections.slice(0, -1).map(s => s.score)
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
  return Math.round(average)
})

const getScoreColor = (score) => {
  if (score >= 90) return 'bg-green-500 text-white'
  if (score >= 75) return 'bg-blue-500 text-white'
  if (score >= 50) return 'bg-yellow-500 text-white'
  return 'bg-red-500 text-white'
}
</script>