<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-2 border-[#0284C7]">
      <!-- Chat Header -->
      <div class="bg-[#0284C7] text-white p-5 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-[#0891B2]"
          >
            {{ getInitial() }}
          </div>
          <div>
            <h3 class="font-bold text-lg">{{ getContactName() }}</h3>
            <p class="text-sm text-cyan-200">{{ getPlatform() }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-[#0369A1] rounded-lg transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div class="space-y-4">
          <div class="flex justify-start">
            <div class="bg-white rounded-lg p-4 max-w-xs shadow-sm border border-gray-200">
              <p class="text-gray-800">{{ getMessage() }}</p>
              <span class="text-xs text-gray-500 mt-2 block">{{ getTime() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <ChatInput 
        :modelValue="newMessage"
        @send-message="handleSendMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { useMessagesStore } from '@/stores/messages'
import ChatInput from './ChatInput.vue'

const props = defineProps({
  selectedMessage: {
    type: [Array, Object],
    default: null
  },
  newMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'sendMessage'])

const messagesStore = useMessagesStore()

const getValue = (key) => {
  if (!props.selectedMessage || !messagesStore.pmessages_k?.[key]) return null
  const index = messagesStore.pmessages_k[key][0]
  return props.selectedMessage[index]
}

const getContactName = () => {
  return getValue('created_by') || 'Unknown'
}

const getPlatform = () => {
  return getValue('src') || 'Chat'
}

const getMessage = () => {
  return getValue('src_msg') || ''
}

const getTime = () => {
  const timestamp = getValue('dth')
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

const getInitial = () => {
  const name = getContactName()
  return name.charAt(0).toUpperCase()
}

const handleSendMessage = (message) => {
  emit('sendMessage', message)
}
</script>