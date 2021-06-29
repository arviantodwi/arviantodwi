import { render, screen } from '@testing-library/react';

import Footer from './Footer';
import { author } from './data';

describe('test Footer component', () => {
  it('should renders Footer with attribution and without crashes', () => {
    render(<Footer {...author} />);

    const attribution = screen.getByTestId('FooterAttribution');
    expect(attribution).toBeInTheDocument();
    expect(attribution.textContent).toBe(
      `Designed and developed by ${author.name}`
    );

    const year = screen.getByTestId('FooterYear');
    const fullYear = new Date().getFullYear().toString();
    expect(year).toBeInTheDocument();
    expect(year.textContent).toBe(fullYear);

    const city = screen.getByTestId('FooterCity');
    expect(city).toBeInTheDocument();
    expect(city.textContent).toBe(author.city);

    const country = screen.getByTestId('FooterCountry');
    expect(country).toBeInTheDocument();
    expect(country.textContent).toBe(author.country);
  });
});
