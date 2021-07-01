import styled from "styled-components";
import { BP_WIDESCREEN, BP_DESKTOP } from "../../app/constants";

export const Container = styled.div`
  position: relative;
  background-color: #fbf5f1;

  @media screen and (min-width: 1025px) {
    max-width: calc(100vw - 500px);
    background-color: transparent;
  }

  @media screen and (min-width: ${BP_WIDESCREEN}) {
    width: calc(100% - 500px);
    max-width: 720px;
  }

  &::before {
    content: "Portfolio";
    z-index: 1;
    position: absolute;
    left: 8px;
    top: -72px;
    font-weight: 700;
    font-size: ${72 / 16}rem;
    color: rgba(61, 43, 35, 0.08);

    @media screen {
      @media (min-width: 576px) and (max-width: ${BP_DESKTOP}) {
        width: 100%;
        max-width: 720px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 32px 0 24px;
      }

      @media (min-width: 1025px) {
        position: absolute;
        top: 12px;
        left: 16px;
      }
    }
  }
`;

export const Wrapper = styled.div`
  position: relative;
  z-index: 2;
  padding: 40px 16px 24px;
  background-color: #fbf5f1;

  @media screen and (min-width: 576px) and (max-width: ${BP_DESKTOP}) {
    padding-left: 32px;
    padding-right: 32px;
    width: 100%;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
  }

  @media screen and (min-width: 1025px) {
    background-color: transparent;
  }
`;

export const Heading = styled.h2`
  font-weight: 700;
  font-size: ${48 / 16}rem;
  color: #705e4f;
  position: absolute;
  top: -42px;

  @media screen and (min-width: 1025px) {
    position: relative;
    top: unset;
  }
`;

export const PortfolioWrapper = styled.div`
  margin: 0 -16px;

  @media screen and (min-width: 1025px) {
    margin: 0;
  }
`;
