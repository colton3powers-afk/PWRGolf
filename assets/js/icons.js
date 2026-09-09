/* PWR icon set — inline SVG strings. Jaguar mark + club silhouettes + UI glyphs. */
window.PWR_ICONS = (function(){
  // Angular jaguar head mark — the personality piece. Use small and subtle.
  const jaguar = (cls='') => `<svg class="${cls}" viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M60 8 L84 20 L96 10 L98 42 L110 62 L98 80 L88 104 L60 114 L32 104 L22 80 L10 62 L22 42 L24 10 L36 20 Z" opacity=".95"/>
  <path fill="#ffffff" opacity=".9" d="M60 44 L72 52 L68 64 L60 60 L52 64 L48 52 Z"/>
  <path fill="#ffffff" opacity=".9" d="M34 48 L46 44 L48 54 L36 56 Z M86 48 L74 44 L72 54 L84 56 Z"/>
  <path fill="#ffffff" opacity=".9" d="M60 70 L70 78 L66 88 L60 84 L54 88 L50 78 Z"/>
  <path fill="#ffffff" opacity=".6" d="M28 26 L36 30 L32 38 Z M92 26 L84 30 L88 38 Z M20 66 L28 70 L22 78 Z M100 66 L92 70 L98 78 Z M40 92 L48 96 L42 104 Z M80 92 L72 96 L78 104 Z"/>
</svg>`;

  // Club silhouettes (side-ish views). Light strokes on dark — designed for the product card "ph" box.
  const stroke = 'fill="none" stroke="#e9e7df" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"';
  const shaft = `<line x1="30" y1="10" x2="86" y2="98" stroke="#b9bcc4" stroke-width="3" stroke-linecap="round"/><path d="M28 6 l8 -4 l6 8 l-8 4z" fill="#333" stroke="#777"/>`;
  const driver = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shaft}<path d="M84 96 C60 92 44 104 46 116 C50 126 96 128 120 118 C136 112 132 96 116 92 C104 90 92 92 84 96 Z" fill="#111" stroke="#e9e7df" stroke-width="2.2"/><path d="M88 100 c14 -3 26 0 30 6" ${stroke} opacity=".6"/></svg>`;
  const wood = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shaft}<path d="M84 98 C66 96 52 104 54 114 C58 122 96 124 114 116 C126 110 122 98 110 96 C100 94 90 96 84 98 Z" fill="#111" stroke="#e9e7df" stroke-width="2.2"/></svg>`;
  const hybrid = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shaft}<path d="M84 100 C70 98 58 104 60 112 C64 120 96 122 110 114 C120 108 116 100 106 98 C98 96 90 98 84 100 Z" fill="#111" stroke="#e9e7df" stroke-width="2.2"/></svg>`;
  const iron = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shaft}<path d="M84 96 L88 108 L124 116 L128 104 L118 88 L92 90 Z" fill="#2b2e33" stroke="#e9e7df" stroke-width="2.2"/><path d="M96 96 h18 M97 101 h18 M98 106 h18" stroke="#9a9da4" stroke-width="1.4"/></svg>`;
  const wedge = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shaft}<path d="M84 96 L86 110 L124 118 L132 106 L122 84 L94 88 Z" fill="#2b2e33" stroke="#e9e7df" stroke-width="2.2"/><path d="M96 94 h20 M97 99 h20 M98 104 h20 M99 109 h18" stroke="#9a9da4" stroke-width="1.4"/></svg>`;
  const putter = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><line x1="60" y1="8" x2="80" y2="100" stroke="#b9bcc4" stroke-width="3" stroke-linecap="round"/><path d="M58 4 l10 -2 l3 10 l-10 2z" fill="#333" stroke="#777"/><path d="M52 104 h60 v10 h-60 z" fill="#2b2e33" stroke="#e9e7df" stroke-width="2.2"/><path d="M62 104 v-6 h40 v6" ${stroke}/></svg>`;
  const set = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke="#b9bcc4" stroke-width="2.5" stroke-linecap="round"><line x1="40" y1="8" x2="70" y2="100"/><line x1="52" y1="8" x2="78" y2="100"/><line x1="64" y1="8" x2="86" y2="100"/><line x1="76" y1="8" x2="94" y2="100"/></g><path d="M66 96 L70 108 L104 116 L110 104 L100 88 L74 90 Z" fill="#2b2e33" stroke="#e9e7df" stroke-width="2.2"/><path d="M78 92 L82 104 L116 112 L122 100 L112 84 L86 86 Z" fill="#2b2e33" stroke="#e9e7df" stroke-width="2.2" opacity=".7"/></svg>`;
  const shaftIco = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><line x1="20" y1="100" x2="120" y2="20" stroke="#c9c7c0" stroke-width="5" stroke-linecap="round"/><line x1="20" y1="100" x2="60" y2="68" stroke="#111" stroke-width="5" stroke-linecap="round"/><rect x="86" y="42" width="22" height="8" transform="rotate(-38 97 46)" fill="#111" stroke="#e9e7df"/></svg>`;
  const grip = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M30 96 L100 26 l10 10 L40 106 Z" fill="#111" stroke="#e9e7df" stroke-width="2.2"/><path d="M40 86 l60 -60 M48 94 l60 -60 M36 80 l52 -52" stroke="#555" stroke-width="1.5"/><line x1="104" y1="30" x2="124" y2="10" stroke="#b9bcc4" stroke-width="4" stroke-linecap="round"/></svg>`;
  const ball = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="70" cy="62" r="40" fill="#f0efe8" stroke="#bbb"/><g fill="#ccc"><circle cx="58" cy="50" r="3"/><circle cx="72" cy="46" r="3"/><circle cx="86" cy="52" r="3"/><circle cx="52" cy="64" r="3"/><circle cx="66" cy="60" r="3"/><circle cx="80" cy="64" r="3"/><circle cx="92" cy="68" r="3"/><circle cx="58" cy="78" r="3"/><circle cx="72" cy="76" r="3"/><circle cx="86" cy="80" r="3"/><circle cx="70" cy="90" r="3"/></g></svg>`;
  const bag = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M48 30 h44 l4 80 h-52 z" fill="#111" stroke="#e9e7df" stroke-width="2.2"/><ellipse cx="70" cy="30" rx="22" ry="8" fill="#2b2e33" stroke="#e9e7df" stroke-width="2.2"/><g stroke="#b9bcc4" stroke-width="2.5" stroke-linecap="round"><line x1="60" y1="26" x2="54" y2="6"/><line x1="70" y1="24" x2="70" y2="4"/><line x1="80" y1="26" x2="88" y2="6"/></g><path d="M52 60 h36" stroke="#555"/></svg>`;
  const glove = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M50 110 V60 c0-6 4-10 10-10 h2 V30 c0-4 3-7 7-7 s7 3 7 7 v18 h3 V22 c0-4 3-7 7-7 s7 3 7 7 v26 h3 V32 c0-4 3-7 7-7 s7 3 7 7 v50 c0 16-10 28-26 28 z" fill="#f0efe8" stroke="#bbb" stroke-width="2"/></svg>`;
  const acc = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="70" cy="60" r="34" fill="none" stroke="#e9e7df" stroke-width="2.2"/><circle cx="70" cy="60" r="6" fill="#e9e7df"/><path d="M70 26 v10 M70 84 v10 M36 60 h10 M94 60 h10" stroke="#e9e7df" stroke-width="2.2"/></svg>`;
  const apparel = `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M44 30 L62 22 c4 6 12 6 16 0 L96 30 L108 52 L94 58 V104 H46 V58 L32 52 Z" fill="#111" stroke="#e9e7df" stroke-width="2.2"/></svg>`;

  // UI glyphs
  const search = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>`;
  const user = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>`;
  const cart = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 4h2l2.5 11h11L21 7H7"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/></svg>`;
  const menu = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`;
  const wrench = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M30 6a10 10 0 0 0-9 14L7 34l7 7 14-14a10 10 0 0 0 14-9l-6 6-6-2-2-6z"/></svg>`;
  const launch = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 40h36M10 40c2-14 10-24 22-30"/><circle cx="34" cy="8" r="3"/><path d="M14 40l6-10M22 40l4-8"/></svg>`;
  const screen = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="40" height="26" rx="2"/><path d="M24 34v8M14 42h20M12 26c6-8 18-8 24 0"/><circle cx="24" cy="30" r="1.5"/></svg>`;
  const swap = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18h30l-8-8M40 30H10l8 8"/></svg>`;
  const build = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 40L34 14M30 10l8 8M26 14l8 8M12 36l-4 4"/><path d="M36 6l6 6-4 4-6-6z"/></svg>`;
  const star = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7 7 .6-5.3 4.7L18.5 22 12 18l-6.5 4 1.8-7.7L2 9.6 9 9z"/></svg>`;
  const lock = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="10" width="16" height="11" rx="1.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`;
  const pin = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>`;

  const byCat = {driver,wood,hybrid,iron,wedge,putter,set,shaft:shaftIco,grip,ball,bag,glove,accessory:acc,apparel};
  return {jaguar,driver,wood,hybrid,iron,wedge,putter,set,shaft:shaftIco,grip,ball,bag,glove,accessory:acc,apparel,search,user,cart,menu,wrench,launch,screen,swap,build,star,lock,pin,byCat};
})();
