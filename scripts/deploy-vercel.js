#!/usr/bin/env node
import { Command } from "commander";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { deployForTenant, withRetry } from "@autonomix/integration";

dotenv.config();

const program = new Command();

program
  .name("deploy-vercel")
  .description("Deploy tenant application to Vercel")
  .argument("<tenant-id>", "Tenant identifier")
  .option("--no-retry", "Disable retry on failure")
  .action(async (tenantId, options) => {
    console.log(chalk.blue("🚀 Deploying application for: ") + chalk.bold(tenantId));
    console.log(chalk.gray("═══════════════════════════════════════════\n"));

    const tmpDir = path.join(process.cwd(), "tmp");
    const tenantFile = path.join(tmpDir, `${tenantId}.json`);

    // Load tenant metadata
    if (!fs.existsSync(tenantFile)) {
      console.error(chalk.red("❌ Tenant not found. Run create-tenant and generate-app first."));
      process.exit(1);
    }

    const tenant = JSON.parse(fs.readFileSync(tenantFile, "utf8"));

    if (!tenant.files || tenant.files.length === 0) {
      console.error(chalk.red("❌ No files generated. Run generate-app first."));
      process.exit(1);
    }

    // Validate environment variables
    const requiredVars = ["GH_PAT", "VERCEL_TOKEN"];
    const missing = requiredVars.filter((v) => !process.env[v]);
    
    if (missing.length > 0) {
      console.error(chalk.red(`❌ Missing environment variables: ${missing.join(", ")}`));
      console.error(chalk.gray("Please configure these in your .env file"));
      process.exit(1);
    }

    const deployConfig = {
      tenant: tenantId,
      files: tenant.files,
      ghOrg: process.env.GH_ORG || "autonomix",
      ghPat: process.env.GH_PAT,
      vercelToken: process.env.VERCEL_TOKEN,
      vercelOrgId: process.env.VERCEL_ORG_ID,
      cloudflareToken: process.env.CLOUDFLARE_API_TOKEN,
      cloudflareZoneId: process.env.CLOUDFLARE_ZONE_ID,
      baseDomain: process.env.CLOUDFLARE_DOMAIN,
    };

    try {
      const deploy = async () => await deployForTenant(deployConfig);
      
      let result;
      if (options.retry !== false) {
        result = await withRetry(deploy, 3, 2000);
      } else {
        result = await deploy();
      }

      // Update tenant metadata
      tenant.deployment = {
        repoUrl: result.repoUrl,
        deployUrl: result.deployUrl,
        subdomain: result.subdomain,
        deployedAt: new Date().toISOString(),
      };
      tenant.status = "deployed";
      fs.writeFileSync(tenantFile, JSON.stringify(tenant, null, 2));

      // Save URLs to separate files for Makefile
      fs.writeFileSync(path.join(tmpDir, `${tenantId}.repo-url`), result.repoUrl);
      fs.writeFileSync(path.join(tmpDir, `${tenantId}.deploy-url`), result.deployUrl);

      console.log(chalk.green("\n✅ Deployment successful!\n"));
      console.log(chalk.bold("Access your application:"));
      console.log(chalk.cyan(`  ${result.deployUrl}`));
      
      if (result.subdomain) {
        console.log(chalk.cyan(`  https://${result.subdomain}`));
      }
      
      console.log(chalk.gray(`\nRepository: ${result.repoUrl}`));
    } catch (error) {
      console.error(chalk.red("\n❌ Deployment failed:"), error.message);
      
      // Update tenant status
      tenant.status = "failed";
      tenant.error = error.message;
      fs.writeFileSync(tenantFile, JSON.stringify(tenant, null, 2));
      
      process.exit(1);
    }
  });

program.parse();
