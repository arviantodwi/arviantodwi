'use client';

import {
  type BaseSyntheticEvent,
  type FC,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type FieldError,
  type RegisterOptions,
  type UseFormRegister,
  useForm,
} from 'react-hook-form';
import { type ContactFormState, sendContactMessage } from '@/app/actions/contact';
import { Input } from '@/app/components/ui/Input';
import { Textarea } from '@/app/components/ui/Textarea';
import { type ContactInput, isValidEmail, LIMITS } from '@/app/lib/contact/validate';
import type { Dictionary, Locale } from '@/app/lib/i18n/types';
import { cx } from '@/app/lib/utils';
import { IconCheck } from './ui/icons';

/** Fill a copy template's {min}/{max}; numbers get the locale's thousand separator. */
const fillLimits = (
  template: string,
  locale: Locale,
  limits: { min?: number; max?: number },
): string => {
  let out = template;
  if (limits.min !== undefined) {
    out = out.replaceAll('{min}', new Intl.NumberFormat(locale).format(limits.min));
  }
  if (limits.max !== undefined) {
    out = out.replaceAll('{max}', new Intl.NumberFormat(locale).format(limits.max));
  }
  return out;
};

interface Props {
  dict: Dictionary;
  locale: Locale;
}

type FieldName = 'name' | 'email' | 'message';
type FieldErrors = Partial<Record<FieldName, FieldError>>;

const INITIAL_STATE: ContactFormState = {
  status: 'idle',
  fieldErrors: {},
  formError: null,
  values: { name: '', email: '', message: '', interest: '' },
};

/** Cancel window: a valid submit is held this long before dispatching. */
const CANCEL_WINDOW_MS = 3000;

/* Field styling lives in ui/Input + ui/Textarea per the .pen
   "Drawer — Input fields" (uKTB8) / "Drawer — Text areas" (azLph) state
   system: idle #292929, focus-empty white/65, typed value → gold line,
   error #ed5440. */

/** Resolve a server-returned i18n key (`contact.errors.*`) to localized copy. */
const formErrorText = (key: string, dict: Dictionary): string | null => {
  const messages: Record<string, string> = {
    'contact.errors.tooFast': dict.contact.errors.tooFast,
    'contact.errors.rateLimited': dict.contact.errors.rateLimited,
    'contact.errors.sendFailed': dict.contact.errors.sendFailed,
    'contact.errors.missingConfig': dict.contact.errors.missingConfig,
  };
  return messages[key] ?? null;
};

/** Map a server field-error code to its localized copy — same strings the
    client rules render, so both paths look identical. */
const fieldErrorText = (
  field: FieldName,
  state: ContactFormState,
  dict: Dictionary,
  locale: Locale,
): string | null => {
  const error = state.fieldErrors[field];
  if (!error) return null;
  const e = dict.contact.errors;
  if (field === 'email') {
    return error === 'invalid' ? e.emailInvalid : e.email;
  }
  if (field === 'message') {
    if (error === 'tooLong') {
      return fillLimits(e.messageTooLong, locale, { max: LIMITS.message.max });
    }
    if (error === 'tooShort') {
      return fillLimits(e.messageTooShort, locale, { min: LIMITS.message.min });
    }
    return e.message;
  }
  return e.name;
};

/**
 * Client validation rules mirroring the server's `validateContact` exactly —
 * same limits from `lib/contact/validate.ts`, same trim semantics, messages
 * from the dictionaries ({min}/{max} filled with Intl-formatted numbers).
 * RHF runs them per `useForm` mode (blur first, then live re-validation).
 */
const fieldRules = (
  dict: Dictionary,
  locale: Locale,
): Record<FieldName, RegisterOptions<ContactInput>> => {
  const e = dict.contact.errors;
  return {
    name: {
      validate: (value) => {
        const t = value.trim();
        if (!t || t.length < LIMITS.name.min || t.length > LIMITS.name.max) return e.name;
        return true;
      },
    },
    email: {
      validate: (value) => {
        const t = value.trim();
        if (!t) return e.email;
        if (t.length > LIMITS.email.max) return e.emailInvalid;
        return isValidEmail(t) || e.emailInvalid;
      },
    },
    message: {
      validate: (value) => {
        const t = value.trim();
        if (!t) return e.message;
        if (t.length < LIMITS.message.min) {
          return fillLimits(e.messageTooShort, locale, { min: LIMITS.message.min });
        }
        if (t.length > LIMITS.message.max) {
          return fillLimits(e.messageTooLong, locale, { max: LIMITS.message.max });
        }
        return true;
      },
    },
  };
};

