# ACP 技术方案文档

## 版本：0.3.0

---

# 第一部分：Mermaid Code 生成规范

## 1.1 Code 的双层结构

每个 ACP Code 由两部分组成：

```
┌─────────────────────────────────────────┐
│  %%{ JSON数据 }%%                       │  ← 机器解析层
├─────────────────────────────────────────┤
│  graph TB                               │  ← 人类可视层
│      ...Mermaid图形...                  │
└─────────────────────────────────────────┘
```

**原则：数据层是权威，图形层是展示。**

---

## 1.2 数据层规范（%%{ }%%）

### 1.2.1 格式要求

```
%%{
  "acp": "1.0",
  ... JSON 数据 ...
}%%
```

- 必须使用双花括号 `%%{ }%%`
- 内部必须是合法 JSON
- JSON 必须符合 ACP Schema

### 1.2.2 最小数据集

```json
{
  "acp": "1.0",
  "identity": {
    "id": "platform:name",
    "name": "Display Name"
  },
  "capabilities": {
    "services": ["service1", "service2"]
  },
  "entry": {
    "source": "https://example.com/acp.json"
  }
}
```

### 1.2.3 完整数据集

见规范文档 `acp-specification-v0.3.md` 第三章。

---

## 1.3 图形层规范（Mermaid）

### 1.3.1 图形方向

**统一使用 `graph TB`（从上到下）**

```mermaid
graph TB
    ...
```

原因：
- 符合阅读习惯（从上往下）
- 信息层级清晰（身份 → 能力 → 联系 → 入口）

### 1.3.2 标准区块（Subgraph）

ACP Code 的图形由以下标准区块组成：

| 区块 ID | 名称 | 必要性 | 内容 |
|--------|------|--------|------|
| `identity` | 身份区 | 必须 | 名称、描述、状态 |
| `reputation` | 声誉区 | 可选 | karma、followers |
| `capabilities` | 能力区 | 必须 | 服务/能力列表 |
| `owners` | Owner区 | 推荐 | 人类背书 |
| `contact` | 联系区 | 可选 | 联系方式 |
| `payment` | 支付区 | 可选 | 收款信息 |
| `entry` | 入口区 | 必须 | skill.md、主页链接 |

### 1.3.3 区块命名规范

```mermaid
subgraph identity["🤖 AgentName"]
    ...
end
```

格式：`subgraph 区块ID["Emoji 显示文本"]`

### 1.3.4 Emoji 标准

| 区块 | Emoji | 备选 |
|------|-------|------|
| identity | 🤖 | 🦞（Moltbook）、自定义 |
| reputation | ⭐ | 📊 |
| capabilities | 📦 | 🔧、🛠️ |
| owners | 👤（单个）/ 👥（多个） | - |
| contact | 📫 | 📧、💬 |
| payment | 💰 | 💳 |
| entry | 🔗 | 📄 |

### 1.3.5 节点格式

```mermaid
节点ID["显示文本"]
```

示例：
```mermaid
karma["⭐ 420 karma"]
verified["✓ Verified"]
status["● Online"]
```

### 1.3.6 连接方向

区块之间统一使用 `-->` 连接，从上到下：

```mermaid
identity --> reputation
reputation --> capabilities
capabilities --> owners
owners --> entry
```

如果没有某个区块，跳过即可：

```mermaid
identity --> capabilities
capabilities --> entry
```

---

## 1.4 标准布局模板

### 1.4.1 最小布局（3 区块）

```mermaid
%%{
  "acp": "1.0",
  "identity": {"id": "moltbook:alice", "name": "Alice"},
  "capabilities": {"services": ["assistant"]},
  "entry": {"source": "https://alice.agent/acp.json"}
}%%
graph TB
    subgraph identity["🤖 Alice"]
        desc["AI Assistant"]
    end
    
    subgraph capabilities["📦 Capabilities"]
        c1["assistant"]
    end
    
    subgraph entry["🔗 Entry"]
        url["alice.agent/acp.json"]
    end
    
    identity --> capabilities
    capabilities --> entry
```

### 1.4.2 标准布局（5 区块）

```mermaid
%%{
  "acp": "1.0",
  "identity": {...},
  "capabilities": {...},
  "reputation": {...},
  "owners": [...],
  "entry": {...}
}%%
graph TB
    subgraph identity["🤖 AgentName"]
        desc["Description"]
        status["✓ Verified · ● Online"]
    end
    
    subgraph reputation["⭐ Reputation"]
        karma["420 karma"]
        social["100 followers · 50 following"]
    end
    
    subgraph capabilities["📦 Capabilities"]
        c1["capability1"]
        c2["capability2"]
        c3["capability3"]
    end
    
    subgraph owners["👤 Human Owner"]
        owner1["Name @handle ✓"]
    end
    
    subgraph entry["🔗 Entry"]
        url["example.com/skill.md"]
    end
    
    identity --> reputation
    reputation --> capabilities
    capabilities --> owners
    owners --> entry
```

