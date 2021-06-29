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
  images: string[];
};

const data: Portfolio[] = [
  {
    title: "Rlly iOS App UI",
    description: "",
    images: [rlly01, rlly02, rlly03],
  },
  {
    title: "Haulex Mobile Web App UI",
    description: "",
    images: [haulex],
  },
  {
    title: "Movie Tinder iOS App UI",
    description: "",
    images: [movie01, movie02],
  },
  {
    title: "Devstimate Landing Page UI",
    description: "",
    images: [devs01, devs02],
  },
  {
    title: "Fulo ElementaryOS App",
    description: "",
    images: [fulo],
  },
  {
    title: "Voice Pitch Analyzer",
    description: "",
    images: [vpa01, vpa02, vpa03],
  },
];

export const fetchPortfolioItems = () => {
  return new Promise<Portfolio[]>((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
};
