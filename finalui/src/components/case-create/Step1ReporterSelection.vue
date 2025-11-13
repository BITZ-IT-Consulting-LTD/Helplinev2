<template>
  <div class="min-h-96">
    <form class="flex flex-col gap-5" @submit.prevent="handleFormSubmit">
      <div>
        <div class="text-xl font-semibold text-gray-100 mb-2">Select Reporter</div>
        <p class="text-sm text-gray-400 mb-5">
          Choose an existing contact or create a new reporter for this case.
        </p>

        <!-- Search Section -->
        <div class="mb-5">
          <div class="flex gap-3 items-center mb-4">
            <div class="relative flex items-center gap-2 border border-gray-600 rounded-lg px-3 py-2.5 bg-gray-700 flex-1 max-w-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50">
              <i-mdi-magnify class="w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or phone..."
                class="border-0 outline-none w-full text-sm bg-transparent text-gray-100 placeholder-gray-500"
                @input="handleSearchInput"
              />
            </div>
            <button
              type="button"
              class="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap"
              @click="createNewReporter"
            >
              <i-mdi-plus class="w-5 h-5" />
              New Reporter
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center gap-3 p-5 text-center text-gray-400">
          <div class="w-5 h-5 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
          <span>Searching reporters...</span>
        </div>

        <!-- Search Results -->
        <div class="flex flex-col gap-2 max-h-96 overflow-y-auto" v-else-if="shouldShowResults && filteredContacts.length">
          <div class="py-2 text-sm text-gray-400 border-b border-gray-700 mb-3">
            <span>{{ filteredContacts.length }} reporter(s) found</span>
          </div>
          <div
            v-for="contact in filteredContacts"
            :key="getContactId(contact)"
            class="flex items-center gap-3 border rounded-lg p-3 bg-gray-800 cursor-pointer transition-all hover:bg-gray-700 hover:border-blue-500"
            :class="{ 'border-blue-500 bg-blue-900/20': isSelected(contact), 'border-gray-700': !isSelected(contact) }"
            @click="selectExistingReporter(contact)"
          >
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white font-semibold text-sm flex-shrink-0">
              <span>{{ getInitials(getValue(contact, 'fullname') || 'NA') }}</span>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-1">
                  <div class="font-semibold text-base text-gray-100 leading-tight truncate">
                    {{ getValue(contact, 'fullname') || "Unnamed Reporter" }}
                  </div>
                  <div class="text-gray-400 text-sm leading-tight">
                    {{ getValue(contact, 'phone') || 'No phone' }}
                  </div>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex gap-2 flex-wrap">
                    <span v-if="getValue(contact, 'age')" class="border border-gray-600 rounded-full px-2.5 py-1 text-xs font-medium bg-gray-700 text-gray-300 whitespace-nowrap">{{ getValue(contact, 'age') }}y</span>
                    <span v-if="getValue(contact, 'sex')" class="border border-gray-600 rounded-full px-2.5 py-1 text-xs font-medium bg-gray-700 text-gray-300 whitespace-nowrap">{{ getValue(contact, 'sex') }}</span>
                    <span v-if="getValue(contact, 'location')" class="bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap flex items-center gap-1">
                      <i-mdi-map-marker class="w-3 h-3" />
                      {{ getValue(contact, 'location') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selection Indicator -->
            <div class="flex-shrink-0">
              <i-mdi-check-circle v-if="isSelected(contact)" class="w-5 h-5 text-blue-400" />
              <i-mdi-chevron-right v-else class="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="shouldShowResults && !filteredContacts.length" class="text-center p-10 text-gray-400 bg-gray-800 rounded-lg border border-gray-700">
          <i-mdi-account-search class="mx-auto text-5xl mb-3 opacity-50" />
          <div class="text-base font-medium mb-1">No reporters found</div>
          <div class="text-sm opacity-70">Try searching with a different name or phone number</div>
        </div>

        <!-- Search Prompt -->
        <div v-else-if="!searchQuery.trim()" class="text-center p-10 text-gray-400 bg-gray-800 rounded-lg border border-gray-700">
          <i-mdi-account-group class="mx-auto text-5xl mb-3 opacity-50" />
          <div class="text-base font-medium mb-1">Start typing to search for existing reporters</div>
          <div class="text-sm opacity-70">Or click "New Reporter" to create a new one</div>
        </div>

        <!-- Selected Reporter Summary -->
        <div v-if="selectedReporter" class="mt-5 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <div class="text-sm font-semibold text-blue-400 mb-3">Selected Reporter:</div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center bg-blue-600 text-white font-semibold text-sm flex-shrink-0">
              <span>{{ getInitials(getValue(selectedReporter, 'fullname') || 'NR') }}</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-gray-100">{{ getValue(selectedReporter, 'fullname') || 'New Reporter' }}</div>
              <div class="text-sm text-gray-400 mt-0.5">
                {{ getValue(selectedReporter, 'phone') || 'No phone' }} • 
                {{ getValue(selectedReporter, 'age') || 'Age unknown' }} • 
                {{ getValue(selectedReporter, 'sex') || 'Gender unknown' }}
              </div>
            </div>
            <button type="button" @click="clearSelection" class="p-1.5 rounded-md border border-gray-600 hover:bg-gray-700 hover:border-red-500 text-gray-400 hover:text-red-400 transition-colors">
              <i-mdi-close class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-3 justify-between mt-6 pt-5 border-t border-gray-700">
        <button type="button" class="px-4 py-2 bg-transparent text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-red-500 hover:text-red-400 transition-colors" @click="cancelForm">Cancel</button>
        <div class="flex gap-3">
          <button type="button" class="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors" @click="handleSkipStep">Skip</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!selectedReporter && !isNewReporter">
            {{ selectedReporter ? 'Continue with Selected Reporter' : (isNewReporter ? 'Create New Reporter' : 'Select a Reporter') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useReporterStore } from "@/stores/reporters"

const props = defineProps({
  currentStep: { type: Number, required: true },
  searchQuery: { type: String, default: '' },
  filteredContacts: { type: Array, default: () => [] },
  selectedReporter: { type: Object, default: null }
})

const emit = defineEmits([
  "validate-and-proceed", 
  "skip-step", 
  "cancel-form",
  "search-change",
  "select-reporter",
  "create-new-reporter"
])

const reportersStore = useReporterStore()

const searchQuery = ref(props.searchQuery || "")
const debouncedQuery = ref("")
const selectedReporter = ref(props.selectedReporter)
const isLoading = ref(false)
const isNewReporter = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    if (!reportersStore.reporters.length) {
      await reportersStore.listReporters()
    }
  } catch (error) {
    console.error('Error loading reporters:', error)
  } finally {
    isLoading.value = false
  }
})

