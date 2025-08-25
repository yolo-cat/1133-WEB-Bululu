import { ref, watch, onMounted } from 'vue'
import { useBluetooth } from '~/composables/useBluetooth'
import { useEncryption } from '~/composables/useEncryption'
import type { Packet, KeyExchangePacket, ChatMessagePacket } from '~/utils/types'

// This could be moved to a types file later
export interface Message {
  id: number;
  text: string;
  timestamp: Date;
  sender: 'me' | 'them';
}

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
  const { isConnected, receivedData, sendData } = useBluetooth()
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

  const messages = ref<Message[]>([])

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
          // If we haven't sent our key yet (e.g., they connected first), send it now.
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
          messages.value.push(incomingMessage)
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

      // Add our own message to the list immediately
      const newMessage: Message = {
        id: Date.now(),
        text,
        timestamp: new Date(),
        sender: 'me',
      }
      messages.value.push(newMessage)
    }
  }

  return {
    messages,
    sendMessage,
    isSecure: sharedKey, // Expose sharedKey to UI can know if connection is secure
  }
}