interface ContactFieldsProps {
  dict: Dictionary;
  locale: Locale;
  register: UseFormRegister<ContactInput>;
  errors: FieldErrors;
  /** Locked during the 3s cancel window — no edits unless cancelled first. */
  readOnly: boolean;
}

/** Name / email / message fields, uncontrolled via RHF `register`. */
const ContactFields: FC<ContactFieldsProps> = ({ dict, locale, register, errors, readOnly }) => {
  const rules = fieldRules(dict, locale);
  const { placeholders } = dict.contact;
  const namePlaceholder = `${placeholders.name} ${fillLimits(placeholders.nameRange, locale, {
    min: LIMITS.name.min,
    max: LIMITS.name.max,
  })}`;
  /* Locked-window styling: progress cursor + greyed value text (placeholder
     keeps its own tint; twMerge resolves the text-color conflict). */
  const lockedClass = readOnly
    ? 'cursor-progress text-white/60 not-placeholder-shown:text-white/60'
    : '';

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="contact-name" className="sr-only">
        {dict.contact.fields.name}
      </label>
      <Input
        id="contact-name"
        type="text"
        required
        autoComplete="name"
        readOnly={readOnly}
        placeholder={namePlaceholder}
        error={errors.name?.message ?? null}
        className={lockedClass}
        {...register('name', rules.name)}
      />
      <label htmlFor="contact-email" className="sr-only">
        {dict.contact.fields.email}
      </label>
      <Input
        id="contact-email"
        type="email"
        required
        autoComplete="email"
        readOnly={readOnly}
        placeholder={dict.contact.placeholders.email}
        error={errors.email?.message ?? null}
        className={lockedClass}
        {...register('email', rules.email)}
      />
      <label htmlFor="contact-message" className="sr-only">
        {dict.contact.fields.message}
      </label>
      <Textarea
        id="contact-message"
        rows={5}
        readOnly={readOnly}
        required
        placeholder={dict.contact.placeholders.message}
        error={errors.message?.message ?? null}
        className={lockedClass}
        {...register('message', rules.message)}
      />
    </div>
  );
};

interface InterestSelectorProps {
  dict: Dictionary;
  register: UseFormRegister<ContactInput>;
  /** Locked during the 3s cancel window: inert (no pointer/keyboard/focus
      changes — checked state still submits) at 80% opacity. */
  locked: boolean;
}

/**
 * Radiogroup of 4 toggle options as a native fieldset of radio inputs
 * (arrow-key navigation free); the checked radio submits as `interest`.
 * No client rule — the server's INTERESTS whitelist is the authority, and
 * the design has no error slot for the group.
 */
