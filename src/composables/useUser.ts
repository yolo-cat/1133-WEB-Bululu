import { ref } from 'vue'

// This state will be shared across all components that import this composable
const username = ref('')

export function useUser() {
  const setUsername = (name: string) => {
    if (name && name.trim().length > 0) {
      username.value = name.trim()
    }
  }

  return {
    // We return the ref itself to allow components to react to its changes
    // and to use it with v-model.
    username,
    setUsername,
  }
}
