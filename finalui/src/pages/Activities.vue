<template>
  <div class="p-6 space-y-6 bg-gray-900 min-h-screen">
    
    <h1 class="text-2xl font-bold text-gray-100 mb-2">Notification Activities</h1>
    <p class="text-gray-400 mb-6">Track and manage all notification activities and case updates</p>

    <!-- Filters -->
    <ActivitiesFilter @update:filters="applyFilters" />

    <!-- Loading State -->
    <div v-if="activitiesStore.loading" class="flex justify-center items-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div class="text-gray-400">Loading activities...</div>
    </div>

    <!-- Content when loaded -->
    <div v-else>
      <!-- View Toggle Buttons and Stats Row -->
      <div class="flex justify-between items-center mb-6">
        <!-- Total Count -->
        <div class="flex items-center gap-2 text-gray-300">
          <i-mdi-bell class="w-5 h-5 text-blue-400" />
          <span class="text-sm">Total Activities:</span>
          <span class="text-lg font-bold text-blue-400">{{ activitiesStore.activityCount }}</span>
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
            @click="refreshActivities"
            :disabled="activitiesStore.loading"
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm bg-gray-800 text-gray-300 border border-gray-700 hover:border-green-500 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i-mdi-refresh class="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      <!-- Timeline view -->
      <div v-if="currentView === 'timeline'">
        <ActivitiesTimeline
          :activities="activitiesStore.activitiesAsObjects"
        />
      </div>

      <!-- Table view -->
      <div v-if="currentView === 'table'">
        <ActivitiesTable
          :activities="activitiesStore.activitiesAsObjects"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useActivitiesStore } from '@/stores/activities'
import ActivitiesFilter from '@/components/activities/ActivitiesFilter.vue'
import ActivitiesTable from '@/components/activities/ActivitiesTable.vue'
import ActivitiesTimeline from '@/components/activities/ActivitiesTimeline.vue'

const activitiesStore = useActivitiesStore()
const currentView = ref('timeline')
const currentFilters = ref({ action: 'notify' })

onMounted(async () => {
  try {
    console.log('Fetching activities...')
    await activitiesStore.listActivities(currentFilters.value)
    console.log('Activities fetched:', activitiesStore.activitiesAsObjects)
  } catch (err) {
    console.error('Failed to fetch activities:', err)
    toast.error('Failed to load activities. Please try again.')
  }
})

// Apply filters and fetch activities
async function applyFilters(filters) {
  currentFilters.value = filters
  try {
    console.log('Applying filters:', filters)
    await activitiesStore.listActivities(filters)
    console.log('Filtered activities fetched:', activitiesStore.activitiesAsObjects)
  } catch (err) {
    console.error('Error fetching filtered activities:', err)
    toast.error('Failed to apply filters. Please try again.')
  }
}

// Refresh activities with current filters
async function refreshActivities() {
  try {
    console.log('Refreshing activities...')
    await activitiesStore.listActivities(currentFilters.value)
    console.log('Activities refreshed')
    toast.success('Activities refreshed successfully!')
  } catch (err) {
    console.error('Error refreshing activities:', err)
    toast.error('Failed to refresh activities. Please try again.')
  }
}
</script>