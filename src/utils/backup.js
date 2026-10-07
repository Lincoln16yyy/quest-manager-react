import { DIFICULDADES, CONQUISTAS } from '../constants.js';

// Backup do progresso: funções puras, sem DOM — fáceis de testar.

/** Empacota o estado atual com metadados. */
export function montarBackup(estado) {
  return {
    app: 'quest-manager-react',
    versao: 1,
    exportadoEm: new Date().toISOString(),
    estado,
  };
}

const inteiroNaoNegativo = (valor, padrao = 0) =>
  Number.isInteger(valor) && valor >= 0 ? valor : padrao;

/**
 * Valida um backup importado. Filosofia: rigoroso na ESTRUTURA
 * (sem objeto/estado/quests → rejeita), flexível nos VALORES
 * (normaliza e corrige em vez de quebrar).
 *
 * @returns {{ ok: true, estado: object } | { ok: false, erro: string }}
 */
export function validarBackup(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    return { ok: false, erro: 'O arquivo não contém um backup válido.' };
  }
  if (!dados.estado || typeof dados.estado !== 'object' || Array.isArray(dados.estado)) {
    return { ok: false, erro: 'Backup sem a seção "estado".' };
  }
  if (!Array.isArray(dados.estado.quests)) {
    return { ok: false, erro: 'Backup sem a lista de quests.' };
  }

  const e = dados.estado;
  const dificuldadesValidas = Object.keys(DIFICULDADES);
  const idsConhecidos = CONQUISTAS.map((c) => c.id);

  // Quests sem texto válido são descartadas; campos faltantes são normalizados
  const quests = e.quests
    .filter((q) => q && typeof q.texto === 'string' && q.texto.trim() !== '')
    .map((q) => ({
      id: typeof q.id === 'string' ? q.id : crypto.randomUUID(),
      texto: q.texto.trim().slice(0, 120),
      concluida: Boolean(q.concluida),
      dificuldade: dificuldadesValidas.includes(q.dificuldade) ? q.dificuldade : 'comum',
    }));

  return {
    ok: true,
    estado: {
      quests,
      level: Number.isInteger(e.level) && e.level >= 1 ? e.level : 1,
      xp: inteiroNaoNegativo(e.xp),
      concluidas: inteiroNaoNegativo(e.concluidas),
      criadas: inteiroNaoNegativo(e.criadas, quests.length),
      epicas: inteiroNaoNegativo(e.epicas),
      streak: inteiroNaoNegativo(e.streak),
      ultimoDia: typeof e.ultimoDia === 'string' ? e.ultimoDia : null,
      somMudo: Boolean(e.somMudo),
      conquistas: Array.isArray(e.conquistas)
        ? e.conquistas.filter((id) => idsConhecidos.includes(id))
        : [],
    },
  };
}
