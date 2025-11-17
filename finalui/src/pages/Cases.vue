<template>
  <div class="p-6 space-y-6 bg-gray-900 min-h-screen">
    
    <h1 class="text-2xl font-bold text-gray-100 mb-2">Cases</h1>
    <p class="text-gray-400 mb-6">Manage and track all case records and their statuses</p>

    <!-- Filters -->
    <CasesFilter @update:filters="applyFilters" />

    <!-- Loading State -->
    <div v-if="casesStore.loading" class="flex justify-center items-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div class="text-gray-400">Loading cases...</div>
    </div>

    <!-- Content when loaded -->
    <div v-else>
      <!-- View Toggle Buttons and Stats Row -->
      <div class="flex justify-between items-center mb-6">
        <!-- Total Count -->
        <div class="flex items-center gap-2 text-gray-300">
          <i-mdi-folder-outline class="w-5 h-5 text-blue-400" />
          <span class="text-sm">Total Cases:</span>
          <span class="text-lg font-bold text-blue-400">{{ casesStore.caseCount }}</span>
        </div>

        <!-- View Toggle Buttons -->
        <div class="flex gap-3">
          <button
            @click="currentView = 'timeline'"
            :class="[
              'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm',
              currentView === 'timeline' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
            ]"
          >
            <i-mdi-timeline-text-outline class="w-5 h-5" />
            Timeline
          </button>

          <button
            @click="currentView = 'table'"
            :class="[
              'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm',
              currentView === 'table' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
            ]"
          >
            <i-mdi-table class="w-5 h-5" />
            Table
          </button>

          <button
            @click="createCase"
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm bg-green-600 text-white hover:bg-green-700 shadow-lg active:scale-95"
          >
            <i-mdi-plus-circle class="w-5 h-5" />
            Create Case
          </button>

          <button
            @click="refreshCases"
            :disabled="casesStore.loading"
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm bg-gray-800 text-gray-300 border border-gray-700 hover:border-green-500 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i-mdi-refresh class="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      <!-- Timeline view -->
      <div v-if="currentView === 'timeline'">
        <Timeline
          :cases="casesStore.cases"
          :cases_k="casesStore.cases_k"
        />
      </div>

      <!-- Table view -->
      <div v-if="currentView === 'table'">
        <Table
          :cases="casesStore.cases"
          :cases_k="casesStore.cases_k"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useCaseStore } from '@/stores/cases'
import Table from '@/components/cases/Table.vue'
import Timeline from '@/components/cases/Timeline.vue'
import CasesFilter from '@/components/cases/CasesFilter.vue'

const router = useRouter()
const casesStore = useCaseStore()
const currentView = ref('timeline')
const currentFilters = ref({})

// Fetch cases on mount
onMounted(async () => {
  try {
    console.log('Fetching cases...')
    await casesStore.listCases({ limit: 50 })
    console.log('Cases fetched:', casesStore.cases)
  } catch (err) {
    console.error('Failed to fetch cases:', err)
    toast.error('Failed to load cases. Please try again.')
  }
})

// Apply filters and fetch cases
async function applyFilters(filters) {
  currentFilters.value = filters
  try {
    console.log('Applying filters:', filters)
    await casesStore.listCases({ ...filters, limit: 50 })
    console.log('Filtered cases fetched:', casesStore.cases)
  } catch (err) {
    console.error('Error fetching filtered cases:', err)
    toast.error('Failed to apply filters. Please try again.')
  }
}

// Refresh cases with current filters
async function refreshCases() {
  try {
    console.log('Refreshing cases...')
    await casesStore.listCases({ ...currentFilters.value, limit: 50 })
    console.log('Cases refreshed')
    toast.success('Cases refreshed successfully!')
  } catch (err) {
    console.error('Error refreshing cases:', err)
    toast.error('Failed to refresh cases. Please try again.')
  }
}

// Navigate to Case Creation page
function createCase() {
  router.push({ name: 'CaseCreation' })
}
</script>