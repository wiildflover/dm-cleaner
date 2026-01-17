/**
 * @file github-auto-deploy.js
 * @author Wildflover
 * @description Fully automated GitHub deployment with automatic repository creation
 * @language JavaScript/Node.js
 */

const { execSync } = require('child_process');
const https = require('https');
const readline = require('readline');

// Configuration
const CONFIG = {
    projectName: 'Wildflover DM Cleaner',
    version: '1.0.0',
    author: 'Wildflover',
    defaultBranch: 'main',
    repoName: 'dm-cleaner',
    repoDescription: 'Professional Discord message management tool built with Electron, React, and TypeScript',
    topics: ['electron', 'discord', 'react', 'typescript', 'dm-cleaner', 'message-management', 'desktop-app']
};

// Colors
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

// Logger
const Logger = {
    info: (tag, message) => console.log(`${COLORS.cyan}[${tag}]${COLORS.reset} ${message}`),
    success: (tag, message) => console.log(`${COLORS.green}[${tag}]${COLORS.reset} ${message}`),
    warn: (tag, message) => console.log(`${COLORS.yellow}[${tag}]${COLORS.reset} ${message}`),
    error: (tag, message) => console.log(`${COLORS.red}[${tag}]${COLORS.reset} ${message}`),
    header: (message) => console.log(`\n${COLORS.bright}${COLORS.blue}${message}${COLORS.reset}\n`)
};

// Display banner
function displayBanner() {
    console.log(`${COLORS.magenta}`);
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║      WILDFLOVER AUTO GITHUB DEPLOYMENT TOOL                ║');
    console.log('║              Version 1.0.0                                 ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  Fully automated deployment with repo creation            ║');
    console.log('║  Author: Wildflover                                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`${COLORS.reset}\n`);
}

// Execute command
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

// Make HTTPS request
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ statusCode: res.statusCode, data: response });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

