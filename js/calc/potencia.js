// potencia.js — Cálculos de usinagem (funções puras, sem DOM)
// Operações: torneamento, fresamento, furação, roscamento.

export function calcularRPM(vc, diametro) {
  if (!Number.isFinite(vc) || !Number.isFinite(diametro)) return NaN;
  if (diametro <= 0) return NaN;
  return (vc * 1000) / (Math.PI * diametro);
}

export function calcularVc(rpm, diametro) {
  if (!Number.isFinite(rpm) || !Number.isFinite(diametro)) return NaN;
  if (diametro <= 0) return NaN;
  return (Math.PI * diametro * rpm) / 1000;
}

export function calcularAvancoPorDente(fz, z) {
  if (!Number.isFinite(fz) || !Number.isFinite(z)) return NaN;
  if (z <= 0) return NaN;
  return fz * z;
}

export function calcularAvancoMesa(fz, z, rpm) {
  if (!Number.isFinite(fz) || !Number.isFinite(z) || !Number.isFinite(rpm)) return NaN;
  if (z <= 0 || rpm <= 0) return NaN;
  return fz * z * rpm; // mm/min
}

// Potência de corte (kW) para torneamento
// P = (ap * f * vc * kc) / (60000 * eficiencia)
// ap (mm), f (mm/rev), vc (m/min), kc (N/mm²)
export function potenciaTorneamento(ap, f, vc, kc, eficiencia = 0.8) {
  if (![ap, f, vc, kc].every(Number.isFinite)) return null;
  if (ap <= 0 || f <= 0 || vc <= 0 || kc <= 0) return null;
  if (eficiencia <= 0 || eficiencia > 1) eficiencia = 0.8;

  const forcaCorte = ap * f * kc;      // N
  const potenciaCorte = (forcaCorte * vc) / 60000; // kW
  const potenciaMotor = potenciaCorte / eficiencia;

  return {
    operacao: 'Torneamento',
    forcaCorte,
    potenciaCorte,
    potenciaMotor,
    eficiencia,
    ap, f, vc, kc
  };
}

// Fresamento — avanço da mesa, taxa de remoção, potência
export function potenciaFresamento(ap, ae, vf, kc, eficiencia = 0.8) {
  if (![ap, ae, vf, kc].every(Number.isFinite)) return null;
  if (ap <= 0 || ae <= 0 || vf <= 0 || kc <= 0) return null;
  if (eficiencia <= 0 || eficiencia > 1) eficiencia = 0.8;

  const taxaRemocao = (ap * ae * vf) / 1000; // cm³/min
  const potenciaCorte = (ap * ae * vf * kc) / (60 * 1000 * 1000); // kW
  const potenciaMotor = potenciaCorte / eficiencia;

  return {
    operacao: 'Fresamento',
    taxaRemocao,
    potenciaCorte,
    potenciaMotor,
    eficiencia,
    ap, ae, vf, kc
  };
}

// Furação — torque e potência
export function potenciaFuração(d, f, vc, kc, eficiencia = 0.8) {
  if (![d, f, vc, kc].every(Number.isFinite)) return null;
  if (d <= 0 || f <= 0 || vc <= 0 || kc <= 0) return null;
  if (eficiencia <= 0 || eficiencia > 1) eficiencia = 0.8;

  const n = calcularRPM(vc, d);
  const area = (Math.PI * d * d) / 4;
  const forca = area * kc * 0.5; // aprox
  const torque = (forca * (d / 2)) / 1000; // N·m
  const potenciaCorte = (2 * Math.PI * n * torque) / 60000; // kW
  const potenciaMotor = potenciaCorte / eficiencia;

  return {
    operacao: 'Furação',
    rpm: n,
    forca,
    torque,
    potenciaCorte,
    potenciaMotor,
    eficiencia,
    d, f, vc, kc
  };
}

// Roscamento — potência a partir do passo e da rotação
export function potenciaRoscamento(d, passo, n, kc, eficiencia = 0.8) {
  if (![d, passo, n, kc].every(Number.isFinite)) return null;
  if (d <= 0 || passo <= 0 || n <= 0 || kc <= 0) return null;
  if (eficiencia <= 0 || eficiencia > 1) eficiencia = 0.8;

  const area = 0.25 * Math.PI * d * passo; // aprox. da seção do cavaco
  const forca = area * kc;
  const torque = (forca * (d / 2)) / 1000;
  const potenciaCorte = (2 * Math.PI * n * torque) / 60000;
  const potenciaMotor = potenciaCorte / eficiencia;

  return {
    operacao: 'Roscamento',
    forca,
    torque,
    potenciaCorte,
    potenciaMotor,
    eficiencia,
    d, passo, n, kc
  };
}
