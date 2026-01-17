/**
 * @file github-deploy.js
 * @author Wildflover
 * @description Automated GitHub deployment tool with intelligent commit messages
 * @language JavaScript/Node.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const CONFIG = {
    projectName: 'Wildflover DM Cleaner',
    version: '0.0.1',
    author: 'Wildflover',
    defaultBranch: 'main'
};

// Color codes for terminal output
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
};

// Logger utility
const Logger = {
    info: (tag, message) => {
        console.log(`${COLORS.cyan}[${tag}]${COLORS.reset} ${message}`);
    },
    success: (tag, message) => {
        console.log(`${COLORS.green}[${tag}]${COLORS.reset} ${message}`);
    },
    warn: (tag, message) => {
        console.log(`${COLORS.yellow}[${tag}]${COLORS.reset} ${message}`);
    },
    error: (tag, message) => {
        console.log(`${COLORS.red}[${tag}]${COLORS.reset} ${message}`);
    },
    header: (message) => {
        console.log(`\n${COLORS.bright}${COLORS.blue}${message}${COLORS.reset}\n`);
    }
};

// File categorization for intelligent commit messages
const FILE_CATEGORIES = {
    documentation: {
        patterns: [/\.md$/i, /LICENSE/, /\.txt$/],
        prefix: 'docs',
        description: 'documentation'
    },
    source: {
        patterns: [/\.tsx?$/, /\.jsx?$/],
        prefix: 'feat',
        description: 'source code'
    },
    styles: {
        patterns: [/\.css$/, /\.scss$/, /tailwind/],
        prefix: 'style',
        description: 'styling'
    },
    config: {
        patterns: [/config\.(js|ts|json)$/, /\.eslintrc/, /\.prettierrc/, /tsconfig/, /\.editorconfig/, /\.npmrc/],
        prefix: 'chore',
        description: 'configuration'
    },
    assets: {
        patterns: [/\.(png|jpg|jpeg|svg|ico|gif)$/i],
        prefix: 'assets',
        description: 'assets'
    },
    github: {
        patterns: [/\.github\//, /workflows\//],
        prefix: 'ci',
        description: 'CI/CD configuration'
    },
    build: {
        patterns: [/package\.json$/, /package-lock\.json$/],
        prefix: 'build',
        description: 'dependencies'
    }
};

// Categorize file
function categorizeFile(filePath) {
    for (const [category, config] of Object.entries(FILE_CATEGORIES)) {
        if (config.patterns.some(pattern => pattern.test(filePath))) {
            return config;
        }
    }
    return { prefix: 'chore', description: 'miscellaneous files' };
}

// Group files by category
function groupFilesByCategory(files) {
    const groups = {};
    
    files.forEach(file => {
        const category = categorizeFile(file);
        const key = `${category.prefix}:${category.description}`;
        
        if (!groups[key]) {
            groups[key] = {
                prefix: category.prefix,
                description: category.description,
                files: []
            };
        }
        
        groups[key].files.push(file);
    });
    
    return groups;
}

// Generate commit message
function generateCommitMessage(group) {
    const { prefix, description, files } = group;
    const fileCount = files.length;
    
    let message = `${prefix}: add ${description}`;
    
    if (fileCount > 1) {
        message += ` (${fileCount} files)`;
    }
    
    // Add file details in commit body
    const body = files.slice(0, 10).map(f => `  - ${f}`).join('\n');
    const remaining = fileCount > 10 ? `\n  ... and ${fileCount - 10} more files` : '';
    
    return `${message}\n\n${body}${remaining}`;
}

// Execute command with error handling
function execute(command, options = {}) {
    try {
        const result = execSync(command, {
            encoding: 'utf8',
            stdio: options.silent ? 'pipe' : 'inherit',
            ...options
        });
        return { success: true, output: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Check if git is installed
function checkGitInstalled() {
    Logger.info('GIT-CHECK', 'Checking Git installation...');
    const result = execute('git --version', { silent: true });
    
    if (!result.success) {
        Logger.error('GIT-ERROR', 'Git is not installed or not in PATH');
        Logger.info('INSTALL', 'Please install Git: https://git-scm.com/downloads');
        process.exit(1);
    }
    
    Logger.success('GIT-FOUND', result.output.trim());
}

// Check if directory is already a git repository
function isGitRepository() {
    const result = execute('git rev-parse --is-inside-work-tree', { silent: true });
    return result.success;
}

// Initialize git repository
function initializeGit() {
    Logger.info('GIT-INIT', 'Initializing Git repository...');
    
    if (isGitRepository()) {
        Logger.warn('GIT-EXISTS', 'Git repository already initialized');
        return;
    }
    
    const result = execute('git init');
    
    if (result.success) {
        Logger.success('GIT-INIT', 'Git repository initialized successfully');
    } else {
        Logger.error('GIT-ERROR', 'Failed to initialize Git repository');
        process.exit(1);
    }
}

// Get all files to be committed
function getFilesToCommit() {
    Logger.info('FILE-SCAN', 'Scanning files for commit...');
    
    const result = execute('git status --porcelain', { silent: true });
    
    if (!result.success) {
        Logger.error('GIT-ERROR', 'Failed to get file status');
        return [];
    }
    
    const files = result.output
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.substring(3).trim())
        .filter(file => file && !file.startsWith('.git/'));
    
    Logger.success('FILE-SCAN', `Found ${files.length} files to commit`);
    return files;
}

// Stage all files
function stageFiles() {
    Logger.info('GIT-ADD', 'Staging all files...');
    
    const result = execute('git add .');
    
    if (result.success) {
        Logger.success('GIT-ADD', 'All files staged successfully');
    } else {
        Logger.error('GIT-ERROR', 'Failed to stage files');
        process.exit(1);
    }
}

// Create commits by category
function createCommits() {
    Logger.header('Creating Intelligent Commits');
    
    const files = getFilesToCommit();
    
    if (files.length === 0) {
        Logger.warn('NO-CHANGES', 'No files to commit');
        return;
    }
    
    const groups = groupFilesByCategory(files);
    const groupCount = Object.keys(groups).length;
    
    Logger.info('COMMIT-PLAN', `Creating ${groupCount} categorized commits...`);
    
    let commitCount = 0;
    
    for (const [key, group] of Object.entries(groups)) {
        commitCount++;
        const message = generateCommitMessage(group);
        
        Logger.info('COMMIT', `[${commitCount}/${groupCount}] ${group.prefix}: ${group.description}`);
        
        // Stage specific files
        group.files.forEach(file => {
            execute(`git add "${file}"`, { silent: true });
        });
        
        // Create commit
        const commitResult = execute(`git commit -m "${message.split('\n')[0]}"`, { silent: true });
        
        if (commitResult.success) {
            Logger.success('COMMIT-OK', `Committed ${group.files.length} file(s)`);
        } else {
            Logger.error('COMMIT-FAIL', `Failed to commit ${group.description}`);
        }
    }
    
    Logger.success('COMMITS-DONE', `Created ${commitCount} commits successfully`);
}

// Set default branch
function setDefaultBranch() {
    Logger.info('BRANCH', `Setting default branch to '${CONFIG.defaultBranch}'...`);
    
    const result = execute(`git branch -M ${CONFIG.defaultBranch}`);
    
    if (result.success) {
        Logger.success('BRANCH', `Default branch set to '${CONFIG.defaultBranch}'`);
    } else {
        Logger.error('BRANCH-ERROR', 'Failed to set default branch');
    }
}

// Add remote repository
async function addRemote(repoUrl) {
    Logger.info('REMOTE', 'Adding remote repository...');
    
    // Check if remote already exists
    const checkRemote = execute('git remote get-url origin', { silent: true });
    
    if (checkRemote.success) {
        Logger.warn('REMOTE-EXISTS', 'Remote origin already exists');
        Logger.info('REMOTE-URL', checkRemote.output.trim());
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
            rl.question('Do you want to update the remote URL? (y/n): ', resolve);
        });
        
        rl.close();
        
        if (answer.toLowerCase() === 'y') {
            execute(`git remote set-url origin ${repoUrl}`);
            Logger.success('REMOTE', 'Remote URL updated');
        }
    } else {
        const result = execute(`git remote add origin ${repoUrl}`);
        
        if (result.success) {
            Logger.success('REMOTE', 'Remote repository added successfully');
        } else {
            Logger.error('REMOTE-ERROR', 'Failed to add remote repository');
            process.exit(1);
        }
    }
}

// Push to GitHub
function pushToGitHub() {
    Logger.header('Pushing to GitHub');
    Logger.info('PUSH', `Pushing to origin/${CONFIG.defaultBranch}...`);
    Logger.warn('AUTH', 'You may be prompted for GitHub credentials');
    
    const result = execute(`git push -u origin ${CONFIG.defaultBranch}`);
    
    if (result.success) {
        Logger.success('PUSH-COMPLETE', 'Successfully pushed to GitHub!');
    } else {
        Logger.error('PUSH-ERROR', 'Failed to push to GitHub');
        Logger.info('HELP', 'Make sure you have the correct permissions and authentication');
    }
}

// Display banner
function displayBanner() {
    console.log(`${COLORS.cyan}`);
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         WILDFLOVER GITHUB DEPLOYMENT TOOL                  ║');
    console.log('║                   Version 1.0.0                            ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  Automated GitHub deployment with intelligent commits      ║');
    console.log('║  Author: Wildflover                                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`${COLORS.reset}\n`);
}

// Display summary
function displaySummary() {
    Logger.header('Deployment Summary');
    
    const commitCount = execute('git rev-list --count HEAD', { silent: true });
    const fileCount = execute('git ls-files | wc -l', { silent: true });
    
    console.log(`${COLORS.bright}Project:${COLORS.reset} ${CONFIG.projectName}`);
    console.log(`${COLORS.bright}Version:${COLORS.reset} ${CONFIG.version}`);
    console.log(`${COLORS.bright}Author:${COLORS.reset} ${CONFIG.author}`);
    console.log(`${COLORS.bright}Branch:${COLORS.reset} ${CONFIG.defaultBranch}`);
    
    if (commitCount.success) {
        console.log(`${COLORS.bright}Commits:${COLORS.reset} ${commitCount.output.trim()}`);
    }
    
    if (fileCount.success) {
        console.log(`${COLORS.bright}Files:${COLORS.reset} ${fileCount.output.trim()}`);
    }
    
    console.log('');
}

// Main deployment function
async function deploy() {
    displayBanner();
    
    try {
        // Step 1: Check Git
        checkGitInstalled();
        
        // Step 2: Initialize Git
        initializeGit();
        
        // Step 3: Stage files
        stageFiles();
        
        // Step 4: Create commits
        createCommits();
        
        // Step 5: Set default branch
        setDefaultBranch();
        
        // Step 6: Get repository URL
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        Logger.header('GitHub Repository Setup');
        
        const repoUrl = await new Promise(resolve => {
            rl.question(`${COLORS.yellow}Enter your GitHub repository URL: ${COLORS.reset}`, resolve);
        });
        
        rl.close();
        
        if (!repoUrl || !repoUrl.includes('github.com')) {
            Logger.error('INVALID-URL', 'Invalid GitHub repository URL');
            process.exit(1);
        }
        
        // Step 7: Add remote
        await addRemote(repoUrl);
        
        // Step 8: Push to GitHub
        pushToGitHub();
        
        // Step 9: Display summary
        displaySummary();
        
        Logger.success('DEPLOYMENT', 'GitHub deployment completed successfully!');
        Logger.info('NEXT-STEPS', 'Visit your repository on GitHub to verify');
        
    } catch (error) {
        Logger.error('FATAL-ERROR', error.message);
        process.exit(1);
    }
}

// Run deployment
if (require.main === module) {
    deploy().catch(error => {
        Logger.error('FATAL-ERROR', error.message);
        process.exit(1);
    });
}

module.exports = { deploy };
