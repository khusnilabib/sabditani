// AUTO-GENERATED from tokens.json — do not edit.
import { tokens } from '@sabditani/tokens';

export const lightColors = Object.fromEntries(
  Object.entries(tokens.color.semantic).map(([k, v]) => [k, v.light])
) as Record<keyof typeof tokens.color.semantic, string>;

export const darkColors = Object.fromEntries(
  Object.entries(tokens.color.semantic).map(([k, v]) => [k, v.dark])
) as Record<keyof typeof tokens.color.semantic, string>;

export function seasonAccent(season: 'rainy' | 'transition' | 'dry', dark = false) {
  return tokens.color.season[season][dark ? 'dark' : 'light'];
}

export const spacing = tokens.space;
export const radius = tokens.radius;
export const motion = tokens.motion;
export const brand = tokens.brand;

export const theme = {
  light: {
    dark: false,
    colors: { ...lightColors, season: seasonAccent('transition') },
  },
  dark: {
    dark: true,
    colors: { ...darkColors, season: seasonAccent('transition', true) },
  },
};

export type AppTheme = (typeof theme)['light'] | (typeof theme)['dark'];
