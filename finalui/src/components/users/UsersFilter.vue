<template>
  <div class="w-full bg-white rounded-lg p-4 shadow-sm border mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Username -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Username</label>
        <input 
          type="text" 
          v-model="filters.username" 
          placeholder="Enter username"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- First Name -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">First Name</label>
        <input 
          type="text" 
          v-model="filters.firstName" 
          placeholder="Enter first name"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Role -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Role</label>
        <input 
          type="text" 
          v-model="filters.role" 
          placeholder="Enter role"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Created By -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Created By</label>
        <input 
          type="text" 
          v-model="filters.createdBy" 
          placeholder="Enter creator name"
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Created Date From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Created From</label>
        <input 
          type="date" 
          v-model="filters.createdDateFrom" 
          class="border rounded px-3 py-2 text-sm"
        />
      </div>

      <!-- Created Date To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1">Created To</label>
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
  username: '',
  firstName: '',
  role: '',
  createdBy: '',
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

  // Username - using usn field
  if (filters.username) {
    params.usn = filters.username.trim()
  }

  // First Name - using contact_fname field
  if (filters.firstName) {
    params.contact_fname = filters.firstName.trim()
  }

  // Role - using role field
  if (filters.role) {
    params.role = filters.role.trim()
  }

  // Created By - using created_by field
  if (filters.createdBy) {
    params.created_by = filters.createdBy.trim()
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
  filters.username = ''
  filters.firstName = ''
  filters.role = ''
  filters.createdBy = ''
  filters.createdDateFrom = ''
  filters.createdDateTo = ''
  
  emit('update:filters', {})
}
</script>