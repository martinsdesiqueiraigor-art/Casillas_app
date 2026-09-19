// poly.js — Cálculos de polígonos regulares (funções puras, sem DOM)
// Relações:
//   ângulo interno = (n - 2) * 180 / n
//   ângulo central = 360 / n
//   lado a partir do raio circunscrito: a = 2R * sin(π/n)
//   apótema: ap = R * cos(π/n)

const RAD = Math.PI / 180;

export function calcularPoligono(n, R) {
  if (!Number.isInteger(n) || n < 3) return null;
  if (!Number.isFinite(R) || R <= 0) return null;

  const angInterno = (n - 2) * 180 / n;
  const angCentral = 360 / n;
  const meioAngulo = 180 / n;

  const lado = 2 * R * Math.sin(Math.PI / n);
  const apotema = R * Math.cos(Math.PI / n);
  const perimetro = lado * n;
  const area = 0.5 * perimetro * apotema;
  const raioInscrito = apotema;

  return {
    n,
    R,
    anguloInternoGraus: angInterno,
    anguloCentralGraus: angCentral,
    meioAnguloCentralGraus: meioAngulo,
    lado,
    apotema,
    raioInscrito,
    perimetro,
    area,
    somaAngulosInternos: (n - 2) * 180
  };
}

export function calcularPorLado(n, lado) {
  if (!Number.isInteger(n) || n < 3) return null;
  if (!Number.isFinite(lado) || lado <= 0) return null;

  const sinHalf = Math.sin(Math.PI / n);
  if (sinHalf === 0) return null;

  const R = lado / (2 * sinHalf);
  return calcularPoligono(n, R);
}

export function calcularPorApotema(n, apotema) {
  if (!Number.isInteger(n) || n < 3) return null;
  if (!Number.isFinite(apotema) || apotema <= 0) return null;

  const cosHalf = Math.cos(Math.PI / n);
  if (cosHalf === 0) return null;

  const R = apotema / cosHalf;
  return calcularPoligono(n, R);
}

// Gera os pontos do polígono centrados em (cx, cy) com raio R
export function gerarPontos(n, cx, cy, R) {
  const pts = [];
  if (!Number.isInteger(n) || n < 3 || !Number.isFinite(R) || R <= 0) return pts;
  const offset = -Math.PI / 2; // começa no topo
  for (let i = 0; i < n; i++) {
    const ang = offset + (i * 2 * Math.PI) / n;
    pts.push({
      x: cx + R * Math.cos(ang),
      y: cy + R * Math.sin(ang)
    });
  }
  return pts;
}
