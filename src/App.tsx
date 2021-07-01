import styled from "styled-components";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -56px;
  position: relative;
  z-index: 1;
`;

const App = () => {
  return (
    <>
      <Nav />
      <ContentContainer>
        <Hero />
        <Gallery />
      </ContentContainer>
      <Footer />
    </>
  );
};

export default App;
