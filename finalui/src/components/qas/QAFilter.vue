<template>
  <div class="w-full bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Call Date From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Call Date From</label>
        <input 
          type="date" 
          v-model="filters.callDateFrom" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Call Date To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Call Date To</label>
        <input 
          type="date" 
          v-model="filters.callDateTo" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- User -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">User</label>
        <input 
          type="text" 
          v-model="filters.user" 
          placeholder="Enter user name"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Supervisor -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Supervisor</label>
        <input 
          type="text" 
          v-model="filters.supervisor" 
          placeholder="Enter supervisor name"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Minimum Total Score -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Min Total Score (%)</label>
        <input 
          type="number" 
          v-model="filters.minScore" 
          placeholder="0-100"
          min="0"
          max="100"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Created Date From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Created Date From</label>
        <input 
          type="date" 
          v-model="filters.createdDateFrom" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Created Date To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Created Date To</label>
        <input 
          type="date" 
          v-model="filters.createdDateTo" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-4">
      <button
        @click="applyFilters"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
      >
        <i-mdi-filter class="w-4 h-4" />
        Apply Filters
      </button>
      
      <button
        @click="resetFilters"
        class="bg-gray-700 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-600"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineEmits } from 'vue'

const emit = defineEmits(['update:filters'])

const filters = reactive({
  callDateFrom: '',
  callDateTo: '',
  user: '',
  supervisor: '',
  minScore: '',
  createdDateFrom: '',
  createdDateTo: ''
})

// Helper to get unix timestamp from date string
function getUnixTimestamp(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  date.setHours(0, 0, 0, 0)
  return Math.floor(date.getTime() / 1000)
}

// Helper to get end of day timestamp
function getEndOfDayTimestamp(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  date.setHours(23, 59, 59, 999)
  return Math.floor(date.getTime() / 1000)
}

function applyFilters() {
  const params = {}

  // Call Date Range - using chan_chan_ts field
  if (filters.callDateFrom || filters.callDateTo) {
    const fromTs = filters.callDateFrom ? getUnixTimestamp(filters.callDateFrom) : 0
    const toTs = filters.callDateTo ? getEndOfDayTimestamp(filters.callDateTo) : Math.floor(Date.now() / 1000)
    params.chan_chan_ts = `${fromTs};${toTs}`
  }

  // User - using chan_user_name field
  if (filters.user) {
    params.chan_user_name = filters.user.trim()
  }

  // Supervisor - using created_by field
  if (filters.supervisor) {
    params.created_by = filters.supervisor.trim()
  }

  // Minimum Total Score - using total_score_p field
  if (filters.minScore) {
    params.total_score_p = filters.minScore
  }

  // Created Date Range - using created_on field
  if (filters.createdDateFrom || filters.createdDateTo) {
    const fromTs = filters.createdDateFrom ? getUnixTimestamp(filters.createdDateFrom) : 0
    const toTs = filters.createdDateTo ? getEndOfDayTimestamp(filters.createdDateTo) : Math.floor(Date.now() / 1000)
    params.created_on = `${fromTs};${toTs}`
  }

  emit('update:filters', params)
}

function resetFilters() {
  filters.callDateFrom = ''
  filters.callDateTo = ''
  filters.user = ''
  filters.supervisor = ''
  filters.minScore = ''
  filters.createdDateFrom = ''
  filters.createdDateTo = ''
  
  emit('update:filters', {})
}
</script>