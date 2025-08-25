# Bluetooth Chat Extension - 藍牙端對端私密聊天擴充功能

> 基於 Vue 3 + Nuxt 4 的清爽簡約風格藍牙聊天瀏覽器擴充功能

## 🎯 專案概述

本專案旨在開發一個運用藍牙連線組成端對端私有加密網路的聊天通訊瀏覽器附加元件，採用現代化的 Vue 3 + Nuxt 4 技術棧，提供安全、私密的近距離通訊解決方案。

## 🚀 核心功能

- **藍牙 P2P 連線**: 直接透過藍牙建立設備間連接
- **端對端加密**: 使用現代加密算法保護訊息安全
- **無網路依賴**: 完全離線的點對點通訊
- **清爽介面**: 簡約現代的 UI 設計
- **跨瀏覽器**: 支援 Chrome、Edge 等主流瀏覽器

## 📊 可行性評估

### ✅ 技術優勢
- Web Bluetooth API 在 Chrome/Edge 完全支援
- 約 76.5% 全球用戶設備支援 (2024年)
- 已有成功的開源案例參考

### ⚠️ 技術挑戰
- Safari/Firefox 不支援 Web Bluetooth API
- 藍牙連線範圍限制 (10-100公尺)
- 需要手動設備配對

### 🎯 目標用戶
- 重視隱私的個人用戶
- 需要安全通訊的團隊
- 特殊環境下的近距離通訊需求

## 🛠️ 技術選型

### 核心框架
```
前端框架     Vue 3.5+ (Composition API)
元框架       Nuxt 4 (最新版本)
類型系統     TypeScript
```

### UI/UX 設計
```
樣式框架     Tailwind CSS
組件庫       Headless UI Vue
圖標系統     Iconify Vue
工具庫       VueUse
```

### 瀏覽器擴充功能
```
標準         WebExtension API (Manifest V3)
核心 API     Web Bluetooth API
跨瀏覽器     Chrome, Edge, Opera
```

### 加密與安全
```
原生加密     Web Crypto API
E2E加密      libsodium.js / sodium-plus
金鑰管理     ECDH + AES-GCM
```

### 狀態管理
```
狀態管理     Pinia (Vue 官方推薦)
持久化       VueUse/Storage
```

### 開發工具
```
構建工具     Vite
代碼規範     ESLint + Prettier
類型檢查     TypeScript ESLint
```

## 📁 專案架構

```
bluetooth-chat-extension/
├── 📂 src/
│   ├── 📂 components/           # Vue 組件
│   │   ├── 📂 ui/              # 基礎 UI 組件
│   │   │   ├── ChatBubble.vue
│   │   │   ├── Button.vue
│   │   │   └── Input.vue
│   │   ├── 📂 chat/            # 聊天相關組件
│   │   │   ├── ChatWindow.vue
│   │   │   ├── MessageList.vue
│   │   │   └── ChatInput.vue
│   │   └── 📂 bluetooth/       # 藍牙相關組件
│   │       ├── DeviceList.vue
│   │       ├── ConnectionStatus.vue
│   │       └── PairingDialog.vue
│   ├── 📂 composables/         # 組合式 API
│   │   ├── useBluetooth.ts     # 藍牙連線邏輯
│   │   ├── useEncryption.ts    # 加密解密邏輯
│   │   ├── useChat.ts          # 聊天功能邏輯
│   │   └── useStorage.ts       # 本地儲存邏輯
│   ├── 📂 stores/              # Pinia 狀態管理
│   │   ├── bluetooth.ts        # 藍牙連接狀態
│   │   ├── chat.ts             # 聊天訊息狀態
│   │   ├── settings.ts         # 應用設定狀態
│   │   └── encryption.ts       # 加密金鑰狀態
│   ├── 📂 utils/               # 工具函數
│   │   ├── crypto.ts           # 加密工具
│   │   ├── bluetooth.ts        # 藍牙工具
│   │   ├── storage.ts          # 儲存工具
│   │   └── validation.ts       # 資料驗證
│   ├── 📂 popup/               # 擴充功能彈窗
│   │   ├── popup.vue
│   │   └── popup.html
│   ├── 📂 content/             # 內容腳本
│   │   └── content.ts
│   ├── 📂 background/          # 背景腳本
│   │   └── background.ts
│   └── 📂 options/             # 設定頁面
│       ├── options.vue
│       └── options.html
├── 📂 public/
│   ├── manifest.json           # 擴充功能清單
│   └── 📂 icons/               # 圖標資源
├── 📄 nuxt.config.ts           # Nuxt 配置
├── 📄 tailwind.config.js       # Tailwind CSS 配置
├── 📄 tsconfig.json            # TypeScript 配置
└── 📄 package.json             # 專案依賴
```

