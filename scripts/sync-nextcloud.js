#!/usr/bin/env node
/**
 * MinimalMind Nextcloud Sync Script
 * Uses rclone to sync local ./synced folder to Nextcloud WebDAV
 * Requires rclone and dotenv
 */
const { execSync } = require('child_process');
require('dotenv').config();

const url = process.env.NEXTCLOUD_URL;
const user = process.env.NEXTCLOUD_USER;
const pass = process.env.NEXTCLOUD_PASS;

if (!url || !user || !pass) {
  console.error('Missing Nextcloud credentials in .env');
  process.exit(1);
}

const remote = `nextcloud:${user}`;

try {
  execSync(`rclone config create nextcloud webdav url ${url} vendor nextcloud user ${user} pass ${pass} --obscure`, { stdio: 'inherit' });
} catch {}

execSync('rclone sync ./synced nextcloud:MinimalMind --progress', { stdio: 'inherit' });
