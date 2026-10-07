import { describe, it, expect } from 'vitest';
import { obterTitulo, DIFICULDADES, temaValido } from '../../src/constants';

describe('constants', () => {
  it('obterTitulo cobre limites', () => {
    expect(obterTitulo(1)).toBe('Novato da Guilda');
    expect(obterTitulo(4)).toBe('Novato da Guilda');
    expect(obterTitulo(5)).toBe('Caçador de Recompensas');
    expect(obterTitulo(9)).toBe('Caçador de Recompensas');
    expect(obterTitulo(10)).toBe('Mercenário de Elite');
    expect(obterTitulo(19)).toBe('Mercenário de Elite');
    expect(obterTitulo(20)).toBe('Lenda Viva');
    expect(obterTitulo(34)).toBe('Lenda Viva');
    expect(obterTitulo(35)).toBe('Mestre Supremo');
  });

  it('dificuldades têm XP', () => {
    expect(DIFICULDADES.comum.xp).toBe(10);
    expect(DIFICULDADES.rara.xp).toBe(25);
    expect(DIFICULDADES.epica.xp).toBe(50);
  });

  it('temaValido funciona', () => {
    expect(temaValido('padrao')).toBe(true);
    expect(temaValido('inválido')).toBe(false);
  });
});
