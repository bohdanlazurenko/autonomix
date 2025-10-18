#!/usr/bin/env node
import { Command } from "commander";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import chalk from "chalk";

dotenv.config();

const program = new Command();

program
  .name("create-tenant")
  .description("Create a new tenant in the system")
  .argument("<tenant-id>", "Unique tenant identifier")
  .option("-o, --org <org>", "GitHub organization", process.env.GH_ORG || "autonomix")
  .action(async (tenantId, options) => {
    console.log(chalk.blue("🏢 Creating tenant: ") + chalk.bold(tenantId));
    console.log(chalk.gray("═══════════════════════════════════════════\n"));

    // Create tenant metadata
    const tenant = {
      id: tenantId,
      name: tenantId.charAt(0).toUpperCase() + tenantId.slice(1),
      createdAt: new Date().toISOString(),
      org: options.org,
      status: "pending",
      quotas: {
        maxDeploys: 5,
        maxProjects: 3,
      },
      subdomain: `${tenantId}.${process.env.CLOUDFLARE_DOMAIN || "my-it-co.app"}`,
    };

    // Ensure tmp directory exists
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Save tenant metadata
    const tenantFile = path.join(tmpDir, `${tenantId}.json`);
    fs.writeFileSync(tenantFile, JSON.stringify(tenant, null, 2));

    console.log(chalk.green("✓") + " Tenant metadata created");
    console.log(chalk.gray(`  File: ${tenantFile}`));
    console.log(chalk.gray(`  Subdomain: ${tenant.subdomain}`));
    console.log(chalk.gray(`  Max deploys: ${tenant.quotas.maxDeploys}`));
    
    console.log(chalk.gray("\n═══════════════════════════════════════════"));
    console.log(chalk.green("✅ Tenant created successfully!\n"));
  });

program.parse();
