import { Container, AttributionLine } from "./style";

const currentYear = (): string => new Date().getFullYear().toString();

const Footer = () => {
  return (
    <Container>
      <AttributionLine data-testid="FooterAttribution">
        <span>Designed and developed by Arvianto Dwi. </span>
        <br />
        <span>
          <strong>{currentYear()}. Bandung, Indonesia 🇮🇩</strong>
        </span>
      </AttributionLine>
    </Container>
  );
};

export default Footer;
