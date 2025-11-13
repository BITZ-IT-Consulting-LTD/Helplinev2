<template>
  <div class="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-900/60 border-b border-gray-700">
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Contact</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Platform</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Message</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Time</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Status</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-700">
        <tr
          v-for="message in messages"
          :key="getValue(message, 'id')"
          :class="{
            'bg-blue-600/10 border-l-4 border-l-blue-500': selectedMessageId === getValue(message, 'id')
          }"
          class="hover:bg-gray-700/30 transition-all duration-200 cursor-pointer"
          @click="openChatPanel(message)"
        >
          <!-- Contact -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                :style="{ background: getAvatarColor(getValue(message, 'created_by') || '') }"
              >
                {{ (getValue(message, 'created_by') || '?').charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-gray-200">{{ getValue(message, 'created_by') || 'Unknown' }}</span>
            </div>
          </td>

          <!-- Platform -->
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-medium uppercase border border-blue-600/30">
              {{ getValue(message, 'src') || 'All' }}
            </span>
          </td>

          <!-- Message -->
          <td class="px-6 py-4">
            <div class="text-sm text-gray-300 max-w-md truncate">
              {{ getValue(message, 'src_msg') || '' }}
            </div>
          </td>

          <!-- Time -->
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
            {{ formatDateTime(getValue(message, 'dth')) }}
          </td>

          <!-- Status -->
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-xs font-semibold uppercase border border-green-600/30">
              {{ getValue(message, 'src_status') || 'Active' }}
            </span>
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <button
              class="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
              @click.stop="openChatPanel(message)"
              title="Open Chat"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </button>
          </td>
        </tr>

        <tr v-if="!messages || messages.length === 0">
          <td colspan="6" class="text-center py-12 text-gray-500">
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

const getValue = (message, key) => {
  if (!messagesStore.pmessages_k?.[key]) return null
  const index = messagesStore.pmessages_k[key][0]
  return message[index]
}

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('en-US', {
    day: 'numeric',
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
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  const index = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
  return colors[index % colors.length]
}
</script>