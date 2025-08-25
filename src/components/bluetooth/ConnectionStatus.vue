<template>
  <div class="p-4 border rounded-lg shadow-sm">
    <h3 class="text-lg font-medium">Connection Status</h3>
    <div v-if="isSupported" class="mt-2">
      <div v-if="isConnected && device" class="flex items-center space-x-2">
        <span class="w-3 h-3 bg-green-500 rounded-full"></span>
        <span>Connected to: <strong class="font-semibold">{{ device.name || 'Unnamed Device' }}</strong></span>
      </div>
      <div v-else class="flex items-center space-x-2">
        <span class="w-3 h-3 bg-red-500 rounded-full"></span>
        <span>Disconnected</span>
      </div>
    </div>
    <div v-else class="mt-2 text-gray-500">
      Web Bluetooth is not supported by this browser.
    </div>
  </div>
</template>

<script setup lang="ts">
// useBluetooth is auto-imported by Nuxt
const { isSupported, isConnected, device } = useBluetooth()
</script>
