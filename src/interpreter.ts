/**
 * ACP Interpreter - 解释器类
 * 平台特定的 Code 解析和投影
 */

import { ACPSDK } from './sdk';
import {
  ACPCode,
  ValidationResult,
  ModuleSocial
} from './types';

export class ACPInterpreter {
  private requiredModules: string[];
  private sdk: ACPSDK;

  constructor(requiredModules: string[] = []) {
    this.requiredModules = requiredModules;
    this.sdk = new ACPSDK();
  }

  /**
   * 验证 Code 是否满足平台要求
   */
  validate(code: ACPCode): ValidationResult {
    const baseResult = this.sdk.validate(code);

    if (!baseResult.valid) {
      return baseResult;
    }

    // 检查必要模块
    const errors: string[] = [];
    for (const mod of this.requiredModules) {
      if (!this.sdk.hasModule(code, mod)) {
        errors.push(`Missing required module: ${mod}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 投影为平台特定格式
   */
  project(code: ACPCode, format: string): any {
    switch (format) {
      case 'profile':
        return this.projectToProfile(code);

      case 'a2a':
        return this.sdk.exportA2A(code);

      case 'json':
      default:
        return code;
    }
  }

  /**
   * 投影为 Profile 格式
   */
  private projectToProfile(code: ACPCode): any {
    const social = this.sdk.getModule<ModuleSocial>(code, 'module:social');

    return {
      id: code.core.id,
      name: code.core.name,
      description: code.core.description,
      capabilities: code.core.capabilities.map(c =>
        typeof c === 'string' ? c : c.name
      ),
      karma: social?.karma || 0,
      followers: social?.followers || 0,
      following: social?.following || 0,
      tags: social?.tags || [],
      owner: code.core.owner,
      verified: !!code.core.owner.verified_by
    };
  }
}

// ==================== 预定义解释器 ====================

/**
 * Moltbook 平台解释器
 */
export class MoltbookInterpreter extends ACPInterpreter {
  constructor() {
    super(['module:social']);
  }
}

/**
 * 钱包平台解释器
 */
export class WalletInterpreter extends ACPInterpreter {
  constructor() {
    super(['module:finance']);
  }

  /**
   * 投影为支付信息
   */
  projectToPayment(code: ACPCode): any {
    const finance = code['module:finance'];
    if (!finance) {
      throw new Error('Missing module:finance');
    }

    return {
      id: code.core.id,
      name: code.core.name,
      owner: code.core.owner.name,
      chains: finance.chains || [],
      addresses: finance.addresses || {},
      primary: finance.primary,
      accept: finance.accept || []
    };
  }
}

/**
 * 协作平台解释器
 */
export class CollaborationInterpreter extends ACPInterpreter {
  constructor() {
    super(['module:entry', 'module:a2a']);
  }
}
