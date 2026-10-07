import { describe, it, expect } from 'vitest';
import { calcularStreak, streakVisivel } from '../../src/utils/datas';

describe('calcularStreak', () => {
  it('mesmo dia não muda', () => {
    const hoje = '2026-10-07';
    const res = calcularStreak({ streak: 5, ultimoDia: hoje }, hoje, '2026-10-06');
    expect(res.mudou).toBe(false);
    expect(res.streak).toBe(5);
  });

  it('dia seguinte aumenta', () => {
    const hoje = '2026-10-07';
    const ontem = '2026-10-06';
    const res = calcularStreak({ streak: 2, ultimoDia: ontem }, hoje, ontem);
    expect(res.mudou).toBe(true);
    expect(res.streak).toBe(3);
    expect(res.ultimoDia).toBe(hoje);
  });

  it('pulou dias recomeça', () => {
    const hoje = '2026-10-07';
    const anteontem = '2026-10-05';
    const res = calcularStreak({ streak: 10, ultimoDia: anteontem }, hoje, '2026-10-06');
    expect(res.streak).toBe(1);
    expect(res.ultimoDia).toBe(hoje);
    expect(res.mudou).toBe(true);
  });

  it('virada de mês/ano funciona', () => {
    const hoje = '2026-11-01';
    const ontem = '2026-10-31';
    const res = calcularStreak({ streak: 3, ultimoDia: ontem }, hoje, ontem);
    expect(res.streak).toBe(4);
  });
});

describe('streakVisivel', () => {
  it('hoje ou ontem mostra streak', () => {
    expect(streakVisivel({ streak: 5, ultimoDia: '2026-10-07' }, '2026-10-07', '2026-10-06')).toBe(5);
    expect(streakVisivel({ streak: 5, ultimoDia: '2026-10-06' }, '2026-10-07', '2026-10-06')).toBe(5);
  });

  it('pulou dias mostra 0', () => {
    expect(streakVisivel({ streak: 5, ultimoDia: '2026-10-05' }, '2026-10-07', '2026-10-06')).toBe(0);
  });
});
