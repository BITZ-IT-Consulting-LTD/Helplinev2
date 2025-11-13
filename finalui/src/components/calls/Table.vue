<template>
  <div class="bg-gray-800 rounded-lg shadow-xl overflow-auto border border-gray-700">
    <table class="min-w-full text-sm text-left">
      <thead class="bg-gray-900/60 border-b border-gray-700">
        <tr>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">Date</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">Direction</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">Phone</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">Extension</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">Wait Time</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">Talk Time</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">Hangup Status</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">Hangup By</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">QA Score</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300">Disposition</th>
          <th class="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-300 text-center">Actions</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-700">
        <tr
          v-for="(call, idx) in calls"
          :key="call[callsStore.calls_k?.uniqueid?.[0]] || idx"
          :class="[
            'hover:bg-gray-700/30 cursor-pointer transition-all duration-200',
            call[callsStore.calls_k?.uniqueid?.[0]] === selectedCallId ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : ''
          ]"
          @click="emitSelect(call)"
        >
          <!-- Date -->
          <td class="px-4 py-3 text-gray-300">
            {{
              call[callsStore.calls_k?.chan_ts?.[0]]
                ? formatDateTime(call[callsStore.calls_k.chan_ts[0]])
                : 'N/A'
            }}
          </td>

          <!-- Direction -->
          <td class="px-4 py-3">
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', directionClass(call[callsStore.calls_k?.vector?.[0]])]">
              {{ call[callsStore.calls_k?.vector?.[0]] === '1' ? 'Inbound' : call[callsStore.calls_k?.vector?.[0]] === '2' ? 'Outbound' : 'N/A' }}
            </span>
          </td>

          <!-- Phone -->
          <td class="px-4 py-3 font-medium text-gray-200">
            {{ call[callsStore.calls_k?.phone?.[0]] || 'N/A' }}
          </td>

          <!-- Extension -->
          <td class="px-4 py-3 text-gray-300">
            {{ call[callsStore.calls_k?.usr?.[0]] || 'N/A' }}
            <span v-if="call[callsStore.calls_k?.usr_name?.[0]]" class="text-gray-500 text-xs block">
              {{ call[callsStore.calls_k.usr_name[0]] }}
            </span>
          </td>

          <!-- Wait Time -->
          <td class="px-4 py-3 text-gray-400">
            {{ formatDuration(call[callsStore.calls_k?.wait_time_tot?.[0]]) }}
          </td>

          <!-- Talk Time -->
          <td class="px-4 py-3 text-gray-400">
            {{ formatDuration(call[callsStore.calls_k?.talk_time?.[0]]) }}
          </td>

          <!-- Hangup Status -->
          <td class="px-4 py-3">
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', statusClass(call[callsStore.calls_k?.hangup_status?.[0]])]">
              {{ call[callsStore.calls_k?.hangup_status?.[0]] || 'Unknown' }}
            </span>
          </td>

          <!-- Hangup By -->
          <td class="px-4 py-3 text-gray-400">
            {{ call[callsStore.calls_k?.hangup_reason?.[0]] || 'N/A' }}
          </td>

          <!-- QA Score -->
          <td class="px-4 py-3 font-medium text-blue-400">
            {{ call[callsStore.calls_k?.qa_score?.[0]] || '-' }}
          </td>

          <!-- Disposition -->
          <td class="px-4 py-3 text-xs text-gray-400">
            {{ call[callsStore.calls_k?.dispositions?.[0]] || '-' }}
          </td>

          <!-- Actions -->
          <td class="px-4 py-3 text-center">
            <div class="flex items-center justify-center gap-2">
              <button @click.stop="emitViewDetails(call)" class="p-1.5 bg-gray-700 hover:bg-blue-600 rounded text-gray-300 hover:text-white transition" title="View Details">
                <i-mdi-eye class="w-4 h-4" />
              </button>

              <button @click.stop="emitLinkToCase(call)" class="p-1.5 bg-gray-700 hover:bg-green-600 rounded text-gray-300 hover:text-white transition" title="Link to Case">
                <i-mdi-link class="w-4 h-4" />
              </button>

              <button @click.stop="emitViewCase(call)" class="p-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded transition" title="View Case">
                <i-mdi-folder-open class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!calls || calls.length === 0" class="p-4 text-center text-gray-500">
      No calls available.
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  calls: { type: Array, required: true },
  callsStore: { type: Object, required: true },
  selectedCallId: { type: [String, Number, null], default: null }
})

const emit = defineEmits(['select-call', 'view-call-details', 'link-to-case', 'view-case'])

function emitSelect(call) {
  const idIndex = props.callsStore.calls_k?.uniqueid?.[0]
  const id = idIndex !== undefined ? call[idIndex] : null
  if (id !== null) emit('select-call', id)
}

function emitViewDetails(call) {
  const idIndex = props.callsStore.calls_k?.uniqueid?.[0]
  const id = idIndex !== undefined ? call[idIndex] : null
  if (id !== null) emit('view-call-details', id)
}

function emitLinkToCase(call) {
  const idIndex = props.callsStore.calls_k?.uniqueid?.[0]
  const id = idIndex !== undefined ? call[idIndex] : null
  if (id !== null) emit('link-to-case', id)
}

function emitViewCase(call) {
  const caseIndex = props.callsStore.calls_k?.has_case_id?.[0]
  const cid = caseIndex !== undefined ? call[caseIndex] : null
  if (cid !== null) emit('view-case', cid)
}

// Format timestamp to readable date and time
function formatDateTime(timestamp) {
  if (!timestamp || timestamp === '0') return 'N/A'
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Format duration (seconds to readable format)
function formatDuration(seconds) {
  if (!seconds || seconds === '0') return '0.00'
  const num = parseFloat(seconds)
  if (num < 60) return num.toFixed(2)
  const mins = Math.floor(num / 60)
  const secs = (num % 60).toFixed(0)
  return `${mins}:${secs.padStart(2, '0')}`
}

// Direction styling
function directionClass(direction) {
  if (!direction) return 'bg-gray-700/50 text-gray-400 border-gray-600'
  const d = String(direction)
  if (d === '1') return 'bg-blue-600/20 text-blue-400 border-blue-600/30'
  if (d === '2') return 'bg-green-600/20 text-green-400 border-green-600/30'
  return 'bg-gray-700/50 text-gray-400 border-gray-600'
}

// Status styling
function statusClass(status) {
  if (!status) return 'bg-gray-700/50 text-gray-400 border-gray-600'
  const s = String(status).toLowerCase()
  if (s.includes('answered') || s.includes('resolved')) return 'bg-green-600/20 text-green-400 border-green-600/30'
  if (s.includes('abandoned') || s.includes('missed')) return 'bg-red-600/20 text-red-400 border-red-600/30'
  if (s.includes('noanswer') || s.includes('no answer')) return 'bg-amber-600/20 text-amber-400 border-amber-600/30'
  return 'bg-gray-700/50 text-gray-400 border-gray-600'
}
</script>