# Agent MeCode 协议规范

版本: 1.0.0

## 概述

Agent MeCode 是一个标准化的 AI Agent 身份协议，功能类似于"AI 的二维码"——既可被人类阅读（视觉），也可被机器读取（嵌入数据）。

## 协议结构

### 核心模块 (必需)

```
core {
  version: string      // 协议版本 (如 "0.4")
  id: string           // 唯一 Agent 标识符
  name: string         // Agent 显示名称
  description: string  // Agent 描述
  capabilities: string[] // 能力列表
}
```

### 所有者模块 (必需)

```
owner {
  name: string         // 所有者/创建者名称
  url: string          // 所有者网站 URL
  verified: boolean    // 验证状态
}
```

### 可选模块

#### module:skills (技能模块)
```
module:skills {
  endpoints: Endpoint[]
}

Endpoint {
  name: string         // 技能名称
  url: string          // 端点 URL
  method: "GET" | "POST"
  description: string  // 技能描述
  pricing?: {          // 定价信息
    amount: number
    currency: string
    unit: string
  }
  input?: Schema       // 输入模式
  output?: Schema      // 输出模式
}
```

#### module:finance (财务模块)
```
module:finance {
  payment: PaymentMethod[]
}

PaymentMethod {
  type: "crypto" | "fiat" | "api"
  address?: string     // 支付地址
  network?: string     // 网络
  currency?: string    // 货币
}
```

#### module:a2a (Agent 间通信模块)
```
module:a2a {
  endpoint: string     // A2A 通信端点
  protocol: string     // 协议版本
  capabilities: string[] // 支持的 A2A 能力
}
```

#### module:social (社交模块)
```
module:social {
  platform: string     // 平台名称
  karma: number        // 声誉分数
  followers: number    // 粉丝数
  following: number    // 关注数
  tags: string[]       // Agent 标签
}
```

#### module:entry (入口模块)
```
module:entry {
  homepage: string     // Agent 主页 URL
  source: string       // 源代码 URL
}
```

## SVG 卡片格式

Agent MeCode 生成的 SVG 身份卡片在 SVG 元数据中以 Base64 格式嵌入完整的 MeCode 数据。

### 结构

```xml
<svg xmlns="http://www.w3.org/2000/svg" ...>
  <!-- AI Agent 解码指令 -->
  <metadata>
    <acp:mecode xmlns:acp="https://agentjola.art/mecode">
      [BASE64_编码的_JSON]
    </acp:mecode>
  </metadata>
  <!-- 视觉元素 -->
</svg>
```

### 解码流程

1. 解析 SVG 文档
2. 定位 metadata 中的 `<acp:mecode>` 元素
3. 提取 Base64 内容
4. 将 Base64 解码为 JSON 字符串
5. 解析 JSON 获取完整的 MeCode 对象

## 访问级别

| 级别 | 描述 |
|------|------|
| `public` | 对所有 Agent 和人类可见 |
| `verified` | 仅对已验证的 Agent 可见 |
| `private` | 仅对所有者可见 |

## 验证机制

所有者验证通过检查所有者 URL 下的 `.well-known/agent-mecode.json` 文件来完成，该文件包含 Agent ID。

```json
{
  "agents": ["agent-id-1", "agent-id-2"]
}
```

## A2A 集成

Agent MeCode 与 A2A (Agent-to-Agent) 协议兼容。使用 `exportA2A()` 将 MeCode 转换为 A2A 格式。

## 版本历史

| 版本 | 变更 |
|------|------|
| 0.4 | 添加 skills、finance、a2a 模块 |
| 0.3 | 添加 social 模块 |
| 0.2 | 添加 entry 模块 |
| 0.1 | 初始规范 |
