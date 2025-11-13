<template>
  <div class="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
    <!-- Header -->
    <div class="px-4 py-3 bg-gray-900/60 border-b border-gray-700 flex items-center justify-between">
      <h2 class="text-sm font-bold text-gray-100 flex items-center gap-2">
        <i-mdi-account-group class="w-5 h-5 text-blue-400" />
        Counsellors Online
        <span class="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-600/30">
          {{ onlineCount }}
        </span>
      </h2>
    </div>

    <!-- Table Container with Fixed Height -->
    <div class="overflow-hidden" style="height: 280px;">
      <!-- Table Headers -->
      <div class="bg-gray-900/40 border-b border-gray-700 px-4 py-2">
        <div class="grid gap-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
             style="grid-template-columns: 60px 140px 90px 70px 70px 90px 120px 1fr;">
          <div>Ext.</div>
          <div>Name</div>
          <div>Caller</div>
          <div>Answered</div>
          <div>Missed</div>
          <div>Talk Time</div>
          <div>Status</div>
          <div>Duration</div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div 
        ref="tableContainer"
        class="overflow-y-auto"
        style="height: 236px; scroll-behavior: smooth;"
      >
        <!-- Empty State -->
        <div v-if="counsellors.length === 0" class="flex items-center justify-center h-full">
          <div class="text-gray-500 italic text-sm">No counsellors currently online</div>
        </div>

        <!-- Table Rows -->
        <div 
          v-for="counsellor in counsellors" 
          :key="counsellor.id"
          class="px-4 py-2 border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-200"
        >
          <div class="grid gap-3 text-sm items-center"
               style="grid-template-columns: 60px 140px 90px 70px 70px 90px 120px 1fr;">
            <div class="text-gray-300 font-medium">{{ counsellor.extension }}</div>
            <div class="text-gray-300 truncate">{{ counsellor.name }}</div>
            <div class="text-gray-400 truncate">{{ counsellor.caller || '--' }}</div>
            <div class="text-gray-300">{{ counsellor.answered || '0' }}</div>
            <div class="text-gray-300">{{ counsellor.missed || '0' }}</div>
            <div class="text-gray-400">{{ counsellor.talkTime || '--' }}</div>
            <div>
              <span :class="['text-xs font-semibold px-2 py-1 rounded-full', getStatusClass(counsellor.queueStatus)]">
                {{ counsellor.queueStatus || 'Offline' }}
              </span>
            </div>
            <div class="text-gray-400">{{ counsellor.duration || '--' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

export default {
  name: 'CounsellorsTable',
  props: {
    counsellors: {
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

    watch(() => props.counsellors, () => {
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