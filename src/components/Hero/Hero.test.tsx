import { render, screen } from '@testing-library/react';

import Hero from './Hero';
// import { contents } from './data';

describe('test Hero component', () => {
  it('should print data to screen', () => {
    // render(<Hero {...contents.hero} />);

    const intro = screen.getByTestId('HeroLine1');
    expect(intro).toBeInTheDocument();
    // expect(intro.textContent).toBe(contents.hero.intro);

    const bio = screen.getByTestId('HeroLine2');
    expect(bio).toBeInTheDocument();
    // expect(bio.textContent).toBe(contents.hero.bio);

    const about = screen.getByTestId('HeroLine3');
    expect(about).toBeInTheDocument();
    // expect(about.textContent).toBe(contents.hero.about);
  });
});