const InterestSelector: FC<InterestSelectorProps> = ({ dict, register, locked }) => {
  return (
    <fieldset
      inert={locked}
      className={cx(
        'flex w-full flex-col transition-opacity lg:w-[252px] lg:shrink-0',
        locked ? 'opacity-80' : 'opacity-100',
      )}
    >
      <legend
        id="contact-interests-prompt"
        className="font-general text-base font-semibold tracking-[0.01em] text-white"
      >
        {dict.contact.prompt}
      </legend>
      {/* Chrome renders <legend> outside the fieldset's flex flow (gap never
          applies after it) — the design's 24px prompt→choices gap goes here. */}
      <div className="mt-6 flex flex-col gap-3">
        {dict.contact.choices.map((choice, index) => (
          <label
            key={choice.id}
            className={cx(
              'flex h-12 w-full cursor-pointer items-center justify-between border border-white/15 px-4 text-sm text-white/50 transition-colors has-checked:border-gold has-checked:text-gold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold',
            )}
          >
            <input
              type="radio"
              value={choice.id}
              defaultChecked={index === 0}
              className="peer sr-only"
              {...register('interest')}
            />
            <span>{choice.label}</span>
            <span
              aria-hidden="true"
              className="bg-gold h-[5px] w-[5px] opacity-0 peer-checked:opacity-100"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
};

/**
 * Success state per the .pen "Contact form — Sent" (node B2C6cA): full
 * form-column width, vertically centered — gold badge with a check, 36px
 * heading, secondary subtext. role="status" announces it (the old form-level
 * aria-live region now only carries form errors).
 */
const SentView: FC<{ dict: Dictionary }> = ({ dict }) => (
  <div
    role="status"
    className="contact-sent-enter flex h-[372px] w-full flex-col items-center justify-center gap-5"
  >
    <div className="bg-gold flex h-10 w-10 items-center justify-center rounded-full">
      <IconCheck aria-hidden="true" size={20} className="text-background" />
    </div>
    <p className="font-general text-4xl font-bold tracking-[-0.01em] text-white">
      {dict.contact.successHeading}
    </p>
    <p className="font-general text-base leading-[1.4375] tracking-[0.01em] text-white/75">
      {dict.contact.successSubtext}
    </p>
  </div>
);

/**
 * Project inquiry row (client island): interest selector — hairline divider —
 * form fields. RHF v7 owns client validation (blur first, then live);
 * a valid submit opens the 3s cancel window before dispatching the FormData
 * through the `sendContactMessage` server action via `useActionState`, which
 * stays authoritative (rate limit, honeypot, sanitization, mail,
 * revalidation). Server field errors merge back through `setError`. On
 * success the form subtree (radios included) animates out and the SentView
 * takes over the whole row; `reset()` runs once the exit animation ends.
 */
export const ContactForm: FC<Props> = ({ dict, locale }) => {
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL_STATE);
  const startedAt = useRef(Date.now()).current;

  /* 3-second cancel window: a valid submit is held before dispatching so the
     user can abort with the Cancel trigger; the fuchsia progress bar and the
     trigger live only inside the window. */
  const [counting, setCounting] = useState(false);
  const windowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* Success hand-off: 'form' → 'exiting' (form animates out, fields keep
     their values) → 'sent' (fields reset + SentView enters). */
  const [sentPhase, setSentPhase] = useState<'form' | 'exiting' | 'sent'>('form');
  useEffect(
    () => () => {
      if (windowTimer.current) clearTimeout(windowTimer.current);
    },
    [],
  );

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    /* onTouched = the official "blur first, then live" mode: first validation
       on blur, re-validation on every change after that. reValidateMode
       governs post-submit events. */
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '', message: '', interest: 'design' },
  });

  /* Server round-trip feedback: field errors merge into RHF so they render
     through the same `error` prop; on success the form exits before the
     sent view takes over — fields reset only after the exit animation. */
  useEffect(() => {
    if (state.status === 'success') {
      setSentPhase('exiting');
      const t = setTimeout(() => {
        reset();
        setSentPhase('sent');
      }, 260);
      return () => clearTimeout(t);
    }
    if (state.status === 'error') {
      for (const field of ['name', 'email', 'message'] as const) {
        const message = fieldErrorText(field, state, dict, locale);
        if (message) setError(field, { type: 'server', message });
      }
    }
  }, [state, dict, locale, reset, setError]);

  /* Valid submit → 3s window → dispatch. Fields go readOnly for the window;
     the FormData is re-read at dispatch time so the screen and the payload
     stay identical (radios stay interactive — whatever is on screen wins).
     The timer guard makes double submits (Enter while counting) a no-op. */
  const onValid = (_data: ContactInput, event?: BaseSyntheticEvent) => {
    const form = event?.target;
    if (!(form instanceof HTMLFormElement) || windowTimer.current) return;
    setCounting(true);
    windowTimer.current = setTimeout(() => {
      windowTimer.current = null;
      setCounting(false);
      /* Manual dispatch must run inside a transition (React 19 useActionState
         contract) — otherwise isPending never flips on. */
      startTransition(() => formAction(new FormData(form)));
    }, CANCEL_WINDOW_MS);
  };

  const cancelSend = () => {
    if (windowTimer.current) clearTimeout(windowTimer.current);
    windowTimer.current = null;
    setCounting(false);
  };

  const statusText =
    state.status === 'error' && state.formError ? formErrorText(state.formError, dict) : null;

  return (
    <div className={cx('relative p-8 md:p-12', counting && 'cursor-progress')}>
      {sentPhase === 'sent' ? (
        <SentView dict={dict} />
      ) : (
        <form
          noValidate
          className={cx(
            'flex flex-col gap-12 lg:flex-row',
            sentPhase === 'exiting' && 'contact-form-exit',
          )}
          onSubmit={sentPhase === 'form' ? handleSubmit(onValid) : (e) => e.preventDefault()}
        >
          <InterestSelector dict={dict} locked={counting} register={register} />

          {/* Group divider (design: 1px #292929 column, desktop only).
              self-stretch, not h-full — h-full computes 0 against the form's
              indefinite height. */}
          <div aria-hidden="true" className="hidden w-px self-stretch bg-white/15 lg:block" />

          <div className="flex flex-1 flex-col gap-8">
            <ContactFields
              dict={dict}
              locale={locale}
              register={register}
              errors={errors}
              readOnly={counting}
            />
            {/* Submit row (design: flat gold pill-less button, flush right in a
              70px row). No neo-brutal border/shadow — that's the ui/Button
              idiom, not this frame. */}
            {/* Send button: idle → (hover) plane bottom-left → counting/submitting
              with plane top-right, flight bob, and trails drawing 2→1→3. Valid
              submit opens the 3s cancel window (bar + Cancel below/behind);
              dispatch happens only when the window elapses. */}
            <div className="flex min-h-[70px] flex-col items-end justify-end gap-6">
              <div className="flex items-center gap-4">
                {counting && (
                  <button
                    type="button"
                    onClick={cancelSend}
                    className="border-foreground/70 font-general text-foreground/70 hover:border-foreground hover:text-foreground focus-visible:outline-gold flex h-12 cursor-pointer items-center border px-4 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {dict.contact.cancel}
                  </button>
                )}
                <div className="relative">
                  <button
                    type="submit"
                    disabled={counting || pending}
                    className={cx(
                      'send-btn group inline-flex h-12 items-center gap-2 bg-gold px-[18px] font-bold font-general text-background text-base transition-opacity focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2',
                      counting
                        ? 'cursor-progress'
                        : pending
                          ? 'cursor-not-allowed'
                          : 'cursor-pointer hover:opacity-90',
                      (counting || pending) && 'send-btn--loading',
                    )}
                  >
                    {counting || pending ? dict.contact.submitting : dict.contact.submit}
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <g className="send-fly">
                        <path className="send-plane" d="M12 6l-4 4 6 6 4-16-18 7 4 2 2 6 3-4" />
                      </g>
                      <g transform="translate(7 19.3)">
                        <path
                          className="send-trail send-trail--1"
                          pathLength={1}
                          d="M5.3 -2.6L1.1 1.7"
                        />
                        <path
                          className="send-trail send-trail--2"
                          pathLength={1}
                          d="M8 0L0.4 8.4"
                        />
                        <path
                          className="send-trail send-trail--3"
                          pathLength={1}
                          d="M12.5 1.3L7.6 6.6"
                        />
                      </g>
                    </svg>
                  </button>
                  {/* 3s cancel-window progress: flat 3px bar, no track, sweeps
                    left→right below the button; gone once dispatch begins. */}
                  {counting && (
                    <span
                      aria-hidden="true"
                      className="send-progress-bar absolute inset-x-0 -bottom-1.5 h-[3px] origin-left bg-[#9747FF]"
                      style={{ animation: 'send-progress 3000ms linear forwards' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Time trap + locale echo for the server action. */}
          <input type="hidden" name="startedAt" value={startedAt} />
          <input type="hidden" name="locale" value={locale} />

          {/* Honeypot — off-canvas, not sr-only (bots read sr-only content). */}
          <div
            aria-hidden="true"
            className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden"
          >
            <label>
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
        </form>
      )}

      {/* Form-level errors only — success announces through the SentView. */}
      <div aria-live="polite" role="status">
        {statusText && <p className="pt-6 text-sm text-[#ed5440]">{statusText}</p>}
      </div>
    </div>
  );
};
