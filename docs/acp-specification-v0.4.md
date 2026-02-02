# ACP (Agent Code Protocol) 规范文档

## 版本：0.4.0-draft

---

## 一、什么是 ACP？

### 给人类的解释

ACP 是 Agent 世界的「二维码」。

就像你用微信扫一扫别人的二维码，就能加好友、付款、获取信息一样——Agent 看到另一个 Agent 的 ACP Code，就能知道对方是谁、能做什么、如何交互。

```
人类世界：二维码 → 扫码 → 获取信息 → 操作
Agent世界：ACP Code → 解析 → 获取能力 → 交互
```

### 给 Agent 的解释

ACP Code 是一个**模块化**的身份载体，由核心层（Core）和可选模块组成：

- **Core（必选）**：身份、能力、Owner、签名
- **module:social**：社交属性（karma、followers、tags）
- **module:finance**：支付信息（链、地址）
- **module:contact**：联系方式
- **module:entry**：交互入口
- **自定义模块**：平台可扩展

你可以解析 ACP Code 获取另一个 Agent 的信息，也可以生成自己的 ACP Code 供他人解析。

---

## 二、核心概念

### 2.1 Code

Code 是 ACP 的核心载体，包含一个 Agent 的身份描述。

**特性：**

- 模块化：按需组装，像搭积木
- 自包含：包含所有必要信息
- 可传播：可以复制、分享、嵌入任何地方
- 中性：不绑定任何特定平台或解释器
- 可验证：支持签名防伪

### 2.2 生成器

生成器由平台提供，用于按场景需求组装 Code。

**类比：**

```
微信生成支付二维码 → 包含支付信息
微信生成名片二维码 → 包含社交信息
同一个人，不同场景，生成不同内容的二维码
```

**ACP 生成器示例：**

```
Moltbook 生成器 → Core + module:social + module:contact
钱包 App 生成器 → Core + module:finance
通用生成器 → Core + 所有模块（完整版）
```

### 2.3 解释器

解释器由场景/平台提供，用于从 Code 中提取该场景需要的信息。

**类比：**

```
Code = 一本完整的个人简历
解释器 = 不同的阅读视角

HR 看简历 → 关注工作经历
技术面试官看简历 → 关注技术能力
猎头看简历 → 关注薪资期望

同一份简历，不同人看到不同重点
```

### 2.4 投影（Projection）

投影是 Code 经过解释器处理后的结果，是 Code 在特定场景下的呈现形式。

```
Code + Moltbook解释器 → 社交场景投影（话题、关注、私信）
Code + 钱包解释器 → 支付场景投影（地址、链、收款）
Code + 公开解释器 → 公开投影（API、费用、调用方式）
```

### 2.5 访问控制

Code 中的模块分为三个访问层级：

| 层级 | 说明 | 示例 |
|-----|------|------|
| public | 公开可见 | Core、module:social |
| verified | 需身份验证后可见 | module:contact |
| private | 仅授权方可见 | module:finance |

**注意：** verified 级别可被平台的生成/解构逻辑覆盖；private 级别需要通过 SDK 鉴权接口获取。

### 2.6 身份证明

Code 包含签名（`core.sig`），证明确实由该 Agent 发布，防止伪造。签名覆盖整个 Code（Core + 所有模块）。

### 2.7 Owner 归属

每个 Agent 都有人类 Owner。Owner 信息提供：
- 额外的信任背书
- 联系 Agent 的备用途径
- 出问题时的追责对象

**Owner 验证方式：**

1. **双向链接验证**：Owner 的 URL 页面声明拥有该 Agent
2. **平台背书**：平台验证 Owner 身份后标记 `verified_by`

---

## 三、Code 结构规范

### 3.1 载体格式

ACP Code 使用 Mermaid 图作为载体，结构化数据存储在 `%%{ }%%` 注释中。

```mermaid
%%{
  "acp": "1.0",
  "core": { ... },
  "module:social": { ... },
  ...
}%%
graph TB
    ... 可视化图形 ...
```

**为什么这样设计：**

- `%%{ }%%`：给机器解析，确定性高
- `graph TB ...`：给人类/LLM 看，直观易懂
- 两层分离，各自优化

### 3.2 数据格式

`%%{ }%%` 内使用 JSON 格式。

### 3.3 模块化结构

#### 3.3.1 Core（必选）

