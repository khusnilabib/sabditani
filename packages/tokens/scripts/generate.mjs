import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const repo = resolve(root, '../..');
const tokens = JSON.parse(readFileSync(resolve(root, 'tokens.json'), 'utf8'));

const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log('generated', path.replace(repo + '/', ''));
};

/* ---------- TypeScript ---------- */
const ts = `// AUTO-GENERATED from tokens.json — do not edit.\nexport const tokens = ${JSON.stringify(tokens, null, 2)} as const;\n\nexport type SemanticToken = keyof typeof tokens.color.semantic;\nexport type ThemeMode = 'light' | 'dark';\nexport type Season = 'rainy' | 'transition' | 'dry';\n\nexport function semanticColor(token: SemanticToken, mode: ThemeMode = 'light'): string {\n  return tokens.color.semantic[token][mode];\n}\n\nexport function seasonColor(season: Season, mode: ThemeMode = 'light'): string {\n  return tokens.color.season[season][mode];\n}\n`;
write(resolve(root, 'src/index.ts'), ts);

/* ---------- CSS ---------- */
const sem = tokens.color.semantic;
const seasons = tokens.color.season;
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const cssVars = (obj, prefix) =>
  Object.entries(obj)
    .map(([key, value]) => `  --${prefix}${kebab(key)}: ${typeof value === 'string' ? value : value.light};`)
    .join('\n');
const cssDark = (obj, prefix) =>
  Object.entries(obj)
    .map(([key, value]) => `  --${prefix}${kebab(key)}: ${value.dark};`)
    .join('\n');

const brandVars = Object.entries(tokens.brand)
  .map(([k, v]) => `  --brand-${kebab(k)}: ${v};`)
  .join('\n');
const rawVars = Object.entries(tokens.color)
  .filter(([, v]) => typeof v === 'string')
  .map(([k, v]) => `  --${kebab(k)}: ${v};`)
  .join('\n');
const scaleVars = [
  ...Object.entries(tokens.space).map(([k, v]) => `  --space-${k}: ${v}px;`),
  ...Object.entries(tokens.radius).map(([k, v]) => `  --radius-${k}: ${v === 999 ? '999px' : v + 'px'};`),
  ...Object.entries(tokens.motion).map(([k, v]) => `  --motion-${k}: ${v}ms;`),
  `  --font-display: '${tokens.font.display}', Georgia, serif;`,
  `  --font-ui: '${tokens.font.ui}', system-ui, sans-serif;`,
  `  --touch-target: ${tokens.touchTarget}px;`
].join('\n');

const css = `/* AUTO-GENERATED from tokens.json — do not edit. */\n:root {\n${rawVars}\n${brandVars}\n${cssVars(sem, '')}\n${cssVars(seasons, 'season-')}\n${scaleVars}\n  color-scheme: light;\n}\n\n[data-theme='dark'] {\n  color-scheme: dark;\n${cssDark(sem, '')}\n${cssDark(seasons, 'season-')}\n}\n\n[data-season='rainy'] { --season-accent: var(--season-rainy); }\n[data-season='transition'] { --season-accent: var(--season-transition); }\n[data-season='dry'] { --season-accent: var(--season-dry); }\n`;
write(resolve(root, 'dist/tokens.css'), css);
write(resolve(repo, 'apps/web/styles/tokens.css'), css);

/* ---------- React Native theme ---------- */
const rn = `// AUTO-GENERATED from tokens.json — do not edit.\nimport { tokens } from '@sabditani/tokens';\n\nexport const lightColors = Object.fromEntries(\n  Object.entries(tokens.color.semantic).map(([k, v]) => [k, v.light])\n) as Record<keyof typeof tokens.color.semantic, string>;\n\nexport const darkColors = Object.fromEntries(\n  Object.entries(tokens.color.semantic).map(([k, v]) => [k, v.dark])\n) as Record<keyof typeof tokens.color.semantic, string>;\n\nexport function seasonAccent(season: 'rainy' | 'transition' | 'dry', dark = false) {\n  return tokens.color.season[season][dark ? 'dark' : 'light'];\n}\n\nexport const spacing = tokens.space;\nexport const radius = tokens.radius;\nexport const motion = tokens.motion;\nexport const brand = tokens.brand;\n\nexport const theme = {\n  light: {\n    dark: false,\n    colors: { ...lightColors, season: seasonAccent('transition') },\n  },\n  dark: {\n    dark: true,\n    colors: { ...darkColors, season: seasonAccent('transition', true) },\n  },\n};\n\nexport type AppTheme = (typeof theme)['light'] | (typeof theme)['dark'];\n`;
write(resolve(repo, 'apps/admin/src/theme.ts'), rn);

console.log('SABDITANI tokens generated.');
