#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import simpleGit from "simple-git";
import { CommitManager } from "@oh-my-commits/shared";
import { ConsoleLogger } from "./utils/ConsoleLogger";

// Initialize git and commit manager
const git = simpleGit();
const logger = new ConsoleLogger("Oh My Commits CLI");
const commitManager = new CommitManager({ logger });

// Default model
const DEFAULT_MODEL = "omc/standard";

// Command handlers
const listModels = async () => {
  try {
    const models = await commitManager.getAvailableModels();
    console.log(chalk.blue("Available models:"));
    for (const model of models) {
      if (model.id === DEFAULT_MODEL) {
        console.log(chalk.green(`  ✓ ${model.id} - ${model.name} (default)`));
      } else {
        console.log(`  - ${model.id} - ${model.name}`);
      }
    }
  } catch (error) {
    console.error(chalk.red("Failed to list models:"), error);
    process.exit(1);
  }
};

const initConfig = async () => {
  console.log(chalk.blue("Initializing Oh My Commits..."));
  try {
    // TODO: Add actual initialization logic
    // 1. Create config file if not exists
    // 2. Set up default model
    // 3. Configure git hooks if needed
    console.log(chalk.green("Initialization completed!"));
  } catch (error) {
    console.error(chalk.red("Failed to initialize:"), error);
    process.exit(1);
  }
};

const generateAndCommit = async (options: any) => {
  console.log(chalk.blue("Generating commit message..."));
  try {
    const model = options.model || DEFAULT_MODEL;
    const diff = await git.diff(["--staged"]);
    const result = await commitManager.generateCommit(
      {
        changed: 0, // TODO: Parse from git diff
        files: [], // TODO: Parse from git diff
        insertions: 0, // TODO: Parse from git diff
        deletions: 0, // TODO: Parse from git diff
      },
      model
    );

    if (result.isOk()) {
      const commitData = result.value;
      console.log(chalk.green("Generated commit message:"));
      console.log(commitData.title);
      if (commitData.body) {
        console.log("\n" + commitData.body);
      }

      if (options.yes) {
        // Automatically commit if -y flag is provided
        await git.commit([
          commitData.title,
          ...(commitData.body ? [commitData.body] : []),
        ]);
        console.log(chalk.green("Changes committed successfully!"));
      } else {
        // Ask for confirmation
        console.log(chalk.yellow("\nUse -y flag to commit automatically"));
        console.log(
          chalk.yellow("Or run git commit manually with the message above")
        );
      }
    } else {
      console.error(
        chalk.red("Failed to generate commit message:"),
        result.error
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red("Failed to generate commit message:"), error);
    process.exit(1);
  }
};

// Register commands
program
  .name("omc")
  .description("Oh My Commits - AI-powered commit message generator")
  .version("1.0.0");

// Init command
program
  .command("init")
  .description("Initialize Oh My Commits configuration")
  .action(initConfig);

// List models command
program
  .command("list")
  .description("List all available AI Commit models")
  .action(listModels);

// Generate command
program
  .command("gen")
  .description("Generate commit message")
  .option("-y, --yes", "Automatically commit changes")
  .option(
    "-m, --model <model>",
    `Specify the AI model to use (\`omc list\` to see all available models)`
  )
  .action(generateAndCommit);

// Show help by default
program.showHelpAfterError();
if (process.argv.length === 2) {
  program.help();
}

// Parse command line arguments
program.parse(process.argv);
