<template>
  <div :class="containerClass">
    <label class="block text-sm font-semibold text-gray-100 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400 font-bold">*</span>
    </label>
    <textarea
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :required="required"
      class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all resize-y disabled:bg-gray-800 disabled:cursor-not-allowed"
    ></textarea>
    <div v-if="hint || (maxlength && showCharCount)" class="flex justify-between items-center mt-2">
      <p v-if="hint" class="text-xs text-gray-400">{{ hint }}</p>
      <p v-if="maxlength && showCharCount" class="text-xs font-semibold"
        :class="model?.length > maxlength * 0.9 ? 'text-red-400' : 'text-gray-400'">
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