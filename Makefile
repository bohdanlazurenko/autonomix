.PHONY: bootstrap demo ui backend integration install secrets clean help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo ">> Installing dependencies..."
	cd backend && npm install
	cd ui && npm install
	cd integration && npm install
	cd scripts && npm install
	@echo ">> Done!"

bootstrap: ## Create GitHub repos and setup infrastructure
	@echo ">> Creating GitHub repositories..."
	@./scripts/bootstrap-repos.sh
	@echo ">> Setup complete! Remember to configure secrets."

secrets: ## Setup GitHub secrets (interactive)
	@echo ">> Setting up GitHub secrets..."
	@node scripts/setup-secrets.js

ui: ## Build UI
	@echo ">> Building UI..."
	cd ui && npm run build
	@echo ">> UI build complete!"

backend: ## Build backend Docker image
	@echo ">> Building backend..."
	cd backend && docker build -t autonomix-backend:latest .
	@echo ">> Backend build complete!"

integration: ## Test integration services
	@echo ">> Testing integration..."
	cd integration && npm test
	@echo ">> Integration test complete!"

demo: ## Full demo: create tenant → generate → deploy
	@echo ">> Running full demo..."
	@node scripts/create-tenant.js "demo-acme"
	@node scripts/generate-app.js "demo-acme"
	@node scripts/deploy-vercel.js "demo-acme"
	@echo ""
	@echo "✅ Demo complete!"
	@echo "Repo: $$(cat tmp/demo-acme.repo-url)"
	@echo "App:  $$(cat tmp/demo-acme.deploy-url)"

clean: ## Clean temporary files
	@echo ">> Cleaning..."
	rm -rf tmp/
	rm -rf */node_modules
	rm -rf */dist
	rm -rf */.next
	@echo ">> Clean complete!"

dev-backend: ## Run backend in development mode
	cd backend && npm run dev

dev-ui: ## Run UI in development mode
	cd ui && npm run dev

dev: ## Run both backend and UI in development mode
	@echo ">> Starting development servers..."
	@make -j2 dev-backend dev-ui

deploy-ui: ## Deploy UI to Vercel
	@echo ">> Deploying UI..."
	cd ui && vercel --prod --token $$VERCEL_TOKEN
	@echo ">> UI deployed!"

deploy-backend: ## Deploy backend to Railway
	@echo ">> Deploying backend..."
	cd backend && railway up --service backend
	@echo ">> Backend deployed!"

deploy: deploy-backend deploy-ui ## Deploy everything

health: ## Check service health
	@echo ">> Checking backend health..."
	@curl -f $$BACKEND_URL/health || echo "❌ Backend unhealthy"
	@echo ">> Checking UI..."
	@curl -f $$UI_URL || echo "❌ UI unhealthy"
