import { Subject } from 'rxjs';
import { IContext } from '../types';

export * from '../types';

export type IMenuContext = IContext & {
  changed$: Subject<any>;
};
