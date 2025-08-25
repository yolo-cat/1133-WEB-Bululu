<template>
  <div class="container mx-auto p-4 max-w-lg">
    <header class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Bluetooth Chat</h1>
      <p class="text-md text-gray-600">Scan for devices and start chatting</p>
    </header>

    <div class="flex justify-center mb-6">
      <button
        @click="startScan"
        :disabled="isScanning"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
      >
        <span v-if="isScanning" class="mr-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {{ isScanning ? 'Scanning...' : 'Scan for Devices' }}
      </button>
    </div>

    <DeviceList
      v-if="devices.length > 0 && !isScanning"
      :devices="devices"
      @connect="handleConnect"
    />

    <div v-else-if="!isScanning && hasScanned" class="text-center text-gray-500 mt-8">
       <p>No devices found. Please try scanning again.</p>
    </div>

    <PairingDialog
      v-model="isPairingDialogOpen"
      :device="selectedDevice"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBluetooth, type BluetoothDevice } from '~/composables/useBluetooth'
import DeviceList from '~/components/bluetooth/DeviceList.vue'
import PairingDialog from '~/components/bluetooth/PairingDialog.vue'

const { isScanning, devices, scan } = useBluetooth()
const hasScanned = ref(false)

const isPairingDialogOpen = ref(false)
const selectedDevice = ref<BluetoothDevice | null>(null)

const startScan = () => {
  hasScanned.value = true
  scan()
}

const handleConnect = (device: BluetoothDevice) => {
  selectedDevice.value = device
  isPairingDialogOpen.value = true
}
</script>
