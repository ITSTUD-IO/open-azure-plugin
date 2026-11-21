# MVP Definition

## Goal

A developer describes an application deployment in natural language. Codex prepares the code and infrastructure. A reviewed GitHub Actions workflow deploys a sample containerized service to Azure Container Apps in **dev** and verifies health.

Example: *Create an Azure Container App in West Europe with ACR, managed identity and monitoring. Use Terraform and deploy to dev.* Region is configurable and subject to Azure policies.

## In scope

- Small HTTP sample service, tests and Dockerfile
- Terraform modules for Container Apps, ACR and monitoring
- Bootstrap and remote Terraform state
- GitHub Actions for tests, plan, protected apply, build, scan and deployment
- GitHub OIDC / Entra ID federation
- Azure MCP read-only discovery and diagnosis
- Pull requests and human approval
- HTTPS health check and deployment status reporting
- Codex instructions in `AGENTS.md`

## Out of scope

Production deployments, AKS, multiple application tenants, autonomous remediation, custom MCP facade and mandatory direct ChatGPT remote-MCP connectivity.

## Acceptance criteria

- [ ] Codex proposes application and Terraform changes in a PR.
- [ ] CI runs tests, Terraform format/validate, security checks and plan.
- [ ] Privileged jobs authenticate via OIDC, without stored Azure client secrets.
- [ ] Reviewed infrastructure changes apply with remote state and locking.
- [ ] A scanned container image is pushed to ACR and deployed by digest.
- [ ] HTTPS health endpoint succeeds after deployment.
- [ ] Failures are reported with actionable logs.
- [ ] A known-good image can be redeployed through a protected workflow.
- [ ] Agent credentials do not permit direct production writes.

## Definition of done

A developer can follow documented prerequisites, create a PR, observe checks, approve the dev deployment, reach the service over HTTPS and inspect logs. All privileged actions remain auditable.

## Prerequisites

Azure subscription, scoped permissions, enabled GitHub Actions, OIDC federation, initial state storage, agreed region and naming convention, budget and required organization policies.
