<template>
  <div class="p-4 border-t border-gray-700 bg-gray-800">
    <div class="flex gap-3">
      <textarea
        v-model="newMessageLocal"
        rows="2"
        placeholder="Type your message..."
        class="flex-1 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
        @keydown.enter.exact.prevent="sendMessage"
      />
      <button 
        @click="sendMessage"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg transition-all duration-200 shadow-lg font-medium flex items-center gap-2 active:scale-95"
      >
        <i-mdi-send class="w-5 h-5" />
        Send
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { toast } from 'vue-sonner'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'send-message'])

const newMessageLocal = ref(props.modelValue || "")

watch(() => props.modelValue, (val) => {
  newMessageLocal.value = val
})

const sendMessage = () => {
  if (!newMessageLocal.value.trim()) {
    toast.warning('Please enter a message')
    return
  }
  
  // Show error toast with title and description
  toast.error('Service Not Available', {
    description: 'Messaging functionality is currently unavailable.'
  })
  
  // Emit the message
  emit('send-message', newMessageLocal.value)
  
  // Clear input
  newMessageLocal.value = ""
  emit('update:modelValue', "")
}
</script>