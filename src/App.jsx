import Hero from './Hero';
import Gallery from './Gallery';
import {portfolioItems} from './data';

const App = () => {
  return (
    <div className="container is-max-widescreen">
      <Hero />
      
      <Gallery items={portfolioItems} />
    </div>
  );
}

export default App;
