# Open Azure Plugin

A Codex plugin for managing Azure resources. The first release focuses on **read-only inventory and diagnosis** in an existing development resource group. It does not provision Azure infrastructure or depend on the sample application.

## Try it locally

1. Check that Node.js 22+ with `npx` and the Azure CLI are available in the environment where Codex runs. Sign in locally with `az login` using an identity with only **Reader** access to the target dev resource group. No Azure credentials belong in this repository or in chat.
2. Open the checkout as a trusted project in Codex. In the desktop app, restart after checkout if necessary, then install **Open Azure** from the **ITSTUD-IO Azure** source in the Plugins Directory. In Codex CLI, from the repository root, use `codex plugin marketplace add .` and `codex plugin add open-azure@itstud-io-azure`, then start a fresh session.
3. Ask: “In subscription `<subscription-id>` and resource group `<dev-resource-group>`, list resources. For `<resource-name>`, show the available Azure health evidence and say what you cannot determine.” To test configuration and provisioning/runtime state, select an existing VM.

The plugin starts Microsoft's Azure MCP Server locally over stdio. The pinned npm version, server-side read-only mode and explicit tool list define the tool surface; scoped Azure RBAC is the authorization boundary. The first npm download can take longer than later starts. The plugin does not grant Azure roles. Use an identity without broader inherited roles and avoid running other privileged Azure tooling in the same Codex context. The plugin explicitly [disables Azure MCP telemetry](https://github.com/microsoft/mcp/blob/Azure.Mcp.Server-3.0.0/servers/Azure.Mcp.Server/README.md#disabling-all-telemetry); initial npm download still requires registry access.

## What's next

- [MVP acceptance and tests](docs/mvp.md)
- [Architecture](docs/architecture.md) · [Backlog](docs/backlog.md)
- [Future deployment flow](docs/deployment-flow.md) · [Security and governance](docs/security.md)

Next: generate or update Terraform/Bicep inside the **application's own repository**, following its conventions. Validate the output without applying it. Direct Azure writes, with separate authorization and explicit approval, are a later mode.
