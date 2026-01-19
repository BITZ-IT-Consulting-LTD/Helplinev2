<template>
  <div class="flex items-center justify-between gap-3 mb-6">
    <div>
      <h1 
        class="text-2xl font-black tracking-tight mb-1.5"
        :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'"
      >
        Create New Case
        <span 
          class="block w-12 h-0.5 rounded-full mt-1.5"
          :class="isDarkMode ? 'bg-amber-600' : 'bg-amber-700'"
        ></span>
      </h1>
      <p 
        class="text-sm mt-1.5"
        :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
      >
        {{ currentDescription }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue"

// Inject theme
const isDarkMode = inject('isDarkMode')

const props = defineProps({
  currentStep: {
    type: Number,
    default: 1
  },
  stepDescriptions: {
    type: Array,
    default: () => []
  }
})

const currentDescription = computed(() => {
  if (!props.stepDescriptions.length) return ""
  return props.stepDescriptions[props.currentStep - 1] || ""
})
</script>