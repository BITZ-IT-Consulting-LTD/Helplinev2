<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">System Users</h1>

      <div class="flex gap-3">
        <button
          @click="view = 'table'"
          :class="[
            'px-4 py-2 rounded transition',
            view === 'table' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          ]"
        >
          Table
        </button>

        <button
          @click="view = 'timeline'"
          :class="[
            'px-4 py-2 rounded transition',
            view === 'timeline' ? 'bg-green-700 text-white' : 'bg-green-600 text-white hover:bg-green-700'
          ]"
        >
          Timeline
        </button>

        <button
          @click="view = 'create'"
          :class="[
            'px-4 py-2 rounded transition',
            view === 'create' ? 'bg-amber-700 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'
          ]"
        >
          Create User
        </button>
      </div>
    </div>

    <!-- Filters (only show for table and timeline views) -->
    <UsersFilter 
      v-if="view !== 'create'" 
      @update:filters="applyFilters" 
    />

    <!-- Stats Summary (only show for table and timeline views) -->
    <div v-if="view !== 'create'" class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Total Users: <span class="font-semibold text-lg">{{ store.userCount }}</span>
          </p>
        </div>
        
        <div class="flex gap-2">
          <button 
            @click="refreshUsers"
            :disabled="store.loading"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
          >
            Refresh
          </button>
          
          <button 
            @click="downloadCSV"
            :disabled="store.loading"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading && view !== 'create'" class="text-center py-12 bg-white rounded-lg shadow">
      <div class="text-gray-500">Loading users...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error && view !== 'create'" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ store.error }}
    </div>

    <!-- Switch Components -->
    <template v-else>
      <UsersTable v-if="view === 'table'" />
      <UsersTimeline v-else-if="view === 'timeline'" />
      <UserForm v-else @saved="handleSaved" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/users'
import UsersTable from '@/components/users/Table.vue'
import UsersTimeline from '@/components/users/Timeline.vue'
import UserForm from '@/components/users/UserForm.vue'
import UsersFilter from '@/components/users/UsersFilter.vue'

const store = useUserStore()
const view = ref('table')
const currentFilters = ref({})

onMounted(() => {
  store.listUsers()
})

// Apply filters and fetch users
async function applyFilters(filters) {
  currentFilters.value = filters
  try {
    console.log('Applying filters:', filters)
    await store.listUsers(filters)
    console.log('Filtered users fetched:', store.users)
  } catch (err) {
    console.error('Error fetching filtered users:', err)
  }
}

// Refresh users with current filters
async function refreshUsers() {
  await store.listUsers(currentFilters.value)
}

// Download CSV with current filters
async function downloadCSV() {
  try {
    const blob = await store.downloadCSV(currentFilters.value)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Failed to download CSV:', error)
    alert('Failed to download CSV. Please try again.')
  }
}

const handleSaved = () => {
  view.value = 'table'
  store.listUsers()
}
</script>