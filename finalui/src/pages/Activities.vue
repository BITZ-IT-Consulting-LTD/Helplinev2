<template>
  <div class="p-6 bg-gray-900 min-h-screen space-y-6">
    <h1 class="text-2xl font-bold text-gray-100 mb-4">Notification Activities</h1>

    <!-- Filter Section -->
    <div class="w-full bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- Date Range From -->
        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1 text-gray-300">From Date</label>
          <input 
            type="date" 
            v-model="filters.dateFrom" 
            class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Date Range To -->
        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1 text-gray-300">To Date</label>
          <input 
            type="date" 
            v-model="filters.dateTo" 
            class="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Created By -->
        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1 text-gray-300">Created By</label>
          <input 
            type="text" 
            v-model="filters.createdBy" 
            placeholder="Enter name"
            class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Assigned To -->
        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1 text-gray-300">Assigned To</label>
          <input 
            type="text" 
            v-model="filters.assignedTo" 
            placeholder="Enter name"
            class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Case ID -->
        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1 text-gray-300">Case ID</label>
          <input 
            type="text" 
            v-model="filters.caseId" 
            placeholder="Enter case ID"
            class="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

    <!-- Stats Summary -->
    <div class="bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-gray-300">
          <i-mdi-bell class="w-5 h-5 text-blue-400" />
          <span class="text-sm">Total Activities:</span>
          <span class="text-lg font-bold text-blue-400">{{ activitiesStore.activityCount }}</span>
        </div>
        
        <div class="flex gap-2">
          <button 
            @click="refreshActivities"
            :disabled="activitiesStore.loading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <i-mdi-refresh class="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="activitiesStore.loading" class="text-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div class="text-gray-400">Loading activities...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="activitiesStore.error" class="bg-red-600/20 border border-red-600/50 text-red-400 px-5 py-4 rounded-lg font-medium">
      {{ activitiesStore.error }}
    </div>

    <!-- Data Display -->
    <div v-else class="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
      <!-- Activities Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-900/60 border-b border-gray-700">
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Created On
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Created By
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Case ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Assigned To
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Channel
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Action Detail
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Disposition
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="activity in activitiesStore.activitiesAsObjects" :key="activity.id" class="hover:bg-gray-700/30 transition-all duration-200">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ activity.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatTimestamp(activity.created_on) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ activity.created_by }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                #{{ activity.case_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ activity.assigned_to }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-medium uppercase border border-blue-600/30">
                  {{ activity.src }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                {{ activity.action_detail }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-400">
                {{ activity.dispositions }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="activitiesStore.activityCount === 0" class="text-center py-12 bg-gray-800">
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