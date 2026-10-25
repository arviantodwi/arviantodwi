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

/** One selectable "I'm interested in..." option on the contact form. */
export interface ContactChoice {
  id: 'design' | 'frontend' | 'sme' | 'hello';
  label: string;
}

/**
 * Contact section copy. The server action returns error KEYS
 * (e.g. 'contact.errors.rateLimited') that the client resolves
 * against `contact.errors` — keep those key names stable.
 */
export interface ContactLabels {
  heading: string;
  prompt: string;
  choices: ContactChoice[];
  fields: { name: string; email: string; message: string };
  placeholders: {
    name: string;
    email: string;
    message: string;
    /** Range hint appended to the name placeholder, {min}/{max} filled from LIMITS. */
    nameRange: string;
  };
  submit: string;
  submitting: string;
  /** Cancel trigger inside the 3s send window. */
  cancel: string;
  /** Sent-state split copy (B2C6cA): heading + subtext. */
  successHeading: string;
  successSubtext: string;
  errors: {
    name: string;
    email: string;
    emailInvalid: string;
    /** Empty message only. */
    message: string;
    /** {min} filled from LIMITS.message.min, Intl-formatted. */
    messageTooShort: string;
    /** {max} filled from LIMITS.message.max, Intl-formatted. */
    messageTooLong: string;
    tooFast: string;
    rateLimited: string;
    sendFailed: string;
    missingConfig: string;
  };
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
  contact: ContactLabels;
}
