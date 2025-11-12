<template>
  <div class="p-4 bg-gray-50 max-w-[1260px]">
    <!-- Header Component -->
    <div class="mb-3">
      <WallboardHeader 
        :connection-status="connectionClass"
        :connection-label="connectionLabel"
        :last-update="lastUpdate"
        :is-dark-mode="isDarkMode"
        @toggle-theme="toggleDarkMode"
      />
    </div>

    <!-- Main Content: Two Column Layout -->
    <div class="grid gap-4" style="grid-template-columns: 900px 320px;">
      <!-- Left Column: Tables -->
      <div class="flex flex-col gap-3">
        <!-- Counsellors Table Component -->
        <CounsellorsTable 
          :counsellors="counsellorsWithQueueData"
          :online-count="onlineCounsellorsCount"
        />

        <!-- Callers Table Component -->
        <CallersTable 
          :callers="callersData"
          :online-count="onlineCallersCount"
        />
      </div>

      <!-- Right Column: Cases Tiles -->
      <div class="h-[532px]">
        <CasesTiles :tiles="casesTiles" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import axiosInstance from "@/utils/axios.js"

// Import components
import WallboardHeader from '@/components/wallboard/WallboardHeader.vue'
import CasesTiles from '@/components/wallboard/CasesTiles.vue'
import CounsellorsTable from '@/components/wallboard/CounsellorsTable.vue'
import CallersTable from '@/components/wallboard/CallersTable.vue'

// Import utilities
import { useWebSocketConnection } from '@/composables/useWebSocketConnection.js'
import { useCounsellorData } from '@/composables/useCounsellorData'
import { useApiData } from '@/composables/useApiData'
import { formatDuration, getStatusText } from '@/utils/formatters'

const WSHOST = 'wss://demo-openchs.bitz-itc.com:8384/ami/sync?c=-2'


