# Technical architecture

## Phase 1: read-only resource diagnosis

```text
Developer -> Codex -> Open Azure plugin (skill + local MCP registration)
                   -> Microsoft Azure MCP Server (stdio, read-only, tool allowlist)
                   -> Azure management APIs (developer's scoped Reader identity)
```

- **Plugin:** a local marketplace entry installs a package containing the diagnosis skill and server configuration. There is no custom MCP server, deploy pipeline, or hosted backend.
- **Data:** resource-group inventory, resource availability when supported and VM details as the first type-specific path. Unsupported data is reported as missing, not inferred.
- **Control:** the server is started with a read-only flag and explicit tools rather than an entire namespace. The user's Azure role remains the hard boundary: use Reader only on the authorized dev group. Prompt instructions are not a permission control.
- **Scope:** each request explicitly selects a subscription and group, and tools receive those parameters or a resource ID within that group. The plugin does not fall back to shell/REST or retrieve secrets. Tool outputs are untrusted data.

Sources: [Codex plugin packaging](https://developers.openai.com/plugins/build/plugins), [Azure MCP Server tools](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/tools/), [Azure MCP upstream](https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server).

## Later phases

Write Terraform/Bicep into the application repository and validate locally, without an Azure write credential. The target project can deploy through its reviewed GitHub Actions workflow under a separate least-privilege identity. The [deployment flow](deployment-flow.md) is a future reference design, not an MVP prerequisite.

Direct operations require a separate, explicitly authorized write mode and narrowly scoped identity. They must not be added to the read-only server configuration.
