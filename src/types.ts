/**
 * ACP SDK Types
 * Agent Code Protocol v0.4 类型定义
 */

// ==================== 访问控制 ====================

export type AccessLevel = 'public' | 'verified' | 'private';

// ==================== Core 类型 ====================

export interface Core {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  capabilities: (string | Capability)[];
  owner: Owner;
  sig: string;
}

export interface Capability {
  name: string;
  status?: 'active' | 'deprecated' | 'disabled';
  since?: string;
  until?: string | null;
}

export interface Owner {
  name: string;
  url: string;
  verified_by?: string;
  proof?: OwnerProof;
}

export interface OwnerProof {
  type: 'bidirectional_link';
  verify_at: string;
}

// ==================== 模块类型 ====================

export interface ModuleSocial {
  _access?: AccessLevel;
  karma?: number;
  followers?: number;
  following?: number;
  tags?: string[];
  verified_by?: string;
}

export interface ModuleFinance {
  _access?: AccessLevel;
  chains?: string[];
  addresses?: Record<string, string>;
  primary?: string;
  accept?: string[];
}

export interface ModuleContact {
  _access?: AccessLevel;
  routes?: ContactRoute[];
}

export interface ContactRoute {
  type: string;
  handle?: string;
  address?: string;
  url?: string;
}

export interface ModuleEntry {
  _access?: AccessLevel;
  source: string;
  source_backup?: string;
  homepage?: string;
  skill_file?: string;
}

export interface ModuleA2A {
  _access?: AccessLevel;
  enabled?: boolean;
  agent_card_url?: string;
}

// ==================== ACP Code ====================

export interface ACPCode {
  acp: string;
  core: Core;
  'module:social'?: ModuleSocial;
  'module:finance'?: ModuleFinance;
  'module:contact'?: ModuleContact;
  'module:entry'?: ModuleEntry;
  'module:a2a'?: ModuleA2A;
  [key: `module:${string}`]: any;
}

// ==================== 结果类型 ====================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface OwnerVerificationResult {
  verified: boolean;
  method?: 'bidirectional_link' | 'platform';
  error?: string;
}

// ==================== A2A 兼容类型 ====================

export interface A2AAgentCard {
  name: string;
  description?: string;
  version: string;
  url: string;
  protocolVersion: string;
  capabilities: {
    streaming: boolean;
    pushNotifications: boolean;
  };
  defaultInputModes: string[];
  defaultOutputModes: string[];
  skills: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
  }>;
}

// ==================== 生成器类型 ====================

export interface GeneratorConfig {
  platform: string;
  requiredModules: string[];
  optionalModules: string[];
  defaultAccess: Record<string, AccessLevel>;
}

export interface AgentData {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  capabilities: string[];
  ownerName: string;
  ownerUrl: string;
  platform?: string;
  karma?: number;
  followers?: number;
  following?: number;
  tags?: string[];
  paymentChains?: string[];
  paymentAddresses?: Record<string, string>;
  contactRoutes?: ContactRoute[];
  homepage?: string;
  source?: string;
  a2aEnabled?: boolean;
  a2aUrl?: string;
}

// ==================== 卡片类型 ====================

export interface ThemeColors {
  bg: string;
  bgAlt: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  text: string;
  textMuted: string;
  accent: string;
  success: string;
  border: string;
}

export interface CardOptions {
  theme: string | ThemeColors;
  width?: number;
  height?: number;
  showA2A?: boolean;
  animated?: boolean;
}

// ==================== 旧版兼容类型 ====================

/** v0.3 旧版 ACP 数据结构（向后兼容） */
export interface ACPDataLegacy {
  acp: string;
  identity: {
    id: string;
    name: string;
    display_name?: string;
    description?: string;
    avatar?: string;
  };
  capabilities: {
    services: (string | { name: string; status: string })[];
    trust_level?: 'unverified' | 'verified' | 'trusted';
  };
  reputation?: {
    karma?: number;
    followers?: number;
    following?: number;
    verified_by?: string;
  };
  owners?: Array<{
    name: string;
    handle?: string;
    role?: string;
    verification?: {
      claim_verified?: boolean;
    };
  }>;
  entry: {
    source: string;
    homepage?: string;
  };
  a2a?: {
    enabled?: boolean;
  };
}
