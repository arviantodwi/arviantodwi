import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
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
  SlideNavButton,
} from "./style";

type Props = {
  title: string;
  description: string;
  images: string[];
  tags?: string[];
};

const GalleryItem: React.FC<Props> = ({ title, description, images, tags }) => {
  const allowTouchMove = images.length > 1;
  const [swiper, setSwiper] = useState(null);
  const [prevNavButtonDisabled, setPrevNavButtonDisabled] = useState(true);
  const [nextNavButtonDisabled, setNextNavButtonDisabled] = useState(false);

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

  const handleSlideChange = (instance: any) => {
    const { isBeginning, isEnd } = instance;
    if (!isBeginning) {
      setPrevNavButtonDisabled(false);
    }
    if (!isEnd) {
      setNextNavButtonDisabled(false);
    }
  };

  const handleSlideNavButtonClick = (instance: any, target: string) => {
    return target === "prev" ? instance.slidePrev() : instance.slideNext();
  };

  return (
    <Container>
      <Summary>
        <Title>{title}</Title>
        <Description dangerouslySetInnerHTML={{ __html: description }} />
        {tags && <TagsUnordered>{tagsList}</TagsUnordered>}
      </Summary>

      <SlideShow
        as={Swiper}
        allowTouchMove={allowTouchMove}
        onSwiper={(instance: any) => setSwiper(instance)}
        onReachBeginning={() => setPrevNavButtonDisabled(true)}
        onReachEnd={() => setNextNavButtonDisabled(true)}
        onSlideChange={() => handleSlideChange(swiper)}
      >
        {slides}
        {allowTouchMove && (
          <>
            <SlideNavButton
              target="prev"
              disabled={prevNavButtonDisabled}
              onClick={() => handleSlideNavButtonClick(swiper, "prev")}
            />
            <SlideNavButton
              target="next"
              disabled={nextNavButtonDisabled}
              onClick={() => handleSlideNavButtonClick(swiper, "next")}
            />
          </>
        )}
      </SlideShow>
    </Container>
  );
};

export default GalleryItem;
