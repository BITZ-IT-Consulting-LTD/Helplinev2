<template>
  <div class="min-h-96">
    <div class="flex flex-col gap-5">
      <div>
        <div class="text-xl font-semibold text-gray-100 mb-2">Select or Create Reporter</div>
        <p class="text-sm text-gray-400 mb-5">
          Search for an existing reporter or create a new one. Only the reporter's name is required.
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
              @click="openCreateReporterForm"
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
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white font-semibold text-sm flex-shrink-0">
              <span>{{ getInitials(getValue(contact, 'fullname') || 'NA') }}</span>
            </div>

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
        <div v-else-if="!searchQuery.trim() && !showCreateForm" class="text-center p-10 text-gray-400 bg-gray-800 rounded-lg border border-gray-700">
          <i-mdi-account-group class="mx-auto text-5xl mb-3 opacity-50" />
          <div class="text-base font-medium mb-1">Start typing to search for existing reporters</div>
          <div class="text-sm opacity-70">Or click "New Reporter" to create a new one</div>
        </div>

        <!-- Combined Selected Reporter Summary & ID Display -->
        <div v-if="(selectedReporter || reporterId) && !showCreateForm" class="mt-5 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <div class="flex items-start justify-between mb-3">
            <div class="text-sm font-semibold text-blue-400">Selected Reporter:</div>
            <button type="button" @click="clearSelection" class="p-1.5 rounded-md border border-gray-600 hover:bg-gray-700 hover:border-red-500 text-gray-400 hover:text-red-400 transition-colors">
              <i-mdi-close class="w-4 h-4" />
            </button>
          </div>
          
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white font-semibold text-sm flex-shrink-0">
              <span>{{ getInitials(getValue(selectedReporter, 'fullname') || 'NR') }}</span>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-base text-gray-100 mb-1">
                {{ getValue(selectedReporter, 'fullname') || 'Reporter' }}
              </div>
              
              <div class="text-sm text-gray-400 space-y-1 mb-3">
                <div>{{ getValue(selectedReporter, 'phone') || 'No phone' }}</div>
                <div>
                  {{ getValue(selectedReporter, 'age') || 'Age unknown' }} • 
                  {{ getValue(selectedReporter, 'sex') || 'Gender unknown' }}
                </div>
              </div>

              <!-- Reporter ID -->
              <div v-if="reporterId" class="flex items-center gap-2 p-2 bg-green-900/30 border border-green-600/40 rounded-md">
                <i-mdi-check-circle class="w-5 h-5 text-green-400 flex-shrink-0" />
                <div class="flex-1">
                  <div class="text-xs font-medium text-green-400">Reporter ID</div>
                  <div class="text-sm font-bold text-green-300">{{ reporterId }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Reporter Form -->
        <div v-if="showCreateForm" class="mt-5 p-5 bg-gray-800 border border-gray-700 rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-100">Create New Reporter</h3>
            <button type="button" @click="closeCreateForm" class="text-gray-400 hover:text-gray-100 transition-colors">
              <i-mdi-close class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="border-b border-gray-700 pb-4">
              <h4 class="text-md font-semibold text-gray-100 mb-4">Basic Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Reporter Name *
                  </label>
                  <input
                    v-model="reporterForm.fname"
                    type="text"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter reporter's full name"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    v-model="reporterForm.dob"
                    type="date"
                    @change="handleDobChange"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                  <p v-if="reporterForm.dob" class="text-xs text-gray-400 mt-1">
                    Auto-fills Age and Age Group
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    v-model="reporterForm.age"
                    type="number"
                    :readonly="!!reporterForm.dob"
                    :class="[
                      'w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50',
                      reporterForm.dob ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700'
                    ]"
                    placeholder="Age"
                  />
                </div>

                <div>
                  <BaseSelect
                    id="reporter-age-group"
                    label="Age Group"
                    v-model="reporterForm.ageGroup"
                    placeholder="Select Age Group (auto-filled from DOB)"
                    :category-id="101"
                    :disabled="!!reporterForm.dob"
                  />
                  <p v-if="reporterForm.dob" class="text-xs text-gray-400 mt-1">
                    Auto-selected based on DOB
                  </p>
                </div>

                <div>
                  <BaseSelect
                    id="reporter-sex"
                    label="Sex"
                    v-model="reporterForm.sex"
                    placeholder="Select sex"
                    :category-id="120"
                  />
                </div>

                <div>
                  <BaseSelect
                    id="reporter-location"
                    label="Location"
                    v-model="reporterForm.location"
                    placeholder="Select location"
                    :category-id="88"
                  />
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="border-b border-gray-700 pb-4">
              <h4 class="text-md font-semibold text-gray-100 mb-4">Contact Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    v-model="reporterForm.phone"
                    type="tel"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Alternative Phone
                  </label>
                  <input
                    v-model="reporterForm.phone2"
                    type="tel"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Alternative phone"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    v-model="reporterForm.email"
                    type="email"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter email address"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Nearest Landmark
                  </label>
                  <input
                    v-model="reporterForm.landmark"
                    type="text"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter landmark"
                  />
                </div>
              </div>
            </div>

            <!-- Additional Details -->
            <div>
              <h4 class="text-md font-semibold text-gray-100 mb-4">Additional Details</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <BaseSelect
                    id="reporter-nationality"
                    label="Nationality"
                    v-model="reporterForm.nationality"
                    placeholder="Select nationality"
                    :category-id="126"
                  />
                </div>

                <div>
                  <BaseSelect
                    id="reporter-language"
                    label="Language"
                    v-model="reporterForm.language"
                    placeholder="Select language"
                    :category-id="123"
                  />
                </div>

                <div>
                  <BaseSelect
                    id="reporter-tribe"
                    label="Tribe"
                    v-model="reporterForm.tribe"
                    placeholder="Select tribe"
                    :category-id="133"
                  />
                </div>

                <div>
                  <BaseSelect
                    id="reporter-id-type"
                    label="ID Type"
                    v-model="reporterForm.idType"
                    placeholder="Select ID type"
                    :category-id="362409"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    ID Number
                  </label>
                  <input
                    v-model="reporterForm.idNumber"
                    type="text"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter ID number"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Is Refugee?
                  </label>
                  <div class="flex gap-4 mt-2">
                    <label class="flex items-center gap-1.5 cursor-pointer">
                      <input
                        v-model="reporterForm.isRefugee"
                        type="radio"
                        value="1"
                        class="w-4 h-4 text-blue-600"
                      />
                      <span class="text-sm text-gray-300">Yes</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer">
                      <input
                        v-model="reporterForm.isRefugee"
                        type="radio"
                        value="0"
                        class="w-4 h-4 text-blue-600"
                      />
                      <span class="text-sm text-gray-300">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Create Button -->
            <div class="flex gap-3 justify-end pt-4 border-t border-gray-700">
              <button
                type="button"
                @click="closeCreateForm"
                class="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="handleCreateReporter"
                :disabled="isCreating"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="isCreating" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ isCreating ? 'Creating...' : 'Create Reporter' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 justify-between mt-6 pt-5 border-t border-gray-700">
        <button type="button" class="px-4 py-2 bg-transparent text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-red-500 hover:text-red-400 transition-colors" @click="$emit('cancel-form')">Cancel</button>
        <div class="flex gap-3">
          <button 
            type="button" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            :disabled="!reporterId"
            @click="$emit('validate-and-proceed')"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, reactive } from "vue"
