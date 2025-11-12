<template>
  <div :class="containerClass">
    <label class="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
      {{ label }}
      <span v-if="required" class="text-red-500 font-bold">*</span>
    </label>
    <div class="flex gap-3">
      <label class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-all hover:shadow-md"
        :class="model === '0' ? 'bg-red-100 dark:bg-red-900/30 border-red-500 shadow-md' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'">
        <input 
          type="radio" 
          :name="name"
          value="0" 
          v-model="model"
          class="w-4 h-4 text-red-600 cursor-pointer" 
        />
        <span class="text-sm font-semibold" :class="model === '0' ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'">
          No (0)
        </span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-all hover:shadow-md"
        :class="model === '1' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 shadow-md' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'">
        <input 
          type="radio" 
          :name="name"
          value="1" 
          v-model="model"
          class="w-4 h-4 text-yellow-600 cursor-pointer" 
        />
        <span class="text-sm font-semibold" :class="model === '1' ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300'">
          Partially (0.5)
        </span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-all hover:shadow-md"
        :class="model === '2' ? 'bg-green-100 dark:bg-green-900/30 border-green-500 shadow-md' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'">
        <input 
          type="radio" 
          :name="name"
          value="2" 
          v-model="model"
          class="w-4 h-4 text-green-600 cursor-pointer" 
        />
        <span class="text-sm font-semibold" :class="model === '2' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'">
          Yes (1)
        </span>
      </label>
    </div>
    <p v-if="hint" class="text-xs text-gray-600 dark:text-gray-400 mt-2">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => {
    // Convert to string for radio button binding
    return String(props.modelValue)
  },
  set: (value) => {
    // Emit as string to match the payload format
    emit('update:modelValue', String(value))
  }
})
</script>