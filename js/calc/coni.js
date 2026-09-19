// coni.js — Cálculos de conicidade (funções puras, sem DOM)
// Fórmulas:
//   tan(α/2) = (D - d) / (2 * L)
//   α = 2 * atan( (D - d) / (2L) )
//   Conicidade C = (D - d) / L = 1 : (L / (D - d))

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export function calcularPorDdL(D, d, L) {
  if (!Number.isFinite(D) || !Number.isFinite(d) || !Number.isFinite(L)) return null;
  if (L <= 0 || D <= 0 || d <= 0) return null;
  if (D <= d) return null;

  const diff = D - d;
  const tanHalf = diff / (2 * L);
  const alphaHalfRad = Math.atan(tanHalf);
  const alphaRad = 2 * alphaHalfRad;
  const alphaGraus = alphaRad * DEG;
  const conicidade = diff / L;
  const relacao = diff > 0 ? L / diff : Infinity;

  return {
    D,
    d,
    L,
    diferencaDiametros: diff,
    anguloMeioGraus: alphaHalfRad * DEG,
    anguloGraus: alphaGraus,
    anguloRad: alphaRad,
    tangenteMeioAngulo: tanHalf,
    conicidade,
    relacao1ParaX: relacao,
    inclinacao: diff / 2
  };
}

export function calcularPorDAlphaL(d, alphaGraus, L) {
  if (!Number.isFinite(d) || !Number.isFinite(alphaGraus) || !Number.isFinite(L)) return null;
  if (L <= 0 || d <= 0) return null;
  if (alphaGraus <= 0 || alphaGraus >= 180) return null;

  const alphaRad = alphaGraus * RAD;
  const diff = 2 * L * Math.tan(alphaRad / 2);
  const D = d + diff;

  const conicidade = diff / L;
  const relacao = diff > 0 ? L / diff : Infinity;

  return {
    D,
    d,
    L,
    diferencaDiametros: diff,
    anguloMeioGraus: alphaGraus / 2,
    anguloGraus: alphaGraus,
    anguloRad: alphaRad,
    tangenteMeioAngulo: Math.tan(alphaRad / 2),
    conicidade,
    relacao1ParaX: relacao,
    inclinacao: diff / 2
  };
}

export function calcularPorDdAlpha(D, d, alphaGraus) {
  if (!Number.isFinite(D) || !Number.isFinite(d) || !Number.isFinite(alphaGraus)) return null;
  if (D <= d || alphaGraus <= 0 || alphaGraus >= 180) return null;

  const diff = D - d;
  const alphaRad = alphaGraus * RAD;
  const tanHalf = Math.tan(alphaRad / 2);
  if (tanHalf === 0) return null;

  const L = diff / (2 * tanHalf);
  const conicidade = diff / L;
  const relacao = diff > 0 ? L / diff : Infinity;

  return {
    D,
    d,
    L,
    diferencaDiametros: diff,
    anguloMeioGraus: alphaGraus / 2,
    anguloGraus: alphaGraus,
    anguloRad: alphaRad,
    tangenteMeioAngulo: tanHalf,
    conicidade,
    relacao1ParaX: relacao,
    inclinacao: diff / 2
  };
}