import { useReporterStore } from "@/stores/reporters"
import BaseSelect from "@/components/base/BaseSelect.vue"

const props = defineProps({
  currentStep: { type: Number, required: true },
  searchQuery: { type: String, default: '' },
  filteredContacts: { type: Array, default: () => [] },
  selectedReporter: { type: Object, default: null },
  reporterId: { type: String, default: null }
})

const emit = defineEmits([
  "validate-and-proceed", 
  "cancel-form",
  "search-change",
  "select-reporter",
  "create-new-reporter",
  "reporter-created"
])

const reportersStore = useReporterStore()

const searchQuery = ref(props.searchQuery || "")
const debouncedQuery = ref("")
const selectedReporter = ref(props.selectedReporter)
const isLoading = ref(false)
const showCreateForm = ref(false)
const isCreating = ref(false)

const reporterForm = reactive({
  fname: '',
  age: '',
  dob: '',
  ageGroup: '',
  sex: '',
  location: '',
  landmark: '',
  nationality: '',
  language: '',
  tribe: '',
  phone: '',
  phone2: '',
  email: '',
  idType: '',
  idNumber: '',
  isRefugee: '0'
})

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
  if (!contact || !Array.isArray(contact)) return null
  
  // Try to get the actual ID field first (these are most reliable)
  const idFields = ['id', '_id', 'reporter_id', 'contact_id']
  for (const fieldName of idFields) {
    const value = getValue(contact, fieldName)
    if (value) {
      console.log(`Found reporter ID from field ${fieldName}:`, value)
      return value.toString()
    }
  }
  
  // If no ID found, try to get the first element (often the ID in array structures)
  if (contact.length > 0 && contact[0]) {
    console.log('Using first array element as reporter ID:', contact[0])
    return contact[0].toString()
  }
  
  // Fallback to name-phone combination (last resort)
  const name = getValue(contact, 'fullname')
  const phone = getValue(contact, 'phone')
  const fallbackId = `${name}-${phone}`.replace(/\s+/g, '-')
  console.log('Using fallback ID:', fallbackId)
  return fallbackId
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
  showCreateForm.value = false
}

