// @ts-expect-error - Vite CSS URL import
import appCss from '~/styles/app.css?url';

const DESCRIPTION = `Make something cool. `;
const TITLE = 'Artefact.sh - starter template';
const KEY_WORDS = '';

export const SEO_META_HEADERS = [
  { charSet: 'utf-8' },
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1',
  },
  { title: TITLE },
  { name: 'description', content: DESCRIPTION },
  { name: 'keywords', content: KEY_WORDS },
  { name: 'twitter:title', content: TITLE },
  { name: 'twitter:description', content: DESCRIPTION },
  { name: 'twitter:creator', content: '@divsoupio' },
  { name: 'twitter:site', content: '@divsoupio' },
  { name: 'og:type', content: 'website' },
  { name: 'og:title', content: TITLE },
  { name: 'og:description', content: DESCRIPTION },
  // { name: 'twitter:image', content: image },
  // { name: 'twitter:card', content: 'summary_large_image' },
  // { name: 'og:image', content: image },
];

export const SEO_LINKS = [
  { rel: 'stylesheet', href: appCss },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/apple-touch-icon.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png',
  },
  { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
  { rel: 'icon', href: '/favicon.ico' },
];
