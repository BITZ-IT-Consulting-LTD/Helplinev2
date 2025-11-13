<template>
  <div class="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
    <!-- Header -->
    <div class="px-4 py-3 bg-gray-900/60 border-b border-gray-700 flex items-center justify-between">
      <h2 class="text-sm font-bold text-gray-100 flex items-center gap-2">
        <i-mdi-phone-incoming class="w-5 h-5 text-emerald-400" />
        Callers Online
        <span class="px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-semibold border border-emerald-600/30">
          {{ onlineCount }}
        </span>
      </h2>
    </div>

    <!-- Table Container with Fixed Height -->
    <div class="overflow-hidden" style="height: 280px;">
      <!-- Table Headers -->
      <div class="bg-gray-900/40 border-b border-gray-700 px-4 py-2">
        <div class="grid gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wide"
             style="grid-template-columns: 1fr 120px 100px 140px;">
          <div>Caller Number</div>
          <div>Queue</div>
          <div>Wait Time</div>
          <div>Status</div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div 
        ref="tableContainer"
        class="overflow-y-auto"
        style="height: 236px; scroll-behavior: smooth;"
      >
        <!-- Empty State -->
        <div v-if="callers.length === 0" class="flex items-center justify-center h-full">
          <div class="text-gray-500 italic text-sm">No callers currently online</div>
        </div>

        <!-- Table Rows -->
        <div 
          v-for="caller in callers" 
          :key="caller.id"
          class="px-4 py-2 border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-200"
        >
          <div class="grid gap-4 text-sm items-center"
               style="grid-template-columns: 1fr 120px 100px 140px;">
            <div class="text-gray-300 font-medium">{{ caller.callerNumber || '--' }}</div>
            <div class="text-gray-400">{{ caller.vector || '--' }}</div>
            <div class="text-gray-400">{{ caller.waitTime || '--' }}</div>
            <div>
              <span :class="['text-xs font-semibold px-2 py-1 rounded-full', getStatusClass(caller.queueStatus)]">
                {{ caller.queueStatus || 'Unknown' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

export default {
  name: 'CallersTable',
  props: {
    callers: {
      type: Array,
      required: true,
      default: () => []
    },
    onlineCount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  setup(props) {
    const tableContainer = ref(null)
    let scrollInterval = null

    const setupAutoScroll = (container, scrollSpeed = 0.5, pauseDuration = 3000) => {
      if (!container) return null
      
      let direction = 1
      let isPaused = false
      
      return setInterval(() => {
        if (isPaused || !container) return
        
        const { scrollTop, scrollHeight, clientHeight } = container
        const maxScroll = scrollHeight - clientHeight
        
        if (maxScroll <= 0) return
        
        if (scrollTop >= maxScroll - 2) {
          direction = -1
          isPaused = true
          setTimeout(() => { isPaused = false }, pauseDuration)
        } else if (scrollTop <= 2) {
          direction = 1
          isPaused = true
          setTimeout(() => { isPaused = false }, pauseDuration)
        }
        
        container.scrollBy(0, direction * scrollSpeed)
      }, 30)
    }

    const startAutoScroll = () => {
      nextTick(() => {
        if (tableContainer.value) {
          scrollInterval = setupAutoScroll(tableContainer.value)
        }
      })
    }

    const stopAutoScroll = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval)
        scrollInterval = null
      }
    }

    watch(() => props.callers, () => {
      stopAutoScroll()
      setTimeout(startAutoScroll, 1000)
    })

    onMounted(() => {
      setTimeout(startAutoScroll, 2000)
    })

    onBeforeUnmount(() => {
      stopAutoScroll()
    })

    return {
      tableContainer
    }
  },
  methods: {
    getStatusClass(status) {
      const s = (status || 'Available').toString().toLowerCase()
      if (s.includes('on call')) return 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
      if (s.includes('ring')) return 'bg-amber-600/20 text-amber-400 border border-amber-600/30 animate-pulse'
      if (s.includes('queue')) return 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
      if (s.includes('available')) return 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
      if (s.includes('offline')) return 'bg-red-600/20 text-red-400 border border-red-600/30'
      return 'bg-gray-600/20 text-gray-400'
    }
  }
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}
</style>