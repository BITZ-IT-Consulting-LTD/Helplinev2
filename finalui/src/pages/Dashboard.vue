<template>
  <div class="p-6 space-y-6 bg-gray-900 min-h-screen">

    <h1 class="text-2xl font-bold text-gray-100 mb-4">Dashboard</h1>

    <!-- 🔥 Shared Filters Bar -->
    <CasesFilters @update:filters="applyFilters" />

    <!-- Grid for the analytics blocks -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Case Categories -->
      <div class="bg-gray-800 shadow-xl rounded-lg p-4 border border-gray-700">
        <CaseCategories :filters="filters" />
      </div>

      <!-- Case Locations -->
      <div class="bg-gray-800 shadow-xl rounded-lg p-4 border border-gray-700">
        <CaseLocations :filters="filters" />
      </div>

      <!-- Daily Cases by Source -->
      <div class="bg-gray-800 shadow-xl rounded-lg p-4 md:col-span-2 border border-gray-700">
        <CasesBySourceDaily :filters="filters" />
      </div>

      <!-- Case Status + Priority -->
      <div class="bg-gray-800 shadow-xl rounded-lg p-4 md:col-span-2 border border-gray-700">
        <CaseStatusPriority :filters="filters" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CasesFilters from "@/components/dashboard/CasesFilters.vue";
import CaseCategories from "@/components/dashboard/CaseCategories.vue";
import CaseLocations from "@/components/dashboard/CaseLocations.vue";
import CasesBySourceDaily from "@/components/dashboard/CasesBySourceDaily.vue";
import CaseStatusPriority from "@/components/dashboard/CaseStatusPriority.vue";

// Filters now use actual backend field names
const filters = ref({
  gbv_related: '1,2' // Default to both
})

function applyFilters(updatedFilters) {
  filters.value = updatedFilters
}
</script>