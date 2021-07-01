import styled from "styled-components";
import { BP_WIDESCREEN } from "../../app/constants";

export const Container = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 12px 16px;
  position: relative;
  z-index: 2;

  @media screen and (min-width: 1025px) {
    width: 50%;
    max-width: 500px;
    position: sticky;
    top: 0;
  }

  @media screen and (min-width: ${BP_WIDESCREEN}) {
    width: 1220px;
    max-width: unset;
    justify-content: flex-start;
    margin-left: auto;
    margin-right: auto;
    padding-left: 0;
    padding-right: 0;
  }
`;

export const SocialLinksWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;

  @media screen and (min-width: ${BP_WIDESCREEN}) {
    width: 500px;
    justify-content: flex-end;
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const SocialLink = styled.a`
  display: inline-flex;
  margin: 0 8px;
`;
