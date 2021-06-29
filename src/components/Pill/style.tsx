import styled from "styled-components";

import { COLOR_BROWN, COLOR_TAN } from "../../app/constants";

export const Pill = styled.span`
  display: inline-block;
  background-color: ${COLOR_BROWN.HEX};
  padding: 8px 12px;
  border-radius: ${32 / 2}px;
  color: ${COLOR_TAN.HEX};
  font-weight: 400;
  font-size: ${14 / 16}rem;
  line-height: 16px;
  text-align: center;
`;
