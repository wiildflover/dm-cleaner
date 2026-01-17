# GitHub Setup PowerShell Script
# Author: Wildflover
# Description: Automated GitHub deployment for Windows
# Language: PowerShell

# Configuration
$Config = @{
    ProjectName = "Wildflover DM Cleaner"
    Version = "1.0.0"
    Author = "Wildflover"
    DefaultBranch = "main"
}

# Color functions
function Write-ColorOutput {
    param(
        [string]$Tag,
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host "[$Tag] " -ForegroundColor $Color -NoNewline
    Write-Host $Message
}

function Write-Info { param($Tag, $Message) Write-ColorOutput $Tag $Message "Cyan" }
function Write-Success { param($Tag, $Message) Write-ColorOutput $Tag $Message "Green" }
function Write-Warning { param($Tag, $Message) Write-ColorOutput $Tag $Message "Yellow" }
function Write-Error { param($Tag, $Message) Write-ColorOutput $Tag $Message "Red" }

# Display banner
function Show-Banner {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         WILDFLOVER GITHUB DEPLOYMENT TOOL                  ║" -ForegroundColor Cyan
    Write-Host "║                   Version 1.0.0                            ║" -ForegroundColor Cyan
    Write-Host "╠════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║  Automated GitHub deployment with intelligent commits      ║" -ForegroundColor Cyan
    Write-Host "║  Author: Wildflover                                        ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# Check Git installation
function Test-GitInstalled {
    Write-Info "GIT-CHECK" "Checking Git installation..."
    
    try {
        $gitVersion = git --version 2>&1
        Write-Success "GIT-FOUND" $gitVersion
        return $true
    }
    catch {
        Write-Error "GIT-ERROR" "Git is not installed or not in PATH"
        Write-Info "INSTALL" "Please install Git: https://git-scm.com/downloads"
        return $false
    }
}

# Initialize Git repository
function Initialize-GitRepo {
    Write-Info "GIT-INIT" "Initializing Git repository..."
    
    if (Test-Path ".git") {
        Write-Warning "GIT-EXISTS" "Git repository already initialized"
        return
    }
    
    git init
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "GIT-INIT" "Git repository initialized successfully"
    }
    else {
        Write-Error "GIT-ERROR" "Failed to initialize Git repository"
        exit 1
    }
}

# Stage all files
function Add-AllFiles {
    Write-Info "GIT-ADD" "Staging all files..."
    
    git add .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "GIT-ADD" "All files staged successfully"
    }
    else {
        Write-Error "GIT-ERROR" "Failed to stage files"
        exit 1
    }
}

# Create initial commit
function New-InitialCommit {
    Write-Info "COMMIT" "Creating initial commit..."
    
    $commitMessage = "Initial commit: $($Config.ProjectName) v$($Config.Version)

Project Structure:
- Complete source code
- Comprehensive documentation
- GitHub workflows and templates
- Professional configuration files
- Assets and resources

Author: $($Config.Author)
Ready for production deployment"
    
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "COMMIT" "Initial commit created successfully"
    }
    else {
        Write-Error "COMMIT-ERROR" "Failed to create commit"
        exit 1
    }
}

# Set default branch
function Set-DefaultBranch {
    Write-Info "BRANCH" "Setting default branch to '$($Config.DefaultBranch)'..."
    
    git branch -M $Config.DefaultBranch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "BRANCH" "Default branch set to '$($Config.DefaultBranch)'"
    }
    else {
        Write-Error "BRANCH-ERROR" "Failed to set default branch"
    }
}

# Add remote repository
function Add-RemoteRepo {
    param([string]$RepoUrl)
    
    Write-Info "REMOTE" "Adding remote repository..."
    
    # Check if remote exists
    $existingRemote = git remote get-url origin 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Warning "REMOTE-EXISTS" "Remote origin already exists: $existingRemote"
        
        $update = Read-Host "Do you want to update the remote URL? (y/n)"
        
        if ($update -eq "y") {
            git remote set-url origin $RepoUrl
            Write-Success "REMOTE" "Remote URL updated"
        }
    }
    else {
        git remote add origin $RepoUrl
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "REMOTE" "Remote repository added successfully"
        }
        else {
            Write-Error "REMOTE-ERROR" "Failed to add remote repository"
            exit 1
        }
    }
}

# Push to GitHub
function Push-ToGitHub {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║                  PUSHING TO GITHUB                         ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""
    
    Write-Info "PUSH" "Pushing to origin/$($Config.DefaultBranch)..."
    Write-Warning "AUTH" "You may be prompted for GitHub credentials"
    
    git push -u origin $Config.DefaultBranch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "PUSH-COMPLETE" "Successfully pushed to GitHub!"
    }
    else {
        Write-Error "PUSH-ERROR" "Failed to push to GitHub"
        Write-Info "HELP" "Make sure you have the correct permissions and authentication"
        Write-Info "TOKEN" "You may need to use a Personal Access Token instead of password"
    }
}

# Display summary
function Show-Summary {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                  DEPLOYMENT SUMMARY                        ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Project:  " -NoNewline -ForegroundColor Yellow
    Write-Host $Config.ProjectName
    
    Write-Host "Version:  " -NoNewline -ForegroundColor Yellow
    Write-Host $Config.Version
    
    Write-Host "Author:   " -NoNewline -ForegroundColor Yellow
    Write-Host $Config.Author
    
    Write-Host "Branch:   " -NoNewline -ForegroundColor Yellow
    Write-Host $Config.DefaultBranch
    
    try {
        $commitCount = git rev-list --count HEAD 2>&1
        Write-Host "Commits:  " -NoNewline -ForegroundColor Yellow
        Write-Host $commitCount
    }
    catch {}
    
    try {
        $fileCount = (git ls-files | Measure-Object).Count
        Write-Host "Files:    " -NoNewline -ForegroundColor Yellow
        Write-Host $fileCount
    }
    catch {}
    
    Write-Host ""
}

# Main deployment function
function Start-Deployment {
    Show-Banner
    
    # Check Git
    if (-not (Test-GitInstalled)) {
        exit 1
    }
    
    # Initialize Git
    Initialize-GitRepo
    
    # Stage files
    Add-AllFiles
    
    # Create commit
    New-InitialCommit
    
    # Set branch
    Set-DefaultBranch
    
    # Get repository URL
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║              GITHUB REPOSITORY SETUP                       ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""
    
    $repoUrl = Read-Host "Enter your GitHub repository URL"
    
    if (-not $repoUrl -or $repoUrl -notmatch "github.com") {
        Write-Error "INVALID-URL" "Invalid GitHub repository URL"
        exit 1
    }
    
    # Add remote
    Add-RemoteRepo $repoUrl
    
    # Push to GitHub
    Push-ToGitHub
    
    # Show summary
    Show-Summary
    
    Write-Success "DEPLOYMENT" "GitHub deployment completed successfully!"
    Write-Info "NEXT-STEPS" "Visit your repository on GitHub to verify"
    Write-Host ""
}

# Run deployment
Start-Deployment
