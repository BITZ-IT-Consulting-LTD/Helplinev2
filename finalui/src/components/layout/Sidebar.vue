<template>
  <aside 
    class="fixed left-0 top-0 h-screen w-64 border-r flex flex-col shadow-xl"
    :class="isDarkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200'"
  >

    <!-- Header with Theme Toggle - Fixed -->
    <div class="flex-shrink-0 flex items-center justify-between p-6 pb-4">
      <h2 
        class="text-xl font-bold tracking-tight"
        :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'"
      >
        Helpline System
      </h2>
      
      <!-- Theme Toggle Button -->
      <button 
        class="p-2 rounded-lg border transition-all duration-200 flex items-center justify-center"
        :class="isDarkMode 
          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
          : 'bg-gray-100 border-gray-300 hover:bg-gray-200'"
        @click="$emit('toggle-theme')" 
        :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <span class="text-base">{{ isDarkMode ? '☀️' : '🌙' }}</span>
      </button>
    </div>

    <!-- Navigation - Scrollable -->
    <nav class="flex-1 overflow-y-auto px-6 py-2">
      <div 
        class="flex flex-col gap-1.5"
        :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
      >

        <!-- Dashboard - All roles have access -->
        <RouterLink
          v-if="hasPermission('dashboard')"
          to="/"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="getNavLinkClass($route.path === '/')"
        >
          <i-mdi-view-dashboard-outline class="w-5 h-5" />
          <span class="text-sm">Dashboard</span>
        </RouterLink>

        <!-- Calls - counsellor, supervisor, case manager, admin -->
        <RouterLink
          v-if="hasPermission('calls')"
          to="/calls"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="getNavLinkClass($route.path === '/calls')"
        >
          <i-mdi-phone-outline class="w-5 h-5" />
          <span class="text-sm">Calls</span>
        </RouterLink>

        <!-- Cases - All main roles -->
        <RouterLink
          v-if="hasPermission('cases')"
          to="/cases"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="getNavLinkClass($route.path === '/cases')"
        >
          <i-mdi-folder-account-outline class="w-5 h-5" />
          <span class="text-sm">Cases</span>
        </RouterLink>

        <!-- Messages (Other Channels) - counsellor, supervisor, case manager, admin -->
        <RouterLink
          v-if="hasPermission('messages')"
          to="/messages"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="getNavLinkClass($route.path === '/messages')"
        >
          <i-mdi-message-text-outline class="w-5 h-5" />
          <span class="text-sm">Messages</span>
        </RouterLink>

        <!-- Activities - admin only -->
        <RouterLink
          v-if="hasPermission('activities')"
          to="/activities"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="getNavLinkClass($route.path === '/activities')"
        >
          <i-mdi-clipboard-list-outline class="w-5 h-5" />
          <span class="text-sm">Activities</span>
        </RouterLink>

        <!-- QA - supervisor, case manager, admin -->
        <RouterLink
          v-if="hasPermission('qa')"
          to="/qa"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="getNavLinkClass($route.path === '/qa')"
        >
          <i-mdi-check-decagram class="w-5 h-5" />
          <span class="text-sm">QA</span>
        </RouterLink>

        <!-- Users - admin only -->
        <RouterLink
          v-if="hasPermission('users')"
          to="/users"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="getNavLinkClass($route.path === '/users')"
        >
          <i-mdi-account-multiple-outline class="w-5 h-5" />
          <span class="text-sm">Users</span>
        </RouterLink>

        <!-- Reports - supervisor, case manager, admin -->
        <RouterLink
          v-if="hasPermission('reports')"
          to="/reports"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="getNavLinkClass($route.path === '/reports')"
        >
          <i-mdi-chart-bar class="w-5 h-5" />
          <span class="text-sm">Reports</span>
        </RouterLink>

        <!-- Wallboard - counsellor, supervisor, case manager, admin -->
        <RouterLink
          v-if="hasPermission('wallboard')"
          to="/wallboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="getNavLinkClass($route.path === '/wallboard')"
        >
          <i-mdi-monitor-dashboard class="w-5 h-5" />
          <span class="text-sm">Wallboard</span>
        </RouterLink>

        <!-- Show message for Partner and Media Account users -->
        <div 
          v-if="authStore.isPartner || authStore.isMediaAccount" 
          class="px-4 py-6 text-center"
        >
          <div 
            class="text-xs mb-2"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            <i-mdi-information-outline class="w-4 h-4 inline" />
          </div>
          <p 
            class="text-xs leading-relaxed"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            {{ authStore.isPartner ? 'Partner' : 'Media' }} accounts have limited access. Contact your administrator for more information.
          </p>
        </div>

      </div>
    </nav>

    <!-- User Profile Section - Fixed at Bottom -->
    <div 
      class="flex-shrink-0 p-6 pt-4 border-t"
      :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'"
    >
      <div 
        class="flex items-center gap-3 px-4 py-3 rounded-lg mb-3"
        :class="isDarkMode ? 'bg-gray-900/40' : 'bg-gray-50'"
      >
        <div 
          class="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          :class="isDarkMode ? 'bg-blue-600' : 'bg-amber-700'"
        >
          {{ authStore.userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p 
            class="text-sm font-medium truncate"
            :class="isDarkMode ? 'text-gray-200' : 'text-gray-900'"
          >
            {{ authStore.userDisplayName }}
          </p>
          <p 
            class="text-xs"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ authStore.roleDisplayName }}
          </p>
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

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false // Light mode is default
  }
})

defineEmits(['toggle-theme'])

const authStore = useAuthStore()
const router = useRouter()

const hasPermission = (permission) => {
  return authStore.hasPermission(permission)
}

const getNavLinkClass = (isActive) => {
  if (isActive) {
    // Active state with brown for light mode, blue for dark mode
    return props.isDarkMode 
      ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50'
      : 'bg-amber-700 text-white font-medium shadow-lg shadow-amber-900/30'
  } else {
    // Inactive state
    return props.isDarkMode 
      ? 'hover:bg-gray-700/50'
      : 'hover:bg-gray-100'
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Custom scrollbar for nav */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #9ca3af;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Dark mode scrollbar */
.dark nav::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark nav::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>