<template>
  <div class="w-full bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Case ID -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Case ID</label>
        <input 
          type="text" 
          v-model="filters.caseId" 
          placeholder="Enter case ID"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Date Range From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">From Date</label>
        <input 
          type="date" 
          v-model="filters.dateFrom" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Date Range To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">To Date</label>
        <input 
          type="date" 
          v-model="filters.dateTo" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Created By -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Created By</label>
        <input 
          type="text" 
          v-model="filters.createdBy" 
          placeholder="Enter name"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Source -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Source</label>
        <select v-model="filters.source" class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All</option>
          <option value="walkin">Walk-in</option>
          <option value="call">Call</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
          <option value="chat">Chat</option>
          <option value="whatsApp">WhatsApp</option>
          <option value="FACEBOOK">Facebook</option>
          <option value="TWITTER">Twitter</option>
          <option value="WENI">Weni</option>
          <option value="safepal">SafePal</option>
          <option value="ai">AI</option>
          <option value="aii">AII</option>
        </select>
      </div>

      <!-- Priority -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Priority</label>
        <select v-model="filters.priority" class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All</option>
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
        </select>
      </div>

      <!-- Status -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Status</label>
        <select v-model="filters.status" class="bg-gray-700 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All</option>
          <option value="1">Open</option>
          <option value="2">Closed</option>
        </select>
      </div>

    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-4">
      <button
        @click="applyFilters"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200 text-sm shadow-lg flex items-center gap-2 active:scale-95 active:shadow-md"
      >
        <i-mdi-filter class="w-4 h-4" />
        Apply Filters
      </button>
      
      <button
        @click="resetFilters"
        class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-all duration-200 text-sm shadow-lg flex items-center gap-2 active:scale-95 active:shadow-md"
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
  caseId: '',
  dateFrom: '',
  dateTo: '',
  createdBy: '',
  source: '',
  priority: '',
  status: ''
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

  // Case ID - using id field
  if (filters.caseId) {
    params.id = filters.caseId.trim()
  }

  // Date range - using created_on field
  if (filters.dateFrom || filters.dateTo) {
    const fromTs = filters.dateFrom ? getUnixTimestamp(filters.dateFrom) : 0
    const toTs = filters.dateTo ? getEndOfDayTimestamp(filters.dateTo) : Math.floor(Date.now() / 1000)
    params.created_on = `${fromTs};${toTs}`
  }

  // Created By - using created_by field
  if (filters.createdBy) {
    params.created_by = filters.createdBy.trim()
  }

  // Source - using src field
  if (filters.source) {
    params.src = filters.source
  }

  // Priority - using priority field
  if (filters.priority) {
    params.priority = filters.priority
  }

  // Status - using status field
  if (filters.status) {
    params.status = filters.status
  }

  emit('update:filters', params)
}

function resetFilters() {
  filters.caseId = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.createdBy = ''
  filters.source = ''
  filters.priority = ''
  filters.status = ''
  
  emit('update:filters', {})
}
</script>