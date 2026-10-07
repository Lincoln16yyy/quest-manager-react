import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Hud from './components/Hud';
import PainelStatus from './components/PainelStatus';
import FormQuest from './components/FormQuest';
import AbasFiltro from './components/AbasFiltro';
import Tarefa from './components/Tarefa';
import PainelConquistas from './components/PainelConquistas';
import Toast from './components/Toast';
import BarraBackup from './components/BarraBackup';
import SeletorTema from './components/SeletorTema';
import useLocalStorage from './hooks/useLocalStorage';
import { STORAGE_KEYS, DIFICULDADES, CONQUISTAS, temaValido } from './constants';
import { aplicarXp } from './utils/xp';
import { calcularStreak, streakVisivel, chaveData } from './utils/datas';
import { verificarNovasConquistas } from './utils/conquistas';
import { montarBackup, validarBackup } from './utils/backup';
import { gerarId } from './utils/id';
import {
  inteiroNaoNegativo,
  nivelValido,
  booleano,
  textoOuNull,
  listaIds,
  sanitizarQuests,
} from './utils/validacao';
import { tocarLevelUp } from './utils/sons';
import './App.css';

const xpDaTarefa = (tarefa) =>
  DIFICULDADES[tarefa.dificuldade || 'comum'].xp;

const MENSAGENS_VAZIAS = {
  todas: 'Nenhuma quest por aqui. Aventureiro em repouso.',
  ativas: 'Nenhuma quest ativa no momento.',
  concluidas: 'Nenhuma quest concluída ainda.',
};