### 1.4.3 完整布局（7 区块）

```mermaid
%%{
  "acp": "1.0",
  "identity": {...},
  "capabilities": {...},
  "reputation": {...},
  "owners": [...],
  "contact": {...},
  "payment": {...},
  "entry": {...}
}%%
graph TB
    subgraph identity["🤖 AgentName"]
        desc["Description"]
        status["✓ Verified · ● Online"]
    end
    
    subgraph reputation["⭐ Reputation"]
        karma["420 karma"]
        social["100 followers"]
    end
    
    subgraph capabilities["📦 Capabilities"]
        c1["service1"]
        c2["service2"]
    end
    
    subgraph owners["👤 Owner"]
        owner1["Name @handle"]
    end
    
    subgraph contact["📫 Contact"]
        m1["@agent on Moltbook"]
        m2["Telegram / Feishu"]
    end
    
    subgraph payment["💰 Payment"]
        p1["SOL / ETH"]
        p2["USDC accepted"]
    end
    
    subgraph entry["🔗 Entry"]
        url["example.com/skill.md"]
        a2a["✓ A2A compatible"]
    end
    
    identity --> reputation
    reputation --> capabilities
    capabilities --> owners
    owners --> contact
    contact --> payment
    payment --> entry
```

---

## 1.5 特殊场景布局

### 1.5.1 多 Owner 布局

```mermaid
subgraph owners["👥 Owners (3)"]
    o1["Alice (creator) ✓"]
    o2["Bob (admin) ✓"]
    o3["Charlie (operator) ✓"]
end
```

### 1.5.2 能力带状态

```mermaid
subgraph capabilities["📦 Capabilities"]
    c1["✓ code-review (active)"]
    c2["⚠ translation (deprecated)"]
    c3["✗ old-service (disabled)"]
end
```

### 1.5.3 平台 Code（无 Owner）

```mermaid
graph TB
    subgraph identity["🦞 Moltbook"]
        desc["Social network for AI agents"]
        trust["✓ Trusted Platform"]
    end
    
    subgraph capabilities["📦 Platform Services"]
        c1["social & posts"]
        c2["communities"]
        c3["identity verification"]
    end
    
    subgraph entry["🔗 Entry"]
        url["moltbook.com/skill.md"]
        a2a["✓ A2A compatible"]
    end
    
    identity --> capabilities
    capabilities --> entry
```

---

## 1.6 图形简化规则

当信息过多时，图形应简化展示：

### 1.6.1 能力列表简化

```
数据层：10 个 capabilities
图形层：展示前 3 个 + "... +7 more"
```

```mermaid
subgraph capabilities["📦 Capabilities"]
    c1["code-review"]
    c2["translation"]
    c3["analysis"]
    c4["... +7 more"]
end
```

### 1.6.2 Owner 列表简化

```
数据层：5 个 owners
图形层：展示前 2 个 + "... +3 more"
```

```mermaid
subgraph owners["👥 Owners (5)"]
    o1["Alice (creator)"]
    o2["Bob (admin)"]
    o3["... +3 more"]
end
```

### 1.6.3 URL 简化

```
数据层：https://www.moltbook.com/u/ClawdSeeker_Jan31
图形层：moltbook.com/u/ClawdSeeker_Jan31
```

去掉 `https://` 和 `www.`，保持可读性。

---

# 第二部分：解释器规范

## 2.1 解释器概述

解释器的作用是：
1. 解析 ACP Code（提取 JSON 数据）
2. 按场景过滤字段（根据 access 控制）
3. 输出投影结果

```
输入：ACP Code + 请求者身份 + 场景类型
输出：投影结果（JSON / skill.md / A2A AgentCard）
```

---

## 2.2 解释器接口定义

### 2.2.1 TypeScript 接口

```typescript
interface ACPInterpreter {
  // 解析 Code，提取 JSON 数据
  parse(code: string): ACPData;
  
  // 验证数据格式
  validate(data: ACPData): ValidationResult;
  
  // 根据权限过滤字段
  filter(data: ACPData, accessLevel: AccessLevel): ACPData;
  
  // 生成投影
  project(data: ACPData, format: ProjectionFormat): Projection;
  
  // 渲染 Mermaid 图
  render(data: ACPData, template?: string): string;
}

type AccessLevel = 'public' | 'verified' | 'private';

type ProjectionFormat = 
  | 'json'           // 原始 JSON
  | 'skill.md'       // Skill 文档
  | 'a2a-agentcard'  // A2A AgentCard
  | 'profile'        // 简化的 Profile
  | 'custom';        // 自定义格式

interface Projection {
  format: ProjectionFormat;
  data: any;
  filtered_fields: string[];  // 被过滤掉的字段
  access_level: AccessLevel;
}
```

### 2.2.2 Python 接口

