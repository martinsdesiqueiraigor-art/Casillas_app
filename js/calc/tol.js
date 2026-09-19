// tol.js — Cálculos de tolerâncias ISO 286 (funções puras, sem DOM)

import {
  TOLERANCIAS_FURO,
  TOLERANCIAS_EIXO,
  getFaixa
} from '../data/tolerancias.js';

const UM_PARA_MM = 0.001;

export function calcularTolerancia(nominal, tipo, classe) {
  if (!Number.isFinite(nominal) || nominal <= 0) return null;

  let grupo = null;
  if (TOLERANCIAS_FURO[classe]) grupo = TOLERANCIAS_FURO[classe];
  else if (TOLERANCIAS_EIXO[classe]) grupo = TOLERANCIAS_EIXO[classe];

  if (!grupo) return null;

  const faixa = getFaixa(grupo.faixas, nominal);
  if (!faixa) return null;

  const eiMm = faixa.ei * UM_PARA_MM;
  const esMm = faixa.es * UM_PARA_MM;
  const maximo = nominal + esMm;
  const minimo = nominal + eiMm;
  const tolerancia = esMm - eiMm;

  return {
    classe: grupo.label,
    descricao: grupo.descricao,
    nominal,
    faixaNominal: { min: faixa.min, max: faixa.max },
    ei: faixa.ei,
    es: faixa.es,
    eiMm,
    esMm,
    maximo,
    minimo,
    tolerancia,
    toleranciaUm: faixa.es - faixa.ei
  };
}

export function listarClasses() {
  const furos = Object.keys(TOLERANCIAS_FURO).map((k) => ({
    key: k,
    label: TOLERANCIAS_FURO[k].label,
    tipo: 'furo'
  }));
  const eixos = Object.keys(TOLERANCIAS_EIXO).map((k) => ({
    key: k,
    label: TOLERANCIAS_EIXO[k].label,
    tipo: 'eixo'
  }));
  return [...furos, ...eixos];
}

// Ajuste: analisa um par furo/eixo
export function analisarAjuste(nominal, classeFuro, classeEixo) {
  const furo = calcularTolerancia(nominal, 'furo', classeFuro);
  const eixo = calcularTolerancia(nominal, 'eixo', classeEixo);

  if (!furo || !eixo) return null;

  // Folga = menor valor de (furo_min - eixo_max)
  const folgaMin = furo.minimo - eixo.maximo;
  const folgaMax = furo.maximo - eixo.minimo;

  let tipoAjuste = 'indeterminado';
  if (folgaMin >= 0) tipoAjuste = 'com folga';
  else if (folgaMax <= 0) tipoAjuste = 'com interferência';
  else tipoAjuste = 'incerto (transição)';

  return {
    furo,
    eixo,
    folgaMin,
    folgaMax,
    tipoAjuste
  };
}
