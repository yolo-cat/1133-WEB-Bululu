import { watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBluetooth } from './useBluetooth'
import { useEncryption } from './useEncryption'
import { useChatStore } from '../stores/chat'
import { useBluetoothStore } from '../stores/bluetooth'
import type { Packet, KeyExchangePacket, ChatMessagePacket, Message } from '../utils/types'

// Helper to serialize a packet to ArrayBuffer
const encodePacket = (packet: Packet): ArrayBuffer => {
  const jsonString = JSON.stringify(packet)
  return new TextEncoder().encode(jsonString).buffer
}

// Helper to deserialize ArrayBuffer to a packet
const decodePacket = (buffer: ArrayBuffer): Packet | null => {
  try {
    const jsonString = new TextDecoder().decode(buffer)
    return JSON.parse(jsonString) as Packet
  } catch (error) {
    console.error("Failed to decode packet:", error)
    return null
  }
}

export const useChat = () => {
  const { receivedData, sendData } = useBluetooth()
  const bluetoothStore = useBluetoothStore()
  const { isConnected } = storeToRefs(bluetoothStore)
  const {
    keyPair,
    sharedKey,
    generateKeyPair,
    exportPublicKey,
    importPublicKey,
    deriveSharedSecret,
    encrypt,
    decrypt,
  } = useEncryption()

  // Use the Pinia store for state management
  const chatStore = useChatStore()

  // Generate our keypair once the composable is used
  onMounted(async () => {
    if (!keyPair.value) {
      await generateKeyPair()
    }
  })

  // Automatically send our public key once connected
  watch(isConnected, async (connected) => {
    if (connected && keyPair.value?.publicKey) {
      console.log('Connection established, sending public key...')
      const exportedKey = await exportPublicKey(keyPair.value.publicKey)
      if (exportedKey) {
        const packet: KeyExchangePacket = {
          type: 'key',
          payload: Array.from(new Uint8Array(exportedKey)),
        }
        sendData(encodePacket(packet))
      }
    }
  })

  // Watch for incoming data and handle it
  watch(receivedData, async (data) => {
    if (!data) return
    const packet = decodePacket(data)
    if (!packet) return

    switch (packet.type) {
      case 'key':
        console.log('Received public key.')
        const theirPublicKey = await importPublicKey(new Uint8Array(packet.payload).buffer)
        if (theirPublicKey) {
          await deriveSharedSecret(theirPublicKey)
          if (keyPair.value?.publicKey) {
            console.log('Replying with our public key...')
            const exportedKey = await exportPublicKey(keyPair.value.publicKey)
            if (exportedKey) {
              const replyPacket: KeyExchangePacket = {
                type: 'key',
                payload: Array.from(new Uint8Array(exportedKey)),
              }
              sendData(encodePacket(replyPacket))
            }
          }
        }
        break;

      case 'msg':
        console.log('Received encrypted message.')
        const decryptedText = await decrypt(new Uint8Array(packet.payload.ciphertext).buffer, new Uint8Array(packet.payload.iv))
        if (decryptedText) {
          const incomingMessage: Message = {
            id: Date.now(),
            text: decryptedText,
            timestamp: new Date(),
            sender: 'them',
          }
          // Add the message to the store
          chatStore.addMessage(incomingMessage)
        } else {
          console.warn('Failed to decrypt message.')
        }
        break;
    }
  })

  const sendMessage = async (text: string) => {
    if (!isConnected.value) {
      console.error("Cannot send message, not connected.")
      return
    }
    if (!sharedKey.value) {
      console.error("Cannot send message, secure connection not established.")
      return
    }
    if (!text.trim()) return

    const encrypted = await encrypt(text)
    if (encrypted) {
      const packet: ChatMessagePacket = {
        type: 'msg',
        payload: {
          iv: Array.from(encrypted.iv),
          ciphertext: Array.from(new Uint8Array(encrypted.ciphertext)),
        }
      }
      sendData(encodePacket(packet))

      const newMessage: Message = {
        id: Date.now(),
        text,
        timestamp: new Date(),
        sender: 'me',
      }
      // Add the sent message to the store
      chatStore.addMessage(newMessage)
    }
  }

  return {
    // Expose the messages from the store
    messages: chatStore.messages,
    sendMessage,
    isSecure: sharedKey,
  }
}
