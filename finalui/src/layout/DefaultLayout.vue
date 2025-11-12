<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Fixed Sidebar -->
    <Sidebar />
    
    <!-- Main Content Area with left margin to account for fixed sidebar -->
    <main class="flex-1 ml-64 bg-gray-50 overflow-auto">
      <div >
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
</script>