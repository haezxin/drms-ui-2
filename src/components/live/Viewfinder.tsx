import React from 'react';

/** Fine corner brackets framing a live media surface. */
export function Viewfinder() {
  const corner = 'absolute h-4 w-4 border-white/45';
  return (
    <div aria-hidden className="pointer-events-none absolute inset-3 md:inset-4">
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </div>);

}