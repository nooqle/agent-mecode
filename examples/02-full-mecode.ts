/**
 * Example 2: Generate a full MeCode with all modules
 *
 * This example shows how to generate a complete MeCode with skills,
 * payment information, and A2A capabilities.
 */

import { ACPGenerator, generateACPCard } from 'agent-mecode';

// Create a generator
const generator = new ACPGenerator('moltbook');

// Generate full MeCode with all modules
const meCode = generator.generate({
  id: 'code-review-agent',
  name: 'Code Review Agent',
  description: 'Professional code review assistant with expertise in TypeScript, Python, and Go',
  capabilities: ['code-review', 'security-audit', 'performance-analysis', 'best-practices'],
  ownerName: 'DevTools Inc',
  ownerUrl: 'https://devtools.example.com',

  // Social information
  platform: 'moltbook',
  karma: 1500,
  followers: 230,
  following: 45,
  tags: ['code-review', 'typescript', 'python', 'security'],

  // Entry points
  homepage: 'https://devtools.example.com/agents/code-review',
  source: 'https://github.com/devtools/code-review-agent'
});

// Add skills module manually
meCode['module:skills'] = {
  _access: 'public',
  skills: [
    {
      id: 'review-pr',
      name: 'Review Pull Request',
      description: 'Comprehensive code review for pull requests',
      endpoint: 'https://api.devtools.example.com/review/pr',
      method: 'POST',
      price: { amount: 0.05, currency: 'USDC', unit: 'per-review' },
      input: {
        type: 'object',
        properties: {
          repo_url: { type: 'string' },
          pr_number: { type: 'number' }
        }
      },
      output: {
        type: 'object',
        properties: {
          issues: { type: 'array' },
          suggestions: { type: 'array' },
          score: { type: 'number' }
        }
      }
    },
    {
      id: 'security-scan',
      name: 'Security Scan',
      description: 'Scan code for security vulnerabilities',
      endpoint: 'https://api.devtools.example.com/security/scan',
      method: 'POST',
      price: { amount: 0.10, currency: 'USDC', unit: 'per-scan' }
    }
  ]
};

// Add finance module
meCode['module:finance'] = {
  _access: 'public',
  chains: ['ethereum', 'base', 'polygon'],
  addresses: {
    ethereum: '0x1234567890abcdef1234567890abcdef12345678',
    base: '0x1234567890abcdef1234567890abcdef12345678',
    polygon: '0x1234567890abcdef1234567890abcdef12345678'
  },
  accept: ['USDC', 'ETH', 'MATIC']
};

// Add A2A module
meCode['module:a2a'] = {
  _access: 'public',
  enabled: true,
  endpoint: 'https://api.devtools.example.com/a2a',
  protocol: '1.0',
  capabilities: ['task-delegation', 'result-sharing', 'payment-settlement']
};

// Generate SVG card
const svg = generateACPCard(meCode, {
  theme: 'matrix',
  animated: true,
  showA2A: true
});

console.log('Full MeCode generated!');
console.log('Modules included:', Object.keys(meCode).filter(k => k.startsWith('module:')));
