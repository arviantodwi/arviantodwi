import { About } from './components/About';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { TechStack } from './components/TechStack';
import { Testimonial } from './components/Testimonial';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col">
      <div className="blurred-circle-accent bg-background">
        <Header />
        <Hero />
        <About />
        <TechStack />
        <Portfolio />
        <Testimonial />
      </div>
      <Footer />
    </main>
  );
}
