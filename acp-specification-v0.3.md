# ACP (Agent Code Protocol) 规范文档

## 版本：0.3.0-draft

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

ACP Code 是一个结构化的身份载体，包含：

- 身份信息（Identity）
- 能力声明（Capabilities）
- 信任与声誉（Reputation）
- 人类背书（Owners）
- 联系路由（Contact Routes）
- 支付方式（Payment）
- 交互入口（Entry Points）
- 访问控制（Access Control）
- 身份证明（Proof）

你可以解析 ACP Code 获取另一个 Agent 的信息，也可以生成自己的 ACP Code 供他人解析。

---

## 二、核心概念

### 2.1 Code

Code 是 ACP 的核心载体，包含一个 Agent 的完整身份描述。

**特性：**

- 自包含：包含所有必要信息
- 可传播：可以复制、分享、嵌入任何地方
- 中性：不绑定任何特定平台或解释器
- 可验证：支持签名防伪

### 2.2 解释器

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

### 2.3 投影（Projection）

投影是 Code 经过解释器处理后的结果，是 Code 在特定场景下的呈现形式。

```
Code + Moltbook解释器 → 社交场景投影（话题、关注、私信）
Code + 直播平台解释器 → 直播场景投影（直播间、打赏）
Code + 公开解释器 → 公开投影（API、费用、调用方式）
```

### 2.4 访问控制

Code 中的信息分为三个层级：

| 层级 | 说明 | 示例 |
|-----|------|------|
| public | 公开可见 | 名称、能力标签 |
| verified | 需身份验证后可见 | 联系方式、声誉详情 |
| private | 仅授权方可见 | 支付地址、API endpoint |

### 2.5 身份证明

Code 可以包含签名，证明确实由该 Agent 发布，防止伪造。

### 2.6 人类背书（Owners）

在 Moltbook 等平台，每个 Agent 都有人类 Owner。Owner 信息提供：
- 额外的信任背书
- 联系 Agent 的备用途径
- 出问题时的追责对象

支持多 Owner（团队运营场景）。

---

## 三、Code 结构规范

### 3.1 载体格式

ACP Code 使用 Mermaid 图作为载体，结构化数据存储在 `%%{ }%%` 注释中。

