<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Connecting to {{ device?.name || 'device' }}
              </DialogTitle>

              <div class="mt-4 text-center">
                <div v-if="connectionStatus === 'connecting'">
                  <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p class="mt-2 text-gray-600">Please wait, attempting to pair...</p>
                </div>

                <div v-if="connectionStatus === 'failed'">
                   <p class="text-red-500 font-semibold">Connection Failed!</p>
                   <p class="text-sm text-gray-500 mt-1">Could not connect to the device. Please try again.</p>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button
                  v-if="connectionStatus === 'failed'"
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Close
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
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useBluetooth, type BluetoothDevice } from '~/composables/useBluetooth'

const props = defineProps<{
  modelValue: boolean
  device: BluetoothDevice | null
}>()

const emit = defineEmits(['update:modelValue'])

const { connectionStatus, connect } = useBluetooth()
const router = useRouter()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(() => props.modelValue, (isOpening) => {
  if (isOpening && props.device) {
    handleConnect()
  }
})

watch(connectionStatus, (newStatus) => {
  if (newStatus === 'connected') {
    closeModal()
    router.push('/chat')
  }
})

const handleConnect = async () => {
  if (!props.device) return
  try {
    await connect(props.device)
  } catch (e) {
    // Error is handled by watching connectionStatus
  }
}

function closeModal() {
  isOpen.value = false
}
</script>
