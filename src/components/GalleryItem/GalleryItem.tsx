import "swiper/swiper.scss";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/components/navigation/navigation.scss";

import {
  Container,
  Summary,
  Title,
  Description,
  TagsUnordered,
  TagsList,
  SlideShow,
  ImageWrapper,
} from "./style";

SwiperCore.use([Navigation]);

type Props = {
  title: string;
  description: string;
  images: string[];
  tags?: string[];
};

const GalleryItem: React.FC<Props> = ({ title, description, images, tags }) => {
  const slides = images.map((image, i) => {
    return (
      <SwiperSlide key={`slide-${i}`}>
        <ImageWrapper>
          <img src={image} alt="" />
        </ImageWrapper>
      </SwiperSlide>
    );
  });

  const tagsList = tags?.map((tag, i) => {
    return <TagsList key={`tag-${i}`}>{tag}</TagsList>;
  });

  return (
    <Container>
      <Summary>
        <Title>{title}</Title>
        <Description dangerouslySetInnerHTML={{ __html: description }} />
        {tags && <TagsUnordered>{tagsList}</TagsUnordered>}
      </Summary>

      <SlideShow as={Swiper} navigation>
        {slides}
      </SlideShow>
    </Container>
  );
};

export default GalleryItem;
