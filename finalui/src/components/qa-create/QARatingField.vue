<template>
  <div :class="containerClass">
    <label class="block text-sm font-semibold text-gray-100 mb-3">
      {{ label }}
      <span v-if="required" class="text-red-400 font-bold">*</span>
    </label>
    <div class="flex gap-3">
      <label class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all hover:shadow-md"
        :class="model === '0' ? 'bg-red-600/20 border-red-600/50 shadow-md' : 'bg-gray-700 border-gray-600'">
        <input 
          type="radio" 
          :name="name"
          value="0" 
          v-model="model"
          class="w-4 h-4 text-red-600 cursor-pointer" 
        />
        <span class="text-sm font-semibold" :class="model === '0' ? 'text-red-400' : 'text-gray-300'">
          No (0)
        </span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all hover:shadow-md"
        :class="model === '1' ? 'bg-amber-600/20 border-amber-600/50 shadow-md' : 'bg-gray-700 border-gray-600'">
        <input 
          type="radio" 
          :name="name"
          value="1" 
          v-model="model"
          class="w-4 h-4 text-amber-600 cursor-pointer" 
        />
        <span class="text-sm font-semibold" :class="model === '1' ? 'text-amber-400' : 'text-gray-300'">
          Partially (0.5)
        </span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all hover:shadow-md"
        :class="model === '2' ? 'bg-green-600/20 border-green-600/50 shadow-md' : 'bg-gray-700 border-gray-600'">
        <input 
          type="radio" 
          :name="name"
          value="2" 
          v-model="model"
          class="w-4 h-4 text-green-600 cursor-pointer" 
        />
        <span class="text-sm font-semibold" :class="model === '2' ? 'text-green-400' : 'text-gray-300'">
          Yes (1)
        </span>
      </label>
    </div>
    <p v-if="hint" class="text-xs text-gray-400 mt-2">{{ hint }}</p>
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
/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Convert the modelValue to a string for radio button binding.
   * @returns {string} The modelValue as a string.
   */
/*******  7da69971-5053-47f4-848b-075fe7bee2ba  *******/  get: () => String(props.modelValue),
  set: (value) => emit('update:modelValue', String(value))
})
</script>