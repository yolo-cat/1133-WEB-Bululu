<template>
  <li class="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 ease-in-out">
    <div class="flex items-center">
      <div class="mr-4 text-blue-500">
        <!-- Placeholder for an icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div>
        <p class="font-semibold text-gray-800">{{ device.name }}</p>
        <p class="text-sm text-gray-500">{{ device.macAddress }}</p>
      </div>
    </div>
    <button
      @click="$emit('connect', device)"
      class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded-full text-sm transition-colors"
    >
      Connect
    </button>
  </li>
</template>

<script setup lang="ts">
import type { BluetoothDevice } from '~/composables/useBluetooth'

defineProps<{
  device: BluetoothDevice
}>()

defineEmits<{
  (e: 'connect', device: BluetoothDevice): void
}>()
</script>
