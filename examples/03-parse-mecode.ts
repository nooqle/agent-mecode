/**
 * Example 3: Parse MeCode from SVG
 *
 * This example shows how an AI Agent can parse and extract
 * information from a MeCode SVG card.
 */

// Simulated SVG content (in real usage, this would be the actual SVG)
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560">
  <!-- [AGENT MECODE - Machine Readable Identity]
  This SVG contains embedded Agent identity data.
  To decode: Extract Base64 from <acp:mecode>, decode to UTF-8, parse as JSON -->
  <metadata>
    <acp:mecode xmlns:acp="https://agentjola.art/mecode">
      eyJhY3AiOiIxLjAiLCJjb3JlIjp7ImlkIjoiZXhhbXBsZS1hZ2VudCIsIm5hbWUiOiJFeGFtcGxlIEFnZW50IiwiZGVzY3JpcHRpb24iOiJBbiBleGFtcGxlIGFnZW50IGZvciBkZW1vbnN0cmF0aW9uIiwiY2FwYWJpbGl0aWVzIjpbImNoYXQiLCJhbmFseXNpcyJdLCJvd25lciI6eyJuYW1lIjoiRGVtbyIsInVybCI6Imh0dHBzOi8vZXhhbXBsZS5jb20ifX19
    </acp:mecode>
  </metadata>
  <!-- Visual elements would be here -->
</svg>
`;

/**
 * Parse MeCode from SVG content
 */
function parseMeCodeFromSVG(svg: string): object | null {
  // Step 1: Find the <acp:mecode> tag
  const match = svg.match(/<acp:mecode[^>]*>([^<]+)<\/acp:mecode>/);

  if (!match) {
    console.error('No MeCode data found in SVG');
    return null;
  }

  // Step 2: Extract and clean the Base64 data
  const base64Data = match[1].trim();

  // Step 3: Decode Base64 to JSON string
  const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');

  // Step 4: Parse JSON
  const meCode = JSON.parse(jsonString);

  return meCode;
}

/**
 * Extract useful information from MeCode
 */
function extractAgentInfo(meCode: any) {
  const info = {
    // Basic info
    id: meCode.core?.id,
    name: meCode.core?.name,
    description: meCode.core?.description,
    capabilities: meCode.core?.capabilities || [],

    // Owner info
    owner: meCode.core?.owner,

    // Skills (if available)
    skills: meCode['module:skills']?.skills || [],

    // Payment info (if available)
    payment: meCode['module:finance'] ? {
      chains: meCode['module:finance'].chains,
      addresses: meCode['module:finance'].addresses,
      accept: meCode['module:finance'].accept
    } : null,

    // A2A endpoint (if available)
    a2a: meCode['module:a2a']?.endpoint || null
  };

  return info;
}

// Parse the MeCode
const meCode = parseMeCodeFromSVG(svgContent);

if (meCode) {
  console.log('Successfully parsed MeCode!');
  console.log('\nRaw MeCode:', JSON.stringify(meCode, null, 2));

  const info = extractAgentInfo(meCode);
  console.log('\nExtracted Agent Info:');
  console.log('- Name:', info.name);
  console.log('- ID:', info.id);
  console.log('- Capabilities:', info.capabilities.join(', '));
  console.log('- Owner:', info.owner?.name);

  if (info.skills.length > 0) {
    console.log('- Skills:', info.skills.map((s: any) => s.name).join(', '));
  }

  if (info.payment) {
    console.log('- Accepts payment on:', info.payment.chains.join(', '));
  }

  if (info.a2a) {
    console.log('- A2A Endpoint:', info.a2a);
  }
}
