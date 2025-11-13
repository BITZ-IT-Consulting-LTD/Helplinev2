<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Visualize and analyze your data</p>
      </div>

      <!-- Controls Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Endpoint Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Data Source
            </label>
            <select 
              v-model="selectedEndpoint" 
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-100 cursor-pointer transition-all duration-300 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="qa">QA Results</option>
              <option value="cases">Cases</option>
              <option value="calls">Call History</option>
              <option value="users">Users</option>
            </select>
          </div>

          <!-- X-Axis (Time Duration) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Time Period (X-Axis)
            </label>
            <div class="flex gap-2">
              <button
                v-for="period in timePeriods"
                :key="period.value"
                @click="xAxis = period.value"
                :class="[
                  'flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  xAxis === period.value
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Y-Axis Filter Selection -->
        <div class="mt-6">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Filter By (Y-Axis)
          </label>
          
          <!-- Available Options -->
          <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4 border-2 border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="field in availableYAxisFields"
                :key="field"
                @click="toggleYAxis(field)"
                :disabled="selectedYAxis.includes(field)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  selectedYAxis.includes(field)
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer'
                ]"
              >
                {{ formatFieldName(field) }}
              </button>
            </div>
          </div>

          <!-- Selected Filters -->
          <div v-if="selectedYAxis.length > 0" class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-orange-800 dark:text-orange-200">Selected Filters</span>
              <button
                @click="selectedYAxis = []"
                class="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 font-medium"
              >
                Clear All
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(field, index) in selectedYAxis"
                :key="field"
                class="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium shadow-sm"
              >
                <span>{{ formatFieldName(field) }}</span>
                <button
                  @click="removeYAxis(index)"
                  class="hover:bg-orange-600 rounded p-0.5 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <p v-else class="text-sm text-gray-500 dark:text-gray-400 italic">No filters selected. Click on options above to add filters.</p>
        </div>

        <!-- Apply Button -->
        <div class="mt-6 flex justify-end">
          <button
            @click="fetchData"
            :disabled="loading || selectedYAxis.length === 0 || !xAxis"
            class="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 disabled:hover:to-orange-600"
          >
            {{ loading ? 'Loading...' : 'Generate Report' }}
          </button>
        </div>
      </div>

      <!-- Graph Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {{ formatFieldName(selectedEndpoint) }} Analytics
          </h2>
          <div class="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium">
            {{ formatFieldName(currentMetric) }}
          </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center h-96">
          <div class="flex flex-col items-center gap-4">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
            <div class="text-gray-500 dark:text-gray-400 font-medium">Loading data...</div>
          </div>
        </div>

        <div v-else-if="chartData.length === 0" class="flex items-center justify-center h-96">
          <div class="text-center">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="mt-4 text-gray-500 dark:text-gray-400 font-medium">No data available</p>
            <p class="mt-2 text-sm text-gray-400 dark:text-gray-500">Select filters and click "Generate Report"</p>
          </div>
        </div>

        <!-- Bar Chart -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full">
            <svg :width="svgWidth" :height="svgHeight">
              <!-- Horizontal gridlines -->
              <g v-for="tick in yTicks" :key="'grid-' + tick">
                <line
                  :x1="margin.left"
                  :x2="svgWidth - margin.right"
                  :y1="yScale(tick)"
                  :y2="yScale(tick)"
                  stroke="#e5e7eb"
                  stroke-width="1"
                  stroke-dasharray="4"
                />
              </g>

              <!-- Bars -->
              <g v-for="(bar, index) in chartData" :key="'bar-' + index">
                <rect
                  :x="margin.left + index * (barWidth + barSpacing)"
                  :y="yScale(bar.value)"
                  :width="barWidth"
                  :height="svgHeight - margin.bottom - yScale(bar.value)"
                  fill="url(#barGradient)"
                  class="cursor-pointer hover:opacity-80 transition-opacity"
                  rx="4"
                />
                <!-- X-axis labels -->
                <text
                  :x="margin.left + index * (barWidth + barSpacing) + barWidth / 2"
                  :y="svgHeight - margin.bottom + 20"
                  text-anchor="middle"
                  font-size="11"
                  class="fill-gray-600 dark:fill-gray-400 font-medium"
                >
                  {{ bar.label }}
                </text>
              </g>

              <!-- Y-axis labels -->
              <g v-for="tick in yTicks" :key="'label-' + tick">
                <text
                  :x="margin.left - 8"
                  :y="yScale(tick) + 4"
                  text-anchor="end"
                  font-size="11"
                  class="fill-gray-600 dark:fill-gray-400 font-medium"
                >
                  {{ tick }}
                </text>
              </g>

              <!-- X-axis line -->
              <line
                :x1="margin.left"
                :x2="svgWidth - margin.right"
                :y1="svgHeight - margin.bottom"
                :y2="svgHeight - margin.bottom"
                stroke="#9ca3af"
                stroke-width="2"
              />

              <!-- Y-axis line -->
              <line
                :x1="margin.left"
                :x2="margin.left"
                :y1="margin.top"
                :y2="svgHeight - margin.bottom"
                stroke="#9ca3af"
                stroke-width="2"
              />

              <!-- Gradient for bars -->
              <defs>
                <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stop-color="#f97316" />
                  <stop offset="100%" stop-color="#fb923c" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Data Table</h2>
        
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="flex flex-col items-center gap-4">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
            <div class="text-gray-500 dark:text-gray-400 font-medium">Loading data...</div>
          </div>
        </div>

        <div v-else-if="tableData.length === 0" class="flex items-center justify-center h-64">
          <div class="text-center">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-gray-500 dark:text-gray-400 font-medium">No data available</p>
            <p class="mt-2 text-sm text-gray-400 dark:text-gray-500">Select filters and click "Generate Report"</p>
          </div>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border-2 border-gray-200 dark:border-gray-700">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <tr>
                <!-- Dynamic filter columns -->
                <th 
                  v-for="(filter, idx) in selectedYAxis" 
                  :key="'filter-' + idx"
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  {{ formatFieldName(filter) }}
                </th>
                <!-- Time period columns -->
                <th 
                  v-for="period in tableTimePeriods" 
                  :key="'period-' + period"
                  class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-orange-50 dark:bg-orange-900/20"
                >
                  {{ period }}
                </th>
                <th class="px-6 py-4 text-center text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-100 dark:bg-orange-900/30">
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(row, rowIdx) in tableData" :key="'row-' + rowIdx" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <!-- Filter value cells -->
                <td 
                  v-for="(filter, filterIdx) in selectedYAxis" 
                  :key="'cell-filter-' + filterIdx"
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  <span class="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                    {{ row.filters[filterIdx] || '-' }}
                  </span>
                </td>
                <!-- Count cells for each period -->
                <td 
                  v-for="(count, periodIdx) in row.counts" 
                  :key="'cell-count-' + periodIdx"
                  class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100 font-medium"
                >
                  {{ count }}
                </td>
                <!-- Total cell -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20">
                  {{ row.total }}
                </td>
              </tr>
              <!-- Total row -->
              <tr class="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 font-bold">
                <td 
                  :colspan="selectedYAxis.length"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 uppercase"
                >
                  Total
                </td>
                <td 
                  v-for="(total, idx) in columnTotals" 
                  :key="'total-' + idx"
                  class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100"
                >
                  {{ total }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30">
                  {{ grandTotal }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCaseStore } from '@/stores/cases'
import { useCallStore } from '@/stores/calls'
import { useQAStore } from '@/stores/qas'
import { useUserStore } from '@/stores/users'

// Store instances
const caseStore = useCaseStore()
const callStore = useCallStore()
const qaStore = useQAStore()
const userStore = useUserStore()

// State
const selectedEndpoint = ref('qa')
const xAxis = ref('') // No default value
const selectedYAxis = ref([])
const loading = ref(false)
const rawData = ref([])

// Time periods for button selection
const timePeriods = [
  { label: 'Hour', value: 'h' },
  { label: 'Day', value: 'dt' },
  { label: 'Week', value: 'wk' },
  { label: 'Month', value: 'mn' },
  { label: 'Year', value: 'yr' }
]

// Chart dimensions & spacing
const margin = { top: 20, right: 20, bottom: 50, left: 50 }
const barWidth = 35
const barSpacing = 20
const svgHeight = 400

// Endpoint configurations
const endpointConfig = {
  qa: {
    store: qaStore,
    method: 'listQA',
    yAxisFields: ['Extension'],
    metric: 'qa_count',
    storeKey: 'qaResults'
  },
  cases: {
    store: caseStore,
    method: 'listCases',
    yAxisFields: ['Case', 'Reporter', 'Client', 'Perpetrator', 'Services', 'Referrals', 'Main Category', 'SubCategory 1', 'SubCategory 2', 'SubCategory 3', 'GBV Related', 'Case Source', 'Priority', 'Status', 'Created By', 'Escalated To', 'Escalated By', 'Case Assessment', 'Status in the Justice System'],
    metric: 'case_count',
    storeKey: 'cases'
  },
  calls: {
    store: callStore,
    method: 'listCalls',
    yAxisFields: ['Direction', 'Extension', 'Hangup Status', 'SLA Band', 'Disposition'],
    metric: 'call_count',
    storeKey: 'calls'
  },
  users: {
    store: userStore,
    method: 'listUsers',
    yAxisFields: ['Role', 'Department', 'Status', 'Team'],
    metric: 'user_count',
    storeKey: 'users'
  }
}

// Available fields based on selected endpoint
const availableYAxisFields = computed(() => {
  return endpointConfig[selectedEndpoint.value]?.yAxisFields || []
})

const currentMetric = computed(() => {
  return endpointConfig[selectedEndpoint.value]?.metric || ''
})

// Toggle Y-Axis selection
function toggleYAxis(field) {
  if (!selectedYAxis.value.includes(field)) {
    selectedYAxis.value.push(field)
  }
}

// Remove Y-Axis selection
function removeYAxis(index) {
  selectedYAxis.value.splice(index, 1)
}

// Watch endpoint changes and reset selections
watch(selectedEndpoint, () => {
  selectedYAxis.value = []
})

// Fetch data from appropriate store
async function fetchData() {
  if (selectedYAxis.value.length === 0) {
    alert('Please select at least one filter field')
    return
  }

  if (!xAxis.value) {
    alert('Please select a time period')
    return
  }

  loading.value = true
  try {
    const config = endpointConfig[selectedEndpoint.value]
    const store = config.store
    const method = config.method

    const params = {
      xaxis: xAxis.value,
      yaxis: selectedYAxis.value.join(','),
      metrics: config.metric
    }

    await store[method](params)
    rawData.value = store[config.storeKey] || []
    processData()
  } catch (err) {
    console.error('[Reports] fetchData error', err)
    rawData.value = []
  } finally {
    loading.value = false
  }
}

// Process raw data for chart
const chartData = ref([])

function processData() {
  if (!rawData.value || rawData.value.length === 0) {
    chartData.value = []
    return
  }

  const grouped = {}
  
  rawData.value.forEach(row => {
    if (!Array.isArray(row) || row.length === 0) return
    
    const timePeriod = String(row[0])
    const value = Number(row[row.length - 1]) || 0
    
    grouped[timePeriod] = (grouped[timePeriod] || 0) + value
  })

  const entries = Object.entries(grouped)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => {
      const na = Number(a.label), nb = Number(b.label)
      if (!isNaN(na) && !isNaN(nb)) return na - nb
      return String(a.label).localeCompare(String(b.label))
    })

  chartData.value = entries.map(e => ({
    label: formatLabel(e.label),
    value: e.value
  }))
}

