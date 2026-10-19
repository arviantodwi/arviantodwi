'use client';

import { type FC, useActionState, useEffect, useRef, useState } from 'react';
import { TbBrandTelegram } from 'react-icons/tb';
import { type ContactFormState, sendContactMessage } from '@/app/actions/contact';
import type { Dictionary, Locale } from '@/app/lib/i18n/types';
import { cx } from '@/app/lib/utils';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

type FieldName = 'name' | 'email' | 'message';
type FieldValues = Pick<ContactFormState['values'], FieldName>;

const INITIAL_STATE: ContactFormState = {
  status: 'idle',
  fieldErrors: {},
  formError: null,
  values: { name: '', email: '', message: '', interest: '' },
};

/* Field styling per the .pen frame: ALL fields are underline inputs (idle
   #ffffffa8 → border-white/65, message idle #292929 → border-white/15,
   placeholder #ffffff54 → white/35, gold focus border, pad 8/0/12/0). */
const FIELD =
  'w-full bg-transparent font-general text-base text-white placeholder:text-white/35 transition-colors focus:border-gold focus:outline-none';
const INPUT = cx(FIELD, 'h-11 border-b border-white/65 px-0 pt-2 pb-3');
const TEXTAREA = cx(FIELD, 'min-h-[150px] resize-y border-b border-white/15 px-0 pt-2 pb-3');

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

/** Map a field error code to its localized copy ('invalid' on email → the dedicated key). */
const fieldErrorText = (
  field: FieldName,
  state: ContactFormState,
  dict: Dictionary,
): string | null => {
  const error = state.fieldErrors[field];
  if (!error) return null;
  if (field === 'email' && error === 'invalid') return dict.contact.errors.emailInvalid;
  return dict.contact.errors[field];
};

interface ContactFieldsProps {
  state: ContactFormState;
  dict: Dictionary;
}

/**
 * Name / email / message fields. Lives under the keyed <form> so a success
 * remount clears the controlled values; on an error mount it seeds from the
 * action's echoed values.
 */
const ContactFields: FC<ContactFieldsProps> = ({ state, dict }) => {
  const [values, setValues] = useState<FieldValues>(() =>
    state.status === 'error'
      ? { name: state.values.name, email: state.values.email, message: state.values.message }
      : { name: '', email: '', message: '' },
  );

  const field = (name: FieldName, id: string, error: string | null, node: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="sr-only">
        {dict.contact.fields[name]}
      </label>
      {node}
      {error && (
        <p id={`${id}-error`} className="text-rose-600 text-sm">
          {error}
        </p>
      )}
    </div>
  );

  const nameError = fieldErrorText('name', state, dict);
  const emailError = fieldErrorText('email', state, dict);
  const messageError = fieldErrorText('message', state, dict);

  return (
    <div className="flex flex-col gap-4">
      {field(
        'name',
        'contact-name',
        nameError,
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={dict.contact.placeholders.name}
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? 'contact-name-error' : undefined}
          className={INPUT}
        />,
      )}
      {field(
        'email',
        'contact-email',
        emailError,
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={dict.contact.placeholders.email}
          value={values.email}
          onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'contact-email-error' : undefined}
          className={INPUT}
        />,
      )}
      {field(
        'message',
        'contact-message',
        messageError,
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder={dict.contact.placeholders.message}
          value={values.message}
          onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
          aria-invalid={Boolean(messageError)}
          aria-describedby={messageError ? 'contact-message-error' : undefined}
          className={TEXTAREA}
        />,
      )}
    </div>
  );
};

interface InterestSelectorProps {
  dict: Dictionary;
}

/**
 * Radiogroup of 4 toggle options as a native fieldset of radio inputs
 * (arrow-key navigation free); the checked radio submits as `interest`.
 */
const InterestSelector: FC<InterestSelectorProps> = ({ dict }) => {
  return (
    <fieldset className="flex w-full flex-col lg:w-[252px] lg:shrink-0">
      <legend
        id="contact-interests-prompt"
        className="font-general font-semibold text-base text-white tracking-[0.01em]"
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
              name="interest"
              value={choice.id}
              defaultChecked={index === 0}
              className="peer sr-only"
            />
            <span>{choice.label}</span>
            <span
              aria-hidden="true"
              className="h-[5px] w-[5px] bg-gold opacity-0 peer-checked:opacity-100"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
};

/**
 * Project inquiry row (client island): interest selector — hairline divider —
 * form fields, wired to the `sendContactMessage` server action via
 * `useActionState`. Success remounts the form subtree (incremented `key`) so
 * every controlled input clears; the live status region sits outside the
 * keyed form so the message survives the remount.
 */
export const ContactForm: FC<Props> = ({ dict, locale }) => {
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL_STATE);
  const startedAt = useRef(Date.now()).current;
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.status === 'success') setFormKey((key) => key + 1);
  }, [state]);

  const statusText =
    state.status === 'success'
      ? dict.contact.success
      : state.status === 'error' && state.formError
        ? formErrorText(state.formError, dict)
        : null;

  return (
    <div className="relative p-8 md:p-12">
      <form
        key={formKey}
        action={formAction}
        noValidate
        className="flex flex-col gap-12 lg:flex-row"
      >
        <InterestSelector dict={dict} />

        {/* Group divider (design: 1px #292929 column, desktop only).
            self-stretch, not h-full — h-full computes 0 against the form's
            indefinite height. */}
        <div aria-hidden="true" className="hidden w-px self-stretch bg-white/15 lg:block" />

        <div className="flex flex-1 flex-col gap-8">
          <ContactFields state={state} dict={dict} />
          {/* Submit row (design: flat gold pill-less button, flush right in a
              70px row). No neo-brutal border/shadow — that's the ui/Button
              idiom, not this frame. */}
          <div className="flex min-h-[70px] items-start justify-end">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex cursor-pointer items-center gap-2 bg-gold px-[18px] py-3 font-bold font-general text-background text-base transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? dict.contact.submitting : dict.contact.submit}
              <TbBrandTelegram size={24} aria-hidden="true" />
            </button>
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

      {/* Action status (server-returned errors resolve through dict.contact.errors). */}
      <div aria-live="polite" role="status">
        {statusText && (
          <p
            className={cx(
              'pt-6 text-sm',
              state.status === 'success' ? 'text-gold' : 'text-rose-600',
            )}
          >
            {statusText}
          </p>
        )}
      </div>
    </div>
  );
};
