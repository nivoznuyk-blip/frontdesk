import type { ReactNode } from 'react';

/**
 * Scaffolding for layer 2. Each screen replaces its own stub as it is built,
 * and this file goes away once the last one is done.
 */
export function PageStub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-h2 font-medium">{title}</h1>
      <p className="max-w-measure text-dim">{children}</p>
    </section>
  );
}
