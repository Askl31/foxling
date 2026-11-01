import { describe, it, expect } from 'vitest';
import { WORDS_ALL, SONGS } from './curriculum';
import { foxySVG, scenes } from './art';

describe('assets SVG — qualité et validité', () => {
  it('chaque mot a un SVG bien formé (1 racine svg, balise fermante)', () => {
    for (const w of WORDS_ALL) {
      expect(w.svg.startsWith('<svg'), w.id).toBe(true);
      expect(w.svg.includes('</svg>'), w.id).toBe(true);
      expect((w.svg.match(/<svg/g) ?? []).length, w.id).toBe(1);
    }
  });

  it('Foxy existe en 5 humeurs et les scènes existent', () => {
    for (const mood of ['happy', 'sleep', 'point', 'surprise', 'eat'] as const) {
      expect(foxySVG(mood).includes('</svg>')).toBe(true);
    }
    expect(scenes.farm.includes('</svg>')).toBe(true);
    expect(scenes.park.includes('</svg>')).toBe(true);
  });

  it('chaque chanson a un thème couvert par le curriculum et 4 lignes', () => {
    const themes = new Set(WORDS_ALL.map((w) => w.theme));
    for (const s of SONGS) {
      expect(s.lines.length).toBe(4);
      expect(themes.has(s.theme) || s.theme === 'politeness').toBe(true);
    }
  });

  it('le curriculum couvre les 3 niveaux du cahier des charges', () => {
    expect(WORDS_ALL.filter((w) => w.level === 1).length).toBeGreaterThanOrEqual(60);
    expect(WORDS_ALL.filter((w) => w.level === 2).length).toBeGreaterThanOrEqual(30);
    expect(WORDS_ALL.filter((w) => w.level === 3).length).toBeGreaterThanOrEqual(30);
  });
});