const selectExistingReporter = (contact) => {
  selectedReporter.value = contact
  showCreateForm.value = false
  
  // CRITICAL FIX: Extract the reporter ID from the selected contact
  const extractedId = getContactId(contact)
  
  console.log('Selected existing reporter:', {
    contact,
    extractedId,
    fullname: getValue(contact, 'fullname')
  })
  
  // Emit both the reporter data AND the reporter ID
  emit('select-reporter', contact)
  
  // This is the key fix - emit the reporter ID for existing reporters too!
  if (extractedId) {
    emit('reporter-created', extractedId)
  } else {
    console.error('Could not extract reporter ID from contact')
  }
}

const openCreateReporterForm = () => {
  showCreateForm.value = true
  selectedReporter.value = null
  searchQuery.value = ''
  emit('create-new-reporter')
}

const closeCreateForm = () => {
  showCreateForm.value = false
  Object.assign(reporterForm, {
    fname: '',
    age: '',
    dob: '',
    ageGroup: '',
    sex: '',
    location: '',
    landmark: '',
    nationality: '',
    language: '',
    tribe: '',
    phone: '',
    phone2: '',
    email: '',
    idType: '',
    idNumber: '',
    isRefugee: '0'
  })
}

const clearSelection = () => {
  selectedReporter.value = null
  emit('select-reporter', null)
  emit('reporter-created', null)
}

const isSelected = (contact) => {
  if (!selectedReporter.value || !contact) return false
  return getContactId(contact) === getContactId(selectedReporter.value)
}

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'NA'
  return name.split(" ")
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Age calculation helpers
const calculateAge = (dob) => {
  if (!dob) return null
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age >= 0 ? Math.floor(age) : null
}

const getAgeGroupFromAge = (age) => {
  if (age === null || age < 0) return ''
  if (age < 6) return '0-5'
  if (age <= 12) return '6-12'
  if (age <= 17) return '13-17'
  if (age <= 24) return '18-24'
  if (age <= 35) return '25-35'
  if (age <= 50) return '36-50'
  return '51+'
}

const getAgeGroupId = (ageGroupText) => {
  const map = {
    '0-5': '361950',
    '6-12': '361951',
    '13-17': '361952',
    '18-24': '361953',
    '25-35': '361954',
    '36-50': '361955',
    '51+': '361956'
  }
  return map[ageGroupText] || ''
}

