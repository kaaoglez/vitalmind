'use client';

import { useState, useMemo } from 'react';
import {
  Phone,
  MessageCircle,
  Globe,
  AlertTriangle,
  Heart,
  Search,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Languages,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  crisisLinesData,
  crisisLinesTranslations,
  sortCountriesByLanguage,
  detectUserCountry,
  type Language,
  type CountryCrisisLines,
  type CrisisLine,
} from '@/lib/crisis-lines';

interface CrisisLinesProps {
  /** Language for i18n */
  language?: Language;
}

const typeIcons = {
  phone: Phone,
  chat: MessageCircle,
  text: MessageCircle,
};

const typeColors = {
  phone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  chat: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  text: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
};

export function CrisisLines({ language = 'es' }: CrisisLinesProps) {
  const t = crisisLinesTranslations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [userCountryCode] = useState<string | null>(() => detectUserCountry());
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(() => {
    const detected = detectUserCountry();
    return detected ? new Set([detected]) : new Set();
  });

  // Sort countries by language match
  const { languageMatches, otherCountries } = useMemo(
    () => sortCountriesByLanguage(crisisLinesData, language, userCountryCode),
    [language, userCountryCode],
  );

  const filteredLanguageMatches = useMemo(() => {
    if (!searchQuery.trim()) return languageMatches;
    const lower = searchQuery.toLowerCase();
    return languageMatches.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower)
    );
  }, [searchQuery, languageMatches]);

  const filteredOtherCountries = useMemo(() => {
    if (!searchQuery.trim()) return otherCountries;
    const lower = searchQuery.toLowerCase();
    return otherCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower)
    );
  }, [searchQuery, otherCountries]);

  const toggleCountry = (code: string) => {
    setExpandedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  // When a specific country is selected, show just that country
  const displayLanguageMatches = selectedCountry
    ? languageMatches.filter((c) => c.code === selectedCountry)
    : filteredLanguageMatches;

  const displayOtherCountries = selectedCountry
    ? otherCountries.filter((c) => c.code === selectedCountry)
    : filteredOtherCountries;

  const hasLanguageMatches = displayLanguageMatches.length > 0;
  const hasOtherCountries = displayOtherCountries.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Reassurance Banner */}
      <div className="rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-200 dark:border-rose-800/50 p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="size-6 text-rose-500 fill-rose-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-rose-700 dark:text-rose-300">
            {t.reassuranceMessage}
          </h2>
          <Heart className="size-6 text-rose-500 fill-rose-500 animate-pulse" />
        </div>
        <p className="text-rose-600/80 dark:text-rose-400/80 text-sm max-w-md mx-auto">
          {t.reassuranceSubtext}
        </p>
      </div>

      {/* Emergency Disclaimer */}
      <div className="flex items-start gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
        <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          {t.emergencyDisclaimer}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="pl-9"
            aria-label={t.searchPlaceholder}
          />
        </div>
        <Button
          variant={selectedCountry ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCountry(null)}
          className="shrink-0"
        >
          {t.allCountries}
        </Button>
      </div>

      {/* Country Filter Pills — grouped by language */}
      <div className="space-y-2">
        {/* Language-matched countries */}
        {languageMatches.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Languages className="size-3.5" />
              {t.yourLanguageCountries}
            </p>
            <div className="flex flex-wrap gap-2">
              {languageMatches.map((country) => (
                <button
                  key={country.code}
                  onClick={() =>
                    setSelectedCountry(selectedCountry === country.code ? null : country.code)
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCountry === country.code
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  aria-pressed={selectedCountry === country.code}
                >
                  <span className="text-sm">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other countries */}
        {otherCountries.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              {t.otherCountries}
            </p>
            <div className="flex flex-wrap gap-2">
              {otherCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() =>
                    setSelectedCountry(selectedCountry === country.code ? null : country.code)
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCountry === country.code
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  aria-pressed={selectedCountry === country.code}
                >
                  <span className="text-sm">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Crisis Lines List */}
      {(!hasLanguageMatches && !hasOtherCountries) ? (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="size-8 mx-auto mb-2 opacity-50" />
          <p>{t.noResults}</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-4 pr-3">
            {/* ── Your Language Section ─────────────────────────── */}
            {hasLanguageMatches && (
              <>
                {/* Section Header */}
                {!selectedCountry && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center justify-center size-7 rounded-full bg-primary/10">
                      <Languages className="size-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {t.yourLanguageCountries}
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}

                {displayLanguageMatches.map((country) => (
                  <CountryCard
                    key={country.code}
                    country={country}
                    isExpanded={expandedCountries.has(country.code)}
                    onToggle={() => toggleCountry(country.code)}
                    language={language}
                    isLanguageMatch={true}
                    isUserLocation={country.code === userCountryCode}
                  />
                ))}
              </>
            )}

            {/* ── Other Countries Section ────────────────────────── */}
            {hasOtherCountries && (
              <>
                {/* Section Header */}
                {!selectedCountry && (
                  <div className="flex items-center gap-2 pt-3">
                    <div className="flex items-center justify-center size-7 rounded-full bg-muted">
                      <Globe className="size-4 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-bold text-muted-foreground">
                      {t.otherCountries}
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}

                {displayOtherCountries.map((country) => (
                  <CountryCard
                    key={country.code}
                    country={country}
                    isExpanded={expandedCountries.has(country.code)}
                    onToggle={() => toggleCountry(country.code)}
                    language={language}
                    isLanguageMatch={country.languages.includes(language)}
                    isUserLocation={country.code === userCountryCode}
                  />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

interface CountryCardProps {
  country: CountryCrisisLines;
  isExpanded: boolean;
  onToggle: () => void;
  language: Language;
  isLanguageMatch: boolean;
  isUserLocation: boolean;
}

function CountryCard({ country, isExpanded, onToggle, language, isLanguageMatch, isUserLocation }: CountryCardProps) {
  const t = crisisLinesTranslations[language];
  const has247 = country.lines.some((l) => l.available === '24/7');

  return (
    <Card className={`overflow-hidden transition-all ${
      isUserLocation
        ? 'border-2 border-primary/40 shadow-md'
        : isLanguageMatch
          ? 'border border-primary/20'
          : ''
    }`}>
      <button
        onClick={onToggle}
        className="w-full text-left"
        aria-expanded={isExpanded}
        aria-label={`${country.flag} ${country.name} - ${t.available}: ${country.lines.length} ${t.phone.toLowerCase()}`}
      >
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label={country.name}>
                {country.flag}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{country.name}</CardTitle>
                  {/* Location Badge */}
                  {isUserLocation && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                      <MapPin className="size-3 mr-0.5" />
                      {t.yourLocationBadge}
                    </Badge>
                  )}
                  {/* Language Badge */}
                  {isLanguageMatch && !isUserLocation && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800/50">
                      <Languages className="size-3 mr-0.5" />
                      {t.yourLanguageBadge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {country.lines.length} {language === 'en' ? 'lines' : language === 'pt' ? 'linhas' : language === 'fr' ? 'lignes' : 'líneas'}
                  </span>
                  {has247 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <Clock className="size-3 mr-0.5" />
                      24/7
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-muted-foreground">
              {isExpanded ? (
                <ChevronUp className="size-5" />
              ) : (
                <ChevronDown className="size-5" />
              )}
            </div>
          </div>
        </CardHeader>
      </button>

      {isExpanded && (
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3">
            {country.lines.map((line, idx) => (
              <CrisisLineCard key={`${country.code}-${idx}`} line={line} language={language} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface CrisisLineCardProps {
  line: CrisisLine;
  language: Language;
}

function CrisisLineCard({ line, language }: CrisisLineCardProps) {
  const t = crisisLinesTranslations[language];
  const Icon = typeIcons[line.type];
  const is247 = line.available === '24/7';

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-lg border p-4 bg-card hover:bg-accent/30 transition-colors">
      {/* Icon & Type Badge */}
      <div className="flex items-center gap-2 shrink-0">
        <div className={`rounded-full p-2 ${typeColors[line.type]}`}>
          <Icon className="size-4" />
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] ${typeColors[line.type]} border-0`}
        >
          {t[line.type]}
        </Badge>
        {is247 && (
          <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">
            24/7
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm">{line.name}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {line.description}
        </p>
        {!is247 && (
          <div className="flex items-center gap-1 mt-1">
            <Clock className="size-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{line.available}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 shrink-0">
        {line.phone && line.type === 'phone' && (
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <a href={`tel:${line.phone.replace(/[-\s]/g, '')}`}>
              <Phone className="size-3.5" />
              {t.callNow}
            </a>
          </Button>
        )}
        {line.phone && line.type === 'text' && (
          <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
            <a href={`sms:${line.phone.replace(/[-\s]/g, '')}`}>
              <MessageCircle className="size-3.5" />
              {t.textNow}
            </a>
          </Button>
        )}
        {line.type === 'chat' && line.url && (
          <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-700 text-white">
            <a href={line.url} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-3.5" />
              {t.chatNow}
            </a>
          </Button>
        )}
        {line.url && line.type !== 'chat' && (
          <Button asChild variant="outline" size="sm">
            <a href={line.url} target="_blank" rel="noopener noreferrer">
              <Globe className="size-3.5" />
              {t.visitWebsite}
              <ExternalLink className="size-3 ml-0.5" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
