/**
 * Entry
 */
export type IUIHarnessConfigEntry = {
  title?: string;
  path?: string;
};

/**
 * An entry point for the UIHarness.
 */
export type IUIHarnessEntry = {
  title: string;
  path: string;
  html: {
    absolute: string;
    relative: string;
  };
  exists: boolean;
};

/**
 * NPM Package.
 */
export type IPackageJson = {
  name?: string;
  description?: string;
  version?: string;
  main?: string;
  scripts?: IPackageFields;
  dependencies?: IPackageFields;
  devDependencies?: IPackageFields;
};
export type IPackageFields = { [key: string]: string };
export type PackageFieldsKey =
  | 'scripts'
  | 'dependencies'
  | 'devDependencies'
  | 'peerDependencies'
  | 'resolutions';
