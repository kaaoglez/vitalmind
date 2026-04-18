'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import {
  translations,
  getNestedValue,
  Locale,
  locales,
  localeNames,
  localeFlags,
} from './translations';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface I18nContextValue {
  /** Current active locale */
  locale: Locale;
  /** Set a new active locale (also persists to localStorage) */
  setLocale: (locale: Locale) => void;
  /** List of all supported locales */
  locales: Locale[];
  /** Human-readable name for each locale */
  localeNames: Record<Locale, string>;
  /** Flag emoji for each locale */
  localeFlags: Record<Locale, string>;
  /** Translation function – supports dot-notation keys & interpolation */
  t: TFunction;
}

/**
 * The signature of the `t` (translate) function.
 *
 * @param key  - Dot-notation key, e.g. `"landing.hero.title"`
 * @param vars - Optional interpolation variables, e.g. `{ hours: 7 }`
 *               will replace `{hours}` in the translation string.
 */
type TFunction = (key: string, vars?: Record<string, string | number>) => string;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'vitalmind-locale';
const DEFAULT_LOCALE: Locale = 'es';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface I18nProviderProps {
  children: React.ReactNode;
  /** Optionally force an initial locale (ignores localStorage) */
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  // Read persisted locale on mount (only runs client-side)
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (initialLocale) return initialLocale;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && locales.includes(stored as Locale)) {
          return stored as Locale;
        }
      } catch {
        // localStorage unavailable (SSR, iframe restrictions, etc.)
      }
    }
    return DEFAULT_LOCALE;
  });

  // Persist locale changes to localStorage
  const setLocale = useCallback((newLocale: Locale) => {
    if (!locales.includes(newLocale)) {
      console.warn(`[i18n] Unsupported locale: "${newLocale}"`);
      return;
    }
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, []);

  // Keep the `<html lang>` attribute in sync with the active locale
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  // -----------------------------------------------------------------------
  // t() – the core translation function
  // -----------------------------------------------------------------------
  const t: TFunction = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const dict = translations[locale];
      let value = getNestedValue(dict, key);

      if (value === undefined) {
        // Fallback to Spanish (default) if the key is missing in the current locale
        if (locale !== DEFAULT_LOCALE) {
          value = getNestedValue(translations[DEFAULT_LOCALE], key);
        }

        if (value === undefined) {
          // Last resort: return the key itself so the UI doesn't break
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[i18n] Missing translation key: "${key}" (locale: ${locale})`);
          }
          return key;
        }
      }

      // Simple interpolation: replace {varName} with the provided value
      if (vars) {
        return Object.entries(vars).reduce(
          (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
          value,
        );
      }

      return value;
    },
    [locale],
  );

  // -----------------------------------------------------------------------
  // Context value (memoized)
  // -----------------------------------------------------------------------
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      locales,
      localeNames,
      localeFlags,
      t,
    }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook to access the i18n context.
 *
 * @example
 * ```tsx
 * const { t, locale, setLocale } = useTranslation();
 *
 * // Simple key lookup
 * t('landing.hero.title') // → "Descubre por qué te sientes así"
 *
 * // With interpolation
 * t('quickLog.sleep.sleptFor', { hours: 7 }) // → "Dormiste 7 horas"
 *
 * // Change language
 * setLocale('en')
 * ```
 */
export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an <I18nProvider>');
  }
  return context;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { I18nContext };
export type { I18nContextValue, I18nProviderProps, TFunction };
