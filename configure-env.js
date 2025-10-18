#!/usr/bin/env node
/**
 * Configure environment variables for deployed AutonomiX platform
 */

import axios from 'axios';
import 'dotenv/config';

async function configureEnvVars() {
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
  const projectName = 'autonomix-platform';
  
  console.log('🔧 Configuring environment variables for AutonomiX platform...\n');

  try {
    // Get project ID
    console.log('Finding project...');
    const { data: projects } = await axios.get('https://api.vercel.com/v9/projects', {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });
    
    const project = projects.projects.find(p => p.name.startsWith(projectName));
    if (!project) {
      console.error('❌ Project not found');
      process.exit(1);
    }
    
    console.log(`✓ Found project: ${project.name} (${project.id})\n`);

    // Environment variables to set
    const envVars = [
      { key: 'GITHUB_TOKEN', value: process.env.GITHUB_TOKEN },
      { key: 'GH_PAT', value: process.env.GH_PAT },
      { key: 'GH_ORG', value: process.env.GH_ORG },
      { key: 'VERCEL_TOKEN', value: process.env.VERCEL_TOKEN },
    ];

    // Set each environment variable
    for (const { key, value } of envVars) {
      try {
        console.log(`Setting ${key}...`);
        await axios.post(
          `https://api.vercel.com/v10/projects/${project.id}/env`,
          {
            key,
            value,
            type: 'encrypted',
            target: ['production', 'preview', 'development'],
          },
          {
            headers: {
              Authorization: `Bearer ${VERCEL_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(`✓ ${key} configured`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  ${key} already exists`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Environment variables configured!\n');
    console.log('🔄 Triggering redeploy...');
    
    // Trigger redeploy
    const { data: deployment } = await axios.post(
      'https://api.vercel.com/v13/deployments',
      {
        name: project.name,
        project: project.id,
        target: 'production',
        gitSource: {
          type: 'github',
          ref: 'autogen',
          repoId: project.link?.repoId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log(`✓ Deployment triggered: ${deployment.url}\n`);
    console.log('🎉 Platform is ready to use!');

  } catch (error) {
    console.error('❌ Configuration failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

configureEnvVars();
