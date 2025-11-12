<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold text-gray-700">QA Results</h1>
    </div>

    <!-- Filters -->
    <QAFilter @update:filters="applyFilters" />

    <!-- Stats Summary -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Total QA Records: <span class="font-semibold text-lg">{{ qaStore.qaCount }}</span>
          </p>
        </div>
        
        <div class="flex gap-2">
          <button
            @click="fetchQA"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
          
          <button 
            @click="downloadCSV"
            :disabled="qaStore.loading"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="qaStore.loading" class="text-center py-12 bg-white rounded-lg shadow">
      <div class="text-gray-500">Loading QA records...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="qaStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ qaStore.error }}
    </div>

    <!-- Table -->
    <Table
      v-else-if="qaStore.qas && qaStore.qas.length"
      :qas="qaStore.qas"
      :qas_k="qaStore.qas_k"
    />

    <!-- Empty State -->
    <p v-else class="text-center py-12 text-gray-400 italic bg-white rounded-lg shadow">
      No QA results found.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQAStore } from '@/stores/qas'
import Table from '@/components/qas/Table.vue'
import QAFilter from '@/components/qas/QAFilter.vue'

const qaStore = useQAStore()
const currentFilters = ref({})

// Fetch QA records on mount
const fetchQA = async () => {
  await qaStore.listQA(currentFilters.value)
}

onMounted(fetchQA)

// Apply filters and fetch QA records
async function applyFilters(filters) {
  currentFilters.value = filters
  try {
    console.log('Applying filters:', filters)
    await qaStore.listQA(filters)
    console.log('Filtered QA records fetched:', qaStore.qas)
  } catch (err) {
    console.error('Error fetching filtered QA records:', err)
  }
}

// Download CSV with current filters
async function downloadCSV() {
  try {
    const blob = await qaStore.downloadCSV(currentFilters.value)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `qa_results_${new Date().toISOString().split('T')[0]}.csv`
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