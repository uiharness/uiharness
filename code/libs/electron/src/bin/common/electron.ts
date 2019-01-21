import * as builder from 'electron-builder';

/**
 * Runs the electron builder.
 */
export async function build() {
  const res = await builder.build({
    arch: 'x64',
    publish: 'never',
  });
  return res;
}
