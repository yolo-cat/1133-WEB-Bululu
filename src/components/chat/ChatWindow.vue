<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Header -->
    <div class="p-4 border-b">
      <h2 class="text-xl font-bold text-gray-800">Bluetooth Chat</h2>
      <ConnectionStatus />
    </div>

    <!-- Message Display Area -->
    <div class="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
      <div v-for="message in messages" :key="message.id">
        <ChatBubble
          :message="{ content: message.text, timestamp: message.timestamp, id: message.id.toString(), senderId: message.sender }"
          :is-own="message.sender === 'me'"
        />
      </div>
      <div v-if="!isConnected && messages.length === 0" class="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <p>Please connect to a device to begin chatting.</p>
      </div>
       <div v-if="isConnected && messages.length === 0" class="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <p>No messages yet. Send one to start the conversation!</p>
      </div>
    </div>

    <!-- Message Input Area -->
    <div v-if="isConnected" class="p-4 bg-white border-t">
      <form @submit.prevent="handleSend" class="flex space-x-2">
        <Input
          v-model="newMessage"
          placeholder="Type a message..."
          class="flex-1"
          @keyup.enter="handleSend"
        />
        <Button type="submit">
          Send
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConnectionStatus from '~/components/bluetooth/ConnectionStatus.vue'
// The filename is unusual, but we use it as is.
import ChatBubble from '~/components/ui/components_ui_ChatBubble.vue'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'

import { storeToRefs } from 'pinia'
import { useBluetoothStore } from '~/stores/bluetooth'

// useChat is auto-imported by Nuxt
const { messages, sendMessage } = useChat()
const bluetoothStore = useBluetoothStore()
const { isConnected } = storeToRefs(bluetoothStore)

const newMessage = ref('')

const handleSend = () => {
  if (newMessage.value.trim()) {
    sendMessage(newMessage.value)
    newMessage.value = ''
  }
}
</script>
