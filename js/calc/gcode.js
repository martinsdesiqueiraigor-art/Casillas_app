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
export function gcodeFurosCirculares({ numeroPrograma = 'O0010', nomePeca = 'FURACAO',
                                        D = 100, n = 6, anguloInicial = 0,
                                        profundidade = 20, peck = 5,
                                        fz = 0.1, rpm = 800,
                                        zSeguro = 5, zReferencia = 0 } = {}) {
  if (!Number.isFinite(D) || D <= 0) return '';
  if (!Number.isInteger(n) || n < 2) return '';

  const R = D / 2;
  const passoAngular = 360 / n;
  const linhas = [];
  const zFinal = zReferencia - profundidade;

  linhas.push(cabecalho(numeroPrograma, nomePeca));
  linhas.push(`(FURACAO CIRCULAR - CICLO G83 MODAL)`);
  linhas.push(`(Diametro circulo: ${fmt(D)} mm | Numero de furos: ${n})`);
  linhas.push(`(Angulo inicial: ${fmt(anguloInicial, 1)} graus | Passo: ${fmt(passoAngular, 3)} graus)`);
  linhas.push(`(Profundidade: ${fmt(profundidade)} mm | Peck: ${fmt(peck)} mm)`);
  linhas.push(`G97 S${Math.round(rpm)} M03`);
  linhas.push(`G00 Z${fmt(zSeguro)}`);

  // Calcula coordenadas de todos os furos
  const furos = [];
  for (let i = 0; i < n; i++) {
    const angGraus = anguloInicial + i * passoAngular;
    const angRad = angGraus * Math.PI / 180;
    furos.push({
      i: i + 1,
      angGraus: angGraus,
      x: R * Math.cos(angRad),
      y: R * Math.sin(angRad)
    });
  }

  // Primeiro furo: ativa o ciclo G83
  const f0 = furos[0];
  linhas.push(`(FURO 1 - ANG ${fmt(f0.angGraus, 1)} GRAUS)`);
  linhas.push(`G00 X${fmt(f0.x)} Y${fmt(f0.y)}`);
  if (peck > 0) {
    linhas.push(`G83 Z${fmt(zFinal)} R${fmt(zSeguro)} Q${fmt(peck)} F${fmt(fz)}`);
  } else {
    linhas.push(`G81 Z${fmt(zFinal)} R${fmt(zSeguro)} F${fmt(fz)}`);
  }

  // Demais furos: só posiciona (ciclo continua ativo)
  for (let i = 1; i < furos.length; i++) {
    const f = furos[i];
    linhas.push(`(FURO ${f.i} - ANG ${fmt(f.angGraus, 1)} GRAUS)`);
    linhas.push(`G00 X${fmt(f.x)} Y${fmt(f.y)}`);
  }

  // Cancela o ciclo
  linhas.push(`G80`);
  linhas.push(`G00 Z${fmt(zSeguro)}`);

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
                             diametroExterno = 40, diametroCanal = 36,
                             larguraFerramenta = 3, larguraCanal = 5,
                             zInicio = 0, passoLateral = null,
                             rpm = 600, avanco = 0.08 } = {}) {
  if (!Number.isFinite(diametroExterno) || diametroExterno <= 0) return '';
  if (!Number.isFinite(diametroCanal) || diametroCanal <= 0) return '';
  if (diametroCanal >= diametroExterno) return '';

  const linhas = [];
  const profundidadeReal = (diametroExterno - diametroCanal) / 2;
  const zInicial = zInicio - larguraFerramenta;
  const zFinal = larguraCanal > larguraFerramenta
    ? zInicial - (larguraCanal - larguraFerramenta)
    : zInicial;
  const q = passoLateral !== null && Number.isFinite(passoLateral) && passoLateral > 0
    ? passoLateral
    : larguraFerramenta * 0.7;
  const numPasses = larguraCanal > larguraFerramenta
    ? Math.ceil((larguraCanal - larguraFerramenta) / q)
    : 1;

  linhas.push(cabecalho(numeroPrograma, nomePeca));
  linhas.push(`(CANAL EXTERNO - G75)`);
  linhas.push(`(Diametro externo: ${fmt(diametroExterno)} mm | Diametro canal: ${fmt(diametroCanal)} mm)`);
  linhas.push(`(Profundidade: ${fmt(profundidadeReal)} mm | Largura canal: ${fmt(larguraCanal)} mm)`);
  linhas.push(`(Bedame: ${fmt(larguraFerramenta)} mm | Passo lateral Q: ${fmt(q)} mm)`);
  linhas.push(`(Z inicial do canal: ${fmt(zInicio)} mm | Z inicial aprox: ${fmt(zInicial)} mm | Z final: ${fmt(zFinal)} mm)`);
  linhas.push(`(Numero de passes laterais estimados: ${numPasses})`);
  linhas.push(`G97 S${Math.round(rpm)} M03`);
  linhas.push(`G00 X${fmt(diametroExterno + 2)} Z${fmt(zInicial)}`);
  linhas.push(`G75 R0.3`);
  linhas.push(`G75 X${fmt(diametroCanal)} Z${fmt(zFinal)} P2000 Q${Math.round(q * 1000)} F${fmt(avanco)}`);
  linhas.push(`G00 X${fmt(diametroExterno + 2)}`);
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
                             D = 80, n = 6, anguloInicial = 0,
                             profundidade = 15, zSeguro = 50,
                             q = 5, r = 2,
                             rpm = 900, avanco = 0.1 } = {}) {
  if (!Number.isFinite(D) || D <= 0) return '';
  if (!Number.isInteger(n) || n < 2) return '';

  const linhas = [];
  linhas.push(cabecalho(numeroPrograma, nomePeca));
  linhas.push(`(MACRO B - FURACAO CIRCULAR)`);
  linhas.push(`(Diametro: ${fmt(D)} mm | Numero furos: ${n} | Angulo inicial: ${fmt(anguloInicial, 1)} graus)`);
  linhas.push(`(Profundidade: ${fmt(profundidade)} mm | Q: ${fmt(q)} mm | R: ${fmt(r)} mm | Z seguro: ${fmt(zSeguro)} mm)`);
  linhas.push(`G97 S${Math.round(rpm)} M03`);
  linhas.push(`G00 Z${fmt(zSeguro)}`);
  linhas.push(`#100 = ${fmt(D / 2)}   (RAIO)`);
  linhas.push(`#101 = ${n}   (NUMERO DE FUROS)`);
  linhas.push(`#102 = ${fmt(profundidade)}   (PROFUNDIDADE)`);
  linhas.push(`#103 = 360 / #101   (PASSO ANGULAR)`);
  linhas.push(`#104 = ${fmt(anguloInicial, 1)}   (ANGULO INICIAL)`);
  linhas.push(`#105 = 0   (CONTADOR)`);
  linhas.push(`WHILE [#105 LT #101] DO 1`);
  linhas.push(`  #110 = #104 + #105 * #103   (ANGULO ATUAL)`);
  linhas.push(`  #111 = #100 * COS[#110]     (X)`);
  linhas.push(`  #112 = #100 * SIN[#110]     (Y)`);
  linhas.push(`  G00 X#111 Y#112`);
  linhas.push(`  G83 Z-#102 R${fmt(r)} Q${fmt(q)} F${fmt(avanco)}`);
  linhas.push(`  G80`);
  linhas.push(`  #105 = #105 + 1`);
  linhas.push(`END 1`);
  linhas.push(`G00 Z${fmt(zSeguro)}`);
  linhas.push(rodape());
  return linhas.join('\n');
}
