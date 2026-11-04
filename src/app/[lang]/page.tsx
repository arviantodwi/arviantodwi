import { notFound } from 'next/navigation';
import { About } from '../components/About';
import { AiWorkflow } from '../components/AiWorkflow';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Portfolio } from '../components/Portfolio';
import { TechStack } from '../components/TechStack';
import { Testimonial } from '../components/Testimonial';
import { getAvailability } from '../lib/availability';
import { getDictionary, hasLocale } from '../lib/i18n';

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const availability = getAvailability(dict.header.status);

  return (
    <main className="flex min-h-screen w-screen flex-col">
      <Header availability={availability} locale={lang} />
      {/* Body shell per the .pen responsive artboards: uniform rhythm
          between sections (72px at uSM per the 2026-11-01 adjustment, 40px
          from sm, 80px from lg, 120px at xl) and the same close before the
          footer (0/20/40/80/120). Padding-top clears the fixed topbar (its
          pre-collapse height per breakpoint). */}
      <div className="blurred-circle-accent bg-background flex flex-col gap-[72px] pt-[92px] pb-0 sm:gap-10 sm:pb-5 md:pt-[100px] md:pb-10 lg:gap-20 lg:pt-[108px] lg:pb-20 xl:gap-[120px] xl:pb-[120px]">
        <Hero dict={dict} availability={availability} />
        <About dict={dict} locale={lang} />
        <TechStack dict={dict} />
        <AiWorkflow dict={dict} />
        <Portfolio locale={lang} dict={dict} />
        <Testimonial dict={dict} />
      </div>
      <Footer dict={dict} locale={lang} />
    </main>
  );
}
