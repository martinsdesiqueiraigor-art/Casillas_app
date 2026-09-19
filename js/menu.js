// menu.js — Menu lateral (abertura, fechamento, item ativo)

let overlayEl = null;
let menuEl = null;
let listEl = null;
let onSelectCb = null;

function ensureRefs() {
  overlayEl = overlayEl || document.getElementById('menu-overlay');
  menuEl = menuEl || document.getElementById('side-menu');
  listEl = listEl || document.getElementById('menu-list');
}

export function initMenu(onModuleSelect) {
  ensureRefs();
  if (typeof onModuleSelect === 'function') onSelectCb = onModuleSelect;

  const openBtn = document.getElementById('open-menu-btn');
  const closeBtn = document.getElementById('close-menu-btn');

  if (openBtn && openBtn.dataset.wired !== '1') {
    openBtn.dataset.wired = '1';
    openBtn.addEventListener('click', openMenu);
  }
  if (closeBtn && closeBtn.dataset.wired !== '1') {
    closeBtn.dataset.wired = '1';
    closeBtn.addEventListener('click', closeMenu);
  }
  if (overlayEl && overlayEl.dataset.wired !== '1') {
    overlayEl.dataset.wired = '1';
    overlayEl.addEventListener('click', closeMenu);
  }

  if (listEl && listEl.dataset.wired !== '1') {
    listEl.dataset.wired = '1';
    listEl.addEventListener('click', (ev) => {
      const li = ev.target.closest('li[data-module]');
      if (!li) return;
      const key = li.dataset.module;
      if (!key) return;
      setActiveMenuItem(key);
      closeMenu();
      if (onSelectCb) onSelectCb(key);
    });
  }
}

export function openMenu() {
  ensureRefs();
  if (overlayEl) overlayEl.classList.remove('hidden');
  if (menuEl) {
    menuEl.classList.add('open');
    menuEl.setAttribute('aria-hidden', 'false');
  }
  document.body.classList.add('menu-open');
}

export function closeMenu() {
  ensureRefs();
  if (overlayEl) overlayEl.classList.add('hidden');
  if (menuEl) {
    menuEl.classList.remove('open');
    menuEl.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('menu-open');
}

export function setActiveMenuItem(moduleKey) {
  ensureRefs();
  if (!listEl) return;
  const items = listEl.querySelectorAll('li[data-module]');
  items.forEach((li) => {
    if (li.dataset.module === moduleKey) li.classList.add('active');
    else li.classList.remove('active');
  });
}

// ═══════════════════════════════════════════════════════════
// DROPDOWN DE OPÇÕES DO CABEÇALHO (⋮)
// ═══════════════════════════════════════════════════════════

let optionsMenuEl = null;
let optionsBtnEl = null;

export function initOptionsMenu() {
  optionsMenuEl = document.getElementById('options-menu');
  optionsBtnEl = document.getElementById('open-options-btn');

  if (!optionsMenuEl || !optionsBtnEl) return;
  if (optionsBtnEl.dataset.wired === '1') return;
  optionsBtnEl.dataset.wired = '1';

  optionsBtnEl.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const isHidden = optionsMenuEl.classList.contains('hidden');
    if (isHidden) {
      optionsMenuEl.classList.remove('hidden');
    } else {
      optionsMenuEl.classList.add('hidden');
    }
  });

  document.addEventListener('click', (ev) => {
    if (optionsMenuEl.classList.contains('hidden')) return;
    if (optionsMenuEl.contains(ev.target)) return;
    if (optionsBtnEl.contains(ev.target)) return;
    optionsMenuEl.classList.add('hidden');
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      optionsMenuEl.classList.add('hidden');
    }
  });
}

export function closeOptionsMenu() {
  if (optionsMenuEl) optionsMenuEl.classList.add('hidden');
}
