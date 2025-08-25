import { ref, readonly } from 'vue'

export type MessageSender = 'user' | 'device'

export interface Message {
  id: string
  text?: string
  imageUrl?: string
  sender: MessageSender
  timestamp: Date
}

// This state is shared across all components that use this composable
const messages = ref<Message[]>([])

export function useChat() {
  const addMessage = (text: string) => {
    if (!text.trim()) return

    const newMessage: Message = {
      id: `${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    }
    messages.value.push(newMessage)

    // Simulate a reply from the device
    setTimeout(() => {
      const reply: Message = {
        id: `${Date.now()}`,
        text: `I received your message: "${text.trim()}"`,
        sender: 'device',
        timestamp: new Date(),
      }
      messages.value.push(reply)
    }, 1200)
  }

  const addImageMessage = (imageUrl: string) => {
    const newMessage: Message = {
      id: `${Date.now()}`,
      imageUrl,
      sender: 'user',
      timestamp: new Date(),
    }
    messages.value.push(newMessage)

    // Simulate a reply for the image
    setTimeout(() => {
      const reply: Message = {
        id: `${Date.now()}`,
        text: `I received your image! Looks great.`,
        sender: 'device',
        timestamp: new Date(),
      }
      messages.value.push(reply)
    }, 1500)
  }

  const clearMessages = () => {
    messages.value = []
  }

  // Clear messages when starting a new chat
  clearMessages()
  // Add a welcome message
  messages.value.push({
    id: 'welcome',
    text: 'You are now connected. Say hello!',
    sender: 'device',
    timestamp: new Date()
  })


  return {
    messages: readonly(messages),
    addMessage,
    addImageMessage,
  }
}
