/**
 * Command-line builder.
 */
export class Command {
  private _cmd = '';

  constructor(start?: string) {
    if (start) {
      this.add(start);
    }
  }

  public add(value: string) {
    this._cmd = `${this._cmd} ${value}`;
    return this;
  }

  public arg(value: string) {
    return this.add(`--${trimArg(value)}`);
  }

  public alias(value: string) {
    return this.add(`-${trimArg(value)}`);
  }

  public get value() {
    return this._cmd.trim();
  }

  public toString() {
    return this.value;
  }
}

export const command = (start?: string) => new Command(start);

/**
 * INTERNAL
 */
function trimArg(value: string) {
  return value
    .trim()
    .replace(/^\-*/, '')
    .trim();
}
