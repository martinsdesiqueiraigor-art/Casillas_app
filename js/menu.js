import { ICONS } from './icons.js';
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

// ═══════════════════════════════════════════════════════════
// BOTÃO "COMPARTILHAR APP"
// ═══════════════════════════════════════════════════════════

export function initShareButton() {
  const btn = document.getElementById('menu-share');
  if (!btn || btn.dataset.wired === '1') return;
  btn.dataset.wired = '1';

  btn.addEventListener('click', async () => {
    // Fecha o menu lateral
    closeMenu();

    const url = window.location.href;
    const texto = 'Casillas App — Calculadora Técnica de Usinagem';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Casillas App',
          text: texto,
          url: url
        });
      } catch {
        // Usuário cancelou — ignorar
      }
    } else {
      // Fallback: copia para clipboard
      try {
        await navigator.clipboard.writeText(`${texto}\n${url}`);
        // Importa showToast dinamicamente
        const { showToast } = await import('./utils.js');
        showToast('Link copiado!', 'success');
      } catch {
        const { showToast } = await import('./utils.js');
        showToast('Não foi possível compartilhar', 'error');
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════
// INJETAR SVGs NOS TÍTULOS DAS CATEGORIAS
// ═══════════════════════════════════════════════════════════

export function renderMenuIcons() {
  // Injeta nos títulos das categorias
  const titulos = document.querySelectorAll('.menu-category-title[data-icon]');
  titulos.forEach((titulo) => {
    const key = titulo.dataset.icon;
    const fn = ICONS[key];
    if (!fn) return;

    // Verifica se já tem SVG (evita duplicar)
    if (titulo.querySelector('svg')) return;

    // Cria um wrapper para o ícone
    const iconWrap = document.createElement('span');
    iconWrap.className = 'menu-category-icon';
    iconWrap.innerHTML = fn(14);

    // Insere o ícone ANTES do texto
    titulo.insertBefore(iconWrap, titulo.firstChild);
  });

  // Injeta nos ícones dos módulos (menu lateral)
  const menuItens = document.querySelectorAll('.menu-item[data-module]');
  menuItens.forEach((item) => {
    const key = item.dataset.module;
    const fn = ICONS[key];
    if (!fn) return;

    const iconEl = item.querySelector('.menu-icon');
    if (!iconEl) return;

    // Verifica se já tem SVG (evita duplicar)
    if (iconEl.querySelector('svg')) return;

    iconEl.innerHTML = fn(16);
    iconEl.classList.add('menu-icon-svg');
  });
}
