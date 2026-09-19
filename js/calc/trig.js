// trig.js — Cálculos de trigonometria (funções puras, sem DOM)
// Triângulo retângulo: dados dois lados ou um lado + um ângulo.

const RAD = Math.PI / 180;

export function toRad(deg) { return deg * RAD; }
export function toDeg(rad) { return rad / RAD; }

export function hipotenusa(cat1, cat2) {
  return Math.sqrt(cat1 * cat1 + cat2 * cat2);
}

export function catetoFaltante(hip, cat) {
  const d = hip * hip - cat * cat;
  return d >= 0 ? Math.sqrt(d) : NaN;
}

export function anguloOposto(catOposto, hip) {
  if (hip === 0) return NaN;
  return Math.asin(catOposto / hip);
}

export function anguloAdjacente(catAdj, hip) {
  if (hip === 0) return NaN;
  return Math.acos(catAdj / hip);
}

export function resolverPorCatetos(catOposto, catAdjacente) {
  if (!Number.isFinite(catOposto) || !Number.isFinite(catAdjacente)) return null;
  if (catOposto <= 0 || catAdjacente <= 0) return null;

  const hip = hipotenusa(catOposto, catAdjacente);
  const alfaRad = Math.atan2(catOposto, catAdjacente);
  const betaRad = Math.PI / 2 - alfaRad;

  return {
    catetoOposto: catOposto,
    catetoAdjacente: catAdjacente,
    hipotenusa: hip,
    alfaGraus: toDeg(alfaRad),
    betaGraus: toDeg(betaRad),
    alfaRad,
    betaRad,
    seno: catOposto / hip,
    cosseno: catAdjacente / hip,
    tangente: catOposto / catAdjacente
  };
}

export function resolverPorHipotenusaAngulo(hip, alfaGraus) {
  if (!Number.isFinite(hip) || !Number.isFinite(alfaGraus)) return null;
  if (hip <= 0 || alfaGraus <= 0 || alfaGraus >= 90) return null;

  const alfaRad = toRad(alfaGraus);
  const catOposto = hip * Math.sin(alfaRad);
  const catAdjacente = hip * Math.cos(alfaRad);

  return {
    catetoOposto: catOposto,
    catetoAdjacente: catAdjacente,
    hipotenusa: hip,
    alfaGraus,
    betaGraus: 90 - alfaGraus,
    alfaRad,
    betaRad: toRad(90 - alfaGraus),
    seno: Math.sin(alfaRad),
    cosseno: Math.cos(alfaRad),
    tangente: Math.tan(alfaRad)
  };
}

export function resolverPorCatetoOpostoAngulo(catOposto, alfaGraus) {
  if (!Number.isFinite(catOposto) || !Number.isFinite(alfaGraus)) return null;
  if (catOposto <= 0 || alfaGraus <= 0 || alfaGraus >= 90) return null;

  const alfaRad = toRad(alfaGraus);
  const seno = Math.sin(alfaRad);
  if (seno === 0) return null;

  const hip = catOposto / seno;
  const catAdjacente = hip * Math.cos(alfaRad);

  return {
    catetoOposto: catOposto,
    catetoAdjacente: catAdjacente,
    hipotenusa: hip,
    alfaGraus,
    betaGraus: 90 - alfaGraus,
    alfaRad,
    betaRad: toRad(90 - alfaGraus),
    seno,
    cosseno: Math.cos(alfaRad),
    tangente: Math.tan(alfaRad)
  };
}

export function resolverPorCatetoAdjAngulo(catAdjacente, alfaGraus) {
  if (!Number.isFinite(catAdjacente) || !Number.isFinite(alfaGraus)) return null;
  if (catAdjacente <= 0 || alfaGraus <= 0 || alfaGraus >= 90) return null;

  const alfaRad = toRad(alfaGraus);
  const cos = Math.cos(alfaRad);
  if (cos === 0) return null;

  const hip = catAdjacente / cos;
  const catOposto = hip * Math.sin(alfaRad);

  return {
    catetoOposto: catOposto,
    catetoAdjacente: catAdjacente,
    hipotenusa: hip,
    alfaGraus,
    betaGraus: 90 - alfaGraus,
    alfaRad,
    betaRad: toRad(90 - alfaGraus),
    seno: Math.sin(alfaRad),
    cosseno: cos,
    tangente: Math.tan(alfaRad)
  };
}
