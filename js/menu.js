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
