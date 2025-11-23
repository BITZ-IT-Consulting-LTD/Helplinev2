<template>
  <div class="relative border-l-2 border-gray-700 pl-6 space-y-6">

    <div
      v-for="user in store.users"
      :key="getValue(user, 'id')"
      class="relative bg-gray-800 shadow-xl rounded-lg p-6 border border-gray-700"
    >
      <!-- Timeline Dot -->
      <div class="absolute -left-[1.875rem] top-6 w-6 h-6 bg-blue-500 rounded-full border-4 border-gray-900"></div>

      <!-- User Info -->
      <h3 class="text-lg font-semibold text-gray-100">
        {{ getValue(user, 'first_name') }} {{ getValue(user, 'last_name') }}
      </h3>

      <p class="text-sm text-gray-400 mt-1">
        Username: <span class="font-medium text-gray-300">{{ getValue(user, 'usn') }}</span>
      </p>

      <p class="text-sm text-gray-300 mt-1">
        Created By: {{ getValue(user, 'created_by') || 'N/A' }}
      </p>

      <p class="text-sm text-gray-400 mt-1">
        Created On: {{ formatDate(getValue(user, 'created_on')) }}
      </p>

      <!-- Role Badge -->
      <span
        class="inline-block mt-3 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-medium uppercase border border-blue-600/30"
      >
        {{ getRoleName(getValue(user, 'role')) }}
      </span>
    </div>

  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/users";

const store = useUserStore();

const roleMap = {
  "1": "Counsellor",
  "2": "Supervisor",
  "3": "Case Manager",
  "4": "Case Worker",
  "5": "Partner",
  "6": "Media Account",
  "99": "Administrator"
};

const getValue = (userItem, key) => {
  if (!store.users_k?.[key]) return null;
  return userItem[store.users_k[key][0]];
};

const getRoleName = (roleId) => {
  return roleMap[String(roleId)] || roleId || 'N/A';
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';

  const ms = timestamp < 10000000000 
    ? timestamp * 1000 
    : timestamp * 3600 * 1000;

  return new Date(ms).toLocaleString();
};
</script>