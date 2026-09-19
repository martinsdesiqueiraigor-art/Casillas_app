// chaveta.js — Cálculos de chavetas (funções puras, sem DOM)
// Dimensionamento e verificação (cisalhamento e esmagamento).

import { getChavetaParaEixo } from '../data/chavetas.js';

export function dimensionarPorEixo(diametroEixo) {
  const c = getChavetaParaEixo(diametroEixo);
  if (!c) return null;

  const comprimentoMin = 1.5 * c.b; // regra prática
  const comprimentoMax = 2.5 * c.b;

  return {
    b: c.b,
    h: c.h,
    t1: c.t1,
    t2: c.t2,
    faixaEixo: { min: c.min, max: c.max },
    comprimentoMin,
    comprimentoMax
  };
}

// Verificação por cisalhamento
// τ = F / (b * L)
// F = 2 * T / d  (força tangencial)
export function verificarCisalhamento(torqueNm, d, b, L, tauAdm = 60) {
  if (![torqueNm, d, b, L, tauAdm].every(Number.isFinite)) return null;
  if (d <= 0 || b <= 0 || L <= 0 || tauAdm <= 0) return null;

  const F = (2 * torqueNm * 1000) / d; // N (torque em N·m → N·mm)
  const area = b * L;
  const tau = F / area;
  const coef = tauAdm / tau;

  return {
    forcaTangencial: F,
    area,
    tensaoCisalhamento: tau,
    tensaoAdmissivel: tauAdm,
    coeficienteSeguranca: coef,
    aprovado: tau <= tauAdm
  };
}

// Verificação por esmagamento (compressão na lateral)
export function verificarEsmagamento(torqueNm, d, L, t1, sigmaAdm = 100) {
  if (![torqueNm, d, L, t1, sigmaAdm].every(Number.isFinite)) return null;
  if (d <= 0 || L <= 0 || t1 <= 0 || sigmaAdm <= 0) return null;

  const F = (2 * torqueNm * 1000) / d;
  const area = L * (t1 / 2);
  const sigma = F / area;
  const coef = sigmaAdm / sigma;

  return {
    forcaTangencial: F,
    area,
    tensaoEsmagamento: sigma,
    tensaoAdmissivel: sigmaAdm,
    coeficienteSeguranca: coef,
    aprovado: sigma <= sigmaAdm
  };
}

// Comprimento necessário mínimo por cisalhamento
export function comprimentoMinCisalhamento(torqueNm, d, b, tauAdm = 60) {
  if (![torqueNm, d, b, tauAdm].every(Number.isFinite)) return null;
  if (d <= 0 || b <= 0 || tauAdm <= 0) return null;
  const F = (2 * torqueNm * 1000) / d;
  return F / (b * tauAdm);
}