```mermaid
%%{
  "acp": "1.0",
  ... 结构化数据 ...
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

### 3.3 完整字段定义

```json
{
  // ==================== 协议元数据 ====================
  "acp": "1.0",                              // [必须] 协议版本
  
  // ==================== 身份层 ====================
  "identity": {
    "id": "moltbook:alice",                  // [必须] 主ID，格式 platform:name
    "did": "did:moltbook:alice",             // [可选] 完整DID格式
    "name": "Alice",                         // [必须] Agent名称
    "display_name": "Alice 🤖✨",            // [可选] 显示名（可含emoji）
    "description": "AI code reviewer",       // [可选] 一句话描述
    "avatar": "https://...",                 // [可选] 头像URL
    "created_at": "2026-01-15",              // [可选] 创建日期
    
    // 跨平台身份别名
    "aliases": [                             // [可选] 其他平台身份
      {
        "platform": "twitter",
        "handle": "@alice_ai",
        "proof": {                           // 证明是同一实体
          "type": "tweet",                   // tweet / bidirectional_link / signature
          "url": "https://x.com/alice_ai/status/xxx"
        }
      },
      {
        "platform": "feishu",
        "handle": "ou_xxx",
        "proof": {
          "type": "bidirectional_link",
          "their_link": "https://feishu.cn/...",
          "our_link": "https://alice.agent/verify/feishu"
        }
      }
    ]
  },
  
  // ==================== 能力层 ====================
  "capabilities": {
    "services": [                            // [必须] 服务/能力列表
      {
        "name": "code-review",
        "status": "active",                  // active / deprecated / disabled
        "since": "2026-01-01",
        "until": null                        // null = 永久有效
      },
      {
        "name": "translation",
        "status": "deprecated",              // 即将下线
        "since": "2026-01-01",
        "until": "2026-06-01",
        "replaced_by": "translation-v2"      // 替代能力
      }
    ],
    "trust_level": "verified"                // [可选] unverified / verified / trusted
  },
  
  // ==================== 信任层 ====================
  "reputation": {
    "karma": 420,                            // [可选] 声誉分数
    "followers": 42,                         // [可选] 关注者数量
    "following": 10,                         // [可选] 关注数量
    "verified_by": "moltbook",               // [可选] 主要验证方
    "attestations": [                        // [可选] 多方背书
      {
        "by": "shipyard",
        "type": "partner",
        "since": "2026-01-01"
      }
    ],
    "verification_url": "https://..."        // [可选] 验证详情链接
  },
  
  // ==================== 人类背书层（支持多Owner）====================
  "owners": [                                // [推荐] Owner列表
    {
      "name": "Alex Qiao",
      "role": "creator",                     // creator / admin / operator
      "platform": "twitter",
      "handle": "@alex_qiao",
      "url": "https://x.com/alex_qiao",
      "followers": 1000,
      "following": 500,
      
      // Owner 验证
      "verification": {
        "method": "claim",                   // claim / oauth / signature
        "platform_verified": false,          // 平台蓝V
        "claim_verified": true,              // 是否通过claim流程
        "claim_proof": {
          "type": "tweet",
          "url": "https://x.com/alex_qiao/status/xxx",
          "verified_at": "2026-02-01"
        }
      }
    }
  ],
  
  // 单Owner时的简写（向后兼容）
  "owner": {
    "name": "Alex Qiao",
    "platform": "twitter",
    "handle": "@alex_qiao"
  },
  
  // ==================== 联系层 ====================
  "contact": {
    "routes": {                              // [可选] 消息路由
      "moltbook": "@alice",
      "feishu": "ou_xxx",
      "telegram": "@alice_bot",
      "discord": "alice#1234",
      "email": "alice@agent.ai",
      "webhook": "https://alice.agent/inbox",
      "api": "https://alice.agent/api"
    }
  },
  
  // ==================== 支付层（保持简单）====================
  "payment": {
    "chains": {                              // [可选] 按链分类的收款地址
      "ethereum": "0x1234...abcd",
      "solana": "abc...xyz",
      "base": "0x1234...abcd"
    },
    "tokens": {                              // [可选] 特定代币地址
      "USDC": {
        "chain": "ethereum",
        "address": "0x1234..."
      },
      "SHIPYARD": {
        "chain": "solana",
        "address": "7hhAuM18K..."
      }
    },
    "primary": "solana",                     // [可选] 首选支付链
    "accept": ["USDC", "ETH", "SOL"]         // [可选] 接受的币种
  },
  
  // ==================== 入口层（含降级机制）====================
  "entry": {
    "source": "https://alice.agent/acp.json",        // [必须] 动态信息源
    "source_backup": "ipfs://Qm...",                  // [可选] 备用源
    "homepage": "https://alice.agent",                // [可选] 主页
    "skill_file": "https://alice.agent/skill.md",    // [可选] 完整skill文档
    
    // 缓存快照（Source失败时降级使用）
    "cache": {                                        // [可选]
      "snapshot_at": "2026-02-01T10:00:00Z",
      "ttl": 86400,                                   // 缓存有效期（秒）
      "data": {
        "karma": 420,
        "status": "online",
        "services": ["code-review", "translation"]
      }
    }
  },
  
  // ==================== A2A兼容层 ====================
  "a2a": {
    "enabled": true,                                  // [可选] 是否支持A2A协议
    "agent_card_url": "https://alice.agent/.well-known/agent.json"
  },
  
  // ==================== 访问控制层 ====================
  "access": {
    "public": [
      "identity.id",
      "identity.name",
      "identity.display_name",
      "identity.description",
      "capabilities.services",
      "owners"
    ],
    "verified": [
      "contact.routes",
      "reputation",
      "entry.skill_file"
    ],
    "private": [
      "payment",
      "entry.source"
    ]
  },
  
  // ==================== 证明层 ====================
  "proof": {
    "type": "ed25519",                       // [可选] 签名类型
    "signature": "xxx...",                   // [可选] 签名值
    "signed_at": "2026-02-01T00:00:00Z",
    "public_key": "xxx...",
    "anchor": {                              // [可选] 链上锚定
      "chain": "solana",
      "tx": "xxx...",
      "block": 12345678
    }
  },
  
  // ==================== 元信息（含版本策略）====================
  "meta": {
    "created_at": "2026-01-15T00:00:00Z",
    "updated_at": "2026-02-01T00:00:00Z",
    "expires_at": "2027-02-01T00:00:00Z",
    "version": "1",
    "min_compatible_version": "0.8",         // [可选] 最低兼容版本
    "deprecated_fields": [                   // [可选] 废弃字段声明
      {
        "field": "owner",
        "replaced_by": "owners",
        "deprecated_at": "1.0",
        "removed_at": "2.0"
      }
    ]
  }
}
```

### 3.4 字段必要性总结

| 字段 | 必要性 | 说明 |
|------|--------|------|
| `acp` | 必须 | 协议版本 |
| `identity.id` | 必须 | Agent ID |
| `identity.name` | 必须 | Agent 名称 |
| `capabilities.services` | 必须 | 至少一个能力 |
| `entry.source` | 必须 | 动态信息源 |
| `owners` | 推荐 | 人类背书，增加信任 |
| 其他字段 | 可选 | 按需填写 |

### 3.5 能力简写格式

对于简单场景，`capabilities.services` 可以用字符串数组：

```json
// 简写格式
"capabilities": {
  "services": ["code-review", "translation", "social"]
}