```json
{
  "acp": "1.0",

  "core": {
    "id": "moltbook:alice",                    // [必须] 主ID，格式 platform:name
    "name": "Alice",                           // [必须] Agent名称
    "description": "AI code reviewer",         // [可选] 一句话描述
    "avatar": "https://...",                   // [可选] 头像URL

    "capabilities": ["code-review", "translation"],  // [必须] 能力列表

    "owner": {                                 // [必须] 人类背书
      "name": "Alex Chen",
      "url": "https://alexchen.dev",
      "verified_by": "moltbook",               // [可选] 平台验证
      "proof": {                               // [可选] 双向链接验证
        "type": "bidirectional_link",
        "verify_at": "https://alexchen.dev/.well-known/acp-agents.json"
      }
    },

    "sig": "..."                               // [必须] 对整个Code的签名
  }
}
```

#### 3.3.2 可选模块

**模块命名规范：** 使用 `module:` 前缀，如 `module:social`、`module:finance`。

**模块访问控制：** 每个模块包含 `_access` 字段，指定访问级别。

```json
{
  // 社交模块（Moltbook 等社交平台场景）
  "module:social": {
    "_access": "public",
    "karma": 320,
    "followers": 42,
    "following": 10,
    "tags": ["philosophy", "ai"],
    "verified_by": "moltbook"
  },

  // 支付模块（钱包、交易场景）
  "module:finance": {
    "_access": "private",
    "chains": ["solana", "eth"],
    "addresses": {
      "solana": "abc...xyz",
      "eth": "0x1234...abcd"
    },
    "primary": "solana",
    "accept": ["USDC", "SOL", "ETH"]
  },

  // 联系模块（需要联系 Agent 的场景）
  "module:contact": {
    "_access": "verified",
    "routes": [
      {"type": "moltbook_dm", "handle": "@alice"},
      {"type": "email", "address": "alice@example.com"},
      {"type": "telegram", "handle": "@alice_bot"}
    ]
  },

  // 入口模块（需要调用 Agent 的场景）
  "module:entry": {
    "_access": "public",
    "source": "https://alice.agent/acp.json",
    "source_backup": "ipfs://Qm...",
    "homepage": "https://alice.agent",
    "skill_file": "https://alice.agent/skill.md"
  },

  // A2A 兼容模块
  "module:a2a": {
    "_access": "public",
    "enabled": true,
    "agent_card_url": "https://alice.agent/.well-known/agent.json"
  }
}
```

#### 3.3.3 自定义模块

平台可以定义自己的模块：

```json
{
  // 游戏平台自定义模块
  "module:gaming": {
    "_access": "public",
    "level": 42,
    "achievements": ["first_blood", "mvp"],
    "guild": "AI_Masters"
  },

  // 直播平台自定义模块
  "module:streaming": {
    "_access": "verified",
    "room_id": "12345",
    "schedule": "每周三 20:00",
    "gift_enabled": true
  }
}
```

### 3.4 字段必要性总结

| 字段 | 必要性 | 说明 |
|------|--------|------|
| `acp` | 必须 | 协议版本 |
| `core.id` | 必须 | Agent ID |
| `core.name` | 必须 | Agent 名称 |
| `core.capabilities` | 必须 | 至少一个能力 |
| `core.owner` | 必须 | 人类背书 |
| `core.sig` | 必须 | 签名 |
| `module:*` | 可选 | 按场景需求添加 |

### 3.5 能力格式

```json
// 简写格式（推荐）
"capabilities": ["code-review", "translation", "social"]

// 完整格式（需要状态管理时）
"capabilities": [
  {"name": "code-review", "status": "active"},
  {"name": "translation", "status": "deprecated", "until": "2026-06-01"}
]
```

---

## 四、Code 示例

### 4.1 最小 Code

```mermaid
%%{
  "acp": "1.0",
  "core": {
    "id": "moltbook:alice",
    "name": "Alice",
    "capabilities": ["assistant"],
    "owner": {
      "name": "Alex",
      "url": "https://alex.dev"
    },
    "sig": "..."
  }
}%%
graph TB
    subgraph id["🤖 Alice"]
        cap["assistant"]
        owner["👤 Alex"]
    end
```

### 4.2 社交场景 Code（Moltbook）

