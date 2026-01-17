#!/bin/bash
# GitHub Setup Bash Script
# Author: Wildflover
# Description: Automated GitHub deployment for Linux/macOS
# Language: Bash

# Configuration
PROJECT_NAME="Wildflover DM Cleaner"
VERSION="1.0.0"
AUTHOR="Wildflover"
DEFAULT_BRANCH="main"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logger functions
log_info() { echo -e "${CYAN}[$1]${NC} $2"; }
log_success() { echo -e "${GREEN}[$1]${NC} $2"; }
log_warn() { echo -e "${YELLOW}[$1]${NC} $2"; }
log_error() { echo -e "${RED}[$1]${NC} $2"; }

# Display banner
show_banner() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║         WILDFLOVER GITHUB DEPLOYMENT TOOL                  ║${NC}"
    echo -e "${CYAN}║                   Version 1.0.0                            ║${NC}"
    echo -e "${CYAN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║  Automated GitHub deployment with intelligent commits      ║${NC}"
    echo -e "${CYAN}║  Author: Wildflover                                        ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Check Git installation
check_git() {
    log_info "GIT-CHECK" "Checking Git installation..."
    
    if ! command -v git &> /dev/null; then
        log_error "GIT-ERROR" "Git is not installed"
        log_info "INSTALL" "Please install Git: https://git-scm.com/downloads"
        exit 1
    fi
    
    GIT_VERSION=$(git --version)
    log_success "GIT-FOUND" "$GIT_VERSION"
}

# Initialize Git repository
init_git() {
    log_info "GIT-INIT" "Initializing Git repository..."
    
    if [ -d ".git" ]; then
        log_warn "GIT-EXISTS" "Git repository already initialized"
        return
    fi
    
    git init
    
    if [ $? -eq 0 ]; then
        log_success "GIT-INIT" "Git repository initialized successfully"
    else
        log_error "GIT-ERROR" "Failed to initialize Git repository"
        exit 1
    fi
}

# Stage all files
stage_files() {
    log_info "GIT-ADD" "Staging all files..."
    
    git add .
    
    if [ $? -eq 0 ]; then
        log_success "GIT-ADD" "All files staged successfully"
    else
        log_error "GIT-ERROR" "Failed to stage files"
        exit 1
    fi
}

# Create initial commit
create_commit() {
    log_info "COMMIT" "Creating initial commit..."
    
    COMMIT_MSG="Initial commit: $PROJECT_NAME v$VERSION

Project Structure:
- Complete source code
- Comprehensive documentation
- GitHub workflows and templates
- Professional configuration files
- Assets and resources

Author: $AUTHOR
Ready for production deployment"
    
    git commit -m "$COMMIT_MSG"
    
    if [ $? -eq 0 ]; then
        log_success "COMMIT" "Initial commit created successfully"
    else
        log_error "COMMIT-ERROR" "Failed to create commit"
        exit 1
    fi
}

# Set default branch
set_branch() {
    log_info "BRANCH" "Setting default branch to '$DEFAULT_BRANCH'..."
    
    git branch -M $DEFAULT_BRANCH
    
    if [ $? -eq 0 ]; then
        log_success "BRANCH" "Default branch set to '$DEFAULT_BRANCH'"
    else
        log_error "BRANCH-ERROR" "Failed to set default branch"
    fi
}

# Add remote repository
add_remote() {
    local REPO_URL=$1
    
    log_info "REMOTE" "Adding remote repository..."
    
    EXISTING_REMOTE=$(git remote get-url origin 2>&1)
    
    if [ $? -eq 0 ]; then
        log_warn "REMOTE-EXISTS" "Remote origin already exists: $EXISTING_REMOTE"
        read -p "Do you want to update the remote URL? (y/n): " UPDATE
        
        if [ "$UPDATE" = "y" ]; then
            git remote set-url origin $REPO_URL
            log_success "REMOTE" "Remote URL updated"
        fi
    else
        git remote add origin $REPO_URL
        
        if [ $? -eq 0 ]; then
            log_success "REMOTE" "Remote repository added successfully"
        else
            log_error "REMOTE-ERROR" "Failed to add remote repository"
            exit 1
        fi
    fi
}

# Push to GitHub
push_github() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                  PUSHING TO GITHUB                         ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log_info "PUSH" "Pushing to origin/$DEFAULT_BRANCH..."
    log_warn "AUTH" "You may be prompted for GitHub credentials"
    
    git push -u origin $DEFAULT_BRANCH
    
    if [ $? -eq 0 ]; then
        log_success "PUSH-COMPLETE" "Successfully pushed to GitHub!"
    else
        log_error "PUSH-ERROR" "Failed to push to GitHub"
        log_info "HELP" "Make sure you have the correct permissions and authentication"
    fi
}

# Display summary
show_summary() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                  DEPLOYMENT SUMMARY                        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${YELLOW}Project:${NC}  $PROJECT_NAME"
    echo -e "${YELLOW}Version:${NC}  $VERSION"
    echo -e "${YELLOW}Author:${NC}   $AUTHOR"
    echo -e "${YELLOW}Branch:${NC}   $DEFAULT_BRANCH"
    
    COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${YELLOW}Commits:${NC}  $COMMIT_COUNT"
    fi
    
    FILE_COUNT=$(git ls-files | wc -l)
    if [ $? -eq 0 ]; then
        echo -e "${YELLOW}Files:${NC}    $FILE_COUNT"
    fi
    
    echo ""
}

# Main deployment
main() {
    show_banner
    
    check_git
    init_git
    stage_files
    create_commit
    set_branch
    
    echo ""
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║              GITHUB REPOSITORY SETUP                       ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    read -p "Enter your GitHub repository URL: " REPO_URL
    
    if [ -z "$REPO_URL" ] || [[ ! "$REPO_URL" =~ "github.com" ]]; then
        log_error "INVALID-URL" "Invalid GitHub repository URL"
        exit 1
    fi
    
    add_remote "$REPO_URL"
    push_github
    show_summary
    
    log_success "DEPLOYMENT" "GitHub deployment completed successfully!"
    log_info "NEXT-STEPS" "Visit your repository on GitHub to verify"
    echo ""
}

# Run
main
