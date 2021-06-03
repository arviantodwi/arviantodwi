import GalleryItem from './GalleryItem'

const Gallery = (props) => {
    const GalleryItems = props.items.map((item, index) => <GalleryItem key={index} title={item.title} description={item.description} images={item.images} />);

    return (
        <section className="gallery">
            {GalleryItems}
        </section>
    );
}

export default Gallery;
