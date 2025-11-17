<template>
  <div class="p-6 space-y-6 bg-gray-900 min-h-screen">
    
    <h1 class="text-2xl font-bold text-gray-100 mb-2">QA Results</h1>
    <p class="text-gray-400 mb-6">Review and analyze quality assurance evaluations and call performance</p>

    <!-- Filters -->
    <QAFilter @update:filters="applyFilters" />

    <!-- Loading State -->
    <div v-if="qaStore.loading" class="flex justify-center items-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div class="text-gray-400">Loading QA records...</div>
    </div>

    <!-- Content when loaded -->
    <div v-else>
      <!-- View Toggle Buttons and Stats Row -->
      <div class="flex justify-between items-center mb-6">
        <!-- Total Count -->
        <div class="flex items-center gap-2 text-gray-300">
          <i-mdi-clipboard-check class="w-5 h-5 text-blue-400" />
          <span class="text-sm">Total QA Records:</span>
          <span class="text-lg font-bold text-blue-400">{{ qaStore.qaCount }}</span>
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
            @click="refreshQA"
            :disabled="qaStore.loading"
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm bg-gray-800 text-gray-300 border border-gray-700 hover:border-green-500 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i-mdi-refresh class="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      <!-- Timeline view -->
      <div v-if="currentView === 'timeline'">
        <QATimeline
          :qas="qaStore.qas"
          :qas_k="qaStore.qas_k"
        />
      </div>

      <!-- Table view -->
      <div v-if="currentView === 'table'">
        <Table
          :qas="qaStore.qas"
          :qas_k="qaStore.qas_k"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useQAStore } from '@/stores/qas'
import Table from '@/components/qas/Table.vue'
import QATimeline from '@/components/qas/QATimeline.vue'
import QAFilter from '@/components/qas/QAFilter.vue'

const qaStore = useQAStore()
const currentView = ref('timeline')
const currentFilters = ref({})

onMounted(async () => {
  try {
    console.log('Fetching QA records...')
    await qaStore.listQA()
    console.log('QA records fetched:', qaStore.qas)
  } catch (err) {
    console.error('Failed to fetch QA records:', err)
    toast.error('Failed to load QA records. Please try again.')
  }
})

// Apply filters and fetch QA records
async function applyFilters(filters) {
  currentFilters.value = filters
  try {
    console.log('Applying filters:', filters)
    await qaStore.listQA(filters)
    console.log('Filtered QA records fetched:', qaStore.qas)
  } catch (err) {
    console.error('Error fetching filtered QA records:', err)
    toast.error('Failed to apply filters. Please try again.')
  }
}

// Refresh QA with current filters
async function refreshQA() {
  try {
    console.log('Refreshing QA records...')
    await qaStore.listQA(currentFilters.value)
    console.log('QA records refreshed')
    toast.success('QA records refreshed successfully!')
  } catch (err) {
    console.error('Error refreshing QA records:', err)
    toast.error('Failed to refresh QA records. Please try again.')
  }
}
</script>