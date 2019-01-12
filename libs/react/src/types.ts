export type IWebpackConfig = {
  entry?: string | string[];
};

export type IUIHarnessConfig = {
  webpack?: IUIHarnessWebpackConfig;
};

export type IUIHarnessWebpackConfig = {
  entry: string;
};
