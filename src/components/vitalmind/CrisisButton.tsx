'use client';

import { useState } from 'react';
import { Phone, Heart, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CrisisLines } from './CrisisLines';
import { crisisLinesTranslations, type Language } from '@/lib/crisis-lines';

interface CrisisButtonProps {
  /** Language for i18n */
  language?: Language;
  /** Render as inline icon button (for header) instead of floating button */
  inline?: boolean;
}

export function CrisisButton({ language = 'es', inline = false }: CrisisButtonProps) {
  const t = crisisLinesTranslations[language];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Crisis Button - either inline (header) or floating (landing/auth) */}
      {inline ? (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center size-8 rounded-full bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 active:bg-rose-300 dark:active:bg-rose-900/70 text-rose-600 dark:text-rose-400 transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 group"
          aria-label={t.title}
          title={t.title}
        >
          <div className="relative">
            <Phone className="size-4 transition-transform group-hover:scale-110" />
            <Heart className="size-2 absolute -top-0.5 -right-0.5 fill-current text-current" />
          </div>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center size-14 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 group"
          aria-label={t.title}
        >
          <div className="relative">
            <Phone className="size-6 transition-transform group-hover:scale-110" />
            <Heart className="size-3 absolute -top-1 -right-1 fill-white text-white" />
          </div>
          {/* Pulse ring animation */}
          <span className="absolute inset-0 rounded-full bg-rose-400/50 animate-ping" />
        </button>
      )}

      {/* Crisis Lines Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden" showCloseButton={false}>
          <DialogHeader className="p-6 pb-0 space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-full bg-rose-100 dark:bg-rose-900/30">
                  <Phone className="size-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <DialogTitle className="text-xl">{t.title}</DialogTitle>
                  <DialogDescription className="text-sm mt-0.5">
                    {t.subtitle}
                  </DialogDescription>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-muted transition-colors"
                aria-label={t.closeButton}
              >
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
          </DialogHeader>
          <div className="p-6 pt-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            <CrisisLines language={language} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
