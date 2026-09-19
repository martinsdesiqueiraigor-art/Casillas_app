// tolerancias.js — Tabela simplificada ISO 286 para eixos e furos
// Unidades em micrômetros (µm). Valores para faixas até 500 mm.

export const TOLERANCIAS_FURO = {
  H7: {
    label: 'H7 (furo)',
    descricao: 'Furo com afastamento inferior zero (ajuste com eixo h6/g6)',
    faixas: [
      { min: 0,   max: 3,   ei: 0,  es: 10  },
      { min: 3,   max: 6,   ei: 0,  es: 12  },
      { min: 6,   max: 10,  ei: 0,  es: 15  },
      { min: 10,  max: 18,  ei: 0,  es: 18  },
      { min: 18,  max: 30,  ei: 0,  es: 21  },
      { min: 30,  max: 50,  ei: 0,  es: 25  },
      { min: 50,  max: 80,  ei: 0,  es: 30  },
      { min: 80,  max: 120, ei: 0,  es: 35  },
      { min: 120, max: 180, ei: 0,  es: 40  },
      { min: 180, max: 250, ei: 0,  es: 46  },
      { min: 250, max: 315, ei: 0,  es: 52  },
      { min: 315, max: 400, ei: 0,  es: 57  },
      { min: 400, max: 500, ei: 0,  es: 63  }
    ]
  },
  JS9: {
    label: 'JS9 (furo)',
    descricao: 'Furo simétrico (tolerância ampla para ajustes gerais)',
    faixas: [
      { min: 0,   max: 3,   ei: -12.5, es: 12.5 },
      { min: 3,   max: 6,   ei: -15,   es: 15   },
      { min: 6,   max: 10,  ei: -18,   es: 18   },
      { min: 10,  max: 18,  ei: -21.5, es: 21.5 },
      { min: 18,  max: 30,  ei: -26,   es: 26   },
      { min: 30,  max: 50,  ei: -31,   es: 31   },
      { min: 50,  max: 80,  ei: -37,   es: 37   },
      { min: 80,  max: 120, ei: -43.5, es: 43.5 },
      { min: 120, max: 180, ei: -50,   es: 50   },
      { min: 180, max: 250, ei: -57.5, es: 57.5 },
      { min: 250, max: 315, ei: -65,   es: 65   },
      { min: 315, max: 400, ei: -70,   es: 70   },
      { min: 400, max: 500, ei: -77.5, es: 77.5 }
    ]
  }
};

export const TOLERANCIAS_EIXO = {
  h6: {
    label: 'h6 (eixo)',
    descricao: 'Eixo com afastamento superior zero (ajuste com furo H7)',
    faixas: [
      { min: 0,   max: 3,   ei: -6,  es: 0 },
      { min: 3,   max: 6,   ei: -8,  es: 0 },
      { min: 6,   max: 10,  ei: -9,  es: 0 },
      { min: 10,  max: 18,  ei: -11, es: 0 },
      { min: 18,  max: 30,  ei: -13, es: 0 },
      { min: 30,  max: 50,  ei: -16, es: 0 },
      { min: 50,  max: 80,  ei: -19, es: 0 },
      { min: 80,  max: 120, ei: -22, es: 0 },
      { min: 120, max: 180, ei: -25, es: 0 },
      { min: 180, max: 250, ei: -29, es: 0 },
      { min: 250, max: 315, ei: -32, es: 0 },
      { min: 315, max: 400, ei: -36, es: 0 },
      { min: 400, max: 500, ei: -40, es: 0 }
    ]
  },
  g6: {
    label: 'g6 (eixo)',
    descricao: 'Eixo com folga leve (ajuste deslizante com H7)',
    faixas: [
      { min: 0,   max: 3,   ei: -8,  es: -2  },
      { min: 3,   max: 6,   ei: -12, es: -4  },
      { min: 6,   max: 10,  ei: -14, es: -5  },
      { min: 10,  max: 18,  ei: -17, es: -6  },
      { min: 18,  max: 30,  ei: -20, es: -7  },
      { min: 30,  max: 50,  ei: -25, es: -9  },
      { min: 50,  max: 80,  ei: -29, es: -10 },
      { min: 80,  max: 120, ei: -34, es: -12 },
      { min: 120, max: 180, ei: -39, es: -14 },
      { min: 180, max: 250, ei: -44, es: -15 },
      { min: 250, max: 315, ei: -49, es: -17 },
      { min: 315, max: 400, ei: -54, es: -18 },
      { min: 400, max: 500, ei: -60, es: -20 }
    ]
  }
};

export function getFaixa(lista, valor) {
  if (!Array.isArray(lista) || !Number.isFinite(valor)) return null;
  for (const f of lista) {
    if (valor > f.min && valor <= f.max) return f;
  }
  if (valor === 0) return lista[0];
  return null;
}
