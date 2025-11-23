<template>
  <div class="min-h-96">
    <div class="flex flex-col gap-3">
      <div class="text-xl font-semibold text-gray-100 mb-2">Review Case Information</div>
      <p class="text-sm text-gray-400 mb-5">
        Please review all the information before submitting the case.
      </p>

      <!-- Reporter Information -->
      <div class="border border-gray-700 rounded-lg bg-gray-800">
        <div class="flex items-center justify-between p-3 px-4 border-b border-gray-700">
          <div class="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <i-mdi-account class="w-5 h-5 text-blue-400" />
            Reporter Information
          </div>
          <button class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm hover:bg-gray-600 transition-colors" @click="goToStep(1)">
            <i-mdi-pencil class="w-4 h-4" />
            Edit
          </button>
        </div>
        <div class="p-4">
          <div v-if="formData.step1.selectedReporter || reporterId" class="p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white font-semibold text-sm flex-shrink-0">
                <span>{{ getReporterInitials() }}</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-base text-gray-100 mb-1">
                  {{ getReporterName() }}
                </div>
                
                <div class="text-sm text-gray-400 space-y-1 mb-3">
                  <div v-if="getReporterPhone()">
                    <i-mdi-phone class="w-4 h-4 inline mr-1" />
                    {{ getReporterPhone() }}
                  </div>
                  <div v-if="getReporterAge() || getReporterGender()">
                    <i-mdi-account-details class="w-4 h-4 inline mr-1" />
                    {{ getReporterAge() || 'Age unknown' }} • {{ getReporterGender() || 'Gender unknown' }}
                  </div>
                  <div v-if="getReporterLocation()">
                    <i-mdi-map-marker class="w-4 h-4 inline mr-1" />
                    {{ getReporterLocation() }}
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

          <div v-else class="p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-center text-gray-400">
            <i-mdi-account-alert class="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div class="text-sm">No reporter information available</div>
          </div>
        </div>
      </div>

      <!-- Case Details -->
      <div class="border border-gray-700 rounded-lg bg-gray-800">
        <div class="flex items-center justify-between p-3 px-4 border-b border-gray-700">
          <div class="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <i-mdi-folder class="w-5 h-5 text-blue-400" />
            Case Details
          </div>
          <button class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm hover:bg-gray-600 transition-colors" @click="goToStep(2)">
            <i-mdi-pencil class="w-4 h-4" />
            Edit
          </button>
        </div>
        <div class="p-3 px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="font-semibold text-gray-400 text-sm">GBV Related</div>
            <div class="text-gray-100">{{ formData.step2.isGBVRelated || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Case Category</div>
            <div class="text-gray-100">{{ formData.step2.categories || "N/A" }}</div>
          </div>
          <div class="col-span-2">
            <div class="font-semibold text-gray-400 text-sm">Case Narrative</div>
            <div class="text-gray-100">{{ formData.step2.narrative || "N/A" }}</div>
          </div>
          <div class="col-span-2">
            <div class="font-semibold text-gray-400 text-sm">Case Plan</div>
            <div class="text-gray-100">{{ formData.step2.plan || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Priority</div>
            <div>
              <span class="inline-block px-2 py-1 rounded text-xs font-medium" :class="getPriorityClass(formData.step2.priority)">
                {{ formatPriority(formData.step2.priority) }}
              </span>
            </div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Status</div>
            <div>
              <span class="inline-block px-2 py-1 rounded text-xs font-medium" :class="getStatusClass(formData.step2.status)">
                {{ formatStatus(formData.step2.status) }}
              </span>
            </div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Department</div>
            <div class="text-gray-100">{{ formatDepartment(formData.step2.department) || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Escalated To</div>
            <div class="text-gray-100">{{ formatEscalation(formData.step2.escalatedTo) }}</div>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="border border-gray-700 rounded-lg bg-gray-800">
        <div class="flex items-center justify-between p-3 px-4 border-b border-gray-700">
          <div class="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <i-mdi-information class="w-5 h-5 text-blue-400" />
            Additional Information
          </div>
          <button class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm hover:bg-gray-600 transition-colors" @click="goToStep(3)">
            <i-mdi-pencil class="w-4 h-4" />
            Edit
          </button>
        </div>
        <div class="p-3 px-4 grid grid-cols-1 gap-4">
          <!-- Clients -->
          <div>
            <div class="font-semibold text-gray-400 text-sm mb-2">Clients ({{ formData.step3.clients.length }})</div>
            <div v-if="formData.step3.clients.length > 0" class="flex flex-col gap-2">
              <div v-for="(client, index) in formData.step3.clients" :key="index" class="p-2 bg-gray-700/50 rounded border border-gray-600">
                <div class="font-medium text-gray-100 text-sm">{{ client.name || 'Unnamed' }}</div>
                <div class="text-xs text-gray-400">{{ client.age || 'Age unknown' }} • {{ client.sex || 'Gender unknown' }}</div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-sm italic">No clients added</div>
          </div>

          <!-- Perpetrators -->
          <div>
            <div class="font-semibold text-gray-400 text-sm mb-2">Perpetrators ({{ formData.step3.perpetrators.length }})</div>
            <div v-if="formData.step3.perpetrators.length > 0" class="flex flex-col gap-2">
              <div v-for="(perpetrator, index) in formData.step3.perpetrators" :key="index" class="p-2 bg-gray-700/50 rounded border border-gray-600">
                <div class="font-medium text-gray-100 text-sm">{{ perpetrator.name || 'Unnamed' }}</div>
                <div class="text-xs text-gray-400">{{ perpetrator.age || 'Age unknown' }} • {{ perpetrator.sex || 'Gender unknown' }}</div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-sm italic">No perpetrators added</div>
          </div>

          <!-- Services Offered -->
          <div>
            <div class="font-semibold text-gray-400 text-sm">Services Offered</div>
            <div class="text-gray-100">{{ formData.step3.servicesOfferedText.length > 0 ? formData.step3.servicesOfferedText.join(', ') : "None" }}</div>
          </div>

          <!-- Referral Source -->
          <div>
            <div class="font-semibold text-gray-400 text-sm">How did you know about 116?</div>
            <div class="text-gray-100">{{ formData.step3.referralSource || "N/A" }}</div>
          </div>

          <!-- Attachments -->
          <div>
            <div class="font-semibold text-gray-400 text-sm mb-2">Attachments ({{ formData.step3.attachments.length }})</div>
            <div v-if="formData.step3.attachments.length > 0" class="flex flex-col gap-2">
              <div v-for="(attachment, index) in formData.step3.attachments" :key="index" class="p-2 bg-gray-700/50 rounded border border-gray-600 text-sm">
                <div class="text-gray-100">{{ attachment.name }}</div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-sm italic">No attachments</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-3 justify-end mt-6 pt-5 border-t border-gray-700">
      <button type="button" class="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors" @click="goToStep(3)">Back</button>
      <button type="button" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2" @click="submitCase">
        <i-mdi-check class="w-5 h-5" />
        Create Case
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"
import { useUserStore } from "@/stores/users"
import { useReporterStore } from "@/stores/reporters"

const props = defineProps({
  currentStep: { type: Number, required: true },
  formData: { type: Object, required: true },
  reporterId: { type: String, default: null }
})

const emit = defineEmits(["go-to-step", "submit-case"])

const userStore = useUserStore()
const reporterStore = useReporterStore()

onMounted(async () => {
  if (!userStore.users.length) {
    await userStore.listUsers()
  }
})

function goToStep(step) {
  emit("go-to-step", step)
}

function submitCase() {
  emit("submit-case", props.formData)
}

// Reporter helper functions
const getReporterFieldIndex = (fieldName) => {
  const mapping = reporterStore.reporters_k?.[`contact_${fieldName}`]
  if (mapping && Array.isArray(mapping) && mapping.length > 0) {
    return mapping[0]
  }
  const fallbackMapping = reporterStore.reporters_k?.[fieldName]
  if (fallbackMapping && Array.isArray(fallbackMapping) && fallbackMapping.length > 0) {
    return fallbackMapping[0]
  }
  return null
}

const getReporterValue = (contact, fieldName) => {
  if (!contact || !Array.isArray(contact)) return ""
  const idx = getReporterFieldIndex(fieldName)
  if (idx !== null && idx >= 0 && idx < contact.length) {
    return contact[idx] || ""
  }
  return ""
}

function getReporterName() {
  const reporter = props.formData.step1.selectedReporter
  if (!reporter) return 'Reporter'
  return getReporterValue(reporter, 'fullname') || 'Reporter'
}

function getReporterPhone() {
  const reporter = props.formData.step1.selectedReporter
  if (!reporter) return ''
  return getReporterValue(reporter, 'phone')
}

function getReporterAge() {
  const reporter = props.formData.step1.selectedReporter
  if (!reporter) return ''
  return getReporterValue(reporter, 'age')
}

function getReporterGender() {
  const reporter = props.formData.step1.selectedReporter
  if (!reporter) return ''
  return getReporterValue(reporter, 'sex')
}

function getReporterLocation() {
  const reporter = props.formData.step1.selectedReporter
  if (!reporter) return ''
  return getReporterValue(reporter, 'location')
}

function getReporterInitials() {
  const name = getReporterName()
  if (!name || name === 'Reporter') return 'NR'
  
  return name.split(" ")
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatPriority(priority) {
  if (!priority) return 'N/A'
  switch (Number(priority)) {
    case 3:
      return 'High'
    case 2:
      return 'Medium'
    case 1:
      return 'Low'
    default:
      return 'Unknown'
  }
}

function getPriorityClass(priority) {
  switch (Number(priority)) {
    case 3:
      return 'bg-red-600/20 text-red-400 border border-red-600/30'
    case 2:
      return 'bg-amber-600/20 text-amber-400 border border-amber-600/30'
    case 1:
      return 'bg-green-600/20 text-green-400 border border-green-600/30'
    default:
      return 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
  }
}

function formatStatus(status) {
  if (!status) return 'N/A'
  switch (Number(status)) {
    case 1:
      return 'Open'
    case 2:
      return 'Closed'
    default:
      return 'Unknown'
  }
}

function getStatusClass(status) {
  switch (Number(status)) {
    case 1:
      return 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
    case 2:
      return 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
    default:
      return 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
  }
}

function formatDepartment(value) {
  if (!value) return ""
  const map = {
    "116": "116",
    "labor": "Labor"
  }
  return map[value] || value
}

function formatEscalation(value) {
  if (!value || value === "0") return "None"
  
  // Try to find user by ID
  const user = userStore.users.find(u => {
    const userId = getValue(u, 'id') || getValue(u, 'user_id')
    return userId === value
  })
  
  if (user) {
    const name = getUserName(user)
    const role = getUserRole(user)
    return `${name} - ${role}`
  }
  
  return `User ID: ${value}`
}

// Helper functions for user data
const getFieldIndex = (fieldName) => {
  const mapping = userStore.users_k?.[fieldName]
  if (mapping && Array.isArray(mapping) && mapping.length > 0) {
    return mapping[0]
  }
  return null
}

const getValue = (user, fieldName) => {
  if (!user || !Array.isArray(user)) return ""
  const idx = getFieldIndex(fieldName)
  if (idx !== null && idx >= 0 && idx < user.length) {
    return user[idx] || ""
  }
  return ""
}

const getUserName = (user) => {
  const fullname = getValue(user, 'fullname') || getValue(user, 'name')
  const fname = getValue(user, 'fname') || getValue(user, 'first_name')
  const lname = getValue(user, 'lname') || getValue(user, 'last_name')
  
  if (fullname) return fullname
  if (fname && lname) return `${fname} ${lname}`
  if (fname) return fname
  return "Unnamed User"
}

const getUserRole = (user) => {
  return getValue(user, 'role') || getValue(user, 'user_role') || getValue(user, 'role_name') || "No Role"
}
</script>