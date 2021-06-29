import { useEffect, useState } from "react";

import GalleryItem from "../GalleryItem";
import { Portfolio, fetchPortfolioItems } from "./galleryAPI";

import { Container, Wrapper, Heading, PortfolioWrapper } from "./style";

const Gallery = () => {
  const [data, setData] = useState<Portfolio[]>([]);

  const galleryItems = data.map((item, i) => (
    <GalleryItem
      key={`galleryItem-${i}`}
      title={item.title}
      description={item.description}
      images={item.images}
    />
  ));

  useEffect(() => {
    // Get portfolio items data
    (async () => {
      const response = await fetchPortfolioItems();
      setData(response);
    })();
  }, []);

  return (
    <Container data-testid="Gallery">
      <Wrapper>
        <Heading>Portfolio</Heading>
        <PortfolioWrapper>{data.length > 0 && galleryItems}</PortfolioWrapper>
      </Wrapper>
    </Container>
  );
};

export default Gallery;
