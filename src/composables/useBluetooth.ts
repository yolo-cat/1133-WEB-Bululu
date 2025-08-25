import { ref } from 'vue'
import { CHAT_SERVICE_UUID, CHAT_CHARACTERISTIC_UUID } from '~/utils/bluetooth'

export const useBluetooth = () => {
  const isSupported = ref(false)
  const isConnected = ref(false)
  const device = ref<BluetoothDevice | null>(null)
  const server = ref<BluetoothRemoteGATTServer | null>(null)
  const characteristic = ref<BluetoothRemoteGATTCharacteristic | null>(null)

  // This will now hold the raw ArrayBuffer from the characteristic
  const receivedData = ref<ArrayBuffer | null>(null)

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
      console.log('Requesting Bluetooth device with chat service...')
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: [CHAT_SERVICE_UUID] }],
      })

      device.value = selectedDevice
      console.log('Connecting to GATT server...')
      server.value = await selectedDevice.gatt?.connect()

      if (server.value) {
        console.log('Getting primary service...')
        const service = await server.value.getPrimaryService(CHAT_SERVICE_UUID)

        console.log('Getting chat characteristic...')
        characteristic.value = await service.getCharacteristic(CHAT_CHARACTERISTIC_UUID)

        isConnected.value = true
        console.log('Connected and characteristic found.')

        // Listen for disconnection events
        device.value.addEventListener('gattserverdisconnected', onDisconnected)

        // Start notifications to receive messages
        await characteristic.value.startNotifications()
        characteristic.value.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged)
        console.log('Notifications started.')
      }

    } catch (error) {
      console.error('Bluetooth connection failed:', error)
      onDisconnected()
    }
  }

  const handleCharacteristicValueChanged = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const value = target.value
    if (value) {
      console.log(`Received raw data with byte length: ${value.buffer.byteLength}`)
      // Pass up the raw ArrayBuffer. We use a new object to ensure watchers trigger.
      receivedData.value = value.buffer
    }
  }

  const onDisconnected = () => {
    console.log('Device disconnected.')
    if (characteristic.value) {
      characteristic.value.removeEventListener('characteristicvaluechanged', handleCharacteristicValueChanged)
      characteristic.value = null
    }
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
        onDisconnected()
      }
    }
  }

  const sendData = async (data: ArrayBuffer) => {
    if (!isConnected.value || !characteristic.value) {
      console.error('Not connected or characteristic not available.')
      return
    }
    try {
      console.log(`Sending raw data of size: ${data.byteLength}`)
      await characteristic.value.writeValueWithResponse(data)
      console.log('Data sent successfully.')
    } catch (error) {
      console.error('Failed to send data:', error)
    }
  }

  return {
    isSupported,
    isConnected,
    device,
    receivedData,
    connect,
    disconnect,
    sendData, // Renamed from sendMessage to sendData
  }
}