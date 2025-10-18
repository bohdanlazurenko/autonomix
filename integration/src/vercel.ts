import axios from "axios";

export interface VercelDeployParams {
  token: string;
  projectName: string;
  gitSource: {
    type: "github";
    org: string;
    repo: string;
    ref: string;
  };
}

export interface VercelProject {
  id: string;
  name: string;
}

/**
 * Create or get Vercel project
 */
export async function ensureVercelProject({
  token,
  projectName,
  orgId,
  gitRepo,
}: {
  token: string;
  projectName: string;
  orgId?: string;
  gitRepo?: string;
}): Promise<VercelProject> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    // Check if project exists
    const { data } = await axios.get(
      `https://api.vercel.com/v9/projects/${projectName}${orgId ? `?teamId=${orgId}` : ""}`,
      { headers }
    );
    console.log(`✓ Vercel project ${projectName} exists`);
    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Create project
      console.log(`Creating Vercel project ${projectName}...`);
      console.log(`  Token: ${token.substring(0, 10)}...`);
      console.log(`  OrgId: ${orgId || 'none'}`);
      const createData: any = {
        name: projectName,
        framework: "nextjs",
        buildCommand: "npm run build",
        outputDirectory: ".next",
      };

      // Note: gitRepository commented out because it requires GitHub connection in Vercel
      // if (gitRepo) {
      //   createData.gitRepository = {
      //     type: "github",
      //     repo: gitRepo,
      //   };
      // }

      try {
        const { data } = await axios.post(
          `https://api.vercel.com/v9/projects${orgId ? `?teamId=${orgId}` : ""}`,
          createData,
          { headers }
        );
        console.log(`✓ Vercel project ${projectName} created`);
        return data;
      } catch (createError: any) {
        console.error(`Failed to create Vercel project:`);
        console.error(`  Status: ${createError.response?.status}`);
        console.error(`  Error: ${JSON.stringify(createError.response?.data, null, 2)}`);
        throw createError;
      }
    }
    console.error(`Failed to check Vercel project:`);
    console.error(`  Status: ${error.response?.status}`);
    console.error(`  Error: ${JSON.stringify(error.response?.data, null, 2)}`);
    throw error;
  }
}

/**
 * Deploy files directly to Vercel (no Git required)
 */
export async function deployFiles({
  token,
  projectName,
  files,
  orgId,
}: {
  token: string;
  projectName: string;
  files: Array<{ path: string; content: string }>;
  orgId?: string;
}): Promise<{ deploymentId: string; url: string }> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  console.log(`Deploying ${files.length} files to Vercel...`);

  // Convert files to Vercel format
  const vercelFiles = files.map(file => ({
    file: file.path,
    data: Buffer.from(file.content).toString('base64'),
    encoding: 'base64'
  }));

  const deploymentData: any = {
    name: projectName,
    files: vercelFiles,
    projectSettings: {
      framework: 'nextjs',
      buildCommand: 'npm run build',
      outputDirectory: '.next',
    },
    target: 'production',
  };

  try {
    const url = `https://api.vercel.com/v13/deployments${orgId ? `?teamId=${orgId}` : ''}`;
    const { data } = await axios.post(url, deploymentData, { headers });

    console.log(`✓ Deployment created: ${data.id}`);
    console.log(`  URL: https://${data.url}`);
    
    return {
      deploymentId: data.id,
      url: `https://${data.url}`,
    };
  } catch (error: any) {
    console.error(`Failed to deploy to Vercel:`);
    console.error(`  Status: ${error.response?.status}`);
    console.error(`  Error: ${JSON.stringify(error.response?.data, null, 2)}`);
    throw error;
  }
}

/**
 * Trigger a deployment via Vercel API (Git-based)
 */
export async function triggerDeploy({
  token,
  projectName,
  gitSource,
}: VercelDeployParams): Promise<string> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  console.log(`Triggering deployment for ${projectName}...`);

  const { data } = await axios.post(
    "https://api.vercel.com/v13/deployments",
    {
      name: projectName,
      gitSource: {
        type: gitSource.type,
        repoId: `${gitSource.org}/${gitSource.repo}`,
        ref: gitSource.ref,
      },
      target: "production",
    },
    { headers }
  );

  console.log(`✓ Deployment triggered: ${data.url}`);
  return data.url;
}

/**
 * Wait for deployment to complete
 */
export async function waitForDeployment({
  token,
  deploymentId,
  maxWaitMs = 300000, // 5 minutes
  pollIntervalMs = 5000,
}: {
  token: string;
  deploymentId: string;
  maxWaitMs?: number;
  pollIntervalMs?: number;
}): Promise<string> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const { data } = await axios.get(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
      headers,
    });

    console.log(`Deployment status: ${data.readyState}`);

    if (data.readyState === "READY") {
      return `https://${data.url}`;
    }

    if (data.readyState === "ERROR" || data.readyState === "CANCELED") {
      throw new Error(`Deployment failed with state: ${data.readyState}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error("Deployment timeout");
}

/**
 * Get latest deployment for a project
 */
export async function getLatestDeployment({
  token,
  projectId,
  orgId,
}: {
  token: string;
  projectId: string;
  orgId?: string;
}): Promise<{ url: string; state: string } | null> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const { data } = await axios.get(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}${orgId ? `&teamId=${orgId}` : ""}&limit=1`,
    { headers }
  );

  if (data.deployments && data.deployments.length > 0) {
    const deployment = data.deployments[0];
    return {
      url: `https://${deployment.url}`,
      state: deployment.readyState,
    };
  }

  return null;
}

/**
 * Create deployment hook URL for GitHub Actions
 */
export async function createDeployHook({
  token,
  projectId,
  name = "github-deploy",
}: {
  token: string;
  projectId: string;
  name?: string;
}): Promise<string> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const { data } = await axios.post(
    `https://api.vercel.com/v1/integrations/deploy/${projectId}/${name}`,
    {},
    { headers }
  );

  console.log(`✓ Deploy hook created: ${data.url}`);
  return data.url;
}
