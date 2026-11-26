# Implementation backlog

1. **Read and diagnose:** package the Codex plugin, connect the restricted local Azure MCP server, document scoped authentication and verify the workflow in a real dev resource group. Start with generic inventory, Resource Health, and VM details as the first resource-specific example.
2. **Prepare infrastructure as code:** generate or update Terraform/Bicep in the target project, honor existing modules and layout, validate and produce a reviewable diff. Do not apply. A pipeline in the target project may execute reviewed changes under its own identity and controls.
3. **Direct Azure changes:** define a separate opt-in tool surface, least-privilege write identity, explicit per-change approval, change preview, audit and recovery. Avoid autonomous remediation.

A sample app may serve as a future deployment test fixture. It is not part of the plugin or a dependency for phases 1 and 2.
