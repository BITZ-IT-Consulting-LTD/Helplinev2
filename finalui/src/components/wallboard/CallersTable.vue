<template>
  <div class="h-[260px]">
    <div class="mb-2">
      <h2 class="text-sm font-semibold text-gray-800 m-0">
        Callers Online: {{ onlineCount }}
      </h2>
    </div>
    <div class="bg-white rounded-lg overflow-hidden shadow-sm h-[230px]">
      <div class="grid gap-2 px-2.5 py-2 bg-gray-50 font-semibold text-xs text-gray-700 uppercase tracking-wide flex-shrink-0"
           style="grid-template-columns: 140px 100px 100px 1fr">
        <div class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">Caller Number</div>
        <div class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">Queue</div>
        <div class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">Wait Time</div>
        <div class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">Status</div>
      </div>
      <div 
        ref="tableContainer"
        class="flex-1 overflow-y-auto overflow-x-hidden max-h-40 min-h-40"
        style="scroll-behavior: smooth; pointer-events: none;"
      >
        <div v-if="callers.length === 0" class="px-2 py-5 text-center h-40 flex items-center justify-center">
          <div class="text-gray-500 italic text-xs">
            No callers currently online
          </div>
        </div>
        <div 
          v-for="caller in callers" 
          :key="caller.id"
          class="grid gap-2 px-2.5 py-2 border-b border-gray-100 text-sm h-10 items-center font-medium"
          style="grid-template-columns: 140px 100px 100px 1fr"
        >
          <div class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">{{ caller.callerNumber || '--' }}</div>
          <div class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">{{ caller.vector || '--' }}</div>
          <div class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">{{ caller.waitTime || '--' }}</div>
          <div :class="['flex items-center overflow-hidden text-ellipsis whitespace-nowrap', getStatusClass(caller.queueStatus)]">
            {{ caller.queueStatus || 'Unknown' }}
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

    // Debug watch
    watch(() => props.callers, (newVal) => {
      console.log('CallersTable - callers changed:', newVal.length, 'callers')
    }, { immediate: true })

    const setupAutoScroll = (container, scrollSpeed = 0.8, pauseDuration = 2500) => {
      if (!container) return null
      
      let direction = 1
      let isPaused = false
      
      return setInterval(() => {
        if (isPaused || !container) return
        
        const { scrollTop, scrollHeight, clientHeight } = container
        const maxScroll = scrollHeight - clientHeight
        
        if (maxScroll <= 0) return
        
        if (scrollTop >= maxScroll - 3) {
          direction = -1
          isPaused = true
          setTimeout(() => { isPaused = false }, pauseDuration)
        } else if (scrollTop <= 3) {
          direction = 1
          isPaused = true
          setTimeout(() => { isPaused = false }, pauseDuration)
        }
        
        container.scrollBy(0, direction * scrollSpeed)
      }, 40)
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
      setTimeout(startAutoScroll, 800)
    })

    onMounted(() => {
      setTimeout(startAutoScroll, 1500)
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
      if (s.includes('on call')) return 'text-emerald-500 font-semibold'
      if (s.includes('ring')) return 'text-amber-500 font-semibold animate-blink'
      if (s.includes('queue')) return 'text-blue-500 font-semibold'
      if (s.includes('available')) return 'text-gray-500 font-medium'
      if (s.includes('offline')) return 'text-red-500 font-semibold'
      return 'text-gray-500'
    }
  }
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 1px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 225, 0.2);
  border-radius: 1px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-blink {
  animation: blink 1.5s ease-in-out infinite;
}
</style>