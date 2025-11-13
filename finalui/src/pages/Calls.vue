<template>
  <div class="p-6 space-y-6 bg-gray-900 min-h-screen">
    
    <h1 class="text-2xl font-bold text-gray-100 mb-4">Call History</h1>

    <!-- Filters -->
    <CallsFilter @update:filters="applyFilters" />

    <!-- Loading State -->
    <div v-if="callsStore.loading" class="flex justify-center items-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div class="text-gray-400">Loading calls...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="callsStore.error" class="bg-red-600/20 border border-red-600/50 text-red-400 px-4 py-3 rounded-lg">
      {{ callsStore.error }}
    </div>

    <!-- Content when loaded -->
    <div v-else>
      <!-- View Toggle Buttons and Stats -->
      <div class="flex justify-between items-center mb-6">
        <!-- Total Count -->
        <div class="flex items-center gap-2 text-gray-300">
          <i-mdi-phone-outline class="w-5 h-5 text-blue-400" />
          <span class="text-sm">Total Calls:</span>
          <span class="text-lg font-bold text-blue-400">{{ callsStore.callCount }}</span>
        </div>

        <!-- View Toggle Buttons -->
        <div class="flex gap-3">
          <button
            @click="activeView = 'timeline'"
            :class="[
              'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm',
              activeView === 'timeline' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
            ]"
          >
            <i-mdi-timeline-text-outline class="w-5 h-5" />
            Timeline
          </button>

          <button
            @click="activeView = 'table'"
            :class="[
              'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm',
              activeView === 'table' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
            ]"
          >
            <i-mdi-table class="w-5 h-5" />
            Table
          </button>

          <button
            @click="activeView = 'sip'"
            :class="[
              'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm',
              activeView === 'sip' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
            ]"
          >
            <i-mdi-phone-settings class="w-5 h-5" />
            SIP Agent
          </button>

        
        </div>
      </div>

      <!-- Timeline view -->
      <div v-if="activeView === 'timeline'">
        <Timeline
          :grouped-calls="groupedCalls"
          :calls-store="callsStore"
          @select-call="selectCall"
        />
      </div>

      <!-- Table view -->
      <div v-if="activeView === 'table'">
        <Table
          :calls="callsStore.calls"
          :calls-store="callsStore"
          :selected-call-id="selectedCallId"
          @select-call="selectCall"
        />
      </div>

      <!-- SIP Agent view -->
      <div v-if="activeView === 'sip'">
        <SipAgentView />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import Timeline from "@/components/calls/Timeline.vue"
import Table from "@/components/calls/Table.vue"
import CallsFilter from "@/components/calls/CallsFilter.vue"
import SipAgentView from "@/components/calls/SipAgentView.vue"
import { useCallStore } from "@/stores/calls"

const callsStore = useCallStore()
const activeView = ref("timeline")
const selectedCallId = ref(null)
const currentFilters = ref({})

// Fetch calls on mount
onMounted(async () => {
  try {
    console.log("Fetching calls...")
    await callsStore.listCalls()
    console.log("Calls fetched:", callsStore.calls)
  } catch (err) {
    console.error("Error fetching calls:", err)
  }
})

// Apply filters and fetch calls
async function applyFilters(filters) {
  currentFilters.value = filters
  try {
    console.log("Applying filters:", filters)
    await callsStore.listCalls(filters)
    console.log("Filtered calls fetched:", callsStore.calls)
  } catch (err) {
    console.error("Error fetching filtered calls:", err)
  }
}

// Download CSV with current filters
async function downloadCSV() {
  try {
    const blob = await callsStore.downloadCSV(currentFilters.value)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `calls_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Failed to download CSV:', error)
    alert('Failed to download CSV. Please try again.')
  }
}

// Parent-level select handler (child components emit callId)
function selectCall(callId) {
  selectedCallId.value = callId
}

// Group calls by date (uses your store's calls and calls_k indexes)
const groupedCalls = computed(() => {
  const groups = {}
  if (!callsStore.calls || !Array.isArray(callsStore.calls)) return groups

  const tsIndex = callsStore.calls_k?.dth?.[0]
  if (tsIndex === undefined) return groups

  callsStore.calls.forEach((call) => {
    const ts = call[tsIndex]
    const dateLabel = ts ? new Date(ts * 1000).toLocaleDateString() : "Unknown"

    if (!groups[dateLabel]) groups[dateLabel] = []
    groups[dateLabel].push(call)
  })

  // Sort groups by newest date first
  const sorted = Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .reduce((acc, k) => {
      acc[k] = groups[k]
      return acc
    }, {})

  return sorted
})
</script>