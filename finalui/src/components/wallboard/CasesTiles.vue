<template>
  <div class="h-full p-3">
    <h3 class="text-sm font-semibold text-gray-700 mb-2">Cases Overview</h3>
    <div v-if="!tiles || tiles.length === 0" class="flex items-center justify-center h-full bg-white rounded-lg shadow">
      <div class="text-gray-400 text-sm">No case data available</div>
    </div>
    <div v-else class="grid grid-cols-2 grid-rows-3 gap-3 h-full">
      <div
        v-for="tile in tiles"
        :key="tile.id"
        class="bg-white rounded-lg p-4 shadow-sm relative overflow-hidden flex items-center justify-center"
      >
        <div 
          :class="['absolute top-0 left-0 right-0 h-0.5 opacity-80', getAccentClass(tile.variant)]"
        ></div>
        
        <div class="flex flex-col gap-1 text-center items-center justify-center w-full h-full">
          <div 
            v-if="tile.value" 
            :class="['text-3xl font-bold leading-none mb-1', getValueColorClass(tile.variant)]"
          >
            {{ tile.value }}
          </div>
          <div class="text-xs font-semibold uppercase tracking-wide opacity-90 leading-tight text-center text-white">
            {{ tile.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CasesTiles',
  props: {
    tiles: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  watch: {
    tiles: {
      handler(newVal) {
        console.log('CasesTiles - tiles changed:', newVal)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getValueColorClass(variant) {
      const colorMap = {
        'c-blue': 'text-blue-500',
        'c-amber': 'text-amber-500',
        'c-red': 'text-red-500',
        'c-green': 'text-emerald-500',
        'c-black': 'text-gray-800'
      }
      return colorMap[variant] || 'text-gray-800'
    },
    getAccentClass(variant) {
      const accentMap = {
        'c-blue': 'bg-gradient-to-r from-blue-500 to-blue-400',
        'c-amber': 'bg-gradient-to-r from-amber-500 to-amber-400',
        'c-red': 'bg-gradient-to-r from-red-500 to-red-400',
        'c-green': 'bg-gradient-to-r from-emerald-500 to-emerald-400',
        'c-black': 'bg-gradient-to-r from-gray-800 to-gray-700'
      }
      return accentMap[variant] || 'bg-gray-800'
    }
  }
}
</script>

<style scoped>
@keyframes tileUpdate {
  0% { transform: scale(1); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

.bg-white {
  animation: tileUpdate 0.2s ease-in-out;
}
</style>