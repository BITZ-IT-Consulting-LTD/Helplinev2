<template>
  <div class="space-y-6">
    <div v-if="Object.keys(groupedMessagesByDate).length === 0" class="text-center py-10 text-gray-500">
      <p>No chats to display</p>
    </div>

    <div
      v-for="(group, label) in groupedMessagesByDate"
      :key="label"
      class="space-y-4"
    >
      <h2 class="text-gray-700 font-semibold text-lg">{{ label }}</h2>

      <div class="space-y-2">
        <div
          v-for="message in group"
          :key="getValue(message, 'id')"
          :class="[
            'flex items-start space-x-3 p-2 rounded cursor-pointer hover:bg-gray-100',
            selectedMessageId === getValue(message, 'id') ? 'bg-blue-50' : ''
          ]"
          @click="openChatPanel(message)"
        >
          <!-- Avatar -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            :style="{ background: getAvatarColor(getValue(message, 'created_by') || '') }"
          >
            {{ (getValue(message, 'created_by') || '?').charAt(0) }}
          </div>

          <!-- Chat Content -->
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <span class="font-medium text-gray-800">
                {{ getValue(message, 'created_by') || 'Unknown' }}
              </span>
              <span class="text-xs text-gray-400">
                {{ formatTime(getValue(message, 'dth')) }}
              </span>
            </div>

            <div class="flex space-x-2 mt-1 items-center">
              <span class="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                {{ getValue(message, 'src') || 'N/A' }}
              </span>
              <span
                class="px-2 py-1 rounded text-white text-xs"
                :class="statusClass(getValue(message, 'src_status'))"
              >
                {{ getValue(message, 'src_status') || 'Active' }}
              </span>
            </div>

            <p class="text-gray-700 mt-1 text-sm">
              {{ getValue(message, 'src_msg') || '' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMessagesStore } from '@/stores/messages'

const props = defineProps({
  groupedMessagesByDate: {
    type: Object,
    default: () => ({})
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

// Format timestamp to time
const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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