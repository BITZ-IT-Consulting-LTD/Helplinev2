<template>
  <div class="p-6 bg-gray-900 min-h-screen">
    <h1 class="text-2xl font-bold mb-2 text-gray-100">Chats</h1>
    <p class="text-gray-400 mb-6">Manage conversations and communications across all channels</p>

    <!-- Channel Filter Pills -->
    <Filter 
      :channelFilters="channelFilters" 
      :activePlatform="activePlatform" 
      @update:activePlatform="handlePlatformChange"
    />

    <!-- Loading State -->
    <div v-if="messagesStore.loading" class="text-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div class="text-gray-400">Loading messages...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="messagesStore.error" class="bg-red-600/20 border border-red-600/50 text-red-400 px-4 py-3 rounded-lg">
      {{ messagesStore.error }}
    </div>

    <!-- Content -->
    <template v-else>
      <!-- View Buttons and Total Count -->
      <div class="flex justify-between items-center mb-6">
        <!-- Total Count -->
        <div class="flex items-center gap-2 text-gray-300">
          <i-mdi-message-text-outline class="w-5 h-5 text-blue-400" />
          <span class="text-sm">Total Messages:</span>
          <span class="text-lg font-bold text-blue-400">{{ messagesStore.messageCount }}</span>
        </div>

        <!-- View Toggle Buttons -->
        <div class="flex gap-3">
          <button 
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm" 
            :class="activeView==='timeline' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'" 
            @click="activeView='timeline'"
          >
            <i-mdi-timeline-text-outline class="w-5 h-5" />
            Timeline
          </button>
          <button 
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm" 
            :class="activeView==='table' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'" 
            @click="activeView='table'"
          >
            <i-mdi-table class="w-5 h-5" />
            Table
          </button>
          <button 
            @click="refreshMessages"
            :disabled="messagesStore.loading"
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm bg-gray-800 text-gray-300 border border-gray-700 hover:border-green-500 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i-mdi-refresh class="w-5 h-5" />
            Refresh
          </button>
        </div>
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
  { id: "all", name: "All", icon: "i-mdi-apps" },
  { id: "whatsapp", name: "WhatsApp", icon: "i-mdi-whatsapp" },
  { id: "safepal", name: "SafePal", icon: "i-mdi-shield-check" },
  { id: "email", name: "Email", icon: "i-mdi-email-outline" },
  { id: "walkin", name: "Walk-In", icon: "i-mdi-walk" },
  { id: "ai", name: "AI", icon: "i-mdi-robot-outline" },
  { id: "call", name: "Call", icon: "i-mdi-phone-outline" }
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