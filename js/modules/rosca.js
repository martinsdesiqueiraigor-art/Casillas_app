// rosca.js (module) — UI do módulo Roscas

import {
  PASSOS_METRICA, PASSOS_UNC, PASSOS_UNF, PASSOS_BSW,
  calcularMetrica, calcularPolegada, medidaSobre3Rolos
} from '../calc/rosca.js';
import { formatNumber, parseInput, createElementSafe, showToast } from '../utils.js';
import { updateKPIs, updateHeader } from '../state.js';

let currentTab = 'metrica';
let metricaSel = 'M10';
let polSel = '1/2';

function resultRow(label, value) {
  return createElementSafe('div', { class: 'result-row' }, [
    createElementSafe('span', { class: 'result-label', text: label }),
    createElementSafe('span', { class: 'result-value', text: value })
  ]);
}

function inputGroup(label, id) {
  const g = createElementSafe('div', { class: 'input-group' }, [
    createElementSafe('label', { for: id, text: label })
  ]);
  const wrap = createElementSafe('div', { class: 'input-with-clear' }, [
    createElementSafe('input', {
      id, class: 'input', type: 'text', inputmode: 'decimal',
      placeholder: '0', autocomplete: 'off', spellcheck: 'false'
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

function selectGroup(label, id, options) {
  const g = createElementSafe('div', { class: 'input-group' }, [
    createElementSafe('label', { for: id, text: label })
  ]);
  const sel = createElementSafe('select', { id, class: 'input' });
  options.forEach((opt) => {
    sel.appendChild(createElementSafe('option', { value: opt.value, text: opt.label }));
  });
  g.appendChild(sel);
  return g;
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? parseInput(el.value) : NaN;
}

function renderResults(res, rolos) {
  const wrap = createElementSafe('div');
  if (!res) {
    wrap.appendChild(createElementSafe('p', { class: 'result-hint', text: 'Selecione um padrão e calcule.' }));
    return wrap;
  }
  wrap.appendChild(resultRow('Tipo', res.tipo));
  wrap.appendChild(resultRow('Ângulo do filete', formatNumber(res.angulo, 1) + '°'));
  wrap.appendChild(resultRow('Diâmetro nominal d', formatNumber(res.d, 4) + ' mm'));
  wrap.appendChild(resultRow('Passo P', formatNumber(res.passo, 4) + ' mm'));
  wrap.appendChild(resultRow('Altura H', formatNumber(res.H, 4) + ' mm'));
  wrap.appendChild(resultRow('Altura h1', formatNumber(res.h1, 4) + ' mm'));
  wrap.appendChild(resultRow('Diâmetro médio d2', formatNumber(res.d2, 4) + ' mm'));
  wrap.appendChild(resultRow('Diâmetro interno d1', formatNumber(res.d1, 4) + ' mm'));
  if (Number.isFinite(res.d3) && res.d3 !== res.d1) {
    wrap.appendChild(resultRow('Diâmetro fundo d3', formatNumber(res.d3, 4) + ' mm'));
  }
  if (Number.isFinite(res.tpi)) {
    wrap.appendChild(resultRow('Fios por polegada (TPI)', String(res.tpi)));
  }
  if (rolos) {
    wrap.appendChild(resultRow('Medida sobre 3 rolos (M)', formatNumber(rolos.M, 4) + ' mm'));
  }
  return wrap;
}

export function render(container) {
  while (container.firstChild) container.removeChild(container.firstChild);
  updateHeader('Roscas', '🌀');

  const card = createElementSafe('div', { class: 'card' });
  card.appendChild(createElementSafe('h2', { class: 'card-title', text: '🌀 Roscas' }));

  // Tabs
  const tabs = createElementSafe('div', { class: 'rosca-tabs' });
  const tabList = [
    { key: 'metrica', label: 'Métrica' },
    { key: 'unc',     label: 'UNC' },
    { key: 'unf',     label: 'UNF' },
    { key: 'bsw',     label: 'Whitworth' }
  ];
  tabList.forEach((t) => {
    const btn = createElementSafe('button', {
      type: 'button',
      class: 'rosca-tab' + (currentTab === t.key ? ' active' : ''),
      text: t.label,
      onclick: (ev) => {
        currentTab = t.key;
        ev.target.parentElement.querySelectorAll('.rosca-tab').forEach((b) => b.classList.remove('active'));
        ev.target.classList.add('active');
        renderFields();
      }
    });
    tabs.appendChild(btn);
  });
  card.appendChild(tabs);

  const fieldsWrap = createElementSafe('div');
  card.appendChild(fieldsWrap);

  card.appendChild(createElementSafe('button', {
    type: 'button', class: 'btn btn-primary', text: 'Calcular',
    onclick: calcular
  }));

  const resultWrap = createElementSafe('div');
  resultWrap.appendChild(renderResults(null, null));
  card.appendChild(resultWrap);

  container.appendChild(card);

  function optionsFrom(table) {
    return Object.keys(table).map((k) => ({ value: k, label: k }));
  }

  function renderFields() {
    while (fieldsWrap.firstChild) fieldsWrap.removeChild(fieldsWrap.firstChild);

    if (currentTab === 'metrica') {
      const opts = optionsFrom(PASSOS_METRICA).map((o) => ({
        value: o.value,
        label: o.value + ' × ' + PASSOS_METRICA[o.value].passo
      }));
      fieldsWrap.appendChild(selectGroup('Rosca métrica', 'rosca-sel', opts));
      const sel = fieldsWrap.querySelector('#rosca-sel');
      if (sel) sel.value = metricaSel;
      if (sel) sel.addEventListener('change', () => { metricaSel = sel.value; });
      fieldsWrap.appendChild(inputGroup('Diâmetro do rolo (mm) — opcional', 'rosca-rolo'));
    } else if (currentTab === 'unc' || currentTab === 'unf' || currentTab === 'bsw') {
      const table = currentTab === 'unc' ? PASSOS_UNC : (currentTab === 'unf' ? PASSOS_UNF : PASSOS_BSW);
      const opts = Object.keys(table).map((k) => ({
        value: k,
        label: k + '" × ' + table[k].tpi + ' TPI'
      }));
      fieldsWrap.appendChild(selectGroup('Rosca em polegada', 'rosca-sel', opts));
      const sel = fieldsWrap.querySelector('#rosca-sel');
      if (sel && table[polSel]) sel.value = polSel;
      if (sel) sel.addEventListener('change', () => { polSel = sel.value; });
      fieldsWrap.appendChild(inputGroup('Diâmetro do rolo (mm) — opcional', 'rosca-rolo'));
    }
  }

  function calcular() {
    const sel = fieldsWrap.querySelector('#rosca-sel');
    if (!sel) { showToast('Selecione uma rosca', 'warning'); return; }
    const key = sel.value;
    let res = null;

    if (currentTab === 'metrica') {
      const spec = PASSOS_METRICA[key];
      if (!spec) { showToast('Rosca inválida', 'error'); return; }
      res = calcularMetrica(spec.d, spec.passo);
    } else {
      const table = currentTab === 'unc' ? PASSOS_UNC : (currentTab === 'unf' ? PASSOS_UNF : PASSOS_BSW);
      const spec = table[key];
      if (!spec) { showToast('Rosca inválida', 'error'); return; }
      const tipo = currentTab === 'unc' ? 'UNC' : (currentTab === 'unf' ? 'UNF' : 'BSW');
      res = calcularPolegada(spec.d, spec.tpi, tipo);
    }

    if (!res) { showToast('Dados inválidos', 'error'); return; }

    let rolos = null;
    const dw = getVal('rosca-rolo');
    if (Number.isFinite(dw) && dw > 0) {
      // Rolo ideal = passo/(2*cos(α/2)) para 60°, mas usamos um valor genérico
      rolos = medidaSobre3Rolos(res.d2, res.passo, dw, res.angulo);
    }

    while (resultWrap.firstChild) resultWrap.removeChild(resultWrap.firstChild);
    resultWrap.appendChild(renderResults(res, rolos));

    updateKPIs([
      { label: 'Passo', value: formatNumber(res.passo, 4) + ' mm' },
      { label: 'd2',    value: formatNumber(res.d2, 3) + ' mm' },
      { label: 'd1',    value: formatNumber(res.d1, 3) + ' mm' }
    ]);
    showToast('Rosca calculada', 'success');
  }

  renderFields();
  updateKPIs([
    { label: 'Passo', value: '—' },
    { label: 'd2', value: '—' },
    { label: 'd1', value: '—' }
  ]);
}