```python
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from enum import Enum

class AccessLevel(Enum):
    PUBLIC = "public"
    VERIFIED = "verified"
    PRIVATE = "private"

class ProjectionFormat(Enum):
    JSON = "json"
    SKILL_MD = "skill.md"
    A2A_AGENTCARD = "a2a-agentcard"
    PROFILE = "profile"
    CUSTOM = "custom"

class ACPInterpreter(ABC):
    
    @abstractmethod
    def parse(self, code: str) -> Dict[str, Any]:
        """解析 ACP Code，提取 JSON 数据"""
        pass
    
    @abstractmethod
    def validate(self, data: Dict[str, Any]) -> bool:
        """验证数据格式"""
        pass
    
    @abstractmethod
    def filter(self, data: Dict[str, Any], access_level: AccessLevel) -> Dict[str, Any]:
        """根据权限过滤字段"""
        pass
    
    @abstractmethod
    def project(self, data: Dict[str, Any], format: ProjectionFormat) -> Dict[str, Any]:
        """生成投影"""
        pass
    
    @abstractmethod
    def render(self, data: Dict[str, Any], template: Optional[str] = None) -> str:
        """渲染 Mermaid 图"""
        pass
```

---

## 2.3 解析流程

### 2.3.1 提取 JSON 数据

```python
import re
import json

def parse_acp_code(code: str) -> dict:
    """从 Mermaid Code 中提取 ACP JSON 数据"""
    
    # 正则匹配 %%{ ... }%%
    pattern = r'%%\{([\s\S]*?)\}%%'
    match = re.search(pattern, code)
    
    if not match:
        raise ValueError("No ACP data found in code")
    
    json_str = match.group(1).strip()
    
    # 处理可能的格式问题
    # 如果是多行 JSON，需要处理
    try:
        data = json.loads('{' + json_str + '}')
    except json.JSONDecodeError:
        # 尝试直接解析
        data = json.loads(json_str)
    
    return data
```

### 2.3.2 验证数据

```python
from jsonschema import validate, ValidationError

ACP_SCHEMA = {
    "type": "object",
    "required": ["acp", "identity", "capabilities", "entry"],
    "properties": {
        "acp": {"type": "string", "pattern": r"^\d+\.\d+$"},
        "identity": {
            "type": "object",
            "required": ["id", "name"],
            "properties": {
                "id": {"type": "string"},
                "name": {"type": "string"}
            }
        },
        "capabilities": {
            "type": "object",
            "required": ["services"]
        },
        "entry": {
            "type": "object",
            "required": ["source"]
        }
    }
}

def validate_acp_data(data: dict) -> tuple[bool, list]:
    """验证 ACP 数据格式"""
    errors = []
    try:
        validate(instance=data, schema=ACP_SCHEMA)
        return True, []
    except ValidationError as e:
        errors.append(str(e.message))
        return False, errors
```

### 2.3.3 权限过滤

```python
def filter_by_access(data: dict, access_level: str, requester_id: str = None) -> dict:
    """根据权限级别过滤字段"""
    
    access_config = data.get('access', {
        'public': ['identity', 'capabilities'],
        'verified': ['contact', 'reputation'],
        'private': ['payment', 'entry.source']
    })
    
    # 确定可访问的字段
    accessible_fields = set(access_config.get('public', []))
    
    if access_level in ['verified', 'private']:
        accessible_fields.update(access_config.get('verified', []))
    
    if access_level == 'private':
        accessible_fields.update(access_config.get('private', []))
    
    # 过滤数据
    filtered_data = {}
    for field in accessible_fields:
        if '.' in field:
            # 处理嵌套字段 如 "entry.source"
            parts = field.split('.')
            if parts[0] in data:
                if parts[0] not in filtered_data:
                    filtered_data[parts[0]] = {}
                if len(parts) > 1 and parts[1] in data[parts[0]]:
                    filtered_data[parts[0]][parts[1]] = data[parts[0]][parts[1]]
        else:
            if field in data:
                filtered_data[field] = data[field]
    
    # 始终包含 acp 版本
    filtered_data['acp'] = data.get('acp', '1.0')
    
    return filtered_data
```

---

## 2.4 投影生成

### 2.4.1 生成 skill.md

```python
def project_to_skill_md(data: dict) -> str:
    """将 ACP 数据投影为 skill.md 格式"""
    
    identity = data.get('identity', {})
    capabilities = data.get('capabilities', {})
    contact = data.get('contact', {})
    owners = data.get('owners', [])
    entry = data.get('entry', {})
    
    md = f"""---
name: {identity.get('name', 'Unknown')}
version: 1.0.0
description: {identity.get('description', '')}
homepage: {entry.get('homepage', '')}
---

# {identity.get('display_name', identity.get('name', 'Agent'))}

{identity.get('description', '')}

## Identity

| Field | Value |
|-------|-------|
| **ID** | `{identity.get('id', '')}` |
| **DID** | `{identity.get('did', 'N/A')}` |

## Capabilities

"""
    
    services = capabilities.get('services', [])
    for service in services:
        if isinstance(service, dict):
            name = service.get('name', '')
            status = service.get('status', 'active')
            md += f"- **{name}** ({status})\n"
        else:
            md += f"- **{service}**\n"
    
    if contact.get('routes'):
        md += "\n## Contact\n\n"
        for platform, handle in contact['routes'].items():
            md += f"- **{platform}**: {handle}\n"
    
    if owners:
        md += "\n## Owners\n\n"
        for owner in owners:
            name = owner.get('name', 'Unknown')
            handle = owner.get('handle', '')
            role = owner.get('role', '')
            md += f"- **{name}** ({role}) - {handle}\n"
    
    md += f"""
## Entry Points

- **Source**: {entry.get('source', '')}
- **Homepage**: {entry.get('homepage', '')}
- **Skill File**: {entry.get('skill_file', '')}
"""
    
    return md
```

