#!/usr/bin/env node
/**
 * MinimalMind Nextcloud Sync Script
 * 
 * Syncs local data with Nextcloud WebDAV using rclone.
 * Requires rclone to be installed and environment variables set.
 * 
 * Usage:
 *   npm run sync
 *   node scripts/sync-nextcloud.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const SYNC_DIR = './synced';
const REMOTE_DIR = 'MinimalMind';

// Environment variables
const url = process.env.NEXTCLOUD_URL;
const user = process.env.NEXTCLOUD_USER;
const pass = process.env.NEXTCLOUD_PASS;

/**
 * Validate environment variables
 */
function validateEnvironment() {
  if (!url || !user || !pass) {
    console.error('❌ Missing Nextcloud credentials in .env file');
    console.error('Required variables:');
    console.error('  NEXTCLOUD_URL=https://your-nextcloud.com/remote.php/webdav');
    console.error('  NEXTCLOUD_USER=your_username');
    console.error('  NEXTCLOUD_PASS=your_password');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
  console.log(`📡 Nextcloud URL: ${url}`);
  console.log(`👤 User: ${user}`);
}

/**
 * Check if rclone is installed
 */
function checkRclone() {
  try {
    execSync('rclone version', { stdio: 'pipe' });
    console.log('✅ rclone is installed');
  } catch (error) {
    console.error('❌ rclone is not installed or not in PATH');
    console.error('Install rclone: https://rclone.org/install/');
    process.exit(1);
  }
}

/**
 * Create local sync directory if it doesn't exist
 */
function createSyncDir() {
  if (!fs.existsSync(SYNC_DIR)) {
    fs.mkdirSync(SYNC_DIR, { recursive: true });
    console.log(`📁 Created sync directory: ${SYNC_DIR}`);
    
    // Create a sample file
    const sampleFile = path.join(SYNC_DIR, 'README.md');
    fs.writeFileSync(sampleFile, `# MinimalMind Sync Directory

This directory contains your synced MinimalMind data.

- Books and reading progress
- Notes and highlights  
- User preferences backup
- Export files

Last synced: ${new Date().toISOString()}
`);
    console.log('📄 Created sample README.md');
  }
}

/**
 * Configure rclone remote
 */
function configureRclone() {
  const remoteName = 'nextcloud';
  
  try {
    // Check if remote already exists
    const remotes = execSync('rclone listremotes', { encoding: 'utf8' });
    if (remotes.includes(`${remoteName}:`)) {
      console.log('✅ rclone remote already configured');
      return;
    }
  } catch (error) {
    // Continue to create remote
  }

  try {
    console.log('🔧 Configuring rclone remote...');
    
    // Create rclone config for Nextcloud WebDAV
    const configCmd = [
      'rclone config create',
      remoteName,
      'webdav',
      `url ${url}`,
      'vendor nextcloud',
      `user ${user}`,
      `pass ${pass}`,
      '--obscure'
    ].join(' ');

    execSync(configCmd, { stdio: 'pipe' });
    console.log('✅ rclone remote configured successfully');
  } catch (error) {
    console.error('❌ Failed to configure rclone remote:', error.message);
    process.exit(1);
  }
}

/**
 * Test connection to Nextcloud
 */
function testConnection() {
  try {
    console.log('🔍 Testing Nextcloud connection...');
    execSync('rclone lsd nextcloud:', { stdio: 'pipe' });
    console.log('✅ Connection to Nextcloud successful');
  } catch (error) {
    console.error('❌ Failed to connect to Nextcloud:', error.message);
    console.error('Check your credentials and network connection');
    process.exit(1);
  }
}

/**
 * Sync files with Nextcloud
 */
function syncFiles() {
  try {
    console.log('🔄 Starting sync...');
    console.log(`📤 Local: ${SYNC_DIR}`);
    console.log(`📥 Remote: nextcloud:${REMOTE_DIR}`);
    
    // Sync local directory to Nextcloud
    const syncCmd = `rclone sync ${SYNC_DIR} nextcloud:${REMOTE_DIR} --progress --verbose`;
    
    execSync(syncCmd, { stdio: 'inherit' });
    
    console.log('✅ Sync completed successfully!');
    
    // Show sync summary
    const remoteFiles = execSync(`rclone ls nextcloud:${REMOTE_DIR}`, { encoding: 'utf8' });
    const fileCount = remoteFiles.trim().split('\n').filter(line => line.trim()).length;
    console.log(`📊 Synced ${fileCount} files to Nextcloud`);
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

/**
 * Main sync function
 */
function main() {
  console.log('🚀 MinimalMind Nextcloud Sync');
  console.log('================================');
  
  try {
    validateEnvironment();
    checkRclone();
    createSyncDir();
    configureRclone();
    testConnection();
    syncFiles();
    
    console.log('');
    console.log('🎉 All done! Your MinimalMind data is synced with Nextcloud.');
    console.log(`📁 Local sync directory: ${path.resolve(SYNC_DIR)}`);
    console.log(`☁️  Remote directory: ${REMOTE_DIR}`);
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, validateEnvironment, checkRclone, configureRclone, syncFiles };