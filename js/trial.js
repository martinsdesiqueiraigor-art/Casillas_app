// trial.js — Sistema de trial (30 dias) + ativação por código
// Fórmula do código:
//   combinacao = deviceId + SALT_SECRETO
//   hash = SHA-256(combinacao) em hex maiúsculo
//   codigo = primeiros 16 caracteres, formatado XXXX-XXXX-XXXX-XXXX

import { getDB, setDB } from './db.js';

const SALT_SECRETO = 'CasillasApp_SALT_2026_!@#';
const TRIAL_DAYS = 30;
const WHATSAPP = '5519996816755';
const DAY_MS = 86400000;
const KEYS = {
  install: 'trial-install-date',
  lastSeen: 'trial-last-seen',
  activated: 'trial-activated',
  deviceId: 'device-id'
};

function getOrCreateDeviceId() {
  let id = localStorage.getItem(KEYS.deviceId);
  if (id && id.length >= 8) return id;

  // Gera um ID de dispositivo pseudo-aleatório (não é criptográfico,
  // apenas identificador local para a fórmula de ativação)
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

async function sha256Hex(text) {
  if (self.crypto && self.crypto.subtle && self.crypto.subtle.digest) {
    const enc = new TextEncoder();
    const buf = await self.crypto.subtle.digest('SHA-256', enc.encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }
  // Fallback simples (não-criptográfico) caso subtle não exista
  let h1 = 0x811c9dc5;
  let h2 = 0xc9dc5118;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = ((h1 ^ c) * 16777619) >>> 0;
    h2 = ((h2 + c) * 2246822519) >>> 0;
  }
  return (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0'))
    .toUpperCase()
    .padEnd(64, '0');
}

function formatCode(raw16) {
  const clean = raw16.replace(/[^0-9A-F]/gi, '').toUpperCase().slice(0, 16);
  const padded = clean.padEnd(16, '0');
  return [
    padded.slice(0, 4),
    padded.slice(4, 8),
    padded.slice(8, 12),
    padded.slice(12, 16)
  ].join('-');
}

async function computeActivationCode(deviceId) {
  const combinacao = deviceId + SALT_SECRETO;
  const hash = await sha256Hex(combinacao);
  const raw16 = hash.slice(0, 16);
  return formatCode(raw16);
}

function showActivationScreen() {
  const screen = document.getElementById('activation-screen');
  if (screen) screen.classList.remove('hidden');
  const content = document.getElementById('app-content');
  if (content) content.classList.add('hidden');
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
      const typed = raw.trim().toUpperCase();
      const deviceId = getOrCreateDeviceId();
      const expected = await computeActivationCode(deviceId);

      if (typed === expected) {
        await setDB('config', KEYS.activated, true);
        hideActivationScreen();
        const banner = document.getElementById('trial-banner');
        if (banner) banner.classList.add('hidden');
        window.dispatchEvent(new CustomEvent('casillas:activated'));
        import('./utils.js').then(({ showToast }) => {
          showToast('App ativado com sucesso!', 'success');
        });
      } else {
        import('./utils.js').then(({ showToast }) => {
          showToast('Código de ativação inválido.', 'error');
        });
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
      // Máscara XXXX-XXXX-XXXX-XXXX
      const v = input.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 16);
      const parts = [];
      for (let i = 0; i < v.length; i += 4) parts.push(v.slice(i, i + 4));
      input.value = parts.join('-');
    });
  }
}

export async function checkTrialStatus() {
  const deviceId = getOrCreateDeviceId();
  const now = Date.now();

  // Garante installDate
  let installDate = await getDB('config', KEYS.install);
  if (typeof installDate !== 'number' || !Number.isFinite(installDate)) {
    installDate = now;
    await setDB('config', KEYS.install, installDate);
  }

  // Verifica ativação
  const isActivated = (await getDB('config', KEYS.activated)) === true;

  // Atualiza lastSeenDate
  const lastSeen = await getDB('config', KEYS.lastSeen);
  await setDB('config', KEYS.lastSeen, now);

  wireActivationButtons();

  if (isActivated) {
    hideActivationScreen();
    const banner = document.getElementById('trial-banner');
    if (banner) banner.classList.add('hidden');
    return { ok: true, activated: true, daysLeft: Infinity };
  }

  // Detecção de manipulação de relógio
  if (typeof lastSeen === 'number' && now < lastSeen - DAY_MS) {
    showActivationScreen();
    return { ok: false, activated: false, reason: 'tampered', daysLeft: 0 };
  }

  const elapsed = now - installDate;
  const daysUsed = Math.floor(elapsed / DAY_MS);
  const daysLeft = Math.max(0, TRIAL_DAYS - daysUsed);

  if (daysLeft <= 0) {
    showActivationScreen();
    return { ok: false, activated: false, reason: 'expired', daysLeft: 0 };
  }

  hideActivationScreen();
  showTrialBanner(daysLeft);
  return { ok: true, activated: false, daysLeft };
}

export async function getActivationCodeForCurrentDevice() {
  const deviceId = getOrCreateDeviceId();
  return computeActivationCode(deviceId);
}

export { TRIAL_DAYS, WHATSAPP };