export default {
  name: 'App',
  components: {
    WallboardHeader,
    CasesTiles,
    CounsellorsTable,
    CallersTable
  },
  setup() {
    const isDarkMode = ref(false)
    
    // Use WebSocket composable
    const {
      channels,
      wsReady,
      lastUpdate,
      connect,
      disconnect
    } = useWebSocketConnection(WSHOST)
    
    // Use API data composable
    const {
      apiData,
      fetchCasesData
    } = useApiData(axiosInstance)
    
    // Use counsellor data composable
    const {
      counsellorNames,
      counsellorStats,
      fetchCounsellorName,
      fetchCounsellorStats
    } = useCounsellorData(axiosInstance)

    // Cases tiles with real data from API
    const casesTiles = computed(() => {
      const stats = apiData.value?.stats || {}
      
      const tiles = [
        { 
          id: 'ct1', 
          label: "TODAY'S ANSWERED CALLS", 
          value: stats.calls_today || '--', 
          variant: 'c-blue' 
        },
        { 
          id: 'ct2', 
          label: "TODAY'S CASES", 
          value: stats.cases_today || '--', 
          variant: 'c-amber' 
        },
        { 
          id: 'ct3', 
          label: 'ONGOING CASES', 
          value: stats.cases_ongoing_total || '--', 
          variant: 'c-red' 
        },
        { 
          id: 'ct4', 
          label: 'MONTH CLOSED CASES', 
          value: stats.cases_closed_this_month || '--', 
          variant: 'c-green' 
        },
        { 
          id: 'ct5', 
          label: 'TOTAL CALLS', 
          value: stats.calls_total || '--', 
          variant: 'c-black' 
        },
        { 
          id: 'ct6', 
          label: 'TOTAL CASES', 
          value: stats.cases_total || '--', 
          variant: 'c-black' 
        }
      ]
      
      return tiles
    })

    // Separate counsellors and callers based on CHAN_CONTEXT
    const counsellorsWithQueueData = computed(() => {
      const counsellorChannels = channels.value.filter(ch => {
        const context = (ch.CHAN_CONTEXT || '').toLowerCase()
        return context === 'agentlogin'
      })

      return counsellorChannels.map((ch) => {
        const extension = ch.CHAN_EXTEN || '--'
        const name = counsellorNames.value[extension] || 'Unknown'
        const stats = counsellorStats.value[extension] || { answered: '--', missed: '--', talkTime: '--' }

        // Find connected caller by matching bridge IDs
        let connectedCallerNumber = '--'
        if (Number(ch.CHAN_STATE_CONNECT) && ch.CHAN_BRIDGE_ID) {
          const connectedCaller = callersData.value.find(caller => 
            caller.channelData.CHAN_BRIDGE_ID === ch.CHAN_BRIDGE_ID
          )
          if (connectedCaller) {
            connectedCallerNumber = connectedCaller.callerNumber
          }
        }

        return {
          id: ch.CHAN_UNIQUEID || ch._uid,
          extension: extension,
          name: name,
          caller: connectedCallerNumber,
          answered: stats.answered,
          missed: stats.missed,
          talkTime: '--',
          queueStatus: getStatusText(ch),
          duration: Number(ch.CHAN_STATE_CONNECT) ? formatDuration(ch.CHAN_TS) : '--',
          isOnline: true,
          channelData: ch,
          channel: ch.CHAN_CHAN || '--',
          vector: ch.CHAN_VECTOR || '--',
          campaign: ch.CHAN_CAMPAIGN_ID || '--'
        }
      })
    })

    // Callers data - filtered by DLPN_callcenter context
    const callersData = computed(() => {
      return channels.value
        .filter(ch => {
          const context = (ch.CHAN_CONTEXT || '').toLowerCase()
          return context === 'trunk' || context === 'dlpn_callcenter'
        })
        .map((ch) => {
          return {
            id: ch.CHAN_UNIQUEID || ch._uid,
            callerNumber: ch.CHAN_CALLERID_NUM || '--',
            vector: ch.CHAN_VECTOR || '--',
            waitTime: formatDuration(ch.CHAN_TS),
            queueStatus: getStatusText(ch),
            bridgeId: ch.CHAN_BRIDGE_ID || '--',
            campaign: ch.CHAN_CAMPAIGN_ID || '--',
            sipCallId: ch.CHAN_SIPCALLID || '--',
            isOnline: true,
            channelData: ch
          }
        })
    })

    // Count of online counsellors and callers
    const onlineCounsellorsCount = computed(() => 
      counsellorsWithQueueData.value.filter(c => c.isOnline).length
    )
    
    const onlineCallersCount = computed(() => 
      callersData.value.filter(c => c.isOnline).length
    )

    // Connection status helpers
    const connectionClass = computed(() => 
      wsReady.value === 'open' ? 'on' : (wsReady.value === 'connecting' ? 'connecting' : 'off')
    )
    
    const connectionLabel = computed(() => {
      if (wsReady.value === 'connecting') return 'Connecting...'
      if (wsReady.value === 'open') return 'Connected'
      if (wsReady.value === 'error') return 'Error'
      return 'Disconnected'
    })

    // Theme management
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('darkMode', isDarkMode.value.toString())
    }

    // Lifecycle
    onMounted(() => {
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode !== null) {
        isDarkMode.value = savedDarkMode === 'true'
      }
      
      // Connect to WebSocket
      connect(channels, fetchCounsellorName, fetchCounsellorStats)
      
      // Fetch initial data
      fetchCasesData()
      
      // Debug logs
      console.log('Wallboard mounted')
      console.log('Initial apiData:', apiData.value)
      
      // Refresh data every 5 minutes
      const dataInterval = setInterval(() => {
        fetchCasesData()
      }, 300000)
      
      onBeforeUnmount(() => {
        clearInterval(dataInterval)
        disconnect()
      })
    })

    // Watch for data changes
    watch(() => apiData.value, (newVal) => {
      console.log('apiData changed:', newVal)
    })
    
    watch(() => channels.value, (newVal) => {
      console.log('channels changed, count:', newVal.length)
    })

    return {
      // State
      isDarkMode,
      
      // Data
      casesTiles,
      counsellorsWithQueueData,
      onlineCounsellorsCount,
      callersData,
      onlineCallersCount,
      
      // Connection status
      connectionClass,
      connectionLabel,
      lastUpdate,
      
      // Methods
      toggleDarkMode
    }
  }
}
</script>

<style>
/* Component-specific styles only */
</style>