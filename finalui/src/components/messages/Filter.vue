<template>
  <div class="flex space-x-2 mb-4">
    <button
      v-for="platform in channelFilters"
      :key="platform.id"
      :class="[
        'px-4 py-2 rounded-full border transition',
        activePlatform === platform.id 
          ? 'bg-blue-500 text-white border-blue-500' 
          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
      ]"
      @click="$emit('update:activePlatform', platform.id)"
    >
      {{ platform.name }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  channelFilters: {
    type: Array,
    required: true
  },
  activePlatform: {
    type: String,
    required: true
  }
})

defineEmits(['update:activePlatform'])
</script>