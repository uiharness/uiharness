export type Environment = 'production' | 'development';

export type IUihRuntimeConfig = {
  name: string;
  electron: {
    port: number;
    main: string;
    renderer: string;
  };
};
