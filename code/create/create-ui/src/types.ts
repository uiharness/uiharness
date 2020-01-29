export type IAlert = { message: string };

export type Platform = 'ELECTRON' | 'WEB';
export type TemplateType = 'minimal' | 'platform';

export type IVariables = {
  template: TemplateType;
  platform: Platform[];
  moduleName: string;
  dir: string;
};
