import { useState } from 'react';
import confetti from 'canvas-confetti';
import Hud from './components/Hud';
import PainelStatus from './components/PainelStatus';
import FormQuest from './components/FormQuest';
import AbasFiltro from './components/AbasFiltro';
import Tarefa from './components/Tarefa';
import PainelConquistas from './components/PainelConquistas';
import ToastConquista from './components/ToastConquista';
import useLocalStorage from './hooks/useLocalStorage';
import { STORAGE_KEYS, DIFICULDADES, CONQUISTAS } from './constants';
import { aplicarXp } from './utils/xp';
import { calcularStreak, streakVisivel } from './utils/datas';
import { verificarNovasConquistas } from './utils/conquistas';
import { tocarLevelUp } from './utils/sons';
import './App.css';

// Tarefas salvas antes do sistema de ID não têm `id`: geramos um na leitura
const migrarTarefas = (salvas) =>
  salvas.map((t) => ({ ...t, id: t.id ?? crypto.randomUUID() }));

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

  const [listaTarefas, setListaTarefas] = useLocalStorage(STORAGE_KEYS.quests, [], migrarTarefas);
  const [level, setLevel] = useLocalStorage(STORAGE_KEYS.level, 1);
  const [xp, setXp] = useLocalStorage(STORAGE_KEYS.xp, 0);
  const [historicoConcluidas, setHistoricoConcluidas] = useLocalStorage(STORAGE_KEYS.concluidas, 0);
  const [totalCriadas, setTotalCriadas] = useLocalStorage(STORAGE_KEYS.criadas, 0);
  const [streak, setStreak] = useLocalStorage(STORAGE_KEYS.streak, 0);
  const [ultimoDia, setUltimoDia] = useLocalStorage(STORAGE_KEYS.ultimoDia, null);
  const [somMudo, setSomMudo] = useLocalStorage(STORAGE_KEYS.somMudo, false);
  const [conquistas, setConquistas] = useLocalStorage(STORAGE_KEYS.conquistas, []);
  const [epicasConcluidas, setEpicasConcluidas] = useLocalStorage(STORAGE_KEYS.epicas, 0);
  const [toastConquista, setToastConquista] = useState(null);

  /**
   * Desbloqueia conquistas com base nos PRÓXIMOS stats (já calculados
   * no handler do evento). Conquista desbloqueada nunca é revogada.
   */
  const checarConquistas = (proximosStats) => {
    const novas = verificarNovasConquistas(conquistas, proximosStats);
    if (novas.length === 0) return;

    setConquistas((atual) => [...atual, ...novas.map((c) => c.id)]);
    setToastConquista(novas[novas.length - 1]); // mostra a mais recente
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

    if (novo.level > level) {
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
    const novaTarefa = { id: crypto.randomUUID(), texto, concluida: false, dificuldade };
    setListaTarefas([novaTarefa, ...listaTarefas]);
    setTotalCriadas((atual) => atual + 1);
  };

  /** Registra a conclusão de hoje na sequência diária (streak). */
  const registrarStreak = () => {
    const resultado = calcularStreak({ streak, ultimoDia });
    if (!resultado.mudou) return streak;

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
    const item = listaTarefas.find((t) => t.id === id);
    if (!item) return;

    // Remover uma quest concluída devolve o XP ganho
    if (item.concluida) {
      ganharXp(-xpDaTarefa(item));
      setHistoricoConcluidas((atual) => Math.max(0, atual - 1));
      if ((item.dificuldade || 'comum') === 'epica') {
        setEpicasConcluidas((atual) => Math.max(0, atual - 1));
      }
    }
    setListaTarefas(listaTarefas.filter((t) => t.id !== id));
  };

  const alternarConcluida = (id) => {
    const item = listaTarefas.find((t) => t.id === id);
    if (!item) return;

    const novoStatus = !item.concluida;
    const ehEpica = (item.dificuldade || 'comum') === 'epica';

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
    const novaStreak = novoStatus ? registrarStreak() : streak;

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

    setListaTarefas(
      listaTarefas.map((t) => (t.id === id ? { ...t, concluida: novoStatus } : t))
    );
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
        {tarefasFiltradas.length === 0 && (
          <p className="empty-state">{MENSAGENS_VAZIAS[filtro]}</p>
        )}
      </ul>

      <PainelConquistas desbloqueadas={conquistasExibidas} />

      <ToastConquista conquista={toastConquista} onFechar={() => setToastConquista(null)} />
    </div>
  );
}

export default App;
