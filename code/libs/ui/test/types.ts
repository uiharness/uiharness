import { Subject } from 'rxjs';

export * from '../src/types';

export type ITestCommandProps = {
  state$: Subject<ITestState>;
};

export type ITestState = {
  message?: string;
};
