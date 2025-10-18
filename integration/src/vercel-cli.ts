import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Deploy to Vercel using CLI from Git repository
 */
export async function deployFromGit({
  token,
  githubUrl,
  projectName,
  orgId,
}: {
  token: string;
  githubUrl: string;
  projectName: string;
  orgId?: string;
}): Promise<{ url: string; deploymentId: string }> {
  console.log(`Deploying from Git: ${githubUrl}`);
  
  const tempDir = `/tmp/vercel-deploy-${Date.now()}`;
  
  try {
    // 1. Clone repository
    console.log(`  Cloning repository to ${tempDir}...`);
    await execAsync(`git clone ${githubUrl} ${tempDir}`);
    
    // 2. Deploy to Vercel
    console.log(`  Deploying to Vercel...`);
    const vercelCommand = `cd ${tempDir} && vercel --token ${token} --prod --yes${orgId ? ` --scope ${orgId}` : ''} --name ${projectName}`;
    
    const { stdout, stderr } = await execAsync(vercelCommand);
    
    // Extract deployment URL from output
    const urlMatch = stdout.match(/https:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : '';
    
    console.log(`  ✅ Deployed to: ${url}`);
    
    // Cleanup
    await execAsync(`rm -rf ${tempDir}`);
    
    return {
      url,
      deploymentId: url.split('/').pop() || '',
    };
  } catch (error: any) {
    console.error(`Deployment failed: ${error.message}`);
    // Cleanup on error
    try {
      await execAsync(`rm -rf ${tempDir}`);
    } catch {}
    throw error;
  }
}
