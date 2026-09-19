// prog.js (module) — UI do módulo Programação CNC (Fanuc Macro B)
// Sub-módulos: furos circulares, roscamento, desbaste, canal.

import {
  gcodeFurosCirculares,
  gcodeRoscamento,
  gcodeDesbaste,
  gcodeCanal,
  gcodeRoscaMultipla,
  macroFuros
} from '../calc/gcode.js';
import { formatNumber, parseInput, createElementSafe, showToast } from '../utils.js';
import { updateKPIs, updateHeader } from '../state.js';

let currentSub = 'furos';

function inputGroup(label, id, placeholder) {
  const g = createElementSafe('div', { class: 'input-group' }, [
    createElementSafe('label', { for: id, text: label })
  ]);
  const wrap = createElementSafe('div', { class: 'input-with-clear' }, [
    createElementSafe('input', {
      id, class: 'input', type: 'text', inputmode: 'decimal',
      placeholder: placeholder || '0', autocomplete: 'off', spellcheck: 'false'
    }),
    createElementSafe('button', {
      type: 'button', class: 'clear-btn', 'aria-label': 'Limpar', text: '✕',
      onclick: () => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.dispatchEvent(new Event('input', { bubbles: true })); }
      }
    })
  ]);
  g.appendChild(wrap);
  return g;
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? parseInput(el.value) : NaN;
}

function renderGcode(texto) {
  const wrap = createElementSafe('div');
  if (!texto) {
    wrap.appendChild(createElementSafe('p', {
      class: 'result-hint',
      text: 'Preencha os parâmetros e gere o código.'
    }));
    return wrap;
  }

  const pre = createElementSafe('pre', { class: 'gcode-container' });
  pre.textContent = texto;
  wrap.appendChild(pre);

  const btnRow = createElementSafe('div', { class: 'btn-row', style: { marginTop: '8px' } });

  const btnCopy = createElementSafe('button', {
    type: 'button', class: 'btn btn-secondary', text: '📋 Copiar',
    onclick: async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(texto);
          showToast('Código copiado!', 'success');
        } else {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = texto;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('Código copiado!', 'success');
        }
      } catch {
        showToast('Não foi possível copiar', 'error');
      }
    }
  });

  const btnShare = createElementSafe('button', {
    type: 'button', class: 'btn btn-outline', text: '📤 Compartilhar',
    onclick: async () => {
      try {
        if (navigator.share) {
          await navigator.share({ title: 'G-code Casillas', text: texto });
        } else {
          showToast('Compartilhamento não suportado', 'warning');
        }
      } catch {
        // cancelado
      }
    }
  });

  btnRow.appendChild(btnCopy);
  btnRow.appendChild(btnShare);
  wrap.appendChild(btnRow);

  return wrap;
}

