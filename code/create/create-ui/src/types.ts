export type TemplateId = 'ALL' | 'ELECTRON' | 'WEB';

export interface ITemplate {
  id: TemplateId;
  name: string;
}