// Get user input
function getUserInput(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(`${COLORS.yellow}${question}${COLORS.reset}`, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

// Check GitHub credentials
async function checkGitHubAuth(username, token) {
    Logger.info('AUTH-CHECK', 'Verifying GitHub credentials...');

    const options = {
        hostname: 'api.github.com',
        path: '/user',
        method: 'GET',
        headers: {
            'User-Agent': 'Wildflover-DM-Cleaner',
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    };

    try {
        const response = await makeRequest(options);
        
        if (response.statusCode === 200) {
            Logger.success('AUTH-OK', `Authenticated as: ${response.data.login}`);
            return { success: true, username: response.data.login };
        } else {
            Logger.error('AUTH-FAIL', 'Invalid GitHub token');
            return { success: false };
        }
    } catch (error) {
        Logger.error('AUTH-ERROR', error.message);
        return { success: false };
    }
}

// Check if repository exists
async function checkRepoExists(username, repoName, token) {
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${username}/${repoName}`,
        method: 'GET',
        headers: {
            'User-Agent': 'Wildflover-DM-Cleaner',
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    };

    try {
        const response = await makeRequest(options);
        return response.statusCode === 200;
    } catch (error) {
        return false;
    }
}

// Create GitHub repository
async function createGitHubRepo(token, isPrivate = false) {
    Logger.header('Creating GitHub Repository');
    Logger.info('REPO-CREATE', `Creating repository: ${CONFIG.repoName}`);

    const options = {
        hostname: 'api.github.com',
        path: '/user/repos',
        method: 'POST',
        headers: {
            'User-Agent': 'Wildflover-DM-Cleaner',
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
    };

    const repoData = {
        name: CONFIG.repoName,
        description: CONFIG.repoDescription,
        private: isPrivate,
        has_issues: true,
        has_projects: true,
        has_wiki: true,
        auto_init: false
    };

    try {
        const response = await makeRequest(options, repoData);

        if (response.statusCode === 201) {
            Logger.success('REPO-CREATED', `Repository created: ${response.data.html_url}`);
            return { success: true, url: response.data.clone_url, htmlUrl: response.data.html_url };
        } else if (response.statusCode === 422) {
            Logger.error('REPO-EXISTS', 'Repository already exists');
            return { success: false, exists: true };
        } else {
            Logger.error('REPO-ERROR', `Failed to create repository: ${response.data.message || 'Unknown error'}`);
            return { success: false };
        }
    } catch (error) {
        Logger.error('REPO-ERROR', error.message);
        return { success: false };
    }
}

// Add repository topics
async function addRepoTopics(username, repoName, token) {
    Logger.info('TOPICS', 'Adding repository topics...');

    const options = {
        hostname: 'api.github.com',
        path: `/repos/${username}/${repoName}/topics`,
        method: 'PUT',
        headers: {
            'User-Agent': 'Wildflover-DM-Cleaner',
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.mercy-preview+json',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await makeRequest(options, { names: CONFIG.topics });
        
        if (response.statusCode === 200) {
            Logger.success('TOPICS', `Added ${CONFIG.topics.length} topics`);
        }
    } catch (error) {
        Logger.warn('TOPICS', 'Failed to add topics (non-critical)');
    }
}

// Initialize and commit
function initializeGit() {
    Logger.header('Initializing Git Repository');

    if (execute('git rev-parse --is-inside-work-tree', { silent: true }).success) {
        Logger.warn('GIT-EXISTS', 'Git repository already initialized');
        return;
    }

    Logger.info('GIT-INIT', 'Initializing Git...');
    execute('git init');
    Logger.success('GIT-INIT', 'Git initialized');
}

function createCommit() {
    Logger.info('COMMIT', 'Creating initial commit...');

    execute('git add .');

    const commitMessage = `Initial commit: ${CONFIG.projectName} v${CONFIG.version}

Complete project structure with:
- Full source code (144 files)
- Comprehensive documentation
- GitHub workflows and CI/CD
- Professional configuration
- Assets and resources

Author: ${CONFIG.author}
Ready for production deployment`;

    execute(`git commit -m "${commitMessage}"`);
    Logger.success('COMMIT', 'Initial commit created');
}

function setupBranch() {
    Logger.info('BRANCH', `Setting default branch to '${CONFIG.defaultBranch}'...`);
    execute(`git branch -M ${CONFIG.defaultBranch}`);
    Logger.success('BRANCH', `Branch set to '${CONFIG.defaultBranch}'`);
}

function addRemote(repoUrl) {
    Logger.info('REMOTE', 'Adding remote repository...');

    const checkRemote = execute('git remote get-url origin', { silent: true });
    
    if (checkRemote.success) {
        execute(`git remote set-url origin ${repoUrl}`);
        Logger.success('REMOTE', 'Remote URL updated');
    } else {
        execute(`git remote add origin ${repoUrl}`);
        Logger.success('REMOTE', 'Remote repository added');
    }
}

function pushToGitHub() {
    Logger.header('Pushing to GitHub');
    Logger.info('PUSH', `Pushing to origin/${CONFIG.defaultBranch}...`);

    const result = execute(`git push -u origin ${CONFIG.defaultBranch}`);

    if (result.success) {
        Logger.success('PUSH-COMPLETE', 'Successfully pushed to GitHub!');
        return true;
    } else {
        Logger.error('PUSH-ERROR', 'Failed to push to GitHub');
        return false;
    }
}

// Display summary
function displaySummary(repoHtmlUrl) {
    Logger.header('Deployment Summary');

    console.log(`${COLORS.bright}Project:${COLORS.reset} ${CONFIG.projectName}`);
    console.log(`${COLORS.bright}Version:${COLORS.reset} ${CONFIG.version}`);
    console.log(`${COLORS.bright}Author:${COLORS.reset} ${CONFIG.author}`);
    console.log(`${COLORS.bright}Repository:${COLORS.reset} ${repoHtmlUrl}`);
    console.log(`${COLORS.bright}Branch:${COLORS.reset} ${CONFIG.defaultBranch}`);

    const commitCount = execute('git rev-list --count HEAD', { silent: true });
    if (commitCount.success) {
        console.log(`${COLORS.bright}Commits:${COLORS.reset} ${commitCount.output.trim()}`);
    }

    console.log('');
}

// Main deployment
async function deploy() {
    displayBanner();

    try {
        // Get GitHub credentials
        Logger.header('GitHub Authentication');
        
        const username = await getUserInput('Enter your GitHub username: ');
        if (!username) {
            Logger.error('INPUT-ERROR', 'Username is required');
            process.exit(1);
        }

        const token = await getUserInput('Enter your GitHub Personal Access Token: ');
        if (!token) {
            Logger.error('INPUT-ERROR', 'Token is required');
            process.exit(1);
        }

        // Verify credentials
        const authResult = await checkGitHubAuth(username, token);
        if (!authResult.success) {
            Logger.error('AUTH-FAILED', 'Authentication failed. Please check your credentials.');
            process.exit(1);
        }

        // Check if repo exists
        const repoExists = await checkRepoExists(authResult.username, CONFIG.repoName, token);
        
        let repoUrl, repoHtmlUrl;

        if (repoExists) {
            Logger.warn('REPO-EXISTS', `Repository '${CONFIG.repoName}' already exists`);
            repoUrl = `https://github.com/${authResult.username}/${CONFIG.repoName}.git`;
            repoHtmlUrl = `https://github.com/${authResult.username}/${CONFIG.repoName}`;
            
            const proceed = await getUserInput('Do you want to push to existing repository? (y/n): ');
            if (proceed.toLowerCase() !== 'y') {
                Logger.info('CANCELLED', 'Deployment cancelled by user');
                process.exit(0);
            }
        } else {
            // Ask for repository visibility
            const visibility = await getUserInput('Make repository private? (y/n, default: n): ');
            const isPrivate = visibility.toLowerCase() === 'y';

            // Create repository
            const createResult = await createGitHubRepo(token, isPrivate);
            
            if (!createResult.success) {
                Logger.error('DEPLOY-FAILED', 'Failed to create repository');
                process.exit(1);
            }

            repoUrl = createResult.url;
            repoHtmlUrl = createResult.htmlUrl;

            // Add topics
            await addRepoTopics(authResult.username, CONFIG.repoName, token);
        }

        // Git operations
        initializeGit();
        createCommit();
        setupBranch();
        addRemote(repoUrl);

        // Push to GitHub
        const pushSuccess = pushToGitHub();

        if (pushSuccess) {
            displaySummary(repoHtmlUrl);
            
            Logger.success('DEPLOYMENT', 'GitHub deployment completed successfully!');
            Logger.info('NEXT-STEPS', `Visit your repository: ${repoHtmlUrl}`);
            Logger.info('NEXT-STEPS', 'Configure repository settings and create your first release');
        }

    } catch (error) {
        Logger.error('FATAL-ERROR', error.message);
        process.exit(1);
    }
}

// Run
if (require.main === module) {
    deploy().catch(error => {
        Logger.error('FATAL-ERROR', error.message);
        process.exit(1);
    });
}

module.exports = { deploy };
