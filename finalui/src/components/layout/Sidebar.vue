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

      <RouterLink
        to="/"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/' }"
      >
        <i-mdi-view-dashboard-outline class="w-5 h-5" />
        <span class="text-sm">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/calls"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/calls' }"
      >
        <i-mdi-phone-outline class="w-5 h-5" />
        <span class="text-sm">Calls</span>
      </RouterLink>

      <RouterLink
        to="/cases"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/cases' }"
      >
        <i-mdi-folder-account-outline class="w-5 h-5" />
        <span class="text-sm">Cases</span>
      </RouterLink>

      <RouterLink
        to="/messages"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/messages' }"
      >
        <i-mdi-message-text-outline class="w-5 h-5" />
        <span class="text-sm">Messages</span>
      </RouterLink>

      <RouterLink
        to="/activities"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/activities' }"
      >
        <i-mdi-clipboard-list-outline class="w-5 h-5" />
        <span class="text-sm">Activities</span>
      </RouterLink>

      <RouterLink
        to="/qa"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/qa' }"
      >
        <i-mdi-check-decagram class="w-5 h-5" />
        <span class="text-sm">QA</span>
      </RouterLink>

      <RouterLink
        to="/users"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/users' }"
      >
        <i-mdi-account-multiple-outline class="w-5 h-5" />
        <span class="text-sm">Users</span>
      </RouterLink>

      <RouterLink
        to="/reports"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/reports' }"
      >
        <i-mdi-chart-bar class="w-5 h-5" />
        <span class="text-sm">Reports</span>
      </RouterLink>

      <RouterLink
        to="/wallboard"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50': $route.path === '/wallboard' }"
      >
        <i-mdi-monitor-dashboard class="w-5 h-5" />
        <span class="text-sm">Wallboard</span>
      </RouterLink>

    </nav>

    <!-- Spacer to push user section to bottom -->
    <div class="flex-1"></div>

    <!-- User Profile Section -->
    <div class="mt-auto pt-4 border-t border-gray-700">
      <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900/40 mb-3">
        <div class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
          U
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-200 truncate">User Name</p>
        </div>
      </div>
      
      <button 
        class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-200 group"
      >
        <i-mdi-logout class="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span class="text-sm font-semibold">Log Out</span>
      </button>
    </div>

  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isDarkMode: {
      type: Boolean,
      default: true
    }
  },
  emits: ['toggle-theme']
}
</script>