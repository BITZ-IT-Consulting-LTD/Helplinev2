<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Cases</h1>
    </div>

    <!-- Filters -->
    <CasesFilter @update:filters="applyFilters" />

    <!-- Stats Summary -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Total Cases: <span class="font-semibold text-lg">{{ casesStore.caseCount }}</span>
          </p>
        </div>
        
        <div class="flex gap-2">
          <button 
            @click="downloadCSV"
            :disabled="casesStore.loading"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="casesStore.loading" class="text-center py-20 text-gray-600 bg-white rounded-lg shadow">
      Loading cases...
    </div>

    <!-- Error -->
    <div v-else-if="casesStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ casesStore.error }}
    </div>

    <!-- Data -->
    <div v-else>
      <!-- View Toggle Buttons -->
      <div class="flex justify-end gap-2 mb-4">
        <button
          :class="[
            'px-4 py-2 rounded-md font-medium',
            currentView === 'table'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          ]"
          @click="currentView = 'table'"
        >
          Table View
        </button>
        <button
          :class="[
            'px-4 py-2 rounded-md font-medium',
            currentView === 'timeline'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          ]"
          @click="currentView = 'timeline'"
        >
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

// Download CSV with current filters
async function downloadCSV() {
  try {
    const blob = await casesStore.downloadCSV(currentFilters.value)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cases_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Failed to download CSV:', error)
    alert('Failed to download CSV. Please try again.')
  }
}
</script>