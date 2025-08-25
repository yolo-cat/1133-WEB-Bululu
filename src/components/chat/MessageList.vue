<template>
  <div class="space-y-4 p-4">
    <div
      v-for="message in messages"
      :key="message.id"
      class="flex items-end"
      :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
    >
      <div
        class="rounded-lg px-4 py-2 max-w-sm"
        :class="{
          'bg-blue-600 text-white': message.sender === 'user',
          'bg-gray-200 text-gray-800': message.sender === 'device',
        }"
      >
        <p v-if="message.text" class="text-sm">{{ message.text }}</p>
        <img
          v-if="message.imageUrl"
          :src="message.imageUrl"
          alt="User uploaded image"
          class="rounded-lg max-w-full h-auto mt-1"
        />
        <div class="text-xs mt-1" :class="message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'">
          {{ new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
        </div>
      </div>
    </div>
    <div ref="endOfMessages"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useChat } from '~/composables/useChat'

const { messages } = useChat()
const endOfMessages = ref<HTMLElement | null>(null)

watch(messages, async () => {
  await nextTick()
  endOfMessages.value?.scrollIntoView({ behavior: 'smooth' })
}, { deep: true })
</script>
