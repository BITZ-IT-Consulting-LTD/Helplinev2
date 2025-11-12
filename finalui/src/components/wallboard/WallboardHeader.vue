<template>
  <div class="flex justify-between items-center pt-2 pb-1.5 border-b border-gray-200 h-[60px]">
    <div class="flex-1 min-w-0">
      <h1 class="text-2xl font-bold text-gray-800 m-0 mb-0.5 leading-tight tracking-tight">
        Helpline Wallboard
      </h1>
      <p class="text-gray-500 m-0 text-xs leading-tight font-normal">
        Real-time counselling and support
      </p>
    </div>
    <div class="flex items-center gap-3 flex-shrink-0">
      <div class="flex items-center gap-1.5 text-xs text-gray-700 px-2 py-1 bg-gray-50 rounded-lg min-w-[120px] h-7">
        <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', dotClass]"></span>
        <span class="font-semibold whitespace-nowrap">{{ connectionLabel }}</span>
        <small v-if="lastUpdate" class="text-gray-400 text-[0.65rem] whitespace-nowrap ml-auto">
          {{ lastUpdate }}
        </small>
      </div>
      <button 
        class="p-1.5 bg-gray-100 rounded-md cursor-pointer flex items-center justify-center w-8 h-8 border border-gray-200 hover:bg-gray-200"
        @click="$emit('toggle-theme')" 
        :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <span class="text-sm">{{ isDarkMode ? '☀️' : '🌙' }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WallboardHeader',
  props: {
    connectionStatus: {
      type: String,
      required: true
    },
    connectionLabel: {
      type: String,
      required: true
    },
    lastUpdate: {
      type: String,
      default: null
    },
    isDarkMode: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggle-theme'],
  computed: {
    dotClass() {
      if (this.connectionStatus === 'on') return 'bg-emerald-500 animate-pulse-dot'
      if (this.connectionStatus === 'connecting') return 'bg-amber-500 animate-blink-dot'
      if (this.connectionStatus === 'off') return 'bg-red-500'
      return 'bg-gray-500'
    }
  }
}
</script>

<style scoped>
@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes blink-dot {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.4; }
}

.animate-pulse-dot {
  animation: pulse-dot 2s infinite;
  box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
}

.animate-blink-dot {
  animation: blink-dot 1s infinite;
  box-shadow: 0 0 4px rgba(245, 158, 11, 0.4);
}

.bg-red-500 {
  box-shadow: 0 0 4px rgba(239, 68, 68, 0.4);
}
</style>