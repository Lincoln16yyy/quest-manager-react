import { useRef } from 'react';

function BarraBackup({ onExportar, onImportar }) {
  const inputArquivo = useRef(null);

  const aoEscolherArquivo = (e) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) onImportar(arquivo);
    e.target.value = ''; // Permite escolher o mesmo arquivo de novo
  };

  return (
    <footer className="barra-backup">
      <button type="button" className="btn-backup" onClick={onExportar}>
        ⬇️ Exportar progresso
      </button>
      <button
        type="button"
        className="btn-backup"
        onClick={() => inputArquivo.current?.click()}
      >
        ⬆️ Importar progresso
      </button>
      <input
        ref={inputArquivo}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={aoEscolherArquivo}
        aria-label="Selecionar arquivo de backup"
      />
    </footer>
  );
}

export default BarraBackup;
