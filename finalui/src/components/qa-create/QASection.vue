<template>
  <div :class="['mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border-2 border-blue-200 dark:border-blue-800 shadow-lg', containerClass]">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {{ title }}
      </h2>
      <span v-if="badge" class="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-md">
        {{ badge }}
      </span>
    </div>
    
    <p v-if="description" class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {{ description }}
    </p>

    <slot />
  </div>
</template>

<script setup>
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