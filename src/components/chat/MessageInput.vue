<template>
  <div class="flex items-center p-4 bg-white border-t border-gray-200">
    <!-- Hidden file input -->
    <input
      type="file"
      @change="onFileChange"
      ref="fileInput"
      class="hidden"
      accept="image/*"
    />

    <!-- Image upload button -->
    <button @click="triggerFileInput" class="p-2 text-gray-500 hover:text-blue-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>

    <!-- Text input -->
    <input
      v-model="text"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
      class="flex-1 mx-2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <!-- Send button -->
    <button
      @click="sendMessage"
      :disabled="!isSendable"
      class="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChat } from '~/composables/useChat'

const { addMessage, addImageMessage } = useChat()
const text = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const isSendable = computed(() => text.value.trim().length > 0)

const sendMessage = () => {
  if (isSendable.value) {
    addMessage(text.value)
    text.value = ''
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Check if the file is an image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          addImageMessage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please select an image file.')
    }
  }
  // Reset the file input so the user can select the same file again
  if (target) {
    target.value = ''
  }
}
</script>
