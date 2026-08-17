import { useState } from 'react';
import { CodeBlock, Tabs } from '@/components/ui';
import { bot } from '@/mock/company';
import type { WidgetSettings } from '@/mock/widget';

const targets = [
  { value: 'html', label: 'HTML' },
  { value: 'react', label: 'React' },
  { value: 'wordpress', label: 'WordPress' },
  { value: 'webflow', label: 'Webflow' },
];

function snippet(target: string, settings: WidgetSettings): string {
  const tag = `<script\n  src="https://cdn.frontdesk.io/w.js"\n  data-bot="${bot.id}"\n  data-accent="${settings.accent}"\n  data-position="${settings.position}"\n  defer\n></script>`;

  if (target === 'react') {
    return [
      `import { Frontdesk } from '@frontdesk/react';`,
      '',
      '<Frontdesk',
      `  botId="${bot.id}"`,
      `  accent="${settings.accent}"`,
      `  position="${settings.position}"`,
      '/>',
    ].join('\n');
  }

  if (target === 'wordpress') {
    return [
      'Install the Frontdesk plugin, then open Settings → Frontdesk',
      'and paste the bot id. The plugin adds the script for you.',
      '',
      `bot id:   ${bot.id}`,
      `accent:   ${settings.accent}`,
      `position: ${settings.position}`,
    ].join('\n');
  }

  if (target === 'webflow') {
    return ['Project settings → Custom code → Footer code', '', tag].join('\n');
  }

  return ['Paste this before the closing </body> tag.', '', tag].join('\n');
}

export function EmbedCode({ settings }: { settings: WidgetSettings }) {
  const [target, setTarget] = useState('html');

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <Tabs items={targets} value={target} onChange={setTarget} />
      </div>
      <CodeBlock code={snippet(target, settings)} />
    </div>
  );
}
