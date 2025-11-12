<template>
  <div class="flex items-center justify-between gap-3 mb-6">
    <div>
      <h1 class="text-2xl font-black tracking-tight text-gray-900 mb-1.5">
        Create New Case
        <span class="block w-12 h-0.5 bg-blue-600 rounded-full mt-1.5"></span>
      </h1>
      <p class="text-sm text-gray-600 mt-1.5">
        {{ currentDescription }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

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