import GalleryItem from './GalleryItem';
import { PortfolioUIData } from './@types/ui-data';

const Gallery: React.FC<{ items: PortfolioUIData[] }> = props => {
  const { items } = props;

  const GalleryItems = items.map((item, index) => (
    <GalleryItem
      key={`galleryItem-${index}`}
      title={item.title}
      description={item.description}
      images={item.images}
    />
  ));

  return (
    <section className="gallery" data-testid="Gallery">
      {GalleryItems}
    </section>
  );
};

export default Gallery;
