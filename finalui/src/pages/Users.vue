<template>
  <div class="p-6 space-y-6 bg-gray-900 min-h-screen">
    
    <h1 class="text-2xl font-bold text-gray-100 mb-2">System Users</h1>
    <p class="text-gray-400 mb-6">Manage user accounts and permissions across the system</p>

    <!-- Filters -->
    <UsersFilter @update:filters="applyFilters" />

    <!-- Loading State -->
    <div v-if="store.loading" class="flex justify-center items-center py-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div class="text-gray-400">Loading users...</div>
    </div>

    <!-- Content when loaded -->
    <div v-else>
      <!-- View Toggle Buttons and Stats Row -->
      <div class="flex justify-between items-center mb-6">
        <!-- Total Count -->
        <div class="flex items-center gap-2 text-gray-300">
          <i-mdi-account-multiple class="w-5 h-5 text-blue-400" />
          <span class="text-sm">Total Users:</span>
          <span class="text-lg font-bold text-blue-400">{{ store.userCount }}</span>
        </div>

        <!-- View Toggle Buttons -->
        <div class="flex gap-3">
          <button
            @click="view = 'timeline'"
            :class="[
              'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm',
              view === 'timeline' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
            ]"
          >
            <i-mdi-timeline-text-outline class="w-5 h-5" />
            Timeline
          </button>

          <button
            @click="view = 'table'"
            :class="[
              'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm',
              view === 'table' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
            ]"
          >
            <i-mdi-table class="w-5 h-5" />
            Table
          </button>

          <button
            @click="showCreateModal = true"
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm bg-green-600 text-white hover:bg-green-700 shadow-lg active:scale-95"
          >
            <i-mdi-plus-circle class="w-5 h-5" />
            Create User
          </button>

          <button
            @click="refreshUsers"
            :disabled="store.loading"
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm bg-gray-800 text-gray-300 border border-gray-700 hover:border-green-500 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i-mdi-refresh class="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      <!-- Timeline view -->
      <div v-if="view === 'timeline'">
        <UsersTimeline />
      </div>

      <!-- Table view -->
      <div v-if="view === 'table'">
        <UsersTable />
      </div>
    </div>

    <!-- Create User Modal - Blocking -->
    <Transition name="modal">
      <div 
        v-if="showCreateModal"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      >
        <div class="my-8">
          <UserForm @saved="handleSaved" @cancel="showCreateModal = false" />
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/users'
import UsersTable from '@/components/users/Table.vue'
import UsersTimeline from '@/components/users/Timeline.vue'
import UserForm from '@/components/users/UserForm.vue'
import UsersFilter from '@/components/users/UsersFilter.vue'

const store = useUserStore()
const view = ref('timeline')
const showCreateModal = ref(false)
const currentFilters = ref({})

onMounted(async () => {
  try {
    await store.listUsers()
  } catch (err) {
    console.error('Failed to fetch users:', err)
    toast.error('Failed to load users. Please try again.')
  }
})

async function applyFilters(filters) {
  currentFilters.value = filters
  try {
    console.log('Applying filters:', filters)
    await store.listUsers(filters)
    console.log('Filtered users fetched:', store.users)
  } catch (err) {
    console.error('Error fetching filtered users:', err)
    toast.error('Failed to apply filters. Please try again.')
  }
}

async function refreshUsers() {
  try {
    console.log('Refreshing users...')
    await store.listUsers(currentFilters.value)
    console.log('Users refreshed')
    toast.success('Users refreshed successfully!')
  } catch (err) {
    console.error('Error refreshing users:', err)
    toast.error('Failed to refresh users. Please try again.')
  }
}

const handleSaved = () => {
  showCreateModal.value = false
  store.listUsers()
  toast.success('User saved successfully!')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>