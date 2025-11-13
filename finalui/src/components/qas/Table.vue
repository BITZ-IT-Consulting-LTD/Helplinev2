<template>
  <div class="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-900/60 border-b border-gray-700">
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Call Date</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">User</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Talk Time</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Opening</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Listening</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Proactive</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Resolution</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Holding</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Closing</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Total Score</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Supervisor</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Created On</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-700">
          <tr
            v-for="(qa, i) in qas"
            :key="i"
            class="hover:bg-gray-700/30 transition-all duration-200"
          >
            <!-- Call Date -->
            <td class="px-6 py-4 text-gray-300 text-sm whitespace-nowrap">
              {{ formatTimestamp(qa[qas_k.chan_chan_ts[0]]) }}
            </td>

            <!-- User -->
            <td class="px-6 py-4 text-gray-300 text-sm">{{ qa[qas_k.chan_user_name[0]] }}</td>

            <!-- Talk Time -->
            <td class="px-6 py-4 text-gray-300 text-sm">{{ formatTalkTime(qa[qas_k.chan_talk_time[0]]) }}</td>

            <!-- Scores -->
            <td class="px-6 py-4 text-gray-300 text-sm">
              <span class="px-2 py-1 rounded bg-blue-600/20 text-blue-400 font-medium">
                {{ qa[qas_k.opening_phrase[0]] }}%
              </span>
            </td>
            <td class="px-6 py-4 text-gray-300 text-sm">
              <span class="px-2 py-1 rounded bg-blue-600/20 text-blue-400 font-medium">
                {{ qa[qas_k.listening_score_p[0]] }}%
              </span>
            </td>
            <td class="px-6 py-4 text-gray-300 text-sm">
              <span class="px-2 py-1 rounded bg-blue-600/20 text-blue-400 font-medium">
                {{ qa[qas_k.proactive_score_p[0]] }}%
              </span>
            </td>
            <td class="px-6 py-4 text-gray-300 text-sm">
              <span class="px-2 py-1 rounded bg-blue-600/20 text-blue-400 font-medium">
                {{ qa[qas_k.resolution_score_p[0]] }}%
              </span>
            </td>
            <td class="px-6 py-4 text-gray-300 text-sm">
              <span class="px-2 py-1 rounded bg-blue-600/20 text-blue-400 font-medium">
                {{ qa[qas_k.holding_score_p[0]] }}%
              </span>
            </td>
            <td class="px-6 py-4 text-gray-300 text-sm">
              <span class="px-2 py-1 rounded bg-blue-600/20 text-blue-400 font-medium">
                {{ qa[qas_k.closing_score_p[0]] }}%
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <span class="px-3 py-1 rounded-full bg-green-600/20 text-green-400 font-semibold border border-green-600/30">
                {{ qa[qas_k.total_score_p[0]] }}%
              </span>
            </td>

            <!-- Supervisor -->
            <td class="px-6 py-4 text-gray-300 text-sm">{{ qa[qas_k.created_by[0]] }}</td>

            <!-- Created On -->
            <td class="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
              {{ formatTimestamp(qa[qas_k.created_on[0]]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  qas: {
    type: Array,
    required: true,
  },
  qas_k: {
    type: Object,
    required: true,
  },
})

/**
 * Convert numeric timestamp (seconds or milliseconds)
 * into readable date format e.g. 17 Oct 2025 9:40 AM
 */
const formatTimestamp = (val) => {
  if (!val) return ''
  let timestamp = Number(val)
  if (timestamp < 10000000000) timestamp *= 1000 // convert seconds → ms if needed
  const date = new Date(timestamp)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Convert talk time (in seconds) → "m:ss"
 */
const formatTalkTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>