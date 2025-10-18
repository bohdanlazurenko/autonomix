#!/usr/bin/env node
import { Command } from "commander";
import dotenv from "dotenv";
import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";

dotenv.config();

const program = new Command();

const REQUIRED_SECRETS = {
  backend: [
    { name: "PM_MODEL_KEY", description: "Project Manager LLM API key" },
    { name: "RESEARCH_MODEL_KEY", description: "Research LLM API key" },
    { name: "DEV_MODEL_KEY", description: "Developer LLM API key" },
    { name: "GH_PAT", description: "GitHub Personal Access Token" },
    { name: "VERCEL_TOKEN", description: "Vercel API Token" },
    { name: "CLOUDFLARE_API_TOKEN", description: "Cloudflare API Token (optional)" },
    { name: "CLOUDFLARE_ZONE_ID", description: "Cloudflare Zone ID (optional)" },
  ],
  ui: [
    { name: "VERCEL_TOKEN", description: "Vercel API Token" },
    { name: "VERCEL_ORG_ID", description: "Vercel Organization ID" },
    { name: "VERCEL_PROJECT_ID", description: "Vercel Project ID" },
    { name: "BACKEND_URL", description: "Backend API URL" },
  ],
};

function setGitHubSecret(repo, secretName, secretValue, org) {
  try {
    const spinner = ora(`Setting ${secretName} for ${repo}...`).start();
    execSync(`gh secret set ${secretName} -b"${secretValue}" -R ${org}/${repo}`, {
      stdio: "pipe",
    });
    spinner.succeed(`Set ${secretName} for ${repo}`);
  } catch (error) {
    console.error(chalk.red(`❌ Failed to set ${secretName} for ${repo}:`, error.message));
  }
}

program
  .name("setup-secrets")
  .description("Setup GitHub secrets for all repositories")
  .option("-o, --org <org>", "GitHub organization", process.env.GH_ORG || "autonomix")
  .option("-i, --interactive", "Interactive mode (prompt for missing values)", true)
  .action(async (options) => {
    console.log(chalk.blue("🔐 Setting up GitHub secrets"));
    console.log(chalk.gray("═══════════════════════════════════════════\n"));

    const org = options.org;

    // Setup backend secrets
    console.log(chalk.bold("\n📦 Backend secrets:\n"));
    for (const secret of REQUIRED_SECRETS.backend) {
      const value = process.env[secret.name];
      
      if (value) {
        setGitHubSecret("backend", secret.name, value, org);
      } else {
        console.log(chalk.yellow(`⚠️  ${secret.name} not found in .env`));
        console.log(chalk.gray(`   ${secret.description}`));
      }
    }

    // Setup UI secrets
    console.log(chalk.bold("\n🎨 UI secrets:\n"));
    for (const secret of REQUIRED_SECRETS.ui) {
      const value = process.env[secret.name];
      
      if (value) {
        setGitHubSecret("ui", secret.name, value, org);
      } else {
        console.log(chalk.yellow(`⚠️  ${secret.name} not found in .env`));
        console.log(chalk.gray(`   ${secret.description}`));
      }
    }

    console.log(chalk.gray("\n═══════════════════════════════════════════"));
    console.log(chalk.green("\n✅ Secrets setup complete!\n"));
    console.log(chalk.gray("Note: Missing secrets should be added manually to .env"));
  });

program.parse();
