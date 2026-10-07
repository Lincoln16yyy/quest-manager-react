import { useState, useEffect } from 'react';

/**
 * Igual ao useState, mas sincroniza o valor com o localStorage.
 *
 * @param {string} chave - chave usada no localStorage
 * @param {*} valorInicial - valor usado quando não há nada salvo
 * @param {(valor: *) => *} [migrar] - função opcional para normalizar
 *   dados antigos salvos no navegador (roda uma vez, na leitura)
 */
function useLocalStorage(chave, valorInicial, migrar) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave);
      if (salvo === null) return valorInicial;
      const bruto = JSON.parse(salvo);
      return migrar ? migrar(bruto) : bruto;
    } catch {
      // Dado corrompido ou JSON inválido: começa do zero em vez de quebrar o app
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      // Armazenamento cheio ou bloqueado: o app continua funcionando sem salvar
    }
  }, [chave, valor]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key !== chave) return;
      try {
        const novo = e.newValue === null ? valorInicial : JSON.parse(e.newValue);
        const normalizado = migrar ? migrar(novo) : novo;
        setValor((atual) => {
          const atualNormalizado = migrar ? migrar(atual) : atual;
          if (JSON.stringify(atualNormalizado) === JSON.stringify(normalizado)) return atual;
          return normalizado;
        });
      } catch {
        // Ignora erros de parsing
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [chave, migrar, valorInicial]);

  return [valor, setValor];
}

export default useLocalStorage;
