import styled from "styled-components";
import { COLOR_TAN, COLOR_TEXT, COLOR_TOMATO } from "../../app/constants";

export const Container = styled.div`
  background-color: ${COLOR_TAN.HEX};
  padding: 40px 16px 72px;
  margin-top: -48px;
`;

export const Photo = styled.div`
  width: 72px;
  height: 72px;
  border-radius: ${72 / 2}px;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const Article = styled.article`
  display: flex;
  flex-direction: column;
`;

export const ArticleSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 0;
`;

const Text = styled.p`
  color: ${COLOR_TEXT.HEX};
  text-align: left;
  font-weight: 400;
`;

export const ArticleIntro = styled(Text)`
  font-size: 1rem;
  order: 1;
`;

export const ArticleParagraph = styled(Text)`
  font-size: ${15 / 16}rem;
  line-height: ${(16 / 15) * 1.5};
  order: 3;
`;

export const ArticleHeadline = styled(Text).attrs({ as: "h1" })`
  font-size: ${32 / 16}rem;
  font-weight: 900;
  line-height ${38 / 32};
  order: 2;
  margin: 8px 0 12px;
`;

export const ResumeButtonLink = styled.a`
  padding: 9px 12px 9px 10px;
  background: ${COLOR_TOMATO.HEX};
  border: 0;
  border-radius: 4px;
  box-shadow: 0 14px 24px rgba(61, 43, 35, 0.16);
  display: flex;
  flex-direction: row;
  align-items: center;
  order: 4;
  font-weight: 700;
  font-size: ${15 / 16}rem;
  color: ${COLOR_TAN.HEX} !important;
  margin: 16px 0;
  transition: transform 100ms ease-in;

  &:hover {
    transform: scale(1.05);
  }

  > i {
    display: inline-flex;
    margin-right: 8px;
  }
`;

export const SkillsHeading = styled(Text).attrs({ as: "h2" })`
  font-weight: 700;
  font-size: ${24 / 16}rem;
  margin: -12px 0 12px;
`;

export const SkillsUnordered = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const SkillsList = styled.li`
  margin-bottom: 8px;

  &:not(:last-child) {
    margin-right: 10px;
  }
`;