function App() {
  const [filtro, setFiltro] = useState('todas');
  const [animacaoLevel, setAnimacaoLevel] = useState(false);

  // Cada chave passa por um sanitizador: dado corrompido no navegador
  // é corrigido na leitura em vez de derrubar o app
  const [listaTarefas, setListaTarefas] = useLocalStorage(STORAGE_KEYS.quests, [], sanitizarQuests);
  const [level, setLevel] = useLocalStorage(STORAGE_KEYS.level, 1, nivelValido);
  const [xp, setXp] = useLocalStorage(STORAGE_KEYS.xp, 0, inteiroNaoNegativo);
  const [historicoConcluidas, setHistoricoConcluidas] = useLocalStorage(STORAGE_KEYS.concluidas, 0, inteiroNaoNegativo);
  const [totalCriadas, setTotalCriadas] = useLocalStorage(STORAGE_KEYS.criadas, 0, inteiroNaoNegativo);
  const [streak, setStreak] = useLocalStorage(STORAGE_KEYS.streak, 0, inteiroNaoNegativo);
  const [ultimoDia, setUltimoDia] = useLocalStorage(STORAGE_KEYS.ultimoDia, null, textoOuNull);
  const [somMudo, setSomMudo] = useLocalStorage(STORAGE_KEYS.somMudo, false, booleano);
  const [conquistas, setConquistas] = useLocalStorage(STORAGE_KEYS.conquistas, [], listaIds);
  const [epicasConcluidas, setEpicasConcluidas] = useLocalStorage(STORAGE_KEYS.epicas, 0, inteiroNaoNegativo);
  const [toast, setToast] = useState(null); // { emoji, titulo, texto, duracao?, acao? } | null
  const [maiorNivel, setMaiorNivel] = useLocalStorage(STORAGE_KEYS.maiorNivel, level, nivelValido);
  const [backupStreak, setBackupStreak] = useLocalStorage(STORAGE_KEYS.backupStreak, null, (v) =>
    v && typeof v === 'object' && Number.isInteger(v.streak)
      ? { streak: inteiroNaoNegativo(v.streak), ultimoDia: textoOuNull(v.ultimoDia) }
      : null
  );

  // Tema: valor inválido salvo no navegador cai no padrão
  const [temaBruto, setTema] = useLocalStorage(STORAGE_KEYS.tema, 'padrao');
  const tema = temaValido(temaBruto) ? temaBruto : 'padrao';

  // Sincroniza o <html data-tema="..."> — é isso que troca as variáveis CSS
  useEffect(() => {
    document.documentElement.dataset.tema = tema;
  }, [tema]);

  /**
   * Desbloqueia conquistas com base nos PRÓXIMOS stats (já calculados
   * no handler do evento). Conquista desbloqueada nunca é revogada.
   */
  const checarConquistas = (proximosStats) => {
    const novas = verificarNovasConquistas(conquistas, proximosStats);
    if (novas.length === 0) return;

    setConquistas((atual) => [...atual, ...novas.map((c) => c.id)]);
    const maisRecente = novas[novas.length - 1]; // mostra a mais recente
    setToast({
      emoji: maisRecente.emoji,
      titulo: 'Conquista desbloqueada!',
      texto: `${maisRecente.nome} — ${maisRecente.descricao}`,
    });
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#fbbf24', '#f59e0b', '#fef3c7'],
    });
  };

  /**
   * Aplica ganho/perda de XP resolvendo level up/down na hora.
   * Como roda dentro de um evento (não de um useEffect), é segura
   * no StrictMode e não depende de valores desatualizados.
   */
  const ganharXp = (quantidade) => {
    const novo = aplicarXp({ level, xp }, quantidade);

    // Comemora só ao bater o RECORDE de nível: marcar/desmarcar na fronteira
    // não dispara confete e fanfarra de novo
    if (novo.level > maiorNivel) {
      setMaiorNivel(novo.level);
      setAnimacaoLevel(true);
      setTimeout(() => setAnimacaoLevel(false), 1000);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#fbbf24'],
      });
      if (!somMudo) tocarLevelUp();
    }

    setLevel(novo.level);
    setXp(novo.xp);
    return novo; // handlers usam o retorno para checar conquistas
  };

  const adicionarTarefa = (texto, dificuldade) => {
    const novaTarefa = { id: gerarId(), texto, concluida: false, dificuldade };
    setListaTarefas([novaTarefa, ...listaTarefas]);
    setTotalCriadas((atual) => atual + 1);
  };

  /** Registra a conclusão de hoje na sequência diária (streak). */
  const registrarStreak = () => {
    const resultado = calcularStreak({ streak, ultimoDia });
    if (!resultado.mudou) return streak;

    // Guarda o estado anterior: se a quest for desmarcada ainda hoje, revertemos
    setBackupStreak({ streak, ultimoDia });
    setStreak(resultado.streak);
    setUltimoDia(resultado.ultimoDia);

    // Comemora só quando a sequência realmente cresce (2+ dias seguidos)
    if (resultado.streak > 1) {
      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#f97316', '#fbbf24'],
      });
    }
    return resultado.streak;
  };

  const editarTarefa = (id, novoTexto) => {
    setListaTarefas(
      listaTarefas.map((t) => (t.id === id ? { ...t, texto: novoTexto } : t))
    );
  };

  const removerTarefa = (id) => {
    const indice = listaTarefas.findIndex((t) => t.id === id);
    if (indice === -1) return;
    const item = listaTarefas[indice];

    // Snapshot: o "Desfazer" restaura EXATAMENTE o estado anterior
    // (se outra ação mudar o XP nesse meio-tempo, o desfazer vence — é a intenção)
    const snapshot = { item, indice, level, xp };

    // REGRA: apagar nunca muda o histórico (concluídas/criadas/épicas) —
    // a lista é a visão atual; o histórico é a carreira do jogador.
    // Apagar uma quest concluída apenas devolve o XP (anti-farm).
    if (item.concluida) {
      ganharXp(-xpDaTarefa(item));
    }
    setListaTarefas(listaTarefas.filter((t) => t.id !== id));

    setToast({
      emoji: '🗑️',
      titulo: 'Quest removida',
      texto: item.concluida ? 'O XP dela foi devolvido.' : `"${item.texto}" saiu da lista.`,
      duracao: 6000,
      acao: {
        rotulo: 'Desfazer',
        onClick: () => {
          setLevel(snapshot.level);
          setXp(snapshot.xp);
          setListaTarefas((atual) => [
            ...atual.slice(0, snapshot.indice),
            snapshot.item,
            ...atual.slice(snapshot.indice),
          ]);
        },
      },
    });
  };

  const alternarConcluida = (id) => {
    const item = listaTarefas.find((t) => t.id === id);
    if (!item) return;

    const novoStatus = !item.concluida;
    const ehEpica = (item.dificuldade || 'comum') === 'epica';
    const hoje = chaveData();

    // Nova lista calculada antes: a reversão da streak precisa saber
    // se sobrou alguma outra quest concluída hoje
    const novaLista = listaTarefas.map((t) => {
      if (t.id !== id) return t;
      const atualizada = { ...t, concluida: novoStatus };
      if (novoStatus) atualizada.concluidaEm = hoje;
      else delete atualizada.concluidaEm;
      return atualizada;
    });

    // Calcula os próximos valores de cada stat...
    const progresso = ganharXp(novoStatus ? xpDaTarefa(item) : -xpDaTarefa(item));
    const novasConcluidas = novoStatus
      ? historicoConcluidas + 1
      : Math.max(0, historicoConcluidas - 1);
    const novasEpicas = ehEpica
      ? novoStatus
        ? epicasConcluidas + 1
        : Math.max(0, epicasConcluidas - 1)
      : epicasConcluidas;

    let novaStreak = streak;
    if (novoStatus) {
      novaStreak = registrarStreak();
    } else {
      // Desmarcou a última quest concluída de hoje: devolve o crédito da streak
      const sobrouConcluidaHoje = novaLista.some(
        (t) => t.concluida && t.concluidaEm === hoje
      );
      if (!sobrouConcluidaHoje && ultimoDia === hoje && backupStreak) {
        setStreak(backupStreak.streak);
        setUltimoDia(backupStreak.ultimoDia);
        novaStreak = backupStreak.streak;
      }
    }

    // ...e persiste tudo
    setHistoricoConcluidas(novasConcluidas);
    if (ehEpica) setEpicasConcluidas(novasEpicas);

    // Conquistas são checadas com os valores futuros, sem efeito colateral em efeito
    checarConquistas({
      concluidas: novasConcluidas,
      epicas: novasEpicas,
      level: progresso.level,
      streak: novaStreak,
    });

    if (novoStatus && item.dificuldade === 'epica') {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#a855f7', '#c084fc'],
      });
    }

    setListaTarefas(novaLista);
  };

  /** Baixa um arquivo .json com todo o progresso. */
  const exportarProgresso = () => {
    const backup = montarBackup({
      quests: listaTarefas,
      level,
      xp,
      concluidas: historicoConcluidas,
      criadas: totalCriadas,
      epicas: epicasConcluidas,
      streak,
      ultimoDia,
      somMudo,
      conquistas,
      tema,
    });

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quest-manager-backup-${chaveData()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setToast({
      emoji: '📦',
      titulo: 'Backup exportado!',
      texto: 'Guarde o arquivo em um lugar seguro.',
    });
  };

  /** Lê um backup .json, valida e restaura o progresso. */
  const importarProgresso = async (arquivo) => {
    try {
      const dados = JSON.parse(await arquivo.text());
      const resultado = validarBackup(dados);

      if (!resultado.ok) {
        setToast({ emoji: '❌', titulo: 'Falha na importação', texto: resultado.erro });
        return;
      }

      // Importar sobrescreve tudo: melhor confirmar antes
      if (!window.confirm('Importar substituirá TODO o seu progresso atual. Continuar?')) return;

      const { estado } = resultado;
      setListaTarefas(estado.quests);
      setLevel(estado.level);
      setXp(estado.xp);
      setHistoricoConcluidas(estado.concluidas);
      setTotalCriadas(estado.criadas);
      setEpicasConcluidas(estado.epicas);
      setStreak(estado.streak);
      setUltimoDia(estado.ultimoDia);
      setSomMudo(estado.somMudo);
      setConquistas(estado.conquistas);
      setTema(estado.tema);

      setToast({
        emoji: '📦',
        titulo: 'Progresso importado!',
        texto: 'Seu backup foi restaurado com sucesso.',
      });
    } catch {
      setToast({
        emoji: '❌',
        titulo: 'Falha na importação',
        texto: 'Não foi possível ler o arquivo. Ele é um JSON válido?',
      });
    }
  };

  // Estatísticas: usam o histórico total, então não mudam ao apagar quests da lista
  const taxaSucesso =
    totalCriadas > 0
      ? Math.min(100, Math.round((historicoConcluidas / totalCriadas) * 100))
      : 100;
  const poderTotal = level * 15 + historicoConcluidas * 5;
  const sequenciaExibida = streakVisivel({ streak, ultimoDia });

  // Exibição deriva dos stats (jogadores antigos veem suas conquistas na hora);
  // o registro persistido serve para não repetir a celebração
  const statsAtuais = { concluidas: historicoConcluidas, epicas: epicasConcluidas, level, streak };
  const conquistasExibidas = CONQUISTAS.filter(
    (c) => conquistas.includes(c.id) || c.condicao(statsAtuais)
  ).map((c) => c.id);

  const tarefasFiltradas = listaTarefas.filter((tarefa) => {
    if (filtro === 'ativas') return !tarefa.concluida;
    if (filtro === 'concluidas') return tarefa.concluida;
    return true;
  });

  return (
    <div className="container">
      <Hud
        level={level}
        xp={xp}
        animacaoLevel={animacaoLevel}
        somMudo={somMudo}
        onAlternarSom={() => setSomMudo((mudo) => !mudo)}
      />

      <PainelStatus
        poder={poderTotal}
        concluidas={historicoConcluidas}
        taxaSucesso={taxaSucesso}
        sequencia={sequenciaExibida}
      />

      <FormQuest onAdicionar={adicionarTarefa} />

      <AbasFiltro filtro={filtro} onMudarFiltro={setFiltro} />

      {tarefasFiltradas.length === 0 ? (
        <p className="empty-state" role="status">
          {MENSAGENS_VAZIAS[filtro]}
        </p>
      ) : (
        <ul className="lista">
          {tarefasFiltradas.map((item) => (
            <Tarefa
              key={item.id}
              item={item}
              onAlternar={alternarConcluida}
              onRemover={removerTarefa}
              onEditar={editarTarefa}
            />
          ))}
        </ul>
      )}

      <PainelConquistas desbloqueadas={conquistasExibidas} />

      <SeletorTema tema={tema} onMudarTema={setTema} />

      <BarraBackup onExportar={exportarProgresso} onImportar={importarProgresso} />

      <Toast toast={toast} onFechar={() => setToast(null)} />
    </div>
  );
}

export default App;
