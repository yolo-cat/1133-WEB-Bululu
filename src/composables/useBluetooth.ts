import { ref } from 'vue'

export const useBluetooth = () => {
  const isSupported = ref(false)
  const isConnected = ref(false)
  const device = ref<BluetoothDevice | null>(null)
  const server = ref<BluetoothRemoteGATTServer | null>(null)

  // Check for browser support on initialization
  if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
    isSupported.value = true
  }

  const connect = async () => {
    if (!isSupported.value) {
      console.error('Web Bluetooth is not supported in this browser.')
      return
    }

    try {
      console.log('Requesting Bluetooth device...')
      // Using acceptAllDevices for development.
      // TODO: Replace with a specific service filter for production.
      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      })

      device.value = selectedDevice
      console.log('Connecting to GATT server...')
      server.value = await selectedDevice.gatt?.connect()

      if (server.value) {
        isConnected.value = true
        console.log('Connected to GATT server.')

        // Listen for disconnection events
        device.value.addEventListener('gattserverdisconnected', onDisconnected)

        // TODO: Get service and characteristic for chat. For now, we log available services.
        const services = await server.value.getPrimaryServices()
        console.log('Available services:', services?.map(s => s.uuid))
      }

    } catch (error) {
      console.error('Bluetooth connection failed:', error)
      // Reset state on failure
      onDisconnected()
    }
  }

  const onDisconnected = () => {
    console.log('Device disconnected.')
    isConnected.value = false
    device.value = null
    server.value = null
  }

  const disconnect = () => {
    if (device.value) {
      device.value.removeEventListener('gattserverdisconnected', onDisconnected)
      if (device.value.gatt?.connected) {
        console.log('Disconnecting from GATT server...')
        device.value.gatt.disconnect()
      } else {
        // If already disconnected, just clean up state
        onDisconnected()
      }
    }
  }

  const sendMessage = async (message: string) => {
    // TODO: Implement message sending via GATT characteristic
    if (!isConnected.value) {
      console.error('Not connected to a device.')
      return
    }
    console.log(`Sending message (placeholder): ${message}`)
  }

  return {
    isSupported,
    isConnected,
    device,
    connect,
    disconnect,
    sendMessage
  }
}