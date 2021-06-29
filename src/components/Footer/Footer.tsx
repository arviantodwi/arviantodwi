const currentYear = (): string => new Date().getFullYear().toString();

const Footer = () => {
  return (
    <footer>
      <div data-testid="FooterAttribution">
        Designed and developed by Arvianto Dwi
      </div>
      <div className="line-2">
        <span data-testid="FooterYear">{currentYear()}</span>
        {". "}
        <span data-testid="FooterCity">Bandung</span>
        {", "}
        <span data-testid="FooterCountry">Indonesia 🇮🇩</span>
      </div>
    </footer>
  );
};

export default Footer;
