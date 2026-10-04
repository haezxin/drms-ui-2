import React from 'react';

interface AnnotationProps {
  children: React.ReactNode;
  as?: 'h2' | 'h3' | 'span' | 'div';
  className?: string;
}

/** Small tracked technical label with a leading hairline tick — the DRMS annotation mark. */
export function Annotation({ children, as: Tag = 'h2', className = '' }: AnnotationProps) {
  return (
    <Tag className={`flex items-center gap-2.5 font-mono text-[10px] tracking-widest2 text-ink-tertiary ${className}`}>
      <span aria-hidden className="h-px w-3 shrink-0 bg-ink-tertiary/60" />
      {children}
    </Tag>);

}