<template>
  <div class="w-full bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Username -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Username</label>
        <input 
          type="text" 
          v-model="filters.username" 
          placeholder="Enter username"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- First Name -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">First Name</label>
        <input 
          type="text" 
          v-model="filters.firstName" 
          placeholder="Enter first name"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Role -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Role</label>
        <select 
          v-model="filters.role" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          <option value="1">Counsellor</option>
          <option value="2">Supervisor</option>
          <option value="3">Case Manager</option>
          <option value="4">Case Worker</option>
          <option value="5">Partner</option>
          <option value="6">Media Account</option>
          <option value="99">Administrator</option>
        </select>
      </div>

      <!-- Created By -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Created By</label>
        <input 
          type="text" 
          v-model="filters.createdBy" 
          placeholder="Enter creator name"
          class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Created Date From -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Created From</label>
        <input 
          type="date" 
          v-model="filters.createdDateFrom" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Created Date To -->
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-1 text-gray-300">Created To</label>
        <input 
          type="date" 
          v-model="filters.createdDateTo" 
          class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  // Role - using role field (now sends the role ID)
  if (filters.role) {
    params.role = filters.role
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