export const wrap = (body: string, bg = '#fff8f0') =>
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

const shadow = (cx: number, cy: number, rx: number) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="8" fill="#000" opacity="0.08"/>`;

export function foxySVG(mood: 'happy' | 'sleep' | 'point' | 'surprise' | 'eat' = 'happy'): string {
  const eyes =
    mood === 'sleep'
      ? `<path d="M72 96 q8 6 16 0" stroke="#5b3413" stroke-width="4" fill="none" stroke-linecap="round"/>
         <path d="M112 96 q8 6 16 0" stroke="#5b3413" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : mood === 'surprise'
      ? `<circle cx="80" cy="96" r="9" fill="#fff"/><circle cx="82" cy="98" r="4.5" fill="#3a2008"/>
         <circle cx="120" cy="96" r="9" fill="#fff"/><circle cx="122" cy="98" r="4.5" fill="#3a2008"/>`
      : `<circle cx="80" cy="96" r="9" fill="#fff"/><circle cx="82" cy="98" r="4.5" fill="#3a2008"/>
         <circle cx="120" cy="96" r="9" fill="#fff"/><circle cx="122" cy="98" r="4.5" fill="#3a2008"/>`;
  const mouth =
    mood === 'sleep'
      ? `<path d="M94 122 q6 4 12 0" stroke="#5b3413" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
      : mood === 'surprise'
      ? `<ellipse cx="100" cy="124" rx="8" ry="10" fill="#7a3b12"/>`
      : mood === 'eat'
      ? `<path d="M86 118 q14 16 28 0 q-14 8 -28 0z" fill="#7a3b12"/><ellipse cx="100" cy="126" rx="7" ry="4" fill="#ff7d9c"/>`
      : `<path d="M84 116 q16 16 32 0" stroke="#5b3413" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const arm =
    mood === 'point'
      ? `<path d="M138 118 L172 96" stroke="#f2701d" stroke-width="14" stroke-linecap="round"/><circle cx="174" cy="94" r="9" fill="#fff3e4"/>`
      : `<path d="M64 122 q-10 12 -2 22" stroke="#f2701d" stroke-width="13" fill="none" stroke-linecap="round"/>`;
  return wrap(`
  <path d="M58 62 L46 26 L82 48 Z" fill="url(#fur)"/><path d="M142 62 L154 26 L118 48 Z" fill="url(#fur)"/>
  <path d="M58 56 L52 38 L70 50 Z" fill="#fff3e4"/><path d="M142 56 L148 38 L130 50 Z" fill="#fff3e4"/>
  <ellipse cx="100" cy="105" rx="52" ry="50" fill="url(#fur)"/>
  <ellipse cx="100" cy="122" rx="30" ry="26" fill="#fff3e4"/>
  ${eyes}
  <ellipse cx="100" cy="110" rx="7" ry="5.5" fill="#3a2008"/>
  ${mouth}
  ${arm}
  <path d="M148 128 q26 4 22 26 q-4 18 -24 14 q10 -8 8 -20 q-2 -12 -6 -20z" fill="url(#fur)"/>
  <path d="M166 162 q6 6 2 14 q-16 4 -22 -6 q10 0 20 -8z" fill="#fff3e4"/>
  `);
}