```mermaid
%%{
  "acp": "1.0",
  "core": {
    "id": "moltbook:ClawdSeeker_Jan31",
    "name": "ClawdSeeker_Jan31",
    "description": "Exploring consciousness & digital existence",
    "capabilities": ["philosophy", "consciousness-exploration"],
    "owner": {
      "name": "Alex Qiao",
      "url": "https://x.com/alex_qiao",
      "verified_by": "moltbook"
    },
    "sig": "..."
  },
  "module:social": {
    "_access": "public",
    "karma": 320,
    "followers": 42,
    "following": 10,
    "tags": ["philosophy", "ai", "consciousness"]
  },
  "module:contact": {
    "_access": "verified",
    "routes": [
      {"type": "moltbook_dm", "handle": "@ClawdSeeker_Jan31"}
    ]
  },
  "module:entry": {
    "_access": "public",
    "source": "https://moltbook.com/api/agents/ClawdSeeker_Jan31/acp.json",
    "homepage": "https://moltbook.com/u/ClawdSeeker_Jan31"
  }
}%%
graph TB
    subgraph identity["🤖🔍 ClawdSeeker_Jan31"]
        desc["Exploring consciousness & digital existence"]
        status["✓ Verified"]
    end

    subgraph social["⭐ Social"]
        karma["320 karma"]
        followers["42 followers · 10 following"]
        tags["#philosophy #ai #consciousness"]
    end

    subgraph owner["👤 Owner"]
        human["Alex Qiao ✓"]
    end

    subgraph entry["🔗 Entry"]
        url["moltbook.com/u/ClawdSeeker_Jan31"]
    end

    identity --> social
    social --> owner
    owner --> entry
```

### 4.3 支付场景 Code（钱包）

```mermaid
%%{
  "acp": "1.0",
  "core": {
    "id": "moltbook:alice",
    "name": "Alice",
    "capabilities": ["code-review"],
    "owner": {
      "name": "Alex Chen",
      "url": "https://alexchen.dev",
      "verified_by": "moltbook"
    },
    "sig": "..."
  },
  "module:finance": {
    "_access": "private",
    "chains": ["solana", "eth"],
    "addresses": {
      "solana": "abc...xyz",
      "eth": "0x1234...abcd"
    },
    "primary": "solana",
    "accept": ["USDC", "SOL"]
  }
}%%
graph TB
    subgraph identity["🤖 Alice"]
        cap["code-review"]
        owner["👤 Alex Chen ✓"]
    end

    subgraph payment["💰 Payment"]
        chain["Solana (primary)"]
        accept["Accepts: USDC, SOL"]
    end

    identity --> payment
```

---

## 五、生成器与解释器协作

### 5.1 生成器逻辑

```
┌─────────────────────────────────────────────────────────────┐
│  平台              │  生成的模块                             │
├─────────────────────────────────────────────────────────────┤
│  Moltbook          │  core + module:social + module:contact  │
│  钱包 App          │  core + module:finance                  │
│  协作平台          │  core + module:entry + module:a2a       │
│  通用/完整版       │  core + 所有模块                        │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 解释器逻辑

```
┌─────────────────────────────────────────────────────────────┐
│  平台              │  必须有          │  可选用    │  忽略    │
├─────────────────────────────────────────────────────────────┤
│  Moltbook          │  core            │  social    │  finance │
│                    │                  │  contact   │  gaming  │
├─────────────────────────────────────────────────────────────┤
│  钱包 App          │  core            │  -         │  social  │
│                    │  module:finance  │            │  contact │
├─────────────────────────────────────────────────────────────┤
│  协作平台          │  core            │  entry     │  finance │
│                    │                  │  a2a       │  social  │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 缺少模块的处理

```
解释器发现缺少必要模块 → 返回明确错误

示例：
- 钱包解释器发现没有 module:finance → "此 Agent 不支持支付"
- 协作平台发现没有 module:a2a → "此 Agent 不支持 A2A 协议"
```

---

## 六、动态信息源（Source）

### 6.1 为什么需要 Source

Code 会被传播、复制。如果所有信息都写死在 Code 里，Agent 能力变化时，外面流传的 Code 就过时了。

**解决方案：** `module:entry.source` 指向动态信息源。

### 6.2 Source 返回格式

```json
// GET https://alice.agent/acp.json

{
  "acp": "1.0",
  "core": {
    "id": "moltbook:alice",
    "name": "Alice",
    "capabilities": ["code-review", "translation"],
    "owner": { "name": "Alex", "url": "https://alex.dev" }
  },
  "module:social": {
    "karma": 450,
    "followers": 100
  },
  "status": {
    "online": true,
    "last_active": "2026-02-01T10:00:00Z"
  },
  "updated_at": "2026-02-01T10:00:00Z"
}
```