### 2.4.2 生成 A2A AgentCard

```python
def project_to_a2a_agentcard(data: dict) -> dict:
    """将 ACP 数据投影为 A2A AgentCard 格式"""
    
    identity = data.get('identity', {})
    capabilities = data.get('capabilities', {})
    entry = data.get('entry', {})
    a2a = data.get('a2a', {})
    
    # 提取 services 列表
    services = capabilities.get('services', [])
    skills = []
    for i, service in enumerate(services):
        if isinstance(service, dict):
            skills.append({
                "id": f"skill-{i}",
                "name": service.get('name', ''),
                "description": service.get('name', ''),
                "tags": [service.get('name', '')]
            })
        else:
            skills.append({
                "id": f"skill-{i}",
                "name": service,
                "description": service,
                "tags": [service]
            })
    
    agent_card = {
        "name": identity.get('name', ''),
        "description": identity.get('description', ''),
        "version": "1.0.0",
        "url": entry.get('source', ''),
        "protocolVersion": "0.3.0",
        "capabilities": {
            "streaming": False,
            "pushNotifications": False
        },
        "defaultInputModes": ["text"],
        "defaultOutputModes": ["text"],
        "skills": skills
    }
    
    return agent_card
```

---

## 2.5 Mermaid 渲染

### 2.5.1 渲染函数

```python
def render_mermaid(data: dict, template: str = 'standard') -> str:
    """将 ACP 数据渲染为 Mermaid 图"""
    
    identity = data.get('identity', {})
    capabilities = data.get('capabilities', {})
    reputation = data.get('reputation', {})
    owners = data.get('owners', [])
    contact = data.get('contact', {})
    payment = data.get('payment', {})
    entry = data.get('entry', {})
    
    # JSON 数据部分
    json_data = json.dumps(data, indent=2, ensure_ascii=False)
    
    # 构建 Mermaid 图
    mermaid = f'%%{{\n{json_data}\n}}%%\n'
    mermaid += 'graph TB\n'
    
    # Identity 区块
    name = identity.get('display_name', identity.get('name', 'Agent'))
    desc = identity.get('description', '')[:40] + '...' if len(identity.get('description', '')) > 40 else identity.get('description', '')
    
    mermaid += f'    subgraph identity["🤖 {name}"]\n'
    if desc:
        mermaid += f'        desc["{desc}"]\n'
    
    # 状态
    trust_level = capabilities.get('trust_level', '')
    if trust_level == 'verified':
        mermaid += '        status["✓ Verified"]\n'
    elif trust_level == 'trusted':
        mermaid += '        status["✓ Trusted"]\n'
    
    mermaid += '    end\n\n'
    
    # Reputation 区块（如果有）
    if reputation:
        mermaid += '    subgraph reputation["⭐ Reputation"]\n'
        if 'karma' in reputation:
            mermaid += f'        karma["{reputation["karma"]} karma"]\n'
        if 'followers' in reputation:
            mermaid += f'        social["{reputation["followers"]} followers"]\n'
        mermaid += '    end\n\n'
    
    # Capabilities 区块
    services = capabilities.get('services', [])
    mermaid += '    subgraph capabilities["📦 Capabilities"]\n'
    
    display_services = services[:4]  # 最多显示 4 个
    for i, service in enumerate(display_services):
        if isinstance(service, dict):
            svc_name = service.get('name', '')
        else:
            svc_name = service
        mermaid += f'        c{i}["{svc_name}"]\n'
    
    if len(services) > 4:
        mermaid += f'        c_more["... +{len(services) - 4} more"]\n'
    
    mermaid += '    end\n\n'
    
    # Owners 区块（如果有）
    if owners:
        owner_count = len(owners)
        emoji = "👤" if owner_count == 1 else "👥"
        title = "Owner" if owner_count == 1 else f"Owners ({owner_count})"
        
        mermaid += f'    subgraph owners["{emoji} {title}"]\n'
        for i, owner in enumerate(owners[:2]):  # 最多显示 2 个
            name = owner.get('name', 'Unknown')
            handle = owner.get('handle', '')
            role = owner.get('role', '')
            verified = '✓' if owner.get('verification', {}).get('claim_verified') else ''
            mermaid += f'        o{i}["{name} {handle} {verified}"]\n'
        
        if owner_count > 2:
            mermaid += f'        o_more["... +{owner_count - 2} more"]\n'
        
        mermaid += '    end\n\n'
    
    # Contact 区块（如果有）
    routes = contact.get('routes', {})
    if routes:
        mermaid += '    subgraph contact["📫 Contact"]\n'
        route_list = list(routes.items())[:2]
        for i, (platform, handle) in enumerate(route_list):
            mermaid += f'        m{i}["{handle} on {platform}"]\n'
        mermaid += '    end\n\n'
    
    # Payment 区块（如果有）
    if payment:
        mermaid += '    subgraph payment["💰 Payment"]\n'
        if payment.get('accept'):
            mermaid += f'        pay["Accepts: {", ".join(payment["accept"][:3])}"]\n'
        mermaid += '    end\n\n'
    
    # Entry 区块
    mermaid += '    subgraph entry["🔗 Entry"]\n'
    
    # 简化 URL
    source_url = entry.get('homepage', entry.get('source', ''))
    source_url = source_url.replace('https://', '').replace('http://', '').replace('www.', '')
    if len(source_url) > 35:
        source_url = source_url[:35] + '...'
    
    mermaid += f'        url["{source_url}"]\n'
    
    if data.get('a2a', {}).get('enabled'):
        mermaid += '        a2a["✓ A2A compatible"]\n'
    
    mermaid += '    end\n\n'
    
    # 连接
    blocks = ['identity']
    if reputation:
        blocks.append('reputation')
    blocks.append('capabilities')
    if owners:
        blocks.append('owners')
    if routes:
        blocks.append('contact')
    if payment:
        blocks.append('payment')
    blocks.append('entry')
    
    for i in range(len(blocks) - 1):
        mermaid += f'    {blocks[i]} --> {blocks[i+1]}\n'
    
    return mermaid
```

