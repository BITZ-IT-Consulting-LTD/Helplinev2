<template>
  <div class="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-900/60 border-b border-gray-700">
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Username</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">First Name</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Role</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Created On</th>
            <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Created By</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-700">
          <tr
            v-for="user in store.users"
            :key="getValue(user, 'id')"
            class="hover:bg-gray-700/30 transition-all duration-200"
          >
            <td class="px-6 py-4 text-gray-300 text-sm">{{ getValue(user, 'usn') }}</td>
            <td class="px-6 py-4 text-gray-300 text-sm">{{ getValue(user, 'contact_fname') }}</td>
            <td class="px-6 py-4 text-sm">
              <span class="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-medium uppercase border border-blue-600/30">
                {{ getValue(user, 'role') }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-400 text-sm">{{ formatDate(getValue(user, 'created_on')) }}</td>
            <td class="px-6 py-4 text-gray-300 text-sm">{{ getValue(user, 'created_by') || 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/users";
const store = useUserStore();

const getValue = (user, key) => {
  if (!store.users_k?.[key]) return null;
  return user[store.users_k[key][0]];
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp * 3600 * 1000;
  return new Date(ms).toLocaleString();
};
</script>