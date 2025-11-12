<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Notification Activities</h1>

    <!-- Loading State -->
    <div v-if="activitiesStore.loading" class="flex justify-center items-center py-12">
      <div class="text-gray-500">Loading activities...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="activitiesStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ activitiesStore.error }}
    </div>

    <!-- Data Display -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Stats Summary -->
      <div class="bg-gray-50 px-6 py-4 border-b">
        <p class="text-sm text-gray-600">
          Total Activities: <span class="font-semibold">{{ activitiesStore.activityCount }}</span>
        </p>
      </div>

      <!-- Activities Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created On
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channel
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action Detail
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Disposition
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="activity in activitiesStore.activitiesAsObjects" :key="activity.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ activity.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatTimestamp(activity.created_on) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ activity.created_by }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                #{{ activity.case_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ activity.assigned_to }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {{ activity.src }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {{ activity.action_detail }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ activity.dispositions }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="activitiesStore.activityCount === 0" class="text-center py-12">
        <p class="text-gray-500">No activities found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useActivitiesStore } from '@/stores/activities'

const activitiesStore = useActivitiesStore()

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
  // Fetch activities with action=notify filter
  activitiesStore.listActivities({ action: 'notify' })
})
</script>