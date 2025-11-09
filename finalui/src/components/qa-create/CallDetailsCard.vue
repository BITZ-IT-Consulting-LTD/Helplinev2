<template>
  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-xl p-6 sticky top-4 border-2 border-blue-200 dark:border-blue-800">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-200 dark:border-blue-800">
      <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Call Details
      </h2>
    </div>

    <!-- Date/Time & Reporter -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ formatDateTime(callData.callDateTime) }}
        </span>
        <span class="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-md">
          {{ callData.reporter || 'N/A' }}
        </span>
      </div>
    </div>

    <!-- Call Information -->
    <div class="space-y-3 mb-6">
      <div class="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
        <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">Direction:</span>
        <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
          {{ callData.direction || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
        <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">Phone:</span>
        <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
          {{ callData.phone || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
        <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">Extension:</span>
        <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
          {{ callData.extension || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
        <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">Wait Time:</span>
        <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
          {{ callData.waitTime || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
        <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">Hangup Status:</span>
        <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
          {{ callData.hangupStatus || 'N/A' }}
        </span>
      </div>

      <div class="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
        <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">Talk Time:</span>
        <div class="flex items-center gap-2">
          <button 
            @click="togglePlayback"
            class="w-7 h-7 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
          >
            <svg v-if="!isPlaying" width="10" height="10" viewBox="0 0 12 12" fill="white">
              <path d="M2 1.5v9l8-4.5z"/>
            </svg>
            <svg v-else width="10" height="10" viewBox="0 0 12 12" fill="white">
              <rect x="2" y="2" width="3" height="8"/>
              <rect x="7" y="2" width="3" height="8"/>
            </svg>
          </button>
          <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
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

const formatDateTime = (dateTime) => {
  if (!dateTime) return 'N/A'
  const date = new Date(dateTime)
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