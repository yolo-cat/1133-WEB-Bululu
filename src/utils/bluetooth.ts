// src/utils/bluetooth.ts

// This file contains constants related to the Bluetooth service.
// UUIDs generated from https://www.uuidgenerator.net/

// The custom service for the chat application.
export const CHAT_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';

// The characteristic used for sending and receiving chat messages.
// It supports write (for sending) and notify (for receiving).
export const CHAT_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
