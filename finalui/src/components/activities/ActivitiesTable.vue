<template>
  <div class="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
    <!-- Activities Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-900/60 border-b border-gray-700">
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              ID
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Created On
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Created By
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Case ID
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Assigned To
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Channel
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Action Detail
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Disposition
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr 
            v-for="activity in activities" 
            :key="activity.id" 
            class="hover:bg-gray-700/30 transition-all duration-200"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ activity.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
              {{ formatTimestamp(activity.created_on) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ activity.created_by }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
              #{{ activity.case_id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ activity.assigned_to }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-medium uppercase border border-blue-600/30">
                {{ activity.src }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
              {{ activity.action_detail }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-400">
              {{ activity.dispositions }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!activities || activities.length === 0" class="text-center py-12">
      <i-mdi-bell-off-outline class="w-16 h-16 mx-auto text-gray-600 mb-4" />
      <p class="text-gray-500">No activities found</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})

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
</script>