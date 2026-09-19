// app.js — Ponto de entrada: inicializa DB, trial, menu, teclado e roteia módulos

import { initDB } from './db.js';
import { showToast } from './utils.js';
import { loadInitialState, persistCurrentModule, appState } from './state.js';
import { checkTrialStatus } from './trial.js';
import { initKeyboard, bindInputsToKeyboard, hideKeyboard } from './keyboard.js';
import { initMenu, setActiveMenuItem } from './menu.js';

// Registro dos módulos (carregamento dinâmico)
const MODULE_LOADERS = {
  trig:      () => import('./modules/trig.js'),
  coni:      () => import('./modules/coni.js'),
  poly:      () => import('./modules/poly.js'),
  furos:     () => import('./modules/furos.js'),
  rosca:     () => import('./modules/rosca.js'),
  tol:       () => import('./modules/tol.js'),
  potencia:  () => import('./modules/potencia.js'),
  chaveta:   () => import('./modules/chaveta.js'),
  conicpad:  () => import('./modules/conicpad.js'),
  prog:      () => import('./modules/prog.js'),
  consult:   () => import('./modules/consult.js')
};

const MODULE_TITLES = {
  trig:     { name: 'Trigonometria',      icon: '📐' },
  coni:     { name: 'Conicidade',         icon: '📏' },
  poly:     { name: 'Polígonos',          icon: '⬡' },
  furos:    { name: 'Furação Circular',   icon: '⚫' },
  rosca:    { name: 'Roscas',             icon: '🌀' },
  tol:      { name: 'Tolerâncias ISO',    icon: '📊' },
  potencia: { name: 'Potência de Corte',  icon: '⚡' },
  chaveta:  { name: 'Chaveta DIN 6885',   icon: '🔧' },
  conicpad: { name: 'Conicidades Padrão', icon: '🎯' },
  prog:     { name: 'Programação CNC',    icon: '🖥️' },
  consult:  { name: 'Consultoria',        icon: '💬' }
};

async function loadModule(key) {
  if (!MODULE_LOADERS[key]) {
    showToast(`Módulo "${key}" não encontrado`, 'error');
    return;
  }
  const content = document.getElementById('app-content');
  if (!content) return;

  // Limpa conteúdo
  while (content.firstChild) content.removeChild(content.firstChild);

  hideKeyboard();

  try {
    const mod = await MODULE_LOADERS[key]();
    if (typeof mod.render !== 'function') {
      showToast('Módulo inválido (sem render)', 'error');
      return;
    }

    const title = MODULE_TITLES[key] || { name: key, icon: '⚙️' };
    const headerName = document.getElementById('module-indicator-name');
    const headerIcon = document.getElementById('module-indicator-icon');
    if (headerName) headerName.textContent = title.name;
    if (headerIcon) headerIcon.textContent = title.icon;

    mod.render(content);
    bindInputsToKeyboard(content);
    setActiveMenuItem(key);
    appState.currentModule = key;
    await persistCurrentModule(key);
  } catch (err) {
    console.error('Erro ao carregar módulo:', err);
    showToast('Falha ao carregar o módulo', 'error');
  }
}

function initInstallButton() {
  const btn = document.getElementById('btn-install');
  if (!btn) return;

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (ev) => {
    ev.preventDefault();
    deferredPrompt = ev;
    btn.classList.remove('hidden');
  });

  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } catch {
      // ignora
    }
    deferredPrompt = null;
    btn.classList.add('hidden');
  });

  window.addEventListener('appinstalled', () => {
    btn.classList.add('hidden');
    showToast('Casillas App instalado!', 'success');
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch((err) => {
      console.warn('Falha ao registrar service worker:', err);
    });
  });
}

async function boot() {
  try {
    await initDB();
  } catch (err) {
    console.error('Falha ao inicializar DB:', err);
  }

  initKeyboard();
  initInstallButton();
  registerServiceWorker();

  await loadInitialState();
  initMenu(loadModule);

  // Verifica trial ANTES de mostrar o app
  const trial = await checkTrialStatus();
  if (!trial.ok) {
    // Tela de ativação já foi exibida
    return;
  }

  const initial = appState.currentModule || 'trig';
  await loadModule(initial);
}

// Reagir a ativação (esconder tela, carregar módulo)
window.addEventListener('casillas:activated', () => {
  const initial = appState.currentModule || 'trig';
  loadModule(initial);
});

document.addEventListener('DOMContentLoaded', boot);