const handleDobChange = () => {
  if (reporterForm.dob) {
    const calculatedAge = calculateAge(reporterForm.dob)
    if (calculatedAge !== null) {
      reporterForm.age = calculatedAge.toString()
      const ageGroupText = getAgeGroupFromAge(calculatedAge)
      reporterForm.ageGroup = getAgeGroupId(ageGroupText)
    }
  } else {
    reporterForm.age = ''
    reporterForm.ageGroup = ''
  }
}

const getSexId = (sex) => {
  const map = {
    'Male': '121',
    'Female': '122',
    'Other': '123'
  }
  return map[sex] || ''
}

const handleCreateReporter = async () => {
  if (!reporterForm.fname || !reporterForm.fname.trim()) {
    alert('Reporter name is required')
    return
  }

  isCreating.value = true

  try {
    const timestamp = Date.now()
    const timestampSeconds = (timestamp / 1000).toFixed(3)
    const userId = "100"
    const srcUid = `walkin-${userId}-${timestamp}`
    const srcUid2 = `${srcUid}-1`
    const srcCallId = srcUid2

    const dobTimestamp = reporterForm.dob ? Math.floor(new Date(reporterForm.dob).getTime() / 1000) : ''

    const getValueOrDefault = (value, defaultValue = "") => {
      return value !== null && value !== undefined && value !== "" ? value : defaultValue
    }

    const payload = {
      ".id": "",
      src: "walkin",
      src_ts: timestampSeconds,
      src_uid: srcUid,
      src_uid2: srcUid2,
      src_callid: srcCallId,
      src_usr: userId,
      src_vector: "2",
      src_address: getValueOrDefault(reporterForm.phone),
      
      fname: reporterForm.fname,
      age_t: "0",
      age: getValueOrDefault(reporterForm.age),
      dob: dobTimestamp.toString(),
      age_group: getAgeGroupFromAge(parseInt(reporterForm.age)),
      age_group_id: getValueOrDefault(reporterForm.ageGroup),
      
      sex: reporterForm.sex ? `^${reporterForm.sex}` : "",
      sex_id: getSexId(reporterForm.sex),
      
      location_id: getValueOrDefault(reporterForm.location),
      landmark: getValueOrDefault(reporterForm.landmark),
      nationality_id: getValueOrDefault(reporterForm.nationality),
      lang_id: getValueOrDefault(reporterForm.language),
      tribe_id: getValueOrDefault(reporterForm.tribe),
      
      phone: getValueOrDefault(reporterForm.phone),
      phone2: getValueOrDefault(reporterForm.phone2),
      email: getValueOrDefault(reporterForm.email),
      
      national_id_type_id: getValueOrDefault(reporterForm.idType),
      national_id: getValueOrDefault(reporterForm.idNumber),
      
      is_refugee: getValueOrDefault(reporterForm.isRefugee, "0"),
      
      contact_uuid_id: "-1",
      disposition_id: "363034",
      activity_id: "",
      activity_ca_id: ""
    }

    const result = await reportersStore.createReporter(payload)
    
    if (result) {
      let extractedId = null
      
      // Extract ID from response
      if (result.reporters && Array.isArray(result.reporters) && result.reporters.length > 0) {
        extractedId = result.reporters[0][0]
      } else if (result.id) {
        extractedId = result.id
      }
      
      console.log('New reporter created with ID:', extractedId)
      
      if (extractedId) {
        emit('reporter-created', extractedId)
        showCreateForm.value = false
        closeCreateForm()
      } else {
        throw new Error('No reporter ID returned from server')
      }
    } else {
      throw new Error('No response from server')
    }

  } catch (error) {
    console.error('Error creating reporter:', error)
    alert(`Failed to create reporter: ${error.message}`)
  } finally {
    isCreating.value = false
  }
}
</script>