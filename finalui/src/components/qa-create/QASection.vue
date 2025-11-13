<template>
  <div :class="['mb-6 p-6 bg-gray-900/40 rounded-lg border border-gray-700', containerClass]">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-400">
        {{ title }}
      </h2>
      <span v-if="badge" class="px-3 py-1 text-xs font-bold bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30">
        {{ badge }}
      </span>
    </div>
    
    <p v-if="description" class="text-sm text-gray-400 mb-4">
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