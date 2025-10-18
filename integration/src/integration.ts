import { ensureRepo, upsertFiles } from "./github.js";
import { ensureVercelProject, getLatestDeployment, deployFiles } from "./vercel.js";
import { setupTenantSubdomain } from "./cloudflare.js";
import { deployFromGit } from "./vercel-cli.js";

export interface DeploymentConfig {
  tenant: string;
  files: { path: string; content: string }[];
  ghOrg: string;
  ghPat: string;
  vercelToken: string;
  vercelOrgId?: string;
  cloudflareToken?: string;
  cloudflareZoneId?: string;
  baseDomain?: string;
}

export interface DeploymentResult {
  repoUrl: string;
  deployUrl: string;
  subdomain?: string;
}

/**
 * Full deployment pipeline for a tenant
 */
export async function deployForTenant(config: DeploymentConfig): Promise<DeploymentResult> {
  const repoName = `${config.tenant}-app`;

  console.log(`\n🚀 Starting deployment for tenant: ${config.tenant}`);
  console.log(`═══════════════════════════════════════════════════\n`);

  // Step 1: Ensure GitHub repository exists
  console.log("📦 Step 1/4: Setting up GitHub repository...");
  const repoUrl = await ensureRepo({
    org: config.ghOrg,
    name: repoName,
    pat: config.ghPat,
  });

  // Step 2: Commit generated files
  console.log("\n📝 Step 2/4: Committing generated files...");
  await upsertFiles({
    org: config.ghOrg,
    repo: repoName,
    pat: config.ghPat,
    files: config.files,
    branch: "autogen",
  });

  // Step 3: Deploy directly to Vercel with files
  console.log("\n🌐 Step 3/4: Deploying to Vercel...");
  
  let deployUrl: string;
  
  try {
    // Try direct file deployment (no Git connection required)
    const deployment = await deployFiles({
      token: config.vercelToken,
      projectName: repoName,
      files: config.files,
      orgId: config.vercelOrgId,
    });
    
    deployUrl = deployment.url;
    console.log(`✅ Deployed successfully: ${deployUrl}`);
    
  } catch (error: any) {
    console.log(`⚠️  Direct deploy failed, trying Git-based deploy...`);
    
    // Fallback to Git-based deployment using Vercel CLI
    try {
      const gitDeployment = await deployFromGit({
        token: config.vercelToken,
        githubUrl: repoUrl,
        projectName: repoName,
        orgId: config.vercelOrgId,
      });
      
      deployUrl = gitDeployment.url;
      console.log(`✅ Git-based deploy successful: ${deployUrl}`);
      
    } catch (gitError: any) {
      console.error(`❌ Both deployment methods failed`);
      throw new Error(`Deployment failed: ${gitError.message}`);
    }
  }

  // Step 4: Verify deployment
  console.log("\n⏳ Step 4/4: Verifying deployment...");

  // Optional: Setup custom subdomain
  let subdomain: string | undefined;
  if (config.cloudflareToken && config.cloudflareZoneId && config.baseDomain) {
    console.log("\n🌍 Setting up custom subdomain...");
    subdomain = await setupTenantSubdomain({
      token: config.cloudflareToken,
      zoneId: config.cloudflareZoneId,
      tenant: config.tenant,
      target: new URL(deployUrl).hostname,
      baseDomain: config.baseDomain,
    });
  }

  console.log(`\n✅ Deployment complete!`);
  console.log(`═══════════════════════════════════════════════════`);
  console.log(`Repository: ${repoUrl}`);
  console.log(`Deployment: ${deployUrl}`);
  if (subdomain) {
    console.log(`Custom URL: https://${subdomain}`);
  }
  console.log(`═══════════════════════════════════════════════════\n`);

  return {
    repoUrl,
    deployUrl,
    subdomain,
  };
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.log(`⚠️  Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
