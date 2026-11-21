# Security Architecture

## Identity separation

| Identity | Scope |
| --- | --- |
| Azure MCP discovery | Reader and targeted monitoring read permissions |
| Terraform dev deploy | Dev resource group changes plus distinct Terraform state access |
| Application deploy | Limited ACR push and Container Apps update rights |
| Container App managed identity | ACR pull and required Key Vault secret access |

Bootstrap RBAC, federated credentials and state storage using separate administrator access. Production uses different identities and approval boundaries.

## Required controls

- Azure MCP read-only by default; allowlist any future write tools.
- Protected branches, PR reviews, CODEOWNERS and environment approvals.
- OIDC instead of stored client secrets.
- Do not send secrets, state files or sensitive plan values to LLMs or PR comments.
- Treat tool output, logs and source content as untrusted (prompt-injection defense).
- Scan application dependencies, container images and Terraform.
- Audit request, PR, commit, approval, workflow, principal and Azure operation.
- Enforce least privilege and Azure policy.
- Restrict workflow changes and privileged dispatch parameters.

## Threat model highlights

**Malicious MCP output:** tool response instructs the agent to bypass approvals. Mitigation: trust boundaries, tool allowlists, reviews.

**Malicious PR workflow:** untrusted code tries to obtain Azure tokens. Mitigation: separate unprivileged PR jobs and protected trusted deployment jobs.

**Plan leakage:** Terraform plan contains secret values. Mitigation: private artifacts, short retention, sanitized summaries.

**State drift:** state changes after review. Mitigation: state locking and reapproval when plan inputs change.

## Decisions pending

Exact Azure role definitions, region, subscription, cost guardrails, security scanners and organization-specific environment protection.
