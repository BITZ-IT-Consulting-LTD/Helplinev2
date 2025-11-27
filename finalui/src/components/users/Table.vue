<template>
  <div 
    class="rounded-lg shadow-xl border overflow-hidden"
    :class="isDarkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200'"
  >
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr 
            class="border-b"
            :class="isDarkMode 
              ? 'bg-gray-900/60 border-gray-700' 
              : 'bg-gray-50 border-gray-200'"
          >
            <th 
              class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              Username
            </th>
            <th 
              class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              First Name
            </th>
            <th 
              class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              Role
            </th>
            <th 
              class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              Created On
            </th>
            <th 
              class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              Created By
            </th>
          </tr>
        </thead>

        <tbody 
          class="divide-y"
          :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'"
        >
          <tr
            v-for="user in store.users"
            :key="getValue(user, 'id')"
            class="transition-all duration-200"
            :class="isDarkMode 
              ? 'hover:bg-gray-700/30' 
              : 'hover:bg-gray-50'"
          >
            <td 
              class="px-6 py-4 text-sm"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              {{ getValue(user, 'usn') }}
            </td>
            <td 
              class="px-6 py-4 text-sm"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              {{ getValue(user, 'contact_fname') }}
            </td>
            <td class="px-6 py-4 text-sm">
              <span 
                class="px-3 py-1 rounded-full text-xs font-medium uppercase border"
                :class="isDarkMode 
                  ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' 
                  : 'bg-amber-100 text-amber-700 border-amber-300'"
              >
                {{ getRoleName(getValue(user, 'role')) }}
              </span>
            </td>
            <td 
              class="px-6 py-4 text-sm"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ formatDate(getValue(user, 'created_on')) }}
            </td>
            <td 
              class="px-6 py-4 text-sm"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              {{ getValue(user, 'created_by') || 'N/A' }}
            </td>
          </tr>
        </tbody>
      </table>
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

const getValue = (user, key) => {
  if (!store.users_k?.[key]) return null
  return user[store.users_k[key][0]]
}

const getRoleName = (roleId) => {
  return roleMap[String(roleId)] || roleId || 'N/A'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp * 3600 * 1000
  return new Date(ms).toLocaleString()
}
</script>