// Process data for table
const tableData = computed(() => {
  if (!rawData.value || rawData.value.length === 0) return []

  const groups = {}
  const periods = new Set()

  rawData.value.forEach(row => {
    if (!Array.isArray(row) || row.length === 0) return

    const timePeriod = String(row[0])
    const count = Number(row[row.length - 1]) || 0
    
    const filterValues = []
    for (let i = 1; i < row.length - 1; i++) {
      filterValues.push(String(row[i] || ''))
    }

    const filterKey = filterValues.join('|')
    periods.add(timePeriod)

    if (!groups[filterKey]) {
      groups[filterKey] = {
        filters: filterValues,
        periodCounts: {}
      }
    }

    groups[filterKey].periodCounts[timePeriod] = 
      (groups[filterKey].periodCounts[timePeriod] || 0) + count
  })

  const sortedPeriods = Array.from(periods).sort((a, b) => {
    const na = Number(a), nb = Number(b)
    if (!isNaN(na) && !isNaN(nb)) return na - nb
    return a.localeCompare(b)
  })

  return Object.values(groups).map(group => {
    const counts = sortedPeriods.map(period => group.periodCounts[period] || 0)
    const total = counts.reduce((sum, val) => sum + val, 0)
    
    return {
      filters: group.filters,
      counts,
      total
    }
  })
})

