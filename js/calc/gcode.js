// gcode.js — Geração de código G (funções puras, sem DOM)
// Sub-módulos: furação circular, roscamento, desbaste longitudinal, canal.

function fmt(v, dec = 3) {
  if (!Number.isFinite(v)) return '0';
  return Number(v).toFixed(dec);
}

// Cabeçalho padrão Fanuc
export function cabecalho(numeroPrograma = 'O0001', nomePeca = 'PECA') {
  return [
    `%`,
    `${numeroPrograma} (${nomePeca})`,
    `G21 G17 G40 G49 G80 G90`,
    `G28 U0 W0`,
    `(--- FIM CABECALHO ---)`
  ].join('\n');
}

export function rodape() {
  return [
    `(--- FIM PROGRAMA ---)`,
    `M05`,
    `M09`,
    `G28 U0 W0`,
    `M30`,
    `%`
  ].join('\n');
}

// Furação circular (G83 com ciclo de pica-pau)
export function gcodeFurosCirculares({ numeroPrograma = 'O0010', nomePeca = 'FURAÇÃO',
                                        D = 100, n = 6, anguloInicial = 0,
                                        profundidade = 20, peck = 5,
                                        fz = 0.1, rpm = 800,
                                        zSeguro = 5, zReferencia = 0 } = {}) {
  if (!Number.isFinite(D) || D <= 0) return '';
  if (!Number.isInteger(n) || n < 2) return '';

  const R = D / 2;
  const passo = 360 / n;
  const linhas = [];

  linhas.push(cabecalho(numeroPrograma, nomePeca));
  linhas.push(`(FURACAO CIRCULAR D=${fmt(D)} N=${n})`);
  linhas.push(`(DIAMETRO CIRCULO=${fmt(D)})`);
  linhas.push(`(RAIO=${fmt(R)})`);
  linhas.push(`G97 S${Math.round(rpm)} M03`);
  linhas.push(`G00 Z${fmt(zSeguro)}`);

  for (let i = 0; i < n; i++) {
    const ang = (anguloInicial + i * passo) * Math.PI / 180;
    const x = R * Math.cos(ang);
    const y = R * Math.sin(ang);
    linhas.push(`(FURO ${i + 1} - ANG ${fmt(anguloInicial + i * passo, 1)} GRAUS)`);
    linhas.push(`G00 X${fmt(x)} Y${fmt(y)}`);
    linhas.push(`G00 Z${fmt(zSeguro)}`);
    if (peck > 0) {
      linhas.push(`G83 Z${fmt(zReferencia - profundidade)} R${fmt(zSeguro)} Q${fmt(peck)} F${fmt(fz)}`);
    } else {
      linhas.push(`G81 Z${fmt(zReferencia - profundidade)} R${fmt(zSeguro)} F${fmt(fz)}`);
    }
    linhas.push(`G80`);
  }

  linhas.push(rodape());
  return linhas.join('\n');
}

// Roscamento no torno (G76)
export function gcodeRoscamento({ numeroPrograma = 'O0020', nomePeca = 'ROSCA',
                                  passo = 1.5, comprimento = 20,
                                  diametro = 20, profundidade = 0.92,
                                  rpm = 500, xSeguro = 25, zInicio = 3 } = {}) {
  if (!Number.isFinite(passo) || passo <= 0) return '';

  const altInicial = profundidade * passo;
  const linhas = [];

  linhas.push(cabecalho(numeroPrograma, nomePeca));
  linhas.push(`(ROSCAMENTO METRICO)`);
  linhas.push(`(PASSO=${fmt(passo)} D=${fmt(diametro)})`);
  linhas.push(`G97 S${Math.round(rpm)} M03`);
  linhas.push(`G00 X${fmt(xSeguro)} Z${fmt(zInicio)}`);
  linhas.push(`G76 P010060 Q100 R50`);
  linhas.push(`G76 X${fmt(diametro - 2 * altInicial)} Z${fmt(-comprimento)} P${Math.round(altInicial * 1000)} Q${Math.round(altInicial * 300)} F${fmt(passo)}`);
  linhas.push(rodape());
  return linhas.join('\n');
}