export function render(container) {
  while (container.firstChild) container.removeChild(container.firstChild);
  updateHeader('Programação CNC', '🖥️');

  const card = createElementSafe('div', { class: 'card' });
  card.appendChild(createElementSafe('h2', { class: 'card-title', text: '🖥️ Programação CNC — Fanuc Macro B' }));

  // Sub-tabs
  const subtabs = createElementSafe('div', { class: 'prog-subtabs' });
  const subtabList = [
    { key: 'furos',    label: 'Furos Circulares' },
    { key: 'rosca',    label: 'Roscamento' },
    { key: 'desbaste', label: 'Desbaste G71' },
    { key: 'canal',    label: 'Canal G75' },
    { key: 'rmult',    label: 'Rosca Múltipla' },
    { key: 'macro',    label: 'Macro B' }
  ];
  subtabList.forEach((t) => {
    const btn = createElementSafe('button', {
      type: 'button',
      class: 'prog-subtab' + (currentSub === t.key ? ' active' : ''),
      text: t.label,
      onclick: (ev) => {
        currentSub = t.key;
        ev.target.parentElement.querySelectorAll('.prog-subtab').forEach((b) => b.classList.remove('active'));
        ev.target.classList.add('active');
        renderFields();
      }
    });
    subtabs.appendChild(btn);
  });
  card.appendChild(subtabs);

  const fieldsWrap = createElementSafe('div');
  card.appendChild(fieldsWrap);

  card.appendChild(createElementSafe('button', {
    type: 'button', class: 'btn btn-primary', text: '⚙️ Gerar Código G',
    onclick: gerar
  }));

  const resultWrap = createElementSafe('div');
  card.appendChild(resultWrap);

  container.appendChild(card);

  function renderFields() {
    while (fieldsWrap.firstChild) fieldsWrap.removeChild(fieldsWrap.firstChild);

    if (currentSub === 'furos') {
      fieldsWrap.appendChild(inputGroup('Diâmetro do círculo (mm)', 'g-D', '100'));
      fieldsWrap.appendChild(inputGroup('Número de furos', 'g-n', '6'));
      fieldsWrap.appendChild(inputGroup('Ângulo inicial (°)', 'g-a', '0'));
      fieldsWrap.appendChild(inputGroup('Profundidade (mm)', 'g-prof', '20'));
      fieldsWrap.appendChild(inputGroup('Peck (mm)', 'g-peck', '5'));
      fieldsWrap.appendChild(inputGroup('Avanço F (mm/min)', 'g-fz', '0.1'));
      fieldsWrap.appendChild(inputGroup('Rotação S (rpm)', 'g-rpm', '800'));
    } else if (currentSub === 'rosca') {
      fieldsWrap.appendChild(inputGroup('Passo (mm)', 'g-passo', '1.5'));
      fieldsWrap.appendChild(inputGroup('Comprimento da rosca (mm)', 'g-comp', '20'));
      fieldsWrap.appendChild(inputGroup('Diâmetro nominal (mm)', 'g-diam', '20'));
      fieldsWrap.appendChild(inputGroup('Rotação S (rpm)', 'g-rpm', '500'));
    } else if (currentSub === 'desbaste') {
      fieldsWrap.appendChild(inputGroup('Diâmetro inicial (mm)', 'g-di', '50'));
      fieldsWrap.appendChild(inputGroup('Diâmetro final (mm)', 'g-df', '40'));
      fieldsWrap.appendChild(inputGroup('Comprimento (mm)', 'g-comp', '60'));
      fieldsWrap.appendChild(inputGroup('Rotação S (rpm)', 'g-rpm', '800'));
      fieldsWrap.appendChild(inputGroup('Avanço F (mm/rev)', 'g-fz', '0.25'));
      fieldsWrap.appendChild(inputGroup('Profundidade por passe (mm)', 'g-ap', '1.5'));
    } else if (currentSub === 'canal') {
      fieldsWrap.appendChild(inputGroup('Diâmetro externo (mm)', 'g-de', '40'));
      fieldsWrap.appendChild(inputGroup('Largura da ferramenta (mm)', 'g-lf', '3'));
      fieldsWrap.appendChild(inputGroup('Largura do canal (mm)', 'g-lc', '3'));
      fieldsWrap.appendChild(inputGroup('Profundidade do canal (mm)', 'g-pc', '2'));
      fieldsWrap.appendChild(inputGroup('Posição Z inicial (mm)', 'g-z', '0'));
      fieldsWrap.appendChild(inputGroup('Rotação S (rpm)', 'g-rpm', '600'));
      fieldsWrap.appendChild(inputGroup('Avanço F (mm/rev)', 'g-fz', '0.08'));
    } else if (currentSub === 'rmult') {
      fieldsWrap.appendChild(inputGroup('Passo (mm)', 'g-passo', '2'));
      fieldsWrap.appendChild(inputGroup('Nº de entradas', 'g-ent', '2'));
      fieldsWrap.appendChild(inputGroup('Comprimento (mm)', 'g-comp', '25'));
      fieldsWrap.appendChild(inputGroup('Diâmetro (mm)', 'g-diam', '24'));
      fieldsWrap.appendChild(inputGroup('Rotação S (rpm)', 'g-rpm', '400'));
      fieldsWrap.appendChild(inputGroup('Profundidade (mm)', 'g-prof', '1.2'));
    } else if (currentSub === 'macro') {
      fieldsWrap.appendChild(inputGroup('Diâmetro do círculo (mm)', 'g-D', '80'));
      fieldsWrap.appendChild(inputGroup('Número de furos', 'g-n', '6'));
      fieldsWrap.appendChild(inputGroup('Profundidade (mm)', 'g-prof', '15'));
      fieldsWrap.appendChild(inputGroup('Rotação S (rpm)', 'g-rpm', '900'));
      fieldsWrap.appendChild(inputGroup('Avanço F (mm/min)', 'g-fz', '0.1'));
    }
  }

  function gerar() {
    let texto = '';
    try {
      if (currentSub === 'furos') {
        const D = getVal('g-D') || 100;
        const n = getVal('g-n') || 6;
        const a = getVal('g-a') || 0;
        const prof = getVal('g-prof') || 20;
        const peck = getVal('g-peck') || 5;
        const fz = getVal('g-fz') || 0.1;
        const rpm = getVal('g-rpm') || 800;
        texto = gcodeFurosCirculares({
          D, n: Math.round(n), anguloInicial: a,
          profundidade: prof, peck, fz, rpm: Math.round(rpm)
        });
      } else if (currentSub === 'rosca') {
        const passo = getVal('g-passo') || 1.5;
        const comp = getVal('g-comp') || 20;
        const diam = getVal('g-diam') || 20;
        const rpm = getVal('g-rpm') || 500;
        texto = gcodeRoscamento({ passo, comprimento: comp, diametro: diam, rpm: Math.round(rpm) });
      } else if (currentSub === 'desbaste') {
        const di = getVal('g-di') || 50;
        const df = getVal('g-df') || 40;
        const comp = getVal('g-comp') || 60;
        const rpm = getVal('g-rpm') || 800;
        const fz = getVal('g-fz') || 0.25;
        const ap = getVal('g-ap') || 1.5;
        texto = gcodeDesbaste({
          diametroInicial: di, diametroFinal: df,
          comprimento: comp, rpm: Math.round(rpm),
          avanco: fz, profundidadeCorte: ap
        });
      } else if (currentSub === 'canal') {
        const de = getVal('g-de') || 40;
        const lf = getVal('g-lf') || 3;
        const lc = getVal('g-lc') || 3;
        const pc = getVal('g-pc') || 2;
        const z = getVal('g-z') || 0;
        const rpm = getVal('g-rpm') || 600;
        const fz = getVal('g-fz') || 0.08;
        texto = gcodeCanal({
          diametroExterno: de, larguraFerramenta: lf,
          larguraCanal: lc, profundidadeCanal: pc,
          zInicio: z, rpm: Math.round(rpm), avanco: fz
        });
      } else if (currentSub === 'rmult') {
        const passo = getVal('g-passo') || 2;
        const ent = getVal('g-ent') || 2;
        const comp = getVal('g-comp') || 25;
        const diam = getVal('g-diam') || 24;
        const rpm = getVal('g-rpm') || 400;
        const prof = getVal('g-prof') || 1.2;
        texto = gcodeRoscaMultipla({
          passo, entradas: Math.round(ent),
          comprimento: comp, diametro: diam,
          rpm: Math.round(rpm), profundidade: prof
        });
      } else if (currentSub === 'macro') {
        const D = getVal('g-D') || 80;
        const n = getVal('g-n') || 6;
        const prof = getVal('g-prof') || 15;
        const rpm = getVal('g-rpm') || 900;
        const fz = getVal('g-fz') || 0.1;
        texto = macroFuros({
          D, n: Math.round(n), profundidade: prof,
          rpm: Math.round(rpm), avanco: fz
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao gerar código', 'error');
      return;
    }

    if (!texto) {
      showToast('Preencha os parâmetros corretamente', 'warning');
      return;
    }

    while (resultWrap.firstChild) resultWrap.removeChild(resultWrap.firstChild);
    resultWrap.appendChild(renderGcode(texto));

    const linhas = texto.split('\n').length;
    updateKPIs([
      { label: 'Sub-módulo', value: currentSub },
      { label: 'Linhas',     value: String(linhas) },
      { label: 'Status',     value: 'Pronto' }
    ]);
    showToast('G-code gerado', 'success');
  }

  renderFields();
  updateKPIs([
    { label: 'Sub-módulo', value: '—' },
    { label: 'Linhas', value: '—' },
    { label: 'Status', value: '—' }
  ]);
}
