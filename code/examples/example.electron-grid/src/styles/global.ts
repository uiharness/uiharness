import { ROBOTO } from '@tdb/ui.text/lib/common/constants';

import { css } from '../common';

/**
 * Ensure required CSS style sheets are in the <head>.
 */
css.head.importStylesheet(ROBOTO.GOOGLE_FONTS.URL);

/**
 * Global CSS setup.
 */
const GLOBAL = {
  '.tdbGrid': {
    fontFamily: ROBOTO.FAMILY,
  },
};

/**
 * Load styles into the <head>.
 */
css.global(GLOBAL);
