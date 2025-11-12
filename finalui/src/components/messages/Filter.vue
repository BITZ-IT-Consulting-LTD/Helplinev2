<template>
  <div class="flex flex-wrap gap-3 mb-6">
    <button
      v-for="platform in channelFilters"
      :key="platform.id"
      :class="[
        'px-5 py-2.5 rounded-full font-medium transition-all duration-200 text-sm',
        activePlatform === platform.id 
          ? 'bg-[#0284C7] text-white shadow-sm' 
          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#0891B2] hover:text-[#0891B2]'
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