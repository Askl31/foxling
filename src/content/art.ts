const wrap = (body: string, bg = '#fff8f0') =>
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
