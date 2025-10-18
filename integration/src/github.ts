import { Octokit } from "octokit";

export interface EnsureRepoParams {
  org: string;
  name: string;
  pat: string;
}

export interface UpsertFilesParams {
  org: string;
  repo: string;
  pat: string;
  files: { path: string; content: string }[];
  branch?: string;
}

/**
 * Ensure a GitHub repository exists, create it if it doesn't
 */
export async function ensureRepo({ org, name, pat }: EnsureRepoParams): Promise<string> {
  const oc = new Octokit({ auth: pat });
  
  try {
    // Check if repo exists
    await oc.request("GET /repos/{owner}/{repo}", { owner: org, repo: name });
    console.log(`✓ Repository ${org}/${name} already exists`);
  } catch (error: any) {
    if (error.status === 404) {
      // Create repo
      console.log(`Creating repository ${org}/${name}...`);
      
      // Try organization first, fallback to user repo
      try {
        await oc.request("POST /orgs/{org}/repos", {
          org,
          name,
          private: false,
          auto_init: true,
          description: `AutonomiX client application - ${name}`,
        });
      } catch (orgError: any) {
        if (orgError.status === 404) {
          // Not an org, create as user repo
          console.log(`Creating as user repository...`);
          await oc.request("POST /user/repos", {
            name,
            private: false,
            auto_init: true,
            description: `AutonomiX client application - ${name}`,
          });
        } else {
          throw orgError;
        }
      }
      
      console.log(`✓ Repository ${org}/${name} created`);
    } else {
      throw error;
    }
  }
  
  return `https://github.com/${org}/${name}`;
}

/**
 * Upsert files to a GitHub repository branch
 */
export async function upsertFiles({
  org,
  repo,
  pat,
  files,
  branch = "main",
}: UpsertFilesParams): Promise<void> {
  const oc = new Octokit({ auth: pat });

  // 1) Get repository info
  const { data: repoData } = await oc.request("GET /repos/{owner}/{repo}", {
    owner: org,
    repo,
  });

  let baseSha: string | null = null;
  let baseTreeSha: string | undefined = undefined;

  // 2) Try to get existing branch reference
  try {
    const { data: branchRef } = await oc.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
      owner: org,
      repo,
      ref: `heads/${branch}`,
    });
    baseSha = branchRef.object.sha;
    
    // Get the tree for existing commit
    const { data: baseCommit } = await oc.request("GET /repos/{owner}/{repo}/git/commits/{commit_sha}", {
      owner: org,
      repo,
      commit_sha: baseSha,
    });
    baseTreeSha = baseCommit.tree.sha;
    
    console.log(`✓ Branch ${branch} exists, updating...`);
  } catch (error: any) {
    if (error.status === 404) {
      // Branch doesn't exist - this is a new repository
      console.log(`Branch ${branch} doesn't exist, creating initial commit...`);
    } else {
      throw error;
    }
  }

  // 3) Create tree with new files
  console.log(`Creating tree with ${files.length} files...`);
  const { data: tree } = await oc.request("POST /repos/{owner}/{repo}/git/trees", {
    owner: org,
    repo,
    base_tree: baseTreeSha,
    tree: files.map((f) => ({
      path: f.path,
      mode: "100644" as const,
      type: "blob" as const,
      content: f.content,
    })),
  });

  // 4) Create commit
  console.log(`Creating commit...`);
  const commitParams: any = {
    owner: org,
    repo,
    message: `autogen: update ${new Date().toISOString()}`,
    tree: tree.sha,
  };
  
  if (baseSha) {
    commitParams.parents = [baseSha];
  }
  
  const { data: commit } = await oc.request("POST /repos/{owner}/{repo}/git/commits", commitParams);

  // 5) Create or update branch reference
  if (baseSha) {
    console.log(`Updating branch ${branch}...`);
    await oc.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
      owner: org,
      repo,
      ref: `heads/${branch}`,
      sha: commit.sha,
      force: true,
    });
  } else {
    console.log(`Creating branch ${branch}...`);
    await oc.request("POST /repos/{owner}/{repo}/git/refs", {
      owner: org,
      repo,
      ref: `refs/heads/${branch}`,
      sha: commit.sha,
    });
  }

  console.log(`✓ Successfully committed ${files.length} files to ${branch}`);
}

/**
 * Create a deploy hook webhook for automatic deployments
 */
export async function createGithubWebhook({
  org,
  repo,
  pat,
  hookUrl,
}: {
  org: string;
  repo: string;
  pat: string;
  hookUrl: string;
}): Promise<void> {
  const oc = new Octokit({ auth: pat });

  await oc.request("POST /repos/{owner}/{repo}/hooks", {
    owner: org,
    repo,
    config: {
      url: hookUrl,
      content_type: "json",
    },
    events: ["push"],
    active: true,
  });

  console.log(`✓ Deploy hook created for ${org}/${repo}`);
}
