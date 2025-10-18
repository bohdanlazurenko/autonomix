import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

console.log('Project root:', projectRoot);
console.log('Loading .env from:', join(projectRoot, '.env'));

dotenv.config({ path: join(projectRoot, '.env') });

console.log('\nEnvironment variables:');
console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'SET ✅' : 'NOT SET ❌');
console.log('GH_PAT:', process.env.GH_PAT ? 'SET ✅' : 'NOT SET ❌');
console.log('GH_ORG:', process.env.GH_ORG || 'NOT SET ❌');
console.log('VERCEL_TOKEN:', process.env.VERCEL_TOKEN ? 'SET ✅' : 'NOT SET ❌');
