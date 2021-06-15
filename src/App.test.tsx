// import { render, screen } from '@testing-library/react';
// import React from 'react';
import { render, screen } from '@testing-library/react';
// import { container } from './setupTests';
import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

describe('test App', () => {
  it('renders without crashes', () => {
    render(<App />);
  });
});
