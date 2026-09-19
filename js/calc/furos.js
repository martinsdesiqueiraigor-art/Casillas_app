// furos.js — Furação circular (funções puras, sem DOM)
// Distribui N furos sobre um círculo de diâmetro D,
// com ângulo inicial opcional em graus.

const RAD = Math.PI / 180;

export function calcularFuros(D, n, anguloInicialGraus = 0) {
  if (!Number.isFinite(D) || D <= 0) return null;
  if (!Number.isInteger(n) || n < 2) return null;
  if (!Number.isFinite(anguloInicialGraus)) anguloInicialGraus = 0;

  const R = D / 2;
  const passoAngular = 360 / n;
  const furos = [];

  for (let i = 0; i < n; i++) {
    const angGraus = anguloInicialGraus + i * passoAngular;
    const angNorm = ((angGraus % 360) + 360) % 360;
    const angRad = angNorm * RAD;
    furos.push({
      indice: i + 1,
      anguloGraus: angNorm,
      anguloRad: angRad,
      x: R * Math.cos(angRad),
      y: R * Math.sin(angRad)
    });
  }

  return {
    D,
    R,
    n,
    anguloInicialGraus,
    passoAngular,
    furos
  };
}

// Distância linear entre dois furos consecutivos (corda)
export function distanciaEntreFuros(D, n) {
  if (!Number.isFinite(D) || D <= 0) return NaN;
  if (!Number.isInteger(n) || n < 2) return NaN;
  return 2 * (D / 2) * Math.sin(Math.PI / n);
}
