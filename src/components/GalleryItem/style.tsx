import styled from "styled-components";
import { ReactComponent as ArrowLeftIcon } from "../../images/icons/arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "../../images/icons/arrow-right.svg";
import {
  BP_DESKTOP,
  COLOR_TEXT,
  COLOR_TEXT_STRONG,
  COLOR_TOMATO,
  COLOR_WHITE,
} from "../../app/constants";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 16px;

  &:first-child {
    padding-top: 8px;
  }
  &:last-child {
    padding-bottom: 0px;
  }

  @media screen and (min-width: 1025px) {
    background-color: #fbf5f1;
    border-radius: 16px;
    box-shadow: 0px 40px 64px -6px rgba(${COLOR_TEXT_STRONG.RGB}, 0.36);
    flex-direction: column-reverse;
    overflow: hidden;
    padding-top: 0;
    padding-bottom: 0;
    margin: 32px 0;

    &:first-child {
      margin-top: 16px;
      padding-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
    }
  }
`;

export const Summary = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 1025px) {
    padding: 16px 0;
  }
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

  @media screen and (min-width: 1025px) {
    margin-bottom: 0;
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

  @media screen and (min-width: 576px) and (max-width: ${BP_DESKTOP}) {
    margin: 0;
  }
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

export const SlideNavButton = styled(({ target, ...props }) => (
  <button {...props}>
    {target === "prev" ? (
      <ArrowLeftIcon width={20} height={20} />
    ) : (
      <ArrowRightIcon width={20} height={20} />
    )}
  </button>
)).attrs(({ target }) => ({
  target,
}))`
  background: rgb(${COLOR_WHITE.RGB}, 0.75);
  border: 0;
  padding: 0;
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%) scale(0.9);
  ${({ target }) => (target === "prev" ? `left: 4px;` : `right: 4px;`)}
  box-shadow: 0px 14px 24px rgba(61, 43, 35, 0.16);
  z-index: 2;
  cursor: pointer;
  transition: transform 100ms ease-in;

  &:disabled {
    transform: ${({ target }) =>
      target === "prev"
        ? `translate(-44px, -50%) scale(0.9);`
        : `translate(44px, -50%) scale(0.9);`};
  }

  &:hover:not(:disabled) {
    transform: translate(0, -50%) scale(1);
  }
`;
