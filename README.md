# Casillas App

> **Calculadora Técnica de Usinagem** — PWA offline-first para torneiros, fresadores e ferramenteiros.

---

## 📖 Sobre

O **Casillas App** é uma calculadora técnica de usinagem que funciona **100% offline**, projetada para uso em oficina, com interface pensada para celular.

Oferece **11 módulos** cobrindo os cálculos mais utilizados no dia a dia de torneiros, fresadores e ferramenteiros:

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
11. **Consultoria** — contato direto via WhatsApp

---

## ✨ Características

- ✅ **PWA instalável** — funciona como app nativo no Android
- ✅ **100% offline** — após o primeiro carregamento, funciona sem internet
- ✅ **Sem dependências externas** — JavaScript puro (ES Modules)
- ✅ **Sem frameworks** — HTML + CSS + JS nativo
- ✅ **Interface mobile-first** — desenhada para uso em campo
- ✅ **Teclado numérico customizado** — otimizado para oficina
- ✅ **Persistência local** — IndexedDB guarda preferências e estado
- ✅ **Sistema de licença** — 30 dias de trial + ativação por código
- ✅ **Cálculos puros** — funções separadas da UI (testáveis isoladamente)

---

## 📁 Estrutura do Projeto

casillas-app/
├── index.html
├── manifest.json
├── service-worker.js
├── offline.html
├── gerar-codigo.html
├── README.md
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   └── modules.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── trial.js
│   ├── utils.js
│   ├── db.js
│   ├── keyboard.js
│   ├── menu.js
│   ├── data/
│   │   ├── materiais.js
│   │   ├── tolerancias.js
│   │   ├── chavetas.js
│   │   └── conicidades.js
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
│       └── consult.js
└── icons/
    ├── icon-192.png
    └── icon-512.png

---

## 🚀 Como Usar



### Uso offline

Após a primeira visita, o app armazena todos os arquivos em cache. Você pode ativar o modo avião e continuar usando normalmente.

---

## 🧮 Módulos em Detalhe

### 1. Trigonometria (trig)
Triângulo retângulo com diagrama SVG dinâmico.

### 2. Conicidade (coni)
Modo 1: D, d, L -> α. Modo 2: d, α, L -> D. Inclui relação 1:x.

### 3. Polígonos Regulares (poly)
Entrada: n lados e raio R. Saídas: lado, apótema, área, perímetro. Com desenho SVG.

### 4. Furação Circular (furos)
Entrada: diâmetro, número de furos, ângulo inicial. Saída: tabela com coordenadas X,Y.

### 5. Roscas (rosca)
Métrica, UNC, UNF, Whitworth. Cálculo de diâmetro menor, altura do filete e medida sobre 3 rolos.

### 6. Tolerâncias ISO 286 (tol)
Consulta de campos H7, h6, g6, JS9. Análise de ajuste (folga / interferência).

### 7. Potência de Corte (potencia)
Torneamento, fresamento, furação, roscamento. Saída: RPM, avanço, potência, força.

### 8. Chaveta DIN 6885 (chaveta)
Entrada: diâmetro do eixo. Saída: dimensões b × h e profundidades.

### 9. Conicidades Padrão (conicpad)
Consulta de cones Morse (0 a 7), Jarno e Brown & Sharpe.

### 10. Programação CNC (prog)
Fanuc Macro B: G71, G75, G76, G83, G92. Gera código pronto.

### 11. Consultoria (consult)
Cards com contato direto via WhatsApp: +55 19 99681-6755

---

## 🔐 Sistema de Licença

O Casillas App usa trial de 30 dias + ativação por código.

### Como funciona o trial

1. Na primeira execução, registra installDate no IndexedDB
2. A cada boot, atualiza lastSeenDate
3. Se o relógio for retrocedido, o app bloqueia
4. Após 30 dias, exige ativação


### Fórmula

SALT = "CasillasApp_SALT_2026_!@#"
combinacao = deviceId + SALT
hash = SHA-256(combinacao) em hex maiúsculo
codigo = primeiros 16 caracteres formatados XXXX-XXXX-XXXX-XXXX

### Suporte

WhatsApp: +55 19 99681-6755

---

## 🎨 Tema Visual

- bg-app: #0d1117
- bg-card: #161b22
- bg-input: #21262d
- bg-elevated: #1c2128
- text-primary: #e6edf3
- text-secondary: #8b949e
- text-muted: #6e7681
- border-color: #30363d
- accent-primary: #f0883e (laranja usinagem)
- accent-secondary: #58a6ff (azul técnico)
- success: #3fb950
- warning: #d29922
- danger: #f85149
- info: #58a6ff

---

## 🛠️ Desenvolvimento

### Convenções de código

- ES Modules (import / export)
- const / let — nunca var
- Nunca innerHTML com dados de usuário — usar createElementSafe()
- SVG dinâmico com createElementNS()
- Funções em js/calc/ são puras (sem DOM)
- Funções em js/modules/ apenas renderizam
- Nunca prompt() ou alert() — usar showToast()
- Sem dependências externas

### Adicionar um novo módulo

1. Crie js/calc/novo.js com as funções puras
2. Crie js/modules/novo.js exportando render(container)
3. Adicione o item no index.html
4. Registre o loader em js/app.js
5. Adicione os estilos em css/modules.css
6. Inclua no service-worker.js

---

## 📦 Build e Deploy

### Servir localmente

cd /storage/emulated/0/Acode/casillas-app
python -m http.server 8080

### Publicar

Como é PWA estático, hospede em GitHub Pages, Netlify, Vercel ou qualquer servidor HTTP.

Importante: o service-worker.js só funciona em HTTPS ou localhost.

---

## ✅ Checklist Pós-Instalação

- [ ] Todos os 42 arquivos foram criados
- [ ] icons/icon-192.png e icons/icon-512.png adicionados manualmente
- [ ] Servidor rodando em http://localhost:8080
- [ ] Service Worker registrado (DevTools -> Application)
- [ ] Botão Instalar App aparecendo
- [ ] Trial de 30 dias ativo
- [ ] WhatsApp de suporte funcionando

---

## 📄 Licença

Software proprietário — todos os direitos reservados.

Uso permitido apenas mediante licença adquirida. Trial de 30 dias para avaliação.

Contato para licença: WhatsApp +55 19 99681-6755

---

## 👨‍🔧 Autor

Desenvolvido para a comunidade de usinagem.

Contato: +55 19 99681-6755

---

## 🙏 Agradecimentos

- Aos torneiros, fresadores e ferramenteiros que contribuíram com sugestões
- À comunidade de software livre pelos conceitos de PWA e offline-first

---

Casillas App — Feito com 🔧 para quem faz a indústria acontecer.
