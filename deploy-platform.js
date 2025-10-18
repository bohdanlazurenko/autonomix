#!/usr/bin/env node
/**
 * Deploy AutonomiX Platform to Vercel
 * This creates the FULL WORKING platform with backend + UI
 */

import { deployForTenant } from '@autonomix/integration';
import 'dotenv/config';

async function deployPlatform() {
  console.log('🚀 Deploying AutonomiX Platform to Vercel...\n');

  try {
    // Read current backend and UI files
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const serverJs = await fs.readFile('./backend/src/server.js', 'utf-8');
    const tasksRoute = await fs.readFile('./backend/src/routes/tasks.js', 'utf-8');
    const tenantsRoute = await fs.readFile('./backend/src/routes/tenants.js', 'utf-8');
    const healthRoute = await fs.readFile('./backend/src/routes/health.js', 'utf-8');
    const uiHtml = await fs.readFile('./ui-simple/index.html', 'utf-8');
    
    // Update UI to use production API
    const productionHtml = uiHtml.replace(
      'const API_BASE = "http://localhost:3001/api";',
      'const API_BASE = "/api";'
    );

    const files = [
      // Package.json for full-stack app
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'autonomix-platform',
          version: '1.0.0',
          type: 'module',
          scripts: {
            start: 'node api/server.js'
          },
          dependencies: {
            express: '^4.18.2',
            cors: '^2.8.5',
            helmet: '^7.1.0',
            'express-rate-limit': '^7.1.5',
            dotenv: '^16.3.1',
            '@octokit/rest': '^20.0.2',
            axios: '^1.6.2'
          }
        }, null, 2)
      },
      
      // Vercel configuration
      {
        path: 'vercel.json',
        content: JSON.stringify({
          version: 2,
          builds: [
            {
              src: 'api/server.js',
              use: '@vercel/node'
            }
          ],
          routes: [
            {
              src: '/api/(.*)',
              dest: '/api/server.js'
            },
            {
              src: '/(.*)',
              dest: '/public/$1'
            }
          ]
        }, null, 2)
      },
      
      // Environment variables instructions
      {
        path: '.env.example',
        content: `# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
GH_PAT=your_github_token_here
GH_ORG=your_github_org_here

# Vercel Configuration  
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id_here

# Optional: AI API Keys
OPENAI_API_KEY=your_openai_key_here
ZAI_API_KEY=your_zai_key_here
`
      },
      
      // Main server file
      {
        path: 'api/server.js',
        content: serverJs
      },
      
      // Routes
      {
        path: 'api/routes/tasks.js',
        content: tasksRoute
      },
      {
        path: 'api/routes/tenants.js',
        content: tenantsRoute
      },
      {
        path: 'api/routes/health.js',
        content: healthRoute
      },
      
      // UI
      {
        path: 'public/index.html',
        content: productionHtml
      },
      
      // README
      {
        path: 'README.md',
        content: `# AutonomiX Platform

Full-stack IT Company as a Service platform.

## Features

- AI-powered project generation (OpenAI/Z.AI)
- Automatic GitHub repository creation
- Automatic Vercel deployment
- Real-time progress tracking

## Tech Stack

- Backend: Express.js
- Frontend: HTML/CSS/JS
- Deployments: GitHub + Vercel APIs
- AI: OpenAI/Z.AI (configurable)

## Environment Variables

- GITHUB_TOKEN / GH_PAT
- GH_ORG
- VERCEL_TOKEN
- OPENAI_API_KEY (optional)

Deployed via AutonomiX itself 🚀
`
      }
    ];

    // Deploy to Vercel
    const result = await deployForTenant({
      tenant: 'autonomix-platform',
      files,
      ghOrg: process.env.GH_ORG || 'bohdanlazurenko',
      ghPat: process.env.GH_PAT,
      vercelToken: process.env.VERCEL_TOKEN,
      vercelOrgId: process.env.VERCEL_ORG_ID,
    });

    console.log('\n✅ Platform deployed successfully!\n');
    console.log('📦 GitHub Repository:', result.repoUrl);
    console.log('🌐 Live URL:', result.deployUrl);
    console.log('\n🎉 AutonomiX is now live and can create new projects!\n');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployPlatform();
