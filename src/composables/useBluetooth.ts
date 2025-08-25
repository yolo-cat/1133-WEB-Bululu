import { ref, readonly } from 'vue'

// Define the structure of a Bluetooth device
export interface BluetoothDevice {
  id: string
  name: string
  macAddress: string
}

// Define the possible connection statuses
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'failed'

// Mock data for Bluetooth devices
const mockDevices: BluetoothDevice[] = [
  { id: 'dev1', name: 'Jules\'s Phone', macAddress: '00:1A:7D:DA:71:13' },
  { id: 'dev2', name: 'Living Room Speaker', macAddress: 'B8:27:EB:B5:74:E8' },
  { id: 'dev3', name: 'My Headphones', macAddress: '4C:87:5D:7A:8E:41' },
]

// Reactive state for the composable.
// This state is shared across all components that use this composable.
const isScanning = ref(false)
const devices = ref<BluetoothDevice[]>([])
const connectionStatus = ref<ConnectionStatus>('disconnected')
const connectedDevice = ref<BluetoothDevice | null>(null)

export function useBluetooth() {

  // Function to simulate scanning for devices
  const scan = () => {
    if (isScanning.value) return

    isScanning.value = true
    devices.value = [] // Clear previous results
    connectionStatus.value = 'disconnected'
    connectedDevice.value = null

    setTimeout(() => {
      devices.value = mockDevices
      isScanning.value = false
    }, 2000) // Simulate a 2-second scan
  }

  // Function to simulate connecting to a device
  const connect = (device: BluetoothDevice) => {
    if (connectionStatus.value === 'connecting') return

    connectionStatus.value = 'connecting'

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // 80% chance of success for simulation purposes
        if (Math.random() > 0.2) {
          connectionStatus.value = 'connected'
          connectedDevice.value = device
          resolve()
        } else {
          connectionStatus.value = 'failed'
          connectedDevice.value = null
          reject(new Error('Connection failed'))
        }
      }, 3000) // Simulate a 3-second connection attempt
    })
  }

  // Function to disconnect
  const disconnect = () => {
    connectionStatus.value = 'disconnected'
    connectedDevice.value = null
  }

  return {
    // Read-only state to prevent direct modification from components
    isScanning: readonly(isScanning),
    devices: readonly(devices),
    connectionStatus: readonly(connectionStatus),
    connectedDevice: readonly(connectedDevice),

    // Functions to interact with the state
    scan,
    connect,
    disconnect
  }
}
