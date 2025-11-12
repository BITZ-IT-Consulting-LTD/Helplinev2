<template>
  <div class="p-4 border-t-2 border-gray-200 bg-white rounded-b-lg">
    <div class="flex gap-3">
      <textarea
        v-model="newMessageLocal"
        rows="2"
        placeholder="Type your message..."
        class="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent resize-none text-sm"
        @keydown.enter.exact.prevent="sendMessage"
      />
      <button 
        @click="sendMessage"
        class="bg-[#0284C7] hover:bg-[#0369A1] text-white px-6 rounded-lg transition-colors duration-200 shadow-sm font-medium flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Send
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue', 'send-message']);

const newMessageLocal = ref(props.modelValue || "");

watch(() => props.modelValue, (val) => {
  newMessageLocal.value = val;
});

const sendMessage = () => {
  if (!newMessageLocal.value.trim()) return;
  emit('send-message', newMessageLocal.value);
  newMessageLocal.value = "";
};
</script>