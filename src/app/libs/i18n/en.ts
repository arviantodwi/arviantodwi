import type { Dictionary } from './types';

export const enDictionary: Dictionary = {
  metadata: {
    description:
      'Top-rated UI and front-end developer known for pixel-perfect design, clean code, creative vision, and outstanding collaboration. Trusted by teams and project managers for delivering high-quality, eye-catching interfaces that elevate user experience.',
    ogLocale: 'en_US',
  },
  header: {
    status: {
      available: 'Available for hire',
      open: 'Open to offers',
      unavailable: 'Closed to offers',
    },
  },
  hero: {
    rolePrefix: 'Front End Developer &',
    roles: ['TypeScript Enthusiast', 'Wizard of Screens', 'Intraday Trader', 'Humorous Dad'],
    location: 'Yogyakarta, Indonesia',
    stats: {
      projects: { short: 'Projects done', long: 'Projects done' },
      tools: { short: 'Dev tools', long: 'Developer tools' },
      years: { short: 'Years of exp.', long: 'Years of experience' },
    },
    photoAlt: "Arvianto's photo",
  },
  about: {
    headline: ['Hi, guest.', 'Nice to meet you!'],
    bio: [
      [
        { text: "I'm a software developer currently seeking a new adventure in my next role. " },
        { text: 'I specialize in Front End development and bring over ' },
        { text: '12+ years of experience', tone: 'strong' },
        {
          text: ' in the tech industry; 8 years as UI Designer and 6 years as Front End Developer.',
        },
      ],
      [
        {
          text: 'I primarily work remotely at my home in Indonesia, which has enabled me to build a strong portfolio of ',
        },
        {
          text: '50+ projects with clients/companies around the world',
          tone: 'strong',
        },
        { text: '. ' },
        {
          text: "Outside of work, I'm a full-time dad and husband, and also an intraday trader on commodity market.",
        },
      ],
    ],
  },
  techStack: {
    heading: [
      { text: 'I build ' },
      { text: 'awesome', tone: 'goldUnderline' },
      { text: ' experiences on the internet!' },
    ],
    subline: [
      { text: 'Minimalism will always be my core, and I leverage ' },
      { text: '32+ tools', tone: 'gold' },
      { text: ' and technologies to achieve exceptional day-to-day results.' },
    ],
  },
  portfolio: {
    heading: [{ text: 'Take a look at my ' }, { text: 'past projects!', tone: 'goldUnderline' }],
    subline: [
      { text: 'Selected amidst ' },
      { text: '100+ projects', tone: 'gold' },
      { text: ' delivered!' },
    ],
  },
  testimonial: {
    heading: [
      { text: 'Read what clients & peers say about ' },
      { text: 'my work!', tone: 'goldUnderline' },
    ],
    testimonies: [
      {
        photo: '/people/profile_logo_24449541.jpg.webp',
        name: 'David Seek',
        title: 'Senior SDE at Amazon',
        quotes: [
          {
            text: 'Arvi is the most talented designer I have ever seen. I have now worked with him on several projects and he ',
          },
          {
            text: ' constantly grows with the requirements. He has the eye for the detail and he is pixel perfect.',
            tone: 'gold',
          },
          {
            text: ' The UI is 50% of what makes an App great and Arvi is able to completely satisfy the need for an amazing UI.',
          },
        ],
      },
      {
        photo: '/people/1744129672250.jpeg',
        name: 'Lucas Brancher',
        title: 'Core UI/UX Designer at Automata Network',
        quotes: [
          {
            text: 'Throughout the years, I had the pleasure of working with Arvianto,',
            tone: 'gold',
          },
          {
            text: ' and the joy of sharing my designs, ideas, and concepts with someone who really cared a lot about it all, always giving his best to achieve maximum quality of the final product!',
          },
        ],
      },
      {
        photo: '/people/1516639420540.jpeg',
        name: 'Putra R. Mahardhika',
        title: 'Blockchain & Web3 Analyst',
        quotes: [
          { text: 'Expert on UI/UX with well managed code. Work fast, ' },
          {
            text: 'listen well in the team and always has good ideas to improve the works.',
            tone: 'gold',
          },
        ],
      },
      {
        photo: '/people/1624592440235.jpeg',
        name: 'Nasir Iqbal',
        title: 'System Engineer at ICT Innovations',
        quotes: [
          {
            text: 'Exceptional! Creativity, design, vision or understanding Arvianto is outstanding in any way! ',
          },
          { text: "I rate him as 'A Class' developer.", tone: 'gold' },
          {
            text: ' Being a project manager I wish to have such a gem in my team. For quality work I highly recommend him.',
          },
        ],
      },
      {
        photo: '/people/1656478335697.jpeg',
        name: 'Irsam S. Gana',
        title: 'Senior System Analyst at Agronum Tech',
        quotes: [{ text: 'Interesting and eye catching UI design!' }],
      },
      {
        photo: '/people/1740735553903.jpeg',
        name: 'Gustavo Costa',
        title: 'Senior Consultant at Clancys Sports',
        quotes: [
          { text: 'Arvi is ' },
          { text: 'one of the best freelancers I have ever worked with.', tone: 'gold' },
          {
            text: ' He did an awesome job, as usual. Will keep working with him in my next projects.',
          },
        ],
      },
      {
        photo: '/people/profile_logo_9172955.jpg.webp',
        name: 'Steven M. Carlson',
        title: 'Co-Founder at AutoCorner',
        quotes: [
          { text: 'Amazing work. Great programmer. ' },
          { text: 'Very hard worker!', tone: 'gold' },
          { text: ' I WILL HIRE AGAIN!' },
        ],
      },
      {
        photo: '/people/profile_logo_32764036.jpg.webp',
        name: 'Theo Hannisse',
        title: 'Founder at RLLY NaviGames',
        quotes: [{ text: 'Great to work with. Creative worker.' }],
      },
    ],
  },
  footer: {
    copyright: 'Trademarks and brands are the property of their respective owners. Designed in collaboration with <link>Lucas Brancher</link> 🇧🇷 in 2025.',
  },
};
