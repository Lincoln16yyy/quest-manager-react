# ⚔️ Quest Manager

Um gerenciador de tarefas gamificado: transforme as tarefas do seu dia a dia em **quests de RPG**, ganhe XP, suba de nível e desbloqueie títulos na sua guilda.

## ✨ Funcionalidades

- **Quests com raridade** — Comum (10 XP), Rara (25 XP) e Épica (50 XP), cada uma com sua cor
- **Sistema de níveis** — barra de XP animada, confete, brilho e fanfarra ao subir de nível 🔊
- **Edição inline** — duplo clique (ou o botão ✏️) para renomear uma quest; Enter salva, Esc cancela
- **Sequência diária (streak)** 🔥 — complete ao menos uma quest por dia para manter o fogo aceso
- **Conquistas** 🏅 — 7 badges desbloqueáveis com notificação e confete dourado
- **Backup do progresso** 📦 — exporte e importe tudo em um arquivo JSON
- **Temas de cores** 🎨 — Taverna, Floresta, Masmorra e Deserto, com transição suave
- **Histórico protegido** 🛡️ — apagar quests limpa a lista, mas nunca reduz suas estatísticas de carreira (apenas devolve o XP de quests concluídas)
- **Anti-farm** ⚖️ — Poder e conquistas contam apenas quests concluídas que ainda existem na lista: concluir e apagar em loop não gera vantagem
- **Títulos de rank** — de *Novato da Guilda* até *Mestre Supremo*, conforme seu nível
- **Painel de atributos** — Poder total, quests concluídas, taxa de vitória e sequência
- **Filtros** — visualize Todas, apenas Ativas ou Concluídas
- **Progresso salvo** — tudo fica no `localStorage` do navegador, nada se perde ao fechar
- **Responsivo** — funciona bem no celular e no desktop

## 🚀 Tecnologias

- [React](https://react.dev) 19 + [Vite](https://vite.dev)
- [canvas-confetti](https://github.com/catdad/canvas-confetti) para as comemorações
- CSS puro, sem frameworks

## ▶️ Como rodar

```bash
# Clone o repositório
git clone https://github.com/Lincoln16yyy/quest-manager-react.git
cd quest-manager-react

# Instale as dependências e inicie o servidor de desenvolvimento
npm install
npm run dev
```

Depois acesse [http://localhost:5173](http://localhost:5173) no navegador.

## 📜 Scripts disponíveis

| Comando           | O que faz                              |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento   |
| `npm run build`   | Gera a versão de produção em `dist/`   |
| `npm run preview` | Pré-visualiza a build de produção      |
| `npm run lint`    | Verifica o código com o ESLint         |

## 🗂️ Estrutura do projeto

```
src/
├── components/        # Componentes da interface
│   ├── Hud.jsx        #   Nível, título e barra de XP
│   ├── PainelStatus.jsx  # Cards de estatísticas
│   ├── FormQuest.jsx  #   Formulário de nova quest
│   ├── AbasFiltro.jsx #   Abas de filtro
│   ├── Tarefa.jsx     #   Item da lista de quests
│   ├── PainelConquistas.jsx # Grade de conquistas
│   ├── Toast.jsx        #   Notificação flutuante genérica
│   ├── BarraBackup.jsx  #   Exportar/importar progresso
│   └── SeletorTema.jsx  #   Troca de tema de cores
├── hooks/
│   └── useLocalStorage.js  # Estado sincronizado com localStorage
├── utils/
│   ├── xp.js          # Regras de progressão (level up/down)
│   ├── datas.js       # Sequência diária (streak)
│   ├── conquistas.js  # Verificação de conquistas
│   ├── backup.js      # Montagem e validação de backups
│   └── sons.js        # Efeitos sonoros (Web Audio API)
├── constants.js       # Raridades, títulos, conquistas e chaves
├── App.jsx            # Composição e regras do jogo
└── App.css            # Estilos
```

## 🗺️ Ideias futuras

- [x] Editar o texto de uma quest
- [x] Streak (sequência de dias completando quests)
- [x] Efeitos sonoros de level up
- [x] Conquistas/badges desbloqueáveis
- [x] Exportar e importar o progresso
- [x] Temas de cores (floresta, masmorra, deserto...)

---

Feito com ☕ por [Lincoln](https://github.com/Lincoln16yyy)
