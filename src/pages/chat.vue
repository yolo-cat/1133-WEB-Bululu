<template>
  <div>
    <UsernameModal v-if="!isUsernameSet" @username-set="handleUsernameSet" />

    <div v-else class="flex flex-col h-screen bg-gray-100">
      <header class="bg-white shadow-sm p-4 border-b flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold text-gray-800">
            Chat with {{ connectedDevice?.name || 'Unknown Device' }}
          </h1>
          <p class="text-sm text-green-600">Connected</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-600">Your name:</p>
          <p class="font-semibold text-gray-800">{{ username }}</p>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto">
        <MessageList />
      </main>

      <footer class="bg-white p-4 border-t">
        <MessageInput />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '~/composables/useUser'
import { useBluetooth } from '~/composables/useBluetooth'
import UsernameModal from '~/components/chat/UsernameModal.vue'
import MessageList from '~/components/chat/MessageList.vue'
import MessageInput from '~/components/chat/MessageInput.vue'

const { username } = useUser()
const { connectedDevice, connectionStatus } = useBluetooth()
const router = useRouter()

// We use a local ref to control the visibility of the main chat UI
// This avoids a flash of the chat UI before the modal appears.
const isUsernameSet = ref(!!username.value)

onMounted(() => {
  // Redirect to home if the user is not connected to a device.
  // This prevents accessing the chat page directly.
  if (connectionStatus.value !== 'connected') {
    router.push('/')
  }
})

const handleUsernameSet = () => {
  isUsernameSet.value = true
}
</script>