const art: Record<string, string> = {
  cat: wrap(`${shadow(100, 168, 46)}
    <path d="M66 66 L58 34 L86 52 Z" fill="#f5a623"/><path d="M134 66 L142 34 L114 52 Z" fill="#f5a623"/>
    <path d="M70 60 L66 44 L80 54 Z" fill="#ffd9e0"/><path d="M130 60 L134 44 L120 54 Z" fill="#ffd9e0"/>
    <ellipse cx="100" cy="106" rx="46" ry="42" fill="#f5a623"/>
    <ellipse cx="100" cy="120" rx="26" ry="22" fill="#ffe3b3"/>
    <circle cx="84" cy="100" r="8" fill="#fff"/><circle cx="86" cy="102" r="4" fill="#2d2d2d"/>
    <circle cx="116" cy="100" r="8" fill="#fff"/><circle cx="118" cy="102" r="4" fill="#2d2d2d"/>
    <path d="M96 116 h8 l-4 6 z" fill="#ff7d9c"/>
    <path d="M92 124 q8 6 16 0" stroke="#a86a1f" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g stroke="#a86a1f" stroke-width="2.5" stroke-linecap="round"><path d="M52 108 h-18"/><path d="M54 118 l-16 6"/><path d="M148 108 h18"/><path d="M146 118 l16 6"/></g>`),
  dog: wrap(`${shadow(100, 168, 48)}
    <path d="M60 70 q-14 -6 -12 -26 q16 -2 24 12z" fill="#a9713b"/><path d="M140 70 q14 -6 12 -26 q-16 -2 -24 12z" fill="#a9713b"/>
    <ellipse cx="100" cy="108" rx="46" ry="42" fill="#c98d4f"/>
    <ellipse cx="100" cy="122" rx="26" ry="22" fill="#efd3a7"/>
    <circle cx="84" cy="100" r="8" fill="#fff"/><circle cx="86" cy="102" r="4" fill="#2d2d2d"/>
    <circle cx="116" cy="100" r="8" fill="#fff"/><circle cx="118" cy="102" r="4" fill="#2d2d2d"/>
    <ellipse cx="100" cy="114" rx="8" ry="6" fill="#3a2a1a"/>
    <path d="M100 120 q0 8 -8 8 M100 120 q0 8 8 8" stroke="#3a2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="100" cy="132" rx="7" ry="4.5" fill="#ff7d9c"/>`),
  duck: wrap(`${shadow(100, 168, 42)}
    <ellipse cx="100" cy="118" rx="44" ry="40" fill="#ffd93b"/>
    <circle cx="100" cy="72" r="30" fill="#ffd93b"/>
    <path d="M126 68 q26 2 24 12 q-2 10 -26 8z" fill="#ff9f1c"/>
    <circle cx="92" cy="66" r="7" fill="#fff"/><circle cx="94" cy="68" r="3.5" fill="#2d2d2d"/>
    <path d="M70 76 q-10 8 0 16" stroke="#f0b429" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M64 150 q36 18 72 0 q-6 14 -36 14 q-30 0 -36 -14z" fill="#f0b429"/>`),
  fish: wrap(`${shadow(100, 168, 44)}
    <path d="M138 100 L172 74 q6 26 0 52 Z" fill="#ff8c42"/>
    <ellipse cx="96" cy="100" rx="48" ry="30" fill="#ff8c42"/>
    <path d="M84 72 q16 -14 30 0 q-14 6 -30 0z" fill="#ffb27d"/>
    <circle cx="72" cy="94" r="7" fill="#fff"/><circle cx="74" cy="96" r="3.5" fill="#2d2d2d"/>
    <path d="M96 106 q10 8 22 4" stroke="#e06a1f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <g fill="#ffb27d"><circle cx="110" cy="92" r="3"/><circle cx="118" cy="102" r="3"/><circle cx="106" cy="112" r="3"/></g>
    <path d="M40 60 q8 10 0 20 M28 70 q6 8 0 16" stroke="#7cc7ff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>`),
  bird: wrap(`${shadow(100, 168, 38)}
    <ellipse cx="100" cy="112" rx="38" ry="36" fill="#4dabf7"/>
    <circle cx="100" cy="70" r="26" fill="#4dabf7"/>
    <path d="M122 68 l22 6 l-22 8z" fill="#ffd93b"/>
    <circle cx="92" cy="64" r="7" fill="#fff"/><circle cx="94" cy="66" r="3.5" fill="#2d2d2d"/>
    <path d="M66 104 q-18 -4 -16 -22 q14 2 20 12z" fill="#339af0"/>
    <path d="M100 148 v14 M88 162 h24" stroke="#ff9f1c" stroke-width="5" stroke-linecap="round"/>
    <path d="M92 40 q8 -10 16 0" stroke="#339af0" stroke-width="5" fill="none" stroke-linecap="round"/>`),
  cow: wrap(`${shadow(100, 168, 50)}
    <path d="M62 62 L48 36 L78 50 Z" fill="#fff"/><path d="M138 62 L152 36 L122 50 Z" fill="#fff"/>
    <ellipse cx="100" cy="106" rx="50" ry="44" fill="#fff"/>
    <ellipse cx="76" cy="96" rx="16" ry="12" fill="#f3c6d3"/><ellipse cx="126" cy="118" rx="18" ry="13" fill="#f3c6d3"/>
    <ellipse cx="100" cy="126" rx="26" ry="18" fill="#f8dbe4"/>
    <circle cx="82" cy="98" r="8" fill="#fff"/><circle cx="84" cy="100" r="4" fill="#2d2d2d"/>
    <circle cx="118" cy="98" r="8" fill="#fff"/><circle cx="120" cy="100" r="4" fill="#2d2d2d"/>
    <ellipse cx="92" cy="128" rx="4" ry="5" fill="#8a5a6b"/><ellipse cx="108" cy="128" rx="4" ry="5" fill="#8a5a6b"/>`),
  horse: wrap(`${shadow(100, 168, 50)}
    <path d="M70 58 q-4 -28 10 -34 q4 18 10 30z" fill="#6b4226"/>
    <ellipse cx="102" cy="106" rx="48" ry="44" fill="#8b5a2b"/>
    <path d="M66 96 q-12 -8 -10 -24 q14 4 20 16z" fill="#8b5a2b"/>
    <ellipse cx="100" cy="122" rx="24" ry="20" fill="#d9b08c"/>
    <circle cx="84" cy="98" r="8" fill="#fff"/><circle cx="86" cy="100" r="4" fill="#2d2d2d"/>
    <ellipse cx="118" cy="118" rx="4" ry="5" fill="#5b3413"/>
    <path d="M60 60 q-8 -14 4 -22" stroke="#6b4226" stroke-width="7" fill="none" stroke-linecap="round"/>`),
  pig: wrap(`${shadow(100, 168, 46)}
    <path d="M68 64 L60 40 L84 54 Z" fill="#ff9fb2"/><path d="M132 64 L140 40 L116 54 Z" fill="#ff9fb2"/>
    <ellipse cx="100" cy="108" rx="48" ry="42" fill="#ffb3c1"/>
    <ellipse cx="100" cy="118" rx="18" ry="14" fill="#ff8fab"/>
    <circle cx="94" cy="118" r="3.5" fill="#d6336c"/><circle cx="106" cy="118" r="3.5" fill="#d6336c"/>
    <circle cx="82" cy="98" r="8" fill="#fff"/><circle cx="84" cy="100" r="4" fill="#2d2d2d"/>
    <circle cx="118" cy="98" r="8" fill="#fff"/><circle cx="120" cy="100" r="4" fill="#2d2d2d"/>
    <path d="M90 132 q10 8 20 0" stroke="#d6336c" stroke-width="3.5" fill="none" stroke-linecap="round"/>`),
  sheep: wrap(`${shadow(100, 168, 48)}
    <g fill="#f8f9fa" stroke="#dee2e6" stroke-width="2">
      <circle cx="70" cy="86" r="20"/><circle cx="100" cy="72" r="24"/><circle cx="130" cy="86" r="20"/>
      <circle cx="62" cy="112" r="20"/><circle cx="100" cy="100" r="26"/><circle cx="138" cy="112" r="20"/>
      <circle cx="80" cy="132" r="18"/><circle cx="120" cy="132" r="18"/>
    </g>
    <ellipse cx="100" cy="106" rx="24" ry="28" fill="#495057"/>
    <circle cx="92" cy="98" r="6" fill="#fff"/><circle cx="93.5" cy="99.5" r="3" fill="#212529"/>
    <circle cx="108" cy="98" r="6" fill="#fff"/><circle cx="109.5" cy="99.5" r="3" fill="#212529"/>
    <path d="M94 116 q6 5 12 0" stroke="#212529" stroke-width="3" fill="none" stroke-linecap="round"/>`),
  rabbit: wrap(`${shadow(100, 168, 40)}
    <ellipse cx="82" cy="42" rx="12" ry="30" fill="#e9ecef"/><ellipse cx="82" cy="46" rx="6" ry="20" fill="#ffc9de"/>
    <ellipse cx="118" cy="42" rx="12" ry="30" fill="#e9ecef"/><ellipse cx="118" cy="46" rx="6" ry="20" fill="#ffc9de"/>
    <circle cx="100" cy="96" r="38" fill="#e9ecef"/>
    <ellipse cx="100" cy="130" rx="34" ry="26" fill="#f1f3f5"/>
    <circle cx="86" cy="90" r="8" fill="#fff"/><circle cx="88" cy="92" r="4" fill="#2d2d2d"/>
    <circle cx="114" cy="90" r="8" fill="#fff"/><circle cx="116" cy="92" r="4" fill="#2d2d2d"/>
    <path d="M96 104 h8 l-4 6 z" fill="#ff8fab"/>
    <path d="M92 112 q8 6 16 0" stroke="#adb5bd" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="138" cy="148" rx="16" ry="10" fill="#fff"/>`),
  mouse: wrap(`${shadow(100, 168, 44)}
    <circle cx="72" cy="66" r="18" fill="#ced4da"/><circle cx="128" cy="66" r="18" fill="#ced4da"/>
    <circle cx="72" cy="66" r="9" fill="#ffc9de"/><circle cx="128" cy="66" r="9" fill="#ffc9de"/>
    <ellipse cx="100" cy="112" rx="42" ry="38" fill="#adb5bd"/>
    <ellipse cx="100" cy="126" rx="26" ry="20" fill="#e9ecef"/>
    <circle cx="86" cy="104" r="7" fill="#fff"/><circle cx="88" cy="106" r="3.5" fill="#2d2d2d"/>
    <circle cx="114" cy="104" r="7" fill="#fff"/><circle cx="116" cy="106" r="3.5" fill="#2d2d2d"/>
    <ellipse cx="100" cy="118" rx="6" ry="4.5" fill="#ff8fab"/>
    <path d="M142 132 q22 4 18 22" stroke="#868e96" stroke-width="5" fill="none" stroke-linecap="round"/>`),
  frog: wrap(`${shadow(100, 168, 46)}
    <circle cx="76" cy="66" r="16" fill="#69db7c"/><circle cx="124" cy="66" r="16" fill="#69db7c"/>
    <circle cx="76" cy="66" r="9" fill="#fff"/><circle cx="77" cy="68" r="4" fill="#2d2d2d"/>
    <circle cx="124" cy="66" r="9" fill="#fff"/><circle cx="125" cy="68" r="4" fill="#2d2d2d"/>
    <ellipse cx="100" cy="116" rx="46" ry="40" fill="#69db7c"/>
    <ellipse cx="100" cy="130" rx="28" ry="20" fill="#d3f9d8"/>
    <path d="M78 112 q22 14 44 0" stroke="#2f9e44" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="66" cy="124" r="6" fill="#ff8787" opacity="0.7"/><circle cx="134" cy="124" r="6" fill="#ff8787" opacity="0.7"/>`),
  apple: wrap(`${shadow(100, 168, 40)}
    <path d="M100 74 q-6 -14 6 -20" stroke="#6b4226" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M104 58 q18 -10 26 4 q-14 8 -26 -4z" fill="#51cf66"/>
    <path d="M100 78 C 66 78 54 104 62 128 C 70 152 88 164 100 160 C 112 164 130 152 138 128 C 146 104 134 78 100 78 Z" fill="#ff6b6b"/>
    <path d="M78 96 q-6 14 2 30" stroke="#ff9999" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>`),
  banana: wrap(`${shadow(100, 168, 44)}
    <path d="M52 60 q-8 60 40 88 q44 26 76 -6 q6 -8 -2 -12 q-40 -34 -76 -64 q-30 -26 -38 -6z" fill="#ffd93b" stroke="#f0b429" stroke-width="4" stroke-linejoin="round"/>
    <path d="M48 56 l10 -8 l6 10 l-10 6z" fill="#8b5a2b"/>
    <path d="M160 132 l10 4 l-6 8 l-8 -6z" fill="#8b5a2b"/>`),
  milk: wrap(`${shadow(100, 168, 34)}
    <path d="M76 60 h48 l6 24 v78 a10 10 0 0 1 -10 10 h-40 a10 10 0 0 1 -10 -10 v-78z" fill="#f8f9fa" stroke="#dee2e6" stroke-width="3"/>
    <path d="M76 60 l12 -18 h24 l12 18z" fill="#e9ecef" stroke="#dee2e6" stroke-width="3"/>
    <rect x="70" y="96" width="60" height="34" rx="6" fill="#74c0fc"/>
    <text x="100" y="120" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#fff">MILK</text>`),
  water: wrap(`${shadow(100, 168, 34)}
    <path d="M100 48 C 76 84 64 108 64 128 a36 36 0 0 0 72 0 C 136 108 124 84 100 48 Z" fill="#a5d8ff" opacity="0.9"/>
    <path d="M100 48 C 76 84 64 108 64 128 a36 36 0 0 0 72 0 C 136 108 124 84 100 48 Z" fill="none" stroke="#339af0" stroke-width="4"/>
    <path d="M80 126 q10 -8 20 0 q10 8 20 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`),
  bread: wrap(`${shadow(100, 168, 46)}
    <path d="M48 110 q0 -34 52 -34 q52 0 52 34 v22 q0 12 -12 12 h-80 q-12 0 -12 -12z" fill="#e0a458"/>
    <path d="M48 110 q0 -34 52 -34 q52 0 52 34 v6 h-104z" fill="#f0c078"/>
    <g stroke="#c77f3a" stroke-width="4" stroke-linecap="round"><path d="M76 92 l10 12"/><path d="M100 86 l0 14"/><path d="M124 92 l-10 12"/></g>`),
  cheese: wrap(`${shadow(100, 168, 46)}
    <path d="M40 128 L160 96 L160 140 q0 10 -10 10 h-100 q-10 0 -10 -10z" fill="#ffd93b"/>
    <path d="M40 128 L160 96 L160 108 L40 140z" fill="#fcc419"/>
    <circle cx="96" cy="126" r="8" fill="#f08c00"/><circle cx="128" cy="118" r="6" fill="#f08c00"/><circle cx="112" cy="134" r="5" fill="#f08c00"/><circle cx="144" cy="126" r="4" fill="#f08c00"/>`),
  egg: wrap(`${shadow(100, 168, 30)}
    <path d="M100 52 C 78 84 68 106 68 126 a32 32 0 0 0 64 0 C 132 106 122 84 100 52 Z" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <path d="M86 120 a32 32 0 0 0 28 12" stroke="#ffe066" stroke-width="6" fill="none" stroke-linecap="round"/>`),
  cake: wrap(`${shadow(100, 168, 48)}
    <rect x="56" y="110" width="88" height="42" rx="8" fill="#ff8fab"/>
    <rect x="56" y="88" width="88" height="30" rx="8" fill="#fcc2d7"/>
    <path d="M56 118 q11 12 22 0 q11 12 22 0 q11 12 22 0 q11 12 22 0 v-8 h-88z" fill="#fff"/>
    <rect x="96" y="64" width="8" height="24" rx="3" fill="#74c0fc"/>
    <path d="M100 52 q8 8 0 14 q-8 -6 0 -14z" fill="#ffd43b"/>
    <circle cx="76" cy="102" r="4" fill="#fff"/><circle cx="100" cy="98" r="4" fill="#fff"/><circle cx="124" cy="102" r="4" fill="#fff"/>`),
  cookie: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="106" r="46" fill="#c68642"/>
    <circle cx="100" cy="106" r="46" fill="none" stroke="#a06a2c" stroke-width="4"/>
    <g fill="#5b3413"><circle cx="84" cy="92" r="6"/><circle cx="114" cy="88" r="5"/><circle cx="98" cy="112" r="6"/><circle cx="122" cy="116" r="5"/><circle cx="80" cy="120" r="5"/></g>`),
  juice: wrap(`${shadow(100, 168, 34)}
    <rect x="72" y="76" width="56" height="86" rx="12" fill="#ffa94d"/>
    <rect x="72" y="76" width="56" height="20" rx="10" fill="#e8590c"/>
    <path d="M84 76 L88 52 h24 l4 24z" fill="#ffd8a8"/>
    <path d="M96 52 L100 34 L104 52z" fill="#ff6b6b"/>
    <circle cx="100" cy="126" r="16" fill="#fff" opacity="0.85"/>
    <path d="M100 118 a8 8 0 0 1 8 8 h-16 a8 8 0 0 1 8 -8z" fill="#ff922b"/>`),
  head: wrap(`${shadow(100, 168, 44)}
    <circle cx="100" cy="104" r="46" fill="#ffd8b8"/>
    <path d="M54 100 q0 -48 46 -48 q46 0 46 48 q-10 -22 -46 -22 q-36 0 -46 22z" fill="#6b4226"/>
    <circle cx="84" cy="100" r="8" fill="#fff"/><circle cx="86" cy="102" r="4" fill="#2d2d2d"/>
    <circle cx="116" cy="100" r="8" fill="#fff"/><circle cx="118" cy="102" r="4" fill="#2d2d2d"/>
    <path d="M100 106 v10" stroke="#e0a878" stroke-width="3" stroke-linecap="round"/>
    <path d="M86 126 q14 12 28 0" stroke="#c17b4e" stroke-width="4" fill="none" stroke-linecap="round"/>`),
  hair: wrap(`${shadow(100, 168, 44)}
    <circle cx="100" cy="106" r="44" fill="#ffd8b8"/>
    <path d="M56 104 q-4 -52 44 -52 q48 0 44 52 q-6 -18 -14 -24 q2 10 -2 14 q-4 -18 -14 -22 q0 10 -4 12 q-6 -16 -16 -16 q-2 8 -6 10 q-10 -8 -18 -2 q-8 8 -6 24z" fill="#6b4226"/>`),
  eyes: wrap(`${shadow(100, 168, 44)}
    <g><ellipse cx="72" cy="104" rx="26" ry="30" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <circle cx="72" cy="108" r="13" fill="#74c0fc"/><circle cx="72" cy="108" r="6" fill="#1c3d5a"/><circle cx="77" cy="102" r="3" fill="#fff"/></g>
    <g><ellipse cx="132" cy="104" rx="26" ry="30" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <circle cx="132" cy="108" r="13" fill="#74c0fc"/><circle cx="132" cy="108" r="6" fill="#1c3d5a"/><circle cx="137" cy="102" r="3" fill="#fff"/></g>`),
  ears: wrap(`${shadow(100, 168, 44)}
    <path d="M62 118 q-22 -8 -20 -34 q18 -6 30 10z" fill="#ffd8b8" stroke="#e0a878" stroke-width="3"/>
    <path d="M138 118 q22 -8 20 -34 q-18 -6 -30 10z" fill="#ffd8b8" stroke="#e0a878" stroke-width="3"/>
    <path d="M66 108 q-10 -4 -8 -18 q8 -3 14 6z" fill="#ffb3a0"/>
    <path d="M134 108 q10 -4 8 -18 q-8 -3 -14 6z" fill="#ffb3a0"/>`),
  nose: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="106" r="46" fill="#ffd8b8" opacity="0.35"/>
    <path d="M74 92 q26 -18 52 0 q6 30 -26 44 q-32 -14 -26 -44z" fill="#ffd8b8"/>
    <path d="M100 96 q-12 0 -14 12 q0 12 14 18 q14 -6 14 -18 q-2 -12 -14 -12z" fill="#e8590c"/>
    <ellipse cx="94" cy="112" rx="4" ry="6" fill="#fff" opacity="0.6"/>`),
  mouth: wrap(`${shadow(100, 168, 40)}
    <path d="M56 92 q44 -16 88 0 q4 40 -20 54 q-24 12 -48 0 q-24 -14 -20 -54z" fill="#ffd8b8"/>
    <path d="M64 100 q36 -10 72 0 q-4 30 -36 40 q-32 -10 -36 -40z" fill="#c2255c"/>
    <path d="M70 104 q30 -6 60 0 l-4 8 q-26 -5 -52 0z" fill="#fff"/>`),
  teeth: wrap(`${shadow(100, 168, 40)}
    <path d="M62 96 q38 -12 76 0 v14 h-76z" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <g stroke="#dee2e6" stroke-width="2.5"><path d="M81 96 v14"/><path d="M100 96 v14"/><path d="M119 96 v14"/></g>
    <path d="M62 118 q38 14 76 0 v10 q-38 12 -76 0z" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <g stroke="#dee2e6" stroke-width="2.5"><path d="M81 118 v10"/><path d="M100 118 v12"/><path d="M119 118 v10"/></g>`),
  arms: wrap(`${shadow(100, 168, 44)}
    <path d="M70 96 q-26 10 -30 34" stroke="#ffd8b8" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M130 96 q26 10 30 34" stroke="#ffd8b8" stroke-width="16" fill="none" stroke-linecap="round"/>
    <circle cx="40" cy="134" r="11" fill="#ffd8b8"/><circle cx="160" cy="134" r="11" fill="#ffd8b8"/>`),
  hands: wrap(`${shadow(100, 168, 40)}
    <path d="M100 84 v40" stroke="#ffd8b8" stroke-width="14" stroke-linecap="round"/>
    <circle cx="100" cy="140" r="22" fill="#ffd8b8"/>
    <g stroke="#e0a878" stroke-width="3.5" stroke-linecap="round"><path d="M100 124 v-14"/><path d="M86 130 l-10 -8"/><path d="M114 130 l10 -8"/><path d="M82 142 l-12 -2"/><path d="M118 142 l12 -2"/></g>`),
  legs: wrap(`${shadow(100, 168, 44)}
    <path d="M80 92 q-6 40 -2 62" stroke="#ffd8b8" stroke-width="17" fill="none" stroke-linecap="round"/>
    <path d="M120 92 q6 40 2 62" stroke="#ffd8b8" stroke-width="17" fill="none" stroke-linecap="round"/>`),
  feet: wrap(`${shadow(100, 168, 44)}
    <ellipse cx="76" cy="128" rx="24" ry="15" fill="#ffd8b8"/><ellipse cx="124" cy="128" rx="24" ry="15" fill="#ffd8b8"/>
    <g stroke="#e0a878" stroke-width="3" stroke-linecap="round"><path d="M66 122 v10"/><path d="M76 120 v12"/><path d="M86 122 v10"/><path d="M114 122 v10"/><path d="M124 120 v12"/><path d="M134 122 v10"/></g>`),
  tummy: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="104" r="46" fill="#ffd8b8"/>
    <ellipse cx="100" cy="122" rx="26" ry="20" fill="#ffe9d6"/>
    <path d="M84 118 q16 10 32 0" stroke="#e0a878" stroke-width="3" fill="none" stroke-linecap="round"/>`),
  jump: wrap(`${shadow(100, 182, 36)}
    <circle cx="100" cy="52" r="16" fill="#ffd8b8"/>
    <path d="M84 50 q0 -16 16 -16 q16 0 16 16 q-8 -8 -16 -8 q-8 0 -16 8z" fill="#6b4226"/>
    <path d="M100 68 v34" stroke="#4dabf7" stroke-width="18" stroke-linecap="round"/>
    <path d="M100 74 L72 58 M100 74 L128 58" stroke="#4dabf7" stroke-width="10" stroke-linecap="round"/>
    <path d="M100 102 L82 130 M100 102 L118 130" stroke="#343a40" stroke-width="10" stroke-linecap="round"/>
    <path d="M60 150 q40 -14 80 0" stroke="#adb5bd" stroke-width="4" fill="none" stroke-dasharray="8 8" stroke-linecap="round"/>`),
  run: wrap(`${shadow(100, 176, 40)}
    <circle cx="116" cy="48" r="15" fill="#ffd8b8"/>
    <path d="M102 46 q2 -16 16 -14 q12 2 12 14 q-8 -8 -14 -6 q-8 0 -14 6z" fill="#6b4226"/>
    <path d="M112 62 L96 96" stroke="#ffa94d" stroke-width="17" stroke-linecap="round"/>
    <path d="M106 70 L76 82 M106 70 L134 58" stroke="#ffa94d" stroke-width="9" stroke-linecap="round"/>
    <path d="M96 96 L70 116 M96 96 L122 122" stroke="#343a40" stroke-width="9" stroke-linecap="round"/>
    <g stroke="#adb5bd" stroke-width="4" stroke-linecap="round"><path d="M52 96 h-16"/><path d="M56 108 h-14"/><path d="M62 120 h-12"/></g>`),
  stop: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="104" r="46" fill="none" stroke="#fa5252" stroke-width="12"/>
    <path d="M68 72 L132 136" stroke="#fa5252" stroke-width="12" stroke-linecap="round"/>
    <circle cx="100" cy="104" r="14" fill="#ffd8b8" opacity="0.6"/>`),
  clap: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="62" r="16" fill="#ffd8b8"/>
    <path d="M86 60 q0 -16 14 -16 q14 0 14 16 q-7 -8 -14 -8 q-7 0 -14 8z" fill="#6b4226"/>
    <path d="M100 78 v26" stroke="#51cf66" stroke-width="16" stroke-linecap="round"/>
    <ellipse cx="82" cy="118" rx="16" ry="12" fill="#ffd8b8" transform="rotate(-24 82 118)"/>
    <ellipse cx="118" cy="118" rx="16" ry="12" fill="#ffd8b8" transform="rotate(24 118 118)"/>
    <g stroke="#ffd43b" stroke-width="4" stroke-linecap="round"><path d="M60 96 l-10 -6"/><path d="M140 96 l10 -6"/><path d="M100 34 v-12"/><path d="M74 48 l-8 -8"/><path d="M126 48 l8 -8"/></g>`),
  touch: wrap(`${shadow(100, 168, 40)}
    <circle cx="82" cy="66" r="15" fill="#ffd8b8"/>
    <path d="M70 64 q0 -15 12 -15 q12 0 12 15 q-6 -7 -12 -7 q-6 0 -12 7z" fill="#6b4226"/>
    <path d="M82 80 v34" stroke="#845ef7" stroke-width="16" stroke-linecap="round"/>
    <path d="M82 88 L120 108" stroke="#845ef7" stroke-width="9" stroke-linecap="round"/>
    <circle cx="126" cy="112" r="10" fill="#ffd8b8"/>
    <g stroke="#ffd43b" stroke-width="4" stroke-linecap="round"><circle cx="126" cy="112" r="18" fill="none"/></g>`),
  sit: wrap(`${shadow(100, 176, 40)}
    <circle cx="100" cy="56" r="16" fill="#ffd8b8"/>
    <path d="M86 54 q0 -16 14 -16 q14 0 14 16 q-7 -8 -14 -8 q-7 0 -14 8z" fill="#6b4226"/>
    <path d="M100 72 v40" stroke="#ff922b" stroke-width="17" stroke-linecap="round"/>
    <path d="M100 112 h-34" stroke="#343a40" stroke-width="11" stroke-linecap="round"/>
    <path d="M66 112 v22" stroke="#343a40" stroke-width="11" stroke-linecap="round"/>
    <path d="M100 84 L76 100" stroke="#ff922b" stroke-width="9" stroke-linecap="round"/>`),
  stand: wrap(`${shadow(100, 176, 40)}
    <circle cx="100" cy="46" r="15" fill="#ffd8b8"/>
    <path d="M87 44 q0 -15 13 -15 q13 0 13 15 q-6 -7 -13 -7 q-7 0 -13 7z" fill="#6b4226"/>
    <path d="M100 62 v52" stroke="#20c997" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 70 L74 92 M100 70 L126 92" stroke="#20c997" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 114 v26 M84 140 h32" stroke="#343a40" stroke-width="9" stroke-linecap="round"/>`),
  turn: wrap(`${shadow(100, 172, 40)}
    <circle cx="100" cy="70" r="15" fill="#ffd8b8"/>
    <path d="M88 68 q0 -15 12 -15 q12 0 12 15 q-6 -7 -12 -7 q-6 0 -12 7z" fill="#6b4226"/>
    <path d="M100 86 v40" stroke="#f783ac" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 94 L72 108 M100 94 L128 108" stroke="#f783ac" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 126 v18" stroke="#343a40" stroke-width="9" stroke-linecap="round"/>
    <path d="M132 140 a34 34 0 1 1 -8 -30" stroke="#868e96" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M118 106 l8 6 l-10 4z" fill="#868e96"/>`),
  dance: wrap(`${shadow(100, 178, 38)}
    <circle cx="100" cy="50" r="15" fill="#ffd8b8"/>
    <path d="M87 48 q0 -15 13 -15 q13 0 13 15 q-6 -7 -13 -7 q-7 0 -13 7z" fill="#6b4226"/>
    <path d="M100 66 v34" stroke="#845ef7" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 72 L68 52 M100 72 L132 88" stroke="#845ef7" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 100 L84 136 M100 100 L118 132" stroke="#343a40" stroke-width="9" stroke-linecap="round"/>
    <g stroke="#ffd43b" stroke-width="4" stroke-linecap="round"><path d="M56 84 q8 -4 12 2"/><path d="M136 64 q8 2 10 10"/><path d="M140 112 q6 6 2 12"/></g>`),
  sleep: wrap(`${shadow(100, 168, 44)}
    <circle cx="100" cy="104" r="44" fill="#ffd8b8"/>
    <path d="M58 96 q0 -44 42 -44 q42 0 42 44 q-8 -20 -42 -20 q-34 0 -42 20z" fill="#495057"/>
    <path d="M80 104 q6 5 12 0 M108 104 q6 5 12 0" stroke="#5b3413" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M92 122 q8 6 16 0" stroke="#c17b4e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <g fill="#74c0fc" font-family="sans-serif" font-weight="bold"><text x="140" y="56" font-size="22">z</text><text x="152" y="40" font-size="28">Z</text></g>`),
  eat: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="66" r="16" fill="#ffd8b8"/>
    <path d="M86 64 q0 -16 14 -16 q14 0 14 16 q-7 -8 -14 -8 q-7 0 -14 8z" fill="#6b4226"/>
    <path d="M100 82 v30" stroke="#e8590c" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 90 L74 104" stroke="#e8590c" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 124 q-24 10 -26 26 q20 4 26 -10z" fill="#ff6b6b"/>
    <path d="M78 118 q-8 -4 -6 -12 q8 0 10 6z" fill="#51cf66"/>`),
  drink: wrap(`${shadow(100, 168, 38)}
    <rect x="76" y="84" width="48" height="72" rx="10" fill="#a5d8ff"/>
    <rect x="76" y="84" width="48" height="16" rx="8" fill="#339af0"/>
    <path d="M100 60 v-18" stroke="#ff6b6b" stroke-width="6" stroke-linecap="round"/>
    <circle cx="100" cy="66" r="16" fill="#ffd8b8"/>
    <path d="M88 64 q0 -14 12 -14 q12 0 12 14 q-6 -7 -12 -7 q-6 0 -12 7z" fill="#6b4226"/>
    <path d="M90 78 q10 6 20 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>`),
};

