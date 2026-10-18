import { notFound } from 'next/navigation';
import { About } from '../components/About';
import { AiWorkflow } from '../components/AiWorkflow';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Portfolio } from '../components/Portfolio';
import { TechStack } from '../components/TechStack';
import { Testimonial } from '../components/Testimonial';
import { getDictionary, hasLocale } from '../lib/i18n';

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <main className="flex min-h-screen w-screen flex-col">
      {/* Body shell per the Figma Main artboard: uniform rhythm between
          sections (80px mobile, 120px from lg up) and a 120px close before
          the footer. Padding-top clears the fixed topbar (its pre-collapse
          height per breakpoint). */}
      <div className="blurred-circle-accent flex flex-col gap-20 bg-background pt-[92px] pb-20 md:pt-[100px] lg:gap-[120px] lg:pb-[120px] xl:pt-[108px]">
        <Header dict={dict} locale={lang} />
        <Hero dict={dict} />
        <About dict={dict} />
        <TechStack dict={dict} />
        <AiWorkflow dict={dict} />
        <Portfolio locale={lang} dict={dict} />
        <Testimonial dict={dict} />
      </div>
      <Footer dict={dict} locale={lang} />
    </main>
  );
}
