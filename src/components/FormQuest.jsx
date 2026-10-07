import { useState } from 'react';
import { DIFICULDADES } from '../constants';

function FormQuest({ onAdicionar }) {
  const [texto, setTexto] = useState('');
  const [dificuldade, setDificuldade] = useState('comum');

  const enviar = (evento) => {
    evento.preventDefault(); // <form> cuida do Enter nativamente
    if (texto.trim() === '') return;
    onAdicionar(texto.trim(), dificuldade);
    setTexto('');
  };

  return (
    <form className="input-group" onSubmit={enviar}>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Adicionar nova Quest..."
        className="input-tarefa"
        maxLength={120}
      />

      <select
        className="select-dificuldade"
        value={dificuldade}
        onChange={(e) => setDificuldade(e.target.value)}
        aria-label="Dificuldade da quest"
      >
        {Object.entries(DIFICULDADES).map(([valor, { rotulo, xp }]) => (
          <option key={valor} value={valor}>
            {rotulo} ({xp} XP)
          </option>
        ))}
      </select>

      <button type="submit" className="btn-salvar">
        Adicionar
      </button>
    </form>
  );
}

export default FormQuest;
