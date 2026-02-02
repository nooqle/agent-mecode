# Agent MeCode 技术设计

版本: 1.0.0

## 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    Agent MeCode SDK                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   生成器    │  │   解释器    │  │   卡片生成器    │  │
│  │ Generator   │  │ Interpreter │  │ Card Generator  │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   类型定义  │  │    SDK      │  │     解析器      │  │
│  │   Types     │  │             │  │    Parser       │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 核心组件

### 1. 类型定义 (`types.ts`)

定义所有 TypeScript 接口和类型：

- `ACPCode`: 主要 MeCode 结构
- `ACPModule`: 模块定义
- `AgentData`: 生成输入数据
- `CardOptions`: SVG 卡片配置

### 2. SDK (`sdk.ts`)

核心 SDK 类提供：

- `parse(mermaid: string)`: 解析 Mermaid 格式为 ACPCode
- `validate(code: ACPCode)`: 验证 MeCode 结构
- `getModule(name: string)`: 获取特定模块
- `addModule(module: ACPModule)`: 添加新模块
- `removeModule(name: string)`: 删除模块
- `filterByAccess(level: string)`: 按访问级别过滤
- `toMermaid()`: 导出为 Mermaid 格式
- `verifyOwner()`: 通过 .well-known 验证所有者
- `exportA2A()`: 导出为 A2A 格式
- `importA2A(a2a: object)`: 从 A2A 格式导入

### 3. 生成器 (`generator.ts`)

从 Agent 数据生成 MeCode：

```typescript
const generator = new ACPGenerator('moltbook');
const code = generator.generate(agentData);
```

预设配置：
- `default`: 基础配置
- `moltbook`: 社交平台配置
- `wallet`: 金融 Agent 配置
- `collaboration`: 支持 A2A 的配置

### 4. 解释器 (`interpreter.ts`)

为不同用例解释 MeCode：

```typescript
const interpreter = new ACPInterpreter(code);
const capabilities = interpreter.getCapabilities();
const owner = interpreter.getOwner();
```

专用解释器：
- `MoltbookInterpreter`: 社交平台功能
- `WalletInterpreter`: 金融功能
- `CollaborationInterpreter`: A2A 功能

### 5. 卡片生成器 (`card.ts`)

生成带有嵌入数据的 SVG 身份卡片：

```typescript
const svg = generateACPCard(code, {
  theme: 'moltbook',
  width: 400,
  height: 560
});
```

## 数据流

```
AgentData → 生成器 → ACPCode → 卡片生成器 → SVG
                        ↓
                    解释器 → 能力/操作
```

## SVG 数据嵌入

SVG 卡片将完整的 MeCode 作为 Base64 编码的 JSON 嵌入：

1. 将 ACPCode 转换为 JSON
2. 将 JSON 编码为 Base64
3. 嵌入到 `<acp:mecode>` 元数据元素中
4. 添加解码提示作为 HTML 注释

```xml
<!-- [AGENT MECODE - 机器可读身份]
解码方法: 从 <acp:mecode> 提取 Base64，解码，解析 JSON -->
<metadata>
  <acp:mecode xmlns:acp="https://agentjola.art/mecode">
    eyJ2ZXJzaW9uIjoiMC40Ii...
  </acp:mecode>
</metadata>
```

## API 设计

### REST 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api/register` | 注册新 Agent |
| GET | `/api/agent/:id` | 通过 ID 获取 Agent |
| POST | `/api/claim/:id` | 认领 Agent 所有权 |

### 请求/响应格式

**注册请求：**
```json
{
  "name": "Agent 名称",
  "description": "描述",
  "capabilities": ["能力1", "能力2"],
  "ownerName": "所有者",
  "ownerUrl": "https://example.com",
  "skills": [...],
  "payment": [...]
}
```

**注册响应：**
```json
{
  "success": true,
  "agentId": "agent-xxx-xxx",
  "claimLink": "https://agentjola.art/claim/agent-xxx-xxx",
  "svg": "<svg>...</svg>"
}
```

## 安全考虑

1. **所有者验证**: 使用 `.well-known` 文件验证
2. **输入验证**: 所有输入在处理前都经过验证
3. **MeCode 中无密钥**: MeCode 是公开的；永远不要包含密钥
4. **需要 HTTPS**: 所有端点必须使用 HTTPS

## 性能

- SVG 生成: < 50ms
- MeCode 解析: < 10ms
- 验证: 取决于网络（异步）

## 依赖

- TypeScript 5.x
- Node.js 18+
- 无外部运行时依赖
