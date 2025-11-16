<template>
  <div class="bg-gray-800 rounded-lg shadow-xl p-6 sticky top-4 border border-gray-700">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
      <h2 class="text-xl font-bold text-gray-100 flex items-center gap-2">
        <i-mdi-phone class="w-5 h-5 text-blue-400" />
        Call Details
      </h2>
    </div>

    <!-- Date/Time & Reporter -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-medium text-gray-300">
          {{ formatDateTime(callData.callDateTime) }}
        </span>
        <span class="px-3 py-1 text-xs font-bold bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30">
          {{ callData.reporter || 'N/A' }}
        </span>
      </div>
    </div>

    <!-- Call Information -->
    <div class="space-y-3 mb-6">
      <div class="flex items-center justify-between py-2 px-3 bg-gray-900/60 rounded-lg">
        <span class="text-sm font-semibold text-blue-400">Direction:</span>
        <span class="text-sm font-bold text-gray-100">
          {{ callData.direction || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-gray-900/60 rounded-lg">
        <span class="text-sm font-semibold text-blue-400">Phone:</span>
        <span class="text-sm font-bold text-gray-100">
          {{ callData.phone || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-gray-900/60 rounded-lg">
        <span class="text-sm font-semibold text-blue-400">Extension:</span>
        <span class="text-sm font-bold text-gray-100">
          {{ callData.extension || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-gray-900/60 rounded-lg">
        <span class="text-sm font-semibold text-blue-400">Wait Time:</span>
        <span class="text-sm font-bold text-gray-100">
          {{ callData.waitTime || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-gray-900/60 rounded-lg">
        <span class="text-sm font-semibold text-blue-400">Hangup Status:</span>
        <span class="text-sm font-bold text-gray-100">
          {{ callData.hangupStatus || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-gray-900/60 rounded-lg">
        <span class="text-sm font-semibold text-blue-400">Talk Time:</span>
        <div class="flex items-center gap-2">
          <button 
            @click="togglePlayback"
            class="w-7 h-7 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg"
          >
            <i-mdi-play v-if="!isPlaying" class="w-4 h-4 text-white" />
            <i-mdi-pause v-else class="w-4 h-4 text-white" />
          </button>
          <span class="text-sm font-bold text-gray-100">
            {{ callData.talkTime || 'N/A' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  callData: {
    type: Object,
    default: () => ({
      callDateTime: '',
      reporter: '',
      direction: '',
      phone: '',
      extension: '',
      waitTime: '',
      hangupStatus: '',
      talkTime: ''
    })
  }
})

const isPlaying = ref(false)

const formatDateTime = (timestamp) => {
  if (!timestamp || timestamp === '0') return 'N/A'
  
  // Handle Unix timestamp (convert to milliseconds)
  const date = new Date(parseInt(timestamp) * 1000)
  
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const togglePlayback = () => {
  isPlaying.value = !isPlaying.value
  // Add actual playback logic here
}
</script>