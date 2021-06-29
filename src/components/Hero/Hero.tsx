import { useEffect, useState } from "react";

import Pill from "../Pill";
import MyPhoto from "../../images/me.jpg";
import { Hero as HeroProps, fetchHeroContent } from "./heroAPI";
import { ReactComponent as DownloadIcon } from "../../images/icons/download.svg";

import {
  Container,
  Photo,
  Article,
  ArticleSection as Section,
  ArticleHeadline as Headline,
  ArticleParagraph as Paragraph,
  ArticleIntro as Intro,
  ResumeButtonLink,
  SkillsHeading,
  SkillsUnordered,
  SkillsList,
} from "./style";
import { COLOR_TAN } from "../../app/constants";

const Hero = () => {
  const [data, setData] = useState<HeroProps>();

  useEffect(() => {
    // Get hero content data
    (async () => {
      const response = await fetchHeroContent();
      setData(response);
    })();
  }, []);

  return (
    <Container>
      <Photo>
        <img src={MyPhoto} alt="Arvianto Dwi" />
      </Photo>

      <Article>
        <Section>
          <Headline data-testid="HeroLine1">{data && data.bio}</Headline>
          <Intro data-testid="HeroLine2">{data && data.intro}</Intro>
          <Paragraph data-testid="HeroLine3">{data && data.about}</Paragraph>

          {data && (
            <ResumeButtonLink
              href={data.resume_link}
              target="_blank"
              rel="noopener noreferer"
            >
              <i>
                <DownloadIcon width={24} fill={COLOR_TAN.HEX} />
              </i>
              Download my résumé
            </ResumeButtonLink>
          )}
        </Section>

        <Section>
          <SkillsHeading>Skills &amp; Stack</SkillsHeading>
          <SkillsUnordered>
            {data &&
              data.skills.map((skill, i) => (
                <SkillsList key={`skill-${i}`}>
                  <Pill label={skill} />
                </SkillsList>
              ))}
          </SkillsUnordered>
        </Section>
      </Article>
    </Container>
  );
};

export default Hero;
