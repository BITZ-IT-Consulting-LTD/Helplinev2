<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Fixed Sidebar - Only show when NOT on login page -->
    <Sidebar v-if="showSidebar" :isDarkMode="isDarkMode" @toggle-theme="toggleTheme" />
    
    <!-- Main Content Area with conditional left margin -->
    <main class="flex-1 bg-gray-50 overflow-auto" :class="{ 'ml-64': showSidebar }">
      <div>
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'

const route = useRoute()
const isDarkMode = ref(true)

// Hide sidebar on login page
const showSidebar = computed(() => {
  return route.path !== '/login'
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}
</script>