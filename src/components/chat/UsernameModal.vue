<template>
  <TransitionRoot appear :show="true" as="template">
    <Dialog as="div" @close="() => {}" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Welcome!
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Please set your username to start chatting.
                </p>
              </div>

              <div class="mt-4">
                <input
                  type="text"
                  v-model="inputUsername"
                  @keyup.enter="saveUsername"
                  placeholder="Enter your name"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div class="mt-6">
                <button
                  type="button"
                  :disabled="!isUsernameValid"
                  @click="saveUsername"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Save and Enter Chat
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useUser } from '~/composables/useUser'

const { setUsername } = useUser()
const inputUsername = ref('')
const emit = defineEmits(['usernameSet'])

const isUsernameValid = computed(() => inputUsername.value.trim().length > 0)

const saveUsername = () => {
  if (isUsernameValid.value) {
    setUsername(inputUsername.value)
    emit('usernameSet')
  }
}
</script>
