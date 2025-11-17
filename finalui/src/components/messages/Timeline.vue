<template>
  <div class="space-y-6">
    <div v-if="Object.keys(groupedMessagesByDate).length === 0" class="text-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <p class="text-gray-500">No chats to display</p>
    </div>

    <div
      v-for="(group, label) in groupedMessagesByDate"
      :key="label"
      class="space-y-3"
    >
      <h2 class="text-base font-semibold text-blue-400 uppercase tracking-wide">{{ label }}</h2>

      <div class="space-y-2">
        <div
          v-for="message in group"
          :key="getValue(message, 'id')"
          :class="[
            'bg-gray-800 rounded-lg p-4 shadow-xl border transition-all duration-200 cursor-pointer',
            selectedMessageId === getValue(message, 'id') 
              ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-600/10' 
              : 'border-gray-700 hover:border-blue-500/50 hover:shadow-2xl'
          ]"
          @click="openChatPanel(message)"
        >
          <div class="flex items-start gap-3">
            <!-- Avatar -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm"
              :style="{ background: getAvatarColor(getValue(message, 'created_by') || '') }"
            >
              {{ (getValue(message, 'created_by') || '?').charAt(0).toUpperCase() }}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-baseline mb-1">
                <span class="text-sm font-medium text-gray-200">
                  {{ getValue(message, 'created_by') || 'Unknown' }}
                </span>
                <span class="text-xs text-gray-500 ml-2">
                  {{ formatTime(getValue(message, 'dth')) }}
                </span>
              </div>

              <div class="flex gap-2 mb-2">
                <span class="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-medium uppercase border border-blue-600/30">
                  {{ getValue(message, 'src') || 'Chat' }}
                </span>
                <span class="px-2 py-0.5 rounded-full bg-green-600/20 text-green-400 text-xs font-medium uppercase border border-green-600/30">
                  {{ getValue(message, 'src_status') || 'Active' }}
                </span>
              </div>

              <p class="text-sm text-gray-400 truncate">
                {{ getValue(message, 'src_msg') || '' }}
              </p>
            </div>

            <!-- Chat Action Button -->
            <button 
              @click.stop="openChatPanel(message)" 
              class="p-2 rounded transition-all duration-200 flex-shrink-0 bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              title="Open Chat"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </button>
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

const getValue = (message, key) => {
  if (!messagesStore.pmessages_k?.[key]) return null
  const index = messagesStore.pmessages_k[key][0]
  return message[index]
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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