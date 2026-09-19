// keyboard.js — Teclado numérico custom para inputs

import { createElementSafe } from './utils.js';

const KEYS = [
  '7', '8', '9', '⌫',
  '4', '5', '6', 'C',
  '1', '2', '3', ',',
  '0', '.', '-', 'OK'
];

let currentInput = null;
let keyboardEl = null;

function isInputTarget(el) {
  return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
}

function insertAtCursor(input, text) {
  // Se o input está focado, usa a posição do cursor.
  // Caso contrário, adiciona ao FINAL do valor (fallback seguro).
  if (document.activeElement === input) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const value = input.value;
    input.value = value.slice(0, start) + text + value.slice(end);
    const pos = start + text.length;
    try {
      input.setSelectionRange(pos, pos);
    } catch {
      // ignora
    }
  } else {
    // Fallback: adiciona ao final
    input.value = (input.value || '') + text;
  }
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function deleteBack(input) {
  if (!input) return;

  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const value = input.value;

  if (start !== end) {
    input.value = value.slice(0, start) + value.slice(end);
    try { input.setSelectionRange(start, start); } catch {}
  } else if (start > 0) {
    input.value = value.slice(0, start - 1) + value.slice(start);
    try { input.setSelectionRange(start - 1, start - 1); } catch {}
  }

  // Dispara input + mantém o foco no input
  input.dispatchEvent(new Event('input', { bubbles: true }));

  // Garante que o input continua focado
  if (document.activeElement !== input) {
    try { input.focus(); } catch {}
  }
}

function handleKey(key) {
  if (!currentInput) return;

  if (key === 'OK') {
    hideKeyboard();
    return;
  }
  if (key === 'C') {
    currentInput.value = '';
    currentInput.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  if (key === '⌫') {
    deleteBack(currentInput);
    return;
  }
  if (key === ',' || key === '.') {
    // Impede mais de um separador decimal
    const val = currentInput.value;
    if (val.includes('.') || val.includes(',')) return;
    insertAtCursor(currentInput, '.');
    return;
  }
  if (key === '-') {
    const val = currentInput.value;
    if (val.startsWith('-')) {
      currentInput.value = val.slice(1);
      currentInput.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      insertAtCursor(currentInput, '-');
    }
    return;
  }
  // dígitos
  insertAtCursor(currentInput, key);
}

function buildKeyboard() {
  const wrap = createElementSafe('div', { class: 'kbd-grid' });
  KEYS.forEach((k) => {
    const isAction = k === '⌫' || k === 'C' || k === 'OK';
    const btn = createElementSafe('button', {
      type: 'button',
      class: 'kbd-key' + (isAction ? ' kbd-action' : ''),
      text: k
    });
    btn.addEventListener('click', () => handleKey(k));
    wrap.appendChild(btn);
  });
  return wrap;
}

export function initKeyboard() {
  keyboardEl = document.getElementById('custom-keyboard');
  if (!keyboardEl) return;

  // Verifica se o teclado já foi construído (tem filhos)
  const jaConstruido = keyboardEl.children.length > 0;

  if (jaConstruido) return;

  // Reconstrói o teclado do zero
  while (keyboardEl.firstChild) keyboardEl.removeChild(keyboardEl.firstChild);
  keyboardEl.appendChild(buildKeyboard());
  keyboardEl.dataset.init = '1';
}

export function bindInputsToKeyboard(container) {
  if (!container) return;
  const inputs = container.querySelectorAll('input[inputmode], input[type="text"], input[type="number"]');
  inputs.forEach((input) => {
    if (input.dataset.kbdBound === '1') return;
    input.dataset.kbdBound = '1';
    input.setAttribute('inputmode', 'none');
    input.addEventListener('focus', () => showKeyboard(input));
    input.addEventListener('click', () => showKeyboard(input));
  });
}

export function showKeyboard(input) {
  if (!isInputTarget(input)) return;
  if (!keyboardEl) keyboardEl = document.getElementById('custom-keyboard');
  if (!keyboardEl) return;

  currentInput = input;
  keyboardEl.classList.remove('hidden');
  keyboardEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('kbd-open');
}

export function hideKeyboard() {
  if (!keyboardEl) keyboardEl = document.getElementById('custom-keyboard');
  if (keyboardEl) {
    keyboardEl.classList.add('hidden');
    keyboardEl.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('kbd-open');
  if (currentInput && typeof currentInput.blur === 'function') {
    currentInput.blur();
  }
  currentInput = null;
}
