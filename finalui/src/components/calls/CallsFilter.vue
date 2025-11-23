<template>
  <div class="w-full bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Date Range From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">From Date</label>
        <input 
          type="date" 
          v-model="filters.dateFrom" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Date Range To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">To Date</label>
        <input 
          type="date" 
          v-model="filters.dateTo" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Direction -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Direction</label>
        <select v-model="filters.direction" class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All</option>
          <option value="1">Inbound</option>
          <option value="2">Outbound</option>
        </select>
      </div>

      <!-- Phone Number -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Phone</label>
        <input 
          type="text" 
          v-model="filters.phone" 
          placeholder="Enter phone number"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Extension -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Extension</label>
        <input 
          type="text" 
          v-model="filters.extension" 
          placeholder="Enter extension"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Hangup Status -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Hangup Status</label>
        <select v-model="filters.hangupStatus" class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All</option>
          <option value="answered">Answered</option>
          <option value="abandoned">Abandoned</option>
          <option value="dump">AgentDump</option>
          <option value="missed">Missed</option>
          <option value="ivr">IVR</option>
          <option value="noanswer">Flash</option>
          <option value="busy">Busy</option>
          <option value="networkerror">Network Error</option>
          <option value="voicemail">Voicemail</option>
          <option value="xfer_consult">Consult</option>
          <option value="xfer_noanswer">Transfer No Answer</option>
          <option value="xfer_offline">Transfer Unavailable</option>
          <option value="xfer_ok">Transferred</option>
          <option value="SCHED">Sched</option>
          <option value="Reattempt">Reattempt</option>
        </select>
      </div>

      <!-- Hangup By -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Hangup By</label>
        <select v-model="filters.hangupBy" class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All</option>
          <option value="phone">Customer</option>
          <option value="usr">Extension</option>
          <option value="ivr">IVR</option>
          <option value="net">Network</option>
        </select>
      </div>

      <!-- QA Score -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Min QA Score</label>
        <input 
          type="number" 
          v-model="filters.qaScore" 
          placeholder="0-100"
          min="0"
          max="100"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-4">
      <button
        @click="applyFilters"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2 active:scale-95"
      >
        <i-mdi-filter class="w-4 h-4" />
        Apply Filters
      </button>
      
      <button
        @click="resetFilters"
        class="bg-gray-700 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-600 flex items-center gap-2"
      >
        <i-mdi-refresh class="w-4 h-4" />
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineEmits } from 'vue'

const emit = defineEmits(['update:filters'])

const filters = reactive({
  dateFrom: '',
  dateTo: '',
  direction: '',
  phone: '',
  extension: '',
  hangupStatus: '',
  hangupBy: '',
  qaScore: ''
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

  // Date range - using chan_ts field
  if (filters.dateFrom || filters.dateTo) {
    const fromTs = filters.dateFrom ? getUnixTimestamp(filters.dateFrom) : 0
    const toTs = filters.dateTo ? getEndOfDayTimestamp(filters.dateTo) : Math.floor(Date.now() / 1000)
    params.chan_ts = `${fromTs};${toTs}`
  }

  // Direction - using vector field
  if (filters.direction) {
    params.vector = filters.direction
  }

  // Phone - using phone field
  if (filters.phone) {
    params.phone = filters.phone.trim()
  }

  // Extension - using usr field
  if (filters.extension) {
    params.usr = filters.extension.trim()
  }

  // Hangup Status - using hangup_status field (backend keys)
  if (filters.hangupStatus) {
    params.hangup_status = filters.hangupStatus
  }

  // Hangup By - using hangup_reason field (backend keys)
  if (filters.hangupBy) {
    params.hangup_reason = filters.hangupBy
  }

  // QA Score - using qa_score field (minimum score)
  if (filters.qaScore) {
    params.qa_score = filters.qaScore
  }

  emit('update:filters', params)
}

function resetFilters() {
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.direction = ''
  filters.phone = ''
  filters.extension = ''
  filters.hangupStatus = ''
  filters.hangupBy = ''
  filters.qaScore = ''
  
  emit('update:filters', {})
}
</script>