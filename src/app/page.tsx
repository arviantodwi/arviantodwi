import { css } from '../../styled-system/css';

/**
 * Main component
 */
export default function Home() {
  return (
    <main className={container}>
      <h1 className={heading}>
        New website coming soon! <span className={rocketScience}>🚀</span>
      </h1>
    </main>
  );
}

/**
 * CSS
 */
const container = css({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  placeContent: 'center',
  placeItems: 'center',
});

const heading = css({
  color: '#e65548',
  fontSize: '5xl',
  fontWeight: 700,
  textAlign: 'center',
  paddingInline: '1.25rem',
});

const rocketScience = css({
  '@media (prefers-color-scheme: dark)': {
    filter: 'invert(1)',
  },
});
