<template>
  <div class="overflow-x-auto bg-white rounded shadow p-4">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Contact</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Platform</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Message</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Time</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="message in messages"
          :key="getValue(message, 'id')"
          :class="{
            'bg-blue-50': selectedMessageId === getValue(message, 'id')
          }"
          class="hover:bg-gray-50 cursor-pointer"
          @click="openChatPanel(message)"
        >
          <!-- Contact -->
          <td class="px-4 py-2">
            <div class="flex items-center space-x-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                :style="{ background: getAvatarColor(getValue(message, 'created_by') || '') }"
              >
                {{ (getValue(message, 'created_by') || '?').charAt(0) }}
              </div>
              <span>{{ getValue(message, 'created_by') || 'Unknown' }}</span>
            </div>
          </td>

          <!-- Platform -->
          <td class="px-4 py-2">
            <span class="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs">
              {{ getValue(message, 'src') || 'N/A' }}
            </span>
          </td>

          <!-- Message -->
          <td class="px-4 py-2 max-w-xs truncate">
            {{ getValue(message, 'src_msg') || '' }}
          </td>

          <!-- Time -->
          <td class="px-4 py-2 text-sm text-gray-500">
            {{ formatDateTime(getValue(message, 'dth')) }}
          </td>

          <!-- Status -->
          <td class="px-4 py-2">
            <span
              class="px-2 py-1 rounded text-white text-xs"
              :class="statusClass(getValue(message, 'src_status'))"
            >
              {{ getValue(message, 'src_status') || 'Active' }}
            </span>
          </td>

          <!-- Actions -->
          <td class="px-4 py-2">
            <button
              class="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm"
              @click.stop="openChatPanel(message)"
              title="Open Chat"
            >
              Open
            </button>
          </td>
        </tr>

        <tr v-if="!messages || messages.length === 0">
          <td colspan="6" class="text-center py-4 text-gray-500">
            No messages to display
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useMessagesStore } from '@/stores/messages'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  selectedMessageId: [String, Number]
})

const emit = defineEmits(['openChat'])

const messagesStore = useMessagesStore()

// Helper to get value from message array using pmessages_k
const getValue = (message, key) => {
  if (!messagesStore.pmessages_k?.[key]) return null
  const index = messagesStore.pmessages_k[key][0]
  return message[index]
}

// Format timestamp to date and time
const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openChatPanel = (message) => {
  emit('openChat', message)
}

const getAvatarColor = (name) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  const index = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
  return colors[index % colors.length]
}

// Status mapping for Tailwind
const statusClass = (statusRaw) => {
  const status = String(statusRaw || 'active').toLowerCase()
  const map = {
    active: 'bg-green-500',
    pending: 'bg-yellow-500',
    inactive: 'bg-gray-500',
    busy: 'bg-red-500',
    away: 'bg-orange-500'
  }
  return map[status] || map.active
}
</script>