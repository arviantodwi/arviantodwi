export type Hero = {
  intro: string;
  bio: string;
  about: string;
  resume_link: string;
  skills: string[];
};

const data: Hero = {
  intro: "Hi, I'm Arvi from Indonesia 🇮🇩",
  bio: "JavaScript Front End engineer with UI background.",
  about:
    "I’m on my way to grow my career in Front End Engineering after successfully worked as a UI Designer for about 8 years. Excited to learn new things like cloud architecture, latest best practice of Software Engineering, and recent start-up culture.",
  resume_link:
    "https://www.dropbox.com/s/1nx3thy81ihg2bp/Arvianto_Dwi_-_Front_End_Engineer.pdf?dl=0",
  skills: [
    "JavaScript / TypeScript",
    "React.js",
    "Redux",
    "HTML+CSS",
    "Styled Components",
    "Bootstrap / Bulma / Tailwind",
    "PHP",
    "Laravel",
    "Python",
    "MySQL",
    "REST",
    "Git",
    "Jest",
    "CI/CD",
    "UI",
    "Figma",
  ],
};

export const fetchHeroContent = () => {
  return new Promise<Hero>((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
};
