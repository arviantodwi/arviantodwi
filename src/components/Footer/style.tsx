import styled from "styled-components";
import { BP_DESKTOP, BP_WIDESCREEN, COLOR_TEXT } from "../../app/constants";

export const Container = styled.footer`
  padding: 24px 16px;

  @media screen and (min-width: 576px) and (max-width: ${BP_DESKTOP}) {
    padding-left: 32px;
    padding-right: 32px;
    width: 100%;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
  }

  @media screen and (min-width: ${BP_WIDESCREEN}) {
    width: 1220px;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const AttributionLine = styled.div`
  font-size: ${14 / 16}rem;
  font-weight: 400;
  line-height: ${21 / 16}rem;
  color: ${COLOR_TEXT.HEX};
`;
