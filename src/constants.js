// Chaves do localStorage centralizadas em um lugar só.
// Se um dia precisar renomear, muda aqui e não no código inteiro.
export const STORAGE_KEYS = {
  quests: 'quests-lincoln',
  level: 'level-lincoln',
  xp: 'xp-lincoln',
  concluidas: 'stats-concluidas-lincoln',
  criadas: 'stats-criadas-lincoln',
  streak: 'streak-lincoln',
  ultimoDia: 'ultimo-dia-lincoln',
  somMudo: 'som-mudo-lincoln',
  conquistas: 'conquistas-lincoln',
  epicas: 'stats-epicas-lincoln',
  tema: 'tema-lincoln',
};

// O primeiro é o padrão; os estilos ficam em App.css ([data-tema='...'])
export const TEMAS = [
  { id: 'padrao', emoji: '🕯️', nome: 'Taverna' },
  { id: 'floresta', emoji: '🌲', nome: 'Floresta' },
  { id: 'masmorra', emoji: '🏰', nome: 'Masmorra' },
  { id: 'deserto', emoji: '🏜️', nome: 'Deserto' },
];

export const temaValido = (tema) => TEMAS.some((t) => t.id === tema);

export const DIFICULDADES = {
  comum: { rotulo: 'Comum', xp: 10 },
  rara: { rotulo: 'Rara', xp: 25 },
  epica: { rotulo: 'Épica', xp: 50 },
};

// Ordenados do maior requisito para o menor.
export const TITULOS = [
  { nivelMinimo: 35, titulo: 'Mestre Supremo' },
  { nivelMinimo: 20, titulo: 'Lenda Viva' },
  { nivelMinimo: 10, titulo: 'Mercenário de Elite' },
  { nivelMinimo: 5, titulo: 'Caçador de Recompensas' },
  { nivelMinimo: 1, titulo: 'Novato da Guilda' },
];

export const obterTitulo = (nivelAtual) =>
  TITULOS.find(({ nivelMinimo }) => nivelAtual >= nivelMinimo).titulo;

/**
 * Conquistas desbloqueáveis. `condicao` recebe os stats do jogador:
 * { concluidas, epicas, level, streak }
 * Conquista desbloqueada nunca é revogada.
 */
export const CONQUISTAS = [
  {
    id: 'primeira-quest',
    emoji: '🗡️',
    nome: 'Primeira Quest',
    descricao: 'Conclua sua primeira quest',
    condicao: (s) => s.concluidas >= 1,
  },
  {
    id: 'dez-quests',
    emoji: '⚔️',
    nome: 'Dez Missões',
    descricao: 'Conclua 10 quests',
    condicao: (s) => s.concluidas >= 10,
  },
  {
    id: 'veterano',
    emoji: '👑',
    nome: 'Veterano da Guilda',
    descricao: 'Conclua 50 quests',
    condicao: (s) => s.concluidas >= 50,
  },
  {
    id: 'cacador-epicas',
    emoji: '💎',
    nome: 'Caçador de Épicas',
    descricao: 'Conclua 10 quests épicas',
    condicao: (s) => s.epicas >= 10,
  },
  {
    id: 'em-chamas',
    emoji: '🔥',
    nome: 'Em Chamas',
    descricao: 'Mantenha uma sequência de 7 dias',
    condicao: (s) => s.streak >= 7,
  },
  {
    id: 'nivel-10',
    emoji: '⚡',
    nome: 'Poder Crescente',
    descricao: 'Alcance o nível 10',
    condicao: (s) => s.level >= 10,
  },
  {
    id: 'heroi-lendario',
    emoji: '🌟',
    nome: 'Herói Lendário',
    descricao: 'Alcance o nível 20',
    condicao: (s) => s.level >= 20,
  },
];
