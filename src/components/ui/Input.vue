<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
