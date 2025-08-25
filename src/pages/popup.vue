<template>
  <div class="p-4 w-64 bg-gray-50 text-gray-800">
    <h1 class="text-lg font-bold text-center mb-4">藍牙聊天室</h1>

    <div v-if="!isSupported" class="text-red-500">
      您的瀏覽器不支援 Web Bluetooth API。
    </div>

    <div v-else>
      <div class="flex flex-col space-y-2">
        <button
          @click="connect"
          :disabled="isConnected"
          class="px-4 py-2 font-semibold text-white rounded-md shadow-sm disabled:opacity-50"
          :class="isConnected ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'"
        >
          掃描並連接設備
        </button>
        <button
          @click="disconnect"
          :disabled="!isConnected"
          class="px-4 py-2 font-semibold text-white bg-red-500 rounded-md shadow-sm hover:bg-red-600 disabled:opacity-50"
        >
          斷開連接
        </button>
      </div>

      <div class="mt-4 p-2 border rounded-md bg-gray-100">
        <p>狀態: <span :class="statusColor">{{ statusText }}</span></p>
        <p v-if="device">已連接設備: {{ device.name || '未知設備' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useBluetooth } from '~/composables/composables_useBluetooth'

const {
  isSupported,
  isConnected,
  device,
  checkSupport,
  connect,
  disconnect
} = useBluetooth()

onMounted(() => {
  checkSupport()
})

const statusText = computed(() => isConnected.value ? '已連線' : '已斷線')
const statusColor = computed(() => isConnected.value ? 'text-green-600 font-bold' : 'text-gray-600')
</script>
