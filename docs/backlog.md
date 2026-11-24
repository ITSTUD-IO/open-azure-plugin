# Implementation Backlog

## Target repository layout

```text
.github/workflows/
  ci.yml
  infra-plan.yml
  infra-apply.yml
  app-deploy.yml
app/
  src/  # HTTP service and Go tests
  go.mod
  Dockerfile
infra/
  bootstrap/
  modules/
    container-app/
    container-registry/
    monitoring/
  environments/dev/
    main.tf
    providers.tf
    variables.tf
    backend.tf
agents/
  deployment-agent.md
  security-policy.md
docs/
  architecture.md
  mvp.md
  deployment-flow.md
  security.md
  backlog.md
AGENTS.md
README.md
```

This is the target structure. The sample app and PR CI are implemented; the Azure infrastructure and deployment pipelines are not.

## Milestone 1 — Foundation (2–3 developer days)

- [ ] Select Azure region, resource naming, cost budget
- [ ] Bootstrap Terraform state storage and access
- [ ] Configure GitHub environments and branch protection
- [ ] Create scoped Entra ID identities and OIDC federation
- [ ] Connect Codex to read-only Azure MCP
- [ ] Verify safe resource discovery

## Milestone 2 — CI/CD (3–4 developer days)

- [x] Implement sample HTTP application, Dockerfile and tests
- [x] Add PR checks for Go and an HTTP smoke test against the container
- [ ] Build Terraform modules and dev environment
- [ ] Add Terraform plan summary and infrastructure security checks to PR CI
- [ ] Implement protected Terraform apply
- [ ] Build, scan, push image and deploy by digest
- [ ] Verify HTTPS health endpoint and runtime logs

## Milestone 3 — Agent workflow (2–3 developer days)

- [ ] Add Codex task instructions
- [ ] Integrate PR/workflow status checks
- [ ] Add post-deployment status report and diagnosis
- [ ] Document controlled rollback
- [ ] Exercise failure paths and permissions tests

**Estimate:** 7–10 developer days for an Azure/GitHub-experienced developer, excluding organizational approval delays and direct ChatGPT remote MCP integration.

## Later epics

- Remote deployment MCP facade and direct ChatGPT integration
- Additional runtime adapters: Azure Functions, App Service, AKS
- Promotion across environments
- Drift detection, policy-as-code and cost controls
- Multi-application catalog and self-service onboarding
