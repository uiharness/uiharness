export type IUIHarnessRuntimeConfig = {
  name: string;
  electron: {
    port: number;
    main: string;
    renderer: string;
  };
};
