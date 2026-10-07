import { describe, it, expect } from 'vitest';
import {
  aplicarXp,
  xpNecessarioPara,
  bonusStreak,
} from '../../src/utils/xp';
import { XP_POR_NIVEL, NIVEL_MAXIMO } from '../../src/constants';
import { obterTitulo } from '../../src/constants';

describe('curva de XP (issue #16)', () => {
  it('XP_POR_NIVEL é a constante centralizada em constants.js', () => {
    expect(XP_POR_NIVEL).toBe(20);
    expect(typeof NIVEL_MAXIMO).toBe('number');
  });

  it('xpNecessarioPara cresce linearmente', () => {
    expect(xpNecessarioPara(1)).toBe(20);
    expect(xpNecessarioPara(35)).toBe(700);
  });

  it('nível 35 começa em 11.900 XP (meta de ~1 ano)', () => {
    const exatamenteNoLimite = aplicarXp({ level: 1, xp: 0 }, 11_900);
    expect(exatamenteNoLimite).toEqual({ level: 35, xp: 0 });

    const umAntes = aplicarXp({ level: 1, xp: 0 }, 11_899);
    expect(umAntes.level).toBe(34);
  });
});

describe('aplicarXp', () => {
  it('aplica ganho simples', () => {
    const res = aplicarXp({ level: 1, xp: 0 }, 10);
    expect(res).toEqual({ level: 1, xp: 10 });
  });

  it('sobe vários níveis de uma vez', () => {
    const res = aplicarXp({ level: 1, xp: 0 }, 250);
    expect(res.level).toBe(5);
    expect(res.xp).toBe(50);
  });

  it('desce de nível', () => {
    const res = aplicarXp({ level: 5, xp: 0 }, -150);
    expect(res.level).toBeLessThan(5);
  });

  it('piso no nível 1', () => {
    const res = aplicarXp({ level: 2, xp: 50 }, -1000);
    expect(res).toEqual({ level: 1, xp: 0 });
  });

  it('XP nunca fica negativo', () => {
    const res = aplicarXp({ level: 1, xp: 5 }, -10);
    expect(res.xp).toBe(0);
    expect(res.level).toBe(1);
  });

  it('XP absurdo (backup adulterado) não trava e respeita o teto', () => {
    const res = aplicarXp({ level: 1, xp: 0 }, 1e300);
    expect(res.level).toBe(NIVEL_MAXIMO);
    expect(res.xp).toBeGreaterThanOrEqual(0);
    expect(res.xp).toBeLessThan(xpNecessarioPara(NIVEL_MAXIMO));
  });
});

describe('bonusStreak (issue #16)', () => {
  it('sem streak não há bônus', () => {
    expect(bonusStreak(10, 0)).toBe(0);
    expect(bonusStreak(10, undefined)).toBe(0);
    expect(bonusStreak(10, -5)).toBe(0);
  });

  it('+5% por dia de sequência', () => {
    expect(bonusStreak(10, 4)).toBe(2); // 20%
    expect(bonusStreak(10, 20)).toBe(10); // 100% (teto)
    expect(bonusStreak(50, 10)).toBe(25); // 50%
  });

  it('respeita o teto de +100%', () => {
    expect(bonusStreak(10, 999)).toBe(10);
    expect(bonusStreak(25, 30)).toBe(25);
  });

  it('base zero não gera bônus', () => {
    expect(bonusStreak(0, 50)).toBe(0);
  });
});

describe('obterTitulo', () => {
  it('retorna títulos corretos nos limites', () => {
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
});