// Desbaste longitudinal (G71)
export function gcodeDesbaste({ numeroPrograma = 'O0030', nomePeca = 'DESBASTE',
                               diametroInicial = 50, diametroFinal = 40,
                               comprimento = 60, rpm = 800,
                               avanco = 0.25, profundidadeCorte = 1.5,
                               xSeguro = 60, zSeguro = 3 } = {}) {
  const linhas = [];
  linhas.push(cabecalho(numeroPrograma, nomePeca));
  linhas.push(`(DESBASTE LONGITUDINAL G71)`);
  linhas.push(`G97 S${Math.round(rpm)} M03`);
  linhas.push(`G00 X${fmt(xSeguro)} Z${fmt(zSeguro)}`);
  linhas.push(`G71 U${fmt(profundidadeCorte)} R0.5`);
  linhas.push(`G71 P100 Q200 U0.4 W0.1 F${fmt(avanco)}`);
  linhas.push(`N100 G00 X${fmt(diametroFinal)}`);
  linhas.push(`G01 Z${fmt(-comprimento)}`);
  linhas.push(`N200 X${fmt(diametroInicial)}`);
  linhas.push(`G70 P100 Q200`);
  linhas.push(rodape());
  return linhas.join('\n');
}

// Canal (Grooving) — G75
export function gcodeCanal({ numeroPrograma = 'O0040', nomePeca = 'CANAL',
                             diametroExterno = 40, larguraFerramenta = 3,
                             larguraCanal = 3, profundidadeCanal = 2,
                             zInicio = 0, rpm = 600, avanco = 0.08 } = {}) {
  const linhas = [];
  const xInicial = diametroExterno;
  const xFinal = diametroExterno - 2 * profundidadeCanal;

  linhas.push(cabecalho(numeroPrograma, nomePeca));
  linhas.push(`(CANAL EXTERNO G75)`);
  linhas.push(`G97 S${Math.round(rpm)} M03`);
  linhas.push(`G00 X${fmt(xInicial + 2)} Z${fmt(zInicio + 2)}`);
  linhas.push(`G75 R0.3`);
  linhas.push(`G75 X${fmt(xFinal)} Z${fmt(-zInicio)} P2000 Q${Math.round(larguraFerramenta * 1000)} F${fmt(avanco)}`);
  linhas.push(rodape());
  return linhas.join('\n');
}

// Rosca com múltiplas entradas (n entradas)
export function gcodeRoscaMultipla({ numeroPrograma = 'O0050', nomePeca = 'ROSCA MULT',
                                      passo = 2, entradas = 2, comprimento = 25,
                                      diametro = 24, rpm = 400,
                                      profundidade = 1.2 } = {}) {
  if (!Number.isInteger(entradas) || entradas < 1) return '';
  const passoAparente = passo * entradas;

  const linhas = [];
  linhas.push(cabecalho(numeroPrograma, nomePeca));
  linhas.push(`(ROSCA ${entradas} ENTRADAS PASSO=${fmt(passo)})`);
  linhas.push(`G97 S${Math.round(rpm)} M03`);

  for (let i = 0; i < entradas; i++) {
    const zOffset = (i * passoAparente) / entradas;
    linhas.push(`(ENTRADA ${i + 1})`);
    linhas.push(`G00 X${fmt(diametro + 2)} Z${fmt(3 + zOffset)}`);
    linhas.push(`G92 X${fmt(diametro - 2 * profundidade)} Z${fmt(-comprimento)} F${fmt(passoAparente)}`);
  }

  linhas.push(rodape());
  return linhas.join('\n');
}

// Macro B — chamada paramétrica de furação
export function macroFuros({ numeroPrograma = 'O0100', nomePeca = 'MACRO FUROS',
                             D = 80, n = 6, profundidade = 15,
                             rpm = 900, avanco = 0.1 } = {}) {
  const linhas = [];
  linhas.push(cabecalho(numeroPrograma, nomePeca));
  linhas.push(`(MACRO B — FURACAO CIRCULAR)`);
  linhas.push(`(USO: G65 P9010 D${fmt(D)} N${n} Z${fmt(profundidade)})`);
  linhas.push(`G97 S${Math.round(rpm)} M03`);
  linhas.push(`#100 = ${fmt(D / 2)}   (RAIO)`);
  linhas.push(`#101 = ${n}   (NUMERO DE FUROS)`);
  linhas.push(`#102 = ${fmt(profundidade)}   (PROFUNDIDADE)`);
  linhas.push(`#103 = 360 / #101   (PASSO ANGULAR)`);
  linhas.push(`#104 = 0   (CONTADOR)`);
  linhas.push(`WHILE [#104 LT #101] DO 1`);
  linhas.push(`  #110 = #104 * #103`);
  linhas.push(`  #111 = #100 * COS[#110]`);
  linhas.push(`  #112 = #100 * SIN[#110]`);
  linhas.push(`  G00 X#111 Y#112`);
  linhas.push(`  G81 Z-#102 R2 F${fmt(avanco)}`);
  linhas.push(`  G80`);
  linhas.push(`  #104 = #104 + 1`);
  linhas.push(`END 1`);
  linhas.push(rodape());
  return linhas.join('\n');
}
