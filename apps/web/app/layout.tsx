import type { Metadata } from 'next';
import '@fontsource/fraunces/latin-500.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/fraunces/latin-500-italic.css';
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '../styles/tokens.css';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { site } from '@sabditani/core';

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ['/brand/logo-wordmark.png'],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

const themeScript = `
(function(){
  try {
    var saved = localStorage.getItem('sd-theme');
    var dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    var season = localStorage.getItem('sd-season') || 'transition';
    document.documentElement.setAttribute('data-season', season);
    var scale = parseFloat(localStorage.getItem('sd-font-scale') || '1');
    if (scale && scale !== 1) document.documentElement.style.fontSize = (scale * 100) + '%';
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" href="/brand/logo-icon-transparent.png" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