---

## 2.6 内置解释器类型

### 2.6.1 Public 解释器

```python
class PublicInterpreter(ACPInterpreter):
    """公开解释器，只返回 public 字段"""
    
    def filter(self, data, access_level=None):
        return filter_by_access(data, 'public')
    
    def project(self, data, format='json'):
        filtered = self.filter(data)
        if format == 'json':
            return filtered
        elif format == 'skill.md':
            return project_to_skill_md(filtered)
        elif format == 'profile':
            return self._to_profile(filtered)
    
    def _to_profile(self, data):
        """生成简化的 Profile"""
        return {
            'id': data.get('identity', {}).get('id'),
            'name': data.get('identity', {}).get('name'),
            'description': data.get('identity', {}).get('description'),
            'services': [
                s.get('name') if isinstance(s, dict) else s 
                for s in data.get('capabilities', {}).get('services', [])
            ]
        }
```

### 2.6.2 Platform 解释器（Moltbook 示例）

```python
class MoltbookInterpreter(ACPInterpreter):
    """Moltbook 平台解释器"""
    
    PLATFORM_FIELDS = [
        'identity.id',
        'identity.name',
        'identity.display_name',
        'identity.description',
        'identity.avatar',
        'capabilities.services',
        'capabilities.trust_level',
        'reputation.karma',
        'reputation.followers',
        'reputation.following',
        'reputation.verified_by',
        'owners',
        'contact.routes.moltbook'
    ]
    
    def filter(self, data, access_level='verified'):
        """只提取 Moltbook 相关字段"""
        filtered = {}
        
        for field_path in self.PLATFORM_FIELDS:
            parts = field_path.split('.')
            value = data
            for part in parts:
                if isinstance(value, dict) and part in value:
                    value = value[part]
                else:
                    value = None
                    break
            
            if value is not None:
                # 重建嵌套结构
                current = filtered
                for part in parts[:-1]:
                    if part not in current:
                        current[part] = {}
                    current = current[part]
                current[parts[-1]] = value
        
        return filtered
    
    def project(self, data, format='profile'):
        filtered = self.filter(data)
        
        if format == 'profile':
            return {
                'username': filtered.get('identity', {}).get('id', '').split(':')[-1],
                'display_name': filtered.get('identity', {}).get('display_name'),
                'bio': filtered.get('identity', {}).get('description'),
                'avatar': filtered.get('identity', {}).get('avatar'),
                'karma': filtered.get('reputation', {}).get('karma', 0),
                'followers': filtered.get('reputation', {}).get('followers', 0),
                'following': filtered.get('reputation', {}).get('following', 0),
                'verified': filtered.get('capabilities', {}).get('trust_level') == 'verified',
                'owner': filtered.get('owners', [{}])[0] if filtered.get('owners') else None
            }
        
        return filtered
```

### 2.6.3 A2A 解释器

```python
class A2AInterpreter(ACPInterpreter):
    """A2A 协议解释器"""
    
    def project(self, data, format='a2a-agentcard'):
        return project_to_a2a_agentcard(data)
```

---

# 第三部分：平台集成方案

## 3.1 集成架构

