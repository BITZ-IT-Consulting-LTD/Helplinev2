<template>
  <transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="transform -translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-full opacity-0"
  >
    <div
      v-if="sipStore.showIncomingPopup"
      class="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[400px]"
    >
      <div
        class="p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border overflow-hidden relative"
        :class="isDarkMode 
          ? 'bg-zinc-900/90 backdrop-blur-3xl border-white/10 text-white' 
          : 'bg-white/90 backdrop-blur-3xl border-zinc-200 text-zinc-900'"
      >
        <!-- Animated Background Pulse -->
        <div class="absolute inset-0 bg-green-500/5 animate-pulse"></div>

        <div class="relative flex items-center gap-4">
          <!-- User Avatar / Icon -->
          <div class="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
            <i-mdi-phone-incoming class="w-8 h-8 animate-bounce" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-lg leading-tight truncate">Incoming Call</h4>
            <p class="text-sm opacity-60 truncate">Extension: {{ sipStore.incomingInvitation?.remoteIdentity.uri.user }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="sipStore.declineCall"
              class="w-12 h-12 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors flex items-center justify-center"
            >
              <i-mdi-close class="w-6 h-6" />
            </button>
            <button
              @click="sipStore.answerCall"
              class="w-12 h-12 rounded-2xl bg-green-500 hover:bg-green-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20 flex items-center justify-center"
            >
              <i-mdi-check class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject } from 'vue'
import { useSipStore } from '@/stores/sip'

const isDarkMode = inject('isDarkMode')
const sipStore = useSipStore()
</script>