let debounceTimeout
watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    debouncedQuery.value = newVal.trim()
    emit('search-change', newVal.trim())
  }, 300)
})

onBeforeUnmount(() => clearTimeout(debounceTimeout))

watch(() => props.searchQuery, (newQuery) => {
  if (newQuery !== searchQuery.value) {
    searchQuery.value = newQuery
  }
})

watch(() => props.selectedReporter, (newReporter) => {
  selectedReporter.value = newReporter
})

const getFieldIndex = (fieldName) => {
  const mapping = reportersStore.reporters_k?.[`contact_${fieldName}`]
  if (mapping && Array.isArray(mapping) && mapping.length > 0) {
    return mapping[0]
  }
  const fallbackMapping = reportersStore.reporters_k?.[fieldName]
  if (fallbackMapping && Array.isArray(fallbackMapping) && fallbackMapping.length > 0) {
    return fallbackMapping[0]
  }
  return null
}

const getValue = (contact, fieldName) => {
  if (!contact || !Array.isArray(contact)) return ""
  const idx = getFieldIndex(fieldName)
  if (idx !== null && idx >= 0 && idx < contact.length) {
    return contact[idx] || ""
  }
  return ""
}

const getContactId = (contact) => {
  if (!contact || !Array.isArray(contact)) return Math.random().toString()
  const idFields = ['id', '_id', 'reporter_id']
  for (const fieldName of idFields) {
    const value = getValue(contact, fieldName)
    if (value) return value.toString()
  }
  const name = getValue(contact, 'fullname')
  const phone = getValue(contact, 'phone')
  return `${name}-${phone}`.replace(/\s+/g, '-')
}

const shouldShowResults = computed(() => {
  return debouncedQuery.value.length >= 2
})

const filteredContacts = computed(() => {
  if (!shouldShowResults.value) return []
  const q = debouncedQuery.value.toLowerCase()
  const contacts = reportersStore.reporters || []
  const filtered = contacts.filter((contact) => {
    if (!Array.isArray(contact)) return false
    const name = getValue(contact, "fullname").toLowerCase()
    const phone = getValue(contact, "phone").toLowerCase()
    return name.includes(q) || phone.includes(q)
  })
  return filtered.slice(0, 10)
})

const handleSearchInput = (event) => {
  searchQuery.value = event.target.value
}

const selectExistingReporter = (contact) => {
  selectedReporter.value = contact
  isNewReporter.value = false
  emit('select-reporter', contact)
}

const createNewReporter = () => {
  selectedReporter.value = null
  isNewReporter.value = true
  emit('create-new-reporter')
  emit("validate-and-proceed", null)
}

const clearSelection = () => {
  selectedReporter.value = null
  isNewReporter.value = false
  emit('select-reporter', null)
}

const isSelected = (contact) => {
  if (!selectedReporter.value || !contact) return false
  return getContactId(contact) === getContactId(selectedReporter.value)
}

const handleFormSubmit = () => {
  if (selectedReporter.value || isNewReporter.value) {
    emit("validate-and-proceed", selectedReporter.value)
  }
}

const handleSkipStep = () => {
  emit("skip-step", 1)
}

const cancelForm = () => {
  emit("cancel-form")
}

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'NA'
  return name.split(" ")
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
</script>