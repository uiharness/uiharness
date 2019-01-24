import {
  constants,
  log,
  logging,
  parcel,
  Settings,
  exec,
  fsPath,
} from '../common';
import { init } from './init';
import { stats } from './stats';

/**
 * Runs the JS bundler.
 */
export async function bundle(args: { settings: Settings; isProd?: boolean }) {
  const { settings, isProd } = args;
  // if (isProd) {
  //   process.env.NODE_ENV = 'production';
  // }

  const { PATH } = constants;
  const { MAIN, RENDERER } = PATH;
  const mainDir = MAIN.OUT_DIR;
  const rendererDir = isProd ? RENDERER.OUT_DIR.PROD : RENDERER.OUT_DIR.DEV;
  const env = isProd ? 'production' : 'development';

  // Ensure the module is initialized.
  // await init({ settings });

  const cmd = `
    export NODE_ENV="${env}"
    cd ${fsPath.resolve('.')}
  
    # Bundle main.
    parcel build src/main.ts --out-dir ${mainDir} --target electron
        
    # Bundle renderer.
    parcel build src/index.html --public-url ./ --out-dir ${rendererDir}
    
  `;

  log.info.green(cmd);

  console.log('-------------------------------------------');
  await exec.run(cmd);

  // Build JS bundles and run the electron-builder.
  // await parcel.build(settings, { isProd });

  // Log results.
  const formatPath = (path: string) => logging.formatPath(path, true);

  log.info();
  log.info(`🤟  Javascript bundling complete.\n`);
  log.info.gray(`   • version:     ${settings.package.version}`);
  log.info.gray(`   • env:         ${log.yellow(env)}`);
  log.info.gray(`   • main entry:  ${formatPath(MAIN.ENTRY)}`);
  log.info.gray(`   • output:      ${formatPath(MAIN.OUT_DIR)}`);
  log.info.gray(`                  ${formatPath(rendererDir)}`);

  log.info();
  await stats({ settings, isProd, moduleInfo: false });

  // Finish up.
  log.info();
  process.exit(0);
}
