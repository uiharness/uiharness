export type Platform = 'ELECTRON' | 'WEB';

export type IPrompt<T extends string = any> = {
  id: T;
  label?: string;
};

export type IVariables = { target: Platform[] };
