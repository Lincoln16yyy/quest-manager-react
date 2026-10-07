import { CONQUISTAS, temaValido } from '../constants.js';
import {
  inteiroNaoNegativo,
  nivelValido,
  booleano,
  textoOuNull,
  listaIds,
  sanitizarQuests,
} from './validacao.js';

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
  const idsConhecidos = CONQUISTAS.map((c) => c.id);
  const quests = sanitizarQuests(e.quests);
  const level = nivelValido(e.level);

  return {
    ok: true,
    estado: {
      quests,
      level,
      xp: inteiroNaoNegativo(e.xp),
      concluidas: inteiroNaoNegativo(e.concluidas),
      criadas: inteiroNaoNegativo(e.criadas, quests.length),
      streak: inteiroNaoNegativo(e.streak),
      ultimoDia: textoOuNull(e.ultimoDia),
      somMudo: booleano(e.somMudo),
      conquistas: listaIds(e.conquistas).filter((id) => idsConhecidos.includes(id)),
      tema: temaValido(e.tema) ? e.tema : 'padrao',
      // Recorde de nível: backups antigos sem o campo assumem o nível atual
      maiorNivel: Math.max(nivelValido(e.maiorNivel ?? e.level), level),
    },
  };
}