## 🔧 核心實作規劃

### 1. 藍牙連線管理

```typescript
// composables/useBluetooth.ts
export const useBluetooth = () => {
  const isSupported = ref(false)
  const isConnected = ref(false)
  const device = ref<BluetoothDevice | null>(null)
  
  const connect = async () => {
    // 實作藍牙設備連接邏輯
  }
  
  const disconnect = () => {
    // 實作斷開連接邏輯
  }
  
  return { isSupported, isConnected, connect, disconnect }
}
```

### 2. 端對端加密

```typescript
// composables/useEncryption.ts
export const useEncryption = () => {
  const generateKeyPair = async () => {
    // 生成 ECDH 金鑰對
  }
  
  const encrypt = async (message: string, publicKey: CryptoKey) => {
    // AES-GCM 加密訊息
  }
  
  const decrypt = async (encryptedData: ArrayBuffer, privateKey: CryptoKey) => {
    // 解密訊息
  }
  
  return { generateKeyPair, encrypt, decrypt }
}
```

### 3. 訊息傳輸協議

```typescript
interface Message {
  id: string
  type: 'text' | 'file' | 'system'
  content: string
  timestamp: Date
  senderId: string
  encrypted?: boolean
}

interface BluetoothPacket {
  header: {
    version: string
    type: 'message' | 'ack' | 'keyExchange'
    messageId: string
  }
  payload: {
    data: ArrayBuffer
    checksum: string
  }
}
```

## 🎨 UI/UX 設計規範

### 設計原則
- **簡約清爽**: 最小化介面元素，突出核心功能
- **安全感知**: 視覺上體現加密和安全性
- **易用性**: 直觀的操作流程
- **響應式**: 適配不同尺寸的擴充功能視窗

### 色彩規範
```css
:root {
  /* 主色調 - 科技藍 */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* 安全色 - 綠色 */
  --success-500: #10b981;
  
  /* 警告色 - 橙色 */
  --warning-500: #f59e0b;
  
  /* 錯誤色 - 紅色 */
  --error-500: #ef4444;
  
  /* 中性色 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-500: #6b7280;
  --gray-900: #111827;
}
```

### 組件範例

```vue
<!-- 聊天氣泡組件 -->
<template>
  <div :class="bubbleClasses">
    <p class="text-sm">{{ message.content }}</p>
    <div class="flex items-center justify-between mt-1">
      <time class="text-xs opacity-70">{{ formatTime(message.timestamp) }}</time>
      <Icon v-if="message.encrypted" name="shield-check" class="w-3 h-3 text-green-500" />
    </div>
  </div>
</template>
```

## 🚦 開發階段規劃

### Phase 1: 基礎架構 (週 1-2)
- [x] 專案初始化和環境配置
- [ ] 基礎 UI 組件開發
- [ ] 藍牙 API 整合
- [ ] 基本的設備發現和配對

### Phase 2: 核心功能 (週 3-4)
- [ ] 點對點訊息傳輸
- [ ] 基礎加密實作
- [ ] 訊息儲存和同步
- [ ] 連接狀態管理

### Phase 3: 進階功能 (週 5-6)
- [ ] 端對端加密強化
- [ ] 多設備管理
- [ ] 檔案傳輸功能
- [ ] 離線訊息處理

### Phase 4: 優化和測試 (週 7-8)
- [ ] 效能優化
- [ ] 安全性測試
- [ ] 使用者體驗優化
- [ ] 跨瀏覽器測試

### Phase 5: 部署和發布 (週 9-10)
- [ ] 擴充功能打包
- [ ] Chrome Web Store 上架
- [ ] 使用者文件編寫
- [ ] 社群回饋收集

## 🔒 安全性考量

### 加密策略
- **金鑰交換**: ECDH (Elliptic Curve Diffie-Hellman)
- **對稱加密**: AES-256-GCM
- **訊息認證**: HMAC-SHA256
- **金鑰輪替**: 定期更新會話金鑰

### 隱私保護
- **本地儲存**: 所有資料僅儲存在本地
- **無伺服器**: 不依賴任何中央伺服器
- **匿名通訊**: 不收集用戶個人資訊
- **資料清理**: 提供完全清除功能

