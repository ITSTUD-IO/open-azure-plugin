import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const marketplace = await json('../.agents/plugins/marketplace.json');
const manifest = await json('../plugins/open-azure/.codex-plugin/plugin.json');
assert.equal(marketplace.plugins[0].name, manifest.name);
assert.equal(manifest.mcpServers, './.mcp.json');
assert.equal(manifest.skills, './skills/');
assert.equal(marketplace.plugins[0].source.path, './plugins/open-azure');
const config = await json('../plugins/open-azure/.mcp.json');
assert.deepEqual(Object.keys(config.mcpServers), ['azure-readonly']);
const { command, args, env = {} } = config.mcpServers['azure-readonly'];
const expected = [
  'compute_vm_get',
  'group_resource_list',
  'resourcehealth_availability-status_get',
];
assert.equal(command, 'npx');
assert.deepEqual(env, { AZURE_MCP_COLLECT_TELEMETRY: 'false' });
assert.deepEqual(args.slice(0, 7), [
  '--yes', '@azure/mcp@3.0.0', 'server', 'start', '--transport', 'stdio', '--read-only',
]);
assert.deepEqual(args.slice(7), expected.flatMap((name) => ['--tool', name]));
await readFile(new URL('../plugins/open-azure/skills/azure-resource-diagnosis/SKILL.md', import.meta.url));

if (process.argv.includes('--static')) {
  console.log('Plugin manifests, telemetry opt-out and tool allowlist validated.');
  process.exit(0);
}

// Start the very command shipped in the plugin. Discover tools, never call them.
const child = spawn(command, args, {
  env: { ...process.env, ...env },
  stdio: ['pipe', 'pipe', 'inherit'],
});
const lines = createInterface({ input: child.stdout });
const responses = lines[Symbol.asyncIterator]();
const timeout = setTimeout(() => {
  console.error('Timed out waiting for the Azure MCP Server');
  process.exitCode = 1;
  child.kill();
  lines.close();
}, 120_000);
child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
  lines.close();
});
child.stdin.on('error', () => {}); // The stdio reader reports an early server exit.
const send = (message) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', ...message }) + '\n');
async function request(id, method, params) {
  send({ id, method, params });
  while (true) {
    const { done, value } = await responses.next();
    assert.ok(!done, 'MCP server exited before responding to ' + method);
    const response = JSON.parse(value);
    if (response.id !== id) continue;
    assert.ok(!response.error, JSON.stringify(response.error));
    return response.result;
  }
}

try {
  const server = await request(1, 'initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'open-azure-smoke', version: manifest.version },
  });
  assert.ok(server.capabilities.tools);
  send({ method: 'notifications/initialized' });
  const { tools, nextCursor } = await request(2, 'tools/list', {});
  assert.ok(!nextCursor, 'unexpected extra tool page');
  assert.deepEqual(tools.map(({ name }) => name).sort(), expected);
  assert.ok(tools.every(({ annotations }) => annotations?.readOnlyHint === true));
  console.log('MCP initialized; exactly three approved read-only tools exposed. No Azure operations called.');
} finally {
  clearTimeout(timeout);
  child.stdin.end();
  child.kill();
  lines.close();
}
