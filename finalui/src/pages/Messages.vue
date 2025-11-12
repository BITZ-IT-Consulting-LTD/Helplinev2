<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Chats</h1>
    <p class="text-gray-500 mb-4">Manage conversations and communications across all channels</p>

    <!-- Channel Filter Pills -->
    <Filter 
      :channelFilters="channelFilters" 
      :activePlatform="activePlatform" 
      @update:activePlatform="handlePlatformChange"
    />

    <!-- Stats Summary -->
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Total Messages: <span class="font-semibold text-lg">{{ messagesStore.messageCount }}</span>
          </p>
        </div>
        
        <div class="flex gap-2">
          <button 
            @click="refreshMessages"
            :disabled="messagesStore.loading"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="messagesStore.loading" class="text-center py-12 bg-white rounded-lg shadow">
      <div class="text-gray-500">Loading messages...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="messagesStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ messagesStore.error }}
    </div>

    <!-- Content -->
    <template v-else>
      <!-- View Buttons -->
      <div class="flex space-x-2 mb-4">
        <button 
          class="px-4 py-2 border rounded transition" 
          :class="activeView==='timeline'?'bg-blue-500 text-white':'hover:bg-gray-50'" 
          @click="activeView='timeline'"
        >
          Timeline
        </button>
        <button 
          class="px-4 py-2 border rounded transition" 
          :class="activeView==='table'?'bg-blue-500 text-white':'hover:bg-gray-50'" 
          @click="activeView='table'"
        >
          Table
        </button>
      </div>

      <!-- Views -->
      <Timeline
        v-if="activeView==='timeline'" 
        :groupedMessagesByDate="groupedMessagesByDate" 
        :selectedMessageId="selectedMessageId"
        @openChat="openChatPanel"
      />
      <Table
        v-else
        :messages="messagesStore.pmessages"
        :selectedMessageId="selectedMessageId"
        @openChat="openChatPanel"
      />
    </template>

    <!-- Chat Panel -->
    <ChatPanel
      v-if="showChatPanel"
      :selectedMessage="selectedMessage"
      :newMessage="newMessage"
      @close="closeChatPanel"
      @sendMessage="sendMessage"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Filter from '@/components/messages/Filter.vue'
import Timeline from '@/components/messages/Timeline.vue'
import Table from '@/components/messages/Table.vue'
import ChatPanel from '@/components/messages/ChatPanel.vue'

import { useMessagesStore } from '@/stores/messages'

const messagesStore = useMessagesStore()

const channelFilters = ref([
  { id: "all", name: "All Channels" },
  { id: "whatsapp", name: "WhatsApp" },
  { id: "sms", name: "SMS" },
  { id: "messenger", name: "Messenger" },
  { id: "telegram", name: "Telegram" },
])

const activePlatform = ref("all")
const activeView = ref("table")
const showChatPanel = ref(false)
const selectedMessage = ref(null)
const selectedMessageId = ref(null)
const newMessage = ref("")

// Group messages by date for timeline view
const groupedMessagesByDate = computed(() => {
  const groups = {}
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const messages = messagesStore.pmessages || []
  const dthIndex = messagesStore.pmessages_k?.dth?.[0]
  
  if (dthIndex === undefined) return groups

  for (const msg of messages) {
    const timestamp = msg[dthIndex]
    if (!timestamp) continue
    
    const date = new Date(timestamp * 1000)
    let label = date.toDateString() === today.toDateString() 
      ? 'Today' 
      : date.toDateString() === yesterday.toDateString() 
        ? 'Yesterday' 
        : date.toLocaleDateString()
    
    if (!groups[label]) groups[label] = []
    groups[label].push(msg)
  }
  return groups
})

// Handle platform change from pills
function handlePlatformChange(platformId) {
  activePlatform.value = platformId
  
  console.log('Platform changed to:', platformId)
  
  // Store handles server-side filtering
  if (platformId === 'all') {
    messagesStore.fetchAllMessages()
  } else {
    messagesStore.fetchMessagesBySource(platformId)
  }
  
  // Log data after fetch
  setTimeout(() => {
    console.log('Messages after filter:', messagesStore.pmessages?.length || 0)
    console.log('Messages_k:', messagesStore.pmessages_k)
  }, 500)
}

// Refresh messages
async function refreshMessages() {
  if (activePlatform.value === 'all') {
    await messagesStore.fetchAllMessages()
  } else {
    await messagesStore.fetchMessagesBySource(activePlatform.value)
  }
}

const openChatPanel = (msg) => {
  selectedMessage.value = msg
  const idIndex = messagesStore.pmessages_k?.id?.[0]
  selectedMessageId.value = idIndex !== undefined ? msg[idIndex] : null
  showChatPanel.value = true
}

const closeChatPanel = () => {
  showChatPanel.value = false
  selectedMessage.value = null
  selectedMessageId.value = null
  newMessage.value = ''
}

const sendMessage = (msg) => {
  console.log("Send message:", msg)
  newMessage.value = ''
}

onMounted(async () => {
  try {
    await messagesStore.fetchAllMessages()
  } catch (err) {
    console.log('Failed to fetch messages:', err)
  }
})
</script>