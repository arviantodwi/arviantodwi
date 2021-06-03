import SwiperCore, { Navigation } from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';

SwiperCore.use([Navigation]);

const GalleryItem = (props) => {
    const Slides = props.images.map((image, index) => {
        const imageSource = require(`${image}`);
        return (
            <SwiperSlide>
                <div className="image is-5by3"><img src={imageSource.default} alt="" /></div>
            </SwiperSlide>
        );
    });

    return (
        <div className="columns is-centered">
            <div className="column is-10">
                <div className="summary">
                    <h2 className="is-size-5 has-text-weight-bold">{props.title}</h2>
                    <p>{props.description}</p>
                </div>
                
                <Swiper navigation>
                    {Slides}
                </Swiper>
            </div>
        </div>
    );
}

export default GalleryItem;