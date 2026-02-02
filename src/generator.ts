/**
 * ACP Generator - 生成器类
 * 按平台需求组装 ACP Code
 */

import {
  ACPCode,
  Core,
  AgentData,
  GeneratorConfig,
  AccessLevel,
  ContactRoute
} from './types';

// ==================== 平台配置 ====================

const GENERATOR_CONFIGS: Record<string, GeneratorConfig> = {
  'moltbook': {
    platform: 'moltbook',
    requiredModules: ['module:social'],
    optionalModules: ['module:contact', 'module:entry', 'module:a2a'],
    defaultAccess: {
      'module:social': 'public',
      'module:contact': 'verified',
      'module:entry': 'public',
      'module:a2a': 'public'
    }
  },
  'wallet': {
    platform: 'wallet',
    requiredModules: ['module:finance'],
    optionalModules: ['module:contact'],
    defaultAccess: {
      'module:finance': 'private',
      'module:contact': 'verified'
    }
  },
  'collaboration': {
    platform: 'collaboration',
    requiredModules: ['module:entry', 'module:a2a'],
    optionalModules: ['module:contact'],
    defaultAccess: {
      'module:entry': 'public',
      'module:a2a': 'public',
      'module:contact': 'verified'
    }
  },
  'default': {
    platform: 'default',
    requiredModules: [],
    optionalModules: ['module:social', 'module:finance', 'module:contact', 'module:entry', 'module:a2a'],
    defaultAccess: {}
  }
};

// ==================== 生成器类 ====================

export class ACPGenerator {
  private config: GeneratorConfig;

  constructor(platform: string = 'default') {
    this.config = GENERATOR_CONFIGS[platform] || GENERATOR_CONFIGS['default'];
  }

  /**
   * 获取平台配置
   */
  getConfig(): GeneratorConfig {
    return this.config;
  }

  /**
   * 生成 ACP Code
   */
  generate(data: AgentData): ACPCode {
    // 构建 Core
    const core: Core = {
      id: data.id,
      name: data.name,
      description: data.description,
      avatar: data.avatar,
      capabilities: data.capabilities,
      owner: {
        name: data.ownerName,
        url: data.ownerUrl,
        verified_by: data.platform
      },
      sig: '' // 签名稍后填充
    };

    const code: ACPCode = {
      acp: '1.0',
      core
    };

    // 添加必须模块
    for (const moduleName of this.config.requiredModules) {
      const moduleData = this.buildModule(moduleName, data);
      if (moduleData) {
        moduleData._access = this.config.defaultAccess[moduleName] || 'public';
        (code as any)[moduleName] = moduleData;
      }
    }

    // 添加可选模块（如果数据存在）
    for (const moduleName of this.config.optionalModules) {
      const moduleData = this.buildModule(moduleName, data);
      if (moduleData && Object.keys(moduleData).length > 0) {
        moduleData._access = this.config.defaultAccess[moduleName] || 'public';
        (code as any)[moduleName] = moduleData;
      }
    }

    return code;
  }

  /**
   * 构建模块数据
   */
  private buildModule(name: string, data: AgentData): any {
    switch (name) {
      case 'module:social':
        if (!data.karma && !data.followers && !data.tags?.length) return null;
        return {
          karma: data.karma,
          followers: data.followers,
          following: data.following,
          tags: data.tags
        };

      case 'module:finance':
        if (!data.paymentAddresses) return null;
        return {
          chains: data.paymentChains || Object.keys(data.paymentAddresses),
          addresses: data.paymentAddresses
        };

      case 'module:contact':
        if (!data.contactRoutes?.length) return null;
        return {
          routes: data.contactRoutes
        };

      case 'module:entry':
        if (!data.source && !data.homepage) return null;
        return {
          source: data.source || data.homepage,
          homepage: data.homepage
        };

      case 'module:a2a':
        if (!data.a2aEnabled) return null;
        return {
          enabled: true,
          agent_card_url: data.a2aUrl
        };

      default:
        return null;
    }
  }
}

// ==================== 导出配置 ====================

export { GENERATOR_CONFIGS };
