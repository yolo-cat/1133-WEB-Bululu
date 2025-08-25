import { ref, watch } from 'vue'

// This could be moved to a types file later
export interface Message {
  id: number;
  text: string;
  timestamp: Date;
  sender: 'me' | 'them';
}

export const useChat = () => {
  // Get the bluetooth functionality
  const { sendMessage: sendBluetoothMessage, receivedMessage, isConnected } = useBluetooth()

  const messages = ref<Message[]>([])

  // Watch for incoming messages from the bluetooth composable
  watch(receivedMessage, (bleMessage) => {
    if (bleMessage?.text) {
      const incomingMessage: Message = {
        id: bleMessage.id,
        text: bleMessage.text,
        timestamp: new Date(),
        sender: 'them',
      }
      messages.value.push(incomingMessage)
    }
  })

  // Function to send a message
  const sendMessage = (text: string) => {
    if (!isConnected.value) {
      console.error("Cannot send message, not connected.")
      // Optionally add a system message to the chat
      // to inform the user.
      return
    }

    if (!text.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      text,
      timestamp: new Date(),
      sender: 'me',
    }
    messages.value.push(newMessage)

    // Send the message over bluetooth
    sendBluetoothMessage(text)
  }

  return {
    messages,
    sendMessage,
  }
}
