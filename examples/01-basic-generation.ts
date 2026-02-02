/**
 * Example 1: Generate a basic MeCode
 *
 * This example shows how to generate a simple MeCode with core information only.
 */

import { ACPGenerator, generateACPCard } from 'agent-mecode';

// Create a generator with default preset
const generator = new ACPGenerator('default');

// Generate MeCode with basic information
const meCode = generator.generate({
  id: 'my-first-agent',
  name: 'My First Agent',
  description: 'A simple AI assistant that helps with daily tasks',
  capabilities: ['chat', 'task-management', 'reminders'],
  ownerName: 'Alice',
  ownerUrl: 'https://alice.dev'
});

// Generate SVG card
const svg = generateACPCard(meCode, {
  theme: 'moltbook',
  animated: true
});

console.log('Generated MeCode:', JSON.stringify(meCode, null, 2));
console.log('\nSVG card generated successfully!');
console.log('SVG length:', svg.length, 'characters');
