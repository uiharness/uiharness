import { ICommand, CommandHandler } from '../common';

type ICommandArgs = {
  title: string;
  handler: CommandHandler;
};

/**
 * Represents a single [command] which is a named unit of
 * functionality that can optionally take parameter input.
 */
export class Command implements ICommand {
  private _: ICommandArgs;

  /**
   * [Constructor]
   */
  constructor(args: ICommandArgs) {
    args = { ...args };
    args.title = (args.title || '').trim();

    if (!args.title) {
      throw new Error(`A command title must be specified.`);
    }

    this._ = args;
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
}
