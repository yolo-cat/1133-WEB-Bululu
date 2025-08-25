export const useBluetooth = () => {
  const isSupported = ref(false)
  const isConnected = ref(false)
  const device = ref<BluetoothDevice | null>(null)
  const characteristic = ref<BluetoothRemoteGATTCharacteristic | null>(null)

  // 檢查瀏覽器支援
  const checkSupport = () => {
    isSupported.value = 'bluetooth' in navigator
  }

  // 處理斷線事件
  const onDisconnected = () => {
    isConnected.value = false
    console.log('藍牙已斷開連接:', device.value?.name)
    device.value?.removeEventListener('gattserverdisconnected', onDisconnected)
    device.value = null
  }

  // 連接設備
  const connect = async () => {
    try {
      // 請求設備，`acceptAllDevices: true` 會顯示所有可用的藍牙設備
      // 這對於初期的基本發現功能更為合適
      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      })
      
      device.value = selectedDevice

      // 監聽設備斷線事件
      selectedDevice.addEventListener('gattserverdisconnected', onDisconnected)

      const server = await selectedDevice.gatt?.connect()
      isConnected.value = true
      console.log('藍牙已連接:', device.value?.name)
      
      return server
    } catch (error) {
      // 當使用者取消選擇設備時，會觸發 NotAllowedError，這種情況下我們不視為嚴重錯誤
      if ((error as Error).name === 'NotFoundError' || (error as Error).name === 'NotAllowedError') {
        console.log('使用者取消了設備選擇。')
      } else {
        console.error('藍牙連接失敗:', error)
      }
    }
  }

  // 斷開連接
  const disconnect = () => {
    if (device.value?.gatt?.connected) {
      device.value.gatt.disconnect()
    } else {
      // 如果 gatt 未連接但仍有 device 物件，手動觸發清理
      onDisconnected()
    }
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