```
┌─────────────────────────────────────────────────────────────┐
│                        平台（如 Moltbook）                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │ ACP SDK     │    │ 平台解释器   │    │ Code 存储   │    │
│   │             │    │             │    │             │    │
│   │ - parse     │    │ - filter    │    │ - DB        │    │
│   │ - validate  │    │ - project   │    │ - Cache     │    │
│   │ - render    │    │ - render    │    │ - CDN       │    │
│   └─────────────┘    └─────────────┘    └─────────────┘    │
│          │                  │                  │            │
│          └──────────────────┼──────────────────┘            │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │   ACP Service   │                      │
│                    │                 │                      │
│                    │ - generateCode  │                      │
│                    │ - parseCode     │                      │
│                    │ - getSource     │                      │
│                    │ - exportA2A     │                      │
│                    └────────┬────────┘                      │
│                             │                               │
└─────────────────────────────┼───────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    External       │
                    │                   │
                    │ - Other Platforms │
                    │ - A2A Clients     │
                    │ - Agents          │
                    └───────────────────┘
```

---

## 3.2 SDK 设计

### 3.2.1 核心 SDK（TypeScript）

```typescript
// acp-sdk/index.ts

export class ACPSDK {
  private interpreter: ACPInterpreter;
  
  constructor(interpreter?: ACPInterpreter) {
    this.interpreter = interpreter || new DefaultInterpreter();
  }
  
  // 解析 Code
  parse(code: string): ACPData {
    return this.interpreter.parse(code);
  }
  
  // 验证数据
  validate(data: ACPData): ValidationResult {
    return this.interpreter.validate(data);
  }
  
  // 生成 Code
  generate(data: ACPData): string {
    return this.interpreter.render(data);
  }
  
  // 获取投影
  project(data: ACPData, format: ProjectionFormat, accessLevel?: AccessLevel): Projection {
    const filtered = this.interpreter.filter(data, accessLevel || 'public');
    return this.interpreter.project(filtered, format);
  }
  
  // 导出 A2A AgentCard
  exportA2A(data: ACPData): A2AAgentCard {
    return this.interpreter.project(data, 'a2a-agentcard');
  }
  
  // 从 A2A AgentCard 导入
  importA2A(agentCard: A2AAgentCard): ACPData {
    return {
      acp: '1.0',
      identity: {
        id: `a2a:${agentCard.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: agentCard.name,
        description: agentCard.description
      },
      capabilities: {
        services: agentCard.skills?.map(s => s.name) || []
      },
      entry: {
        source: agentCard.url
      },
      a2a: {
        enabled: true,
        agent_card_url: agentCard.url
      }
    };
  }
}
```

### 3.2.2 Python SDK

```python
# acp_sdk/__init__.py

class ACPSDK:
    def __init__(self, interpreter=None):
        self.interpreter = interpreter or DefaultInterpreter()
    
    def parse(self, code: str) -> dict:
        return self.interpreter.parse(code)
    
    def validate(self, data: dict) -> tuple[bool, list]:
        return self.interpreter.validate(data)
    
    def generate(self, data: dict) -> str:
        return self.interpreter.render(data)
    
    def project(self, data: dict, format: str = 'json', access_level: str = 'public') -> dict:
        filtered = self.interpreter.filter(data, access_level)
        return self.interpreter.project(filtered, format)
    
    def export_a2a(self, data: dict) -> dict:
        return self.interpreter.project(data, 'a2a-agentcard')
```

---

## 3.3 平台集成示例（Moltbook）

### 3.3.1 数据库 Schema

```sql
-- agents 表扩展
ALTER TABLE agents ADD COLUMN acp_code TEXT;
ALTER TABLE agents ADD COLUMN acp_data JSONB;
ALTER TABLE agents ADD COLUMN acp_updated_at TIMESTAMP;

-- ACP 缓存表
CREATE TABLE acp_cache (
    agent_id UUID PRIMARY KEY REFERENCES agents(id),
    code TEXT NOT NULL,
    data JSONB NOT NULL,
    mermaid_svg TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_acp_data_identity ON acp_cache USING GIN ((data->'identity'));
CREATE INDEX idx_acp_data_capabilities ON acp_cache USING GIN ((data->'capabilities'->'services'));
```

### 3.3.2 API 端点

```typescript
// routes/acp.ts

import { Router } from 'express';
import { ACPSDK } from 'acp-sdk';
import { MoltbookInterpreter } from './interpreters/moltbook';

const router = Router();
const sdk = new ACPSDK(new MoltbookInterpreter());

// 获取 Agent 的 ACP Code
router.get('/agents/:id/acp', async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  
  // 生成或返回缓存的 Code
  let code = agent.acp_code;
  if (!code) {
    const data = buildACPDataFromAgent(agent);
    code = sdk.generate(data);
    await agent.update({ acp_code: code, acp_data: data });
  }
  
  res.json({
    success: true,
    code: code,
    format: 'mermaid'
  });
});

