import { createGlobalStyle } from "styled-components";
import { COLOR_TAN, COLOR_TEXT } from "./constants";

export default createGlobalStyle`
  body {
    background-color: ${COLOR_TAN.HEX};
    font-family: "Roboto",-apple-system,BlinkMacSystemFont,"Segoe UI","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    color: ${COLOR_TEXT.HEX};
  }
`;
