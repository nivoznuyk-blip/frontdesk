import { useEffect } from 'react';

const SUFFIX = 'Frontdesk';

/** Every route names itself in the tab, so a row of them stays legible. */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title === SUFFIX ? title : `${title} · ${SUFFIX}`;
  }, [title]);
}
