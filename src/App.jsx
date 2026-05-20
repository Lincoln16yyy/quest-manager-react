import { useState, useEffect } from 'react';
import Tarefa from './Tarefa';
import confetti from 'canvas-confetti';
import './App.css';

function App() {
  const [tarefa, setTarefa] = useState('');
  const [dificuldade, setDificuldade] = useState('comum');
  const [animacaoLevel, setAnimacaoLevel] = useState(false);
  const [filtro, setFiltro] = useState('todas');
  
  const [listaTarefas, setListaTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem('quests-lincoln');
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
  });

  const [level, setLevel] = useState(() => {
    const levelSalvo = localStorage.getItem('level-lincoln');
    return levelSalvo ? parseInt(levelSalvo) : 1;
  });

  const [xp, setXp] = useState(() => {
    const xpSalvo = localStorage.getItem('xp-lincoln');
    return xpSalvo ? parseInt(xpSalvo) : 0;
  });

  // Estado para armazenar o histórico de quantidade de quests concluídas para as estatísticas
  const [historicoConcluidas, setHistoricoConcluidas] = useState(() => {
    const salvas = localStorage.getItem('stats-concluidas-lincoln');
    return salvas ? parseInt(salvas) : 0;
  });

  useEffect(() => {
    localStorage.setItem('quests-lincoln', JSON.stringify(listaTarefas));
    localStorage.setItem('level-lincoln', level.toString());
    localStorage.setItem('xp-lincoln', xp.toString());
    localStorage.setItem('stats-concluidas-lincoln', historicoConcluidas.toString());
  }, [listaTarefas, level, xp, historicoConcluidas]);

  const obterTitulo = (nivelAtual) => {
    if (nivelAtual < 5) return 'Novato da Guilda';
    if (nivelAtual < 10) return 'Caçador de Recompensas';
    if (nivelAtual < 20) return 'Mercenário de Elite';
    if (nivelAtual < 35) return 'Lenda Viva';
    return 'Mestre Supremo';
  };

  const xpPorDificuldade = {
    comum: 10,
    rara: 25,
    epica: 50
  };

  const xpNecessario = level * 100;
  const porcentagemXp = (xp / xpNecessario) * 100;

  useEffect(() => {
    if (xp >= xpNecessario) {
      setLevel(levelAtual => levelAtual + 1);
      setXp(xpAtual => xpAtual - xpNecessario);
      setAnimacaoLevel(true);
      setTimeout(() => setAnimacaoLevel(false), 1000);

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#fbbf24'] 
      });

    } else if (xp < 0 && level > 1) {
      setLevel(levelAtual => levelAtual - 1);
      setXp(((level - 1) * 100) + xp); 
    } else if (xp < 0 && level === 1) {
      setXp(0); 
    }
  }, [xp, level, xpNecessario]);

  const adicionarTarefa = () => {
    if (tarefa.trim() !== '') {
      setListaTarefas([{ texto: tarefa, concluida: false, dificuldade }, ...listaTarefas]);
      setTarefa('');
    }
  };

  const removerTarefa = (indexParaRemover) => {
    const item = listaTarefas[indexParaRemover];
    if (item.concluida) {
      const xpPerdido = xpPorDificuldade[item.dificuldade || 'comum'];
      setXp(xpAtual => xpAtual - xpPerdido);
      setHistoricoConcluidas(atual => Math.max(0, atual - 1));
    }
    const novaLista = listaTarefas.filter((_, index) => index !== indexParaRemover);
    setListaTarefas(novaLista);
  };

  const alternarConcluida = (indexParaAlternar) => {
    const novaLista = listaTarefas.map((item, index) => {
      if (index === indexParaAlternar) {
        const novoStatus = !item.concluida;
        const xpGanhado = xpPorDificuldade[item.dificuldade || 'comum'];
        setXp(xpAtual => novoStatus ? xpAtual + xpGanhado : xpAtual - xpGanhado);
        
        // Atualiza estatísticas de quantidade
        setHistoricoConcluidas(atual => novoStatus ? atual + 1 : Math.max(0, atual - 1));

        if (novoStatus && item.dificuldade === 'epica') {
          confetti({
            particleCount: 60,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#a855f7', '#c084fc']
          });
        }

        return { ...item, concluida: novoStatus };
      }
      return item;
    });
    setListaTarefas(novaLista);
  };

  // CÁLCULO DE ESTATÍSTICAS
  const totalQuestsCriadas = listaTarefas.length;
  const questsAtivasAtuais = listaTarefas.filter(t => !t.concluida).length;
  const taxaSucesso = totalQuestsCriadas > 0 
    ? Math.round(((totalQuestsCriadas - questsAtivasAtuais) / totalQuestsCriadas) * 100) 
    : 100;
  const poderTotal = (level * 15) + (historicoConcluidas * 5);

  const tarefasFiltradas = listaTarefas.map((item, index) => ({ ...item, indexOriginal: index })).filter(tarefa => {
    if (filtro === 'ativas') return !tarefa.concluida;
    if (filtro === 'concluidas') return tarefa.concluida;
    return true;
  });

  return (
    <div className="container premium-layout">
      {/* HUD do Personagem */}
      <div className="hud-rpg">
        <div className={`level-badge ${animacaoLevel ? 'level-up-anim' : ''}`}>
          <span>LVL</span>
          <strong>{level}</strong>
        </div>
        
        <div className="xp-container">
          <div className="xp-info">
            <span className="titulo-rpg">{obterTitulo(level)}</span>
            <span>{xp} / {xpNecessario} XP</span>
          </div>
          <div className="xp-bar-bg">
            <div className="xp-bar-fill" style={{ width: `${porcentagemXp}%` }}></div>
          </div>
        </div>
      </div>

      {/* NOVO: PAINEL DE STATUS (ESTATÍSTICAS) */}
      <div className="status-panel">
        <div className="status-card">
          <span className="status-label">⚔️ PODER</span>
          <strong className="status-value de-poder">{poderTotal}</strong>
        </div>
        <div className="status-card">
          <span className="status-label">🏆 CONCLUÍDAS</span>
          <strong className="status-value">{historicoConcluidas}</strong>
        </div>
        <div className="status-card">
          <span className="status-label">📈 TAXA DE VITÓRIA</span>
          <strong className="status-value">{taxaSucesso}%</strong>
        </div>
      </div>

      <div className="input-group">
        <input
          type="text"
          value={tarefa}
          onChange={(e) => setTarefa(e.target.value)}
          placeholder="Adicionar nova Quest..."
          className="input-tarefa"
          onKeyDown={(e) => e.key === 'Enter' && adicionarTarefa()} 
        />
        
        <select 
          className="select-dificuldade"
          value={dificuldade} 
          onChange={(e) => setDificuldade(e.target.value)}
        >
          <option value="comum">Comum (10 XP)</option>
          <option value="rara">Rara (25 XP)</option>
          <option value="epica">Épica (50 XP)</option>
        </select>

        <button onClick={adicionarTarefa} className="btn-salvar">
          Adicionar
        </button>
      </div>
      
      <div className="abas-container">
        <button className={`btn-aba ${filtro === 'todas' ? 'ativo' : ''}`} onClick={() => setFiltro('todas')}>Todas</button>
        <button className={`btn-aba ${filtro === 'ativas' ? 'ativo' : ''}`} onClick={() => setFiltro('ativas')}>Ativas</button>
        <button className={`btn-aba ${filtro === 'concluidas' ? 'ativo' : ''}`} onClick={() => setFiltro('concluidas')}>Concluídas</button>
      </div>
      
      <ul className="lista">
        {tarefasFiltradas.map((item) => (
          <Tarefa 
            key={item.indexOriginal} 
            item={item} 
            index={item.indexOriginal} 
            alternarConcluida={alternarConcluida} 
            removerTarefa={removerTarefa} 
          />
        ))}
        {tarefasFiltradas.length === 0 && (
          <p className="empty-state">
            {filtro === 'concluidas' ? 'Nenhuma quest concluída ainda.' : 'Nenhuma quest por aqui. Aventureiro em repouso.'}
          </p>
        )}
      </ul>
    </div>
  );
}

export default App;