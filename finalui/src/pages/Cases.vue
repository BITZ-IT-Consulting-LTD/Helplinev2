<template>
  <div class="p-6 bg-gray-900 min-h-screen space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-100">Cases</h1>
    </div>

    <!-- Filters -->
    <CasesFilter @update:filters="applyFilters" />

    <!-- Stats Summary -->
    <div class="bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-700">
      <div class="flex items-center gap-2">
        <i-mdi-folder-multiple class="w-5 h-5 text-blue-400" />
        <span class="text-sm text-gray-300">Total Cases:</span>
        <span class="text-lg font-bold text-blue-400">{{ casesStore.caseCount }}</span>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="casesStore.loading" class="text-center py-20 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div class="text-gray-400">Loading cases...</div>
    </div>

    <!-- Error -->
    <div v-else-if="casesStore.error" class="bg-red-600/20 border border-red-600/50 text-red-400 px-5 py-4 rounded-lg font-medium">
      {{ casesStore.error }}
    </div>

    <!-- Data -->
    <div v-else>
      <!-- View Toggle Buttons -->
      <div class="flex justify-end gap-2 mb-4">
        <button
          :class="[
            'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
            currentView === 'table'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
          ]"
          @click="currentView = 'table'"
        >
          <i-mdi-table class="w-5 h-5" />
          Table View
        </button>
        <button
          :class="[
            'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
            currentView === 'timeline'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
          ]"
          @click="currentView = 'timeline'"
        >
          <i-mdi-timeline class="w-5 h-5" />
          Timeline View
        </button>
      </div>

      <!-- Views -->
      <Table
        v-if="currentView === 'table'"
        :cases="casesStore.cases"
        :cases_k="casesStore.cases_k"
      />
      <Timeline
        v-else
        :cases="casesStore.cases"
        :cases_k="casesStore.cases_k"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCaseStore } from '@/stores/cases'
import Table from '@/components/cases/Table.vue'
import Timeline from '@/components/cases/Timeline.vue'
import CasesFilter from '@/components/cases/CasesFilter.vue'

const casesStore = useCaseStore()
const currentView = ref('table')
const currentFilters = ref({})

// Fetch cases on mount
onMounted(async () => {
  try {
    await casesStore.listCases({ limit: 50 })
  } catch (err) {
    console.error('Failed to fetch cases:', err)
  }
})

// Apply filters and fetch cases
async function applyFilters(filters) {
  currentFilters.value = filters
  try {
    console.log('Applying filters:', filters)
    // Merge filters with any default params like limit
    await casesStore.listCases({ ...filters, limit: 50 })
    console.log('Filtered cases fetched:', casesStore.cases)
  } catch (err) {
    console.error('Error fetching filtered cases:', err)
  }
}
</script>