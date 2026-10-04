import React from 'react';
import { PageHeader } from './PageHeader';
import { Annotation } from '../Annotation';

export function PlaceholderScreen({ label, title }: {label: string;title: string;}) {
  return (
    <div className="w-full">
      <PageHeader section={label} />
      <div className="px-5 pt-16 md:px-10 md:pt-24">
        <Annotation as="span">{label}</Annotation>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink-secondary md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 font-mono text-[10px] tracking-widest2 text-ink-tertiary">NOT AVAILABLE IN THIS PROTOTYPE</p>
      </div>
    </div>);

}