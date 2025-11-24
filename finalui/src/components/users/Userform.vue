<template>
  <div class="max-w-3xl w-full bg-gray-800 rounded-lg shadow-2xl border border-gray-700 max-h-[90vh] flex flex-col">
    <!-- Header -->
    <div class="px-8 py-5 border-b border-gray-700">
      <h2 class="text-xl font-bold text-gray-100">Create User</h2>
    </div>

    <!-- Scrollable Form Content -->
    <div class="overflow-y-auto px-8 py-6 flex-1">
      <form @submit.prevent="submitForm" class="space-y-5">

        <!-- Username -->
        <div>
          <label class="block text-gray-300 mb-2 text-sm font-medium">Username *</label>
          <input 
            v-model="form.usn" 
            type="text" 
            required 
            class="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- First Name -->
        <div>
          <label class="block text-gray-300 mb-2 text-sm font-medium">First Name *</label>
          <input 
            v-model="form.fname" 
            type="text" 
            required 
            class="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-gray-300 mb-2 text-sm font-medium">Last Name *</label>
          <input 
            v-model="form.lname" 
            type="text" 
            required 
            class="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Role (Dropdown) -->
        <div>
          <label class="block text-gray-300 mb-2 text-sm font-medium">Role *</label>
          <select 
            v-model="form.role" 
            required 
            class="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Select Role</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">
              {{ r.name }}
            </option>
          </select>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-gray-300 mb-2 text-sm font-medium">Phone</label>
          <input 
            v-model="form.phone" 
            type="text" 
            class="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-gray-300 mb-2 text-sm font-medium">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Is Active -->
        <div class="flex items-center gap-2 pt-2">
          <input type="checkbox" v-model="isActive" class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500" />
          <label class="text-gray-300 text-sm">Active User</label>
        </div>
      </form>
    </div>

    <!-- Footer Buttons -->
    <div class="px-8 py-5 border-t border-gray-700 flex gap-3">
      <button
        @click="submitForm"
        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
      >
        <i-mdi-content-save class="w-5 h-5" />
        Save User
      </button>

      <button
        type="button"
        @click="emit('cancel')"
        class="px-8 bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 rounded-lg transition-all duration-200 font-medium border border-gray-600"
      >
        Cancel
      </button>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/users';

const emit = defineEmits(["saved", "cancel"]);
const store = useUserStore();

const roles = [
  { id: "1", name: "Counsellor" },
  { id: "2", name: "Supervisor" },
  { id: "3", name: "Case Manager" },
  { id: "4", name: "Case Worker" },
  { id: "5", name: "Partner" },
  { id: "6", name: "Media Account" },
  { id: "99", name: "Administrator" },
];

const form = reactive({
  usn: "",
  fname: "",
  lname: "",
  role: "",
  phone: "",
  email: ""
});

const isActive = ref(true);

const submitForm = async () => {
  const payload = {
    ...form,
    is_active: isActive.value ? 1 : 0,
  };

  await store.createUser(payload);
  emit("saved");
};
</script>