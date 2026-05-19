import { useState, useEffect } from 'react';
import Tarefa from './Tarefa';
import './App.css';

function App() {
  const [tarefa, setTarefa] = useState('');
  
  // Nossas tarefas salvas
  const [listaTarefas, setListaTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem('quests-lincoln');
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
  });

  // Novos Estados do RPG: Level e XP
  const [level, setLevel] = useState(() => {
    const levelSalvo = localStorage.getItem('level-lincoln');
    return levelSalvo ? parseInt(levelSalvo) : 1;
  });

  const [xp, setXp] = useState(() => {
    const xpSalvo = localStorage.getItem('xp-lincoln');
    return xpSalvo ? parseInt(xpSalvo) : 0;
  });

  // Salva tudo no LocalStorage sempre que algo mudar
  useEffect(() => {
    localStorage.setItem('quests-lincoln', JSON.stringify(listaTarefas));
    localStorage.setItem('level-lincoln', level.toString());
    localStorage.setItem('xp-lincoln', xp.toString());
  }, [listaTarefas, level, xp]);

  // Lógica de Subir de Nível
  const xpNecessario = level * 100; // Cada nível exige mais XP
  const porcentagemXp = (xp / xpNecessario) * 100;

  useEffect(() => {
    if (xp >= xpNecessario) {
      setLevel(levelAtual => levelAtual + 1);
      setXp(xpAtual => xpAtual - xpNecessario); // Reseta o XP mantendo a sobra
    } else if (xp < 0 && level > 1) {
      // Se desmarcar uma tarefa e o XP ficar negativo, cai de nível
      setLevel(levelAtual => levelAtual - 1);
      setXp(((level - 1) * 100) + xp); 
    } else if (xp < 0 && level === 1) {
      setXp(0); // Não deixa o XP ficar negativo no nível 1
    }
  }, [xp, level, xpNecessario]);

  const adicionarTarefa = () => {
    if (tarefa.trim() !== '') {
      setListaTarefas([...listaTarefas, { texto: tarefa, concluida: false }]);
      setTarefa('');
    }
  };

  const removerTarefa = (indexParaRemover) => {
    const item = listaTarefas[indexParaRemover];
    // Se apagar uma quest que já estava concluída, perde o XP dela
    if (item.concluida) {
      setXp(xpAtual => xpAtual - 25);
    }
    const novaLista = listaTarefas.filter((_, index) => index !== indexParaRemover);
    setListaTarefas(novaLista);
  };

  const alternarConcluida = (indexParaAlternar) => {
    const novaLista = listaTarefas.map((item, index) => {
      if (index === indexParaAlternar) {
        const novoStatus = !item.concluida;
        // Ganha 25 XP se concluir, perde 25 XP se desmarcar
        setXp(xpAtual => novoStatus ? xpAtual + 25 : xpAtual - 25);
        return { ...item, concluida: novoStatus };
      }
      return item;
    });
    setListaTarefas(novaLista);
  };

  return (
    <div className="container">
      {/* HUD do Personagem */}
      <div className="hud-rpg">
        <div className="level-badge">
          <span>LVL</span>
          <strong>{level}</strong>
        </div>
        <div className="xp-container">
          <div className="xp-info">
            <span>Experiência</span>
            <span>{xp} / {xpNecessario} XP</span>
          </div>
          <div className="xp-bar-bg">
            <div className="xp-bar-fill" style={{ width: `${porcentagemXp}%` }}></div>
          </div>
        </div>
      </div>

      <div className="input-group">
        <input
          type="text"
          value={tarefa}
          onChange={(e) => setTarefa(e.target.value)}
          placeholder="Adicionar nova Quest..."
          className="input-tarefa"
          onKeyDown={(e) => e.key === 'Enter' && adicionarTarefa()} // Adiciona com o Enter
        />
        <button onClick={adicionarTarefa} className="btn-salvar">
          Adicionar
        </button>
      </div>
      
      <ul className="lista">
        {listaTarefas.map((item, index) => (
          <Tarefa 
            key={index} 
            item={item} 
            index={index} 
            alternarConcluida={alternarConcluida} 
            removerTarefa={removerTarefa} 
          />
        ))}
        {listaTarefas.length === 0 && (
          <p className="empty-state">Nenhuma quest ativa no momento.</p>
        )}
      </ul>
    </div>
  );
}

export default App;