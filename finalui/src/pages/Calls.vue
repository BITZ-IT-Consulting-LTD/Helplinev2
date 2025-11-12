<template>
  <div class="p-6 space-y-6">
    
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Call History</h1>

    <!-- Filters -->
    <CallsFilter @update:filters="applyFilters" />

    <!-- Stats Summary -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Total Calls: <span class="font-semibold text-lg">{{ callsStore.callCount }}</span>
          </p>
        </div>
        
        <div class="flex gap-2">
          <button 
            @click="downloadCSV"
            :disabled="callsStore.loading"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="callsStore.loading" class="flex justify-center items-center py-12 bg-white rounded-lg shadow">
      <div class="text-gray-500">Loading calls...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="callsStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ callsStore.error }}
    </div>

    <!-- Content when loaded -->
    <div v-else>
      <!-- View Toggle Buttons -->
      <div class="flex justify-end space-x-3 mb-4">
        <button
          @click="activeView = 'timeline'"
          :class="[
            'px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-200',
            activeView === 'timeline' ? 'bg-amber-700' : 'bg-amber-400 hover:bg-amber-500'
          ]"
        >
          Timeline View
        </button>

        <button
          @click="activeView = 'table'"
          :class="[
            'px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-200',
            activeView === 'table' ? 'bg-amber-700' : 'bg-amber-400 hover:bg-amber-500'
          ]"
        >
          Table View
        </button>
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
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import Timeline from "@/components/calls/Timeline.vue"
import Table from "@/components/calls/Table.vue"
import CallsFilter from "@/components/calls/CallsFilter.vue"
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