export {
  IPrompt,
  AfterTemplateMiddleware,
  ITemplateResponse,
} from 'create-tmpl';

export type IAlert = { message: string };

export type Platform = 'ELECTRON' | 'WEB';
export type TemplateType = 'MINIMAL' | 'PLATFORM';

export type IVariables = {
  template: TemplateType;
  platform: Platform[];
  moduleName: string;
  dir: string;
};

export type ITSConfig = {
  extends: string;
  include: string[];
  compilerOptions: {
    outDir: string;
  };
};
