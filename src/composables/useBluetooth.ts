import { ref } from 'vue'
import { useBluetoothStore } from '~/stores/bluetooth'
import { CHAT_SERVICE_UUID, CHAT_CHARACTERISTIC_UUID } from '~/utils/bluetooth'

// This composable is now a "service" that performs actions but holds minimal state.
// The global state is managed by the Pinia store.
export const useBluetooth = () => {
  const bluetoothStore = useBluetoothStore()

  // These refs are instance-specific and not needed globally.
  const device = ref<BluetoothDevice | null>(null)
  const server = ref<BluetoothRemoteGATTServer | null>(null)
  const characteristic = ref<BluetoothRemoteGATTCharacteristic | null>(null)

  // This will now hold the raw ArrayBuffer from the characteristic
  const receivedData = ref<ArrayBuffer | null>(null)

  // Check for browser support on initialization
  if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
    bluetoothStore.setSupported(true)
  } else {
    bluetoothStore.setSupported(false)
  }

  const connect = async () => {
    if (!bluetoothStore.isSupported) {
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

        // Update global state via store
        bluetoothStore.setConnectionState(true, selectedDevice.name || 'Unnamed Device')
        console.log('Connected and characteristic found.')

        device.value.addEventListener('gattserverdisconnected', onDisconnected)

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
      receivedData.value = value.buffer
    }
  }

  const onDisconnected = () => {
    console.log('Device disconnected.')
    if (characteristic.value) {
      characteristic.value.removeEventListener('characteristicvaluechanged', handleCharacteristicValueChanged)
      characteristic.value = null
    }
    // Update global state via store
    bluetoothStore.setConnectionState(false, null)
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
    // Read state from the store
    if (!bluetoothStore.isConnected || !characteristic.value) {
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
    // Only export actions and received data. State should be consumed from the store.
    receivedData,
    connect,
    disconnect,
    sendData,
  }
}