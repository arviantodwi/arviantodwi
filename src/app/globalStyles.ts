import { createGlobalStyle } from "styled-components";
import { COLOR_TAN } from "./constants";

export default createGlobalStyle`
  body {
    background-color: ${COLOR_TAN.HEX};
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
  }
`;
