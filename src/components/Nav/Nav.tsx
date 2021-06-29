import { ReactComponent as GithubIcon } from "../../images/icons/brand-github.svg";
import { ReactComponent as LinkedinIcon } from "../../images/icons/brand-linkedin.svg";

import { Container, SocialLinksWrapper, SocialLink } from "./style";

const Nav = () => {
  return (
    <Container>
      <SocialLinksWrapper>
        <SocialLink
          href="https://github.com/arviantodwi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon height={24} />
        </SocialLink>

        <SocialLink
          href="https://www.linkedin.com/in/arviantodwi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon height={24} />
        </SocialLink>
      </SocialLinksWrapper>
    </Container>
  );
};

export default Nav;
