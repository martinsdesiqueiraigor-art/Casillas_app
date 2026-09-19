// chavetas.js — Tabela DIN 6885-1 (chavetas paralelas)
// Faixas de diâmetro do eixo (mm) → dimensões b x h (mm)

export const CHAVETAS_DIN6885 = [
  { min: 6,   max: 8,   b: 2,  h: 2,  t1: 1.2, t2: 1.0 },
  { min: 8,   max: 10,  b: 3,  h: 3,  t1: 1.8, t2: 1.4 },
  { min: 10,  max: 12,  b: 4,  h: 4,  t1: 2.5, t2: 1.8 },
  { min: 12,  max: 17,  b: 5,  h: 5,  t1: 3.0, t2: 2.3 },
  { min: 17,  max: 22,  b: 6,  h: 6,  t1: 3.5, t2: 2.8 },
  { min: 22,  max: 30,  b: 8,  h: 7,  t1: 4.0, t2: 3.3 },
  { min: 30,  max: 38,  b: 10, h: 8,  t1: 5.0, t2: 3.3 },
  { min: 38,  max: 44,  b: 12, h: 8,  t1: 5.0, t2: 3.3 },
  { min: 44,  max: 50,  b: 14, h: 9,  t1: 5.5, t2: 3.8 },
  { min: 50,  max: 58,  b: 16, h: 10, t1: 6.0, t2: 4.3 },
  { min: 58,  max: 65,  b: 18, h: 11, t1: 7.0, t2: 4.4 },
  { min: 65,  max: 75,  b: 20, h: 12, t1: 7.5, t2: 4.9 },
  { min: 75,  max: 85,  b: 22, h: 14, t1: 9.0, t2: 5.4 },
  { min: 85,  max: 95,  b: 25, h: 14, t1: 9.0, t2: 5.4 },
  { min: 95,  max: 110, b: 28, h: 16, t1: 10.0, t2: 6.4 },
  { min: 110, max: 130, b: 32, h: 18, t1: 11.0, t2: 7.4 },
  { min: 130, max: 150, b: 36, h: 20, t1: 12.0, t2: 8.4 },
  { min: 150, max: 170, b: 40, h: 22, t1: 13.0, t2: 9.4 },
  { min: 170, max: 200, b: 45, h: 25, t1: 15.0, t2: 10.4 },
  { min: 200, max: 230, b: 50, h: 28, t1: 17.0, t2: 11.4 }
];

export function getChavetaParaEixo(diametro) {
  if (!Number.isFinite(diametro)) return null;
  for (const c of CHAVETAS_DIN6885) {
    if (diametro > c.min && diametro <= c.max) return c;
  }
  return null;
}
