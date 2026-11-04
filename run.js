/**
 * BloodConnect - Single Unified Build & Start Script
 * Works across Windows, macOS, and Linux (Render / Cloud / Local)
 *
 * Usage:
 *   node run.js          -> Installs dependencies, builds frontend, and starts backend (Production)
 *   node run.js --dev    -> Runs both frontend and backend concurrently in Development mode
 *   node run.js --build  -> Only builds both without starting server
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

const args = process.argv.slice(2);
const isDev = args.includes('--dev');
const isBuildOnly = args.includes('--build') || args.includes('--build-only');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('====================================================');
console.log('  BloodConnect Unified Automation Runner');
console.log(`  Mode: ${isDev ? 'Development' : isBuildOnly ? 'Build Only' : 'Build & Production Start'}`);
console.log('====================================================\n');

function runSync(cmd, args, cwd, description) {
  console.log(`⏳ ${description}...`);
  try {
    execSync(`${cmd} ${args.join(' ')}`, {
      cwd,
      stdio: 'inherit',
      env: process.env,
    });
    console.log(`✅ ${description} completed successfully.\n`);
  } catch (error) {
    console.error(`❌ Failed: ${description}`);
    process.exit(1);
  }
}

function ensureDependencies() {
  const backendModules = path.join(backendDir, 'node_modules');
  const frontendModules = path.join(frontendDir, 'node_modules');

  if (!fs.existsSync(backendModules)) {
    runSync(npmCmd, ['install'], backendDir, 'Installing backend dependencies');
  }

  if (!fs.existsSync(frontendModules)) {
    runSync(npmCmd, ['install'], frontendDir, 'Installing frontend dependencies');
  }
}

if (isDev) {
  ensureDependencies();
  console.log('🚀 Starting Development Servers (Backend + Frontend)...\n');

  const backendProc = spawn(npmCmd, ['start'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true,
  });

  const frontendProc = spawn(npmCmd, ['run', 'dev'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true,
  });

  const cleanup = () => {
    backendProc.kill();
    frontendProc.kill();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

} else {
  ensureDependencies();

  // Build frontend
  runSync(npmCmd, ['run', 'build'], frontendDir, 'Building frontend (Vite)');

  // Copy dist to backend/public to guarantee it is always available
  try {
    const backendPublic = path.join(backendDir, 'public');
    const frontendDist = path.join(frontendDir, 'dist');
    if (fs.existsSync(frontendDist)) {
      if (!fs.existsSync(backendPublic)) fs.mkdirSync(backendPublic, { recursive: true });
      fs.cpSync(frontendDist, backendPublic, { recursive: true });
      console.log('✅ Synchronized frontend build to backend/public');
    }
  } catch (err) {
    console.warn('⚠️ Could not copy frontend dist to backend public:', err.message);
  }

  if (isBuildOnly) {
    console.log('🎉 Build completed successfully!');
    process.exit(0);
  }

  console.log('🚀 Starting BloodConnect Production Server...');

  require(path.join(backendDir, 'server.js'));
}
