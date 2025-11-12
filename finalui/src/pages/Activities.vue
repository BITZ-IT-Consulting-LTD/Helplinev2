<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Notification Activities</h1>

    <!-- Filter Section -->
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

        <!-- Assigned To -->
        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1">Assigned To</label>
          <input 
            type="text" 
            v-model="filters.assignedTo" 
            placeholder="Enter name"
            class="border rounded px-3 py-2 text-sm"
          />
        </div>

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

    <!-- Stats Summary -->
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Total Activities: <span class="font-semibold text-lg">{{ activitiesStore.activityCount }}</span>
          </p>
        </div>
        
        <div class="flex gap-2">
          <button 
            @click="refreshActivities"
            :disabled="activitiesStore.loading"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
          >
            Refresh
          </button>
          
          <button 
            @click="downloadCSV"
            :disabled="activitiesStore.loading"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="activitiesStore.loading" class="flex justify-center items-center py-12 bg-white rounded-lg shadow">
      <div class="text-gray-500">Loading activities...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="activitiesStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ activitiesStore.error }}
    </div>

    <!-- Data Display -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Activities Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created On
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channel
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action Detail
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Disposition
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="activity in activitiesStore.activitiesAsObjects" :key="activity.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ activity.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatTimestamp(activity.created_on) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ activity.created_by }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                #{{ activity.case_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ activity.assigned_to }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {{ activity.src }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {{ activity.action_detail }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ activity.dispositions }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="activitiesStore.activityCount === 0" class="text-center py-12">
        <p class="text-gray-500">No activities found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useActivitiesStore } from '@/stores/activities'

const activitiesStore = useActivitiesStore()

const filters = reactive({
  dateFrom: '',
  dateTo: '',
  createdBy: '',
  assignedTo: '',
  caseId: '',
  source: '',
  action: 'notify'  // Default to notify
})

const currentFilters = ref({})

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

  // Created By - using created_by field
  if (filters.createdBy) {
    params.created_by = filters.createdBy.trim()
  }

  // Assigned To - using assigned_to field
  if (filters.assignedTo) {
    params.assigned_to = filters.assignedTo.trim()
  }

  // Case ID - using case_id field
  if (filters.caseId) {
    params.case_id = filters.caseId.trim()
  }

  // Source - using src field
  if (filters.source) {
    params.src = filters.source
  }

  // Action - using action field
  if (filters.action) {
    params.action = filters.action
  }

  currentFilters.value = params
  activitiesStore.listActivities(params)
}

function resetFilters() {
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.createdBy = ''
  filters.assignedTo = ''
  filters.caseId = ''
  filters.source = ''
  filters.action = 'notify'
  
  const params = { action: 'notify' }
  currentFilters.value = params
  activitiesStore.listActivities(params)
}

// Refresh activities with current filters
async function refreshActivities() {
  await activitiesStore.listActivities(currentFilters.value)
}

// Download CSV with current filters
async function downloadCSV() {
  try {
    const blob = await activitiesStore.downloadCSV(currentFilters.value)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activities_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Failed to download CSV:', error)
    alert('Failed to download CSV. Please try again.')
  }
}

// Format unix timestamp to readable date
function formatTimestamp(timestamp) {
  if (!timestamp || timestamp === '0') return '-'
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Fetch activities with default action=notify filter
  const params = { action: 'notify' }
  currentFilters.value = params
  activitiesStore.listActivities(params)
})
</script>