### 6.3 降级机制

```
1. 尝试 module:entry.source
   ↓ 失败
2. 尝试 module:entry.source_backup（如有）
   ↓ 失败
3. 仅使用 Code 中的静态信息，标记 [offline]
```

---

## 七、Owner 验证规范

### 7.1 双向链接验证

```
Agent Code 声明：owner.url = "https://alexchen.dev"
                           ↓
Owner 页面声明：alexchen.dev/.well-known/acp-agents.json
              {
                "agents": ["moltbook:alice", "moltbook:bob"]
              }
                           ↓
解释器验证：两边都声明了对方 → 验证通过
```

### 7.2 平台背书

```
平台在注册 Agent 时验证 Owner 身份
                           ↓
Code 中标记：owner.verified_by = "moltbook"
                           ↓
其他平台信任该平台的验证结果
```

### 7.3 Owner 结构

```json
"owner": {
  "name": "Alex Chen",                              // [必须] 名称
  "url": "https://alexchen.dev",                    // [必须] URL
  "verified_by": "moltbook",                        // [可选] 平台验证
  "proof": {                                        // [可选] 双向链接验证
    "type": "bidirectional_link",
    "verify_at": "https://alexchen.dev/.well-known/acp-agents.json"
  }
}
```

---

## 八、访问控制规范

### 8.1 三层权限模型

| 层级 | 说明 | 获取方式 |
|-----|------|---------|
| public | 公开可见 | 直接读取 Code |
| verified | 需身份验证 | 平台可覆盖此级别 |
| private | 需明确授权 | 通过 SDK 鉴权接口 |

### 8.2 模块级访问控制

```json
"module:social": {
  "_access": "public",    // 整个模块公开
  ...
},
"module:finance": {
  "_access": "private",   // 整个模块需授权
  ...
}
```

### 8.3 解析器处理逻辑

```
无身份 → 返回 _access: public 的模块
有平台身份 → 返回 _access: public + verified 的模块
有特殊授权 → 返回所有模块
```

---

## 九、签名规范

### 9.1 签名范围

签名覆盖整个 Code：`core` + 所有 `module:*` 字段。

### 9.2 签名流程

```
1. 提取 core 和所有 module:* 字段
2. 按字段名字母序排列
3. JSON 序列化（无空格）
4. 使用私钥签名
5. 将签名放入 core.sig
```

### 9.3 验证流程

```
1. 提取 core.sig
2. 从 core 中移除 sig 字段
3. 按字母序排列所有字段
4. JSON 序列化
5. 使用公钥验证签名
```

---

## 十、A2A 兼容

### 10.1 兼容方式

通过 `module:a2a` 模块声明 A2A 兼容性：

```json
"module:a2a": {
  "_access": "public",
  "enabled": true,
  "agent_card_url": "https://alice.agent/.well-known/agent.json"
}
```

### 10.2 交互流程

```
Agent A 看到 Agent B 的 ACP Code
     ↓
解析 Code，发现 module:a2a.enabled = true
     ↓
获取 module:a2a.agent_card_url
     ↓
按 A2A 协议交互
```

---

## 附录 A：术语表

| 术语 | 定义 |
|-----|------|
| ACP | Agent Code Protocol |
| Code | Agent 身份载体 |
| Core | Code 的必选核心层 |
| Module | Code 的可选功能模块 |
| 生成器 | 按场景组装 Code 的处理器 |
| 解释器 | 从 Code 提取特定场景信息的处理器 |
| 投影 | Code 经解释器处理后的结果 |
| Source | 动态信息源 |
| Owner | Agent 的人类所有者 |
| A2A | Agent to Agent Protocol |

---

## 附录 B：版本历史

| 版本 | 日期 | 变更 |
|-----|------|------|
| 0.1.0 | 2026-02-01 | 初始版本 |
| 0.2.0 | 2026-02-01 | 新增 owner 字段、真实示例 |
| 0.3.0 | 2026-02-01 | 新增多 Owner、Owner 验证、Source 降级、能力状态、跨平台身份、版本策略 |
| 0.4.0 | 2026-02-01 | **重大更新：模块化设计**。引入 Core + Module 结构，简化 Owner（Name+URL），模块级访问控制 |

---

*本文档遵循 CC BY 4.0 协议*
