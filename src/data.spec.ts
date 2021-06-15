import data from './data';

describe('data check', () => {
  test('author data', () => {
    const author = Object.assign({}, data.author);
    expect(author).toHaveProperty('name', expect.any(String));
    expect(author).toHaveProperty('city', expect.any(String));
    expect(author).toHaveProperty('country', expect.any(String));
  });

  test('contents data', () => {
    const contents = Object.assign({}, data.contents);
    expect(contents).toMatchObject({
      hero: expect.any(Object),
    });
    expect(contents).toHaveProperty('hero.intro', expect.any(String));
    expect(contents).toHaveProperty('hero.bio', expect.any(String));
    expect(contents).toHaveProperty('hero.about', expect.any(String));
  });

  test('portfolio data', () => {
    const portfolio = [...data.portfolio];
    expect(portfolio).toBeInstanceOf(Array);

    for (let i = 0; i < portfolio.length; i += 1) {
      expect(portfolio[i]).toHaveProperty('title', expect.any(String));
      expect(portfolio[i]).toHaveProperty('description', expect.any(String));
      expect(portfolio[i]).toHaveProperty('images', expect.any(Array));

      for (let j = 0; j < portfolio[i].images.length; j += 1) {
        const imagePath = portfolio[i].images[j];
        expect(typeof imagePath).toBe('string');
        expect(imagePath).toMatch(/.*\.(jpe?g|png|gif)$/i);
      }
    }
  });
});
