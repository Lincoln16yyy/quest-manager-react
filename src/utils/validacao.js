import { DIFICULDADES } from '../constants.js';
import { gerarId } from './id.js';
import { NIVEL_MAXIMO } from './xp.js';

// Validadores/sanitizadores para dados vindos de fora (localStorage, backup).
// Filosofia: corrigir o que dá, descartar o que não dá, nunca quebrar o app.
// isSafeInteger (e não isInteger) rejeita absurdos como 1e300.

export const inteiroNaoNegativo = (valor, padrao = 0) =>
  Number.isSafeInteger(valor) && valor >= 0 ? valor : padrao;

export const nivelValido = (valor) =>
  Number.isSafeInteger(valor) && valor >= 1 ? Math.min(valor, NIVEL_MAXIMO) : 1;

export const booleano = (valor, padrao = false) =>
  typeof valor === 'boolean' ? valor : padrao;

export const textoOuNull = (valor) => (typeof valor === 'string' ? valor : null);

export const listaIds = (valor) =>
  Array.isArray(valor) ? valor.filter((id) => typeof id === 'string') : [];

/** Quests sem texto válido são descartadas; campos faltantes são normalizados. */
export function sanitizarQuests(lista) {
  if (!Array.isArray(lista)) return [];
  return lista
    .filter((q) => q && typeof q.texto === 'string' && q.texto.trim() !== '')
    .map((q) => ({
      id: typeof q.id === 'string' ? q.id : gerarId(),
      texto: q.texto.trim().slice(0, 120),
      concluida: Boolean(q.concluida),
      dificuldade: DIFICULDADES[q.dificuldade] ? q.dificuldade : 'comum',
      ...(typeof q.concluidaEm === 'string' ? { concluidaEm: q.concluidaEm } : {}),
      // XP total concedido ao concluir (base + bônus de streak): só faz
      // sentido em quest concluída e é o que desmarcar/apagar devolve
      ...(q.concluida && Number.isSafeInteger(q.xpGanho) && q.xpGanho > 0
        ? { xpGanho: q.xpGanho }
        : {}),
    }));
}
