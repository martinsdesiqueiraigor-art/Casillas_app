// trial.js — Sistema de trial (30 dias) + ativação por código (Modelo 2)
// Modelo 2: Códigos pré-gerados, NÃO vinculados ao Device ID.
// Cada código funciona em até 3 aparelhos diferentes.
// Códigos podem ser revogados (lista negra embutida).

import { getDB, setDB } from './db.js';

const TRIAL_DAYS = 30;
const WHATSAPP = '5519996816755';
const DAY_MS = 86400000;
const MAX_DEVICES_PER_CODE = 3;

const KEYS = {
  install: 'trial-install-date',
  lastSeen: 'trial-last-seen',
  activated: 'trial-activated',
  activeCode: 'trial-active-code',
  deviceId: 'device-id',
  activatedCodes: 'activated-codes-registry'
};

// ═══════════════════════════════════════════════════════════
// LISTA DE CÓDIGOS VÁLIDOS (hash FNV-1a, 8 caracteres)
// ═══════════════════════════════════════════════════════════
// IMPORTANTE: Esta lista é gerada pelo gerar-codigo.html
// Cole aqui os HASHES (não os códigos em texto puro)
// Formato: 'A1B2C3D4'

const CODIGOS_VALIDOS_HASH = [
  'AD8AA78C',
  'AE5D3EF2',
  'C1C0F658',
  'E103AB08',
  '2F39DDDE',
  '05FA2257',
  'E965AA90',
  '4804DC9C',
  '9C4DF04C',
  '09A60293',
  // Cole os hashes aqui
];

// Lista negra (códigos revogados)
const CODIGOS_REVOGADOS_HASH = [
  // Cole os hashes revogados aqui
];

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════

