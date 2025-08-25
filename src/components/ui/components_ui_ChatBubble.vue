<template>
  <div
    :class="[
      'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl',
      isOwn
        ? 'bg-blue-500 text-white ml-auto rounded-br-md'
        : 'bg-gray-100 text-gray-900 mr-auto rounded-bl-md'
    ]"
  >
    <p class="text-sm">{{ message.content }}</p>
    <time class="text-xs opacity-70 block mt-1">
      {{ formatTime(message.timestamp) }}
    </time>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: string
  content: string
  timestamp: Date
  senderId: string
}

interface Props {
  message: Message
  isOwn: boolean
}

defineProps<Props>()

const formatTime = (timestamp: Date) => {
  return new Intl.DateTimeFormat('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}
</script>