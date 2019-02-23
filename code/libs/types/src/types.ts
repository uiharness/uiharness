export type IRuntimeConfig = {
  name: string;
  electron: {
    port: number;
    main: string;
    renderer: string;
  };
};
