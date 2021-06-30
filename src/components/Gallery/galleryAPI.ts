import devs01 from "../../images/portfolio/devs-2020-01.jpg";
import devs02 from "../../images/portfolio/devs-2020-02.jpg";
import fulo from "../../images/portfolio/fulo-2020-01.jpg";
import haulex from "../../images/portfolio/haulex-2021-01.jpg";
import movie01 from "../../images/portfolio/movie-2020-01.jpg";
import movie02 from "../../images/portfolio/movie-2020-02.jpg";
import rlly01 from "../../images/portfolio/rlly-2021-01.jpg";
import rlly02 from "../../images/portfolio/rlly-2021-02.jpg";
import rlly03 from "../../images/portfolio/rlly-2021-03.jpg";
import vpa01 from "../../images/portfolio/vpa-2020-01.jpg";
import vpa02 from "../../images/portfolio/vpa-2020-02.jpg";
import vpa03 from "../../images/portfolio/vpa-2020-03.jpg";

export type Portfolio = {
  title: string;
  description: string;
  tags?: string[];
  images: string[];
};

const data: Portfolio[] = [
  {
    title: "RLLY: Auto En Wandelrally",
    description:
      "RLLY is a navigation-based game to explore many points of interest in Netherland. You may play as a soloist or with your group, and compete with the others for a position in leaderboard.",
    tags: ["iOS", "UI", "Gamified"],
    images: [rlly01, rlly02, rlly03],
  },
  {
    title: "HaulEx Tracking System",
    description:
      "HaulEx is a company that provides car hauling service. I redesigned the vehicles delivery tracker feature as part of Freelancer contest entry.",
    tags: ["Mobile Web", "UI"],
    images: [haulex],
  },
  {
    title: "Movie Matcher App Concept",
    description:
      "UI design for a concept of movie matcher app. The idea is an app that works like Tinder but for movie lovers who like to find and watch movies together with their partner. I collaborated with <a href='https://www.davidseek.com' target='_blank' rel='noopener noreferer'>David Seek</a> on this project.",
    tags: ["iOS", "App Concept", "UI"],
    images: [movie01, movie02],
  },
  {
    title: "Devstimate Landing Page",
    description:
      "A work in progress web app. This app will help users on estimating the development cost of their new app project.",
    tags: ["Web", "WIP"],
    images: [devs01, devs02],
  },
  {
    title: "Fulo Color Picker",
    description:
      "Fulo is a native ElementaryOS app built using Vala, GTK, and CSS.",
    tags: ["ElementaryOS App"],
    images: [fulo],
  },
  {
    title: "VoicePitchAnalyzer",
    description:
      "An iOS app to measure, calculate, and track the voice pitch changes. This app was developed for LGBTQ community so they could practice and improve their voice. Another project with <a href='https://www.davidseek.com' target='_blank' rel='noopener noreferer'>David Seek</a>.",
    tags: ["iOS", "UI", "Trending"],
    images: [vpa01, vpa02, vpa03],
  },
];

export const fetchPortfolioItems = () => {
  return new Promise<Portfolio[]>((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
};
