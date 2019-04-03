import { fs, time } from '../common';
// import * as readline from 'readline';
// import { Writable } from 'stream';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec quam lorem. Praesent fermentum, augue ut porta varius, eros nisl euismod ante, ac suscipit elit libero nec dolor. Morbi magna enim, molestie non arcu id, varius sollicitudin neque. In sed quam mauris. Aenean mi nisl, elementum non arcu quis, ultrices tincidunt augue. Vivamus fermentum iaculis tellus finibus porttitor. Nulla eu purus id dolor auctor suscipit. Integer lacinia sapien at ante tempus volutpat.';

(async () => {
  const timer = time.timer();
  const dir = fs.resolve('.');

  const paths = await fs.glob.find(fs.join(dir, 'src/**/*.ts'));

  // console.log('paths', paths);

  const r = await filesContain(paths, /common'\;/);
  // const r = await fileContains(fs.resolve('./tmp/LONG.txt'), 'Lorem');

  // await TMP();
  console.log('r', r);

  console.log('\n\n-------------------------------------------');
  console.log(`${timer.elapsed()}ms\n\n`);
})();

export async function filesContain(paths: string[], regex: RegExp) {
  const result = { checked: 0, contains: false };
  for (const path of paths) {
    // const f = await fileContains(path, regex);
    result.checked++;
    if (await fileContains(path, regex)) {
      console.log('path', path);
      // return true;
      result.contains = true;
      break;
    } else {
      console.log('NO', path);
    }
  }
  return result;
}

async function fileContains(path: string, regex: RegExp) {
  return new Promise<boolean>((resolve, reject) => {
    const file = fs.createReadStream(path);
    // const outstream = new Writable();
    // const rl = readline.createInterface(instream, outstream);
    // let isContained = false;

    file.on('data', chunk => {
      if (regex.test(chunk.toString())) {
        file.destroy();
        resolve(true);
      }
    });

    file.once('end', () => resolve(false));
    file.once('error', () => reject());

    // console.log('path', path);

    // rl.on('line', line => {
    //   console.log('>>line', line);
    //   // rl.close();
    //   instream.close();
    //   instream.destroy();
    //   outstream.destroy();
    //   rl.close();
    // });

    // rl.on('close', () => {
    //   console.log('close');
    //   resolve();
    // });
  });
}

async function TMP() {
  const path = fs.resolve('./tmp/LONG.txt');

  let text = '';

  Array.from({ length: 1000000 }).forEach((v, i) => {
    text += `${i}) ${LOREM}\n\n`;
  });

  await fs.writeFile(path, text);
}
