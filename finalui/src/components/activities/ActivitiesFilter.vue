<template>
  <div class="w-full bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

      <!-- Case ID -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-300">Case ID</label>
        <input 
          type="text" 
          v-model="filters.caseId" 
          placeholder="Enter case ID"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Date Range From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-300">From Date</label>
        <input 
          type="date" 
          v-model="filters.dateFrom" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Date Range To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-300">To Date</label>
        <input 
          type="date" 
          v-model="filters.dateTo" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Created By -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-300">Created By</label>
        <input 
          type="text" 
          v-model="filters.createdBy" 
          placeholder="Enter name"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Assigned To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-300">Assigned To</label>
        <input 
          type="text" 
          v-model="filters.assignedTo" 
          placeholder="Enter name"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Source -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-300">Source</label>
        <select 
          v-model="filters.source" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="call">Call</option>
          <option value="walkin">Walk-In</option>
          <option value="safepal">SafePal</option>
        </select>
      </div>

    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        @click="applyFilters"
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
      >
        <i-mdi-filter class="w-5 h-5" />
        Apply Filters
      </button>
      
      <button
        @click="resetFilters"
        class="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 border border-gray-600"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['update:filters'])

const filters = reactive({
  dateFrom: '',
  dateTo: '',
  createdBy: '',
  assignedTo: '',
  caseId: '',
  source: '',
  action: 'notify'
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

  // Date range - using created_on field
  if (filters.dateFrom || filters.dateTo) {
    const fromTs = filters.dateFrom ? getUnixTimestamp(filters.dateFrom) : 0
    const toTs = filters.dateTo ? getEndOfDayTimestamp(filters.dateTo) : Math.floor(Date.now() / 1000)
    params.created_on = `${fromTs};${toTs}`
  }

  // Created By
  if (filters.createdBy) {
    params.created_by = filters.createdBy.trim()
  }

  // Assigned To
  if (filters.assignedTo) {
    params.assigned_to = filters.assignedTo.trim()
  }

  // Case ID
  if (filters.caseId) {
    params.case_id = filters.caseId.trim()
  }

  // Source
  if (filters.source) {
    params.src = filters.source
  }

  // Action
  if (filters.action) {
    params.action = filters.action
  }

  emit('update:filters', params)
}

function resetFilters() {
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.createdBy = ''
  filters.assignedTo = ''
  filters.caseId = ''
  filters.source = ''
  filters.action = 'notify'
  
  emit('update:filters', { action: 'notify' })
}
</script>