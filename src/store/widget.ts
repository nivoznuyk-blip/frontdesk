import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultWidget } from '@/mock/widget';
import type { WidgetSettings } from '@/mock/widget';

interface WidgetState {
  settings: WidgetSettings;
  set: <K extends keyof WidgetSettings>(key: K, value: WidgetSettings[K]) => void;
  reset: () => void;
}

/** Widget settings are the customer's work, so they survive a refresh. */
export const useWidget = create<WidgetState>()(
  persist(
    (setState) => ({
      settings: defaultWidget,
      set: (key, value) =>
        setState((state) => ({ settings: { ...state.settings, [key]: value } })),
      reset: () => setState({ settings: defaultWidget }),
    }),
    { name: 'frontdesk.widget', version: 1 },
  ),
);
