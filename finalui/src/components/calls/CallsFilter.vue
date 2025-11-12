<template>
  <div class="w-full bg-white rounded-lg p-4 shadow-sm border mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Date Range From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">From Date</label>
        <input 
          type="date" 
          v-model="filters.dateFrom" 
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Date Range To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">To Date</label>
        <input 
          type="date" 
          v-model="filters.dateTo" 
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Direction -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Direction</label>
        <select v-model="filters.direction" class="border rounded px-3 py-2 text-sm">
          <option value="">All</option>
          <option value="1">Inbound</option>
          <option value="2">Outbound</option>
        </select>
      </div>

      <!-- Phone Number -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Phone</label>
        <input 
          type="text" 
          v-model="filters.phone" 
          placeholder="Enter phone number"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Extension -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Extension</label>
        <input 
          type="text" 
          v-model="filters.extension" 
          placeholder="Enter extension"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Hangup Status -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Hangup Status</label>
        <select v-model="filters.hangupStatus" class="border rounded px-3 py-2 text-sm">
          <option value="">All</option>
          <option value="Answered">Answered</option>
          <option value="Abandoned">Abandoned</option>
          <option value="AgentDump">AgentDump</option>
          <option value="Missed">Missed</option>
          <option value="IVR">IVR</option>
          <option value="Flash">Flash</option>
          <option value="Busy">Busy</option>
          <option value="network-error">network-error</option>
          <option value="Voicemail">Voicemail</option>
          <option value="Consult">Consult</option>
          <option value="Transfer No Answer">Transfer No Answer</option>
          <option value="Transfer Unavailable">Transfer Unavailable</option>
          <option value="Transferred">Transferred</option>
        </select>
      </div>

      <!-- Hangup By -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Hangup By</label>
        <select v-model="filters.hangupBy" class="border rounded px-3 py-2 text-sm">
          <option value="">All</option>
          <option value="Customer">Customer</option>
          <option value="Extension">Extension</option>
          <option value="IVR">IVR</option>
          <option value="Network">Network</option>
        </select>
      </div>

      <!-- QA Score -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Min QA Score</label>
        <input 
          type="number" 
          v-model="filters.qaScore" 
          placeholder="0-100"
          min="0"
          max="100"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-4">
      <button
        @click="applyFilters"
        class="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 transition text-sm font-medium"
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

  // Hangup Status - using hangup_status field
  if (filters.hangupStatus) {
    params.hangup_status = filters.hangupStatus
  }

  // Hangup By - using hangup_reason field
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