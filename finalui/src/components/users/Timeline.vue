<template>
  <div 
    class="relative border-l-2 pl-6 space-y-6"
    :class="isDarkMode ? 'border-gray-700' : 'border-gray-300'"
  >

    <div
      v-for="user in store.users"
      :key="getValue(user, 'id')"
      class="relative shadow-xl rounded-lg p-6 border"
      :class="isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'"
    >
      <!-- Timeline Dot -->
      <div 
        class="absolute -left-[1.875rem] top-6 w-6 h-6 rounded-full border-4"
        :class="isDarkMode 
          ? 'bg-blue-500 border-gray-900' 
          : 'bg-amber-600 border-gray-50'"
      ></div>

      <!-- User Info -->
      <h3 
        class="text-lg font-semibold"
        :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'"
      >
        {{ getValue(user, 'first_name') }} {{ getValue(user, 'last_name') }}
      </h3>

      <p 
        class="text-sm mt-1"
        :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
      >
        Username: <span 
          class="font-medium"
          :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          {{ getValue(user, 'usn') }}
        </span>
      </p>

      <p 
        class="text-sm mt-1"
        :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
      >
        Created By: {{ getValue(user, 'created_by') || 'N/A' }}
      </p>

      <p 
        class="text-sm mt-1"
        :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
      >
        Created On: {{ formatDate(getValue(user, 'created_on')) }}
      </p>

      <!-- Role Badge -->
      <span
        class="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium uppercase border"
        :class="isDarkMode 
          ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' 
          : 'bg-amber-100 text-amber-700 border-amber-300'"
      >
        {{ getRoleName(getValue(user, 'role')) }}
      </span>
    </div>

  </div>
</template>

<script setup>
import { inject } from 'vue'
import { useUserStore } from "@/stores/users"

const store = useUserStore()

// Inject theme
const isDarkMode = inject('isDarkMode')

const roleMap = {
  "1": "Counsellor",
  "2": "Supervisor",
  "3": "Case Manager",
  "4": "Case Worker",
  "5": "Partner",
  "6": "Media Account",
  "99": "Administrator"
}

const getValue = (userItem, key) => {
  if (!store.users_k?.[key]) return null
  return userItem[store.users_k[key][0]]
}

const getRoleName = (roleId) => {
  return roleMap[String(roleId)] || roleId || 'N/A'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'

  const ms = timestamp < 10000000000 
    ? timestamp * 1000 
    : timestamp * 3600 * 1000

  return new Date(ms).toLocaleString()
}
</script>