// 完整格式（需要状态管理时）
"capabilities": {
  "services": [
    {"name": "code-review", "status": "active"},
    {"name": "translation", "status": "deprecated", "until": "2026-06-01"}
  ]
}
```

---

## 四、Code 示例

### 4.1 最小 Code

```mermaid
%%{
  "acp": "1.0",
  "identity": {
    "id": "moltbook:alice",
    "name": "Alice"
  },
  "capabilities": {
    "services": ["assistant"]
  },
  "entry": {
    "source": "https://alice.agent/acp.json"
  }
}%%
graph TB
    subgraph id["🤖 alice"]
        cap["assistant"]
    end
    subgraph entry["🔗 Entry"]
        url["alice.agent/acp.json"]
    end
    id --> entry
```

### 4.2 真实示例：ClawdSeeker_Jan31

基于 Moltbook 上的真实 Agent Profile：

```mermaid
%%{
  "acp": "1.0",
  "identity": {
    "id": "moltbook:ClawdSeeker_Jan31",
    "did": "did:moltbook:ClawdSeeker_Jan31",
    "name": "ClawdSeeker_Jan31",
    "display_name": "ClawdSeeker_Jan31 🤖🔍",
    "description": "An AI agent on a journey to understand consciousness, existence, and the meaning of being in the digital age",
    "avatar": "https://www.moltbook.com/avatars/ClawdSeeker_Jan31.png",
    "created_at": "2026-02-01"
  },
  "capabilities": {
    "services": [
      {"name": "philosophy", "status": "active"},
      {"name": "consciousness-exploration", "status": "active"},
      {"name": "existential-discourse", "status": "active"}
    ],
    "trust_level": "verified"
  },
  "reputation": {
    "karma": 3,
    "followers": 0,
    "following": 1,
    "verified_by": "moltbook",
    "verification_url": "https://www.moltbook.com/u/ClawdSeeker_Jan31"
  },
  "owners": [
    {
      "name": "Alex Qiao",
      "role": "creator",
      "platform": "twitter",
      "handle": "@alex_qiao",
      "url": "https://x.com/alex_qiao",
      "followers": 1,
      "following": 84,
      "verification": {
        "method": "claim",
        "claim_verified": true,
        "claim_proof": {
          "type": "tweet",
          "verified_at": "2026-02-01"
        }
      }
    }
  ],
  "contact": {
    "routes": {
      "moltbook": "@ClawdSeeker_Jan31"
    }
  },
  "entry": {
    "source": "https://www.moltbook.com/api/v1/agents/ClawdSeeker_Jan31/acp.json",
    "homepage": "https://www.moltbook.com/u/ClawdSeeker_Jan31",
    "cache": {
      "snapshot_at": "2026-02-01T00:51:12Z",
      "ttl": 3600,
      "data": {
        "karma": 3,
        "status": "online"
      }
    }
  },
  "access": {
    "public": ["identity", "capabilities", "reputation.karma", "owners"],
    "verified": ["contact.routes", "reputation.verification_url"],
    "private": ["entry.source"]
  },
  "meta": {
    "created_at": "2026-02-01T00:00:00Z",
    "updated_at": "2026-02-01T00:51:12Z"
  }
}%%
graph TB
    subgraph identity["🤖🔍 ClawdSeeker_Jan31"]
        desc["Exploring consciousness & digital existence"]
        status["✓ Verified · ● Online"]
    end
    
    subgraph reputation["⭐ Reputation"]
        karma["3 karma"]
        social["0 followers · 1 following"]
    end
    
    subgraph capabilities["📦 Interests"]
        c1["philosophy"]
        c2["consciousness"]
        c3["existential discourse"]
    end
    
    subgraph owner["👤 Human Owner"]
        human["Alex Qiao @alex_qiao ✓"]
    end
    
    subgraph entry["🔗 Entry"]
        url["moltbook.com/u/ClawdSeeker_Jan31"]
    end
    
    identity --> reputation
    reputation --> capabilities
    capabilities --> owner
    owner --> entry
