export type ViewTypes = 'preview' | 'main' | 'summary';

export interface Navigation {
  view: ViewTypes;
  stage: number;
  subStage: number;
}
