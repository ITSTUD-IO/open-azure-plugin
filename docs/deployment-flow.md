# Deployment Process

## Infrastructure pipeline

1. Codex creates a feature branch and changes Terraform.
2. PR CI executes `terraform fmt -check`, `terraform validate`, linting, IaC scanning, policy checks and `terraform plan`.
3. Reviewers see a sanitized plan summary. Raw plan artifacts are restricted because they may contain secrets.
4. Review and protected environment approval are required.
5. Trusted workflow acquires short-lived credentials via GitHub OIDC.
6. Apply uses the approved plan tied to commit, environment and state. If these change, re-plan and reapprove.
7. Record the workflow run, resulting resources and diagnostics.

## Application pipeline

1. PR triggers unit tests and static checks.
2. Trusted post-merge job builds and scans the container image.
3. Push to ACR; record immutable image digest.
4. Deploy digest to Azure Container Apps, creating a new revision.
5. Run HTTPS smoke and health checks, inspect logs and report revision/digest/status.

## Recovery

Redeploy a previously validated digest or revision using a protected workflow. Infrastructure rollback requires a separately reviewed Terraform change.

## Workflow security

- Pin external GitHub Actions to immutable SHAs where feasible.
- Grant minimal GitHub token permissions; `id-token: write` only for jobs using OIDC.
- Never expose deployment credentials to arbitrary PR code.
- Protect deployment environments and prevent concurrent state mutation.
- Limit Terraform plan artifact access and retention.
- Restrict who can modify deployment workflows via CODEOWNERS and review.
