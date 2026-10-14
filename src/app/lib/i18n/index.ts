import { enDictionary } from './en';
import { idDictionary } from './id';
import type { Dictionary, Locale } from './types';

const dictionaries: Record<Locale, Dictionary> = {
  en: enDictionary,
  id: idDictionary,
};

export const locales = Object.keys(dictionaries) as Locale[];

export const hasLocale = (locale: string): locale is Locale => Object.hasOwn(dictionaries, locale);

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export type { Dictionary, Locale } from './types';