// Time periods for table headers - use formatted labels
const tableTimePeriods = computed(() => {
  if (!rawData.value || rawData.value.length === 0) return []

  const periods = new Set()
  rawData.value.forEach(row => {
    if (Array.isArray(row) && row.length > 0) {
      periods.add(String(row[0]))
    }
  })

  return Array.from(periods).sort((a, b) => {
    const na = Number(a), nb = Number(b)
    if (!isNaN(na) && !isNaN(nb)) return na - nb
    return a.localeCompare(b)
  }).map(period => formatLabel(period))
})

// Column totals for table
const columnTotals = computed(() => {
  if (tableData.value.length === 0) return []
  
  const numColumns = tableData.value[0]?.counts.length || 0
  const totals = new Array(numColumns).fill(0)
  
  tableData.value.forEach(row => {
    row.counts.forEach((count, idx) => {
      totals[idx] += count
    })
  })
  
  return totals
})

const grandTotal = computed(() => {
  return columnTotals.value.reduce((sum, val) => sum + val, 0)
})

// Chart calculations
const svgWidth = computed(() =>
  Math.max(chartData.value.length * (barWidth + barSpacing) + margin.left + margin.right, 500)
)

const maxValue = computed(() => Math.max(...chartData.value.map(d => d.value), 1))

const yScale = (value) =>
  svgHeight - margin.bottom - (value / maxValue.value) * (svgHeight - margin.top - margin.bottom)

const yTicks = computed(() => {
  const steps = 5
  const stepValue = Math.ceil(maxValue.value / steps)
  return Array.from({ length: steps + 1 }, (_, i) => i * stepValue)
})

// Format label based on timeframe
function formatLabel(label) {
  if (xAxis.value === 'h') {
    return label
  }

  const timestamp = Number(label) * 1000
  const date = new Date(timestamp)

  switch (xAxis.value) {
    case 'dt':
      return date.toLocaleDateString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric'
      })

    case 'wk':
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      return `W${getWeekNumber(date)} (${weekStart.toLocaleDateString('en-US', {
        month: 'short', day: '2-digit'
      })})`

    case 'mn':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    case 'yr':
      return date.getFullYear()

    default:
      return label
  }
}

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
}

function formatFieldName(field) {
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>