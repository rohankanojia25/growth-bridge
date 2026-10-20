'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState, useId } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-border', className)} role="region" aria-label="Frequently Asked Questions">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={index} className="group">
            <button
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green/25 rounded-lg px-2 -mx-2"
            >
              <span className="text-h3 text-[1.125rem]">{item.question}</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-text-dim transition-transform duration-200',
                  isOpen && 'rotate-180 text-green'
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <p className="text-body pb-5 px-2">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
