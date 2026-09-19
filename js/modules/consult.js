// consult.js (module) — UI do módulo Consultoria
// Cards informativos + contato via WhatsApp.

import { createElementSafe, showToast } from '../utils.js';
import { updateKPIs, updateHeader } from '../state.js';
import { WHATSAPP } from '../trial.js';

const SERVICOS = [
  {
    id: 'torneamento',
    icon: '🔩',
    titulo: 'Torneamento',
    desc: 'Programação, otimização de ciclos e cálculo de parâmetros para torno CNC.'
  },
  {
    id: 'fresamento',
    icon: '⚙️',
    titulo: 'Fresamento',
    desc: 'Estratégias de desbaste, acabamento, escolha de ferramentas e fixação.'
  },
  {
    id: 'cnc',
    icon: '🖥️',
    titulo: 'Programação CNC',
    desc: 'Fanuc Macro B, Siemens, Mach3 e ajustes finos de programas.'
  },
  {
    id: 'ferramental',
    icon: '🔧',
    titulo: 'Ferramental',
    desc: 'Projetos de dispositivos, gabaritos, chavetas e ajustes ISO.'
  },
  {
    id: 'consultoria',
    icon: '💼',
    titulo: 'Consultoria técnica',
    desc: 'Análise de processos, redução de tempo de ciclo e melhoria de qualidade.'
  },
  {
    id: 'treinamento',
    icon: '🎓',
    titulo: 'Treinamento',
    desc: 'Aulas in-company para operadores e programadores.'
  }
];

function abrirWhatsApp(mensagem) {
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

function cardServico(servico) {
  const card = createElementSafe('div', {
    class: 'consult-card',
    role: 'button',
    tabindex: '0',
    'aria-label': `Solicitar ${servico.titulo}`,
    onclick: () => {
      abrirWhatsApp(`Olá! Gostaria de contratar o serviço de ${servico.titulo} (${servico.desc})`);
    }
  }, [
    createElementSafe('span', { class: 'cc-icon', text: servico.icon }),
    createElementSafe('span', { class: 'cc-title', text: servico.titulo }),
    createElementSafe('span', { class: 'cc-desc', text: servico.desc })
  ]);

  card.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      abrirWhatsApp(`Olá! Gostaria de contratar o serviço de ${servico.titulo}`);
    }
  });

  return card;
}

export function render(container) {
  while (container.firstChild) container.removeChild(container.firstChild);
  updateHeader('Consultoria', '💬');

  // Card principal — contato
  const cardContato = createElementSafe('div', { class: 'card' });
  cardContato.appendChild(createElementSafe('h2', {
    class: 'card-title',
    text: '💬 Consultoria Técnica'
  }));
  cardContato.appendChild(createElementSafe('p', {
    class: 'result-hint',
    text: 'Precisa de ajuda técnica com usinagem, programação ou ferramental? Fale diretamente conosco pelo WhatsApp.'
  }));

  cardContato.appendChild(createElementSafe('button', {
    type: 'button',
    class: 'btn btn-primary',
    text: '📱 Falar no WhatsApp',
    onclick: () => abrirWhatsApp('Olá! Vim pelo Casillas App e gostaria de consultoria técnica.')
  }));

  container.appendChild(cardContato);

  // Grade de serviços
  const cardServicos = createElementSafe('div', { class: 'card' });
  cardServicos.appendChild(createElementSafe('h3', {
    class: 'card-title',
    text: '🧰 Serviços disponíveis'
  }));

  const grid = createElementSafe('div', { class: 'consult-grid' });
  SERVICOS.forEach((s) => grid.appendChild(cardServico(s)));
  cardServicos.appendChild(grid);

  container.appendChild(cardServicos);

  // Card de suporte/ativação
  const cardAtivacao = createElementSafe('div', { class: 'card' });
  cardAtivacao.appendChild(createElementSafe('h3', {
    class: 'card-title',
    text: '🔑 Ativação de licença'
  }));
  cardAtivacao.appendChild(createElementSafe('p', {
    class: 'result-hint',
    text: 'Para ativar o app ou renovar sua licença, entre em contato informando o código do seu dispositivo.'
  }));

  const btnRow = createElementSafe('div', { class: 'btn-row' });

  btnRow.appendChild(createElementSafe('button', {
    type: 'button',
    class: 'btn btn-secondary',
    text: '🔑 Ativação',
    onclick: async () => {
      try {
        const mod = await import('../trial.js');
        const codigo = await mod.getActivationCodeForCurrentDevice();
        abrirWhatsApp(`Olá! Preciso ativar o Casillas App. Meu código: ${codigo}`);
      } catch {
        showToast('Não foi possível obter o código', 'error');
      }
    }
  }));

  btnRow.appendChild(createElementSafe('button', {
    type: 'button',
    class: 'btn btn-outline',
    text: '💳 Comprar licença',
    onclick: () => abrirWhatsApp('Olá! Quero comprar uma licença do Casillas App.')
  }));

  cardAtivacao.appendChild(btnRow);
  container.appendChild(cardAtivacao);

  // Card de informações
  const cardInfo = createElementSafe('div', { class: 'card' });
  cardInfo.appendChild(createElementSafe('h3', {
    class: 'card-title',
    text: 'ℹ️ Sobre o Casillas App'
  }));
  cardInfo.appendChild(createElementSafe('p', {
    class: 'result-hint',
    text: 'Casillas App — Calculadora Técnica de Usinagem. Versão 1.0. Funciona 100% offline. Todos os cálculos seguem normas ISO, DIN e práticas de oficina.'
  }));
  container.appendChild(cardInfo);

  updateKPIs([
    { label: 'Serviços', value: String(SERVICOS.length) },
    { label: 'Versão',   value: '1.0' },
    { label: 'Suporte',  value: 'WhatsApp' }
  ]);

  showToast('Consultoria disponível', 'info');
}
