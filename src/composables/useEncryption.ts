import { ref } from 'vue'

export const useEncryption = () => {
  const keyPair = ref<CryptoKeyPair | null>(null)
  const sharedKey = ref<CryptoKey | null>(null)

  // 1. Generate our own ECDH key pair
  const generateKeyPair = async () => {
    try {
      const newKeyPair = await window.crypto.subtle.generateKey(
        { name: 'ECDH', namedCurve: 'P-256' },
        true, // extractable
        ['deriveKey']
      )
      keyPair.value = newKeyPair
      console.log('ECDH key pair generated.')
    } catch (error) {
      console.error('Key pair generation failed:', error)
    }
  }

  // 2. Export our public key to send to the peer
  const exportPublicKey = async (publicKey: CryptoKey): Promise<ArrayBuffer | null> => {
    try {
      const exported = await window.crypto.subtle.exportKey('raw', publicKey)
      return exported
    } catch (error) {
      console.error('Public key export failed:', error)
      return null
    }
  }

  // 3. Import the peer's public key
  const importPublicKey = async (keyData: ArrayBuffer): Promise<CryptoKey | null> => {
    try {
      const importedKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        [] // No key usages for the public key when deriving
      )
      return importedKey
    } catch (error) {
      console.error('Public key import failed:', error)
      return null
    }
  }

  // 4. Derive the shared secret key (AES)
  const deriveSharedSecret = async (theirPublicKey: CryptoKey) => {
    if (!keyPair.value?.privateKey) {
      console.error('Own private key is not available.')
      return
    }
    try {
      const derived = await window.crypto.subtle.deriveKey(
        { name: 'ECDH', public: theirPublicKey },
        keyPair.value.privateKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )
      sharedKey.value = derived
      console.log('Shared secret derived.')
    } catch (error) {
      console.error('Shared secret derivation failed:', error)
    }
  }

  // 5. Encrypt a message
  const encrypt = async (text: string): Promise<{ ciphertext: ArrayBuffer, iv: Uint8Array } | null> => {
    if (!sharedKey.value) {
      console.error('Shared key is not available for encryption.')
      return null
    }
    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const encodedText = new TextEncoder().encode(text)
      const ciphertext = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        sharedKey.value,
        encodedText
      )
      return { ciphertext, iv }
    } catch (error) {
      console.error('Encryption failed:', error)
      return null
    }
  }

  // 6. Decrypt a message
  const decrypt = async (ciphertext: ArrayBuffer, iv: Uint8Array): Promise<string | null> => {
    if (!sharedKey.value) {
      console.error('Shared key is not available for decryption.')
      return null
    }
    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        sharedKey.value,
        ciphertext
      )
      return new TextDecoder().decode(decryptedBuffer)
    } catch (error)
    {
      console.error('Decryption failed:', error)
      return null
    }
  }

  return {
    keyPair,
    sharedKey,
    generateKeyPair,
    exportPublicKey,
    importPublicKey,
    deriveSharedSecret,
    encrypt,
    decrypt,
  }
}