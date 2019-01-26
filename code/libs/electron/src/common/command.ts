import { exec } from './libs';

/**
 * Command-line builder.
 */
export class Command {
  private _cmd = '';

  constructor(start?: string | Command) {
    if (start) {
      this._cmd = start.toString();
    }
  }

  public add(value: string | Command) {
    let cmd = this._cmd;
    if (!cmd.endsWith('\n')) {
      cmd += ' ';
    }
    cmd += value.toString();
    return new Command(cmd);
  }

  public addLine(value: string) {
    return this.add(value).newLine();
  }

  public newLine() {
    const cmd = `${this._cmd}\n`;
    return new Command(cmd);
  }

  public arg(value: string) {
    return this.add(`--${trimArg(value)}`);
  }

  public alias(value: string) {
    return this.add(`-${trimArg(value)}`);
  }

  public get value() {
    const newLine = this._cmd.endsWith('\n');
    let cmd = this._cmd.trim();
    if (newLine) {
      cmd += '\n';
    }
    return cmd;
  }

  public toString() {
    return this.value;
  }

  public clone() {
    return new Command(this);
  }

  public run(options: { silent?: boolean } = {}) {
    return exec.run(this.toString(), options);
  }
}

export const command = (start?: string | Command) => new Command(start);

/**
 * INTERNAL
 */
function trimArg(value: string) {
  return value
    .trim()
    .replace(/^\-*/, '')
    .trim();
}