### 安全最佳實踐
- 定期安全性審查
- 使用最新的加密算法
- 實作輸入驗證和消毒
- 防範中間人攻擊

## 📱 跨平台支援

### 支援的瀏覽器
- ✅ Chrome 85+
- ✅ Microsoft Edge 85+
- ✅ Opera 71+
- ❌ Safari (不支援 Web Bluetooth)
- ❌ Firefox (不支援 Web Bluetooth)

### 替代方案
- 提供 WebRTC 備用連接
- 考慮 Progressive Web App 版本
- 開發 Electron 桌面應用

## 🧪 測試策略

### 單元測試
```bash
# 使用 Vitest 進行單元測試
npm run test:unit
```

### 整合測試
```bash
# 測試組件間的整合
npm run test:integration
```

### E2E 測試
```bash
# 使用 Playwright 進行端到端測試
npm run test:e2e
```

### 安全性測試
- 加密算法驗證
- 金鑰管理測試
- 漏洞掃描
- 滲透測試

## 📊 效能指標

### 目標效能
- **連接建立時間**: < 3 秒
- **訊息傳輸延遲**: < 500ms
- **記憶體使用**: < 50MB
- **CPU 使用率**: < 5%

### 監控指標
- 藍牙連接成功率
- 訊息傳輸成功率
- 加密/解密效能
- 電池消耗影響

## 🚀 快速開始

### 環境需求
- Node.js 18+
- npm 或 yarn
- 支援 Web Bluetooth 的瀏覽器

### 安裝步驟

```bash
# 1. 克隆專案
git clone https://github.com/yolo-cat/bluetooth-chat-extension.git
cd bluetooth-chat-extension

# 2. 安裝依賴
npm install

# 3. 開發模式
npm run dev

# 4. 構建擴充功能
npm run build

# 5. 載入到瀏覽器
# Chrome -> 更多工具 -> 擴充功能 -> 載入未封裝項目 -> 選擇 dist 資料夾
```

### 開發指令

```bash
npm run dev          # 開發模式
npm run build        # 生產構建
npm run preview      # 預覽構建結果
npm run lint         # 代碼檢查
npm run test         # 執行測試
npm run type-check   # TypeScript 類型檢查
```

## 📄 API 文件

### 核心 Composables

#### useBluetooth()
```typescript
const {
  isSupported,      // 瀏覽器是否支援
  isConnected,      // 是否已連接
  devices,          // 可用設備列表
  connect,          // 連接設備
  disconnect,       // 斷開連接
  sendMessage       // 發送訊息
} = useBluetooth()
```

#### useEncryption()
```typescript
const {
  keyPair,          // 當前金鑰對
  generateKeyPair,  // 生成新金鑰對
  encrypt,          // 加密訊息
  decrypt,          // 解密訊息
  exchangeKeys      // 金鑰交換
} = useEncryption()
```

#### useChat()
```typescript
const {
  messages,         // 訊息列表
  sendMessage,      // 發送訊息
  receiveMessage,   // 接收訊息
  clearHistory,     // 清除歷史
  exportChat        // 匯出聊天記錄
} = useChat()
```

## 🤝 貢獻指南

### 開發流程
1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

### 代碼規範
- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 進行類型檢查
- 編寫單元測試覆蓋新功能
- 更新相關文件

### 問題回報
使用 [GitHub Issues](https://github.com/yolo-cat/bluetooth-chat-extension/issues) 回報問題，請包含：
- 詳細的問題描述
- 重現步驟
- 預期行為 vs 實際行為
- 瀏覽器和系統資訊

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 聯絡資訊

- **開發者**: [@yolo-cat](https://github.com/yolo-cat)
- **專案連結**: [https://github.com/yolo-cat/bluetooth-chat-extension](https://github.com/yolo-cat/bluetooth-chat-extension)
- **問題回報**: [Issues](https://github.com/yolo-cat/bluetooth-chat-extension/issues)

## 🙏 致謝

感謝以下開源專案的啟發和支援：
- [Vue.js](https://vuejs.org/)
- [Nuxt.js](https://nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [libsodium.js](https://github.com/jedisct1/libsodium.js)

---

**⚡ 開始您的私密聊天之旅！**

> 這個專案展示了現代 Web 技術在隱私通訊領域的創新應用，結合了 Vue 3 的響應式設計、Nuxt 4 的開發體驗，以及藍牙技術的本地網路能力，為用戶提供了一個安全、私密的通訊解決方案。
