import { Log } from '@tdb/log/lib/types';
export { Log };

export * from '@uiharness/types';

/**
 * IPC Events.
 */
export type IUIHarnessEvents = IFooEvent;
type IFooEvent = { type: 'UIH/foo'; payload: {} }; // TEMP placeholder 🐷
