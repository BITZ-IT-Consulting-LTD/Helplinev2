<template>
  <div class="p-6 bg-gray-900 min-h-screen space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-100">QA Results</h1>
    </div>

    <!-- Filters -->
    <QAFilter @update:filters="applyFilters" />

    <!-- Stats Summary -->
    <div class="bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-gray-300">
          <i-mdi-clipboard-check class="w-5 h-5 text-blue-400" />
          <span class="text-sm">Total QA Records:</span>
          <span class="text-lg font-bold text-blue-400">{{ qaStore.qaCount }}</span>
        </div>
        
        <div class="flex gap-2">
          <button
            @click="fetchQA"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
          >
            <i-mdi-refresh class="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="qaStore.loading" class="text-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div class="text-gray-400">Loading QA records...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="qaStore.error" class="bg-red-600/20 border border-red-600/50 text-red-400 px-5 py-4 rounded-lg font-medium">
      {{ qaStore.error }}
    </div>

    <!-- Table -->
    <Table
      v-else-if="qaStore.qas && qaStore.qas.length"
      :qas="qaStore.qas"
      :qas_k="qaStore.qas_k"
    />

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <p class="text-gray-500">No QA results found</p>
    </div>
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
</script>