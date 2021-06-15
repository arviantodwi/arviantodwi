import { AuthorUIData, CustomUIData, PortfolioUIData } from './@types/ui-data';

export const author: AuthorUIData = {
  name: 'Arvianto Dwi',
  city: 'Bandung',
  country: 'Indonesia 🇮🇩',
};

export const contents: CustomUIData = {
  hero: {
    intro: "Hi, I'm Arvi from Indonesia 🇮🇩",
    bio: 'Javascript Front End engineer with UI background.',
    about:
      'I’m on my way to grow my career in Front End Engineering after successfully worked as a UI Designer for about 8 years. Excited to learn new things like cloud architecture, latest best practice of Software Engineering, and recent start-up culture.',
  },
};

export const portfolio: PortfolioUIData[] = [
  {
    title: 'Rlly iOS App UI',
    description: '',
    images: [
      './images/rlly-2021-01.jpg',
      './images/rlly-2021-02.jpg',
      './images/rlly-2021-03.jpg',
    ],
  },
  {
    title: 'Haulex Mobile Web App UI',
    description: '',
    images: ['./images/haulex-2021-01.jpg'],
  },
  {
    title: 'Movie Tinder iOS App UI',
    description: '',
    images: ['./images/movie-2020-01.jpg', './images/movie-2020-02.jpg'],
  },
  {
    title: 'Devstimate Landing Page UI',
    description: '',
    images: ['./images/devs-2020-01.jpg', './images/devs-2020-02.jpg'],
  },
  {
    title: 'Fulo ElementaryOS App',
    description: '',
    images: ['./images/fulo-2020-01.jpg'],
  },
  {
    title: 'Voice Pitch Analyzer',
    description: '',
    images: [
      './images/vpa-2020-01.jpg',
      './images/vpa-2020-02.jpg',
      './images/vpa-2020-03.jpg',
    ],
  },
];

export default {
  author,
  contents,
  portfolio,
};
