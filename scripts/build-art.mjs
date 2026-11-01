// scripts/build-art.mjs
// Generates src/content/art.ts with clear, child-friendly, expressive SVG artwork for Foxling.

import fs from 'fs';
import path from 'path';

console.log('Building enhanced art.ts for 4-6 year olds...');

const wrap = (body, bg = '#fff8f0') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#ffe8d6"/>
    </radialGradient>
    <linearGradient id="fur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff9a4d"/>
      <stop offset="100%" stop-color="#f2701d"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="28" fill="url(#bg)"/>
  <ellipse cx="100" cy="176" rx="52" ry="10" fill="#000" opacity="0.08"/>
  ${body}
</svg>`;

const shadow = (cx, cy, rx) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="8" fill="#000" opacity="0.08"/>`;

// We will build the full content of art.ts
const artTsContent = `export const wrap = (body: string, bg = '#fff8f0') =>
  \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="\${bg}"/>
      <stop offset="100%" stop-color="#ffe8d6"/>
    </radialGradient>
    <linearGradient id="fur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff9a4d"/>
      <stop offset="100%" stop-color="#f2701d"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="28" fill="url(#bg)"/>
  <ellipse cx="100" cy="176" rx="52" ry="10" fill="#000" opacity="0.08"/>
  \${body}
</svg>\`;

const shadow = (cx: number, cy: number, rx: number) =>
  \`<ellipse cx="\${cx}" cy="\${cy}" rx="\${rx}" ry="8" fill="#000" opacity="0.08"/>\`;

export function foxySVG(mood: 'happy' | 'sleep' | 'point' | 'surprise' | 'eat' = 'happy'): string {
  const eyes =
    mood === 'sleep'
      ? \`<path d="M72 98 q8 6 16 0" stroke="#5b3413" stroke-width="4.5" fill="none" stroke-linecap="round"/>
         <path d="M112 98 q8 6 16 0" stroke="#5b3413" stroke-width="4.5" fill="none" stroke-linecap="round"/>\`
      : mood === 'surprise'
      ? \`<circle cx="80" cy="96" r="9" fill="#fff"/><circle cx="82" cy="98" r="4.5" fill="#3a2008"/>
         <circle cx="120" cy="96" r="9" fill="#fff"/><circle cx="122" cy="98" r="4.5" fill="#3a2008"/>\`
      : \`<circle cx="80" cy="96" r="9" fill="#fff"/><circle cx="82" cy="98" r="4.5" fill="#3a2008"/>
         <circle cx="120" cy="96" r="9" fill="#fff"/><circle cx="122" cy="98" r="4.5" fill="#3a2008"/>\`;
  const mouth =
    mood === 'sleep'
      ? \`<path d="M94 124 q6 4 12 0" stroke="#5b3413" stroke-width="3.5" fill="none" stroke-linecap="round"/>\`
      : mood === 'surprise'
      ? \`<ellipse cx="100" cy="124" rx="8" ry="10" fill="#7a3b12"/>\`
      : mood === 'eat'
      ? \`<path d="M86 118 q14 16 28 0 q-14 8 -28 0z" fill="#7a3b12"/><ellipse cx="100" cy="126" rx="7" ry="4" fill="#ff7d9c"/>\`
      : \`<path d="M84 116 q16 16 32 0" stroke="#5b3413" stroke-width="4" fill="none" stroke-linecap="round"/>\`;
  const arm =
    mood === 'point'
      ? \`<path d="M138 118 L172 96" stroke="#f2701d" stroke-width="14" stroke-linecap="round"/><circle cx="174" cy="94" r="9" fill="#fff3e4"/>\`
      : \`<path d="M64 122 q-10 12 -2 22" stroke="#f2701d" stroke-width="13" fill="none" stroke-linecap="round"/>\`;
  const nightcap =
    mood === 'sleep'
      ? \`<g class="foxy-nightcap">
           <path d="M72 64 Q 95 24 132 34 Q 160 44 156 64 Q 134 52 116 64 Z" fill="#4dabf7"/>
           <path d="M86 50 Q 108 40 134 46" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/>
           <rect x="70" y="58" width="52" height="14" rx="7" fill="#ffffff"/>
           <circle cx="156" cy="64" r="9" fill="#ffffff"/>
           <circle cx="156" cy="64" r="7" fill="#e7f5ff"/>
         </g>
         <g class="foxy-zzz" fill="#74c0fc" font-family="'Baloo 2',sans-serif" font-weight="800">
           <text x="142" y="72" font-size="16" opacity="0.85">z</text>
           <text x="156" y="52" font-size="22" opacity="0.9">z</text>
           <text x="172" y="30" font-size="28">Z</text>
         </g>\`
      : '';
  const cheeks =
    mood === 'sleep'
      ? \`<circle cx="68" cy="114" r="8" fill="#ff8787" opacity="0.5"/><circle cx="132" cy="114" r="8" fill="#ff8787" opacity="0.5"/>\`
      : '';
  return wrap(\`
  <path d="M58 62 L46 26 L82 48 Z" fill="url(#fur)"/><path d="M142 62 L154 26 L118 48 Z" fill="url(#fur)"/>
  <path d="M58 56 L52 38 L70 50 Z" fill="#fff3e4"/><path d="M142 56 L148 38 L130 50 Z" fill="#fff3e4"/>
  <ellipse cx="100" cy="105" rx="52" ry="50" fill="url(#fur)"/>
  <ellipse cx="100" cy="122" rx="30" ry="26" fill="#fff3e4"/>
  \${eyes}
  \${cheeks}
  <ellipse cx="100" cy="110" rx="7" ry="5.5" fill="#3a2008"/>
  \${mouth}
  \${arm}
  <path d="M148 128 q26 4 22 26 q-4 18 -24 14 q10 -8 8 -20 q-2 -12 -6 -20z" fill="url(#fur)"/>
  <path d="M166 162 q6 6 2 14 q-16 4 -22 -6 q10 0 20 -8z" fill="#fff3e4"/>
  \${nightcap}
  \`);
}

const art: Record<string, string> = {
  // === FARM ANIMALS ===
  cat: wrap(\`\${shadow(100, 168, 48)}
    <path d="M62 68 L52 30 L84 50 Z" fill="#f59f00"/><path d="M138 68 L148 30 L116 50 Z" fill="#f59f00"/>
    <path d="M66 62 L60 40 L78 52 Z" fill="#ffc9c9"/><path d="M134 62 L140 40 L122 52 Z" fill="#ffc9c9"/>
    <ellipse cx="100" cy="108" rx="48" ry="44" fill="#f59f00"/>
    <ellipse cx="100" cy="124" rx="28" ry="22" fill="#fff3bf"/>
    <circle cx="82" cy="100" r="9" fill="#fff"/><circle cx="84" cy="102" r="5" fill="#212529"/><circle cx="86" cy="100" r="2" fill="#fff"/>
    <circle cx="118" cy="100" r="9" fill="#fff"/><circle cx="116" cy="102" r="5" fill="#212529"/><circle cx="118" cy="100" r="2" fill="#fff"/>
    <path d="M96 114 h8 l-4 6 z" fill="#ff6b6b"/>
    <path d="M92 122 q8 6 16 0" stroke="#d9480f" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g stroke="#d9480f" stroke-width="2.5" stroke-linecap="round">
      <path d="M50 108 h-20"/><path d="M52 118 l-18 6"/>
      <path d="M150 108 h20"/><path d="M148 118 l18 6"/>
    </g>
    <path d="M100 64 v12 M92 66 l4 10 M108 66 l-4 10" stroke="#d9480f" stroke-width="3" stroke-linecap="round"/>\`, '#fff9db'),

  dog: wrap(\`\${shadow(100, 168, 50)}
    <path d="M56 72 q-18 -2 -14 -32 q20 -4 28 16z" fill="#8c5828"/><path d="M144 72 q18 -2 14 -32 q-20 -4 -28 16z" fill="#8c5828"/>
    <ellipse cx="100" cy="106" rx="48" ry="44" fill="#c4884d"/>
    <ellipse cx="100" cy="124" rx="28" ry="22" fill="#f4ebd9"/>
    <ellipse cx="78" cy="98" rx="16" ry="18" fill="#8c5828"/>
    <circle cx="78" cy="98" r="8" fill="#fff"/><circle cx="80" cy="100" r="4.5" fill="#212529"/><circle cx="82" cy="98" r="1.8" fill="#fff"/>
    <circle cx="120" cy="98" r="8" fill="#fff"/><circle cx="118" cy="100" r="4.5" fill="#212529"/><circle cx="119" cy="98" r="1.8" fill="#fff"/>
    <ellipse cx="100" cy="116" rx="9" ry="7" fill="#212529"/>
    <path d="M100 123 v5 M100 128 q-8 8 -12 0 M100 128 q8 8 12 0" stroke="#212529" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="100" cy="138" rx="7" ry="6" fill="#ff8787"/>
    <rect x="72" y="146" width="56" height="8" rx="4" fill="#e03131"/>
    <circle cx="100" cy="154" r="5" fill="#fcc419"/>\`, '#fff4e6'),

  duck: wrap(\`\${shadow(100, 168, 48)}
    <path d="M40 152 q60 18 120 0 q-30 16 -80 16 q-40 0 -40 -16z" fill="#4dabf7" opacity="0.4"/>
    <ellipse cx="94" cy="120" rx="46" ry="36" fill="#ffd43b"/>
    <circle cx="114" cy="80" r="28" fill="#ffd43b"/>
    <path d="M136 78 q26 0 24 12 q-4 8 -24 6z" fill="#ff922b"/>
    <circle cx="140" cy="83" r="2" fill="#d9480f"/>
    <circle cx="110" cy="74" r="7" fill="#fff"/><circle cx="112" cy="76" r="3.8" fill="#212529"/><circle cx="114" cy="74" r="1.5" fill="#fff"/>
    <path d="M50 114 q24 -14 36 6 q-18 12 -36 -6z" fill="#fab005"/>\`, '#e7f5ff'),

  fish: wrap(\`\${shadow(100, 168, 44)}
    <path d="M142 100 L176 72 q4 28 -2 56 Z" fill="#ff922b"/>
    <ellipse cx="96" cy="100" rx="50" ry="34" fill="#ff922b"/>
    <path d="M86 68 q16 -16 32 -2 q-14 8 -32 2z" fill="#fd7e14"/>
    <path d="M86 132 q16 16 32 2 q-14 -8 -32 -2z" fill="#fd7e14"/>
    <path d="M110 72 q12 28 0 56" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="70" cy="94" r="8" fill="#fff"/><circle cx="72" cy="96" r="4.2" fill="#212529"/><circle cx="74" cy="94" r="1.8" fill="#fff"/>
    <path d="M54 104 q8 6 16 0" stroke="#d9480f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="74" r="5" fill="#74c0fc" opacity="0.8"/><circle cx="34" cy="60" r="7" fill="#74c0fc" opacity="0.8"/><circle cx="40" cy="42" r="4" fill="#74c0fc" opacity="0.8"/>\`, '#e7f5ff'),

  bird: wrap(\`\${shadow(100, 168, 40)}
    <path d="M48 152 h104" stroke="#8b5a2b" stroke-width="6" stroke-linecap="round"/>
    <circle cx="56" cy="146" r="6" fill="#51cf66"/>
    <ellipse cx="98" cy="112" rx="40" ry="34" fill="#339af0"/>
    <circle cx="112" cy="76" r="26" fill="#339af0"/>
    <path d="M132 74 l22 6 l-22 8z" fill="#ffd43b"/>
    <circle cx="108" cy="72" r="7" fill="#fff"/><circle cx="110" cy="74" r="3.5" fill="#212529"/><circle cx="112" cy="72" r="1.5" fill="#fff"/>
    <path d="M64 108 q-18 -6 -16 -24 q16 4 22 14z" fill="#1c7ed6"/>
    <ellipse cx="116" cy="120" rx="18" ry="14" fill="#e7f5ff"/>
    <path d="M96 146 v8 M108 146 v8" stroke="#f76707" stroke-width="4" stroke-linecap="round"/>
    <g fill="#fcc419"><path d="M152 52 q4 -6 8 0 q-4 6 -8 0z"/><circle cx="166" cy="42" r="4"/></g>\`, '#e7f5ff'),

  cow: wrap(\`\${shadow(100, 168, 52)}
    <path d="M58 56 q-8 -24 8 -24 q4 14 2 24z" fill="#ffd43b"/><path d="M142 56 q8 -24 -8 -24 q-4 14 -2 24z" fill="#ffd43b"/>
    <ellipse cx="50" cy="70" rx="16" ry="10" fill="#fff" stroke="#dee2e6" stroke-width="2" transform="rotate(-20 50 70)"/>
    <ellipse cx="150" cy="70" rx="16" ry="10" fill="#fff" stroke="#dee2e6" stroke-width="2" transform="rotate(20 150 70)"/>
    <ellipse cx="100" cy="104" rx="52" ry="46" fill="#fff" stroke="#dee2e6" stroke-width="2"/>
    <path d="M68 84 q12 8 8 26 q-18 6 -18 -14z" fill="#212529"/>
    <path d="M130 76 q14 16 20 6 q2 -16 -12 -12z" fill="#212529"/>
    <circle cx="78" cy="94" r="8" fill="#fff"/><circle cx="80" cy="96" r="4.5" fill="#212529"/><circle cx="82" cy="94" r="1.8" fill="#fff"/>
    <circle cx="122" cy="94" r="8" fill="#fff"/><circle cx="120" cy="96" r="4.5" fill="#212529"/><circle cx="121" cy="94" r="1.8" fill="#fff"/>
    <ellipse cx="100" cy="126" rx="28" ry="18" fill="#ffc9c9"/>
    <ellipse cx="90" cy="126" rx="4.5" ry="5.5" fill="#c92a2a"/><ellipse cx="110" cy="126" rx="4.5" ry="5.5" fill="#c92a2a"/>
    <path d="M92 136 q8 6 16 0" stroke="#c92a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="90" y="148" width="20" height="12" rx="4" fill="#ffd43b"/>
    <circle cx="100" cy="162" r="3" fill="#f08c00"/>\`, '#f8f9fa'),

  horse: wrap(\`\${shadow(100, 168, 52)}
    <path d="M62 62 L50 26 L80 46 Z" fill="#8c5828"/><path d="M138 62 L150 26 L120 46 Z" fill="#8c5828"/>
    <path d="M65 58 L56 36 L76 48 Z" fill="#ffc9c9"/><path d="M135 58 L144 36 L124 48 Z" fill="#ffc9c9"/>
    <ellipse cx="100" cy="106" rx="48" ry="44" fill="#a66e38"/>
    <path d="M92 46 q8 -14 16 0 q-8 22 -16 0z" fill="#5c3818"/>
    <path d="M96 66 h8 l-2 36 h-4 z" fill="#fff" opacity="0.9"/>
    <circle cx="78" cy="96" r="8" fill="#fff"/><circle cx="80" cy="98" r="4.5" fill="#212529"/><circle cx="82" cy="96" r="1.8" fill="#fff"/>
    <circle cx="122" cy="96" r="8" fill="#fff"/><circle cx="120" cy="98" r="4.5" fill="#212529"/><circle cx="121" cy="96" r="1.8" fill="#fff"/>
    <ellipse cx="100" cy="126" rx="26" ry="18" fill="#deb887"/>
    <ellipse cx="90" cy="124" rx="4" ry="5" fill="#5c3818"/><ellipse cx="110" cy="124" rx="4" ry="5" fill="#5c3818"/>
    <path d="M92 134 q8 6 16 0" stroke="#5c3818" stroke-width="2.5" fill="none" stroke-linecap="round"/>\`, '#fff4e6'),

  pig: wrap(\`\${shadow(100, 168, 48)}
    <path d="M64 64 L52 36 L82 50 Z" fill="#f783ac"/><path d="M136 64 L148 36 L118 50 Z" fill="#f783ac"/>
    <ellipse cx="100" cy="108" rx="50" ry="44" fill="#ffb3c1"/>
    <circle cx="80" cy="96" r="8" fill="#fff"/><circle cx="82" cy="98" r="4.5" fill="#212529"/><circle cx="84" cy="96" r="1.8" fill="#fff"/>
    <circle cx="120" cy="96" r="8" fill="#fff"/><circle cx="118" cy="98" r="4.5" fill="#212529"/><circle cx="119" cy="96" r="1.8" fill="#fff"/>
    <circle cx="66" cy="116" r="8" fill="#f783ac" opacity="0.6"/><circle cx="134" cy="116" r="8" fill="#f783ac" opacity="0.6"/>
    <ellipse cx="100" cy="120" rx="22" ry="16" fill="#f783ac"/>
    <circle cx="92" cy="120" r="4.5" fill="#a61e4d"/><circle cx="108" cy="120" r="4.5" fill="#a61e4d"/>
    <path d="M90 138 q10 8 20 0" stroke="#a61e4d" stroke-width="3" fill="none" stroke-linecap="round"/>\`, '#fff0f6'),

  sheep: wrap(\`\${shadow(100, 168, 52)}
    <g fill="#fff" stroke="#e9ecef" stroke-width="3">
      <circle cx="64" cy="84" r="22"/><circle cx="100" cy="68" r="26"/><circle cx="136" cy="84" r="22"/>
      <circle cx="56" cy="114" r="22"/><circle cx="144" cy="114" r="22"/>
      <circle cx="74" cy="138" r="20"/><circle cx="126" cy="138" r="20"/><circle cx="100" cy="144" r="22"/>
    </g>
    <ellipse cx="44" cy="100" rx="14" ry="8" fill="#343a40" transform="rotate(-30 44 100)"/>
    <ellipse cx="156" cy="100" rx="14" ry="8" fill="#343a40" transform="rotate(30 156 100)"/>
    <ellipse cx="100" cy="106" rx="26" ry="30" fill="#343a40"/>
    <circle cx="92" cy="98" r="6" fill="#fff"/><circle cx="93.5" cy="99.5" r="3" fill="#111"/><circle cx="95" cy="98" r="1.2" fill="#fff"/>
    <circle cx="108" cy="98" r="6" fill="#fff"/><circle cx="106.5" cy="99.5" r="3" fill="#111"/><circle cx="107" cy="98" r="1.2" fill="#fff"/>
    <path d="M94 118 q6 5 12 0" stroke="#ffc9c9" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M80 148 v14 M120 148 v14" stroke="#343a40" stroke-width="8" stroke-linecap="round"/>\`, '#f1f3f5'),

  rabbit: wrap(\`\${shadow(100, 168, 44)}
    <ellipse cx="78" cy="44" rx="12" ry="34" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
    <ellipse cx="78" cy="48" rx="6" ry="24" fill="#ffc9c9"/>
    <ellipse cx="122" cy="44" rx="12" ry="34" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
    <ellipse cx="122" cy="48" rx="6" ry="24" fill="#ffc9c9"/>
    <circle cx="100" cy="108" rx="44" ry="40" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
    <circle cx="82" cy="100" r="8" fill="#fff"/><circle cx="84" cy="102" r="4.5" fill="#212529"/><circle cx="86" cy="100" r="1.8" fill="#fff"/>
    <circle cx="118" cy="100" r="8" fill="#fff"/><circle cx="116" cy="102" r="4.5" fill="#212529"/><circle cx="117" cy="100" r="1.8" fill="#fff"/>
    <path d="M96 114 h8 l-4 6 z" fill="#ff8787"/>
    <path d="M92 122 q8 6 16 0" stroke="#adb5bd" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="96" y="125" width="4" height="6" fill="#fff" stroke="#adb5bd" stroke-width="1"/>
    <rect x="100" y="125" width="4" height="6" fill="#fff" stroke="#adb5bd" stroke-width="1"/>
    <g stroke="#adb5bd" stroke-width="2" stroke-linecap="round">
      <path d="M56 112 h-18"/><path d="M58 120 l-16 4"/>
      <path d="M144 112 h18"/><path d="M142 120 l16 4"/>
    </g>\`, '#fff0f6'),

  mouse: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="64" cy="68" r="22" fill="#adb5bd"/><circle cx="64" cy="68" r="12" fill="#ffc9c9"/>
    <circle cx="136" cy="68" r="22" fill="#adb5bd"/><circle cx="136" cy="68" r="12" fill="#ffc9c9"/>
    <ellipse cx="100" cy="116" rx="44" ry="38" fill="#ced4da"/>
    <circle cx="84" cy="106" r="7" fill="#212529"/><circle cx="86" cy="104" r="2" fill="#fff"/>
    <circle cx="116" cy="106" r="7" fill="#212529"/><circle cx="114" cy="104" r="2" fill="#fff"/>
    <ellipse cx="100" cy="118" rx="6" ry="5" fill="#ff8787"/>
    <path d="M94 126 q6 5 12 0" stroke="#868e96" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M140 134 q24 4 18 24 q-4 12 -18 10" stroke="#adb5bd" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M90 144 L114 136 L114 154 Z" fill="#ffd43b"/><circle cx="102" cy="144" r="2.5" fill="#f08c00"/>\`, '#f8f9fa'),

  frog: wrap(\`\${shadow(100, 168, 50)}
    <ellipse cx="100" cy="162" rx="60" ry="12" fill="#2b8a3e" opacity="0.7"/>
    <circle cx="70" cy="72" r="20" fill="#51cf66"/>
    <circle cx="70" cy="72" r="11" fill="#fff"/><circle cx="72" cy="74" r="6" fill="#212529"/><circle cx="74" cy="72" r="2.2" fill="#fff"/>
    <circle cx="130" cy="72" r="20" fill="#51cf66"/>
    <circle cx="130" cy="72" r="11" fill="#fff"/><circle cx="128" cy="74" r="6" fill="#212529"/><circle cx="129" cy="72" r="2.2" fill="#fff"/>
    <ellipse cx="100" cy="118" rx="50" ry="40" fill="#51cf66"/>
    <ellipse cx="100" cy="132" rx="30" ry="22" fill="#d3f9d8"/>
    <circle cx="62" cy="118" r="8" fill="#ff8787" opacity="0.6"/><circle cx="138" cy="118" r="8" fill="#ff8787" opacity="0.6"/>
    <path d="M74 116 q26 18 52 0" stroke="#2b8a3e" stroke-width="4.5" fill="none" stroke-linecap="round"/>\`, '#ebfbee'),

  // === FOOD ===
  apple: wrap(\`\${shadow(100, 168, 44)}
    <path d="M100 64 q-4 -18 8 -24" stroke="#5c3818" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M104 46 q20 -10 28 4 q-14 10 -28 -4z" fill="#40c057"/>
    <path d="M100 68 C 62 68 50 96 58 126 C 66 154 88 166 100 162 C 112 166 134 154 142 126 C 150 96 138 68 100 68 Z" fill="#ff4d4f"/>
    <path d="M72 88 q-10 18 2 36" stroke="#ffa39e" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.85"/>\`, '#fff5f5'),

  banana: wrap(\`\${shadow(100, 168, 46)}
    <path d="M48 60 q-12 68 44 98 q48 26 82 -8 q6 -8 -2 -12 q-42 -36 -80 -68 q-32 -26 -44 -10z" fill="#ffd43b" stroke="#fab005" stroke-width="4" stroke-linejoin="round"/>
    <path d="M44 56 l12 -8 l6 10 l-12 6z" fill="#7a4a12"/>
    <path d="M166 134 l10 4 l-6 8 l-8 -6z" fill="#7a4a12"/>
    <path d="M68 84 q28 46 80 44" stroke="#f59f00" stroke-width="3" fill="none" opacity="0.7"/>\`, '#fff9db'),

  milk: wrap(\`\${shadow(100, 168, 46)}
    <rect x="58" y="72" width="46" height="84" rx="8" fill="#f8f9fa" stroke="#dee2e6" stroke-width="3"/>
    <path d="M58 72 l10 -18 h26 l10 18z" fill="#e9ecef" stroke="#dee2e6" stroke-width="3"/>
    <rect x="74" y="44" width="14" height="10" rx="3" fill="#339af0"/>
    <path d="M68 100 q10 -8 20 2 q6 12 -4 14 q-12 4 -16 -16z" fill="#339af0"/>
    <rect x="118" y="96" width="36" height="60" rx="6" fill="#e7f5ff" stroke="#74c0fc" stroke-width="3"/>
    <rect x="122" y="108" width="28" height="44" rx="4" fill="#fff"/>
    <path d="M142 80 L134 110" stroke="#ff6b6b" stroke-width="5" stroke-linecap="round"/>\`, '#f1f3f5'),

  water: wrap(\`\${shadow(100, 168, 44)}
    <path d="M66 66 L74 154 a10 10 0 0 0 10 10 h32 a10 10 0 0 0 10 -10 L134 66 Z" fill="#d0ebff" stroke="#339af0" stroke-width="4"/>
    <path d="M72 86 L76 150 a6 6 0 0 0 6 6 h36 a6 6 0 0 0 6 -6 L128 86 Z" fill="#4dabf7"/>
    <ellipse cx="100" cy="86" rx="28" ry="8" fill="#74c0fc"/>
    <rect x="88" y="96" width="16" height="16" rx="4" fill="#fff" opacity="0.6"/>
    <circle cx="106" cy="128" r="4" fill="#fff" opacity="0.8"/><circle cx="92" cy="138" r="3" fill="#fff" opacity="0.8"/>
    <path d="M100 28 C 90 42 84 54 84 64 a16 16 0 0 0 32 0 C 116 54 110 42 100 28 Z" fill="#339af0"/>\`, '#e7f5ff'),

  bread: wrap(\`\${shadow(100, 168, 50)}
    <path d="M42 110 q0 -36 58 -36 q58 0 58 36 v24 q0 12 -12 12 h-92 q-12 0 -12 -12z" fill="#d97706"/>
    <path d="M44 114 q0 -32 56 -32 q56 0 56 32 v6 h-112z" fill="#f59e0b"/>
    <g stroke="#92400e" stroke-width="4.5" stroke-linecap="round">
      <path d="M72 94 l12 14"/><path d="M100 90 v16"/><path d="M128 94 l-12 14"/>
    </g>
    <path d="M30 148 L170 120" stroke="#fcd34d" stroke-width="12" stroke-linecap="round" opacity="0.3"/>\`, '#fffbeb'),

  cheese: wrap(\`\${shadow(100, 168, 50)}
    <path d="M42 128 L158 92 L158 138 a10 10 0 0 1 -10 10 h-96 a10 10 0 0 1 -10 -10z" fill="#ffd43b"/>
    <path d="M42 128 L158 92 L158 106 L42 142z" fill="#fab005"/>
    <circle cx="92" cy="126" r="9" fill="#f08c00"/><circle cx="126" cy="116" r="7" fill="#f08c00"/>
    <circle cx="114" cy="136" r="5" fill="#f08c00"/><circle cx="144" cy="128" r="4.5" fill="#f08c00"/>
    <circle cx="68" cy="134" r="6" fill="#f08c00"/>\`, '#fff9db'),

  egg: wrap(\`\${shadow(100, 168, 50)}
    <path d="M50 124 q-8 -30 26 -44 q38 -16 66 6 q26 22 10 46 q-16 26 -52 24 q-38 -2 -50 -32z" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <circle cx="106" cy="116" r="24" fill="#ff922b"/>
    <circle cx="104" cy="114" r="20" fill="#fcc419"/>
    <circle cx="98" cy="108" r="6" fill="#fff" opacity="0.8"/>\`, '#fff9db'),

  cake: wrap(\`\${shadow(100, 168, 52)}
    <rect x="52" y="112" width="96" height="44" rx="8" fill="#f783ac"/>
    <rect x="52" y="90" width="96" height="30" rx="8" fill="#ffb3c1"/>
    <path d="M52 118 q12 12 24 0 q12 12 24 0 q12 12 24 0 q12 12 24 0 v-8 h-96z" fill="#fff"/>
    <rect x="96" y="62" width="8" height="28" rx="4" fill="#74c0fc"/>
    <path d="M100 48 q8 8 0 16 q-8 -8 0 -16z" fill="#ffd43b"/>
    <circle cx="70" cy="102" r="3.5" fill="#ffd43b"/><circle cx="90" cy="104" r="3.5" fill="#51cf66"/>
    <circle cx="110" cy="100" r="3.5" fill="#ffd43b"/><circle cx="130" cy="104" r="3.5" fill="#51cf66"/>\`, '#fff0f6'),

  cookie: wrap(\`\${shadow(100, 168, 46)}
    <circle cx="100" cy="106" r="48" fill="#d99b59" stroke="#b47432" stroke-width="3"/>
    <g fill="#492c10">
      <circle cx="82" cy="88" r="7"/><circle cx="118" cy="84" r="6"/><circle cx="98" cy="112" r="7.5"/>
      <circle cx="122" cy="120" r="6.5"/><circle cx="76" cy="122" r="6"/><circle cx="102" cy="136" r="5"/>
    </g>\`, '#fff4e6'),

  juice: wrap(\`\${shadow(100, 168, 44)}
    <path d="M72 74 L80 156 a8 8 0 0 0 8 8 h24 a8 8 0 0 0 8 -8 L128 74 Z" fill="#ffd8a8" stroke="#ffa94d" stroke-width="3"/>
    <path d="M76 90 L82 152 a4 4 0 0 0 4 4 h28 a4 4 0 0 0 4 -4 L124 90 Z" fill="#f76707"/>
    <path d="M110 50 L102 96" stroke="#ff6b6b" stroke-width="6" stroke-linecap="round"/>
    <circle cx="68" cy="74" r="20" fill="#f76707" stroke="#fff" stroke-width="3"/>
    <circle cx="68" cy="74" r="14" fill="#ffa94d"/>\`, '#fff4e6'),

  // === BODY PARTS ===
  head: wrap(\`\${shadow(100, 168, 46)}
    <circle cx="100" cy="102" r="52" fill="none" stroke="#fcc419" stroke-width="8" stroke-dasharray="12 10"/>
    <circle cx="100" cy="102" r="42" fill="#ffd8b8"/>
    <path d="M60 92 q-2 -40 40 -40 q42 0 40 40 q-8 -18 -40 -18 q-32 0 -40 18z" fill="#6b4226"/>
    <circle cx="84" cy="100" r="6" fill="#212529"/><circle cx="116" cy="100" r="6" fill="#212529"/>
    <path d="M88 118 q12 10 24 0" stroke="#c17b4e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M46 72 q12 -12 24 2 M154 72 q-12 -12 -24 2" stroke="#f08c00" stroke-width="6" fill="none" stroke-linecap="round"/>\`, '#fff9db'),

  hair: wrap(\`\${shadow(100, 168, 46)}
    <circle cx="100" cy="108" r="40" fill="#ffd8b8"/>
    <circle cx="86" cy="108" r="5" fill="#212529"/><circle cx="114" cy="108" r="5" fill="#212529"/>
    <path d="M90 124 q10 8 20 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M52 102 q-6 -56 48 -56 q54 0 48 56 q12 36 -4 54 q-14 4 -20 -16 q-12 18 -32 16 q-22 -2 -24 -32 q-10 18 -16 -22z" fill="#a0522d"/>
    <circle cx="132" cy="72" r="10" fill="#f783ac"/><circle cx="132" cy="72" r="4" fill="#ffd43b"/>
    <g fill="#ffd43b"><path d="M54 54 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3z"/><path d="M148 48 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z"/></g>\`, '#fff0f6'),

  eyes: wrap(\`\${shadow(100, 168, 48)}
    <g>
      <ellipse cx="68" cy="100" rx="28" ry="32" fill="#fff" stroke="#ced4da" stroke-width="3"/>
      <circle cx="70" cy="102" r="16" fill="#339af0"/>
      <circle cx="72" cy="104" r="9" fill="#1864ab"/>
      <circle cx="76" cy="98" r="5" fill="#fff"/><circle cx="68" cy="108" r="2.5" fill="#fff"/>
      <path d="M46 72 q24 -14 46 0" stroke="#5c3818" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>
    <g>
      <ellipse cx="132" cy="100" rx="28" ry="32" fill="#fff" stroke="#ced4da" stroke-width="3"/>
      <circle cx="130" cy="102" r="16" fill="#339af0"/>
      <circle cx="128" cy="104" r="9" fill="#1864ab"/>
      <circle cx="132" cy="98" r="5" fill="#fff"/><circle cx="124" cy="108" r="2.5" fill="#fff"/>
      <path d="M110 72 q24 -14 46 0" stroke="#5c3818" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>\`, '#e7f5ff'),

  ears: wrap(\`\${shadow(100, 168, 46)}
    <ellipse cx="100" cy="106" rx="36" ry="40" fill="#ffd8b8"/>
    <path d="M64 108 q-24 -6 -20 -36 q20 -4 30 14z" fill="#ffd8b8" stroke="#e0a878" stroke-width="3"/>
    <path d="M68 98 q-10 -4 -8 -18 q8 -3 14 6z" fill="#ffb3a0"/>
    <path d="M136 108 q24 -6 20 -36 q-20 -4 -30 14z" fill="#ffd8b8" stroke="#e0a878" stroke-width="3"/>
    <path d="M132 98 q10 -4 8 -18 q-8 -3 -14 6z" fill="#ffb3a0"/>
    <path d="M26 84 q-8 16 0 32 M18 76 q-12 24 0 48" stroke="#339af0" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M174 84 q8 16 0 32 M182 76 q12 24 0 48" stroke="#339af0" stroke-width="4.5" fill="none" stroke-linecap="round"/>\`, '#f8f9fa'),

  nose: wrap(\`\${shadow(100, 168, 44)}
    <ellipse cx="100" cy="106" rx="44" ry="46" fill="#ffd8b8"/>
    <circle cx="80" cy="88" r="6" fill="#212529"/><circle cx="120" cy="88" r="6" fill="#212529"/>
    <circle cx="100" cy="110" r="14" fill="#ff8787" stroke="#e03131" stroke-width="3"/>
    <circle cx="97" cy="107" r="4" fill="#fff" opacity="0.8"/>
    <path d="M88 132 q12 8 24 0" stroke="#c17b4e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="100" cy="110" r="24" fill="none" stroke="#fcc419" stroke-width="4" stroke-dasharray="6 6"/>\`, '#fff4e6'),

  mouth: wrap(\`\${shadow(100, 168, 44)}
    <ellipse cx="100" cy="108" rx="48" ry="38" fill="#ffd8b8"/>
    <path d="M66 100 q34 40 68 0 q-34 4 -68 0z" fill="#c92a2a" stroke="#a61e4d" stroke-width="3"/>
    <path d="M72 102 q28 4 56 0 v6 q-28 4 -56 0z" fill="#fff"/>
    <path d="M88 122 q12 -10 24 0 q-12 14 -24 0z" fill="#ff8787"/>\`, '#fff0f6'),

  teeth: wrap(\`\${shadow(100, 168, 44)}
    <ellipse cx="100" cy="108" rx="48" ry="34" fill="#ffd8b8"/>
    <path d="M60 104 q40 32 80 0 q-40 -10 -80 0z" fill="#c92a2a"/>
    <g fill="#fff" stroke="#dee2e6" stroke-width="1.5">
      <rect x="74" y="98" width="12" height="12" rx="3"/>
      <rect x="88" y="98" width="12" height="13" rx="3"/>
      <rect x="102" y="98" width="12" height="13" rx="3"/>
      <rect x="116" y="98" width="12" height="12" rx="3"/>
    </g>
    <g fill="#ffd43b">
      <path d="M64 78 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3z"/>
      <path d="M136 78 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3z"/>
    </g>\`, '#ebfbee'),

  arms: wrap(\`\${shadow(100, 168, 48)}
    <rect x="82" y="80" width="36" height="54" rx="10" fill="#ff6b6b"/>
    <circle cx="100" cy="62" r="16" fill="#ffd8b8"/>
    <path d="M82 92 L36 98" stroke="#ffd8b8" stroke-width="16" stroke-linecap="round"/>
    <path d="M118 92 L164 98" stroke="#ffd8b8" stroke-width="16" stroke-linecap="round"/>
    <rect x="74" y="86" width="14" height="16" rx="6" fill="#fa5252"/>
    <rect x="112" y="86" width="14" height="16" rx="6" fill="#fa5252"/>
    <path d="M42 78 l-10 20 l22 -4" stroke="#ffd43b" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M158 78 l10 20 l-22 -4" stroke="#ffd43b" stroke-width="4" fill="none" stroke-linecap="round"/>\`, '#fff5f5'),

  hands: wrap(\`\${shadow(100, 168, 46)}
    <g transform="translate(48, 60)">
      <path d="M12 50 v-26 a5 5 0 0 1 10 0 v20 a5 5 0 0 1 10 0 v-24 a5 5 0 0 1 10 0 v24 a5 5 0 0 1 10 0 v-20 a5 5 0 0 1 10 0 v32 q0 24 -24 24 h-6 q-20 0 -20 -24z" fill="#ffd8b8" stroke="#e0a878" stroke-width="3"/>
      <path d="M12 44 q-12 0 -12 12 q0 12 12 12" stroke="#e0a878" stroke-width="3" fill="#ffd8b8"/>
    </g>
    <g transform="translate(108, 60)">
      <path d="M42 50 v-26 a5 5 0 0 0 -10 0 v20 a5 5 0 0 0 -10 0 v-24 a5 5 0 0 0 -10 0 v24 a5 5 0 0 0 -10 0 v-20 a5 5 0 0 0 -10 0 v32 q0 24 24 24 h6 q20 0 20 -24z" fill="#ffd8b8" stroke="#e0a878" stroke-width="3"/>
      <path d="M42 44 q12 0 12 12 q0 12 -12 12" stroke="#e0a878" stroke-width="3" fill="#ffd8b8"/>
    </g>\`, '#fff4e6'),

  legs: wrap(\`\${shadow(100, 168, 46)}
    <rect x="74" y="60" width="52" height="30" rx="8" fill="#339af0"/>
    <path d="M86 90 v50 M114 90 v50" stroke="#ffd8b8" stroke-width="16" stroke-linecap="round"/>
    <ellipse cx="80" cy="144" rx="14" ry="8" fill="#ff6b6b"/>
    <ellipse cx="120" cy="144" rx="14" ry="8" fill="#ff6b6b"/>
    <rect x="78" y="86" width="16" height="12" rx="4" fill="#228be6"/>
    <rect x="106" y="86" width="16" height="12" rx="4" fill="#228be6"/>\`, '#e7f5ff'),

  feet: wrap(\`\${shadow(100, 168, 46)}
    <g transform="translate(60, 80)">
      <path d="M16 10 q14 0 16 30 q2 24 -12 24 h-6 q-16 0 -14 -24z" fill="#ffd8b8" stroke="#e0a878" stroke-width="2"/>
      <circle cx="28" cy="8" r="5" fill="#ffd8b8"/><circle cx="20" cy="6" r="4" fill="#ffd8b8"/><circle cx="13" cy="7" r="3.5" fill="#ffd8b8"/><circle cx="7" cy="9" r="3" fill="#ffd8b8"/><circle cx="2" cy="12" r="2.5" fill="#ffd8b8"/>
    </g>
    <g transform="translate(104, 80)">
      <path d="M16 10 q14 0 14 24 q2 24 -14 24 h-6 q-14 0 -12 -24z" fill="#ffd8b8" stroke="#e0a878" stroke-width="2"/>
      <circle cx="4" cy="8" r="5" fill="#ffd8b8"/><circle cx="12" cy="6" r="4" fill="#ffd8b8"/><circle cx="19" cy="7" r="3.5" fill="#ffd8b8"/><circle cx="25" cy="9" r="3" fill="#ffd8b8"/><circle cx="30" cy="12" r="2.5" fill="#ffd8b8"/>
    </g>\`, '#fff4e6'),

  tummy: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="100" cy="112" r="44" fill="#ffd8b8"/>
    <path d="M60 84 q40 -20 80 0 v-16 h-80z" fill="#4dabf7"/>
    <circle cx="100" cy="120" r="5" fill="#e0a878"/>
    <path d="M96 118 q4 -4 8 0" stroke="#c17b4e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="66" cy="116" rx="10" ry="14" fill="#ffd8b8" stroke="#e0a878" stroke-width="2"/>
    <ellipse cx="134" cy="116" rx="10" ry="14" fill="#ffd8b8" stroke="#e0a878" stroke-width="2"/>\`, '#e7f5ff'),

  // === ACTIONS ===
  jump: wrap(\`\${shadow(100, 178, 36)}
    <circle cx="100" cy="46" r="16" fill="#ffd8b8"/>
    <path d="M100 62 v32" stroke="#ff922b" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 68 L66 50 M100 68 L134 50" stroke="#ff922b" stroke-width="10" stroke-linecap="round"/>
    <path d="M100 94 L76 118 L66 108 M100 94 L124 118 L134 108" stroke="#343a40" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M60 148 q40 -16 80 0" stroke="#ffd43b" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M70 162 q30 -12 60 0" stroke="#ffd43b" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g fill="#fcc419"><path d="M46 70 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z"/><path d="M152 70 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z"/></g>\`, '#fff9db'),

  run: wrap(\`\${shadow(100, 176, 44)}
    <circle cx="120" cy="48" r="15" fill="#ffd8b8"/>
    <path d="M112 62 L94 92" stroke="#228be6" stroke-width="16" stroke-linecap="round"/>
    <path d="M106 70 L78 80 M106 70 L136 60" stroke="#228be6" stroke-width="9" stroke-linecap="round"/>
    <path d="M94 92 L64 108 L52 132 M94 92 L124 114 L144 110" stroke="#343a40" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <g stroke="#adb5bd" stroke-width="5" stroke-linecap="round">
      <path d="M46 92 h-20"/><path d="M40 106 h-18"/><path d="M48 120 h-16"/>
    </g>\`, '#e7f5ff'),

  stop: wrap(\`\${shadow(100, 168, 48)}
    <polygon points="62,40 138,40 174,76 174,124 138,160 62,160 26,124 26,76" fill="#e03131" stroke="#fff" stroke-width="6"/>
    <path d="M86 128 v-28 a5 5 0 0 1 10 0 v20 a5 5 0 0 1 10 0 v-24 a5 5 0 0 1 10 0 v24 a5 5 0 0 1 10 0 v-18 a5 5 0 0 1 10 0 v28 q0 18 -18 18 h-4 q-18 0 -18 -18z" fill="#fff"/>
    <path d="M86 122 q-8 0 -8 10 q0 10 8 10" stroke="#fff" stroke-width="3" fill="#fff"/>\`, '#fff5f5'),

  clap: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="74" cy="94" r="18" fill="#ffd8b8" transform="rotate(-30 74 94)"/>
    <circle cx="126" cy="94" r="18" fill="#ffd8b8" transform="rotate(30 126 94)"/>
    <path d="M60 120 L84 94" stroke="#ffd8b8" stroke-width="16" stroke-linecap="round"/>
    <path d="M140 120 L116 94" stroke="#ffd8b8" stroke-width="16" stroke-linecap="round"/>
    <g stroke="#ffd43b" stroke-width="5" stroke-linecap="round">
      <path d="M100 60 v-16"/><path d="M80 68 l-10 -10"/><path d="M120 68 l10 -10"/>
      <path d="M72 96 h-14"/><path d="M128 96 h14"/>
    </g>
    <g fill="#ffd43b"><circle cx="100" cy="78" r="4"/><circle cx="100" cy="114" r="4"/></g>\`, '#fff9db'),

  touch: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="130" cy="74" r="18" fill="#fcc419"/>
    <circle cx="130" cy="74" r="28" fill="none" stroke="#ffe066" stroke-width="4" stroke-dasharray="8 6"/>
    <path d="M54 148 L96 106 L124 78" stroke="#ffd8b8" stroke-width="16" stroke-linecap="round"/>
    <ellipse cx="122" cy="80" rx="8" ry="10" fill="#ffd8b8"/>
    <path d="M88 114 q10 6 16 -6" stroke="#e0a878" stroke-width="3" fill="none"/>\`, '#fff9db'),

  sit: wrap(\`\${shadow(100, 176, 44)}
    <rect x="94" y="112" width="40" height="8" rx="3" fill="#8c5828"/>
    <rect x="98" y="120" width="6" height="34" fill="#5c3818"/><rect x="124" y="120" width="6" height="34" fill="#5c3818"/>
    <circle cx="114" cy="56" r="15" fill="#ffd8b8"/>
    <path d="M114 72 v34" stroke="#ff922b" stroke-width="16" stroke-linecap="round"/>
    <path d="M114 106 h-28 v32" stroke="#343a40" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M58 72 v30 M50 92 l8 12 l8 -12" stroke="#228be6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>\`, '#e7f5ff'),

  stand: wrap(\`\${shadow(100, 176, 44)}
    <circle cx="100" cy="46" r="15" fill="#ffd8b8"/>
    <path d="M100 62 v48" stroke="#20c997" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 70 L72 84 M100 70 L128 84" stroke="#20c997" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 110 v36" stroke="#343a40" stroke-width="10" stroke-linecap="round"/>
    <path d="M52 110 v-30 M44 90 l8 -12 l8 12" stroke="#40c057" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M148 110 v-30 M140 90 l8 -12 l8 12" stroke="#40c057" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>\`, '#ebfbee'),

  turn: wrap(\`\${shadow(100, 174, 44)}
    <circle cx="100" cy="62" r="15" fill="#ffd8b8"/>
    <path d="M100 78 v40" stroke="#f783ac" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 86 L74 98 M100 86 L126 98" stroke="#f783ac" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 118 v26" stroke="#343a40" stroke-width="10" stroke-linecap="round"/>
    <path d="M50 114 a52 24 0 1 0 100 0" stroke="#845ef7" stroke-width="7" fill="none" stroke-linecap="round"/>
    <polygon points="152,106 162,118 144,122" fill="#845ef7"/>\`, '#f3f0ff'),

  dance: wrap(\`\${shadow(100, 178, 44)}
    <circle cx="100" cy="48" r="15" fill="#ffd8b8"/>
    <path d="M100 64 v34" stroke="#845ef7" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 70 L68 54 M100 70 L132 86" stroke="#845ef7" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 98 L80 134 M100 98 L122 130" stroke="#343a40" stroke-width="9" stroke-linecap="round"/>
    <g fill="#fcc419">
      <path d="M54 78 v-16 h10 v4 h-6 v12z"/><circle cx="54" cy="78" r="4"/>
      <path d="M144 58 v-16 h10 v4 h-6 v12z"/><circle cx="144" cy="58" r="4"/>
    </g>\`, '#f3f0ff'),

  sleep: wrap(\`\${shadow(100, 172, 52)}
    <rect x="42" y="108" width="116" height="42" rx="8" fill="#4dabf7"/>
    <rect x="42" y="96" width="38" height="22" rx="8" fill="#fff"/>
    <ellipse cx="64" cy="104" rx="14" ry="12" fill="#ffd8b8"/>
    <path d="M58 104 q6 4 12 0" stroke="#5c3818" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M42 120 h116 v30 h-116z" fill="#339af0" rx="4"/>
    <path d="M136 50 q-8 -14 6 -24 q-14 4 -12 24z" fill="#ffd43b"/>
    <g fill="#74c0fc" font-family="'Baloo 2',sans-serif" font-weight="800">
      <text x="132" y="76" font-size="20">z</text><text x="148" y="60" font-size="28">Z</text>
    </g>\`, '#e7f5ff'),

  eat: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="86" cy="88" r="34" fill="#ffd8b8"/>
    <circle cx="76" cy="84" r="5" fill="#212529"/>
    <path d="M78 98 q14 12 24 2" stroke="#c17b4e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="126" cy="106" r="22" fill="#ff4d4f"/>
    <path d="M126 84 v-8" stroke="#5c3818" stroke-width="4" stroke-linecap="round"/>
    <circle cx="112" cy="102" r="8" fill="#ffd8b8"/>
    <circle cx="114" cy="108" r="2" fill="#ff4d4f"/><circle cx="108" cy="116" r="2" fill="#ff4d4f"/>\`, '#fff5f5'),

  drink: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="86" cy="86" r="32" fill="#ffd8b8"/>
    <circle cx="76" cy="82" r="5" fill="#212529"/>
    <path d="M78 96 q8 4 14 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="110" y="88" width="34" height="56" rx="6" fill="#a5d8ff" stroke="#339af0" stroke-width="3"/>
    <rect x="112" y="102" width="30" height="40" rx="4" fill="#4dabf7"/>
    <path d="M96 96 L124 64 L124 116" stroke="#ff6b6b" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>\`, '#e7f5ff'),
};

// === COLORS (Explicit paint splash with high-contrast outlines) ===
const colorArt = (hex: string, border = 'none', strokeWidth = 0): string =>
  wrap(\`\${shadow(100, 162, 46)}
    <path d="M100 60 q30 -16 48 10 q18 26 -6 44 q-8 28 -34 26 q-28 -2 -38 -22 q-18 -26 10 -44 q8 -8 20 -14z" fill="\${hex}" stroke="\${border}" stroke-width="\${strokeWidth}"/>
    <circle cx="78" cy="80" r="8" fill="#fff" opacity="0.45"/>
    <circle cx="136" cy="130" r="7" fill="\${hex}" stroke="\${border}" stroke-width="\${strokeWidth > 0 ? 1.5 : 0}"/>
    <circle cx="60" cy="124" r="5" fill="\${hex}" stroke="\${border}" stroke-width="\${strokeWidth > 0 ? 1.5 : 0}"/>
    <circle cx="140" cy="74" r="6" fill="\${hex}" stroke="\${border}" stroke-width="\${strokeWidth > 0 ? 1.5 : 0}"/>\`);

art['red'] = colorArt('#e03131');
art['blue'] = colorArt('#1971c2');
art['yellow'] = colorArt('#fcc419');
art['green'] = colorArt('#2f9e44');
art['orange'] = colorArt('#f76707');
art['purple'] = colorArt('#845ef7');
art['pink'] = colorArt('#f06595');
art['black'] = colorArt('#212529');
art['white'] = colorArt('#ffffff', '#868e96', 3.5);
art['brown'] = colorArt('#7b3f00');

// === NUMBERS 1-10 (Numeral + Countable Stars) ===
const starSvg = (cx: number, cy: number, r = 10, fill = '#ffd43b') =>
  \`<polygon points="\${cx},\${cy - r} \${cx + r * 0.35},\${cy - r * 0.3} \${cx + r * 0.95},\${cy - r * 0.25} \${cx + r * 0.45},\${cy + r * 0.2} \${cx + r * 0.65},\${cy + r * 0.8} \${cx},\${cy + r * 0.45} \${cx - r * 0.65},\${cy + r * 0.8} \${cx - r * 0.45},\${cy + r * 0.2} \${cx - r * 0.95},\${cy - r * 0.25} \${cx - r * 0.35},\${cy - r * 0.3}" fill="\${fill}" stroke="#f08c00" stroke-width="1.5"/>\`;

const numArt = (n: number, stars: string): string =>
  wrap(\`\${shadow(100, 168, 50)}
    <text x="100" y="74" text-anchor="middle" font-family="'Baloo 2','Comic Sans MS',sans-serif" font-size="56" font-weight="900" fill="#f08c00">\${n}</text>
    \${stars}\`, '#fffdf0');

art['one'] = numArt(1, starSvg(100, 126, 26));
art['two'] = numArt(2, starSvg(72, 126, 20) + starSvg(128, 126, 20));
art['three'] = numArt(3, starSvg(100, 106, 17) + starSvg(68, 138, 17) + starSvg(132, 138, 17));
art['four'] = numArt(4, starSvg(72, 110, 16) + starSvg(128, 110, 16) + starSvg(72, 142, 16) + starSvg(128, 142, 16));
art['five'] = numArt(5, starSvg(68, 106, 14) + starSvg(132, 106, 14) + starSvg(100, 126, 16) + starSvg(68, 146, 14) + starSvg(132, 146, 14));
art['six'] = numArt(6, starSvg(68, 102, 13) + starSvg(132, 102, 13) + starSvg(68, 126, 13) + starSvg(132, 126, 13) + starSvg(68, 150, 13) + starSvg(132, 150, 13));
art['seven'] = numArt(7, starSvg(55, 112, 12) + starSvg(85, 112, 12) + starSvg(115, 112, 12) + starSvg(145, 112, 12) + starSvg(70, 142, 12) + starSvg(100, 142, 12) + starSvg(130, 142, 12));
art['eight'] = numArt(8, starSvg(55, 112, 12) + starSvg(85, 112, 12) + starSvg(115, 112, 12) + starSvg(145, 112, 12) + starSvg(55, 142, 12) + starSvg(85, 142, 12) + starSvg(115, 142, 12) + starSvg(145, 142, 12));
art['nine'] = numArt(9, starSvg(66, 104, 11) + starSvg(100, 104, 11) + starSvg(134, 104, 11) + starSvg(66, 126, 11) + starSvg(100, 126, 11) + starSvg(134, 126, 11) + starSvg(66, 148, 11) + starSvg(100, 148, 11) + starSvg(134, 148, 11));
art['ten'] = numArt(10, starSvg(52, 112, 11) + starSvg(76, 112, 11) + starSvg(100, 112, 11) + starSvg(124, 112, 11) + starSvg(148, 112, 11) + starSvg(52, 140, 11) + starSvg(76, 140, 11) + starSvg(100, 140, 11) + starSvg(124, 140, 11) + starSvg(148, 140, 11));

// === LEVEL 2: FAMILY, CLOTHES, HOME, TOYS, NATURE, POLITENESS ===
const n2: Record<string, string> = {
  // Family
  mummy: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="100" cy="72" r="26" fill="#ffd8b8"/>
    <path d="M72 70 q-4 -36 28 -36 q32 0 28 36 q-4 -18 -28 -18 q-24 0 -28 18z" fill="#7a3b12"/>
    <circle cx="92" cy="72" r="4.5" fill="#212529"/><circle cx="108" cy="72" r="4.5" fill="#212529"/>
    <path d="M93 84 q7 6 14 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M70 76 q-8 26 4 36 M130 76 q8 26 -4 36" stroke="#7a3b12" stroke-width="10" stroke-linecap="round"/>
    <path d="M84 98 h32 l8 48 h-48z" fill="#f783ac"/>
    <circle cx="68" cy="80" r="3.5" fill="#fcc419"/><circle cx="132" cy="80" r="3.5" fill="#fcc419"/>\`, '#fff0f6'),

  daddy: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="100" cy="68" r="26" fill="#ffd8b8"/>
    <path d="M74 60 q4 -26 26 -26 q22 0 26 26 q-12 -12 -26 -12 q-14 0 -26 12z" fill="#343a40"/>
    <circle cx="92" cy="68" r="4.5" fill="#212529"/><circle cx="108" cy="68" r="4.5" fill="#212529"/>
    <path d="M92 82 q8 6 16 0" stroke="#c17b4e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <rect x="76" y="94" width="48" height="42" rx="8" fill="#1971c2"/>
    <path d="M94 94 l6 16 l6 -16z" fill="#ffd43b"/>\`, '#e7f5ff'),

  baby: wrap(\`\${shadow(100, 168, 36)}
    <circle cx="100" cy="88" r="34" fill="#ffd8b8"/>
    <path d="M94 54 q6 -10 12 0" stroke="#fcc419" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="88" cy="84" r="5" fill="#212529"/><circle cx="112" cy="84" r="5" fill="#212529"/>
    <circle cx="76" cy="94" r="6" fill="#ff8787" opacity="0.6"/><circle cx="124" cy="94" r="6" fill="#ff8787" opacity="0.6"/>
    <ellipse cx="100" cy="104" rx="10" ry="8" fill="#4dabf7"/>
    <circle cx="100" cy="104" r="4" fill="#fff"/>
    <path d="M72 122 q28 20 56 0" stroke="#ffd43b" stroke-width="12" fill="none" stroke-linecap="round"/>\`, '#fff9db'),

  brother: wrap(\`\${shadow(100, 168, 40)}
    <circle cx="100" cy="74" r="24" fill="#ffd8b8"/>
    <path d="M76 66 h48 v-12 q-24 -16 -48 0z" fill="#e03131"/>
    <path d="M124 66 h14" stroke="#e03131" stroke-width="6" stroke-linecap="round"/>
    <circle cx="92" cy="74" r="4.5" fill="#212529"/><circle cx="108" cy="74" r="4.5" fill="#212529"/>
    <path d="M94 86 q6 5 12 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="80" y="98" width="40" height="38" rx="8" fill="#2f9e44"/>\`, '#ebfbee'),

  sister: wrap(\`\${shadow(100, 168, 40)}
    <circle cx="100" cy="72" r="24" fill="#ffd8b8"/>
    <path d="M76 68 q0 -24 24 -24 q24 0 24 24z" fill="#d9480f"/>
    <circle cx="68" cy="74" r="12" fill="#d9480f"/><circle cx="132" cy="74" r="12" fill="#d9480f"/>
    <circle cx="74" cy="68" r="4" fill="#f06595"/><circle cx="126" cy="68" r="4" fill="#f06595"/>
    <circle cx="92" cy="72" r="4.5" fill="#212529"/><circle cx="108" cy="72" r="4.5" fill="#212529"/>
    <path d="M94 84 q6 5 12 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M84 96 h32 l8 40 h-48z" fill="#845ef7"/>\`, '#f3f0ff'),

  grandma: wrap(\`\${shadow(100, 168, 42)}
    <circle cx="100" cy="42" r="12" fill="#adb5bd"/>
    <circle cx="100" cy="74" r="26" fill="#ffd8b8"/>
    <path d="M72 74 q-2 -30 28 -30 q30 0 28 30z" fill="#ced4da"/>
    <circle cx="90" cy="74" r="8" fill="#fff" stroke="#495057" stroke-width="2.5"/>
    <circle cx="110" cy="74" r="8" fill="#fff" stroke="#495057" stroke-width="2.5"/>
    <path d="M98 74 h4" stroke="#495057" stroke-width="2.5"/>
    <circle cx="90" cy="74" r="3" fill="#212529"/><circle cx="110" cy="74" r="3" fill="#212529"/>
    <path d="M94 90 q6 4 12 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="78" y="100" width="44" height="42" rx="8" fill="#9775fa"/>\`, '#f8f9fa'),

  grandpa: wrap(\`\${shadow(100, 168, 42)}
    <circle cx="100" cy="72" r="26" fill="#ffd8b8"/>
    <path d="M74 62 q4 -20 26 -20 q22 0 26 20z" fill="#adb5bd"/>
    <circle cx="90" cy="72" r="8" fill="#fff" stroke="#495057" stroke-width="2.5"/>
    <circle cx="110" cy="72" r="8" fill="#fff" stroke="#495057" stroke-width="2.5"/>
    <path d="M98 72 h4" stroke="#495057" stroke-width="2.5"/>
    <circle cx="90" cy="72" r="3" fill="#212529"/><circle cx="110" cy="72" r="3" fill="#212529"/>
    <path d="M86 86 q14 -6 28 0 q-14 8 -28 0z" fill="#ced4da"/>
    <rect x="78" y="98" width="44" height="44" rx="8" fill="#40c057"/>\`, '#f8f9fa'),

  // Clothes
  tshirt: wrap(\`\${shadow(100, 168, 48)}
    <path d="M68 64 L42 84 L56 104 L68 94 V152 H132 V94 L144 104 L158 84 L132 64 Q116 80 100 80 Q84 80 68 64 Z" fill="#339af0"/>
    <path d="M68 110 h64 M68 126 h64 M68 142 h64" stroke="#fff" stroke-width="6"/>\`, '#e7f5ff'),

  dress: wrap(\`\${shadow(100, 168, 46)}
    <path d="M82 58 h36 l8 26 q-26 8 -52 0z" fill="#f06595"/>
    <path d="M80 84 q-20 44 -16 70 h72 q4 -26 -16 -70z" fill="#f783ac"/>
    <circle cx="90" cy="110" r="4" fill="#fff"/><circle cx="110" cy="110" r="4" fill="#fff"/>
    <circle cx="82" cy="132" r="4" fill="#fff"/><circle cx="100" cy="132" r="4" fill="#fff"/><circle cx="118" cy="132" r="4" fill="#fff"/>
    <rect x="80" y="80" width="40" height="6" fill="#d6336c"/>\`, '#fff0f6'),

  shoes: wrap(\`\${shadow(100, 168, 50)}
    <path d="M46 112 q0 -18 16 -18 h18 q14 0 16 14 l4 24 h-54z" fill="#e03131"/>
    <rect x="42" y="132" width="56" height="8" rx="3" fill="#fff"/>
    <circle cx="92" cy="124" r="8" fill="#fff"/>
    <path d="M106 112 q0 -18 16 -18 h18 q14 0 16 14 l4 24 h-54z" fill="#e03131"/>
    <rect x="102" y="132" width="56" height="8" rx="3" fill="#fff"/>
    <circle cx="152" cy="124" r="8" fill="#fff"/>\`, '#fff5f5'),

  hat: wrap(\`\${shadow(100, 168, 46)}
    <path d="M60 108 q0 -46 40 -46 q40 0 40 46z" fill="#ff922b"/>
    <ellipse cx="100" cy="112" rx="56" ry="14" fill="#f76707"/>
    <rect x="62" y="98" width="76" height="10" fill="#ffd43b"/>\`, '#fff4e6'),

  socks: wrap(\`\${shadow(100, 168, 44)}
    <g transform="translate(56, 60)">
      <path d="M14 0 h24 v48 q0 12 12 16 v14 h-16 q-20 0 -20 -30z" fill="#51cf66"/>
      <rect x="14" y="0" width="24" height="8" fill="#fff"/>
      <rect x="14" y="16" width="24" height="8" fill="#ffd43b"/>
      <rect x="14" y="32" width="24" height="8" fill="#ffd43b"/>
    </g>
    <g transform="translate(94, 60)">
      <path d="M14 0 h24 v48 q0 12 12 16 v14 h-16 q-20 0 -20 -30z" fill="#339af0"/>
      <rect x="14" y="0" width="24" height="8" fill="#fff"/>
      <rect x="14" y="16" width="24" height="8" fill="#ff6b6b"/>
      <rect x="14" y="32" width="24" height="8" fill="#ff6b6b"/>
    </g>\`, '#ebfbee'),

  // Home
  house: wrap(\`\${shadow(100, 176, 56)}
    <rect x="52" y="94" width="96" height="66" fill="#ffd8a8"/>
    <path d="M40 98 L100 46 L160 98z" fill="#e8590c"/>
    <rect x="126" y="56" width="14" height="24" fill="#a61e4d"/>
    <rect x="88" y="120" width="24" height="40" rx="3" fill="#8c5828"/>
    <circle cx="106" cy="140" r="3" fill="#ffd43b"/>
    <rect x="60" y="106" width="20" height="20" rx="3" fill="#a5d8ff" stroke="#fff" stroke-width="2"/>
    <rect x="120" y="106" width="20" height="20" rx="3" fill="#a5d8ff" stroke="#fff" stroke-width="2"/>\`, '#fff4e6'),

  bed: wrap(\`\${shadow(100, 172, 54)}
    <rect x="42" y="98" width="116" height="14" rx="4" fill="#8c5828"/>
    <rect x="44" y="80" width="10" height="74" rx="3" fill="#5c3818"/>
    <rect x="146" y="94" width="10" height="60" rx="3" fill="#5c3818"/>
    <rect x="56" y="88" width="32" height="18" rx="6" fill="#fff"/>
    <rect x="54" y="106" width="94" height="34" rx="6" fill="#4dabf7"/>
    <path d="M54 116 h94" stroke="#339af0" stroke-width="4"/>\`, '#e7f5ff'),

  table: wrap(\`\${shadow(100, 172, 52)}
    <rect x="46" y="96" width="108" height="16" rx="6" fill="#a66e38"/>
    <rect x="58" y="112" width="10" height="48" rx="3" fill="#7a4a12"/>
    <rect x="132" y="112" width="10" height="48" rx="3" fill="#7a4a12"/>
    <ellipse cx="100" cy="90" rx="18" ry="8" fill="#ff6b6b"/>\`, '#fff9db'),

  chair: wrap(\`\${shadow(100, 172, 44)}
    <rect x="70" y="52" width="10" height="64" rx="3" fill="#a66e38"/>
    <rect x="70" y="52" width="46" height="10" rx="3" fill="#a66e38"/>
    <rect x="70" y="72" width="46" height="8" rx="3" fill="#a66e38"/>
    <rect x="66" y="110" width="56" height="12" rx="4" fill="#c4884d"/>
    <rect x="72" y="122" width="8" height="40" fill="#7a4a12"/><rect x="110" y="122" width="8" height="40" fill="#7a4a12"/>\`, '#fff9db'),

  door: wrap(\`\${shadow(100, 174, 44)}
    <rect x="66" y="48" width="68" height="114" rx="6" fill="#a66e38" stroke="#7a4a12" stroke-width="4"/>
    <rect x="74" y="58" width="52" height="42" rx="4" fill="#c4884d"/>
    <rect x="74" y="108" width="52" height="44" rx="4" fill="#c4884d"/>
    <circle cx="120" cy="116" r="5" fill="#fcc419"/>\`, '#fff4e6'),

  window: wrap(\`\${shadow(100, 168, 46)}
    <rect x="54" y="56" width="92" height="92" rx="6" fill="#a5d8ff" stroke="#8c5828" stroke-width="8"/>
    <path d="M100 56 v92 M54 102 h92" stroke="#8c5828" stroke-width="6"/>
    <circle cx="132" cy="74" r="10" fill="#fcc419"/>
    <path d="M72 84 q8 -8 16 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>\`, '#e7f5ff'),

  bedroom: wrap(\`\${shadow(100, 168, 52)}
    <rect x="40" y="80" width="10" height="70" rx="4" fill="#8c5828"/>
    <rect x="150" y="100" width="10" height="50" rx="4" fill="#8c5828"/>
    <rect x="46" y="115" width="110" height="28" rx="6" fill="#4dabf7"/>
    <rect x="48" y="102" width="36" height="18" rx="6" fill="#ffffff" stroke="#dee2e6" stroke-width="1.5"/>
    <path d="M46 120 h110 v22 h-110 z" fill="#339af0" rx="4"/>
    <g fill="#ffd43b">
      <polygon points="100,126 102,132 108,132 103,136 105,142 100,138 95,142 97,136 92,132 98,132"/>
    </g>
    <rect x="146" y="138" width="8" height="18" rx="2" fill="#5c3818"/>
    <rect x="46" y="138" width="8" height="18" rx="2" fill="#5c3818"/>\`, '#f8f9fa'),

  kitchen: wrap(\`\${shadow(100, 168, 50)}
    <rect x="52" y="100" width="96" height="54" rx="10" fill="#ced4da"/>
    <rect x="62" y="108" width="76" height="40" rx="6" fill="#f1f3f5"/>
    <rect x="56" y="76" width="88" height="24" rx="4" fill="#ff6b6b"/>
    <rect x="50" y="70" width="100" height="10" rx="5" fill="#fa5252"/>
    <rect x="94" y="60" width="12" height="12" rx="3" fill="#c92a2a"/>
    <path d="M80 52 q-6 -10 0 -18 M100 50 q6 -10 0 -18 M120 52 q-6 -10 0 -18" stroke="#adb5bd" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="80" cy="128" r="6" fill="#ff922b"/><circle cx="120" cy="128" r="6" fill="#ff922b"/>\`, '#fff5f5'),

  garden: wrap(\`\${shadow(100, 172, 54)}
    <rect x="20" y="130" width="160" height="34" rx="10" fill="#51cf66"/>
    <g fill="#ffd8a8" stroke="#d9480f" stroke-width="2">
      <rect x="40" y="90" width="14" height="46" rx="3"/>
      <rect x="65" y="90" width="14" height="46" rx="3"/>
      <rect x="90" y="90" width="14" height="46" rx="3"/>
      <rect x="115" y="90" width="14" height="46" rx="3"/>
      <rect x="140" y="90" width="14" height="46" rx="3"/>
      <rect x="34" y="106" width="128" height="10" rx="2"/>
    </g>
    <circle cx="56" cy="140" r="10" fill="#ff6b6b"/><circle cx="56" cy="140" r="4" fill="#ffd43b"/>
    <circle cx="136" cy="140" r="10" fill="#f06595"/><circle cx="136" cy="140" r="4" fill="#ffd43b"/>
    <g transform="translate(90, 56)">
      <circle cx="0" cy="0" r="5" fill="#74c0fc"/>
      <circle cx="-6" cy="-4" r="5" fill="#ff8787"/><circle cx="6" cy="-4" r="5" fill="#ff8787"/>
    </g>\`, '#ebfbee'),

  // Toys
  ball: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="100" cy="104" r="46" fill="#ffd43b"/>
    <path d="M100 58 a46 46 0 0 1 0 92 a32 32 0 0 1 0 -92z" fill="#e03131"/>
    <path d="M100 58 a46 46 0 0 0 0 92 a32 32 0 0 0 0 -92z" fill="#1971c2"/>
    <circle cx="100" cy="104" r="12" fill="#fff"/>\`, '#fff9db'),

  doll: wrap(\`\${shadow(100, 168, 40)}
    <circle cx="100" cy="68" r="22" fill="#ffd8b8"/>
    <path d="M78 62 q0 -22 22 -22 q22 0 22 22z" fill="#f59f00"/>
    <circle cx="74" cy="70" r="8" fill="#f59f00"/><circle cx="126" cy="74" r="8" fill="#f59f00"/>
    <circle cx="92" cy="68" r="3.5" fill="#212529"/><circle cx="108" cy="68" r="3.5" fill="#212529"/>
    <path d="M94 78 q6 4 12 0" stroke="#c17b4e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M82 90 h36 l10 52 h-56z" fill="#f783ac"/>\`, '#fff0f6'),

  car: wrap(\`\${shadow(100, 168, 52)}
    <path d="M42 118 q0 -24 24 -26 l16 -18 q4 -6 14 -6 h28 q10 0 14 6 l16 18 q24 2 24 26 v12 h-136z" fill="#e03131"/>
    <path d="M84 74 h32 l14 18 h-60z" fill="#a5d8ff"/>
    <circle cx="70" cy="132" r="14" fill="#343a40"/><circle cx="70" cy="132" r="6" fill="#dee2e6"/>
    <circle cx="130" cy="132" r="14" fill="#343a40"/><circle cx="130" cy="132" r="6" fill="#dee2e6"/>
    <circle cx="152" cy="116" r="5" fill="#ffd43b"/>\`, '#fff5f5'),

  teddy: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="74" cy="66" r="14" fill="#a66e38"/><circle cx="74" cy="66" r="7" fill="#deb887"/>
    <circle cx="126" cy="66" r="14" fill="#a66e38"/><circle cx="126" cy="66" r="7" fill="#deb887"/>
    <circle cx="100" cy="88" r="30" fill="#a66e38"/>
    <ellipse cx="100" cy="96" rx="14" ry="10" fill="#deb887"/>
    <circle cx="90" cy="82" r="4.5" fill="#212529"/><circle cx="110" cy="82" r="4.5" fill="#212529"/>
    <ellipse cx="100" cy="92" rx="4.5" ry="3.5" fill="#212529"/>
    <ellipse cx="100" cy="126" rx="26" ry="22" fill="#a66e38"/>
    <ellipse cx="100" cy="128" rx="16" ry="14" fill="#deb887"/>\`, '#fff4e6'),

  blocks: wrap(\`\${shadow(100, 168, 50)}
    <rect x="52" y="114" width="44" height="44" rx="6" fill="#e03131"/>
    <text x="74" y="146" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-size="28" font-weight="900" fill="#fff">A</text>
    <rect x="104" y="114" width="44" height="44" rx="6" fill="#1971c2"/>
    <text x="126" y="146" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-size="28" font-weight="900" fill="#fff">B</text>
    <rect x="78" y="66" width="44" height="44" rx="6" fill="#2f9e44"/>
    <text x="100" y="98" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-size="28" font-weight="900" fill="#fff">C</text>\`, '#fff9db'),

  book: wrap(\`\${shadow(100, 168, 50)}
    <path d="M40 82 q56 -12 60 8 q4 -20 60 -8 v52 q-56 -12 -60 8 q-4 -20 -60 -8 z" fill="#ffffff" stroke="#dee2e6" stroke-width="2"/>
    <path d="M36 84 q60 -12 64 8 v52 q-4 -20 -64 -8 z" fill="#4dabf7"/>
    <path d="M164 84 q-60 -12 -64 8 v52 q4 -20 64 -8 z" fill="#339af0"/>
    <path d="M100 90 v56" stroke="#fa5252" stroke-width="4" stroke-linecap="round"/>
    <polygon points="100,150 96,158 100,155 104,158" fill="#fa5252"/>
    <circle cx="68" cy="112" r="12" fill="#ffd43b"/>
    <g stroke="#adb5bd" stroke-width="3" stroke-linecap="round">
      <path d="M120 106 h26"/><path d="M120 118 h22"/><path d="M120 130 h26"/>
    </g>\`, '#e7f5ff'),

  cup: wrap(\`\${shadow(100, 168, 44)}
    <path d="M60 80 h80 v50 a40 40 0 0 1 -80 0 z" fill="#ff922b"/>
    <ellipse cx="100" cy="80" rx="40" ry="12" fill="#ffe8cc"/>
    <ellipse cx="100" cy="80" rx="34" ry="9" fill="#8c5828"/>
    <path d="M140 92 q22 0 22 18 q0 18 -22 18" stroke="#ff922b" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="86" cy="106" r="4.5" fill="#ffffff"/><circle cx="114" cy="106" r="4.5" fill="#ffffff"/>
    <circle cx="88" cy="107" r="2.5" fill="#5c3818"/><circle cx="116" cy="107" r="2.5" fill="#5c3818"/>
    <path d="M92 118 q8 6 16 0" stroke="#5c3818" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M90 60 q-6 -10 0 -16 M108 58 q6 -10 0 -16" stroke="#adb5bd" stroke-width="3.5" stroke-linecap="round" fill="none"/>\`, '#fff4e6'),

  // Nature
  sun: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="100" r="36" fill="#ffd43b"/>
    <g stroke="#fcc419" stroke-width="8" stroke-linecap="round">
      <path d="M100 36 v-16"/><path d="M100 164 v16"/><path d="M36 100 h-16"/><path d="M164 100 h16"/>
      <path d="M54 54 l-12 -12"/><path d="M146 54 l12 -12"/><path d="M54 146 l-12 12"/><path d="M146 146 l12 12"/>
    </g>
    <circle cx="88" cy="94" r="5" fill="#e8590c"/><circle cx="112" cy="94" r="5" fill="#e8590c"/>
    <path d="M88 108 q12 10 24 0" stroke="#e8590c" stroke-width="4" fill="none" stroke-linecap="round"/>\`, '#fff9db'),

  cloud: wrap(\`\${shadow(100, 168, 48)}
    <g fill="#fff" stroke="#dee2e6" stroke-width="3">
      <ellipse cx="100" cy="112" rx="50" ry="28"/>
      <circle cx="72" cy="96" r="24"/><circle cx="106" cy="82" r="28"/><circle cx="134" cy="100" r="22"/>
    </g>\`, '#e7f5ff'),

  rain: wrap(\`\${shadow(100, 168, 48)}
    <g fill="#adb5bd">
      <ellipse cx="100" cy="80" rx="46" ry="26"/>
      <circle cx="74" cy="68" r="22"/><circle cx="106" cy="56" r="24"/><circle cx="130" cy="72" r="18"/>
    </g>
    <g stroke="#339af0" stroke-width="6" stroke-linecap="round">
      <path d="M72 114 l-8 24"/><path d="M100 118 l-8 24"/><path d="M128 114 l-8 24"/>
    </g>\`, '#e7f5ff'),

  tree: wrap(\`\${shadow(100, 172, 44)}
    <rect x="90" y="110" width="20" height="54" rx="4" fill="#8c5828"/>
    <circle cx="100" cy="80" r="42" fill="#40c057"/>
    <circle cx="70" cy="96" r="26" fill="#51cf66"/><circle cx="130" cy="96" r="26" fill="#51cf66"/>
    <circle cx="86" cy="72" r="6" fill="#ff4d4f"/><circle cx="116" cy="88" r="6" fill="#ff4d4f"/><circle cx="100" cy="60" r="6" fill="#ff4d4f"/>\`, '#ebfbee'),

  flower: wrap(\`\${shadow(100, 172, 40)}
    <path d="M100 160 v-56" stroke="#2b8a3e" stroke-width="7" stroke-linecap="round"/>
    <path d="M100 130 q-20 -6 -22 -22 q20 4 22 22z" fill="#40c057"/>
    <g fill="#f06595">
      <circle cx="100" cy="70" r="16"/><circle cx="76" cy="88" r="16"/><circle cx="124" cy="88" r="16"/>
      <circle cx="86" cy="110" r="16"/><circle cx="114" cy="110" r="16"/>
    </g>
    <circle cx="100" cy="92" r="14" fill="#fcc419"/>\`, '#fff0f6'),

  rainbow: wrap(\`\${shadow(100, 172, 54)}
    <g fill="none" stroke-linecap="round">
      <path d="M38 140 a62 62 0 0 1 124 0" stroke="#e03131" stroke-width="10"/>
      <path d="M48 140 a52 52 0 0 1 104 0" stroke="#f76707" stroke-width="10"/>
      <path d="M58 140 a42 42 0 0 1 84 0" stroke="#ffd43b" stroke-width="10"/>
      <path d="M68 140 a32 32 0 0 1 64 0" stroke="#40c057" stroke-width="10"/>
      <path d="M78 140 a22 22 0 0 1 44 0" stroke="#228be6" stroke-width="10"/>
    </g>
    <g fill="#fff"><ellipse cx="38" cy="144" rx="20" ry="14"/><ellipse cx="162" cy="144" rx="20" ry="14"/></g>\`, '#e7f5ff'),

  star: wrap(\`\${shadow(100, 168, 46)}
    \${starSvg(100, 102, 52, '#fcc419')}\`, '#fff9db'),

  moon: wrap(\`\${shadow(100, 168, 44)}
    <path d="M128 42 a60 60 0 1 0 28 114 a48 48 0 1 1 -28 -114z" fill="#ffd43b"/>
    <path d="M142 56 l-18 -18 l-6 24z" fill="#4dabf7"/>
    <circle cx="118" cy="38" r="4" fill="#fff"/>
    <g fill="#ffd43b"><circle cx="152" cy="80" r="3"/><circle cx="58" cy="136" r="4"/></g>\`, '#e7f5ff'),

  sunny: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="100" r="38" fill="#ffd43b"/>
    <g stroke="#fcc419" stroke-width="7" stroke-linecap="round">
      <path d="M100 34 v-16"/><path d="M100 166 v16"/><path d="M34 100 h-16"/><path d="M166 100 h16"/>
      <path d="M52 52 l-12 -12"/><path d="M148 52 l12 -12"/><path d="M52 148 l-12 12"/><path d="M148 148 l12 12"/>
    </g>
    <circle cx="86" cy="94" r="5" fill="#e8590c"/><circle cx="114" cy="94" r="5" fill="#e8590c"/>
    <circle cx="76" cy="106" r="6" fill="#ffa94d" opacity="0.6"/><circle cx="124" cy="106" r="6" fill="#ffa94d" opacity="0.6"/>
    <path d="M86 108 q14 12 28 0" stroke="#e8590c" stroke-width="4" fill="none" stroke-linecap="round"/>\`, '#fff9db'),

  windy: wrap(\`\${shadow(100, 168, 48)}
    <g stroke="#74c0fc" stroke-width="6" fill="none" stroke-linecap="round">
      <path d="M40 80 h70 q18 0 18 -16 q0 -16 -18 -16 q-14 0 -14 12"/>
      <path d="M30 110 h90 q20 0 20 -18 q0 -18 -20 -18 q-14 0 -14 14"/>
      <path d="M50 140 h60 q16 0 16 -14 q0 -14 -16 -14"/>
    </g>
    <g fill="#51cf66">
      <path d="M136 70 q12 -6 18 6 q-12 6 -18 -6z"/>
      <path d="M146 126 q14 -6 20 8 q-14 6 -20 -8z"/>
    </g>
    <g fill="#ffa94d">
      <path d="M72 124 q-12 8 -8 18 q12 -8 8 -18z"/>
    </g>\`, '#e7f5ff'),

  snowy: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="132" r="34" fill="#ffffff" stroke="#dee2e6" stroke-width="2"/>
    <circle cx="100" cy="84" r="24" fill="#ffffff" stroke="#dee2e6" stroke-width="2"/>
    <circle cx="92" cy="78" r="3.5" fill="#212529"/><circle cx="108" cy="78" r="3.5" fill="#212529"/>
    <path d="M100 84 l14 4 l-14 3 z" fill="#ff922b"/>
    <circle cx="100" cy="120" r="3" fill="#212529"/><circle cx="100" cy="136" r="3" fill="#212529"/>
    <rect x="80" y="98" width="40" height="10" rx="4" fill="#fa5252"/>
    <rect x="108" y="104" width="10" height="20" rx="3" fill="#fa5252"/>
    <g fill="#74c0fc">
      <circle cx="48" cy="60" r="4"/><circle cx="152" cy="70" r="5"/><circle cx="56" cy="116" r="4"/><circle cx="150" cy="130" r="4"/>
    </g>\`, '#e7f5ff'),

  // Politeness
  hello: wrap(\`\${shadow(100, 168, 44)}
    <path d="M72 136 v-34 a6 6 0 0 1 12 0 v24 a6 6 0 0 1 12 0 v-28 a6 6 0 0 1 12 0 v28 a6 6 0 0 1 12 0 v-22 a6 6 0 0 1 12 0 v34 q0 24 -24 24 h-6 q-20 0 -20 -24z" fill="#ffd8b8" stroke="#e0a878" stroke-width="3"/>
    <path d="M72 128 q-12 0 -12 12 q0 12 12 12" stroke="#e0a878" stroke-width="3" fill="#ffd8b8"/>
    <path d="M50 78 q-10 16 0 32 M150 78 q10 16 0 32" stroke="#f08c00" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="102" cy="54" r="16" fill="#ffd43b"/>
    <circle cx="98" cy="52" r="2.5" fill="#212529"/><circle cx="106" cy="52" r="2.5" fill="#212529"/>
    <path d="M98 58 q4 4 8 0" stroke="#212529" stroke-width="2" fill="none" stroke-linecap="round"/>\`, '#fff9db'),

  goodbye: wrap(\`\${shadow(100, 168, 44)}
    <path d="M92 136 v-34 a6 6 0 0 1 12 0 v24 a6 6 0 0 1 12 0 v-28 a6 6 0 0 1 12 0 v28 a6 6 0 0 1 12 0 v-22 a6 6 0 0 1 12 0 v34 q0 24 -24 24 h-6 q-20 0 -20 -24z" fill="#ffd8b8" stroke="#e0a878" stroke-width="3"/>
    <rect x="42" y="98" width="28" height="34" rx="6" fill="#845ef7"/>
    <path d="M50 98 v-10 a6 6 0 0 1 12 0 v10" stroke="#7048e8" stroke-width="3" fill="none"/>
    <path d="M128 72 q14 14 0 28 M140 64 q20 20 0 40" stroke="#adb5bd" stroke-width="5" fill="none" stroke-linecap="round"/>\`, '#f3f0ff'),

  please: wrap(\`\${shadow(100, 168, 44)}
    <path d="M88 78 C 88 56 100 56 100 78 v44 h-12z" fill="#ffd8b8" stroke="#e0a878" stroke-width="2"/>
    <path d="M112 78 C 112 56 100 56 100 78 v44 h12z" fill="#ffd8b8" stroke="#e0a878" stroke-width="2"/>
    <circle cx="84" cy="50" r="7" fill="#212529"/><circle cx="86" cy="48" r="2.5" fill="#fff"/>
    <circle cx="116" cy="50" r="7" fill="#212529"/><circle cx="118" cy="48" r="2.5" fill="#fff"/>
    <path d="M94 62 q6 4 12 0" stroke="#e03131" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <g fill="#ffd43b"><path d="M54 74 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z"/><path d="M146 74 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z"/></g>\`, '#fff9db'),

  thankyou: wrap(\`\${shadow(100, 168, 48)}
    <rect x="58" y="96" width="84" height="60" rx="8" fill="#ff6b6b"/>
    <rect x="52" y="86" width="96" height="18" rx="5" fill="#fa5252"/>
    <rect x="94" y="86" width="12" height="70" fill="#ffd43b"/>
    <circle cx="88" cy="74" r="14" fill="none" stroke="#ffd43b" stroke-width="6"/>
    <circle cx="112" cy="74" r="14" fill="none" stroke="#ffd43b" stroke-width="6"/>
    <path d="M50 64 q-6 -8 2 -12 q6 -3 8 4 q2 -7 8 -4 q8 4 2 12 l-10 10z" fill="#f06595"/>
    <path d="M142 54 q-6 -8 2 -12 q6 -3 8 4 q2 -7 8 -4 q8 4 2 12 l-10 10z" fill="#f06595"/>\`, '#fff5f5'),

  sorry: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="100" cy="100" r="46" fill="#ffe3e3" stroke="#ff8787" stroke-width="3"/>
    <circle cx="84" cy="90" r="6" fill="#212529"/><circle cx="116" cy="90" r="6" fill="#212529"/>
    <path d="M84 120 q16 -12 32 0" stroke="#c92a2a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="78" cy="98" rx="4" ry="7" fill="#74c0fc"/>
    <rect x="92" y="64" width="16" height="6" rx="2" fill="#ffc9c9" transform="rotate(-15 100 67)"/>\`, '#fff5f5'),

  yes: wrap(\`\${shadow(100, 168, 50)}
    <circle cx="100" cy="100" r="50" fill="#2f9e44"/>
    <path d="M72 102 l20 22 l40 -46" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g fill="#ffd43b"><path d="M46 60 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z"/><path d="M154 60 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z"/></g>\`, '#ebfbee'),

  no: wrap(\`\${shadow(100, 168, 50)}
    <circle cx="100" cy="100" r="50" fill="#e03131"/>
    <path d="M72 72 L128 128 M128 72 L72 128" stroke="#fff" stroke-width="12" stroke-linecap="round"/>\`, '#fff5f5'),
};

Object.assign(art, n2);

// === LEVEL 3: EMOTIONS, DAILY, ADJECTIVES, VEHICLES, WILD, QUESTIONS ===
const n3: Record<string, string> = {
  // Emotions
  happy: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="102" r="48" fill="#ffd43b"/>
    <circle cx="82" cy="90" r="6.5" fill="#212529"/><circle cx="118" cy="90" r="6.5" fill="#212529"/>
    <circle cx="70" cy="104" r="8" fill="#ff8787" opacity="0.7"/><circle cx="130" cy="104" r="8" fill="#ff8787" opacity="0.7"/>
    <path d="M76 108 q24 26 48 0" stroke="#d9480f" stroke-width="5" fill="none" stroke-linecap="round"/>\`, '#fff9db'),

  sad: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="102" r="48" fill="#a5d8ff"/>
    <circle cx="82" cy="94" r="6.5" fill="#1864ab"/><circle cx="118" cy="94" r="6.5" fill="#1864ab"/>
    <path d="M76 82 q8 -8 16 0 M108 82 q8 -8 16 0" stroke="#1864ab" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M78 126 q22 -20 44 0" stroke="#1864ab" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="128" cy="116" rx="6" ry="10" fill="#339af0"/>\`, '#e7f5ff'),

  angry: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="102" r="48" fill="#ff6b6b"/>
    <path d="M68 80 l24 10 M132 80 l-24 10" stroke="#a61e4d" stroke-width="6" stroke-linecap="round"/>
    <circle cx="82" cy="98" r="6.5" fill="#212529"/><circle cx="118" cy="98" r="6.5" fill="#212529"/>
    <path d="M80 126 q20 -14 40 0" stroke="#a61e4d" stroke-width="5" fill="none" stroke-linecap="round"/>\`, '#fff5f5'),

  scared: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="102" r="48" fill="#d0bfff"/>
    <circle cx="80" cy="92" r="10" fill="#fff"/><circle cx="82" cy="94" r="5" fill="#212529"/>
    <circle cx="120" cy="92" r="10" fill="#fff"/><circle cx="118" cy="94" r="5" fill="#212529"/>
    <ellipse cx="100" cy="126" rx="10" ry="14" fill="#343a40"/>
    <ellipse cx="60" cy="116" rx="8" ry="12" fill="#ffd8b8"/><ellipse cx="140" cy="116" rx="8" ry="12" fill="#ffd8b8"/>\`, '#f3f0ff'),

  tired: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="102" r="48" fill="#ffd8b8"/>
    <path d="M74 94 q8 6 16 0 M110 94 q8 6 16 0" stroke="#5c3818" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="100" cy="122" rx="12" ry="10" fill="#8c5828"/>
    <g fill="#339af0" font-family="'Baloo 2',sans-serif" font-weight="800">
      <text x="134" y="66" font-size="20">z</text><text x="148" y="50" font-size="28">Z</text>
    </g>\`, '#fff4e6'),

  hungry: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="102" r="48" fill="#ffd43b"/>
    <circle cx="82" cy="92" r="6.5" fill="#212529"/><circle cx="118" cy="92" r="6.5" fill="#212529"/>
    <ellipse cx="100" cy="120" rx="16" ry="12" fill="#c92a2a"/>
    <path d="M94 126 q12 16 20 0z" fill="#ff8787"/>
    <ellipse cx="144" cy="46" rx="16" ry="12" fill="#fff" stroke="#adb5bd" stroke-width="2"/>
    <circle cx="144" cy="46" r="6" fill="#ff6b6b"/>\`, '#fff9db'),

  love: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="102" r="48" fill="#ffc9c9"/>
    <path d="M78 88 q-6 -8 2 -12 q6 -3 8 4 q2 -7 8 -4 q8 4 2 12 l-10 10z" fill="#e03131"/>
    <path d="M122 88 q-6 -8 2 -12 q6 -3 8 4 q2 -7 8 -4 q8 4 2 12 l-10 10z" fill="#e03131"/>
    <path d="M84 116 q16 12 32 0" stroke="#c92a2a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M100 36 C 80 18 64 36 78 52 L100 70 L122 52 C 136 36 120 18 100 36 Z" fill="#ff4d4f"/>\`, '#fff0f6'),

  // Daily
  brush: wrap(\`\${shadow(100, 168, 48)}
    <rect x="42" y="104" width="76" height="12" rx="4" fill="#339af0"/>
    <rect x="110" y="96" width="36" height="24" rx="4" fill="#1864ab"/>
    <g stroke="#fff" stroke-width="3" stroke-linecap="round">
      <path d="M116 96 v-10"/><path d="M124 96 v-10"/><path d="M132 96 v-10"/><path d="M140 96 v-10"/>
    </g>
    <path d="M114 84 q16 -8 32 0" fill="#69db7c"/>
    <ellipse cx="100" cy="136" rx="20" ry="16" fill="#fff" stroke="#ced4da" stroke-width="2"/>
    <g fill="#ffd43b"><path d="M152 70 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z"/></g>\`, '#e7f5ff'),

  wash: wrap(\`\${shadow(100, 168, 48)}
    <path d="M84 56 h32 v16 h-8 v8 h-16 v-8 h-8z" fill="#adb5bd"/>
    <path d="M100 80 v26" stroke="#339af0" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="80" cy="126" rx="16" ry="20" fill="#ffd8b8" transform="rotate(-20 80 126)"/>
    <ellipse cx="120" cy="126" rx="16" ry="20" fill="#ffd8b8" transform="rotate(20 120 126)"/>
    <circle cx="94" cy="116" r="8" fill="#fff" opacity="0.9"/>
    <circle cx="108" cy="112" r="10" fill="#fff" opacity="0.9"/>
    <circle cx="100" cy="132" r="9" fill="#fff" opacity="0.9"/>\`, '#e7f5ff'),

  read: wrap(\`\${shadow(100, 170, 48)}
    <path d="M100 68 q-32 -16 -54 0 v74 q22 -16 54 0 q32 -16 54 0 v-74 q-22 -16 -54 0z" fill="#fff" stroke="#d97706" stroke-width="4"/>
    <path d="M100 68 v74" stroke="#d97706" stroke-width="4"/>
    <circle cx="74" cy="96" r="10" fill="#ffd43b"/>
    <polygon points="120,86 136,86 142,102 114,102" fill="#ff6b6b"/>\`, '#fffbeb'),

  play: wrap(\`\${shadow(100, 168, 44)}
    <rect x="52" y="116" width="34" height="34" rx="4" fill="#e03131"/>
    <text x="69" y="142" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-size="22" font-weight="900" fill="#fff">A</text>
    <rect x="90" y="116" width="34" height="34" rx="4" fill="#1971c2"/>
    <circle cx="144" cy="134" r="16" fill="#ffd43b"/>
    <path d="M144 118 a16 16 0 0 1 0 32z" fill="#ff6b6b"/>
    <circle cx="100" cy="68" r="16" fill="#ffd8b8"/>
    <path d="M100 84 v24" stroke="#40c057" stroke-width="14" stroke-linecap="round"/>\`, '#ebfbee'),

  draw: wrap(\`\${shadow(100, 170, 46)}
    <rect x="50" y="68" width="94" height="76" rx="6" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <path d="M64 122 q16 -30 34 -10 q14 14 32 -14" stroke="#f06595" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M136 144 L116 98" stroke="#f76707" stroke-width="10" stroke-linecap="round"/>
    <polygon points="112,88 122,96 110,102" fill="#d9480f"/>\`, '#fff5f5'),

  sing: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="86" cy="88" r="30" fill="#ffd8b8"/>
    <circle cx="76" cy="82" r="5" fill="#212529"/>
    <ellipse cx="98" cy="96" rx="10" ry="12" fill="#c92a2a"/>
    <g fill="#845ef7">
      <path d="M130 64 v-20 h14 v6 h-8 v14z"/><circle cx="130" cy="64" r="5"/>
      <path d="M152 82 v-20 h14 v6 h-8 v14z"/><circle cx="152" cy="82" r="5"/>
    </g>\`, '#f3f0ff'),

  wake: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="100" cy="106" r="40" fill="#ffd43b"/>
    <circle cx="100" cy="106" r="32" fill="#ffffff"/>
    <circle cx="100" cy="106" r="4" fill="#339af0"/>
    <path d="M100 106 L100 86" stroke="#339af0" stroke-width="4" stroke-linecap="round"/>
    <path d="M100 106 L118 106" stroke="#fa5252" stroke-width="3" stroke-linecap="round"/>
    <circle cx="70" cy="74" r="14" fill="#ff922b"/>
    <circle cx="130" cy="74" r="14" fill="#ff922b"/>
    <rect x="74" y="142" width="10" height="14" rx="3" fill="#ff922b" transform="rotate(25 74 142)"/>
    <rect x="116" y="142" width="10" height="14" rx="3" fill="#ff922b" transform="rotate(-25 116 142)"/>
    <g fill="#ffd43b">
      <path d="M44 58 l4 4 M156 58 l-4 4" stroke="#f59f00" stroke-width="5" stroke-linecap="round"/>
    </g>\`, '#fff9db'),

  hug: wrap(\`\${shadow(100, 168, 50)}
    <circle cx="78" cy="94" r="30" fill="#deb887"/>
    <circle cx="60" cy="70" r="10" fill="#deb887"/><circle cx="60" cy="70" r="5" fill="#f8dbe4"/>
    <circle cx="72" cy="90" r="4" fill="#212529"/><path d="M68 98 q6 4 12 0" stroke="#5c3818" stroke-width="2.5" fill="none"/>
    <circle cx="122" cy="94" r="30" fill="#ff922b"/>
    <circle cx="140" cy="70" r="10" fill="#ff922b"/><circle cx="140" cy="70" r="5" fill="#ffe8cc"/>
    <circle cx="128" cy="90" r="4" fill="#212529"/><path d="M120 98 q6 4 12 0" stroke="#5c3818" stroke-width="2.5" fill="none"/>
    <path d="M74 114 q26 12 52 0" stroke="#deb887" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M100 68 q-8 -12 2 -18 q8 -3 10 5 q2 -8 10 -5 q10 6 2 18 l-12 12z" fill="#ff6b6b"/>\`, '#fff0f6'),

  listen: wrap(\`\${shadow(100, 168, 44)}
    <circle cx="86" cy="100" r="36" fill="#ffd8b8"/>
    <circle cx="80" cy="94" r="5" fill="#212529"/><circle cx="82" cy="92" r="2" fill="#ffffff"/>
    <path d="M78 108 q8 8 16 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="114" cy="98" rx="16" ry="24" fill="#ffc9c9" stroke="#e0a878" stroke-width="3"/>
    <path d="M112 88 q10 10 4 20" stroke="#e0a878" stroke-width="3" fill="none"/>
    <g fill="#845ef7">
      <ellipse cx="148" cy="80" rx="6" ry="5"/>
      <rect x="152" y="56" width="3" height="24"/>
      <ellipse cx="166" cy="72" rx="6" ry="5"/>
      <rect x="170" y="48" width="3" height="24"/>
      <path d="M152 56 h21 v5 h-21 z"/>
    </g>\`, '#f3f0ff'),

  // Adjectives
  big: wrap(\`\${shadow(100, 174, 52)}
    <circle cx="88" cy="94" r="48" fill="#ff4d4f"/>
    <path d="M88 62 q-12 18 2 34" stroke="#ffa39e" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.8"/>
    <circle cx="152" cy="136" r="14" fill="#ffd43b"/>
    <path d="M46 36 v-16 M38 28 l8 -8 l8 8" stroke="#1971c2" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M130 36 v-16 M122 28 l8 -8 l8 8" stroke="#1971c2" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>\`, '#fff5f5'),

  small: wrap(\`\${shadow(100, 172, 44)}
    <ellipse cx="100" cy="118" rx="54" ry="24" fill="#51cf66"/>
    <path d="M46 118 h108" stroke="#2b8a3e" stroke-width="3"/>
    <circle cx="100" cy="108" r="14" fill="#e03131"/>
    <circle cx="106" cy="102" r="5" fill="#212529"/>
    <circle cx="96" cy="108" r="2.5" fill="#212529"/><circle cx="102" cy="114" r="2.5" fill="#212529"/>
    <circle cx="100" cy="108" r="26" fill="none" stroke="#339af0" stroke-width="4" stroke-dasharray="6 5"/>\`, '#ebfbee'),

  hot: wrap(\`\${shadow(100, 172, 48)}
    <path d="M52 110 h96 l-12 40 h-72z" fill="#ff922b"/>
    <ellipse cx="100" cy="110" rx="48" ry="12" fill="#ffd43b"/>
    <g stroke="#e03131" stroke-width="6" fill="none" stroke-linecap="round">
      <path d="M80 88 q10 -16 -4 -26"/>
      <path d="M100 84 q10 -18 -4 -28"/>
      <path d="M120 88 q10 -16 -4 -26"/>
    </g>\`, '#fff4e6'),

  cold: wrap(\`\${shadow(100, 172, 48)}
    <circle cx="100" cy="128" r="28" fill="#fff" stroke="#adb5bd" stroke-width="2"/>
    <circle cx="100" cy="84" r="20" fill="#fff" stroke="#adb5bd" stroke-width="2"/>
    <circle cx="94" cy="82" r="3" fill="#212529"/><circle cx="106" cy="82" r="3" fill="#212529"/>
    <polygon points="100,86 118,89 100,92" fill="#f76707"/>
    <rect x="88" y="100" width="24" height="8" rx="3" fill="#ff6b6b"/>
    <g fill="#74c0fc"><circle cx="56" cy="68" r="3"/><circle cx="144" cy="74" r="4"/><circle cx="136" cy="120" r="3"/></g>\`, '#e7f5ff'),

  fast: wrap(\`\${shadow(100, 174, 52)}
    <g transform="translate(40, 40) rotate(35 60 60)">
      <path d="M60 20 q30 20 20 70 h-40 q-10 -50 20 -70z" fill="#e03131"/>
      <circle cx="60" cy="56" r="10" fill="#a5d8ff"/>
      <path d="M50 90 l-14 18 h16z" fill="#f76707"/><path d="M70 90 l14 18 h-16z" fill="#f76707"/>
      <polygon points="54,90 66,90 60,118" fill="#ffd43b"/>
    </g>
    <g stroke="#f76707" stroke-width="4" stroke-linecap="round">
      <path d="M34 130 l20 -16"/><path d="M46 148 l20 -16"/>
    </g>\`, '#fff5f5'),

  slow: wrap(\`\${shadow(100, 170, 48)}
    <ellipse cx="94" cy="126" rx="40" ry="26" fill="#2b8a3e"/>
    <path d="M54 126 h80" stroke="#237032" stroke-width="3"/>
    <ellipse cx="140" cy="122" rx="14" ry="10" fill="#51cf66"/>
    <circle cx="144" cy="118" r="2.5" fill="#212529"/>
    <ellipse cx="68" cy="144" rx="8" ry="6" fill="#51cf66"/><ellipse cx="120" cy="144" rx="8" ry="6" fill="#51cf66"/>\`, '#ebfbee'),

  // Vehicles
  bus: wrap(\`\${shadow(100, 168, 54)}
    <rect x="36" y="70" width="128" height="66" rx="12" fill="#fcc419"/>
    <rect x="46" y="80" width="26" height="24" rx="4" fill="#a5d8ff"/><rect x="80" y="80" width="26" height="24" rx="4" fill="#a5d8ff"/><rect x="114" y="80" width="26" height="24" rx="4" fill="#a5d8ff"/>
    <rect x="36" y="116" width="128" height="8" fill="#212529"/>
    <circle cx="64" cy="138" r="14" fill="#343a40"/><circle cx="64" cy="138" r="6" fill="#dee2e6"/>
    <circle cx="136" cy="138" r="14" fill="#343a40"/><circle cx="136" cy="138" r="6" fill="#dee2e6"/>\`, '#fff9db'),

  bike: wrap(\`\${shadow(100, 168, 52)}
    <circle cx="62" cy="128" r="26" fill="none" stroke="#343a40" stroke-width="7"/>
    <circle cx="138" cy="128" r="26" fill="none" stroke="#343a40" stroke-width="7"/>
    <path d="M62 128 L94 88 L138 128 M94 88 L114 88 M94 88 L78 128" stroke="#e03131" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M138 128 L124 90" stroke="#e03131" stroke-width="7" stroke-linecap="round"/>
    <path d="M114 88 h20" stroke="#343a40" stroke-width="7" stroke-linecap="round"/>
    <rect x="70" y="82" width="18" height="6" rx="3" fill="#343a40"/>\`, '#fff5f5'),

  plane: wrap(\`\${shadow(100, 176, 52)}
    <ellipse cx="100" cy="100" rx="64" ry="16" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
    <path d="M96 100 L76 56 h22 l28 44z" fill="#339af0"/>
    <path d="M96 100 L76 144 h22 l28 -44z" fill="#339af0"/>
    <path d="M150 92 L164 68 h12 l-6 26z" fill="#339af0"/>
    <circle cx="58" cy="100" r="4" fill="#339af0"/><circle cx="74" cy="100" r="4" fill="#339af0"/><circle cx="90" cy="100" r="4" fill="#339af0"/>\`, '#e7f5ff'),

  boat: wrap(\`\${shadow(100, 168, 52)}
    <path d="M42 118 h116 l-16 28 h-84z" fill="#8c5828"/>
    <path d="M100 116 V50" stroke="#5c3818" stroke-width="6"/>
    <path d="M104 54 L104 110 L148 110z" fill="#fff" stroke="#dee2e6" stroke-width="2"/>
    <path d="M96 64 L96 110 L62 110z" fill="#ff6b6b"/>
    <path d="M30 156 q12 -8 24 0 q12 8 24 0 q12 -8 24 0 q12 8 24 0 q12 -8 24 0" stroke="#339af0" stroke-width="5" fill="none" stroke-linecap="round"/>\`, '#e7f5ff'),

  train: wrap(\`\${shadow(100, 168, 54)}
    <rect x="42" y="86" width="76" height="46" rx="8" fill="#343a40"/>
    <rect x="116" y="68" width="42" height="64" rx="6" fill="#e03131"/>
    <rect x="124" y="78" width="26" height="20" rx="3" fill="#a5d8ff"/>
    <rect x="52" y="66" width="16" height="22" rx="3" fill="#495057"/>
    <circle cx="58" cy="54" r="10" fill="#dee2e6" opacity="0.8"/><circle cx="72" cy="44" r="14" fill="#dee2e6" opacity="0.8"/>
    <circle cx="62" cy="136" r="12" fill="#fcc419"/><circle cx="96" cy="136" r="12" fill="#fcc419"/><circle cx="138" cy="136" r="14" fill="#fcc419"/>\`, '#fff9db'),

  truck: wrap(\`\${shadow(100, 168, 52)}
    <rect x="42" y="80" width="70" height="54" rx="6" fill="#ff6b6b"/>
    <path d="M112 94 h30 l16 18 v22 h-46 z" fill="#339af0"/>
    <rect x="120" y="100" width="22" height="14" rx="3" fill="#ffffff"/>
    <circle cx="70" cy="142" r="14" fill="#343a40"/><circle cx="70" cy="142" r="6" fill="#ced4da"/>
    <circle cx="138" cy="142" r="14" fill="#343a40"/><circle cx="138" cy="142" r="6" fill="#ced4da"/>
    <rect x="46" y="86" width="62" height="12" rx="2" fill="#fa5252"/>\`, '#fff5f5'),

  // Wild
  lion: wrap(\`\${shadow(100, 168, 50)}
    <g fill="#f59f00">
      <circle cx="100" cy="54" r="18"/><circle cx="132" cy="62" r="18"/><circle cx="148" cy="88" r="18"/>
      <circle cx="148" cy="118" r="18"/><circle cx="132" cy="142" r="18"/><circle cx="100" cy="148" r="18"/>
      <circle cx="68" cy="142" r="18"/><circle cx="52" cy="118" r="18"/><circle cx="52" cy="88" r="18"/>
      <circle cx="68" cy="62" r="18"/>
      <circle cx="100" cy="102" r="48"/>
    </g>
    <circle cx="66" cy="68" r="11" fill="#ffe066"/><circle cx="66" cy="68" r="6" fill="#f59f00"/>
    <circle cx="134" cy="68" r="11" fill="#ffe066"/><circle cx="134" cy="68" r="6" fill="#f59f00"/>
    <ellipse cx="100" cy="106" rx="38" ry="34" fill="#ffe066"/>
    <circle cx="85" cy="96" r="7.5" fill="#fff"/><circle cx="86" cy="98" r="4.2" fill="#212529"/><circle cx="88" cy="96" r="1.8" fill="#fff"/>
    <circle cx="115" cy="96" r="7.5" fill="#fff"/><circle cx="114" cy="98" r="4.2" fill="#212529"/><circle cx="115" cy="96" r="1.8" fill="#fff"/>
    <circle cx="74" cy="112" r="6" fill="#fcc419" opacity="0.6"/><circle cx="126" cy="112" r="6" fill="#fcc419" opacity="0.6"/>
    <ellipse cx="100" cy="116" rx="16" ry="12" fill="#fff9db"/>
    <path d="M94 110 h12 l-6 7z" fill="#7a4a12"/>
    <path d="M94 120 q6 4 12 0" stroke="#7a4a12" stroke-width="2.5" fill="none" stroke-linecap="round"/>\`, '#fff9db'),

  elephant: wrap(\`\${shadow(100, 168, 52)}
    <ellipse cx="50" cy="92" rx="26" ry="32" fill="#adb5bd"/>
    <ellipse cx="52" cy="94" rx="16" ry="22" fill="#ffc9c9"/>
    <ellipse cx="150" cy="92" rx="26" ry="32" fill="#adb5bd"/>
    <ellipse cx="148" cy="94" rx="16" ry="22" fill="#ffc9c9"/>
    <ellipse cx="100" cy="104" rx="46" ry="42" fill="#ced4da"/>
    <circle cx="80" cy="92" r="8" fill="#fff"/>
    <circle cx="82" cy="94" r="4.5" fill="#212529"/>
    <circle cx="84" cy="92" r="1.8" fill="#fff"/>
    <circle cx="120" cy="92" r="8" fill="#fff"/>
    <circle cx="118" cy="94" r="4.5" fill="#212529"/>
    <circle cx="119" cy="92" r="1.8" fill="#fff"/>
    <circle cx="68" cy="110" r="7" fill="#ffb3c1" opacity="0.6"/>
    <circle cx="132" cy="110" r="7" fill="#ffb3c1" opacity="0.6"/>
    <path d="M92 104 q-4 26 8 36 q10 8 16 -2 q4 -6 -2 -8 q-6 -2 -8 4 q-8 -8 0 -30 z" fill="#adb5bd" stroke="#9ca3af" stroke-width="2"/>
    <path d="M82 118 q-6 10 2 12 q2 -6 2 -12z" fill="#fff"/>
    <path d="M118 118 q6 10 -2 12 q-2 -6 -2 -12z" fill="#fff"/>\`, '#f1f3f5'),

  monkey: wrap(\`\${shadow(100, 168, 46)}
    <circle cx="64" cy="66" r="14" fill="#8c5828"/><circle cx="64" cy="66" r="7" fill="#deb887"/>
    <circle cx="136" cy="66" r="14" fill="#8c5828"/><circle cx="136" cy="66" r="7" fill="#deb887"/>
    <circle cx="100" cy="92" r="32" fill="#8c5828"/>
    <ellipse cx="100" cy="100" rx="22" ry="18" fill="#deb887"/>
    <circle cx="90" cy="86" r="5" fill="#212529"/><circle cx="110" cy="86" r="5" fill="#212529"/>
    <ellipse cx="100" cy="98" rx="5" ry="3.5" fill="#492c10"/>
    <path d="M92 106 q8 6 16 0" stroke="#492c10" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M138 128 q24 0 20 22" stroke="#8c5828" stroke-width="6" fill="none" stroke-linecap="round"/>\`, '#fff4e6'),

  tiger: wrap(\`\${shadow(100, 168, 48)}
    <path d="M68 64 L58 38 L86 52 Z" fill="#f76707"/><path d="M132 64 L142 38 L114 52 Z" fill="#f76707"/>
    <ellipse cx="100" cy="104" rx="46" ry="42" fill="#f76707"/>
    <g stroke="#212529" stroke-width="5" stroke-linecap="round">
      <path d="M74 84 l12 4"/><path d="M126 84 l-12 4"/>
      <path d="M68 104 h14"/><path d="M118 104 h14"/>
      <path d="M80 124 l10 4"/><path d="M120 124 l-10 4"/>
    </g>
    <circle cx="84" cy="96" r="7" fill="#fff"/><circle cx="86" cy="98" r="3.5" fill="#212529"/>
    <circle cx="116" cy="96" r="7" fill="#fff"/><circle cx="114" cy="98" r="3.5" fill="#212529"/>
    <ellipse cx="100" cy="114" rx="7" ry="5" fill="#212529"/>
    <path d="M90 124 q10 8 20 0" stroke="#212529" stroke-width="3" fill="none" stroke-linecap="round"/>\`, '#fff4e6'),

  snake: wrap(\`\${shadow(100, 168, 48)}
    <path d="M50 146 c-14 -10 -4 -30 18 -26 c24 4 48 -14 68 -6 c20 8 20 28 4 34 c-22 8 -66 8 -90 -2 z" fill="#51cf66"/>
    <path d="M60 144 c20 6 54 6 72 -2" stroke="#ffd43b" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M88 126 c-6 -18 6 -42 20 -44 c16 -2 24 14 16 36 z" fill="#40c057"/>
    <ellipse cx="106" cy="84" rx="20" ry="16" fill="#51cf66"/>
    <circle cx="68" cy="132" r="3.5" fill="#ffd43b"/><circle cx="120" cy="136" r="3.5" fill="#ffd43b"/>
    <circle cx="102" cy="80" r="6.5" fill="#fff"/><circle cx="104" cy="81" r="3.5" fill="#212529"/><circle cx="105" cy="79" r="1.5" fill="#fff"/>
    <circle cx="118" cy="80" r="5.5" fill="#fff"/><circle cx="119" cy="81" r="3" fill="#212529"/><circle cx="120" cy="79" r="1.2" fill="#fff"/>
    <circle cx="96" cy="90" r="4.5" fill="#ffb3c1" opacity="0.6"/>
    <path d="M102 90 q8 5 16 0" stroke="#2b8a3e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M124 88 l10 0 l4 -4 m-4 4 l4 4" stroke="#ff6b6b" stroke-width="2.5" fill="none" stroke-linecap="round"/>\`, '#ebfbee'),

  bear: wrap(\`\${shadow(100, 168, 48)}
    <circle cx="70" cy="64" r="16" fill="#7a4a12"/><circle cx="70" cy="64" r="8" fill="#deb887"/>
    <circle cx="130" cy="64" r="16" fill="#7a4a12"/><circle cx="130" cy="64" r="8" fill="#deb887"/>
    <circle cx="100" cy="96" r="38" fill="#7a4a12"/>
    <ellipse cx="100" cy="106" rx="20" ry="15" fill="#deb887"/>
    <circle cx="86" cy="90" r="5.5" fill="#212529"/><circle cx="114" cy="90" r="5.5" fill="#212529"/>
    <ellipse cx="100" cy="102" rx="6.5" ry="5" fill="#212529"/>
    <path d="M92 112 q8 6 16 0" stroke="#212529" stroke-width="3" fill="none" stroke-linecap="round"/>\`, '#fff4e6'),

  giraffe: wrap(\`\${shadow(100, 168, 48)}
    <rect x="88" y="70" width="24" height="78" rx="10" fill="#ffd43b"/>
    <circle cx="100" cy="62" r="26" fill="#ffd43b"/>
    <ellipse cx="78" cy="46" rx="6" ry="12" fill="#ffd43b" transform="rotate(-20 78 46)"/>
    <ellipse cx="122" cy="46" rx="6" ry="12" fill="#ffd43b" transform="rotate(20 122 46)"/>
    <circle cx="86" cy="38" r="5" fill="#a66e38"/><circle cx="114" cy="38" r="5" fill="#a66e38"/>
    <ellipse cx="100" cy="74" rx="18" ry="12" fill="#ffe8cc"/>
    <circle cx="88" cy="60" r="5.5" fill="#212529"/><circle cx="90" cy="58" r="2" fill="#ffffff"/>
    <circle cx="112" cy="60" r="5.5" fill="#212529"/><circle cx="114" cy="58" r="2" fill="#ffffff"/>
    <circle cx="94" cy="74" r="2.5" fill="#a66e38"/><circle cx="106" cy="74" r="2.5" fill="#a66e38"/>
    <path d="M94 80 q6 4 12 0" stroke="#a66e38" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="96" cy="98" r="6" fill="#d97706"/><circle cx="106" cy="118" r="7" fill="#d97706"/>
    <circle cx="94" cy="138" r="5" fill="#d97706"/>\`, '#fff9db'),

  penguin: wrap(\`\${shadow(100, 168, 48)}
    <ellipse cx="100" cy="106" rx="42" ry="50" fill="#212529"/>
    <ellipse cx="100" cy="116" rx="28" ry="38" fill="#ffffff"/>
    <ellipse cx="64" cy="110" rx="10" ry="24" fill="#212529" transform="rotate(18 64 110)"/>
    <ellipse cx="136" cy="110" rx="10" ry="24" fill="#212529" transform="rotate(-18 136 110)"/>
    <circle cx="88" cy="84" r="6.5" fill="#ffffff"/><circle cx="90" cy="85" r="3.5" fill="#212529"/><circle cx="91" cy="83" r="1.5" fill="#ffffff"/>
    <circle cx="112" cy="84" r="6.5" fill="#ffffff"/><circle cx="110" cy="85" r="3.5" fill="#212529"/><circle cx="109" cy="83" r="1.5" fill="#ffffff"/>
    <polygon points="94,92 106,92 100,102" fill="#ff922b"/>
    <circle cx="78" cy="94" r="5" fill="#ffb4b4" opacity="0.6"/><circle cx="122" cy="94" r="5" fill="#ffb4b4" opacity="0.6"/>
    <ellipse cx="86" cy="156" rx="14" ry="7" fill="#ff922b"/><ellipse cx="114" cy="156" rx="14" ry="7" fill="#ff922b"/>\`, '#e7f5ff'),

  turtle: wrap(\`\${shadow(100, 168, 48)}
    <ellipse cx="100" cy="106" rx="46" ry="38" fill="#2b8a3e"/>
    <ellipse cx="100" cy="106" rx="40" ry="32" fill="#40c057"/>
    <path d="M100 74 v64 M60 106 h80 M74 86 l52 40 M74 126 l52 -40" stroke="#2f9e44" stroke-width="3"/>
    <ellipse cx="100" cy="62" rx="18" ry="16" fill="#8ce99a"/>
    <circle cx="92" cy="58" r="4" fill="#212529"/><circle cx="93" cy="57" r="1.5" fill="#ffffff"/>
    <circle cx="108" cy="58" r="4" fill="#212529"/><circle cx="109" cy="57" r="1.5" fill="#ffffff"/>
    <path d="M96 68 q4 4 8 0" stroke="#2b8a3e" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="58" cy="84" rx="12" ry="18" fill="#8ce99a" transform="rotate(-35 58 84)"/>
    <ellipse cx="142" cy="84" rx="12" ry="18" fill="#8ce99a" transform="rotate(35 142 84)"/>
    <ellipse cx="62" cy="134" rx="10" ry="14" fill="#8ce99a" transform="rotate(-50 62 134)"/>
    <ellipse cx="138" cy="134" rx="10" ry="14" fill="#8ce99a" transform="rotate(50 138 134)"/>\`, '#ebfbee'),

  // Questions
  whatsThis: wrap(\`\${shadow(100, 168, 46)}
    <rect x="56" y="92" width="60" height="52" rx="8" fill="#ff922b"/>
    <rect x="52" y="84" width="68" height="14" rx="4" fill="#f76707"/>
    <circle cx="130" cy="80" r="26" fill="none" stroke="#845ef7" stroke-width="8"/>
    <path d="M148 100 L170 122" stroke="#845ef7" stroke-width="9" stroke-linecap="round"/>
    <text x="130" y="92" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-size="36" font-weight="900" fill="#7048e8">?</text>\`, '#f3f0ff'),

  whosThis: wrap(\`\${shadow(100, 168, 46)}
    <circle cx="88" cy="80" r="24" fill="#adb5bd"/>
    <path d="M64 136 q0 -28 24 -28 q24 0 24 28z" fill="#adb5bd"/>
    <text x="144" y="120" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-size="64" font-weight="900" fill="#845ef7">?</text>\`, '#f3f0ff'),

  howMany: wrap(\`\${shadow(100, 168, 46)}
    <circle cx="60" cy="120" r="14" fill="#ff4d4f"/>
    <circle cx="96" cy="120" r="14" fill="#40c057"/>
    <circle cx="132" cy="120" r="14" fill="#1971c2"/>
    <text x="100" y="78" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-size="52" font-weight="900" fill="#845ef7">?</text>\`, '#f3f0ff'),
};

Object.assign(art, n3);

const sceneFarm = wrap(\`\${shadow(100, 180, 60)}
    <rect x="0" y="140" width="200" height="60" fill="#8ce99a"/>
    <circle cx="160" cy="40" r="18" fill="#ffd43b"/>
    <ellipse cx="60" cy="70" rx="26" ry="22" fill="#f5a623"/><ellipse cx="60" cy="82" rx="16" ry="12" fill="#ffe3b3"/>
    <circle cx="52" cy="66" r="5" fill="#2d2d2d"/><circle cx="68" cy="66" r="5" fill="#2d2d2d"/>
    <ellipse cx="140" cy="90" rx="30" ry="26" fill="#fff"/><circle cx="128" cy="84" r="6" fill="#2d2d2d"/><circle cx="152" cy="84" r="6" fill="#2d2d2d"/>
    <ellipse cx="140" cy="98" rx="14" ry="9" fill="#f8dbe4"/>\`, '#e7f5ff');

const scenePark = wrap(\`\${shadow(100, 180, 60)}
    <rect x="0" y="140" width="200" height="60" fill="#8ce99a"/>
    <circle cx="40" cy="44" r="16" fill="#ffd43b"/>
    <path d="M120 140 v-40" stroke="#8b5a2b" stroke-width="8"/>
    <circle cx="120" cy="84" r="26" fill="#51cf66"/><circle cx="100" cy="96" r="18" fill="#69db7c"/><circle cx="140" cy="96" r="18" fill="#69db7c"/>\`, '#e7f5ff');

export function wordArt(id: string): string {
  return art[id] ?? sceneFarm;
}

export const scenes: Record<string, string> = { farm: sceneFarm, park: scenePark };
`;

fs.writeFileSync('src/content/art.ts', artTsContent, 'utf8');
console.log('Successfully wrote src/content/art.ts');
