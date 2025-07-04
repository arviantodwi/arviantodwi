import { FC } from 'react';

export const About: FC = () => {
  return (
    <section className="relative z-10 -mt-[240px] mb-20 px-6">
      <article className="flex flex-col gap-10 font-general">
        <div className="about-box-accent relative pt-[51px] text-4xl font-bold">
          <p className="relative z-[2]">Hi, guest.</p>
          <p className="relative z-[2]">Nice to meet you!</p>
        </div>
        <div className="leading-[1.4375]">
          <p className="mb-[23px]">
            <span className="opacity-75">
              I&apos;m a software developer currently seeking a new adventure in my next role. I
              specialize in Front End development and bring over
            </span>{' '}
            <strong>12+ years of experience</strong>{' '}
            <span className="opacity-75">
              in the industry; 8 years as UI Designer and 4 years as Front End Developer.
            </span>
          </p>
          <p>
            <span className="opacity-75">
              I primarily work remotely at my home in Indonesia, which has enabled me to build a
              strong portfolio of
            </span>{' '}
            <strong>50+ projects with clients/companies around the world</strong>.{' '}
            <span className="opacity-75">
              Outside of work, I&apos;m a full-time dad and husband, and also crypto day-trader.
            </span>
          </p>
        </div>
      </article>
    </section>
  );
};
