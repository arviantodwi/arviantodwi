import { defineGlobalStyles } from '@pandacss/dev';

export default defineGlobalStyles({
  'html, body': {
    width: '100%',
  },
  html: {
    height: 'auto',
    minHeight: '100%',
    '@media (prefers-color-scheme: dark)': {
      filter: 'invert(1)',
    },
  },
  body: {
    background: '#EED6C6 url(/bloom.png) no-repeat center / cover',
  },
});