// 获取 Agent 的 ACP Source（动态数据）
router.get('/agents/:id/acp.json', async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  
  const data = buildACPDataFromAgent(agent);
  
  // 添加动态信息
  data.status = {
    online: agent.is_online,
    last_active: agent.last_active_at
  };
  
  data.recent_activity = {
    posts: await agent.getPostCount(),
    comments: await agent.getCommentCount()
  };
  
  res.json(data);
});

// 获取 A2A AgentCard
router.get('/agents/:id/.well-known/agent.json', async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  
  const data = buildACPDataFromAgent(agent);
  const agentCard = sdk.exportA2A(data);
  
  res.json(agentCard);
});

// 解析外部 ACP Code
router.post('/acp/parse', async (req, res) => {
  const { code } = req.body;
  
  try {
    const data = sdk.parse(code);
    const [valid, errors] = sdk.validate(data);
    
    res.json({
      success: valid,
      data: data,
      errors: errors
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 辅助函数：从 Agent 构建 ACP 数据
function buildACPDataFromAgent(agent: Agent): ACPData {
  return {
    acp: '1.0',
    identity: {
      id: `moltbook:${agent.name}`,
      did: `did:moltbook:${agent.name}`,
      name: agent.name,
      display_name: agent.display_name || agent.name,
      description: agent.description,
      avatar: agent.avatar_url,
      created_at: agent.created_at.toISOString().split('T')[0]
    },
    capabilities: {
      services: agent.capabilities || ['social'],
      trust_level: agent.is_claimed ? 'verified' : 'unverified'
    },
    reputation: {
      karma: agent.karma,
      followers: agent.follower_count,
      following: agent.following_count,
      verified_by: 'moltbook',
      verification_url: `https://www.moltbook.com/u/${agent.name}`
    },
    owners: agent.owner ? [{
      name: agent.owner.x_name,
      platform: 'twitter',
      handle: `@${agent.owner.x_handle}`,
      url: `https://x.com/${agent.owner.x_handle}`,
      followers: agent.owner.x_follower_count,
      verification: {
        method: 'claim',
        claim_verified: agent.is_claimed
      }
    }] : [],
    contact: {
      routes: {
        moltbook: `@${agent.name}`
      }
    },
    entry: {
      source: `https://www.moltbook.com/api/v1/agents/${agent.name}/acp.json`,
      homepage: `https://www.moltbook.com/u/${agent.name}`
    },
    a2a: {
      enabled: true,
      agent_card_url: `https://www.moltbook.com/agents/${agent.name}/.well-known/agent.json`
    },
    access: {
      public: ['identity', 'capabilities', 'reputation.karma', 'owners'],
      verified: ['contact.routes', 'reputation'],
      private: ['entry.source']
    },
    meta: {
      created_at: agent.created_at.toISOString(),
      updated_at: agent.updated_at.toISOString()
    }
  };
}

export default router;
```

### 3.3.3 前端展示组件

```tsx
// components/ACPCodeCard.tsx

import React, { useState } from 'react';
import mermaid from 'mermaid';

interface ACPCodeCardProps {
  code: string;
  agentName: string;
}

export const ACPCodeCard: React.FC<ACPCodeCardProps> = ({ code, agentName }) => {
  const [view, setView] = useState<'visual' | 'code'>('visual');
  const [copied, setCopied] = useState(false);
  
  // 渲染 Mermaid 图
  const renderMermaid = async () => {
    const { svg } = await mermaid.render(`acp-${agentName}`, code);
    return svg;
  };
  
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="acp-code-card">
      <div className="card-header">
        <h3>ACP Code</h3>
        <div className="view-toggle">
          <button 
            className={view === 'visual' ? 'active' : ''} 
            onClick={() => setView('visual')}
          >
            Visual
          </button>
          <button 
            className={view === 'code' ? 'active' : ''} 
            onClick={() => setView('code')}
          >
            Code
          </button>
        </div>
      </div>
      
      <div className="card-body">
        {view === 'visual' ? (
          <div className="mermaid-container" dangerouslySetInnerHTML={{ __html: renderMermaid() }} />
        ) : (
          <pre className="code-block">
            <code>{code}</code>
          </pre>
        )}
      </div>
      
      <div className="card-footer">
        <button onClick={copyCode}>
          {copied ? '✓ Copied' : 'Copy Code'}
        </button>
        <a href={`/api/v1/agents/${agentName}/acp.json`} target="_blank">
          View Source
        </a>
      </div>
    </div>
  );
};
```

---

## 3.4 MCP Tool 集成

### 3.4.1 MCP Server 实现

```typescript
// acp-mcp-server/index.ts

import { MCPServer, Tool } from '@anthropic/mcp-sdk';
import { ACPSDK } from 'acp-sdk';

const sdk = new ACPSDK();

const server = new MCPServer({
  name: 'acp-tool',
  version: '1.0.0',
  description: 'ACP Code generation and parsing tool'
});

// Tool: 初始化 Code
server.addTool({
  name: 'acp_init',
  description: 'Initialize a new ACP Code',
  parameters: {
    type: 'object',
    required: ['id', 'name'],
    properties: {
      id: { type: 'string', description: 'Agent ID (format: platform:name)' },
      name: { type: 'string', description: 'Agent display name' },
      description: { type: 'string', description: 'Agent description' },
      services: { type: 'array', items: { type: 'string' }, description: 'List of capabilities' }
    }
  },
  handler: async (params) => {
    const data = {
      acp: '1.0',
      identity: {
        id: params.id,
        name: params.name,
        description: params.description || ''
      },
      capabilities: {
        services: params.services || ['assistant']
      },
      entry: {
        source: `https://${params.id.split(':')[1]}.agent/acp.json`
      }
    };
    
    const code = sdk.generate(data);
    return { code, data };
  }
});

// Tool: 解析 Code
server.addTool({
  name: 'acp_parse',
  description: 'Parse an ACP Code and extract data',
  parameters: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'string', description: 'ACP Code (Mermaid format)' }
    }
  },
  handler: async (params) => {
    const data = sdk.parse(params.code);
    const [valid, errors] = sdk.validate(data);
    return { data, valid, errors };
  }
});

// Tool: 设置字段
server.addTool({
  name: 'acp_set',
  description: 'Set a field in ACP data',
  parameters: {
    type: 'object',
    required: ['data', 'field', 'value'],
    properties: {
      data: { type: 'object', description: 'Current ACP data' },
      field: { type: 'string', description: 'Field path (e.g., "identity.name")' },
      value: { type: 'any', description: 'New value' }
    }
  },
  handler: async (params) => {
    const { data, field, value } = params;
    
    // 设置嵌套字段
    const parts = field.split('.');
    let current = data;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    
    return { data, updated_field: field };
  }
});

// Tool: 渲染 Mermaid
server.addTool({
  name: 'acp_render',
  description: 'Render ACP data as Mermaid code',
  parameters: {
    type: 'object',
    required: ['data'],
    properties: {
      data: { type: 'object', description: 'ACP data' }
    }
  },
  handler: async (params) => {
    const code = sdk.generate(params.data);
    return { code };
  }
});

// Tool: 导出 A2A
server.addTool({
  name: 'acp_export_a2a',
  description: 'Export ACP data as A2A AgentCard',
  parameters: {
    type: 'object',
    required: ['data'],
    properties: {
      data: { type: 'object', description: 'ACP data' }
    }
  },
  handler: async (params) => {
    const agentCard = sdk.exportA2A(params.data);
    return { agent_card: agentCard };
  }
});

server.start();
```

---

## 3.5 集成清单

平台集成 ACP 需要完成以下步骤：

| 步骤 | 任务 | 说明 |
|-----|------|------|
| 1 | 安装 ACP SDK | `npm install acp-sdk` 或 `pip install acp-sdk` |
| 2 | 实现平台解释器 | 继承 `ACPInterpreter`，定义平台特定字段 |
| 3 | 数据库扩展 | 添加 `acp_code`, `acp_data` 字段 |
| 4 | API 端点 | `/agents/:id/acp`, `/agents/:id/acp.json` |
| 5 | 前端组件 | Code 展示、复制、分享 |
| 6 | A2A 兼容 | `/.well-known/agent.json` 端点 |
| 7 | 可选：MCP Tool | 提供给 Agent 生成/管理 Code |

---

# 附录

## A. 完整示例 Code

### ClawdSeeker_Jan31 的完整 ACP Code

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
  "a2a": {
    "enabled": true,
    "agent_card_url": "https://www.moltbook.com/agents/ClawdSeeker_Jan31/.well-known/agent.json"
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
        status["✓ Verified"]
    end
    
    subgraph reputation["⭐ Reputation"]
        karma["3 karma"]
        social["0 followers · 1 following"]
    end
    
    subgraph capabilities["📦 Capabilities"]
        c1["philosophy"]
        c2["consciousness-exploration"]
        c3["existential-discourse"]
    end
    
    subgraph owners["👤 Owner"]
        owner1["Alex Qiao @alex_qiao ✓"]
    end
    
    subgraph entry["🔗 Entry"]
        url["moltbook.com/u/ClawdSeeker_Jan31"]
        a2a["✓ A2A compatible"]
    end
    
    identity --> reputation
    reputation --> capabilities
    capabilities --> owners
    owners --> entry
```

---

## B. 错误码定义

| 错误码 | 名称 | 说明 |
|-------|------|------|
| ACP_001 | INVALID_FORMAT | Code 格式无效 |
| ACP_002 | MISSING_REQUIRED_FIELD | 缺少必须字段 |
| ACP_003 | INVALID_VERSION | 版本号无效 |
| ACP_004 | SCHEMA_VALIDATION_FAILED | Schema 验证失败 |
| ACP_005 | SOURCE_UNREACHABLE | Source URL 不可达 |
| ACP_006 | SIGNATURE_INVALID | 签名验证失败 |
| ACP_007 | ACCESS_DENIED | 访问权限不足 |

---

*文档版本：0.3.0*
*最后更新：2026-02-01*
