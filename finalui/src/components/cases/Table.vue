<template>
  <div class="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-900/60 border-b border-gray-700">
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Case ID</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Created By</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Created On</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Source</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Priority</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Status</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-700">
        <tr
          v-for="caseItem in cases"
          :key="cases_k.id ? caseItem[cases_k.id[0]] : caseItem.id"
          class="hover:bg-gray-700/30 transition-all duration-200 cursor-pointer"
        >
          <td class="px-6 py-4 text-gray-300">
            {{ getValue(caseItem, 'id') }}
          </td>
          <td class="px-6 py-4 text-gray-300">
            {{ getValue(caseItem, 'created_by') || 'N/A' }}
          </td>
          <td class="px-6 py-4 text-gray-300">
            {{ formatDate(getValue(caseItem, 'dt')) }}
          </td>
          <td class="px-6 py-4 text-gray-300">
            {{ getValue(caseItem, 'src') || 'N/A' }}
          </td>

          <!-- Priority -->
          <td class="px-6 py-4">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold uppercase border',
                getPriorityClass(getValue(caseItem, 'priority'))
              ]"
            >
              {{ formatPriority(getValue(caseItem, 'priority')) }}
            </span>
          </td>

          <!-- Status -->
          <td class="px-6 py-4">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold uppercase border',
                getStatusClass(getValue(caseItem, 'status'))
              ]"
            >
              {{ formatStatus(getValue(caseItem, 'status')) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  cases: Array,
  cases_k: Object,
});

// Access values using the cases_k structure
const getValue = (caseItem, key) => {
  if (!props.cases_k?.[key]) return null;
  return caseItem[props.cases_k[key][0]];
};

// Convert timestamp to readable date
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const value =
    timestamp < 10000000000 ? timestamp * 1000 : timestamp * 3600 * 1000;
  return new Date(value).toLocaleString();
};

// Priority label formatter
const formatPriority = (priority) => {
  if (!priority) return 'N/A';
  switch (Number(priority)) {
    case 3:
      return 'High';
    case 2:
      return 'Medium';
    case 1:
      return 'Low';
    default:
      return 'Unknown';
  }
};

// Status label formatter
const formatStatus = (status) => {
  if (!status) return 'N/A';
  switch (Number(status)) {
    case 1:
      return 'Open';
    case 2:
      return 'Closed';
    default:
      return 'Unknown';
  }
};

// Tailwind color classes based on priority
const getPriorityClass = (priority) => {
  switch (Number(priority)) {
    case 3: // High
      return 'bg-red-600/20 text-red-400 border-red-600/30';
    case 2: // Medium
      return 'bg-amber-600/20 text-amber-400 border-amber-600/30';
    case 1: // Low
      return 'bg-green-600/20 text-green-400 border-green-600/30';
    default:
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
  }
};

// Tailwind color classes based on status
const getStatusClass = (status) => {
  switch (Number(status)) {
    case 1: // Open
      return 'bg-amber-600/20 text-amber-400 border-amber-600/30';
    case 2: // Closed
      return 'bg-green-600/20 text-green-400 border-green-600/30';
    default:
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
  }
};
</script>