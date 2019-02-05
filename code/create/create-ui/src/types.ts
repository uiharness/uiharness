export {
  IPrompt,
  AfterTemplateMiddleware,
  ITemplateResponse,
} from 'create-tmpl';

export type IAlert = { message: string };

export type Platform = 'ELECTRON' | 'WEB';

export type IVariables = {
  target: Platform[];
  moduleName: string;
  dir: string;
};
