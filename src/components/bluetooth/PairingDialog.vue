<template>
  <div class="p-4 border rounded-lg shadow-sm">
    <h3 class="text-lg font-medium">Device Connection</h3>
    <div class="mt-4">
      <Button v-if="!isConnected" @click="connect">
        Connect to a Device
      </Button>
      <Button v-if="isConnected" @click="disconnect" variant="danger">
        Disconnect
      </Button>
    </div>
    <p v-if="!isSupported" class="mt-2 text-sm text-red-600">
      Web Bluetooth is not supported on this browser.
    </p>
  </div>
</template>

<script setup lang="ts">
import Button from '../ui/Button.vue'

import { storeToRefs } from 'pinia'
import { useBluetoothStore } from '../../stores/bluetooth'

// Actions still come from the composable "service"
const { connect, disconnect } = useBluetooth()

// State comes from the store
const bluetoothStore = useBluetoothStore()
const { isSupported, isConnected } = storeToRefs(bluetoothStore)
</script>
