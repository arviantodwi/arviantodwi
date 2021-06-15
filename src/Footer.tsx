import { AuthorUIData } from './@types/ui-data';

const currentYear = (): string => new Date().getFullYear().toString();

const Footer: React.FC<AuthorUIData> = props => {
  const { name, city, country } = props;

  return (
    <footer>
      {name && (
        <div data-testid="FooterAttribution">
          Designed and developed by {name}
        </div>
      )}
      <div className="line-2">
        <span data-testid="FooterYear">{currentYear()}</span>
        {'. '}
        <span data-testid="FooterCity">{city}</span>
        {', '}
        <span data-testid="FooterCountry">{country}</span>
      </div>
    </footer>
  );
};

export default Footer;