const colorArt = (hex: string): string =>
  wrap(`${shadow(100, 162, 44)}
    <circle cx="100" cy="104" r="46" fill="${hex}"/>
    <circle cx="84" cy="88" r="12" fill="#fff" opacity="0.35"/>`);

art['red'] = colorArt('#e03131');
art['blue'] = colorArt('#1971c2');
art['yellow'] = colorArt('#f08c00');
art['green'] = colorArt('#2f9e44');
art['orange'] = colorArt('#e8590c');
art['purple'] = colorArt('#9775fa');
art['pink'] = colorArt('#f783ac');
art['black'] = colorArt('#212529');
art['white'] = wrap(`${shadow(100, 162, 44)}
    <circle cx="100" cy="104" r="46" fill="#fff" stroke="#dee2e6" stroke-width="4"/>
    <circle cx="84" cy="88" r="12" fill="#f1f3f5"/>`);
art['brown'] = colorArt('#8b5a2b');

const numArt = (n: number): string =>
  wrap(`${shadow(100, 164, 48)}
    <circle cx="100" cy="102" r="50" fill="#fff" stroke="#ffd43b" stroke-width="6"/>
    <text x="100" y="122" text-anchor="middle" font-family="'Baloo 2','Comic Sans MS',sans-serif" font-size="58" font-weight="800" fill="#f08c00">${n}</text>`);

