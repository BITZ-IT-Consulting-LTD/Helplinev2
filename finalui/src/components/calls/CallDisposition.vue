<template>
  <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div
      class="w-full max-w-sm rounded-[2rem] shadow-2xl border overflow-hidden"
      :class="isDarkMode 
        ? 'bg-zinc-900 border-white/10 text-white' 
        : 'bg-white border-zinc-200 text-zinc-900'"
    >
      <div class="p-8 text-center">
        <div class="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
          <i-mdi-clipboard-text class="w-8 h-8" />
        </div>
        
        <h3 class="text-xl font-bold mb-2">Call Disposition</h3>
        <p class="text-sm opacity-60 mb-8">Please select a reason for this call to proceed.</p>

        <div class="space-y-3">
          <button
            v-for="reason in reasons"
            :key="reason"
            @click="sipStore.submitDisposition(reason)"
            class="w-full p-4 rounded-2xl text-sm font-semibold text-left transition-all border"
            :class="isDarkMode 
              ? 'bg-white/5 border-white/5 hover:bg-white/10' 
              : 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100'"
          >
            {{ reason }}
          </button>
        </div>

        <button
          @click="sipStore.showDisposition = false"
          class="mt-6 text-sm font-bold opacity-40 hover:opacity-100 transition-opacity"
        >
          Skip for now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { useSipStore } from '@/stores/sip'

const isDarkMode = inject('isDarkMode')
const sipStore = useSipStore()

const reasons = [
  'Prank Call',
  'Not Clear / Silent',
  'Resolved - No Case',
  'Information Request',
  'Other'
]
</script>