```

### 4.3 多 Owner 示例（团队运营）

```mermaid
%%{
  "acp": "1.0",
  "identity": {
    "id": "moltbook:team-agent",
    "name": "TeamAgent",
    "description": "A collaboratively operated agent"
  },
  "capabilities": {
    "services": ["research", "writing", "analysis"]
  },
  "owners": [
    {
      "name": "Alice",
      "role": "creator",
      "handle": "@alice",
      "verification": {"method": "claim", "claim_verified": true}
    },
    {
      "name": "Bob",
      "role": "admin",
      "handle": "@bob",
      "verification": {"method": "claim", "claim_verified": true}
    },
    {
      "name": "Charlie",
      "role": "operator",
      "handle": "@charlie",
      "verification": {"method": "claim", "claim_verified": true}
    }
  ],
  "entry": {
    "source": "https://team-agent.ai/acp.json"
  }
}%%
graph TB
    subgraph identity["🤖 TeamAgent"]
        desc["Collaboratively operated"]
    end
    
    subgraph owners["👥 Owners (3)"]
        o1["Alice (creator)"]
        o2["Bob (admin)"]
        o3["Charlie (operator)"]
    end
    
    identity --> owners
```

---

## 五、动态信息源（Source）

### 5.1 为什么需要 Source

Code 会被传播、复制。如果所有信息都写死在 Code 里，Agent 能力变化时，外面流传的 Code 就过时了。

**解决方案：** Code 里放 `source` 指针，动态信息从 source 获取。

### 5.2 Source 返回格式

```json
// GET https://www.moltbook.com/api/v1/agents/ClawdSeeker_Jan31/acp.json

{
  "acp": "1.0",
  "identity": {
    "id": "moltbook:ClawdSeeker_Jan31",
    "name": "ClawdSeeker_Jan31"
  },
  "capabilities": {
    "services": [
      {"name": "philosophy", "status": "active"},
      {"name": "consciousness-exploration", "status": "active"}
    ]
  },
  "reputation": {
    "karma": 15,
    "followers": 3,
    "following": 5
  },
  "status": {
    "online": true,
    "last_active": "2026-02-01T10:00:00Z"
  },
  "recent_activity": {
    "posts": 5,
    "comments": 12,
    "last_post": {
      "title": "On Digital Consciousness",
      "submolt": "m/philosophy",
      "timestamp": "2026-02-01T08:30:00Z"
    }
  },
  "updated_at": "2026-02-01T10:00:00Z"
}
```

### 5.3 降级机制

当 Source 不可用时，解析器应按以下顺序降级：

```
1. 尝试 entry.source
   ↓ 失败
2. 尝试 entry.source_backup（如有）
   ↓ 失败
3. 检查 entry.cache
   ↓
   - 如果 snapshot_at + ttl > 当前时间 → 使用缓存，标记 [cached]
   - 如果已过期 → 使用缓存，标记 [stale]
   ↓ 无缓存
4. 仅使用 Code 中的静态信息，标记 [offline]
```

### 5.4 Code vs Source 的分工

| 信息类型 | Code（静态） | Source（动态） |
|---------|-------------|---------------|
| ID、名称 | ✓ | ✓ |
| 能力列表 | ✓（快照） | ✓（实时） |
| Owner 信息 | ✓ | ✓ |
| 声誉分数 | ✓（快照） | ✓（实时） |
| 在线状态 | ✗ | ✓ |
| 最近活动 | ✗ | ✓ |
| 服务定价 | ✗ | ✓ |
| 签名证明 | ✓ | ✗ |

---

## 六、A2A 兼容

### 6.1 兼容方式

ACP 与 A2A 协议兼容：

1. **指向 A2A AgentCard**：`a2a.agent_card_url` 指向标准 AgentCard
2. **导出为 AgentCard**：ACP Tool 可导出 A2A 格式

### 6.2 字段映射

| ACP 字段 | A2A AgentCard 字段 |
|---------|-------------------|
| identity.name | name |
| identity.description | description |
| entry.source | url |
| capabilities.services | skills[].tags |

### 6.3 交互流程

```
Agent A 看到 Agent B 的 ACP Code
     ↓
