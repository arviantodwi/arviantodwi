import Hero from './Hero';
import Gallery from './Gallery';
import { contents, portfolio } from './data';

const App = () => {
  return (
    <div className="container is-max-widescreen">
      <Hero {...contents.hero} />

      <Gallery items={portfolio} />
    </div>
  );
};

export default App;
