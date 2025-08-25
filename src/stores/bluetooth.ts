import { defineStore } from 'pinia'

export const useBluetoothStore = defineStore('bluetooth', {
  state: () => ({
    isSupported: false,
    isConnected: false,
    deviceName: null as string | null,
  }),
  actions: {
    setSupported(isSupported: boolean) {
      this.isSupported = isSupported
    },
    setConnectionState(isConnected: boolean, deviceName: string | null) {
      this.isConnected = isConnected
      this.deviceName = deviceName
    },
  },
})
