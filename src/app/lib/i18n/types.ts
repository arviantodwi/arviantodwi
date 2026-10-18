export type Locale = 'en' | 'id';

/**
 * Inline text segments. Components render styled wrappers per tone;
 * plain segments render as bare text. Spacing between segments is part
 * of the segment text itself (rendered verbatim, no auto-joining).
 */
export type SegmentTone = 'dim' | 'gold' | 'strong' | 'goldUnderline';

export interface Segment {
  text: string;
  /** Omitted = plain text, rendered as bare string. */
  tone?: SegmentTone;
}

/** Statistic label with small-screen / large-screen variants. */
export interface StatLabel {
  short: string;
  long: string;
}

export interface PersonTestimony {
  photo: string;
  name: string;
  /** Role + organization combined, e.g. "Senior SDE at Amazon". */
  title: string;
  quotes: Segment[];
}

/** Copy for one AI-workflow stage: stage description + its illustration alt text. */
export interface StageCopy {
  description: string;
  imageAlt: string;
}

export interface Dictionary {
  metadata: {
    description: string;
    ogLocale: string;
  };
  header: {
    status: {
      available: string;
      open: string;
      unavailable: string;
    };
  };
  hero: {
    rolePrefix: string;
    roles: string[];
    location: string;
    stats: {
      projects: StatLabel;
      tools: StatLabel;
      years: StatLabel;
    };
    photoAlt: string;
  };
  about: {
    headline: [string, string];
    cta: string;
    bio: Segment[][];
  };
  techStack: {
    heading: Segment[];
    subline: Segment[];
  };
  aiWorkflow: {
    /** Headline pair: first line plain, second line rendered gold + bold in the component. */
    headline: [string, string];
    intro: Segment[];
    stages: {
      plan: StageCopy;
      design: StageCopy;
      develop: StageCopy;
    };
    toolkit: Segment[];
  };
  portfolio: {
    /** Section tagline pair: first line muted, second full white. */
    tagline: {
      muted: string;
      plain: string;
    };
    /** Per-project descriptions, keyed by the PROJECTS const in Portfolio.tsx. */
    projects: {
      tours: { description: string };
      sports: { description: string };
      voice: { description: string };
      vehicle: { description: string };
      charity: { description: string };
    };
  };
  testimonial: {
    heading: Segment[];
    testimonies: PersonTestimony[];
  };
  footer: {
    copyright: string;
    mast: {
      inPage: string;
      social: string;
      links: {
        about: string;
        cv: string;
        humanAi: string;
        portfolio: string;
        testimonials: string;
        message: string;
      };
      socialLinks: {
        github: string;
        linkedin: string;
      };
    };
  };
}