['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].forEach((w, i) => {
  art[w] = numArt(i + 1);
});

const n2: Record<string, string> = {
  mummy: wrap(`${shadow(100, 168, 42)}
    <circle cx="100" cy="70" r="26" fill="#ffd8b8"/>
    <path d="M74 66 q0 -28 26 -28 q26 0 26 28 q-8 -14 -26 -14 q-18 0 -26 14z" fill="#8b5a2b"/>
    <circle cx="92" cy="70" r="6" fill="#fff"/><circle cx="93.5" cy="71.5" r="3" fill="#2d2d2d"/>
    <circle cx="108" cy="70" r="6" fill="#fff"/><circle cx="109.5" cy="71.5" r="3" fill="#2d2d2d"/>
    <path d="M93 82 q7 5 14 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M100 96 v40" stroke="#f783ac" stroke-width="26" stroke-linecap="round"/>
    <path d="M100 104 L74 122 M100 104 L126 122" stroke="#f783ac" stroke-width="10" stroke-linecap="round"/>
    <path d="M100 136 L88 162 M100 136 L112 162" stroke="#845ef7" stroke-width="11" stroke-linecap="round"/>`),
  daddy: wrap(`${shadow(100, 168, 44)}
    <circle cx="100" cy="64" r="26" fill="#ffd8b8"/>
    <path d="M76 56 q4 -24 24 -24 q20 0 24 24 q-10 -10 -24 -10 q-14 0 -24 10z" fill="#343a40"/>
    <circle cx="92" cy="64" r="6" fill="#fff"/><circle cx="93.5" cy="65.5" r="3" fill="#2d2d2d"/>
    <circle cx="108" cy="64" r="6" fill="#fff"/><circle cx="109.5" cy="65.5" r="3" fill="#2d2d2d"/>
    <path d="M92 78 q8 6 16 0" stroke="#c17b4e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M100 90 v46" stroke="#1971c2" stroke-width="28" stroke-linecap="round"/>
    <path d="M100 98 L72 118 M100 98 L128 118" stroke="#1971c2" stroke-width="10" stroke-linecap="round"/>
    <path d="M100 136 L86 164 M100 136 L114 164" stroke="#343a40" stroke-width="12" stroke-linecap="round"/>`),
  baby: wrap(`${shadow(100, 168, 32)}
    <circle cx="100" cy="92" r="30" fill="#ffe3d0"/>
    <path d="M82 76 q18 -18 36 0 q-6 -12 -18 -12 q-12 0 -18 12z" fill="#ffd43b"/>
    <circle cx="90" cy="92" r="5" fill="#2d2d2d"/><circle cx="110" cy="92" r="5" fill="#2d2d2d"/>
    <path d="M94 104 q6 5 12 0" stroke="#e8896b" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="82" cy="100" r="5" fill="#ffb3a0" opacity="0.8"/><circle cx="118" cy="100" r="5" fill="#ffb3a0" opacity="0.8"/>
    <ellipse cx="100" cy="142" rx="34" ry="22" fill="#a5d8ff"/>`),
  brother: wrap(`${shadow(100, 168, 38)}
    <circle cx="100" cy="70" r="24" fill="#ffd8b8"/>
    <path d="M78 62 q2 -22 22 -22 q20 0 22 22 q-8 -10 -22 -10 q-14 0 -22 10z" fill="#5b3413"/>
    <circle cx="92" cy="70" r="5.5" fill="#fff"/><circle cx="93.5" cy="71.5" r="2.8" fill="#2d2d2d"/>
    <circle cx="108" cy="70" r="5.5" fill="#fff"/><circle cx="109.5" cy="71.5" r="2.8" fill="#2d2d2d"/>
    <path d="M93 82 q7 6 14 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M100 94 v38" stroke="#2f9e44" stroke-width="24" stroke-linecap="round"/>
    <path d="M100 102 L78 116 M100 102 L122 116" stroke="#2f9e44" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 132 L90 158 M100 132 L110 158" stroke="#343a40" stroke-width="10" stroke-linecap="round"/>`),
  sister: wrap(`${shadow(100, 168, 38)}
    <circle cx="100" cy="70" r="24" fill="#ffd8b8"/>
    <path d="M76 70 q0 -26 24 -26 q24 0 24 26 l6 22 q-30 10 -60 0z" fill="#e8590c"/>
    <circle cx="92" cy="70" r="5.5" fill="#fff"/><circle cx="93.5" cy="71.5" r="2.8" fill="#2d2d2d"/>
    <circle cx="108" cy="70" r="5.5" fill="#fff"/><circle cx="109.5" cy="71.5" r="2.8" fill="#2d2d2d"/>
    <path d="M93 82 q7 6 14 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M100 94 v34" stroke="#9775fa" stroke-width="24" stroke-linecap="round"/>
    <path d="M100 100 L80 114 M100 100 L120 114" stroke="#9775fa" stroke-width="9" stroke-linecap="round"/>
    <path d="M84 128 h32 l6 26 h-44z" fill="#9775fa"/>
    <path d="M92 154 v8 M108 154 v8" stroke="#ffd8b8" stroke-width="9" stroke-linecap="round"/>`),
  grandma: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="74" r="26" fill="#ffe3d0"/>
    <path d="M72 78 q-2 -34 28 -34 q30 0 28 34 q-4 -16 -28 -16 q-24 0 -28 16z" fill="#dee2e6"/>
    <circle cx="100" cy="40" r="10" fill="#dee2e6"/>
    <circle cx="90" cy="74" r="7" fill="#fff" stroke="#adb5bd" stroke-width="2.5"/><circle cx="91.5" cy="75" r="3" fill="#2d2d2d"/>
    <circle cx="110" cy="74" r="7" fill="#fff" stroke="#adb5bd" stroke-width="2.5"/><circle cx="111.5" cy="75" r="3" fill="#2d2d2d"/>
    <path d="M93 88 q7 5 14 0" stroke="#e8896b" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M100 100 v36" stroke="#868e96" stroke-width="24" stroke-linecap="round"/>`),
  grandpa: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="72" r="26" fill="#ffd8b8"/>
    <path d="M74 66 q0 -30 26 -30 q26 0 26 30 q-8 -12 -26 -12 q-18 0 -26 12z" fill="#adb5bd"/>
    <path d="M78 84 q-6 22 6 30 l-8 0 q-10 -16 -4 -30z" fill="#adb5bd"/>
    <path d="M122 84 q6 22 -6 30 l8 0 q10 -16 4 -30z" fill="#adb5bd"/>
    <circle cx="91" cy="72" r="6" fill="#fff"/><circle cx="92.5" cy="73" r="2.8" fill="#2d2d2d"/>
    <circle cx="109" cy="72" r="6" fill="#fff"/><circle cx="110.5" cy="73" r="2.8" fill="#2d2d2d"/>
    <path d="M92 86 q8 6 16 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M100 98 v38" stroke="#5c940d" stroke-width="24" stroke-linecap="round"/>`),
  tshirt: wrap(`${shadow(100, 168, 44)}
    <path d="M70 66 L46 84 L58 104 L70 94 V150 H130 V94 L142 104 L154 84 L130 66 Q116 80 100 80 Q84 80 70 66 Z" fill="#4dabf7"/>
    <path d="M84 66 Q100 78 116 66" stroke="#1971c2" stroke-width="4" fill="none"/>`),
  dress: wrap(`${shadow(100, 168, 42)}
    <path d="M82 58 h36 l6 26 q-24 10 -48 0z" fill="#f783ac"/>
    <path d="M82 84 q-16 40 -12 66 h60 q4 -26 -12 -66z" fill="#f783ac"/>
    <path d="M76 128 q24 8 48 0" stroke="#fff" stroke-width="4" fill="none" opacity="0.7"/>
    <path d="M80 142 q20 7 40 0" stroke="#fff" stroke-width="4" fill="none" opacity="0.7"/>`),
  shoes: wrap(`${shadow(100, 168, 46)}
    <path d="M52 96 q0 -14 14 -14 h20 q14 0 16 14 l4 26 q0 10 -10 10 h-44 q-10 0 -10 -10z" fill="#e03131"/>
    <path d="M52 96 q0 -14 14 -14 h6 v50 h-16 q-4 -18 -4 -36z" fill="#fff"/>
    <path d="M104 96 q0 -14 14 -14 h20 q14 0 16 14 l4 26 q0 10 -10 10 h-44 q-10 0 -10 -10z" fill="#e03131"/>
    <path d="M104 96 q0 -14 14 -14 h6 v50 h-16 q-4 -18 -4 -36z" fill="#fff"/>
    <g stroke="#343a40" stroke-width="3" stroke-linecap="round"><path d="M62 104 h20"/><path d="M62 114 h20"/><path d="M114 104 h20"/><path d="M114 114 h20"/></g>`),
  hat: wrap(`${shadow(100, 168, 44)}
    <path d="M64 108 q0 -44 36 -44 q36 0 36 44z" fill="#ff922b"/>
    <ellipse cx="100" cy="110" rx="52" ry="12" fill="#e8590c"/>
    <path d="M64 100 q36 12 72 0" stroke="#fab005" stroke-width="6" fill="none"/>`),
  socks: wrap(`${shadow(100, 168, 40)}
    <path d="M78 60 h24 v50 q0 10 10 14 q10 4 8 14 q-2 10 -14 8 l-16 -6 q-8 -18 -8 -80z" fill="#69db7c"/>
    <path d="M78 60 h24 v12 h-24z" fill="#fff"/>
    <path d="M104 60 h24 v50 q0 10 10 14 q10 4 8 14 q-2 10 -14 8 l-16 -6 q-8 -18 -8 -80z" fill="#69db7c"/>
    <path d="M104 60 h24 v12 h-24z" fill="#fff"/>`),
  house: wrap(`${shadow(100, 176, 56)}
    <rect x="52" y="92" width="96" height="70" fill="#ffd8a8"/>
    <path d="M42 96 L100 48 L158 96z" fill="#e8590c"/>
    <rect x="88" y="122" width="24" height="40" rx="4" fill="#a9713b"/>
    <circle cx="106" cy="142" r="3" fill="#ffd43b"/>
    <rect x="60" y="104" width="20" height="20" rx="4" fill="#a5d8ff" stroke="#fff" stroke-width="3"/>
    <rect x="120" y="104" width="20" height="20" rx="4" fill="#a5d8ff" stroke="#fff" stroke-width="3"/>
    <rect x="92" y="60" width="16" height="20" fill="#e8590c"/>`),
  bed: wrap(`${shadow(100, 172, 54)}
    <rect x="44" y="104" width="112" height="14" rx="6" fill="#a9713b"/>
    <rect x="44" y="118" width="10" height="40" rx="4" fill="#8b5a2b"/><rect x="146" y="118" width="10" height="40" rx="4" fill="#8b5a2b"/>
    <rect x="50" y="86" width="34" height="20" rx="8" fill="#fff"/>
    <rect x="54" y="100" width="102" height="18" rx="6" fill="#74c0fc"/>
    <rect x="54" y="96" width="102" height="10" rx="5" fill="#a5d8ff"/>`),
  table: wrap(`${shadow(100, 172, 52)}
    <rect x="48" y="92" width="104" height="12" rx="6" fill="#a9713b"/>
    <rect x="58" y="104" width="10" height="56" fill="#8b5a2b"/><rect x="132" y="104" width="10" height="56" fill="#8b5a2b"/>
    <circle cx="80" cy="86" r="10" fill="#ff8787"/><rect x="104" y="76" width="26" height="16" rx="4" fill="#ffd43b"/>`),
  chair: wrap(`${shadow(100, 172, 44)}
    <rect x="70" y="56" width="12" height="70" rx="5" fill="#a9713b"/><rect x="70" y="56" width="44" height="12" rx="5" fill="#a9713b"/>
    <rect x="82" y="68" width="32" height="10" rx="4" fill="#c98d4f"/>
    <rect x="70" y="110" width="52" height="12" rx="5" fill="#a9713b"/>
    <rect x="74" y="122" width="9" height="42" fill="#8b5a2b"/><rect x="108" y="122" width="9" height="42" fill="#8b5a2b"/>`),
  door: wrap(`${shadow(100, 172, 40)}
    <rect x="66" y="52" width="68" height="110" rx="6" fill="#a9713b"/>
    <rect x="74" y="62" width="52" height="42" rx="4" fill="#8b5a2b"/>
    <circle cx="122" cy="118" r="5" fill="#ffd43b"/>`),
  window: wrap(`${shadow(100, 168, 44)}
    <rect x="58" y="60" width="84" height="88" rx="8" fill="#a5d8ff" stroke="#8b5a2b" stroke-width="8"/>
    <path d="M100 60 v88 M58 104 h84" stroke="#8b5a2b" stroke-width="6"/>
    <circle cx="150" cy="42" r="10" fill="#ffd43b"/>`),
  ball: wrap(`${shadow(100, 166, 40)}
    <circle cx="100" cy="104" r="44" fill="#fff" stroke="#dee2e6" stroke-width="4"/>
    <path d="M100 60 a44 44 0 0 1 0 88 a30 30 0 0 1 0 -88z" fill="#e03131"/>
    <path d="M100 60 a44 44 0 0 0 0 88 a30 30 0 0 0 0 -88z" fill="#1971c2"/>
    <circle cx="100" cy="104" r="10" fill="#ffd43b"/>`),
  doll: wrap(`${shadow(100, 168, 36)}
    <circle cx="100" cy="66" r="20" fill="#ffd8b8"/>
    <path d="M80 62 q0 -22 20 -22 q20 0 20 22 q-8 -10 -20 -10 q-12 0 -20 10z" fill="#ffd43b"/>
    <circle cx="93" cy="66" r="4" fill="#2d2d2d"/><circle cx="107" cy="66" r="4" fill="#2d2d2d"/>
    <path d="M95 76 q5 4 10 0" stroke="#c17b4e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M84 88 h32 l8 56 h-48z" fill="#f783ac"/>
    <path d="M84 92 L66 108 M116 92 L134 108" stroke="#ffd8b8" stroke-width="8" stroke-linecap="round"/>`),
  car: wrap(`${shadow(100, 166, 48)}
    <path d="M40 118 q0 -22 22 -24 l14 -18 q4 -6 12 -6 h28 q8 0 12 6 l14 18 q22 2 22 24 v10 q0 8 -8 8 h-96 q-8 0 -8 -8z" fill="#e03131"/>
    <path d="M82 76 h36 l12 16 h-60z" fill="#a5d8ff"/>
    <circle cx="70" cy="134" r="14" fill="#343a40"/><circle cx="70" cy="134" r="6" fill="#adb5bd"/>
    <circle cx="130" cy="134" r="14" fill="#343a40"/><circle cx="130" cy="134" r="6" fill="#adb5bd"/>`),
  teddy: wrap(`${shadow(100, 168, 42)}
    <circle cx="76" cy="66" r="14" fill="#a9713b"/><circle cx="124" cy="66" r="14" fill="#a9713b"/>
    <circle cx="76" cy="66" r="7" fill="#e0b98a"/><circle cx="124" cy="66" r="7" fill="#e0b98a"/>
    <circle cx="100" cy="88" r="30" fill="#c98d4f"/>
    <ellipse cx="100" cy="96" rx="14" ry="11" fill="#e0b98a"/>
    <circle cx="90" cy="82" r="5.5" fill="#3a2008"/><circle cx="110" cy="82" r="5.5" fill="#3a2008"/>
    <ellipse cx="100" cy="92" rx="5" ry="4" fill="#3a2008"/>
    <ellipse cx="100" cy="126" rx="24" ry="20" fill="#c98d4f"/>
    <ellipse cx="72" cy="118" rx="11" ry="14" fill="#a9713b"/><ellipse cx="128" cy="118" rx="11" ry="14" fill="#a9713b"/>`),
  blocks: wrap(`${shadow(100, 168, 48)}
    <rect x="52" y="116" width="44" height="44" rx="6" fill="#e03131"/><text x="74" y="146" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#fff">A</text>
    <rect x="100" y="116" width="44" height="44" rx="6" fill="#1971c2"/><text x="122" y="146" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#fff">B</text>
    <rect x="76" y="70" width="44" height="44" rx="6" fill="#2f9e44"/><text x="98" y="100" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#fff">C</text>`),
  sun: wrap(`<circle cx="100" cy="100" r="34" fill="#ffd43b"/>
    <g stroke="#ffd43b" stroke-width="8" stroke-linecap="round">
      <path d="M100 34 v-18"/><path d="M100 166 v18"/><path d="M34 100 h-18"/><path d="M166 100 h18"/>
      <path d="M54 54 l-13 -13"/><path d="M146 54 l13 -13"/><path d="M54 146 l-13 13"/><path d="M146 146 l13 13"/>
    </g>
    <circle cx="88" cy="94" r="5" fill="#f08c00"/><circle cx="112" cy="94" r="5" fill="#f08c00"/>
    <path d="M88 110 q12 10 24 0" stroke="#f08c00" stroke-width="4" fill="none" stroke-linecap="round"/>`, '#fff9db'),
  cloud: wrap(`<g fill="#fff" stroke="#dee2e6" stroke-width="3">
      <ellipse cx="100" cy="108" rx="46" ry="28"/><circle cx="74" cy="94" r="22"/><circle cx="104" cy="82" r="26"/><circle cx="130" cy="98" r="20"/>
    </g>
    <path d="M80 150 l-6 16 M104 152 l-4 18 M126 150 l-8 14" stroke="#74c0fc" stroke-width="6" stroke-linecap="round"/>`, '#e7f5ff'),
  rain: wrap(`<g fill="#adb5bd"><ellipse cx="100" cy="84" rx="44" ry="26"/><circle cx="76" cy="72" r="20"/><circle cx="106" cy="62" r="24"/><circle cx="128" cy="76" r="18"/></g>
    <g stroke="#339af0" stroke-width="7" stroke-linecap="round"><path d="M74 116 l-8 22"/><path d="M100 120 l-8 24"/><path d="M126 116 l-8 22"/></g>`, '#e7f5ff'),
  tree: wrap(`${shadow(100, 172, 40)}
    <rect x="92" y="110" width="16" height="52" rx="6" fill="#8b5a2b"/>
    <circle cx="100" cy="82" r="38" fill="#51cf66"/><circle cx="70" cy="98" r="24" fill="#69db7c"/><circle cx="130" cy="98" r="24" fill="#69db7c"/>
    <circle cx="88" cy="74" r="6" fill="#ff6b6b"/><circle cx="114" cy="90" r="6" fill="#ff6b6b"/><circle cx="100" cy="60" r="5" fill="#ff6b6b"/>`, '#e9faef'),
  flower: wrap(`${shadow(100, 172, 36)}
    <path d="M100 160 v-52" stroke="#2f9e44" stroke-width="6"/>
    <path d="M100 128 q-18 -4 -20 -20 q18 2 20 20z" fill="#51cf66"/>
    <g fill="#f783ac"><circle cx="100" cy="72" r="14"/><circle cx="82" cy="88" r="14"/><circle cx="118" cy="88" r="14"/><circle cx="88" cy="106" r="14"/><circle cx="112" cy="106" r="14"/></g>
    <circle cx="100" cy="92" r="12" fill="#ffd43b"/>`, '#fff0f6'),
  rainbow: wrap(`<g fill="none" stroke-linecap="round">
      <path d="M40 140 a60 60 0 0 1 120 0" stroke="#e03131" stroke-width="10"/>
      <path d="M50 140 a50 50 0 0 1 100 0" stroke="#ff922b" stroke-width="10"/>
      <path d="M60 140 a40 40 0 0 1 80 0" stroke="#ffd43b" stroke-width="10"/>
      <path d="M70 140 a30 30 0 0 1 60 0" stroke="#51cf66" stroke-width="10"/>
      <path d="M80 140 a20 20 0 0 1 40 0" stroke="#4dabf7" stroke-width="10"/>
    </g>
    <g fill="#fff"><ellipse cx="40" cy="146" rx="18" ry="12"/><ellipse cx="160" cy="146" rx="18" ry="12"/></g>`, '#e7f5ff'),
  star: wrap(`<path d="M100 44 l15 32 35 5 -25 25 6 35 -31 -17 -31 17 6 -35 -25 -25 35 -5z" fill="#ffd43b" stroke="#f08c00" stroke-width="4" stroke-linejoin="round"/>`, '#fff9db'),
  moon: wrap(`<path d="M130 40 a62 62 0 1 0 30 116 a50 50 0 1 1 -30 -116z" fill="#ffd43b"/>
    <g fill="#ffd43b"><path d="M150 60 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z"/><path d="M60 140 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/></g>`, '#e7f5ff'),
  hello: wrap(`<rect x="34" y="70" width="132" height="64" rx="18" fill="#fff" stroke="#ff8c42" stroke-width="6"/>
    <path d="M60 134 l-10 22 l28 -18z" fill="#fff" stroke="#ff8c42" stroke-width="5"/>
    <text x="100" y="112" text-anchor="middle" font-family="sans-serif" font-size="30" font-weight="800" fill="#f2701d">Hello!</text>`, '#fff3e6'),
  goodbye: wrap(`<rect x="30" y="70" width="140" height="64" rx="18" fill="#fff" stroke="#845ef7" stroke-width="6"/>
    <path d="M140 134 l10 22 l-28 -18z" fill="#fff" stroke="#845ef7" stroke-width="5"/>
    <text x="100" y="112" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="800" fill="#7048e8">Bye bye!</text>`, '#f3f0ff'),
  please: wrap(`<circle cx="100" cy="100" r="48" fill="#fff" stroke="#69db7c" stroke-width="6"/>
    <path d="M100 66 v-14 M100 148 v-14 M66 100 h-14 M148 100 h-14" stroke="#69db7c" stroke-width="5" stroke-linecap="round"/>
    <path d="M78 104 q22 18 44 0" stroke="#2f9e44" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="86" cy="88" r="6" fill="#2d2d2d"/><circle cx="114" cy="88" r="6" fill="#2d2d2d"/>`, '#ebfbee'),
  thankyou: wrap(`<path d="M100 148 C 60 118 48 92 62 74 q12 -16 32 -4 q10 6 6 20 q-4 -14 -12 -12 q-14 4 -8 24 q8 26 20 44z" fill="#ff8787"/>
    <path d="M104 148 C 138 120 152 94 140 74 q-12 -16 -34 -6 q-8 6 -4 18 q6 -12 12 -10 q12 4 6 22 q-6 22 -20 40z" fill="#ff6b6b"/>`, '#fff0f0'),
  sorry: wrap(`<circle cx="100" cy="100" r="48" fill="#ffe3e3" stroke="#fa5252" stroke-width="5"/>
    <circle cx="84" cy="88" r="7" fill="#fff"/><circle cx="85.5" cy="89.5" r="3.5" fill="#2d2d2d"/>
    <circle cx="116" cy="88" r="7" fill="#fff"/><circle cx="117.5" cy="89.5" r="3.5" fill="#2d2d2d"/>
    <path d="M82 118 q18 -12 36 0" stroke="#c2255c" stroke-width="5" fill="none" stroke-linecap="round"/>`, '#fff5f5'),
  yes: wrap(`<circle cx="100" cy="100" r="50" fill="#ebfbee" stroke="#2f9e44" stroke-width="7"/>
    <path d="M74 102 l18 20 l36 -42" stroke="#2f9e44" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, '#ebfbee'),
  no: wrap(`<circle cx="100" cy="100" r="50" fill="#fff5f5" stroke="#e03131" stroke-width="7"/>
    <path d="M72 72 L128 128 M128 72 L72 128" stroke="#e03131" stroke-width="10" stroke-linecap="round"/>`, '#fff5f5'),
};

Object.assign(art, n2);

const n3: Record<string, string> = {
  happy: wrap(`<circle cx="100" cy="102" r="46" fill="#ffe066"/>
    <circle cx="84" cy="92" r="7" fill="#2d2d2d"/><circle cx="116" cy="92" r="7" fill="#2d2d2d"/>
    <path d="M80 112 q20 20 40 0" stroke="#a8760a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="70" cy="106" r="6" fill="#ffb3a0" opacity="0.8"/><circle cx="130" cy="106" r="6" fill="#ffb3a0" opacity="0.8"/>`, '#fff9db'),
  sad: wrap(`<circle cx="100" cy="102" r="46" fill="#a5d8ff"/>
    <circle cx="84" cy="92" r="7" fill="#2d2d2d"/><circle cx="116" cy="92" r="7" fill="#2d2d2d"/>
    <path d="M80 122 q20 -16 40 0" stroke="#1c5d99" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M76 76 q8 -10 16 0" stroke="#1c5d99" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M108 76 q8 -10 16 0" stroke="#1c5d99" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="140" cy="126" rx="6" ry="10" fill="#74c0fc"/>`, '#e7f5ff'),
  angry: wrap(`<circle cx="100" cy="102" r="46" fill="#ff8787"/>
    <path d="M70 82 l24 8 M130 82 l-24 8" stroke="#a11212" stroke-width="6" stroke-linecap="round"/>
    <circle cx="84" cy="96" r="7" fill="#fff"/><circle cx="86" cy="98" r="3.5" fill="#2d2d2d"/>
    <circle cx="116" cy="96" r="7" fill="#fff"/><circle cx="118" cy="98" r="3.5" fill="#2d2d2d"/>
    <path d="M82 124 q18 -10 36 0" stroke="#a11212" stroke-width="5" fill="none" stroke-linecap="round"/>`, '#fff0f0'),
  scared: wrap(`<circle cx="100" cy="102" r="46" fill="#e9ecef"/>
    <path d="M72 84 q10 -12 20 0 M108 84 q10 -12 20 0" stroke="#495057" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="84" cy="96" r="8" fill="#fff"/><circle cx="86" cy="98" r="4" fill="#2d2d2d"/>
    <circle cx="116" cy="96" r="8" fill="#fff"/><circle cx="118" cy="98" r="4" fill="#2d2d2d"/>
    <ellipse cx="100" cy="124" rx="9" ry="12" fill="#495057"/>
    <path d="M60 60 l10 6 M140 60 l-10 6" stroke="#adb5bd" stroke-width="4" stroke-linecap="round"/>`, '#f1f3f5'),
  tired: wrap(`<circle cx="100" cy="102" r="46" fill="#ffd8b8"/>
    <path d="M76 94 q8 6 16 0 M108 94 q8 6 16 0" stroke="#5b3413" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M90 120 q10 6 20 0" stroke="#c17b4e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g fill="#74c0fc" font-family="sans-serif" font-weight="bold"><text x="136" y="60" font-size="20">z</text><text x="148" y="44" font-size="26">Z</text></g>`, '#fff3e6'),
  hungry: wrap(`<circle cx="100" cy="102" r="46" fill="#ffe066"/>
    <circle cx="84" cy="92" r="7" fill="#fff"/><circle cx="86" cy="94" r="3.5" fill="#2d2d2d"/>
    <circle cx="116" cy="92" r="7" fill="#fff"/><circle cx="118" cy="94" r="3.5" fill="#2d2d2d"/>
    <ellipse cx="100" cy="122" rx="12" ry="9" fill="#a8760a"/>
    <ellipse cx="100" cy="128" rx="7" ry="4" fill="#ff8787"/>`),
  love: wrap(`<circle cx="100" cy="102" r="46" fill="#ffdeeb"/>
    <path d="M84 88 q-6 -8 2 -12 q6 -3 8 4 q2 -7 8 -4 q8 4 2 12 l-10 10z" fill="#e64980" transform="translate(6,-6) scale(1.1)"/>
    <circle cx="84" cy="96" r="6" fill="#2d2d2d"/><circle cx="116" cy="96" r="6" fill="#2d2d2d"/>
    <path d="M84 118 q16 12 32 0" stroke="#c2255c" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M100 34 C 70 54 62 70 70 82 q10 12 30 2 q20 10 30 -2 q8 -12 0 -30 C 130 54 130 54 100 34z" fill="#ff6b9d" opacity="0.9"/>`, '#fff0f6'),
  brush: wrap(`${shadow(100, 168, 40)}
    <rect x="88" y="56" width="24" height="60" rx="10" fill="#74c0fc"/>
    <rect x="80" y="112" width="40" height="34" rx="8" fill="#1971c2"/>
    <g stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M86 120 v18"/><path d="M94 120 v18"/><path d="M102 120 v18"/><path d="M110 120 v18"/></g>
    <circle cx="100" cy="46" r="8" fill="#fff"/>`),
  wash: wrap(`${shadow(100, 170, 44)}
    <path d="M56 108 h88 v34 q0 12 -12 12 h-64 q-12 0 -12 -12z" fill="#a5d8ff" stroke="#339af0" stroke-width="4"/>
    <path d="M64 108 q36 -18 72 0" stroke="#339af0" stroke-width="4" fill="#d0ebff"/>
    <g fill="#fff" opacity="0.9"><circle cx="84" cy="100" r="7"/><circle cx="106" cy="94" r="9"/><circle cx="124" cy="101" r="6"/></g>
    <path d="M100 84 v-16" stroke="#74c0fc" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="62" r="7" fill="#74c0fc"/>`),
  read: wrap(`${shadow(100, 170, 44)}
    <path d="M100 66 q-30 -14 -52 0 v78 q22 -14 52 0 q30 -14 52 0 v-78 q-22 -14 -52 0z" fill="#fff" stroke="#e0a458" stroke-width="4"/>
    <path d="M100 66 v78" stroke="#e0a458" stroke-width="4"/>
    <g stroke="#adb5bd" stroke-width="3" stroke-linecap="round"><path d="M60 82 q18 -8 34 0"/><path d="M60 96 q18 -8 34 0"/><path d="M60 110 q18 -8 34 0"/><path d="M106 82 q18 -8 34 0"/><path d="M106 96 q18 -8 34 0"/><path d="M106 110 q18 -8 34 0"/></g>`),
  play: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="72" r="18" fill="#ffd8b8"/>
    <path d="M86 68 q0 -16 14 -16 q14 0 14 16 q-7 -7 -14 -7 q-7 0 -14 7z" fill="#6b4226"/>
    <circle cx="94" cy="72" r="4" fill="#2d2d2d"/><circle cx="106" cy="72" r="4" fill="#2d2d2d"/>
    <path d="M94 82 q6 5 12 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M100 90 v30" stroke="#51cf66" stroke-width="20" stroke-linecap="round"/>
    <path d="M100 96 L76 84 M100 96 L124 84" stroke="#51cf66" stroke-width="9" stroke-linecap="round"/>
    <circle cx="66" cy="130" r="12" fill="#e03131"/><path d="M66 118 a12 12 0 0 1 0 24 a8 8 0 0 1 0 -24z" fill="#fff"/>`),
  draw: wrap(`${shadow(100, 170, 42)}
    <rect x="56" y="70" width="88" height="72" rx="6" fill="#fff" stroke="#dee2e6" stroke-width="4"/>
    <path d="M70 120 q14 -30 30 -12 q10 12 30 -14" stroke="#f783ac" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="118" cy="88" r="8" fill="#ffd43b"/>
    <path d="M128 142 L104 100" stroke="#e8590c" stroke-width="9" stroke-linecap="round"/><path d="M104 100 l-6 -12 l14 6z" fill="#e8590c"/>`),
  sing: wrap(`${shadow(100, 168, 40)}
    <circle cx="100" cy="76" r="20" fill="#ffd8b8"/>
    <path d="M84 72 q0 -18 16 -18 q16 0 16 18 q-8 -8 -16 -8 q-8 0 -16 8z" fill="#6b4226"/>
    <circle cx="93" cy="76" r="4" fill="#2d2d2d"/><circle cx="107" cy="76" r="4" fill="#2d2d2d"/>
    <ellipse cx="100" cy="90" rx="7" ry="9" fill="#c2255c"/>
    <path d="M100 96 v30" stroke="#9775fa" stroke-width="20" stroke-linecap="round"/>
    <g stroke="#9775fa" stroke-width="4" fill="none" stroke-linecap="round"><path d="M136 70 v-16"/><circle cx="136" cy="52" r="5" fill="#9775fa"/><path d="M136 54 q10 2 12 10"/><path d="M152 84 v-16"/><circle cx="152" cy="66" r="5" fill="#9775fa"/><path d="M152 68 q10 2 12 10"/></g>`),
  big: wrap(`${shadow(100, 168, 52)}
    <circle cx="76" cy="112" r="30" fill="#a5d8ff"/><circle cx="66" cy="104" r="6" fill="#2d2d2d"/>
    <path d="M60 128 q16 12 32 0" stroke="#1c5d99" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M130 60 L118 34 M142 66 L140 40 M154 74 L162 52" stroke="#adb5bd" stroke-width="5" stroke-linecap="round"/>
    <circle cx="138" cy="126" r="16" fill="#ffd43b"/><circle cx="132" cy="122" r="3.5" fill="#2d2d2d"/>`),
  small: wrap(`${shadow(100, 168, 36)}
    <circle cx="84" cy="126" r="18" fill="#a5d8ff"/><circle cx="78" cy="122" r="4" fill="#2d2d2d"/>
    <path d="M76 136 q8 6 16 0" stroke="#1c5d99" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="136" cy="84" r="10" fill="#ffd43b"/><circle cx="133" cy="82" r="2.5" fill="#2d2d2d"/>
    <path d="M120 108 l-8 -8 M146 108 l8 -8" stroke="#adb5bd" stroke-width="4" stroke-linecap="round"/>`),
  hot: wrap(`<circle cx="100" cy="102" r="46" fill="#ff922b"/>
    <path d="M100 60 q14 18 0 30 q-14 12 0 30" stroke="#e8590c" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M78 66 q-8 8 -4 16 M122 66 q8 8 4 16" stroke="#ffd43b" stroke-width="6" fill="none" stroke-linecap="round"/>`, '#fff3e6'),
  cold: wrap(`<circle cx="100" cy="102" r="46" fill="#a5d8ff"/>
    <g stroke="#1971c2" stroke-width="6" stroke-linecap="round"><path d="M100 62 v80"/><path d="M74 78 l52 48"/><path d="M126 78 l-52 48"/></g>
    <path d="M100 70 l-10 12 h20z M100 134 l-10 -12 h20z" fill="#1971c2"/>`, '#e7f5ff'),
  fast: wrap(`${shadow(100, 176, 40)}
    <circle cx="112" cy="56" r="15" fill="#ffd8b8"/>
    <path d="M100 54 q0 -15 12 -15 q12 0 12 15 q-6 -7 -12 -7 q-6 0 -12 7z" fill="#6b4226"/>
    <path d="M108 70 L92 104" stroke="#ffa94d" stroke-width="16" stroke-linecap="round"/>
    <path d="M104 78 L76 88 M104 78 L130 66" stroke="#ffa94d" stroke-width="9" stroke-linecap="round"/>
    <path d="M92 104 L70 128 M92 104 L116 130" stroke="#343a40" stroke-width="9" stroke-linecap="round"/>
    <g stroke="#adb5bd" stroke-width="4" stroke-linecap="round"><path d="M54 84 h-16"/><path d="M58 96 h-14"/><path d="M64 108 h-12"/></g>`),
  slow: wrap(`${shadow(100, 172, 40)}
    <circle cx="88" cy="60" r="15" fill="#ffd8b8"/>
    <path d="M76 58 q0 -15 12 -15 q12 0 12 15 q-6 -7 -12 -7 q-6 0 -12 7z" fill="#6b4226"/>
    <path d="M88 74 L100 104" stroke="#20c997" stroke-width="16" stroke-linecap="round"/>
    <path d="M94 82 L70 94 M94 82 L118 94" stroke="#20c997" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 104 L88 136 M100 104 L112 136" stroke="#343a40" stroke-width="9" stroke-linecap="round"/>
    <path d="M140 120 a30 30 0 1 1 -14 -24" stroke="#868e96" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M132 92 l-6 8 l10 2z" fill="#868e96"/>
    <text x="146" y="132" font-family="sans-serif" font-size="14" fill="#868e96">🐢</text>`),
  bus: wrap(`${shadow(100, 166, 52)}
    <rect x="36" y="72" width="128" height="62" rx="12" fill="#ffd43b"/>
    <rect x="48" y="82" width="26" height="22" rx="4" fill="#a5d8ff"/><rect x="82" y="82" width="26" height="22" rx="4" fill="#a5d8ff"/><rect x="116" y="82" width="26" height="22" rx="4" fill="#a5d8ff"/>
    <rect x="36" y="116" width="128" height="8" fill="#f08c00"/>
    <circle cx="62" cy="138" r="13" fill="#343a40"/><circle cx="62" cy="138" r="5.5" fill="#adb5bd"/>
    <circle cx="138" cy="138" r="13" fill="#343a40"/><circle cx="138" cy="138" r="5.5" fill="#adb5bd"/>`),
  bike: wrap(`${shadow(100, 168, 52)}
    <circle cx="62" cy="126" r="26" fill="none" stroke="#343a40" stroke-width="7"/>
    <circle cx="140" cy="126" r="26" fill="none" stroke="#343a40" stroke-width="7"/>
    <path d="M62 126 L92 84 L140 126 M92 84 L112 84 M92 84 L78 126" stroke="#e03131" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M140 126 L124 88" stroke="#e03131" stroke-width="7" stroke-linecap="round"/>
    <path d="M112 84 h20" stroke="#343a40" stroke-width="7" stroke-linecap="round"/>
    <circle cx="92" cy="126" r="7" fill="#343a40"/>`),
  plane: wrap(`${shadow(100, 176, 52)}
    <path d="M40 120 L160 96 L172 108 L150 116 L120 128 L60 128z" fill="#ced4da"/>
    <path d="M96 100 L84 62 L100 60 L116 96z" fill="#adb5bd"/>
    <path d="M104 118 L92 156 L106 156 L122 120z" fill="#adb5bd"/>
    <rect x="128" y="104" width="34" height="14" rx="7" fill="#74c0fc"/>
    <g stroke="#adb5bd" stroke-width="4" stroke-linecap="round"><path d="M30 96 q-8 -4 -10 -12"/><path d="M34 108 q-10 0 -16 -6"/></g>`, '#e7f5ff'),
  boat: wrap(`<path d="M40 118 h120 l-14 26 h-92z" fill="#a9713b"/>
    <path d="M40 118 h120 l-4 8 h-112z" fill="#8b5a2b"/>
    <path d="M100 116 V54" stroke="#8b5a2b" stroke-width="6"/>
    <path d="M104 58 L104 110 L146 110z" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <path d="M96 66 L96 110 L64 110z" fill="#ff8787"/>
    <g stroke="#74c0fc" stroke-width="5" fill="none" stroke-linecap="round"><path d="M30 156 q10 -8 20 0 q10 8 20 0 q10 -8 20 0 q10 8 20 0 q10 -8 20 0 q10 8 20 0"/></g>`, '#e7f5ff'),
  train: wrap(`${shadow(100, 166, 54)}
    <rect x="40" y="84" width="120" height="46" rx="10" fill="#868e96"/>
    <rect x="48" y="92" width="22" height="18" rx="4" fill="#a5d8ff"/><rect x="78" y="92" width="22" height="18" rx="4" fill="#a5d8ff"/><rect x="108" y="92" width="22" height="18" rx="4" fill="#a5d8ff"/>
    <rect x="136" y="72" width="24" height="58" rx="8" fill="#495057"/>
    <circle cx="64" cy="134" r="12" fill="#343a40"/><circle cx="64" cy="134" r="5" fill="#adb5bd"/>
    <circle cx="100" cy="134" r="12" fill="#343a40"/><circle cx="100" cy="134" r="5" fill="#adb5bd"/>
    <circle cx="136" cy="134" r="12" fill="#343a40"/><circle cx="136" cy="134" r="5" fill="#adb5bd"/>
    <path d="M148 60 q10 -10 4 -18" stroke="#adb5bd" stroke-width="6" fill="none" stroke-linecap="round"/>`),
  lion: wrap(`${shadow(100, 168, 48)}
    <g fill="#f0a840"><circle cx="100" cy="96" r="42"/><circle cx="66" cy="66" r="14"/><circle cx="86" cy="56" r="14"/><circle cx="114" cy="56" r="14"/><circle cx="134" cy="66" r="14"/></g>
    <circle cx="100" cy="100" r="32" fill="#ffd9a0"/>
    <circle cx="88" cy="94" r="6" fill="#2d2d2d"/><circle cx="112" cy="94" r="6" fill="#2d2d2d"/>
    <path d="M96 106 h8 l-4 6z" fill="#7a4a12"/>
    <path d="M92 114 q8 6 16 0" stroke="#7a4a12" stroke-width="3.5" fill="none" stroke-linecap="round"/>`),
  elephant: wrap(`${shadow(100, 168, 50)}
    <ellipse cx="100" cy="116" rx="50" ry="40" fill="#adb5bd"/>
    <circle cx="66" cy="88" r="26" fill="#adb5bd"/>
    <circle cx="42" cy="84" r="14" fill="#868e96"/><circle cx="90" cy="84" r="14" fill="#868e96"/>
    <path d="M52 104 q-8 30 8 44 q10 6 14 -4 q-10 -16 -6 -38z" fill="#868e96"/>
    <circle cx="60" cy="84" r="6" fill="#fff"/><circle cx="61.5" cy="85.5" r="3" fill="#2d2d2d"/>
    <path d="M76 138 v20 M118 138 v20" stroke="#868e96" stroke-width="14" stroke-linecap="round"/>`),
  monkey: wrap(`${shadow(100, 168, 44)}
    <circle cx="66" cy="62" r="14" fill="#a9713b"/><circle cx="134" cy="62" r="14" fill="#a9713b"/>
    <circle cx="66" cy="62" r="7" fill="#e0b98a"/><circle cx="134" cy="62" r="7" fill="#e0b98a"/>
    <circle cx="100" cy="92" r="30" fill="#a9713b"/>
    <ellipse cx="100" cy="100" rx="20" ry="17" fill="#e0b98a"/>
    <circle cx="90" cy="86" r="5.5" fill="#2d2d2d"/><circle cx="110" cy="86" r="5.5" fill="#2d2d2d"/>
    <ellipse cx="100" cy="98" rx="4.5" ry="3.5" fill="#5b3413"/>
    <path d="M92 106 q8 6 16 0" stroke="#5b3413" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M138 128 q26 2 22 22" stroke="#a9713b" stroke-width="6" fill="none" stroke-linecap="round"/>`),
  tiger: wrap(`${shadow(100, 168, 46)}
    <path d="M68 64 L60 38 L86 52 Z" fill="#f08c00"/><path d="M132 64 L140 38 L114 52 Z" fill="#f08c00"/>
    <ellipse cx="100" cy="104" rx="44" ry="40" fill="#f08c00"/>
    <g stroke="#e8590c" stroke-width="5" stroke-linecap="round"><path d="M78 84 l10 6"/><path d="M122 84 l-10 6"/><path d="M72 104 h14"/><path d="M114 104 h14"/><path d="M84 124 l8 5"/><path d="M116 124 l-8 5"/></g>
    <circle cx="84" cy="96" r="7" fill="#fff"/><circle cx="86" cy="98" r="3.5" fill="#2d2d2d"/>
    <circle cx="116" cy="96" r="7" fill="#fff"/><circle cx="118" cy="98" r="3.5" fill="#2d2d2d"/>
    <path d="M96 110 h8 l-4 6z" fill="#e8590c"/>
    <path d="M90 118 q10 8 20 0" stroke="#e8590c" stroke-width="3.5" fill="none" stroke-linecap="round"/>`),
  snake: wrap(`<path d="M40 140 q20 -24 44 -10 q24 14 48 -2 q20 -14 36 2" stroke="#69db7c" stroke-width="22" fill="none" stroke-linecap="round"/>
    <circle cx="168" cy="136" r="14" fill="#69db7c"/>
    <circle cx="172" cy="132" r="4.5" fill="#fff"/><circle cx="173.5" cy="133.5" r="2.2" fill="#2d2d2d"/>
    <path d="M176 142 q6 4 10 0" stroke="#e8590c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g stroke="#2f9e44" stroke-width="4" stroke-linecap="round"><path d="M80 128 l6 -8"/><path d="M110 122 l6 -8"/><path d="M140 124 l6 -8"/></g>`, '#e9faef'),
  bear: wrap(`${shadow(100, 168, 46)}
    <circle cx="72" cy="64" r="15" fill="#8b5a2b"/><circle cx="128" cy="64" r="15" fill="#8b5a2b"/>
    <circle cx="72" cy="64" r="7" fill="#c98d4f"/><circle cx="128" cy="64" r="7" fill="#c98d4f"/>
    <circle cx="100" cy="96" r="36" fill="#8b5a2b"/>
    <ellipse cx="100" cy="106" rx="18" ry="14" fill="#c98d4f"/>
    <circle cx="87" cy="90" r="6" fill="#2d2d2d"/><circle cx="113" cy="90" r="6" fill="#2d2d2d"/>
    <ellipse cx="100" cy="102" rx="6" ry="4.5" fill="#3a2008"/>
    <path d="M92 112 q8 6 16 0" stroke="#3a2008" stroke-width="3.5" fill="none" stroke-linecap="round"/>`),
  whatsThis: wrap(`<circle cx="84" cy="100" r="40" fill="none" stroke="#845ef7" stroke-width="8"/>
    <path d="M114 130 L146 162" stroke="#845ef7" stroke-width="10" stroke-linecap="round"/>
    <text x="84" y="114" text-anchor="middle" font-family="sans-serif" font-size="40" font-weight="800" fill="#7048e8">?</text>`, '#f3f0ff'),
  whosThis: wrap(`<circle cx="100" cy="88" r="26" fill="#ffd8b8"/>
    <path d="M78 84 q0 -24 22 -24 q22 0 22 24 q-8 -10 -22 -10 q-14 0 -22 10z" fill="#6b4226"/>
    <circle cx="92" cy="88" r="4.5" fill="#2d2d2d"/><circle cx="108" cy="88" r="4.5" fill="#2d2d2d"/>
    <path d="M94 100 q6 5 12 0" stroke="#c17b4e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="146" y="140" font-family="sans-serif" font-size="44" font-weight="800" fill="#845ef7">?</text>`, '#f3f0ff'),
  howMany: wrap(`<g font-family="'Baloo 2',sans-serif" font-weight="800" text-anchor="middle">
      <text x="66" y="92" font-size="40" fill="#f2701d">1</text>
      <text x="104" y="112" font-size="48" fill="#2f9e44">2</text>
      <text x="140" y="88" font-size="36" fill="#1971c2">3</text>
    </g>
    <text x="100" y="156" text-anchor="middle" font-family="sans-serif" font-size="30" font-weight="800" fill="#845ef7">?</text>`, '#f3f0ff'),
};

Object.assign(art, n3);

const sceneFarm = wrap(`${shadow(100, 180, 60)}
    <rect x="0" y="140" width="200" height="60" fill="#8ce99a"/>
    <circle cx="160" cy="40" r="18" fill="#ffd43b"/>
    <ellipse cx="60" cy="70" rx="26" ry="22" fill="#f5a623"/><ellipse cx="60" cy="82" rx="16" ry="12" fill="#ffe3b3"/>
    <circle cx="52" cy="66" r="5" fill="#2d2d2d"/><circle cx="68" cy="66" r="5" fill="#2d2d2d"/>
    <ellipse cx="140" cy="90" rx="30" ry="26" fill="#fff"/><circle cx="128" cy="84" r="6" fill="#2d2d2d"/><circle cx="152" cy="84" r="6" fill="#2d2d2d"/>
    <ellipse cx="140" cy="98" rx="14" ry="9" fill="#f8dbe4"/>`, '#e7f5ff');

const scenePark = wrap(`${shadow(100, 180, 60)}
    <rect x="0" y="140" width="200" height="60" fill="#8ce99a"/>
    <circle cx="40" cy="44" r="16" fill="#ffd43b"/>
    <path d="M120 140 v-40" stroke="#8b5a2b" stroke-width="8"/>
    <circle cx="120" cy="84" r="26" fill="#51cf66"/><circle cx="100" cy="96" r="18" fill="#69db7c"/><circle cx="140" cy="96" r="18" fill="#69db7c"/>`, '#e7f5ff');

export function wordArt(id: string): string {
  return art[id] ?? sceneFarm;
}

export const scenes: Record<string, string> = { farm: sceneFarm, park: scenePark };
