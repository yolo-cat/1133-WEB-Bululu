<template>
  <button
    class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    case 'secondary':
      return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
    case 'primary':
    default:
      return 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
