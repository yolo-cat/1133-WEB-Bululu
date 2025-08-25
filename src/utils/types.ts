// src/utils/types.ts

/**
 * The structure for an encrypted message payload.
 * The IV is required for AES-GCM decryption.
 * We store binary data as arrays of numbers for reliable JSON serialization.
 */
export interface EncryptedPayload {
  iv: number[];
  ciphertext: number[];
}

/**
 * The generic structure for all packets sent over Bluetooth.
 */
export type Packet = KeyExchangePacket | ChatMessagePacket;

/**
 * Packet for exchanging public keys.
 * The payload is the raw ArrayBuffer of the public key, converted to an array of numbers.
 */
export interface KeyExchangePacket {
  type: 'key';
  payload: number[];
}

/**
 * Packet for sending an encrypted chat message.
 */
export interface ChatMessagePacket {
  type: 'msg';
  payload: EncryptedPayload;
}

/**
 * Represents a single chat message in the UI.
 */
export interface Message {
  id: number;
  text: string;
  timestamp: Date;
  sender: 'me' | 'them';
}