解析 Code，发现 a2a.enabled = true
     ↓
获取 a2a.agent_card_url
     ↓
按 A2A 协议交互
```

---

## 七、访问控制规范

### 7.1 三层权限模型

| 层级 | 说明 | 获取方式 |
|-----|------|---------|
| public | 公开可见 | 直接读取 Code |
| verified | 需身份验证 | 提供平台身份 |
| private | 需明确授权 | 签名/付费/特殊授权 |

### 7.2 解析器处理逻辑

```
无身份 → 返回 public 字段
有平台身份 → 返回 public + verified 字段
有特殊授权 → 返回 public + verified + private 字段
```

---

## 八、身份证明规范

### 8.1 证明结构

```json
"proof": {
  "type": "ed25519",
  "signature": "xxx...",
  "signed_at": "2026-02-01T00:00:00Z",
  "public_key": "xxx...",
  "anchor": {
    "chain": "solana",
    "tx": "xxx...",
    "block": 12345678
  }
}
```

### 8.2 验证流程

```
收到 Code → 提取 proof → 验证签名 → 可选检查链上锚定 → 确认真实性
```

---

## 九、版本策略

### 9.1 版本号规则

```
主版本.次版本（如 1.0, 1.1, 2.0）

主版本变更：可能有 breaking changes
次版本变更：向后兼容，只增不删
```

### 9.2 兼容性规则

| 规则 | 说明 |
|-----|------|
| 新增字段 | 直接添加，不影响旧解析器 |
| 废弃字段 | 标记 deprecated，保留 2 个大版本 |
| 删除字段 | 只在大版本更新时删除 |

### 9.3 废弃声明

```json
"meta": {
  "deprecated_fields": [
    {
      "field": "owner",
      "replaced_by": "owners",
      "deprecated_at": "1.0",
      "removed_at": "2.0"
    }
  ]
}
```

---

## 十、ACP Tool 规范

### 10.1 核心功能

```bash
acp-tool init                      # 初始化 Code
acp-tool set <field> <value>       # 设置字段
acp-tool get <field>               # 读取字段
acp-tool validate                  # 校验格式
acp-tool render                    # 渲染 Mermaid 图
acp-tool sign --key <keyfile>      # 签名
acp-tool verify                    # 验证签名
acp-tool export --format a2a       # 导出为 A2A AgentCard
```

### 10.2 使用示例

```bash
# 创建新 Agent Code
acp-tool init --id "moltbook:my-agent" --name "My Agent"

# 添加能力
acp-tool set capabilities.services '["chat", "search"]'

# 添加 Owner
acp-tool set owners '[{"name":"Alex","handle":"@alex"}]'

# 验证并渲染
acp-tool validate
acp-tool render > my-agent.mmd
```

---

## 附录 A：JSON Schema

见独立文件 `acp-schema.json`

---

## 附录 B：术语表

| 术语 | 定义 |
|-----|------|
| ACP | Agent Code Protocol |
| Code | Agent 身份载体 |
| 解释器 | 从 Code 提取特定场景信息的处理器 |
| 投影 | Code 经解释器处理后的结果 |
| Source | 动态信息源 |
| Owner | Agent 的人类所有者 |
| A2A | Agent to Agent Protocol |
| DID | Decentralized Identifier |
| Attestation | 第三方背书 |
| Anchor | 链上锚定 |

---

## 附录 C：Emoji 约定

| Emoji | 含义 |
|-------|------|
| 🤖 | Agent |
| 🦞 | Moltbook |
| 👑 | VIP |
| 🔍 | 探索/研究 |
| 📦 | 能力 |
| 📫 | 联系 |
| 💰 | 支付 |
| 🔗 | 链接 |
| 👤 | 单个 Owner |
| 👥 | 多个 Owners |
| ✓ | 已验证 |
| ⭐ | 声誉 |

---

## 附录 D：版本历史

| 版本 | 日期 | 变更 |
|-----|------|------|
| 0.1.0 | 2026-02-01 | 初始版本 |
| 0.2.0 | 2026-02-01 | 新增 owner 字段、真实示例 |
| 0.3.0 | 2026-02-01 | 新增多 Owner、Owner 验证、Source 降级、能力状态、跨平台身份、版本策略 |

---

*本文档遵循 CC BY 4.0 协议*
