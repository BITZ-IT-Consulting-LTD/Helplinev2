<template>
  <div class="w-full bg-white rounded-lg p-4 shadow-sm border mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Call Date From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Call Date From</label>
        <input 
          type="date" 
          v-model="filters.callDateFrom" 
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Call Date To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Call Date To</label>
        <input 
          type="date" 
          v-model="filters.callDateTo" 
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- User -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">User</label>
        <input 
          type="text" 
          v-model="filters.user" 
          placeholder="Enter user name"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Supervisor -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Supervisor</label>
        <input 
          type="text" 
          v-model="filters.supervisor" 
          placeholder="Enter supervisor name"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Minimum Total Score -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Min Total Score (%)</label>
        <input 
          type="number" 
          v-model="filters.minScore" 
          placeholder="0-100"
          min="0"
          max="100"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Created Date From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Created Date From</label>
        <input 
          type="date" 
          v-model="filters.createdDateFrom" 
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Created Date To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Created Date To</label>
        <input 
          type="date" 
          v-model="filters.createdDateTo" 
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-4">
      <button
        @click="applyFilters"
        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
      >
        Apply Filters
      </button>
      
      <button
        @click="resetFilters"
        class="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition text-sm font-medium"
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