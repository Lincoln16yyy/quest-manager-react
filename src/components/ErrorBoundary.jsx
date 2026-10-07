import { Component } from 'react';
import { STORAGE_KEYS } from '../constants';

/**
 * Última linha de defesa: se qualquer erro de render escapar,
 * mostra uma tela amigável em vez de uma tela branca.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { quebrou: false };
  }

  static getDerivedStateFromError() {
    return { quebrou: true };
  }

  componentDidCatch(erro, info) {
    console.error('Quest Manager quebrou:', erro, info);
  }

  resetarDados = () => {
    Object.values(STORAGE_KEYS).forEach((chave) => localStorage.removeItem(chave));
    window.location.reload();
  };

  render() {
    if (this.state.quebrou) {
      return (
        <div className="tela-erro">
          <h1>💥 O aventureiro tropeçou!</h1>
          <p>
            Algo deu errado ao carregar suas quests. Tente recarregar — se o problema
            persistir, resete os dados salvos.
          </p>
          <div className="acoes-erro">
            <button type="button" onClick={() => window.location.reload()}>
              🔄 Recarregar
            </button>
            <button type="button" className="perigo" onClick={this.resetarDados}>
              🗑️ Resetar dados
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
