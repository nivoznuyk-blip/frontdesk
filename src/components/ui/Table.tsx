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
}: {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
}) {
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
        {rows.map((row) => (
          <tr
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              'border-b border-line transition-colors duration-fast ease-std',
              onRowClick && 'cursor-pointer hover:bg-surface',
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
        ))}
      </tbody>
    </table>
  );
}
