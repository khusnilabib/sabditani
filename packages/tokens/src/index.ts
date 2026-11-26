// AUTO-GENERATED from tokens.json — do not edit.
export const tokens = {
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "meta": {
    "name": "SABDITANI Design Tokens",
    "version": "0.1.0",
    "brand": "SABDITANI — sarana abdi tani",
    "note": "Sumber kebenaran tunggal. Hasil generate: tokens.css (web), tokens.ts (web/admin), theme.ts (React Native)."
  },
  "brand": {
    "logoDeepGreen": "#005020",
    "logoLeaf": "#40D000",
    "logoGold": "#F0A800",
    "logoSoil": "#984800",
    "wordmarkGreen": "#026712",
    "wordmarkBrown": "#964903"
  },
  "color": {
    "green900": "#12261D",
    "green800": "#1A3A2B",
    "green700": "#1F4D38",
    "green600": "#2B6849",
    "green500": "#3A8460",
    "green300": "#86B79B",
    "green100": "#DCEBE2",
    "green50": "#EEF5F0",
    "gold800": "#7A5C1D",
    "gold600": "#A8802F",
    "gold500": "#C39A3F",
    "gold300": "#E2C77F",
    "gold100": "#F5EBCB",
    "cream50": "#FBF8F1",
    "cream100": "#F4EEDF",
    "cream200": "#E9DFC8",
    "cream300": "#D9CCAE",
    "soil900": "#14110F",
    "soil800": "#1E1A16",
    "soil700": "#2A241D",
    "ink900": "#1B1A17",
    "semantic": {
      "canvas": {
        "light": "#FBF8F1",
        "dark": "#14110F"
      },
      "surface": {
        "light": "#FFFFFF",
        "dark": "#1E1A16"
      },
      "sunken": {
        "light": "#F0E9D8",
        "dark": "#0F0D0B"
      },
      "ink": {
        "light": "#1B1A17",
        "dark": "#EDE6D6"
      },
      "inkMuted": {
        "light": "#5E5A51",
        "dark": "#A39C8D"
      },
      "line": {
        "light": "#E3DAC3",
        "dark": "#3A332A"
      },
      "primary": {
        "light": "#1F4D38",
        "dark": "#86B79B"
      },
      "onPrimary": {
        "light": "#FBF8F1",
        "dark": "#0F2A1E"
      },
      "primaryContainer": {
        "light": "#DCEBE2",
        "dark": "#1F4D38"
      },
      "accent": {
        "light": "#C39A3F",
        "dark": "#E2C77F"
      },
      "accentText": {
        "light": "#7A5C1D",
        "dark": "#E2C77F"
      },
      "success": {
        "light": "#2B6849",
        "dark": "#7FC29B"
      },
      "warning": {
        "light": "#9A6212",
        "dark": "#E0B15A"
      },
      "danger": {
        "light": "#B3382C",
        "dark": "#F08A7E"
      },
      "info": {
        "light": "#2F5A8A",
        "dark": "#9DB9DE"
      }
    },
    "season": {
      "rainy": {
        "light": "#3A8460",
        "dark": "#86B79B"
      },
      "transition": {
        "light": "#C39A3F",
        "dark": "#E2C77F"
      },
      "dry": {
        "light": "#B5653A",
        "dark": "#E0976F"
      }
    }
  },
  "font": {
    "display": "Fraunces",
    "ui": "Plus Jakarta Sans"
  },
  "space": {
    "0": 0,
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
    "10": 40,
    "12": 48,
    "16": 64,
    "20": 80,
    "30": 120
  },
  "radius": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 24,
    "full": 999
  },
  "motion": {
    "instant": 80,
    "fast": 150,
    "base": 250,
    "slow": 400,
    "slower": 700
  },
  "breakpoint": {
    "compact": 600,
    "medium": 840,
    "expanded": 1200,
    "large": 1600
  },
  "touchTarget": 48
} as const;

export type SemanticToken = keyof typeof tokens.color.semantic;
export type ThemeMode = 'light' | 'dark';
export type Season = 'rainy' | 'transition' | 'dry';

export function semanticColor(token: SemanticToken, mode: ThemeMode = 'light'): string {
  return tokens.color.semantic[token][mode];
}

export function seasonColor(season: Season, mode: ThemeMode = 'light'): string {
  return tokens.color.season[season][mode];
}
