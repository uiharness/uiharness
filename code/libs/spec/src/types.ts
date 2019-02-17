/**
 * Represents a single [command] which is a named unit of
 * functionality that can optionally take parameter input.
 */
export type ICommand = {
  title: string;
};

/**
 * The handler that is invoked for a command.
 */
export type CommandHandler = (e: ICommandHandlerArgs) => any;

/**
 * Arguments passed to a command handler.
 */
export type ICommandHandlerArgs = {};
