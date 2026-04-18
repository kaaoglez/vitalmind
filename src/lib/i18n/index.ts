/**
 * VitalMind i18n module
 *
 * Re-exports everything from the i18n subsystem so consumers can import
 * from a single entry-point:
 *
 * ```ts
 * import { I18nProvider, useTranslation, locales } from '@/lib/i18n';
 * ```
 */

// Context & hook
export {
  I18nProvider,
  I18nContext,
  useTranslation,
} from './context';

export type {
  I18nContextValue,
  I18nProviderProps,
  TFunction,
} from './context';

// Translations & helpers
export {
  translations,
  getNestedValue,
  locales,
  localeNames,
  localeFlags,
} from './translations';

export type {
  Locale,
  Translations,
} from './translations';
