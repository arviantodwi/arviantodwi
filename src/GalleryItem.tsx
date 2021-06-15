import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import { PortfolioUIData } from './@types/ui-data';

SwiperCore.use([Navigation]);

const GalleryItem: React.FC<PortfolioUIData> = props => {
  const { title, description, images } = props;

  const Slides = images.map((image, index) => {
    const imageSource = require(`${image}`);
    return (
      <SwiperSlide key={`slide-${index}`}>
        <div className="image is-5by3">
          <img src={imageSource.default} alt="" />
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
