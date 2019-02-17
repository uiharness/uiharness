export type IDescribeArgs = { title: string } & Partial<ICommand>;

/**
 * Represents a single [command] which is a named unit of
 * functionality that can optionally take parameter input.
 */
export type ICommand = {
  title: string;
  handler: CommandHandler;
  children: ICommand[];
};

export type ICommandBuilder = ICommand & {
  length: number;
  children: ICommandBuilder[];
  add(title: string, handler?: CommandHandler): ICommandBuilder;
  add(args: IDescribeArgs): ICommandBuilder;
};

/**
 * The handler that is invoked for a command.
 */
export type CommandHandler = (e: ICommandHandlerArgs) => any;

/**
 * Arguments passed to a command handler.
 */
export type ICommandHandlerArgs = {};
