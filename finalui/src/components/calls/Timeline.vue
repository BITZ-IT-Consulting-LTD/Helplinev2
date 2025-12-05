<template>
  <div class="space-y-6">
    <div
      v-for="(group, label) in groupedCalls"
      :key="label"
      class="shadow-xl rounded-lg p-4 border"
      :class="isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'"
    >
      <h2 
        class="text-base font-semibold mb-3 border-b pb-2 uppercase tracking-wide"
        :class="isDarkMode 
          ? 'text-blue-400 border-gray-700' 
          : 'text-amber-700 border-gray-200'"
      >
        {{ label }}
      </h2>

      <div class="space-y-3">
        <div
          v-for="(call, index) in group"
          :key="index"
          @click="handleSelect(call)"
          class="flex items-center gap-4 p-3 rounded-lg shadow-sm cursor-pointer transition-all duration-200 border"
          :class="isDarkMode 
            ? 'bg-gray-700/50 hover:bg-gray-700 border-gray-600 hover:border-blue-500' 
            : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-amber-600'"
        >
          <!-- Icon -->
          <div 
            class="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0"
            :class="isDarkMode 
              ? 'text-blue-400 bg-gray-800' 
              : 'text-amber-700 bg-white border border-gray-200'"
          >
            <i-mdi-phone class="w-6 h-6" />
          </div>

          <!-- Details -->
          <div class="flex-1">
            <div 
              class="font-medium text-sm"
              :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'"
            >
              Call ID: {{ call[callsStore.calls_k?.uniqueid?.[0]] || 'N/A' }}
            </div>

            <div 
              class="text-xs mt-1"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ formatDateTime(call[callsStore.calls_k?.dth?.[0]]) }}
            </div>

            <div 
              class="text-xs mt-1"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              Agent:
              <span 
                class="font-medium"
                :class="isDarkMode ? 'text-blue-400' : 'text-amber-700'"
              >
                {{ call[callsStore.calls_k?.user_name?.[0]] || 'Unknown' }}
              </span>
            </div>
          </div>

          <!-- QA Button -->
          <button 
            @click.stop="emitCreateQA(call)" 
            :disabled="!isAnswered(call)"
            :class="[
              'p-2 rounded transition-all duration-200 flex-shrink-0',
              isAnswered(call) 
                ? (isDarkMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
                    : 'bg-amber-700 text-white hover:bg-amber-800 active:scale-95')
                : (isDarkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50')
            ]"
            :title="isAnswered(call) ? 'Create QA Evaluation' : 'Only available for answered calls'"
          >
            <i-mdi-clipboard-check class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div 
      v-if="Object.keys(groupedCalls).length === 0" 
      class="text-center py-12 rounded-lg border"
      :class="isDarkMode 
        ? 'text-gray-500 bg-gray-800 border-gray-700' 
        : 'text-gray-500 bg-white border-gray-200'"
    >
      No calls to show.
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, inject } from 'vue'

// Inject theme
const isDarkMode = inject('isDarkMode')

const props = defineProps({
  groupedCalls: { type: Object, required: true },
  callsStore: { type: Object, required: true }
})

const emit = defineEmits(['select-call', 'create-qa'])

// Format timestamp to readable date and time (same as CallsTable)
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

// When user clicks a call, emit the call's unique id
function handleSelect(call) {
  const idIndex = props.callsStore.calls_k?.uniqueid?.[0]
  const id = idIndex !== undefined ? call[idIndex] : null
  if (id !== null) emit('select-call', id)
}

// Emit create-qa event with uniqueid
function emitCreateQA(call) {
  const idIndex = props.callsStore.calls_k?.uniqueid?.[0]
  const uniqueid = idIndex !== undefined ? call[idIndex] : null
  if (uniqueid !== null) emit('create-qa', uniqueid)
}

// Check if call status is answered
function isAnswered(call) {
  const statusIndex = props.callsStore.calls_k?.hangup_status?.[0]
  if (statusIndex === undefined) return false
  const status = call[statusIndex]
  return status === 'answered'
}
</script>