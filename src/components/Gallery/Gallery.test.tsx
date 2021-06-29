import { render, screen } from '@testing-library/react';

import Gallery from './Gallery';
import { portfolio } from './data';

describe('test Gallery component', () => {
  it('should wrap GalleryItem component and render it without crashes', () => {
    const items = [{ ...portfolio[0] }, { ...portfolio[1] }];
    render(<Gallery items={items} />);

    const gallery = screen.getByTestId('Gallery');
    expect(gallery).toBeInTheDocument();
    expect(gallery.children).toHaveLength(2);
  });
});
