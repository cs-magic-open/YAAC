import * as vscode from "vscode";
import { Loggable } from "@/types/mixins";
import { VscodeCommand } from "@/libs/vscode-command";
import { OpenPreferencesCommand } from "src/commands/open-preferences";
import { QuickCommitCommand } from "src/commands/quick-commit";
import { SelectModelCommand } from "src/commands/select-model";
import {
  COMMAND_OPEN_PREFERENCE,
  COMMAND_QUICK_COMMIT,
  COMMAND_SELECT_MODEL,
} from "@oh-my-commit/shared";
import { AcManager } from "@/services/models.service";
import { VscodeGitService } from "@/services/vscode-git.service";

export class CommandManager extends Loggable(class {}) {
  private readonly commands: Map<string, VscodeCommand> = new Map();

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly gitService: VscodeGitService,
    private readonly acManager: AcManager,
  ) {
    super();

    // Register all commands
    this.registerCommand(COMMAND_OPEN_PREFERENCE, new OpenPreferencesCommand());
    this.registerCommand(
      COMMAND_QUICK_COMMIT,
      new QuickCommitCommand(gitService, acManager, context),
    );
    this.registerCommand(
      COMMAND_SELECT_MODEL,
      new SelectModelCommand(acManager),
    );
  }

  private registerCommand(id: string, command: VscodeCommand): void {
    this.commands.set(id, command);
    this.logger.info(`Registering command: ${id}`);

    const disposable = vscode.commands.registerCommand(id, async () => {
      try {
        await command.execute();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        this.logger.error(`Command ${id} failed: ${message}`);
        vscode.window.showErrorMessage(`Command failed: ${message}`);
      }
    });

    this.context.subscriptions.push(disposable);
  }

  public dispose(): void {
    // this.logger.info("Disposing command manager");
    for (const command of this.commands.values()) {
      if ("dispose" in command) {
        (command as { dispose(): void }).dispose();
      }
    }
  }
}
