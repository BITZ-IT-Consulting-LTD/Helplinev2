<template>
  <div class="space-y-6">
    <div
      v-for="(group, label) in groupedCalls"
      :key="label"
      class="bg-gray-800 shadow-xl rounded-lg p-4 border border-gray-700"
    >
      <h2 class="text-base font-semibold text-blue-400 mb-3 border-b border-gray-700 pb-2 uppercase tracking-wide">
        {{ label }}
      </h2>

      <div class="space-y-3">
        <div
          v-for="(call, index) in group"
          :key="index"
          @click="handleSelect(call)"
          class="flex items-center gap-4 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg shadow-sm cursor-pointer transition-all duration-200 border border-gray-600 hover:border-blue-500"
        >
          <!-- Icon -->
          <div class="text-blue-400 w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg flex-shrink-0">
            <i-mdi-phone class="w-6 h-6" />
          </div>

          <!-- Details -->
          <div class="flex-1">
            <div class="font-medium text-gray-200 text-sm">
              Call ID: {{ call[callsStore.calls_k?.uniqueid?.[0]] || 'N/A' }}
            </div>

            <div class="text-xs text-gray-400 mt-1">
              {{
                call[callsStore.calls_k?.dth?.[0]]
                  ? new Date(call[callsStore.calls_k.dth[0]] * 1000).toLocaleString()
                  : 'N/A'
              }}
            </div>

            <div class="text-xs text-gray-300 mt-1">
              Agent:
              <span class="font-medium text-blue-400">
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
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
            ]"
            :title="isAnswered(call) ? 'Create QA Evaluation' : 'Only available for answered calls'"
          >
            <i-mdi-clipboard-check class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="Object.keys(groupedCalls).length === 0" class="text-center text-gray-500 py-12 bg-gray-800 rounded-lg border border-gray-700">
      No calls to show.
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  groupedCalls: { type: Object, required: true },
  callsStore: { type: Object, required: true }
})

const emit = defineEmits(['select-call', 'create-qa'])

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

// Check if call status is 5 (answered in backend)
function isAnswered(call) {
  const statusIndex = props.callsStore.calls_k?.hangup_status?.[0]
  if (statusIndex === undefined) return false
  const status = call[statusIndex]
  // Check for both numeric 5 and string '5'
  return status === 5 || status === '5'
}
</script>