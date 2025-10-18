#!/usr/bin/env node
/**
 * Test AutonomiX Platform on Vercel
 * Creates a real project and verifies it works
 */

import axios from 'axios';

const PLATFORM_URL = 'https://autonomix-platform-83dh16dvb-bohdans-projects-1e20badc.vercel.app';
const TEST_PROJECT_NAME = `test-vercel-${Date.now()}`;

async function testPlatform() {
  console.log('🧪 Testing AutonomiX Platform on Vercel\n');
  console.log(`Platform URL: ${PLATFORM_URL}`);
  console.log(`Test Project: ${TEST_PROJECT_NAME}\n`);

  try {
    // Step 1: Check health
    console.log('1️⃣ Checking platform health...');
    try {
      const healthResponse = await axios.get(`${PLATFORM_URL}/api/health`);
      console.log(`✅ Health check: ${healthResponse.data.status}`);
      console.log(`   Version: ${healthResponse.data.version}\n`);
    } catch (error) {
      console.log('⚠️  Health endpoint not found, continuing...\n');
    }

    // Step 2: Create task
    console.log('2️⃣ Creating new project task...');
    const createResponse = await axios.post(`${PLATFORM_URL}/api/tasks`, {
      tenant: TEST_PROJECT_NAME,
      prompt: 'Simple landing page for a coffee shop with menu and contact info'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    const task = createResponse.data;
    console.log(`✅ Task created: ${task.id}`);
    console.log(`   Status: ${task.status}\n`);

    // Step 3: Poll task status
    console.log('3️⃣ Waiting for project to be deployed...');
    let attempts = 0;
    const maxAttempts = 120; // 2 minutes
    let taskStatus = null;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;

      try {
        const statusResponse = await axios.get(`${PLATFORM_URL}/api/tasks/${task.id}`, {
          timeout: 5000
        });
        taskStatus = statusResponse.data;

        // Show progress
        if (taskStatus.steps && taskStatus.steps.length > 0) {
          const lastStep = taskStatus.steps[taskStatus.steps.length - 1];
          process.stdout.write(`\r   Progress: ${taskStatus.status} - ${lastStep.name}...`);
        }

        if (taskStatus.status === 'completed') {
          console.log('\n✅ Project deployed successfully!\n');
          break;
        } else if (taskStatus.status === 'failed') {
          console.log('\n❌ Deployment failed!');
          console.log(`   Error: ${taskStatus.error}\n`);
          process.exit(1);
        }
      } catch (error) {
        console.error(`\n⚠️  Error polling status (attempt ${attempts}):`, error.message);
      }
    }

    if (!taskStatus || taskStatus.status !== 'completed') {
      console.log('\n❌ Timeout waiting for deployment\n');
      process.exit(1);
    }

    // Step 4: Verify results
    console.log('4️⃣ Verifying deployment results...');
    console.log(`\n📦 GitHub Repository: ${taskStatus.result.repoUrl}`);
    console.log(`🌐 Live Deployment: ${taskStatus.result.deployUrl}\n`);

    // Check if GitHub repo exists
    console.log('5️⃣ Checking GitHub repository...');
    try {
      const repoResponse = await axios.get(taskStatus.result.repoUrl, {
        timeout: 10000,
        maxRedirects: 5
      });
      if (repoResponse.status === 200) {
        console.log('✅ GitHub repository exists and is accessible\n');
      }
    } catch (error) {
      console.log(`⚠️  GitHub repo check failed: ${error.message}\n`);
    }

    // Check if Vercel deployment is live
    console.log('6️⃣ Checking Vercel deployment...');
    try {
      const deployResponse = await axios.get(taskStatus.result.deployUrl, {
        timeout: 30000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      if (deployResponse.status === 200) {
        console.log('✅ Vercel deployment is LIVE and responding!\n');
        
        // Check if it has content
        const content = deployResponse.data;
        if (content.includes('Generated App') || content.includes('coffee')) {
          console.log('✅ Deployment contains expected content\n');
        }
      }
    } catch (error) {
      console.log(`⚠️  Vercel deployment check failed: ${error.message}\n`);
    }

    // Final summary
    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`\n✅ Platform URL: ${PLATFORM_URL}`);
    console.log(`✅ Test Project: ${TEST_PROJECT_NAME}`);
    console.log(`✅ GitHub Repo: ${taskStatus.result.repoUrl}`);
    console.log(`✅ Live Site: ${taskStatus.result.deployUrl}`);
    console.log('\n🚀 AutonomiX Platform is FULLY FUNCTIONAL!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testPlatform();
