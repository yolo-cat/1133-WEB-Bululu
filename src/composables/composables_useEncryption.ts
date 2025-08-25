import { box, randomBytes } from 'sodium-plus'

export const useEncryption = () => {
  const keyPair = ref<any>(null)

  // 生成金鑰對
  const generateKeyPair = async () => {
    keyPair.value = await box.keyPair()
    return keyPair.value
  }

  // 加密訊息
  const encrypt = async (message: string, recipientPublicKey: any) => {
    const nonce = await randomBytes(24)
    const plaintext = Buffer.from(message, 'utf8')
    
    const ciphertext = await box(
      plaintext,
      nonce,
      recipientPublicKey,
      keyPair.value.privateKey
    )

    return {
      ciphertext: ciphertext.toString('base64'),
      nonce: nonce.toString('base64')
    }
  }

  // 解密訊息
  const decrypt = async (encryptedData: any, senderPublicKey: any) => {
    const ciphertext = Buffer.from(encryptedData.ciphertext, 'base64')
    const nonce = Buffer.from(encryptedData.nonce, 'base64')

    const plaintext = await box.open(
      ciphertext,
      nonce,
      senderPublicKey,
      keyPair.value.privateKey
    )

    return plaintext.toString('utf8')
  }

  return {
    keyPair,
    generateKeyPair,
    encrypt,
    decrypt
  }
}