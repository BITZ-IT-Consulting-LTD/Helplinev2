<template>
  <div class="relative max-w-[420px]">
    <label v-if="label" class="block font-semibold mb-1.5 text-gray-100" :for="id">{{ label }}</label>

    <!-- Input Display -->
    <div 
      @click="toggleDropdown" 
      :class="[
        'border rounded-lg px-3 py-2.5 flex justify-between items-center cursor-pointer bg-gray-700 transition-all min-h-[20px]',
        disabled ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'border-gray-600 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50'
      ]"
    >
      <div :class="['flex-1 overflow-hidden text-ellipsis whitespace-nowrap', disabled ? 'text-gray-500' : 'text-gray-100']">
        {{ displayValue || placeholder || 'Select an option' }}
      </div>
      <span :class="['text-xs text-gray-400 ml-2 transition-transform', isOpen ? 'rotate-180' : '']">▼</span>
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen" class="border border-gray-700 rounded-lg mt-1 bg-gray-800 p-1.5 max-h-[300px] overflow-y-auto shadow-xl absolute w-full z-[1000]">
      <!-- Breadcrumb navigation -->
      <div v-if="breadcrumb.length" class="px-3 py-2 text-sm text-gray-400 border-b border-gray-700 mb-1.5">
        <span v-for="(name, i) in breadcrumb" :key="i">
          {{ name }}<span v-if="i < breadcrumb.length - 1"> > </span>
        </span>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center gap-2 p-4 justify-center text-gray-400">
        <div class="w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
        <span>Loading options...</span>
      </div>

      <!-- Options list -->
      <ul v-else-if="currentOptions.length" class="list-none m-0 p-0">
        <li
          v-for="option in currentOptions"
          :key="option.id"
          @click.stop="handleOptionClick(option)"
          :class="[
            'px-3 py-2.5 cursor-pointer rounded transition-colors text-gray-100',
            option.id === selectedOption?.id ? 'bg-blue-600/20 text-blue-400 font-medium' : 'hover:bg-gray-700'
          ]"
        >
          <span class="option-text">{{ option.name }}</span>
          <span v-if="option.hasChildren === true" class="float-right text-gray-400">→</span>
        </li>
      </ul>

      <!-- No options -->
      <div v-else class="p-4 text-center text-gray-400 italic">
        No options available
      </div>

      <!-- Controls -->
      <div v-if="navigationPath.length > 0 || selectedOption" class="mt-2 flex justify-center border-t border-gray-700 pt-2">
        <button v-if="navigationPath.length > 0" type="button" class="px-3 py-1.5 rounded border border-gray-600 bg-gray-800 cursor-pointer text-xs transition-all duration-200 text-gray-300 hover:bg-gray-700 flex items-center gap-1" @click.stop="goBack">
          <i-mdi-chevron-left class="w-4 h-4" />
          Back
        </button>
        <button v-if="selectedOption" type="button" class="px-3 py-1.5 rounded border border-red-600 bg-gray-800 cursor-pointer text-xs transition-all duration-200 text-red-400 hover:bg-red-600 hover:text-white ml-2 flex items-center gap-1" @click.stop="clearSelection">
          <i-mdi-close class="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>

    <div v-if="hint && !error" class="text-xs text-gray-400 mt-1">{{ hint }}</div>
    <div v-if="error" class="text-xs text-red-400 mt-1">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categories'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  hint: String,
  error: String,
  id: String,
  placeholder: String,
  disabled: Boolean,
  categoryId: [String, Number]
})

const emit = defineEmits(['update:modelValue', 'change'])

const store = useCategoryStore()
const isOpen = ref(false)
const loading = ref(false)
const navigationPath = ref([])
const levelOptions = ref([])
const selectedOption = ref(null)

// Toggle dropdown
function toggleDropdown() {
  if (props.disabled) return
  if (!isOpen.value && !levelOptions.value.length && props.categoryId) {
    loadLevel(props.categoryId)
  }
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

// Load options for a specific category level
async function loadLevel(categoryId, isRoot = true) {
  if (!categoryId) return []
  try {
    loading.value = true
    await store.viewCategory(categoryId)

    const k = store.subcategories_k
    const idIdx = Number(k?.id?.[0] ?? 0)
    const nameIdx = Number(k?.name?.[0] ?? 5)

    const parsedOptions = (store.subcategories || [])
      .map(row => ({
        id: row[idIdx],
        name: row[nameIdx] || `Option ${row[idIdx]}`,
        hasChildren: null
      }))
      .filter(Boolean)

    if (isRoot) {
      levelOptions.value = parsedOptions
    }
    return parsedOptions
  } catch (error) {
    console.error('Error loading level:', error)
    return []
  } finally {
    loading.value = false
  }
}

// Handle option click
async function handleOptionClick(option) {
  if (option.hasChildren === null) {
    try {
      await store.viewCategory(option.id)
      option.hasChildren = store.subcategories && store.subcategories.length > 0
    } catch {
      option.hasChildren = false
    }
  }

  if (option.hasChildren) {
    const subOptions = await loadLevel(option.id, false)
    if (subOptions.length > 0) {
      navigationPath.value.push({
        id: option.id,
        name: option.name,
        options: levelOptions.value
      })
      levelOptions.value = subOptions
    } else {
      selectOption(option)
    }
  } else {
    selectOption(option)
  }
}

// Emit the ID but display the name
function selectOption(option) {
  selectedOption.value = option
  emit('update:modelValue', option.id)
  emit('change', option.id)
  isOpen.value = false
}

// Go back a level
function goBack() {
  if (navigationPath.value.length === 0) return
  const previousLevel = navigationPath.value.pop()
  levelOptions.value = previousLevel.options
}

// Clear selection
function clearSelection() {
  selectedOption.value = null
  navigationPath.value = []
  if (props.categoryId) loadLevel(props.categoryId)
  emit('update:modelValue', '')
  emit('change', '')
  isOpen.value = false
}

// Watch modelValue and update display name
watch(() => props.modelValue, async (newValue) => {
  if (newValue && newValue !== selectedOption.value?.id) {
    const matchingOption = levelOptions.value.find(opt => opt.id == newValue)
    if (matchingOption) {
      selectedOption.value = matchingOption
    } else {
      selectedOption.value = { id: newValue, name: `Option ${newValue}`, hasChildren: false }
    }
  } else if (!newValue) {
    selectedOption.value = null
  }
})

// Reload on categoryId change
watch(() => props.categoryId, (newCategoryId) => {
  if (newCategoryId) {
    levelOptions.value = []
    navigationPath.value = []
    selectedOption.value = null
    loadLevel(newCategoryId)
  }
}, { immediate: true })

// Computed
const currentOptions = computed(() => levelOptions.value)
const breadcrumb = computed(() => navigationPath.value.map(level => level.name))
const displayValue = computed(() => selectedOption.value?.name || '')

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.relative')) closeDropdown()
  })
})
</script>