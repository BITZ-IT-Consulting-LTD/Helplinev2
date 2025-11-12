<template>
  <div class="w-full bg-white rounded-lg p-4 shadow-sm border mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Case ID -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Case ID</label>
        <input 
          type="text" 
          v-model="filters.caseId" 
          placeholder="Enter case ID"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

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

      <!-- Created By -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Created By</label>
        <input 
          type="text" 
          v-model="filters.createdBy" 
          placeholder="Enter name"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Source -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Source</label>
        <select v-model="filters.source" class="border rounded px-3 py-2 text-sm">
          <option value="">All</option>
          <option value="walkin">walkin</option>
          <option value="call">call</option>
          <option value="sms">sms</option>
          <option value="email">email</option>
          <option value="chat">chat</option>
          <option value="whatsApp">whatsApp</option>
          <option value="FACEBOOK">FACEBOOK</option>
          <option value="TWITTER">TWITTER</option>
          <option value="WENI">WENI</option>
          <option value="safepal">safepal</option>
          <option value="ai">ai</option>
          <option value="aii">aii</option>
        </select>
      </div>

      <!-- Priority -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Priority</label>
        <select v-model="filters.priority" class="border rounded px-3 py-2 text-sm">
          <option value="">All</option>
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
        </select>
      </div>

      <!-- Status -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Status</label>
        <select v-model="filters.status" class="border rounded px-3 py-2 text-sm">
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

  // Date range - using created_on field (assuming dt maps to created_on)
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