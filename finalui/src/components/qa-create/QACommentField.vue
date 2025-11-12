<template>
  <div :class="containerClass">
    <label class="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 font-bold">*</span>
    </label>
    <textarea
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :required="required"
      class="px-4 py-3 border-2 border-blue-300 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all resize-y disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed shadow-sm"
    ></textarea>
    <div v-if="hint || (maxlength && showCharCount)" class="flex justify-between items-center mt-2">
      <p v-if="hint" class="text-xs text-gray-600 dark:text-gray-400">{{ hint }}</p>
      <p v-if="maxlength && showCharCount" class="text-xs font-semibold"
        :class="model?.length > maxlength * 0.9 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'">
        {{ model?.length || 0 }} / {{ maxlength }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Enter comments...'
  },
  rows: {
    type: Number,
    default: 3
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  maxlength: {
    type: Number,
    default: null
  },
  showCharCount: {
    type: Boolean,
    default: false
  },
  containerClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>