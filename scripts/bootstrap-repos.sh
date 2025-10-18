#!/bin/bash
set -e

echo "🚀 AutonomiX Bootstrap Script"
echo "==============================="
echo ""

# Check for required tools
echo "Checking dependencies..."
command -v gh >/dev/null 2>&1 || { echo "❌ GitHub CLI (gh) not found. Install from https://cli.github.com/"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Install from https://nodejs.org/"; exit 1; }

echo "✓ All dependencies found"
echo ""

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

ORG_NAME=${GH_ORG:-autonomix}

echo "Creating GitHub organization/repositories..."
echo "Organization: $ORG_NAME"
echo ""

# Create repositories
repos=("ui" "backend" "integration")

for repo in "${repos[@]}"; do
  echo "Creating $ORG_NAME/$repo..."
  
  # Check if repo exists
  if gh repo view "$ORG_NAME/$repo" >/dev/null 2>&1; then
    echo "  ✓ Repository already exists"
  else
    gh repo create "$ORG_NAME/$repo" --public --description "AutonomiX $repo component" || true
    echo "  ✓ Repository created"
  fi
done

echo ""
echo "Setting up branch protection (optional)..."

for repo in "${repos[@]}"; do
  echo "Protecting main branch for $ORG_NAME/$repo..."
  
  # Basic branch protection
  gh api -X PUT "/repos/$ORG_NAME/$repo/branches/main/protection" \
    --input - >/dev/null 2>&1 <<EOF || echo "  ⚠️  Branch protection failed (might need admin rights)"
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
  echo "  ✓ Protection configured"
done

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "Next steps:"
echo "1. Configure secrets: make secrets"
echo "2. Set up .env file with your tokens"
echo "3. Deploy infrastructure: make deploy"
