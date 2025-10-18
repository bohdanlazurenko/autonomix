#!/usr/bin/env node
/**
 * Get production URL for AutonomiX platform
 */

import axios from 'axios';
import 'dotenv/config';

async function getProductionUrl() {
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
  const projectName = 'autonomix-platform';
  
  console.log('🔍 Finding production URL...\n');

  try {
    // Get project
    const { data: projects } = await axios.get('https://api.vercel.com/v9/projects', {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    
    const project = projects.projects.find(p => p.name.startsWith(projectName));
    if (!project) {
      console.error('❌ Project not found');
      process.exit(1);
    }
    
    console.log(`📦 Project: ${project.name}`);
    console.log(`   ID: ${project.id}`);
    
    // Get deployments
    const { data: deployments } = await axios.get(
      `https://api.vercel.com/v6/deployments?projectId=${project.id}&limit=10`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );
    
    console.log(`\n📋 Recent deployments:\n`);
    
    deployments.deployments.forEach((d, i) => {
      const status = d.state === 'READY' ? '✅' : d.state === 'ERROR' ? '❌' : '⏳';
      const prod = d.target === 'production' ? '[PROD]' : '';
      console.log(`${i + 1}. ${status} ${prod} ${d.url}`);
      console.log(`   Created: ${new Date(d.created).toLocaleString()}`);
      console.log(`   State: ${d.state}\n`);
    });
    
    // Find production deployment
    const prodDeployment = deployments.deployments.find(d => 
      d.target === 'production' && d.state === 'READY'
    );
    
    if (prodDeployment) {
      console.log(`\n🌐 Production URL: https://${prodDeployment.url}`);
      
      // Also check project domains
      if (project.alias && project.alias.length > 0) {
        console.log(`\n📎 Project domains:`);
        project.alias.forEach(alias => {
          console.log(`   - https://${alias.domain}`);
        });
      }
    } else {
      console.log('\n⚠️  No production deployment found');
    }
    
    // Check deployment protection
    console.log(`\n🔒 Deployment Protection: ${project.protectionBypass?.scope || 'unknown'}`);
    
    if (project.protectionBypass) {
      console.log(`   Type: ${project.protectionBypass.scope}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

getProductionUrl();
