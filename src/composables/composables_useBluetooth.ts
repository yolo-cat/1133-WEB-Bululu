export const useBluetooth = () => {
  const isSupported = ref(false)
  const isConnected = ref(false)
  const device = ref<BluetoothDevice | null>(null)
  const characteristic = ref<BluetoothRemoteGATTCharacteristic | null>(null)

  // 檢查瀏覽器支援
  const checkSupport = () => {
    isSupported.value = 'bluetooth' in navigator
  }

  // 連接設備
  const connect = async () => {
    try {
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }],
        optionalServices: ['device_information']
      })
      
      device.value = selectedDevice
      const server = await selectedDevice.gatt?.connect()
      isConnected.value = true
      
      return server
    } catch (error) {
      console.error('藍牙連接失敗:', error)
      throw error
    }
  }

  // 斷開連接
  const disconnect = () => {
    if (device.value?.gatt?.connected) {
      device.value.gatt.disconnect()
    }
    isConnected.value = false
    device.value = null
  }

  return {
    isSupported,
    isConnected,
    device,
    checkSupport,
    connect,
    disconnect
  }
}