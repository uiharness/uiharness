import { ICommand, value } from '../common';

type ICommandArgs = ICommand & {};

/**
 * Represents a single [command] which is a named unit of
 * functionality that can optionally take parameter input.
 */
export class Command implements ICommand {
  private _: ICommandArgs;

  /**
   * [Constructor]
   */
  constructor(args: Partial<ICommandArgs>) {
    const title = (args.title || '').trim();
    const handler = args.handler || (() => null);
    const children = args.children || [];

    if (!title) {
      throw new Error(`A command title must be specified.`);
    }

    this._ = { title, handler, children };
  }

  /**
   * [Properties]
   */
  public get title() {
    return this._.title;
  }

  public get handler() {
    return this._.handler;
  }

  public get children() {
    return this._.children;
  }

  /**
   * [Methods]
   */
  public clone(options: { deep?: boolean } = {}) {
    const deep = value.defaultValue(options.deep, true);
    let args = { ...this._ };

    if (deep) {
      const children: ICommand[] = this.children
        .map(child => child as Command)
        .map(child => child.clone());
      args = { ...args, children };
    }

    return new Command(args);
  }
}
