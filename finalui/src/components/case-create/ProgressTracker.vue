<template>
  <div class="py-2 pb-4">
    <div class="relative flex justify-between items-start gap-6 pt-7">
      <!-- Connecting Line -->
      <div class="absolute top-10 left-0 right-0 h-0.5 bg-gray-200 -z-10" 
           style="top: 2.75rem;">
        <div 
          class="h-full bg-green-500 transition-all duration-300"
          :style="{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }"
        ></div>
      </div>

      <!-- Steps -->
      <div
        v-for="step in totalSteps"
        :key="step"
        class="flex flex-col items-center gap-1.5 flex-1"
        :class="{
          'opacity-50': stepStatus[step] === 'pending' && currentStep !== step,
          'cursor-pointer': stepStatus[step] === 'completed' || currentStep === step,
          'cursor-not-allowed': stepStatus[step] === 'pending' && currentStep !== step
        }"
        @click="canNavigate(step) && navigateToStep(step)"
      >
        <!-- Step Circle -->
        <div
          class="relative flex items-center justify-center w-9 h-9 text-sm font-extrabold leading-none transition-all rounded-full bg-white border-2"
          :class="{
            'border-gray-300 text-gray-400': stepStatus[step] === 'pending' && currentStep !== step,
            'border-blue-600 text-blue-600 ring-4 ring-blue-100': currentStep === step && stepStatus[step] !== 'completed',
            'border-green-500 bg-green-500 text-white': stepStatus[step] === 'completed',
            'border-red-600 text-red-600': stepStatus[step] === 'error'
          }"
        >
          <span v-if="stepStatus[step] === 'completed'">✓</span>
          <span v-else>{{ step }}</span>
        </div>

        <!-- Step Label -->
        <div
          class="text-xs font-bold text-center transition-colors max-w-[100px]"
          :class="{
            'text-gray-400': stepStatus[step] === 'pending' && currentStep !== step,
            'text-blue-600': currentStep === step && stepStatus[step] !== 'completed',
            'text-green-600': stepStatus[step] === 'completed',
            'text-red-600': stepStatus[step] === 'error'
          }"
        >
          {{ stepLabels[step - 1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
  stepLabels: {
    type: Array,
    required: true,
  },
  stepStatus: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["step-change"])

const canNavigate = (step) => {
  // Allow navigation to completed steps or current step
  return props.stepStatus[step] === 'completed' || step === props.currentStep
}

const navigateToStep = (step) => {
  emit("step-change", step)
}
</script>