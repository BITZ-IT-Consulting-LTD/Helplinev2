<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="block text-sm font-semibold text-gray-100" :for="id">{{ label }}</label>
    <input
      :id="id"
      :class="[
        'px-4 py-3 border rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all',
        'focus:outline-none focus:ring-2',
        error 
          ? 'border-red-600 focus:border-red-600 focus:ring-red-600/50' 
          : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50 hover:border-blue-500',
        disabled 
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
          : '',
        readonly 
          ? 'bg-gray-800/50 cursor-default' 
          : ''
      ]"
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="!!error"
    />
    <div v-if="hint && !error" class="text-xs text-gray-400">{{ hint }}</div>
    <div v-if="error" class="text-xs text-red-400">{{ error }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  hint: String,
  error: String,
  id: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean
})
const emit = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
</script>