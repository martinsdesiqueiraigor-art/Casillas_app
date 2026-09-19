// rosca.js — Cálculos de roscas (funções puras, sem DOM)
// Suporta: Métrica (M), UNC/UNF (polegada), Whitworth (BSW).
// Também calcula medida sobre rolos (3 fios).

const MM_PER_INCH = 25.4;

// Tabelas de passos padrão
export const PASSOS_METRICA = {
  'M3':   { d: 3,   passo: 0.5  },
  'M4':   { d: 4,   passo: 0.7  },
  'M5':   { d: 5,   passo: 0.8  },
  'M6':   { d: 6,   passo: 1.0  },
  'M8':   { d: 8,   passo: 1.25 },
  'M10':  { d: 10,  passo: 1.5  },
  'M12':  { d: 12,  passo: 1.75 },
  'M14':  { d: 14,  passo: 2.0  },
  'M16':  { d: 16,  passo: 2.0  },
  'M18':  { d: 18,  passo: 2.5  },
  'M20':  { d: 20,  passo: 2.5  },
  'M22':  { d: 22,  passo: 2.5  },
  'M24':  { d: 24,  passo: 3.0  },
  'M27':  { d: 27,  passo: 3.0  },
  'M30':  { d: 30,  passo: 3.5  },
  'M33':  { d: 33,  passo: 3.5  },
  'M36':  { d: 36,  passo: 4.0  }
};

export const PASSOS_UNC = {
  '1/4':  { d: 6.35,   tpi: 20 },
  '5/16': { d: 7.9375, tpi: 18 },
  '3/8':  { d: 9.525,  tpi: 16 },
  '7/16': { d: 11.1125, tpi: 14 },
  '1/2':  { d: 12.7,   tpi: 13 },
  '9/16': { d: 14.2875, tpi: 12 },
  '5/8':  { d: 15.875, tpi: 11 },
  '3/4':  { d: 19.05,  tpi: 10 },
  '7/8':  { d: 22.225, tpi: 9  },
  '1':    { d: 25.4,   tpi: 8  }
};

export const PASSOS_UNF = {
  '1/4':  { d: 6.35,   tpi: 28 },
  '5/16': { d: 7.9375, tpi: 24 },
  '3/8':  { d: 9.525,  tpi: 24 },
  '7/16': { d: 11.1125, tpi: 20 },
  '1/2':  { d: 12.7,   tpi: 20 },
  '9/16': { d: 14.2875, tpi: 18 },
  '5/8':  { d: 15.875, tpi: 18 },
  '3/4':  { d: 19.05,  tpi: 16 },
  '7/8':  { d: 22.225, tpi: 14 },
  '1':    { d: 25.4,   tpi: 12 }
};

export const PASSOS_BSW = {
  '1/8':  { d: 3.175,  tpi: 40 },
  '3/16': { d: 4.7625, tpi: 24 },
  '1/4':  { d: 6.35,   tpi: 20 },
  '5/16': { d: 7.9375, tpi: 18 },
  '3/8':  { d: 9.525,  tpi: 16 },
  '7/16': { d: 11.1125, tpi: 14 },
  '1/2':  { d: 12.7,   tpi: 12 },
  '5/8':  { d: 15.875, tpi: 11 },
  '3/4':  { d: 19.05,  tpi: 10 }
};

// Cálculo de rosca métrica (perfil ISO 60°)
export function calcularMetrica(d, passo) {
  if (!Number.isFinite(d) || !Number.isFinite(passo)) return null;
  if (d <= 0 || passo <= 0) return null;

  const H = (Math.sqrt(3) / 2) * passo;
  const h3 = 0.6134 * passo;      // altura de filete interna
  const h1 = 0.5413 * passo;      // altura de filete externa
  const d2 = d - 0.6495 * passo;  // diâmetro médio
  const d1 = d - 1.0825 * passo;  // diâmetro interno (núcleo)
  const d3 = d - 1.2269 * passo;  // diâmetro do fundo do filete externo

  return {
    tipo: 'Métrica ISO',
    angulo: 60,
    d,
    passo,
    H,
    h1,
    h3,
    d2,
    d1,
    d3,
    passoPolegada: passo / MM_PER_INCH
  };
}

// Cálculo de rosca em polegada (UNC/UNF/BSW)
export function calcularPolegada(d, tpi, tipo = 'UNC') {
  if (!Number.isFinite(d) || !Number.isFinite(tpi)) return null;
  if (d <= 0 || tpi <= 0) return null;

  const passo = MM_PER_INCH / tpi;
  const ehBSW = tipo === 'BSW';
  const angulo = ehBSW ? 55 : 60;

  if (ehBSW) {
    // Perfil Whitworth 55°
    const H = 0.960491 * passo;
    const h1 = 0.640327 * passo;
    const r = 0.137329 * passo;
    const d2 = d - 0.640327 * passo;
    const d1 = d - 1.280654 * passo;
    return {
      tipo: 'Whitworth BSW',
      angulo,
      d,
      passo,
      tpi,
      H,
      h1,
      r,
      d2,
      d1,
      d3: d1
    };
  }

  // UNC / UNF (60°)
  const H = (Math.sqrt(3) / 2) * passo;
  const h1 = 0.61343 * passo;
  const d2 = d - 0.64952 * passo;
  const d1 = d - 1.08253 * passo;

  return {
    tipo: tipo === 'UNF' ? 'UNF (60°)' : 'UNC (60°)',
    angulo,
    d,
    passo,
    tpi,
    H,
    h1,
    d2,
    d1,
    d3: d1
  };
}

// Medida sobre 3 rolos (fios) para rosca métrica 60°
// M = d2 + 3*dw - (P/2) * (1 + cot(α/2)) ... fórmula simplificada
// Para α = 60°, M = d2 + 3*dw - 0.866*P  (fórmula simplificada)
export function medidaSobre3Rolos(d2, passo, dw, angulo = 60) {
  if (!Number.isFinite(d2) || !Number.isFinite(passo) || !Number.isFinite(dw)) return null;
  if (passo <= 0 || dw <= 0) return null;

  const half = (angulo / 2) * Math.PI / 180;
  const cotHalf = 1 / Math.tan(half);
  // Fórmula geral: M = d2 + dw * (1 + cosec(half)) - P/2 * cotHalf
  const cosecHalf = 1 / Math.sin(half);
  const M = d2 + dw * (1 + cosecHalf) - (passo / 2) * cotHalf;

  return { M, d2, passo, dw, angulo };
}
