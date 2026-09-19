// utils.js — Funções utilitárias: toast, formatação, parsing, DOM seguro

const TOAST_DURATION = 2800;

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

let toastTimer = null;

export function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const iconEl = document.getElementById('toast-icon');
  const msgEl = document.getElementById('toast-message');
  if (!container || !iconEl || !msgEl) return;

  const kind = TOAST_ICONS[type] ? type : 'info';

  iconEl.textContent = TOAST_ICONS[kind];
  msgEl.textContent = String(msg ?? '');
  container.dataset.type = kind;
  container.classList.remove('hidden');

  // Força reflow para reiniciar a transição
  void container.offsetWidth;
  container.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    container.classList.remove('show');
    setTimeout(() => container.classList.add('hidden'), 220);
  }, TOAST_DURATION);
}

export function formatNumber(v, dec = 3) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const d = Number.isInteger(dec) ? Math.max(0, Math.min(8, dec)) : 3;

  // Para valores muito pequenos ou muito grandes, usa notação científica
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-4 || abs >= 1e9)) {
    return n.toExponential(d);
  }

  return n.toFixed(d);
}

export function parseInput(v) {
  if (v === null || v === undefined) return NaN;
  const s = String(v).trim().replace(',', '.');
  if (s === '') return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export function createElementSafe(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  for (const key of Object.keys(attrs)) {
    const value = attrs[key];
    if (value === null || value === undefined) continue;

    if (key === 'class') {
      el.className = String(value);
    } else if (key === 'style' && typeof value === 'object') {
      for (const sk of Object.keys(value)) {
        el.style[sk] = value[sk];
      }
    } else if (key === 'dataset' && typeof value === 'object') {
      for (const dk of Object.keys(value)) {
        el.dataset[dk] = String(value[dk]);
      }
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'text') {
      el.textContent = String(value);
    } else {
      el.setAttribute(key, String(value));
    }
  }

  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child === null || child === undefined || child === false) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  }

  return el;
}
