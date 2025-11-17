<template>
  <div class="space-y-6">
    <div v-for="(group, date) in groupedActivities" :key="date" class="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
      <!-- Date Header -->
      <div class="bg-gray-900/60 px-6 py-3 border-b border-gray-700">
        <h3 class="text-sm font-semibold text-blue-400 flex items-center gap-2">
          <i-mdi-calendar class="w-4 h-4" />
          {{ date }}
        </h3>
      </div>

      <!-- Activities List -->
      <div class="divide-y divide-gray-700">
        <div 
          v-for="activity in group" 
          :key="activity.id"
          class="p-6 hover:bg-gray-700/30 transition-all duration-200"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div class="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-600/30">
              <i-mdi-bell class="w-5 h-5 text-blue-400" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 class="text-sm font-semibold text-gray-100">
                    Activity #{{ activity.id }}
                  </h4>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ formatTimestamp(activity.created_on) }}
                  </p>
                </div>
                <span class="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-medium uppercase border border-blue-600/30 whitespace-nowrap">
                  {{ activity.src }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Created By</p>
                  <p class="text-sm text-gray-300">{{ activity.created_by }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Assigned To</p>
                  <p class="text-sm text-gray-300">{{ activity.assigned_to }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Case ID</p>
                  <p class="text-sm font-medium text-blue-400">#{{ activity.case_id }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Disposition</p>
                  <p class="text-sm text-gray-400">{{ activity.dispositions || '-' }}</p>
                </div>
              </div>

              <div v-if="activity.action_detail" class="mt-3 pt-3 border-t border-gray-700">
                <p class="text-xs text-gray-500 mb-1">Action Detail</p>
                <p class="text-sm text-gray-300">{{ activity.action_detail }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="Object.keys(groupedActivities).length === 0" class="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-12 text-center">
      <i-mdi-bell-off-outline class="w-16 h-16 mx-auto text-gray-600 mb-4" />
      <p class="text-gray-500">No activities found</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})

// Group activities by date
const groupedActivities = computed(() => {
  const groups = {}
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  props.activities.forEach(activity => {
    const timestamp = activity.created_on
    if (!timestamp || timestamp === '0') return

    const date = new Date(parseInt(timestamp) * 1000)
    let label

    if (date.toDateString() === today.toDateString()) {
      label = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday'
    } else {
      label = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    if (!groups[label]) groups[label] = []
    groups[label].push(activity)
  })

  return groups
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