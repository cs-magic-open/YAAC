import * as vscode from "vscode";
import { GitCore } from "@/core/git.core";

export class VscodeGitService extends GitCore {
  private _onGitStatusChanged: vscode.EventEmitter<boolean>;
  readonly onGitStatusChanged: vscode.Event<boolean>;
  private fsWatcher: vscode.FileSystemWatcher | undefined;

  constructor() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceRoot = workspaceFolders ? workspaceFolders[0].uri.fsPath : "";
    
    super(workspaceRoot);
    
    this._onGitStatusChanged = new vscode.EventEmitter<boolean>();
    this.onGitStatusChanged = this._onGitStatusChanged.event;
    
    this.setupFileSystemWatcher(workspaceRoot);
  }

  private setupFileSystemWatcher(workspaceRoot: string) {
    this.fsWatcher?.dispose();
    this.fsWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, "**/.git/**")
    );

    const handleGitChange = () => {
      this._onGitStatusChanged.fire(true);
    };

    this.fsWatcher.onDidChange(handleGitChange);
    this.fsWatcher.onDidCreate(handleGitChange);
    this.fsWatcher.onDidDelete(handleGitChange);
  }

  dispose() {
    this.fsWatcher?.dispose();
    this._onGitStatusChanged.dispose();
  }

  public async getRecentCommits(count: number = 5): Promise<Array<{ hash: string; message: string; date: string }>> {
    try {
      const logs = await this.git.log({ maxCount: count });
      return logs.all.map(log => ({
        hash: log.hash,
        message: log.message,
        date: new Date(log.date).toLocaleDateString()
      }));
    } catch (error) {
      console.error('Failed to get recent commits:', error);
      return [];
    }
  }
}