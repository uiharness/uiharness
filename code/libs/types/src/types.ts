export type Environment = 'production' | 'development';

export type IRuntimeConfig = {
  name: string;
  electron: {
    port: number;
    main: string;
    renderer: {
      [id: string]: {
        label: string;
        path: string;
      };
    };
  };
};
