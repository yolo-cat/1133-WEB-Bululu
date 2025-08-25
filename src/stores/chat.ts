import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Message } from '~/utils/types'

export const useChatStore = defineStore('chat', () => {
  // Use useStorage to make the messages ref persistent.
  // The first argument is the key in localStorage.
  // The second argument is the default value.
  const messages = useStorage<Message[]>('chat-history', [])

  // Action to add a new message to the list.
  const addMessage = (message: Message) => {
    messages.value.push(message)
  }

  // Action to clear the chat history.
  const clearChat = () => {
    messages.value = []
  }

  return {
    messages,
    addMessage,
    clearChat,
  }
})
