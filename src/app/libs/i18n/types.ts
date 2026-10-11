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
  portfolio: {
    heading: Segment[];
    subline: Segment[];
  };
  testimonial: {
    heading: Segment[];
    testimonies: PersonTestimony[];
  };
  footer: {
    copyright: string;
  };
}
