import * as React from 'react';
import { shell, is, css, COLORS, IMAGE } from './common';

const IMAGES = '/images/splash';

/**
 * Factory for JSX Elements needed by the splash screen.
 */
export const factory: shell.SplashFactory = args => {
  const { theme, type } = args;

  if (type === 'TOP:LEFT') {
    // const text = `ui.shell (sample)`;
    // return renderText({ text, theme });
  }

  if (type === 'TOP:RIGHT') {
    const size = attr('html', 'data-size');
    const version = attr('html', 'data-version');
    const text = size && version ? `version ${version}, size ${size}` : '';
    return renderText({ text, theme });
  }

  if (type === 'BOTTOM:LEFT') {
    const text = `© ${new Date().getFullYear()} Phil Cockfield`;
    return renderText({ text, theme, fontSize: 12 });
  }

  if (type === 'BOTTOM:RIGHT') {
    const style = css({
      Image: IMAGE.LOGO.SPLASH,
      marginRight: 20,
      marginBottom: 15,
    });
    return <div {...style} />;
  }

  return undefined;
};

/**
 * [Helpers]
 */
const attr = (tag: string, key: string) => {
  return is.browser ? document.getElementsByTagName(tag)[0].getAttribute(key) : '';
};

const renderText = (args: {
  text: string;
  theme: shell.ShellTheme;
  margin?: string;
  fontSize?: number;
}) => {
  const style = css({
    margin: args.margin || 10,
    fontSize: args.fontSize || 14,
    opacity: 0.4,
    color: args.theme === 'DARK' ? COLORS.WHITE : COLORS.DARK,
    userSelect: 'none',
  });
  return <div {...style}>{args.text}</div>;
};