function getOrCreateDeviceId() {
  let id = localStorage.getItem(KEYS.deviceId);
  if (id && id.length >= 8) return id;

  const bytes = new Uint8Array(16);
  if (self.crypto && self.crypto.getRandomValues) {
    self.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  id = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  localStorage.setItem(KEYS.deviceId, id);
  return id;
}

function hashCodigo(codigo) {
  let h = 0x811c9dc5;
  const s = String(codigo).toUpperCase().replace(/[^A-Z0-9]/g, '');
  for (let i = 0; i < s.length; i++) {
    h = ((h ^ s.charCodeAt(i)) * 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0').toUpperCase();
}

function normalizeCode(raw) {
  const clean = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.startsWith('CASILLAS') && clean.length >= 16) {
    return 'CASILLAS-' + clean.slice(8, 12) + '-' + clean.slice(12, 16);
  }
  return clean;
}

// ═══════════════════════════════════════════════════════════
// REGISTRO DE CÓDIGOS ATIVADOS
// ═══════════════════════════════════════════════════════════

async function getActivatedCodesRegistry() {
  const reg = await getDB('config', KEYS.activatedCodes);
  return (reg && typeof reg === 'object') ? reg : {};
}

async function registrarAtivacao(codeHash, deviceId) {
  const reg = await getActivatedCodesRegistry();
  if (!reg[codeHash]) reg[codeHash] = [];
  if (!reg[codeHash].includes(deviceId)) {
    reg[codeHash].push(deviceId);
  }
  await setDB('config', KEYS.activatedCodes, reg);
  return reg[codeHash].length;
}

async function contarAparelhos(codeHash) {
  const reg = await getActivatedCodesRegistry();
  return (reg[codeHash] || []).length;
}

// ═══════════════════════════════════════════════════════════
// VERIFICAÇÃO DE CÓDIGO
// ═══════════════════════════════════════════════════════════

async function validarCodigo(codigo) {
  const normalizado = normalizeCode(codigo);
  const hash = hashCodigo(normalizado);

  if (CODIGOS_REVOGADOS_HASH.includes(hash)) {
    return { ok: false, reason: 'revoked' };
  }

  if (!CODIGOS_VALIDOS_HASH.includes(hash)) {
    return { ok: false, reason: 'invalid' };
  }

  const deviceId = getOrCreateDeviceId();
  const aparelhos = await contarAparelhos(hash);

  if (aparelhos >= MAX_DEVICES_PER_CODE) {
    const reg = await getActivatedCodesRegistry();
    const jaAtivouNeste = (reg[hash] || []).includes(deviceId);
    if (!jaAtivouNeste) {
      return { ok: false, reason: 'limit' };
    }
  }

  return { ok: true, hash, codigo: normalizado };
}

// ═══════════════════════════════════════════════════════════
// UI — TELA DE ATIVAÇÃO
// ═══════════════════════════════════════════════════════════

function showActivationScreen(mensagem) {
  const screen = document.getElementById('activation-screen');
  if (screen) screen.classList.remove('hidden');
  const content = document.getElementById('app-content');
  if (content) content.classList.add('hidden');
  if (mensagem && screen) {
    const msgEl = screen.querySelector('.activation-sub');
    if (msgEl) msgEl.textContent = mensagem;
  }
}

function hideActivationScreen() {
  const screen = document.getElementById('activation-screen');
  if (screen) screen.classList.add('hidden');
  const content = document.getElementById('app-content');
  if (content) content.classList.remove('hidden');
}

function showTrialBanner(daysLeft) {
  const banner = document.getElementById('trial-banner');
  const msg = document.getElementById('trial-message');
  if (!banner || !msg) return;

  if (daysLeft > 0 && daysLeft <= 7) {
    msg.textContent = `Período de avaliação: ${daysLeft} dia(s) restante(s).`;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

function wireActivationButtons() {
  const btnSubmit = document.getElementById('btn-submit-activation');
  const btnBuy = document.getElementById('btn-buy-license');
  const input = document.getElementById('activation-code');

  if (btnSubmit && !btnSubmit.dataset.wired) {
    btnSubmit.dataset.wired = '1';
    btnSubmit.addEventListener('click', async () => {
      const raw = (input && input.value) || '';
      if (!raw.trim()) {
        const { showToast } = await import('./utils.js');
        showToast('Digite o código de ativação.', 'warning');
        return;
      }

      const resultado = await validarCodigo(raw);

      if (resultado.ok) {
        const deviceId = getOrCreateDeviceId();
        const total = await registrarAtivacao(resultado.hash, deviceId);
        await setDB('config', KEYS.activated, true);
        await setDB('config', KEYS.activeCode, resultado.codigo);

        hideActivationScreen();
        const banner = document.getElementById('trial-banner');
        if (banner) banner.classList.add('hidden');

        window.dispatchEvent(new CustomEvent('casillas:activated'));

        const { showToast } = await import('./utils.js');
        showToast(`App ativado! (${total}/${MAX_DEVICES_PER_CODE} aparelhos)`, 'success');
      } else {
        const { showToast } = await import('./utils.js');
        const msgs = {
          invalid: 'Código inválido. Verifique e tente novamente.',
          revoked: 'Este código foi revogado. Contate o suporte.',
          limit: `Este código já foi ativado em ${MAX_DEVICES_PER_CODE} aparelhos.`
        };
        showToast(msgs[resultado.reason] || 'Erro na ativação.', 'error');
      }
    });
  }

  if (btnBuy && !btnBuy.dataset.wired) {
    btnBuy.dataset.wired = '1';
    btnBuy.addEventListener('click', () => {
      const msg = encodeURIComponent(
        'Olá! Quero comprar uma licença do Casillas App.'
      );
      window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
    });
  }

  if (input && !input.dataset.wired) {
    input.dataset.wired = '1';
    input.addEventListener('input', () => {
      let v = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (v.length > 16) v = v.slice(0, 16);
      const parts = [];
      if (v.startsWith('CASILLAS')) {
        parts.push('CASILLAS');
        const resto = v.slice(8);
        for (let i = 0; i < resto.length && i < 8; i += 4) {
          parts.push(resto.slice(i, i + 4));
        }
      } else {
        for (let i = 0; i < v.length; i += 4) parts.push(v.slice(i, i + 4));
      }
      input.value = parts.join('-');
    });
  }
}

// ═══════════════════════════════════════════════════════════
// VERIFICAÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════

export async function checkTrialStatus() {
  const now = Date.now();

  let installDate = await getDB('config', KEYS.install);
  if (typeof installDate !== 'number' || !Number.isFinite(installDate)) {
    installDate = now;
    await setDB('config', KEYS.install, installDate);
  }

  const isActivated = (await getDB('config', KEYS.activated)) === true;

  const lastSeen = await getDB('config', KEYS.lastSeen);
  await setDB('config', KEYS.lastSeen, now);

  wireActivationButtons();

  if (isActivated) {
    hideActivationScreen();
    const banner = document.getElementById('trial-banner');
    if (banner) banner.classList.add('hidden');
    return { ok: true, activated: true, daysLeft: Infinity };
  }

  if (typeof lastSeen === 'number' && now < lastSeen - DAY_MS) {
    showActivationScreen('Detectamos uma alteração no relógio. Ative o app para continuar.');
    return { ok: false, activated: false, reason: 'tampered', daysLeft: 0 };
  }

  const elapsed = now - installDate;
  const daysUsed = Math.floor(elapsed / DAY_MS);
  const daysLeft = Math.max(0, TRIAL_DAYS - daysUsed);

  if (daysLeft <= 0) {
    showActivationScreen('Seu período de avaliação terminou. Ative o app para continuar.');
    return { ok: false, activated: false, reason: 'expired', daysLeft: 0 };
  }

  hideActivationScreen();
  showTrialBanner(daysLeft);
  return { ok: true, activated: false, daysLeft };
}

export { TRIAL_DAYS, WHATSAPP, MAX_DEVICES_PER_CODE, hashCodigo };
