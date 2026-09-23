# Casillas App

> **Calculadora Técnica de Usinagem** — PWA offline-first para torneiros, fresadores e ferramenteiros.

![Versão](https://img.shields.io/badge/vers%C3%A3o-1.3.0-blue)
![Status](https://img.shields.io/badge/status-ativo-success)
![Licença](https://img.shields.io/badge/licen%C3%A7a-comercial-orange)
![Plataforma](https://img.shields.io/badge/plataforma-Android%20%7C%20iOS-lightgrey)
![Offline](https://img.shields.io/badge/offline-100%25-brightgreen)

---

## 📋 Índice

- [Sobre](#-sobre)
- [Características](#-características)
- [Requisitos](#-requisitos)
- [Demo](#-demo)
- [Screenshots](#-screenshots)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura](#-arquitetura)
- [Como Usar](#-como-usar)
- [Módulos em Detalhe](#-módulos-em-detalhe)
- [Sistema de Licença](#-sistema-de-licença)
- [Segurança](#-segurança)
- [FAQ](#-faq)
- [Roadmap](#-roadmap)
- [Changelog](#-changelog)
- [Desenvolvimento](#️-desenvolvimento)
- [Deploy](#-deploy)
- [Links](#-links)
- [Contribuindo](#-contribuindo)
- [Créditos](#-créditos)
- [Aviso Legal](#-aviso-legal)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 📖 Sobre

O **Casillas App** é uma calculadora técnica de usinagem que funciona **100% offline**, projetada para uso em oficina, com interface pensada para celular.

Oferece **12 módulos** cobrindo os cálculos mais utilizados no dia a dia de torneiros, fresadores e ferramenteiros:

1. **Trigonometria** — triângulo retângulo com diagrama SVG dinâmico
2. **Conicidade** — cálculo de ângulos e relação de conicidade
3. **Polígonos Regulares** — n lados, raio, lado, apótema, área
4. **Furação Circular** — distribuição de furos em círculo com tabela e desenho
5. **Roscas** — métrica, UNC, UNF, Whitworth + medida sobre 3 rolos
6. **Tolerâncias ISO 286** — H7, h6, g6, JS9 e análise de ajuste
7. **Potência de Corte** — torneamento, fresamento, furação, roscamento
8. **Chaveta DIN 6885** — dimensionamento e verificação
9. **Conicidades Padrão** — Morse, Jarno, Brown & Sharpe
10. **Programação CNC** — Fanuc Macro B (G71, G75, G76, G83, G92)
11. **📖 Guia de Programação** — consulta rápida de ciclos (Siemens, Fanuc, Haas)
12. **Consultoria** — contato direto, cursos, materiais e comunidade

---

## ✨ Características

- ✅ **PWA instalável** — funciona como app nativo no Android
- ✅ **100% offline** — após o primeiro carregamento, funciona sem internet
- ✅ **Sem dependências externas** — JavaScript puro (ES Modules)
- ✅ **Sem frameworks** — HTML + CSS + JS nativo
- ✅ **Interface mobile-first** — desenhada para uso em campo
- ✅ **Teclado numérico customizado** — otimizado para oficina
- ✅ **Ícones SVG customizados** — visual consistente e profissional
- ✅ **Persistência local** — IndexedDB guarda preferências e estado
- ✅ **Sistema de licença** — 30 dias de trial + ativação por código
- ✅ **Cálculos puros** — funções separadas da UI (testáveis isoladamente)
- ✅ **Guia de Programação CNC** — consulta rápida de ciclos Siemens, Fanuc e Haas
- ✅ **Landing page** — apresentação do produto em página dedicada
- ✅ **Leve e rápido** — menos de 3 MB no APK
- ✅ **Atualizações gratuitas** — para clientes licenciados

---

## 📱 Requisitos

### Android
- Android 5.0 (Lollipop) ou superior
- Chrome 80+ (ou navegador compatível com PWA)
- 10 MB de espaço livre

### iOS
- iOS 14+ (Safari obrigatório)
- 10 MB de espaço livre

### Desktop (opcional)
- Chrome, Edge, Firefox ou Safari (últimas versões)
- Funciona como PWA instalável

---

## 🎮 Demo

Experimente o app **agora mesmo**, sem instalar:

🔗 **[https://martinsdesiqueiraigor-art.github.io/Casillas_app/](https://martinsdesiqueiraigor-art.github.io/Casillas_app/)**

**Como testar:**
1. Abra o link no Chrome (Android) ou Safari (iOS)
2. Aguarde o carregamento completo
3. Toque em "📲 Instalar App" (Android) ou "Adicionar à Tela de Início" (iOS)
4. O trial de 30 dias é ativado automaticamente

**Apresentação do produto:**
🔗 **[https://martinsdesiqueiraigor-art.github.io/Casillas-landing/](https://martinsdesiqueiraigor-art.github.io/Casillas-landing/)**

---

## 📸 Screenshots

> ⏳ **Em preparação** — screenshots serão adicionados em breve.


---

## 📁 Estrutura do Projeto

text
casillas-app/
├── index.html
├── manifest.json
├── service-worker.js
├── offline.html
├── gerar-codigo.html
├── debug-trial.html              ← Não publicar
├── test-icons.html               ← Não publicar
├── README.md
│
├── dados/
│   └── guia_cnc.json             ← Ciclos CNC (JSON)
│
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   └── modules.css
│
├── js/
│   ├── app.js
│   ├── state.js
│   ├── trial.js
│   ├── utils.js
│   ├── db.js
│   ├── keyboard.js
│   ├── menu.js
│   ├── icons.js                  ← SVGs customizados
│   │
│   ├── data/
│   │   ├── materiais.js
│   │   ├── tolerancias.js
│   │   ├── chavetas.js
│   │   └── conicidades.js
│   │
│   ├── calc/
│   │   ├── trig.js
│   │   ├── coni.js
│   │   ├── poly.js
│   │   ├── furos.js
│   │   ├── rosca.js
│   │   ├── tol.js
│   │   ├── potencia.js
│   │   ├── chaveta.js
│   │   └── gcode.js
│   │
│   └── modules/
│       ├── trig.js
│       ├── coni.js
│       ├── poly.js
│       ├── furos.js
│       ├── rosca.js
│       ├── tol.js
│       ├── potencia.js
│       ├── chaveta.js
│       ├── conicpad.js
│       ├── prog.js
│       ├── guia.js               ← Guia de Programação CNC
│       └── consult.js
│
├── manuais/                      ← PDFs (em preparação)
│   └── README.md
│
└── icons/
    ├── icon-192.png
    └── icon-512.png

---

## 🏗️ Arquitetura

O projeto segue o padrão de **camadas**, com separação clara de responsabilidades:

text
┌─────────────────────────────────────┐
│  UI (js/modules/)                   │  ← Renderizam, escutam eventos
│  Só DOM, sem lógica de cálculo      │
├─────────────────────────────────────┤
│  Cálculos (js/calc/)                │  ← Funções PURAS
│  Sem DOM, testáveis isoladamente    │
├─────────────────────────────────────┤
│  Dados (js/data/, dados/)           │  ← Constantes / tabelas
│  Tabelas ISO, DIN, JSON de ciclos   │
├─────────────────────────────────────┤
│  Núcleo (app, state, trial, db)     │  ← Estado, trial, DB, utils
│  Persistência e regras de negócio   │
└─────────────────────────────────────┘

### Vantagens

- ✅ **Cálculos testáveis** — funções puras, sem dependência de DOM
- ✅ **UI reutilizável** — módulos independentes
- ✅ **Dados fáceis de atualizar** — separados do código
- ✅ **Sem dependências externas** — JavaScript puro (ES Modules)
- ✅ **Manutenível** — cada arquivo tem uma responsabilidade única

### Fluxo de um cálculo

text
1. Usuário digita no input (js/modules/*.js)
2. Módulo chama função pura (js/calc/*.js)
3. Função retorna resultado
4. Módulo renderiza o resultado no DOM
5. Estado é persistido (js/state.js + js/db.js)


---

## 🚀 Como Usar

### No Termux (desenvolvimento)

text
cd /storage/emulated/0/Acode/casillas-app
python -m http.server 9090

Depois abra no navegador do celular: http://localhost:9090

### No navegador (Android)

1. Abra o Chrome e acesse a URL do app
2. Aguarde o carregamento completo (o Service Worker será registrado)
3. Toque no botão "📲 Instalar App" no canto inferior esquerdo
4. Confirme a instalação

### No iOS (iPhone/iPad)

1. Abra o **Safari** (o Chrome no iOS **não** permite adicionar à tela inicial)
2. Acesse o link do app
3. Toque no botão **Compartilhar** (📤)
4. Role e toque em **"Adicionar à Tela de Início"**
5. Confirme o nome "Casillas" e toque em **"Adicionar"**

### Uso offline

Após a primeira visita, o app armazena todos os arquivos em cache. Você pode ativar o modo avião e continuar usando normalmente.

---

## 🧮 Módulos em Detalhe

### 1. Trigonometria (trig)
Triângulo retângulo com diagrama SVG dinâmico.

### 2. Conicidade (coni)
Modo 1: D, d, L → α. Modo 2: d, α, L → D. Inclui relação 1:x.

### 3. Polígonos Regulares (poly)
Entrada: n lados e raio R. Saídas: lado, apótema, área, perímetro. Com desenho SVG.

### 4. Furação Circular (furos)
Entrada: diâmetro, número de furos, ângulo inicial. Saída: tabela com coordenadas X,Y. Ciclo G83 modal.

### 5. Roscas (rosca)
Métrica, UNC, UNF, Whitworth. Cálculo de diâmetro menor, altura do filete, medida sobre 3 rolos e faixa ideal do rolo.

### 6. Tolerâncias ISO 286 (tol)
Consulta de campos H7, h6, g6, JS9. Análise de ajuste (folga / interferência).

### 7. Potência de Corte (potencia)
Torneamento, fresamento, furação, roscamento. Saída: RPM, avanço, potência, força.

### 8. Chaveta DIN 6885 (chaveta)
Entrada: diâmetro do eixo. Saída: dimensões b × h e profundidades.

### 9. Conicidades Padrão (conicpad)
Consulta de cones Morse (0 a 7), Jarno e Brown & Sharpe.

### 10. Programação CNC (prog)
Fanuc Macro B: G71, G75, G76, G83, G92, Macro B. Gera código pronto com comentários.

### 11. 📖 Guia de Programação (guia)
Consulta rápida de ciclos CNC (Siemens, Fanuc, Haas). Filtros por texto, máquina e comando. Inclui sintaxe, parâmetros e exemplo prático. Botão "Copiar código" em cada card.

### 12. Consultoria (consult)
- Contato direto (WhatsApp, Grupo, Instagram, YouTube)
- 6 serviços de usinagem
- 3 cursos disponíveis (CAM, SolidWorks, Parametrizada)
- Materiais de estudo (PDFs)
- Ativação e compra de licença

---

## 🔐 Sistema de Licença

O Casillas App usa trial de 30 dias + ativação por código.

### Como funciona o trial

1. Na primeira execução, registra installDate no IndexedDB
2. A cada boot, atualiza lastSeenDate
3. Se o relógio for retrocedido, o app bloqueia
4. Após 30 dias, exige ativação

### Banner de trial

O banner muda de cor conforme a urgência:

- 🟢 **Verde** (> 7 dias): "🎁 Versão gratuita — Teste: X dias restantes"
- 🟡 **Amarelo** (4 a 7 dias): "⏰ Teste: X dias restantes"
- 🔴 **Vermelho** (1 a 3 dias): "⚠️ Últimos X dias! Ative agora."

### Módulos liberados na versão gratuita

Após o trial expirar, estes módulos continuam acessíveis:
- 📐 Trigonometria
- 🌀 Roscas
- 📊 Tolerâncias ISO
- 💬 Consultoria
- 🖥️ Programação CNC (apenas sub-aba Macro B)

### Fórmula do código de ativação

text
SALT = "CasillasApp_SALT_2026_!@#"
combinacao = deviceId + SALT
hash = SHA-256(combinacao) em hex maiúsculo
codigo = primeiros 16 caracteres formatados XXXX-XXXX-XXXX-XXXX

### Limite de aparelhos

Cada código funciona em **até 3 aparelhos** diferentes. Se você trocar de celular, é só ativar com o mesmo código.

---

## 🛡️ Segurança

### Medidas implementadas

- ✅ **HTTPS obrigatório** — GitHub Pages fornece SSL automático
- ✅ **Service Worker** — cache local, sem dependência de servidores externos
- ✅ **IndexedDB** — dados persistem no aparelho do usuário
- ✅ **SHA-256** — hash dos códigos de ativação
- ✅ **Sem dados pessoais** — o app não coleta informações do usuário
- ✅ **Sem rastreamento** — não usa analytics ou cookies de terceiros

### Anti-pirataria

- 🔒 **Códigos únicos** — cada código é gerado individualmente
- 🔒 **Limite de 3 aparelhos** — evita compartilhamento excessivo
- 🔒 **Lista negra** — códigos revogados são bloqueados
- 🔒 **Detecção de clock tampering** — se o relógio for retrocedido, o app bloqueia
- 🔒 **Dupla persistência** — `installDate` salvo em IndexedDB + localStorage
- 🔒 **Fingerprint do dispositivo** — detecta troca de aparelho
- 🔒 **Hash SHA-256** — valida integridade dos dados
- 🔒 **Sistema de tentativas** — primeira manipulação avisa, segunda bloqueia

### Recomendações

- ⚠️ **Não compartilhe seu código de ativação**
- ⚠️ **Guarde o keystore do APK** em local seguro
- ⚠️ **Não limpe os dados do site** sem backup (perde a licença)


---

## ❓ FAQ

### O app funciona no iPhone?
Sim! O Casillas é um PWA. No iPhone, abra o **Safari**, toque em **Compartilhar** (📤) → **"Adicionar à Tela de Início"**.

### Preciso de internet para usar?
Não! O app funciona **100% offline** após a primeira instalação.

### Como ativo o app?
Após a compra, você recebe um código no formato **CASILLAS-XXXX-XXXX**. Digite na tela de ativação.

### Posso usar em vários celulares?
Sim! Cada código funciona em **até 3 aparelhos** diferentes.

### Tem garantia?
Sim! **7 dias de garantia total**. Se não gostar, devolvemos o dinheiro.

### O que acontece após 30 dias?
Apenas os **módulos básicos** continuam acessíveis (Trigonometria, Roscas, Tolerâncias, Consultoria e Macro B). Os demais são bloqueados até a ativação.

### Como faço backup dos meus dados?
Os dados ficam no seu celular (IndexedDB). Recomendamos **não limpar os dados do site** para preservar o trial.

### O app é gratuito?
O trial de **30 dias** é gratuito. Após esse período, a licença vitalícia custa **R$ 49,90** (pagamento único).

---

## 🎯 Roadmap

### v1.4.0 (em preparação)
- 🔄 Calculadora de conversão (mm ↔ pol, RPM ↔ Vc)
- 🎨 Splash screen customizada
- 📢 Changelog/Novidades no app
- 🔍 Zoom / auto-fit

### v1.5.0 (backlog)
- 💡 Histórico de cálculos
- ⭐ Favoritos
- 🌙 Modo claro/escuro
- 💾 Backup/restore dos dados

### v2.0.0 (ideias futuras)
- 🔔 Notificações push (trial acabando)
- 📊 Analytics (sem dados pessoais)
- 🎓 Vídeos-aula embutidos
- 🧮 Novos módulos (engrenagens, solda, tubos)

---

## 📊 Changelog

### v1.3.0 (23/09/2026)
- ✅ Módulo **Guia de Programação CNC**
- ✅ 4 ciclos iniciais: Siemens CYCLE97/CYCLE83, Fanuc G76/G83
- ✅ Filtros (texto + máquina + comando) + busca com debounce
- ✅ Botão "Copiar código" em cada card
- ✅ Ícones SVG customizados (11 módulos + 4 categorias)
- ✅ Landing page publicada
- ✅ Consultoria expandida (links atualizados, comunidade unificada)
- ✅ Teclado nativo no campo de busca
- ✅ **Sistema anti-burla** (dupla persistência + fingerprint + hash SHA-256)
- ✅ **Sistema de tentativas** (1 exceção, depois bloqueia)

### v1.2.0 (20/09/2026)
- ✅ Ícones SVG customizados
- ✅ Menu com agrupamento em 4 categorias
- ✅ Consultoria expandida
- ✅ Botão "Compartilhar app" → landing page

### v1.1.0 (19/09/2026)
- ✅ Trial banner com contagem regressiva
- ✅ Menu compacto
- ✅ Versão gratuita limitada
- ✅ Função forcarAtualizacao()

### v1.0.0 (19/09/2026)
- ✅ 11 módulos de cálculo
- ✅ Sistema de trial + ativação
- ✅ Teclado customizado
- ✅ Publicado no GitHub Pages
- ✅ APK gerado

---

## 🛡️ Proteções Anti-Burla

O sistema de trial possui **3 camadas de proteção** para evitar manipulação:

### 1. Dupla persistência

O `installDate` é gravado em **2 lugares**:

| Local | Chave | Persiste se limpar IndexedDB? |
|-------|-------|-------------------------------|
| **IndexedDB** | `trial-install-date` | ❌ Não |
| **localStorage** | `casillas-install-backup` | ✅ Sim |

A cada boot, o app compara os dois valores. Se **divergirem** → manipulação detectada.

### 2. Fingerprint do dispositivo

Um hash único é gerado a partir de:

- User Agent
- Resolução de tela
- Idioma
- Timezone
- Plataforma
- Número de núcleos de CPU

Salvo no `localStorage` (`casillas-fingerprint`). Se mudar → troca de aparelho detectada.

### 3. Hash SHA-256

O `installDate` é "assinado" com SHA-256 junto do `deviceId`:

text
hash = SHA-256(installDate + ':' + deviceId + ':CasillasApp_SALT_2026_!@#')

Salvo no `localStorage` (`casillas-install-hash`). Se o hash não bater → manipulação detectada.

### Política de manipulação

| Tentativa | Ação |
|-----------|------|
| **1ª** | ⚠️ Avisa + restaura do backup (localStorage) |
| **2ª** | ❌ Bloqueia (mostra tela de ativação) |
| **Após ativação** | ✅ Zera as tentativas |

**Chave de controle:** `casillas-tentativas-manipulacao` (localStorage).

### O que NÃO é protegido

| Ação | Impacto |
|------|---------|
| **Limpar TODO o localStorage** | ❌ Perde a licença e o backup |
| **Reinstalar o APK** | ❌ Perde todos os dados |
| **Usar outro celular** | ❌ Novo trial de 30 dias |

**Para proteção total, seria necessário validação online (Firebase).**

### Como testar

Use o `debug-trial.html` (não publicar):

1. **Resetar tudo** → limpa IndexedDB (localStorage preservado)
2. Volte ao app → deve avisar e restaurar (1ª tentativa)
3. **Resetar tudo** de novo → 2ª manipulação
4. Volte ao app → deve **bloquear**

---

## 🛠️ Desenvolvimento

### Convenções de código

- **ES Modules** (import / export)
- **const / let** — nunca var
- **Nunca innerHTML** com dados de usuário — usar createElementSafe()
- **SVG dinâmico** com createElementNS()
- Funções em **js/calc/** são **puras** (sem DOM)
- Funções em **js/modules/** apenas **renderizam**
- **Nunca prompt() ou alert()** — usar showToast()
- **Sem dependências externas**

### Adicionar um novo módulo

1. Crie js/calc/novo.js com as funções puras
2. Crie js/modules/novo.js exportando render(container)
3. Adicione o item no index.html (menu lateral)
4. Registre o loader em js/app.js (MODULE_LOADERS + MODULE_TITLES)
5. Adicione os estilos em css/modules.css
6. Inclua no service-worker.js (CACHE_ASSETS)
7. Adicione o ícone SVG em js/icons.js

### Adicionar um novo ciclo CNC

1. Abra dados/guia_cnc.json
2. Adicione um novo objeto no array "itens":
   text
   {
     "id": "fanuc-g71",
     "comando": "Fanuc",
     "maquina": "Torno",
     "codigo": "G71",
     "titulo": "Ciclo de Desbaste Longitudinal",
     "categoria": "Desbaste",
     "tags": ["desbaste", "torneamento", "fanuc"],
     "sintaxe": "G71 U(d) R(e)",
     "parametros": [...],
     "exemplo": "G71 U2.0 R1.0"
   }
   
3. Salve e faça commit + push (não precisa mexer no código)

---

## 📦 Deploy

### Servir localmente

text
cd /storage/emulated/0/Acode/casillas-app
python -m http.server 9090

### Publicar

Como é PWA estático, hospede em **GitHub Pages**, **Netlify**, **Vercel** ou qualquer servidor HTTP.

**Importante:** o service-worker.js só funciona em **HTTPS** ou **localhost**.

### Gerar APK

1. Acesse https://www.pwabuilder.com
2. Cole a URL do app: https://martinsdesiqueiraigor-art.github.io/Casillas_app/
3. "Package for Stores" → Android
4. Preencha o formulário com o keystore existente
5. Download do APK

### Landing page

https://martinsdesiqueiraigor-art.github.io/Casillas-landing/

---

## 🔗 Links

| Canal | Link |
|-------|------|
| **App (GitHub Pages)** | https://martinsdesiqueiraigor-art.github.io/Casillas_app/ |
| **Landing page** | https://martinsdesiqueiraigor-art.github.io/Casillas-landing/ |
| **Repositório** | https://github.com/martinsdesiqueiraigor-art/Casillas_app |
| **WhatsApp** | https://wa.me/5519996816755 |
| **Grupo WhatsApp** | https://chat.whatsapp.com/Idw4zuVdlOW1oZf3DZLZ75 |
| **Instagram** | https://instagram.com/casillas_usinagem.br |
| **YouTube** | https://youtube.com/@Casillasusinagembr |

---

## 🤝 Contribuindo

Encontrou um bug? Tem uma sugestão?

1. Abra uma **issue** em [GitHub Issues](https://github.com/martinsdesiqueiraigor-art/Casillas_app/issues)
2. Ou mande um **WhatsApp**: +55 19 99681-6755
3. Ou entre no **grupo**: [Casillas Usinagem BR](https://chat.whatsapp.com/Idw4zuVdlOW1oZf3DZLZ75)

**Áreas que aceitam contribuição:**
- Novos ciclos CNC (para o guia)
- Novos materiais (tabelas)
- Correções de bugs
- Traduções
- Sugestões de novos módulos

---

## 🙏 Créditos

- **Ícones SVG** — criados sob medida para o Casillas App
- **Tabelas ISO/DIN** — baseadas em normas oficiais
- **Ciclos CNC** — baseados em manuais Siemens, Fanuc e Haas
- **Comunidade de software livre** — pelos conceitos de PWA e offline-first

---

## ⚖️ Aviso Legal

- Este software é **proprietário**. Todos os direitos reservados.
- O uso é permitido apenas mediante **licença adquirida**.
- O **trial de 30 dias** é oferecido para avaliação.
- Os **cálculos** são fornecidos como referência. Sempre **verifique** antes de aplicar na produção.
- O **autor não se responsabiliza** por danos causados pelo uso incorreto do app.

---

## 📄 Licença

**Software proprietário** — todos os direitos reservados.

Uso permitido apenas mediante licença adquirida.
Trial de 30 dias para avaliação.

**Contato para licença:** WhatsApp +55 19 99681-6755

---

## 👨‍🔧 Autor

Desenvolvido para a comunidade de usinagem.

- **WhatsApp**: +55 19 99681-6755
- **Instagram**: [@casillas_usinagem.br](https://instagram.com/casillas_usinagem.br)
- **YouTube**: [@Casillasusinagembr](https://youtube.com/@Casillasusinagembr)
- **GitHub**: [martinsdesiqueiraigor-art](https://github.com/martinsdesiqueiraigor-art)

---

**Casillas App** — Feito com 🔧 para quem faz a indústria acontecer.
