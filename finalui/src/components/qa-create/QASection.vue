<template>
  <div 
    :class="[
      'mb-6 p-6 rounded-lg border',
      containerClass,
      isDarkMode 
        ? 'bg-gray-900/40 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    ]"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 
        class="text-xl font-bold"
        :class="isDarkMode ? 'text-blue-400' : 'text-amber-700'"
      >
        {{ title }}
      </h2>
      <span 
        v-if="badge" 
        class="px-3 py-1 text-xs font-bold rounded-full border"
        :class="isDarkMode 
          ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' 
          : 'bg-amber-100 text-amber-700 border-amber-300'"
      >
        {{ badge }}
      </span>
    </div>
    
    <p 
      v-if="description" 
      class="text-sm mb-4"
      :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
    >
      {{ description }}
    </p>

    <slot />
  </div>
</template>

<script setup>
import { inject } from 'vue'

const isDarkMode = inject('isDarkMode')

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  }
})
</script>