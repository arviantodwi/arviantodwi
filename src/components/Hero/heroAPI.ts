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
    "https://s3.amazonaws.com/attachments.angel.co/5937021-9df25cfb16ec7a799970938aaa53f850.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJS6W3HGZGRJIRBTA%2F20210629%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20210629T064459Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=d065055de750bf277604ec2dd52802629c1f7e0f3a1ea6f2ba6d31608781993e",
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
