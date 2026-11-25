// Smoke test: starts the server on a temp copy of the demo file and calls every tool.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { copyFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const file = join(mkdtempSync(join(tmpdir(), 'ios-')), 'pipeline.json');
copyFileSync(join(here, 'demo-pipeline.json'), file);
const client = new Client({ name: 'smoke', version: '0' });
await client.connect(new StdioClientTransport({ command: 'node', args: [join(here, 'server.js')], env: { ...process.env, PIPELINE_FILE: file } }));
const call = async (name, args = {}) => { const r = await client.callTool({ name, arguments: args }); return { err: r.isError, data: r.isError ? r.content[0].text : JSON.parse(r.content[0].text) }; };

const tools = (await client.listTools()).tools.map((t) => t.name).sort();
assert.deepEqual(tools, ['add_job', 'get_job', 'list_jobs', 'move_job', 'pipeline_stats']);
const all = await call('list_jobs', { limit: 200 });
assert.equal(all.data.total, 24);
const high = await call('list_jobs', { min_score: 80 });
assert.ok(high.data.jobs.every((j) => j.score >= 80));
const added = await call('add_job', { company: 'Test Co', role: 'Growth Analyst', url: 'https://example.com/j/1', score: 77 });
const id = added.data.added.id;
assert.equal((await call('add_job', { company: 'X', role: 'Y', url: 'https://example.com/j/1' })).err, true, 'duplicate link refused');
const moved = await call('move_job', { id, status: 'applied', next: 'לבדוק תשובה', next_at: '2026-12-01' });
assert.equal(moved.data.moved.status, 'applied');
const one = await call('get_job', { id });
assert.equal(one.data.hist.length, 2);
assert.ok(one.data.appliedAt);
assert.equal((await call('get_job', { id: 'nope' })).err, true);
const stats = await call('pipeline_stats');
assert.equal(stats.data.total, 25);
await client.close();
console.log('ok · tools:', tools.join(', '), '· stats:', JSON.stringify(stats.data.by_status));
