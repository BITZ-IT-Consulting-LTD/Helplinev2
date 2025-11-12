<template>
  <div class="space-y-6">
    <div v-if="Object.keys(groupedMessagesByDate).length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
      <p class="text-gray-500">No chats to display</p>
    </div>

    <div
      v-for="(group, label) in groupedMessagesByDate"
      :key="label"
      class="space-y-3"
    >
      <h2 class="text-lg font-semibold text-[#0284C7]">{{ label }}</h2>

      <div class="space-y-2">
        <div
          v-for="message in group"
          :key="getValue(message, 'id')"
          :class="[
            'bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-[#0891B2] transition-all duration-200 cursor-pointer',
            selectedMessageId === getValue(message, 'id') ? 'ring-2 ring-[#0284C7] border-[#0284C7]' : ''
          ]"
          @click="openChatPanel(message)"
        >
          <div class="flex items-start gap-3">
            <!-- Avatar -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
              :style="{ background: getAvatarColor(getValue(message, 'created_by') || '') }"
            >
              {{ (getValue(message, 'created_by') || '?').charAt(0).toUpperCase() }}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-baseline mb-1">
                <span class="text-sm font-medium text-gray-900">
                  {{ getValue(message, 'created_by') || 'Unknown' }}
                </span>
                <span class="text-xs text-gray-500 ml-2">
                  {{ formatTime(getValue(message, 'dth')) }}
                </span>
              </div>

              <div class="flex gap-2 mb-2">
                <span class="px-2 py-0.5 rounded text-[#0284C7] bg-cyan-100 text-xs font-medium uppercase">
                  {{ getValue(message, 'src') || 'Chat' }}
                </span>
                <span class="px-2 py-0.5 rounded text-white bg-[#0891B2] text-xs font-medium uppercase">
                  {{ getValue(message, 'src_status') || 'Active' }}
                </span>
              </div>

              <p class="text-sm text-gray-700 truncate">
                {{ getValue(message, 'src_msg') || '' }}
              </p>
            </div>
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
  const colors = ['#0284C7', '#0891B2', '#06B6D4', '#0369A1', '#0E7490']
  const index = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
  return colors[index % colors.length]
}
</script>