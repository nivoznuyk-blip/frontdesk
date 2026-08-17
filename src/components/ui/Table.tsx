import { Fragment, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  width?: string;
  render: (row: T) => ReactNode;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  empty,
  detail,
}: {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  /** Return a node to make the row open it on click, or null to leave the row plain. */
  detail?: (row: T) => ReactNode | null;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  if (rows.length === 0 && empty) return <>{empty}</>;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-line">
          {columns.map((c) => (
            <th
              key={c.key}
              style={{ width: c.width }}
              className={cn(
                'px-3 py-2 font-mono text-micro font-normal text-faint first:pl-0 last:pr-0',
                c.align === 'right' ? 'text-right' : 'text-left',
              )}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const key = rowKey(row);
          const detailNode = detail?.(row) ?? null;
          const open = detailNode !== null && openKey === key;
          const toggle = () => setOpenKey(open ? null : key);

          return (
            <Fragment key={key}>
              <tr
                onClick={detailNode ? toggle : onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  detailNode
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggle();
                        }
                      }
                    : undefined
                }
                tabIndex={detailNode ? 0 : undefined}
                aria-expanded={detailNode ? open : undefined}
                className={cn(
                  'border-b border-line transition-colors duration-fast ease-std',
                  Boolean(detailNode || onRowClick) && 'cursor-pointer hover:bg-surface',
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      'h-11 px-3 align-middle text-sm text-text first:pl-0 last:pr-0',
                      c.align === 'right' && 'text-right tnum font-mono',
                    )}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>

              {open && (
                <tr className="border-b border-line">
                  <td colSpan={columns.length} className="p-0">
                    <div className="pb-4">{detailNode}</div>
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
