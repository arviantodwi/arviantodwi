import "swiper/swiper.scss";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/components/navigation/navigation.scss";

SwiperCore.use([Navigation]);

type Props = {
  title: string;
  description: string;
  images: string[];
};

const GalleryItem: React.FC<Props> = ({ title, description, images }) => {
  const Slides = images.map((image, index) => {
    return (
      <SwiperSlide key={`slide-${index}`}>
        <div className="image is-5by3">
          <img src={image} alt="" />
        </div>
      </SwiperSlide>
    );
  });

  return (
    <div className="columns is-centered">
      <div className="column is-10">
        <div className="summary">
          <h2 className="is-size-5 has-text-weight-bold">{title}</h2>
          <p>{description}</p>
        </div>

        <Swiper navigation>{Slides}</Swiper>
      </div>
    </div>
  );
};

export default GalleryItem;
