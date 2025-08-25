<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <h2 class="text-xl font-semibold text-gray-700 p-4 border-b">Discovered Devices</h2>
    <ul class="divide-y divide-gray-200">
      <DeviceListItem
        v-for="device in devices"
        :key="device.id"
        :device="device"
        @connect="$emit('connect', $event)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { BluetoothDevice } from '~/composables/useBluetooth'
import DeviceListItem from './DeviceListItem.vue'

defineProps<{
  devices: BluetoothDevice[]
}>()

defineEmits<{
  (e: 'connect', device: BluetoothDevice): void
}>()
</script>
