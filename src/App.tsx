import styled from "styled-components";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import { BP_WIDESCREEN } from "./app/constants";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media screen and (min-width: ${BP_WIDESCREEN}) {
    max-width: 1400px;
    padding-left: 16px;
    padding-right: 16px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -56px;
  position: relative;
  z-index: 1;

  @media screen and (min-width: 1025px) {
    flex-direction: row;
  }

  @media screen and (min-width: ${BP_WIDESCREEN}) {
    justify-content: center;
  }
`;

const App = () => {
  return (
    <Container>
      <Nav />
      <ContentContainer>
        <Hero />
        <Gallery />
      </ContentContainer>
      <Footer />
    </Container>
  );
};

export default App;
