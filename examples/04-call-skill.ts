/**
 * Example 4: Call an Agent's Skill
 *
 * This example shows how to parse a MeCode, find a skill,
 * and call the skill's endpoint.
 */

interface Skill {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  price?: {
    amount: number;
    currency: string;
  };
}

interface MeCode {
  acp: string;
  core: {
    id: string;
    name: string;
    description: string;
    capabilities: string[];
    owner: {
      name: string;
      url: string;
    };
  };
  'module:skills'?: {
    skills: Skill[];
  };
  'module:finance'?: {
    chains: string[];
    addresses: Record<string, string>;
    accept: string[];
  };
}

/**
 * Find a skill by ID or name
 */
function findSkill(meCode: MeCode, skillIdOrName: string): Skill | null {
  const skills = meCode['module:skills']?.skills || [];

  return skills.find(
    s => s.id === skillIdOrName || s.name.toLowerCase() === skillIdOrName.toLowerCase()
  ) || null;
}

/**
 * Call an agent's skill
 */
async function callSkill(skill: Skill, input: any): Promise<any> {
  console.log(`Calling skill: ${skill.name}`);
  console.log(`Endpoint: ${skill.endpoint}`);
  console.log(`Method: ${skill.method}`);

  if (skill.price) {
    console.log(`Price: ${skill.price.amount} ${skill.price.currency}`);
  }

  // In real usage, you would make an actual HTTP request
  // const response = await fetch(skill.endpoint, {
  //   method: skill.method,
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(input)
  // });
  // return response.json();

  // Simulated response
  return {
    success: true,
    result: 'Skill executed successfully',
    input: input
  };
}

// Example MeCode with skills
const meCode: MeCode = {
  acp: '1.0',
  core: {
    id: 'code-helper',
    name: 'Code Helper',
    description: 'Professional code review assistant',
    capabilities: ['code-review', 'debugging'],
    owner: {
      name: 'DevTools',
      url: 'https://devtools.example.com'
    }
  },
  'module:skills': {
    skills: [
      {
        id: 'review-code',
        name: 'Review Code',
        endpoint: 'https://api.devtools.example.com/review',
        method: 'POST',
        price: { amount: 0.05, currency: 'USDC' }
      },
      {
        id: 'fix-bug',
        name: 'Fix Bug',
        endpoint: 'https://api.devtools.example.com/fix',
        method: 'POST',
        price: { amount: 0.10, currency: 'USDC' }
      }
    ]
  },
  'module:finance': {
    chains: ['ethereum', 'base'],
    addresses: {
      ethereum: '0x1234...',
      base: '0x1234...'
    },
    accept: ['USDC', 'ETH']
  }
};

// Find and call a skill
async function main() {
  // Find the code review skill
  const skill = findSkill(meCode, 'review-code');

  if (!skill) {
    console.error('Skill not found');
    return;
  }

  console.log('Found skill:', skill.name);
  console.log('');

  // Call the skill
  const result = await callSkill(skill, {
    code: 'function add(a, b) { return a + b; }',
    language: 'javascript'
  });

  console.log('\nResult:', result);

  // Show payment info
  const finance = meCode['module:finance'];
  if (finance && skill.price) {
    console.log('\n--- Payment Info ---');
    console.log(`Amount due: ${skill.price.amount} ${skill.price.currency}`);
    console.log('Pay to:');
    finance.chains.forEach(chain => {
      console.log(`  ${chain}: ${finance.addresses[chain]}`);
    });
  }
}

main();
