import styled from "styled-components";
import {
  COLOR_TEXT,
  COLOR_TEXT_STRONG,
  COLOR_TOMATO,
} from "../../app/constants";

export const Container = styled.div`
  padding: 24px 16px;

  &:first-child {
    padding-top: 8px;
  }
  &:last-child {
    padding-bottom: 0px;
  }
`;

export const Summary = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-weight: 700;
  font-size: ${24 / 16}rem;
  color: ${COLOR_TEXT_STRONG.HEX};
  margin-bottom: 4px;
  order: 2;
`;

export const Description = styled.p`
  font-weight: 400;
  font-size: 1rem;
  line-height: ${24 / 16}rem;
  color: rgba(${COLOR_TEXT.RGB}, 0.75);
  margin-bottom: 16px;
  order: 3;

  > a {
    color: ${COLOR_TOMATO.HEX};
    border-bottom: solid 2px ${COLOR_TOMATO.HEX};
  }
`;

export const TagsUnordered = styled.ul`
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
  order: 1;
`;

export const TagsList = styled.li`
  font-size: ${12 / 16}rem;
  font-weight: 400;
  background-color: rgba(${COLOR_TOMATO.RGB}, 0.17);
  border-radius: 4px;
  padding: 1px 8px 0;
  margin-right: 8px;
`;

export const SlideShow = styled.div`
  margin: 0 -16px;
`;

export const ImageWrapper = styled.div`
  display: block;
  position: relative;
  padding-top: 60%;

  > img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
`;
