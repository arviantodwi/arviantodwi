import { CustomUIData } from './@types/ui-data';

const Hero: React.FC<CustomUIData> = props => {
  const { intro, bio, about } = props;

  return (
    <section className="hero has-text-centered">
      <article>
        <div className="columns is-centered">
          <div className="column is-5">
            <h1 data-testid="HeroLine1">{intro}</h1>
          </div>
        </div>

        <div className="columns is-centered">
          <div className="column is-6">
            <p
              data-testid="HeroLine2"
              className="is-size-1 has-text-weight-bold"
            >
              {bio}
            </p>
          </div>
        </div>

        <div className="columns is-centered">
          <div className="column is-8">
            <p data-testid="HeroLine3">{about}</p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default Hero;
