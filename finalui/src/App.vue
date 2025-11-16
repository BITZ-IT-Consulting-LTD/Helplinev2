<template>
  <div id="app" class="min-h-screen font-sans text-gray-900 bg-gray-900">
    <Toaster 
      position="top-center" 
      theme="dark"
      :rich-colors="false"
      :expand="false"
      :duration="4000"
      :close-button="true"
    />
    <component :is="layout" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { RouterView } from 'vue-router'

const route = useRoute()

const layout = computed(() => {
  if (route.meta.layout === 'none') return RouterView
  return DefaultLayout
})
</script>

<style>
/* Center positioning - TOP CENTER of screen */
[data-sonner-toaster] {
  position: fixed !important;
  top: 24px !important;
  left: 50% !important;
  right: auto !important;
  transform: translateX(-50%) !important;
  z-index: 99999 !important;
  max-width: 600px !important;
  width: auto !important;
}

[data-sonner-toaster][data-x-position='center'] {
  left: 50% !important;
  transform: translateX(-50%) !important;
}

/* Base toast - Horizontal layout */
[data-sonner-toast] {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 12px !important;
  padding: 14px 16px !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4) !important;
  min-width: 400px !important;
  max-width: 600px !important;
  margin-bottom: 12px !important;
  border: 1px solid transparent !important;
  position: relative !important;
}

/* SUCCESS - Blue background */
[data-sonner-toast][data-type="success"] {
  background: #2563eb !important;
  border-color: #3b82f6 !important;
}

[data-sonner-toast][data-type="success"] [data-icon] {
  color: #ffffff !important;
  flex-shrink: 0 !important;
}

[data-sonner-toast][data-type="success"] [data-content],
[data-sonner-toast][data-type="success"] [data-title],
[data-sonner-toast][data-type="success"] [data-description] {
  color: #ffffff !important;
}

/* ERROR - Red background */
[data-sonner-toast][data-type="error"] {
  background: #dc2626 !important;
  border-color: #ef4444 !important;
}

[data-sonner-toast][data-type="error"] [data-icon] {
  color: #ffffff !important;
  flex-shrink: 0 !important;
}

[data-sonner-toast][data-type="error"] [data-content],
[data-sonner-toast][data-type="error"] [data-title],
[data-sonner-toast][data-type="error"] [data-description] {
  color: #ffffff !important;
}

/* WARNING - Orange/Amber background */
[data-sonner-toast][data-type="warning"] {
  background: #ea580c !important;
  border-color: #f97316 !important;
}

[data-sonner-toast][data-type="warning"] [data-icon] {
  color: #ffffff !important;
  flex-shrink: 0 !important;
}

[data-sonner-toast][data-type="warning"] [data-content],
[data-sonner-toast][data-type="warning"] [data-title],
[data-sonner-toast][data-type="warning"] [data-description] {
  color: #ffffff !important;
}

/* INFO - Blue-gray background */
[data-sonner-toast][data-type="info"] {
  background: #0284c7 !important;
  border-color: #0ea5e9 !important;
}

[data-sonner-toast][data-type="info"] [data-icon] {
  color: #ffffff !important;
  flex-shrink: 0 !important;
}

[data-sonner-toast][data-type="info"] [data-content],
[data-sonner-toast][data-type="info"] [data-title],
[data-sonner-toast][data-type="info"] [data-description] {
  color: #ffffff !important;
}

/* Icon styling */
[data-sonner-toast] [data-icon] {
  width: 20px !important;
  height: 20px !important;
  flex-shrink: 0 !important;
  margin-right: 4px !important;
}

/* Content container - takes remaining space */
[data-sonner-toast] [data-content] {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
  min-width: 0 !important;
  padding-right: 32px !important;
}

/* Title styling */
[data-sonner-toast] [data-title] {
  font-weight: 600 !important;
  font-size: 14px !important;
  line-height: 1.4 !important;
  margin: 0 !important;
}

/* Description styling */
[data-sonner-toast] [data-description] {
  font-size: 13px !important;
  line-height: 1.4 !important;
  opacity: 0.95 !important;
  margin: 0 !important;
}

/* Close button - positioned at far right */
[data-sonner-toast] [data-close-button] {
  position: absolute !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  flex-shrink: 0 !important;
  width: 20px !important;
  height: 20px !important;
  padding: 0 !important;
  background: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 4px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: background 0.2s !important;
  margin-left: auto !important;
}

[data-sonner-toast] [data-close-button]:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

[data-sonner-toast] [data-close-button] svg {
  width: 14px !important;
  height: 14px !important;
}

/* Hover effect */
[data-sonner-toast]:hover {
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 10px 15px -8px rgba(0, 0, 0, 0.5) !important;
  transform: translateY(-2px) !important;
  transition: all 0.2s ease !important;
}

/* Animation */
[data-sonner-toast] {
  animation: slideDown 0.3s ease-out !important;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>