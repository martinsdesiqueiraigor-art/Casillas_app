// icons.js — Ícones SVG customizados do Casillas App
// Estilo: linha fina (stroke), cor herdada (currentColor)
// Uso: import { ICONS } from '../icons.js'; ICONS.trig(24)

// ═══════════════════════════════════════════════════════════
// LOTE 1 — 6 SVGs principais
// ═══════════════════════════════════════════════════════════

// 1. Trigonometria — triângulo retângulo com ângulo
export function iconTrig(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 20 L4 4 L20 20 Z" />
    <path d="M4 16 A4 4 0 0 0 8 20" />
  </svg>`;
}

// 2. Roscas — rosca em corte (parafuso estilizado)
export function iconRosca(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 3 L6 21" />
    <path d="M18 3 L18 21" />
    <path d="M6 6 L18 4" />
    <path d="M6 10 L18 8" />
    <path d="M6 14 L18 12" />
    <path d="M6 18 L18 16" />
    <path d="M6 22 L18 20" />
  </svg>`;
}

// 3. Programação CNC — código G (monitor + G)
export function iconCNC(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="13" rx="1.5" />
    <path d="M9 8 L7 12 L9 16" />
    <path d="M15 8 L17 12 L15 16" />
    <path d="M10 20 L14 20" />
    <path d="M12 17 L12 20" />
  </svg>`;
}

// 4. Chaveta DIN 6885 — chaveta + eixo
export function iconChaveta(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <rect x="11" y="4" width="2" height="4" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="9" y="16" width="6" height="2" rx="0.5" />
  </svg>`;
}

// 5. Consultoria — headset (atendimento)
export function iconConsult(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 14 V12 A8 8 0 0 1 20 12 V14" />
    <rect x="3" y="14" width="3" height="5" rx="1" />
    <rect x="18" y="14" width="3" height="5" rx="1" />
    <path d="M20 19 V20 A2 2 0 0 1 18 22 H14" />
  </svg>`;
}

// 6. Tolerâncias ISO — paquímetro (medição)
export function iconTol(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="2" y="6" width="20" height="4" rx="0.5" />
    <path d="M5 10 L5 14" />
    <path d="M19 10 L19 14" />
    <rect x="10" y="14" width="4" height="3" rx="0.5" />
    <path d="M11 17 L11 20" />
    <path d="M13 17 L13 20" />
  </svg>`;
}

// ═══════════════════════════════════════════════════════════
// LOTE 2 — 5 SVGs secundários
// ═══════════════════════════════════════════════════════════

// 7. Conicidade — cone com eixo
export function iconConi(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 6 L20 6 L20 18 L4 18 Z" />
    <path d="M4 6 L12 12 L4 18" />
    <path d="M12 12 L20 12" />
  </svg>`;
}

// 8. Polígonos — hexágono com diagonais
export function iconPoly(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" />
    <path d="M12 3 L12 21" stroke-dasharray="2 2" />
    <path d="M4 7.5 L20 16.5" stroke-dasharray="2 2" />
    <path d="M20 7.5 L4 16.5" stroke-dasharray="2 2" />
  </svg>`;
}

// 9. Furação Circular — broca + furo
export function iconFuros(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="20.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="20.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>`;
}

// 10. Potência de Corte — torno + cavaco
export function iconPotencia(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 20 L4 10 L20 10 L20 20" />
    <circle cx="12" cy="15" r="3" />
    <path d="M8 6 L16 6" />
    <path d="M10 3 L14 3" />
    <path d="M12 3 L12 6" />
  </svg>`;
}

// 11. Conicidades Padrão — cone Morse
export function iconConicPad(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 8 L21 6 L21 18 L3 16 Z" />
    <path d="M3 8 L3 16" />
    <path d="M9 7.5 L9 16.5" stroke-dasharray="2 2" />
    <path d="M15 6.8 L15 17.2" stroke-dasharray="2 2" />
  </svg>`;
}

// ═══════════════════════════════════════════════════════════
// ÍCONES DAS CATEGORIAS DO MENU
// ═══════════════════════════════════════════════════════════

// Calculadora (CÁLCULOS)
export function iconCalc(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <rect x="7" y="5" width="10" height="3" rx="0.5" />
    <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="8" cy="16" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" />
    <circle cx="8" cy="20" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    <circle cx="16" cy="20" r="1" fill="currentColor" stroke="none" />
  </svg>`;
}

// Lupa (CONSULTAS)
export function iconLupa(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 L21 21" />
  </svg>`;
}

// Engrenagem (PRODUÇÃO)
export function iconEngrenagem(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2 L12 4" />
    <path d="M12 20 L12 22" />
    <path d="M2 12 L4 12" />
    <path d="M20 12 L22 12" />
    <path d="M4.9 4.9 L6.3 6.3" />
    <path d="M17.7 17.7 L19.1 19.1" />
    <path d="M19.1 4.9 L17.7 6.3" />
    <path d="M6.3 17.7 L4.9 19.1" />
    <circle cx="12" cy="12" r="9" stroke-dasharray="2 3" />
  </svg>`;
}

// ═══════════════════════════════════════════════════════════
// ÍCONES DAS CATEGORIAS DO MENU
// ═══════════════════════════════════════════════════════════

// Calculadora (CÁLCULOS)
// MAPA DE ÍCONES (para uso no menu)
// ═══════════════════════════════════════════════════════════
export const ICONS = {
  // Módulos
  trig:      iconTrig,
  coni:      iconConi,
  poly:      iconPoly,
  furos:     iconFuros,
  rosca:     iconRosca,
  tol:       iconTol,
  potencia:  iconPotencia,
  chaveta:   iconChaveta,
  conicpad:  iconConicPad,
  prog:      iconCNC,
  consult:   iconConsult,
  // Categorias
  'cat-calculos':   iconCalc,
  'cat-consultas':  iconLupa,
  'cat-producao':   iconEngrenagem,
  'cat-suporte':    iconConsult
};

// Função genérica: retorna o ícone pelo ID do módulo
export function getIcon(moduleKey, size = 24) {
  const fn = ICONS[moduleKey];
  return fn ? fn(size) : '';
}
