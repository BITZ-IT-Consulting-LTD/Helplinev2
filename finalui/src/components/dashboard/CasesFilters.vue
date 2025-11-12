<template>
  <div class="w-full bg-white rounded-lg p-4 shadow-sm border mb-4 flex flex-wrap gap-4">

    <!-- Duration Filter -->
    <div class="flex flex-col">
      <label class="text-sm font-medium mb-1">Duration</label>
      <select v-model="filters.period" class="border rounded px-3 py-2 text-sm">
        <option value="all">All</option>
        <option value="today">Today</option>
        <option value="this_week">This Week</option>
        <option value="this_month">This Month</option>
        <option value="last_3_month">Last 3 Months</option>
        <option value="last_6_month">Last 6 Months</option>
        <option value="last_9_month">Last 9 Months</option>
        <option value="this_year">This Year</option>
      </select>
    </div>

    <!-- GBV Filter -->
    <div class="flex flex-col">
      <label class="text-sm font-medium mb-1">GBV</label>
      <select v-model="filters.gbv" class="border rounded px-3 py-2 text-sm">
        <option value="both">Both</option>
        <option value="vac">VAC</option>
        <option value="gbv">GBV</option>
      </select>
    </div>

    <!-- Source Filter -->
    <div class="flex flex-col">
      <label class="text-sm font-medium mb-1">Source</label>
      <select v-model="filters.source" class="border rounded px-3 py-2 text-sm">
        <option value="all">All</option>
        <option value="call">Call</option>
        <option value="sms">SMS</option>
        <option value="email">Email</option>
        <option value="walkin">Walk-in</option>
        <option value="social">Social</option>
      </select>
    </div>

    <!-- Apply Button -->
    <div class="flex items-end">
      <button
        @click="emitFilters"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
      >
        Apply
      </button>
    </div>

  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const emit = defineEmits(['update:filters'])

const filters = reactive({
  period: 'all',
  gbv: 'both',
  source: 'all'
})

// Helper function to get unix timestamp
function getUnixTimestamp(date) {
  return Math.floor(date.getTime() / 1000)
}

// Helper function to get start of day
function getStartOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// Helper function to get end of day
function getEndOfDay(date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

// Convert period to created_on timestamp range
function getPeriodTimestamp(period) {
  const now = new Date()
  
  switch(period) {
    case 'all':
      return null // No filter
    
    case 'today': {
      const start = getStartOfDay(now)
      const end = getEndOfDay(now)
      return `${getUnixTimestamp(start)};${getUnixTimestamp(end)}`
    }
    
    case 'this_week': {
      const start = getStartOfDay(now)
      start.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
      const end = getEndOfDay(now)
      return `${getUnixTimestamp(start)};${getUnixTimestamp(end)}`
    }
    
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      start.setHours(0, 0, 0, 0)
      const end = getEndOfDay(now)
      return `${getUnixTimestamp(start)};${getUnixTimestamp(end)}`
    }
    
    case 'last_3_month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      start.setHours(0, 0, 0, 0)
      const end = getEndOfDay(now)
      return `${getUnixTimestamp(start)};${getUnixTimestamp(end)}`
    }
    
    case 'last_6_month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      start.setHours(0, 0, 0, 0)
      const end = getEndOfDay(now)
      return `${getUnixTimestamp(start)};${getUnixTimestamp(end)}`
    }
    
    case 'last_9_month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 9, 1)
      start.setHours(0, 0, 0, 0)
      const end = getEndOfDay(now)
      return `${getUnixTimestamp(start)};${getUnixTimestamp(end)}`
    }
    
    case 'this_year': {
      const start = new Date(now.getFullYear(), 0, 1)
      start.setHours(0, 0, 0, 0)
      const end = getEndOfDay(now)
      return `${getUnixTimestamp(start)};${getUnixTimestamp(end)}`
    }
    
    default:
      return null
  }
}

// Convert GBV to gbv_related values
function getGbvRelated(gbv) {
  switch(gbv) {
    case 'both':
      return '1,2'
    case 'vac':
      return '1'
    case 'gbv':
      return '2'
    default:
      return '1,2'
  }
}

// Convert source to src values
function getSourceValue(source) {
  switch(source) {
    case 'all':
      return null // No filter
    case 'call':
      return 'call'
    case 'sms':
      return 'sms'
    case 'email':
      return 'email'
    case 'walkin':
      return 'walkin'
    case 'social':
      return 'twitter,facebook,whatsapp' // Adjust based on your actual social sources
    default:
      return null
  }
}

function emitFilters() {
  const backendFilters = {}
  
  // Add created_on if period is not 'all'
  const createdOn = getPeriodTimestamp(filters.period)
  if (createdOn) {
    backendFilters.created_on = createdOn
  }
  
  // Add gbv_related
  backendFilters.gbv_related = getGbvRelated(filters.gbv)
  
  // Add src if source is not 'all'
  const src = getSourceValue(filters.source)
  if (src) {
    backendFilters.src = src
  }
  
  emit('update:filters', backendFilters)
}

// Emit default filters on mount so widgets load immediately
onMounted(() => {
  emitFilters()
})
</script>