<template>
  <aside class="fixed left-0 top-0 h-screen w-64 bg-gray-800 border-r border-gray-700 flex flex-col p-6 shadow-xl">

    <!-- Header with Theme Toggle -->
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-xl font-bold text-gray-100 tracking-tight">
        Helpline System
      </h2>
      
      <!-- Theme Toggle Button -->
      <button 
        class="p-2 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
        @click="$emit('toggle-theme')" 
        :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <span class="text-base">{{ isDarkMode ? '☀️' : '🌙' }}</span>
      </button>
    </div>

    <nav class="flex flex-col gap-1.5 text-gray-300">

      <!-- Dashboard - All roles have access -->
      <RouterLink
        v-if="hasPermission('dashboard')"
        to="/"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/' }"
      >
        <i-mdi-view-dashboard-outline class="w-5 h-5" />
        <span class="text-sm">Dashboard</span>
      </RouterLink>

      <!-- Calls - counsellor, supervisor, case manager, admin -->
      <RouterLink
        v-if="hasPermission('calls')"
        to="/calls"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/calls' }"
      >
        <i-mdi-phone-outline class="w-5 h-5" />
        <span class="text-sm">Calls</span>
      </RouterLink>

      <!-- Cases - All main roles -->
      <RouterLink
        v-if="hasPermission('cases')"
        to="/cases"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/cases' }"
      >
        <i-mdi-folder-account-outline class="w-5 h-5" />
        <span class="text-sm">Cases</span>
      </RouterLink>

      <!-- Messages (Other Channels) - counsellor, supervisor, case manager, admin -->
      <RouterLink
        v-if="hasPermission('messages')"
        to="/messages"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/messages' }"
      >
        <i-mdi-message-text-outline class="w-5 h-5" />
        <span class="text-sm">Messages</span>
      </RouterLink>

      <!-- Activities - admin only -->
      <RouterLink
        v-if="hasPermission('activities')"
        to="/activities"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/activities' }"
      >
        <i-mdi-clipboard-list-outline class="w-5 h-5" />
        <span class="text-sm">Activities</span>
      </RouterLink>

      <!-- QA - supervisor, case manager, admin -->
      <RouterLink
        v-if="hasPermission('qa')"
        to="/qa"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/qa' }"
      >
        <i-mdi-check-decagram class="w-5 h-5" />
        <span class="text-sm">QA</span>
      </RouterLink>

      <!-- Users - admin only -->
      <RouterLink
        v-if="hasPermission('users')"
        to="/users"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/users' }"
      >
        <i-mdi-account-multiple-outline class="w-5 h-5" />
        <span class="text-sm">Users</span>
      </RouterLink>

      <!-- Reports - supervisor, case manager, admin -->
      <RouterLink
        v-if="hasPermission('reports')"
        to="/reports"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/reports' }"
      >
        <i-mdi-chart-bar class="w-5 h-5" />
        <span class="text-sm">Reports</span>
      </RouterLink>

      <!-- Wallboard - counsellor, supervisor, case manager, admin -->
      <RouterLink
        v-if="hasPermission('wallboard')"
        to="/wallboard"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/wallboard' }"
      >
        <i-mdi-monitor-dashboard class="w-5 h-5" />
        <span class="text-sm">Wallboard</span>
      </RouterLink>

      <!-- Show message for Partner and Media Account users -->
      <div 
        v-if="authStore.isPartner || authStore.isMediaAccount" 
        class="px-4 py-6 text-center"
      >
        <div class="text-gray-400 text-xs mb-2">
          <i-mdi-information-outline class="w-4 h-4 inline" />
        </div>
        <p class="text-gray-400 text-xs leading-relaxed">
          {{ authStore.isPartner ? 'Partner' : 'Media' }} accounts have limited access. Contact your administrator for more information.
        </p>
      </div>

    </nav>

    <!-- Spacer to push user section to bottom -->
    <div class="flex-1"></div>

    <!-- User Profile Section -->
    <div class="mt-auto pt-4 border-t border-gray-700">
      <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900/40 mb-3">
        <div class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
          {{ authStore.userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-200 truncate">{{ authStore.userDisplayName }}</p>
          <p class="text-xs text-gray-400">{{ authStore.roleDisplayName }}</p>
        </div>
      </div>
      
      <button 
        @click="handleLogout"
        class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-200 group"
      >
        <i-mdi-logout class="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span class="text-sm font-semibold">Log Out</span>
      </button>
    </div>

  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineProps({
  isDarkMode: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle-theme'])

const authStore = useAuthStore()
const router = useRouter()

const hasPermission = (permission) => {
  return authStore.hasPermission(permission)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>