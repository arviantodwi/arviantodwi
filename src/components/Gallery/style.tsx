import styled from "styled-components";

export const Container = styled.div`
  position: relative;

  &::before {
    content: 'Portfolio';
    z-index: 1;
    position: absolute;
    left: 8px;
    top: -72px;
    font-weight: 700;
    font-size: ${72 / 16}rem;
    color: rgba(61, 43, 35, 0.08);
`;

export const Wrapper = styled.div`
  position: relative;
  z-index: 2;
  background-color: #fbf5f1;
  padding: 40px 16px 24px;
`;

export const Heading = styled.h2`
  font-weight: 700;
  font-size: ${48 / 16}rem;
  color: #705e4f;
  position: absolute;
  top: -42px;
`;

export const PortfolioWrapper = styled.div`
  margin: 0 -16px;
`;
