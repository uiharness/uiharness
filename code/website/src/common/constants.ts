import { image } from './libs';

export const COLORS = {
  WHITE: '#FFF',
  DARK: '#293042', // Inky blue/black.
  BLUE: '#4B89FF',
  PINK: '#BA6C8B',
};

const IMAGES = '/images';
export const IMAGE = {
  LOGO: {
    SPLASH: [`${IMAGES}/splash/logo.png`, `${IMAGES}/splash/logo@2x.png`, 212, 91],
    MAIN: image({
      x1: `${IMAGES}/main/logo.png`,
      x2: `${IMAGES}/main/logo@2x.png`,
      width: 357,
      height: 143,
    }),
  },
};
