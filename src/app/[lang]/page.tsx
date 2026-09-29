import { notFound } from 'next/navigation';
import { About } from '../components/About';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Portfolio } from '../components/Portfolio';
import { TechStack } from '../components/TechStack';
import { Testimonial } from '../components/Testimonial';
import { getDictionary, hasLocale } from '../libs/i18n';

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <main className="flex min-h-screen w-screen flex-col">
      <div className="blurred-circle-accent bg-background">
        <Header dict={dict} locale={lang} />
        <Hero dict={dict} />
        <About dict={dict} />
        <TechStack dict={dict} />
        <Portfolio dict={dict} />
        <Testimonial dict={dict} />
      </div>
      <Footer dict={dict} />
    </main>
  );
}
