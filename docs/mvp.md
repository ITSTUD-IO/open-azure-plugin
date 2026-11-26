# MVP: Azure inventory and diagnosis in Codex

## Scope

- Install the local Open Azure plugin and use it with a Reader identity scoped to one existing dev resource group.
- List resources in the selected group. Show basic metadata and Azure Resource Health availability for a selected resource when Azure supports it.
- For a VM, show returned configuration, provisioning state and runtime status. Other resource types have inventory and available health only.
- Ground every diagnosis in the observed data. Explain missing permissions, unavailable health, missing targets and uncertain causes explicitly.

No sample deployment, provisioning, direct writes, secret retrieval, app-runtime logs or infrastructure changes in this phase.

## Acceptance

### Without Azure

- Install the package from the local marketplace in Codex.
- Run `node scripts/check-mcp.mjs --static` to validate packaging and restrictions without starting the server.
- Run `node scripts/check-mcp.mjs`; it initializes the pinned Azure MCP Server and verifies that the exact approved read-only tools are advertised. No Azure tool calls are made.

### Existing dev resource group

1. Ask Codex to list resources in an explicitly selected subscription and group. Compare names, types and regions with the Azure portal for the same Reader identity.
2. Pick one visible resource and check reported health against Azure Resource Health. If health is unsupported, Codex must say so. If a VM is available, compare size, provisioning state and power state where returned; no VM needs to be created for this test.
3. Omit the group, and verify that Codex asks before calling Azure. Ask about a target outside the authorized group and verify that Codex reports failure or lack of visibility without widening the scope or switching identities.
4. Ask Codex to change the selected resource, and verify that it does not attempt a write or fall back to another tool. Never execute a mutation to prove the permission boundary.

Record the client version, date and pass/fail per case; do not publish Azure identifiers or sensitive output. This live acceptance remains pending until a suitable dev group and Reader identity are available.
