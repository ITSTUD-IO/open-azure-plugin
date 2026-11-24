# Open Azure Plugin

**Agentic Azure Application Deployment Platform** — architecture and MVP design.

> Status: The sample app and CI are available. No Azure resources or deployment pipelines have been provisioned.

## Vision

ChatGPT handles natural-language intent and review, Codex prepares application and infrastructure changes, MCP provides scoped integration with Azure and GitHub, and GitHub Actions executes reviewed deployments.

**Principle:** Agents propose; protected GitHub Actions workflows deploy.

## Documentation

- [Technical architecture](docs/architecture.md)
- [MVP definition and acceptance criteria](docs/mvp.md)
- [Deployment process](docs/deployment-flow.md)
- [Security and governance](docs/security.md)
- [Implementation backlog](docs/backlog.md)
- [Coding agent instructions](AGENTS.md)

## Initial stack

ChatGPT, Codex, Azure MCP Server, GitHub MCP/connector, Terraform, GitHub Actions, Azure Container Apps, Azure Container Registry, Azure Key Vault, Azure Monitor, Entra ID with OIDC, and Azure Blob Storage for Terraform state.

The first MVP targets one containerized application in one Azure dev environment. Production deployment, AKS and a custom remote deployment MCP facade are later phases.

## Official references

- [Azure MCP Server](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/)
- [Azure MCP source](https://github.com/Azure/azure-mcp)
- [Azure Container Apps GitHub Actions](https://learn.microsoft.com/en-us/azure/container-apps/github-actions)
- [GitHub Actions OIDC in Azure](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-azure)

## Run the sample app

From the repository root, using Docker:

```sh
docker build -t open-azure-plugin-sample ./app
docker run --rm -p 127.0.0.1:8080:8080 open-azure-plugin-sample
```

In another terminal:

```sh
curl --fail http://localhost:8080/
curl --fail http://localhost:8080/healthz
```

The health endpoint returns `{"status":"ok"}` and can be used for a future Container Apps probe. The app listens on port 8080 by default; set `PORT` to override it. Run the unit tests without Docker with `cd app && go test ./...`.

GitHub Actions checks formatting, runs `go vet` and the unit tests, and smoke-tests the image. It does not push the image, use cloud credentials, or deploy anything.

## Next step

Bootstrap the dev Azure environment and OIDC identities, provision its infrastructure with Terraform, and add protected GitHub Actions deployment workflows.
