<template>
  <div class="p-4 border rounded-lg shadow-sm">
    <h3 class="text-lg font-medium">Connected Device</h3>
    <div v-if="isConnected && device" class="mt-2">
      <ul>
        <li class="py-2 border-b">
          <p class="font-semibold">{{ device.name || 'Unnamed Device' }}</p>
          <p class="text-sm text-gray-500">ID: {{ device.id }}</p>
        </li>
      </ul>
    </div>
    <div v-else class="mt-2 text-gray-500">
      No device connected.
    </div>
  </div>
</template>

<script setup lang="ts">
// useBluetooth is auto-imported by Nuxt
const { isConnected, device } = useBluetooth()
</script>
