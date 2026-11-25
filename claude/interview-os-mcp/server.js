#!/usr/bin/env node
// Interview OS MCP server: exposes a pipeline file (same shape as the Interview OS
// "pipeline" document: { rows: [...] }) as tools any MCP client can call.
// Data stays on your machine. Set PIPELINE_FILE to your own export; without it the
// server uses demo-pipeline.json (fictional companies).
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FILE = process.env.PIPELINE_FILE || join(here, 'demo-pipeline.json');
const STATUSES = ['review', 'to_apply', 'referral', 'applied', 'screen', 'interview', 'offer', 'noreply', 'waiting_open', 'archived'];
const ACTIVE = new Set(['to_apply', 'referral', 'applied', 'screen', 'interview', 'offer']);

const today = () => new Date().toISOString().slice(0, 10);
function load() {
  if (!existsSync(FILE)) return { rows: [] };
  const d = JSON.parse(readFileSync(FILE, 'utf8'));
  return Array.isArray(d.rows) ? d : { ...d, rows: [] };
}
function save(d) {
  d.at = new Date().toISOString();
  const tmp = FILE + '.tmp';
  writeFileSync(tmp, JSON.stringify(d, null, 1));
  renameSync(tmp, FILE); // atomic replace, so a crash never leaves half a file
}
const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9א-ת]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const brief = (r) => ({ id: r.id, company: r.company, role: r.role, status: r.status, score: r.score, next: r.next || '', nextAt: r.nextAt || '' });
const text = (o) => ({ content: [{ type: 'text', text: JSON.stringify(o, null, 2) }] });
const fail = (msg) => ({ isError: true, content: [{ type: 'text', text: msg }] });

const server = new McpServer({ name: 'interview-os', version: '0.1.0' });

server.registerTool('list_jobs', {
  title: 'List jobs',
  description: 'List jobs in the pipeline, newest first. Filter by status, minimum score or a text match on company/role.',
  inputSchema: {
    status: z.enum(STATUSES).optional().describe('Only this status'),
    active_only: z.boolean().optional().describe('Only jobs still in play (to_apply → offer)'),
    min_score: z.number().min(0).max(100).optional(),
    q: z.string().optional().describe('Text to match in company or role'),
    limit: z.number().int().min(1).max(200).optional().describe('Default 30')
  },
  annotations: { readOnlyHint: true }
}, async ({ status, active_only, min_score, q, limit = 30 }) => {
  let rows = load().rows;
  if (status) rows = rows.filter((r) => r.status === status);
  if (active_only) rows = rows.filter((r) => ACTIVE.has(r.status));
  if (min_score != null) rows = rows.filter((r) => (r.score || 0) >= min_score);
  if (q) { const n = q.toLowerCase(); rows = rows.filter((r) => `${r.company} ${r.role}`.toLowerCase().includes(n)); }
  rows = [...rows].sort((a, b) => (b.added || '').localeCompare(a.added || ''));
  return text({ total: rows.length, jobs: rows.slice(0, limit).map(brief) });
});

server.registerTool('get_job', {
  title: 'Get one job',
  description: 'Everything stored about one job: score parts, pros, cons, history and next step.',
  inputSchema: { id: z.string() },
  annotations: { readOnlyHint: true }
}, async ({ id }) => {
  const r = load().rows.find((x) => x.id === id);
  return r ? text(r) : fail(`No job with id "${id}". Call list_jobs to see ids.`);
});

server.registerTool('add_job', {
  title: 'Add a job',
  description: 'Add a job to the pipeline with status "review". Score it first (for example with the job-fit skill) and pass the score and parts if you have them.',
  inputSchema: {
    company: z.string().min(1),
    role: z.string().min(1),
    url: z.string().url().optional(),
    location: z.string().optional(),
    score: z.number().int().min(1).max(100).optional(),
    score_parts: z.array(z.tuple([z.string(), z.number(), z.number()])).optional().describe('[[part name, points, max], ...]'),
    pros: z.array(z.string()).max(5).optional(),
    cons: z.array(z.string()).max(5).optional(),
    next: z.string().optional().describe('Next step, in the user\'s words')
  }
}, async (a) => {
  const d = load();
  let id = slug(`${a.company}-${a.role}`) || `job-${Date.now()}`;
  if (a.url && d.rows.some((r) => r.url && r.url === a.url)) return fail('This link is already in the pipeline.');
  while (d.rows.some((r) => r.id === id)) id += '-2';
  const row = {
    id, company: a.company, role: a.role, url: a.url || '', loc: a.location || '',
    status: 'review', score: a.score ?? null, added: today(), lastTouch: today(),
    hist: [{ d: today(), s: 'review' }], next: a.next || 'לקרוא את המודעה ולהחליט', nextAt: '', src: 'MCP'
  };
  if (a.score_parts) row.scoreParts = a.score_parts;
  if (a.pros) row.pros = a.pros;
  if (a.cons) row.cons = a.cons;
  d.rows.unshift(row);
  save(d);
  return text({ added: brief(row) });
});

server.registerTool('move_job', {
  title: 'Change a job\'s status',
  description: 'Move a job to a new status and optionally set the next step and its date. History is kept.',
  inputSchema: {
    id: z.string(),
    status: z.enum(STATUSES),
    next: z.string().optional(),
    next_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('YYYY-MM-DD'),
    why: z.string().optional().describe('Reason, required by convention when archiving')
  },
  annotations: { idempotentHint: true }
}, async ({ id, status, next, next_at, why }) => {
  const d = load();
  const r = d.rows.find((x) => x.id === id);
  if (!r) return fail(`No job with id "${id}".`);
  if (r.status !== status) { r.hist = [...(r.hist || []), { d: today(), s: status }]; r.status = status; }
  if (status === 'applied' && !r.appliedAt) r.appliedAt = today();
  if (next != null) r.next = next;
  if (next_at != null) r.nextAt = next_at;
  if (why != null) r.why = why;
  r.lastTouch = today();
  save(d);
  return text({ moved: brief(r) });
});

server.registerTool('pipeline_stats', {
  title: 'Pipeline summary',
  description: 'Counts by status, average score of active jobs, reply rate, and what is due in the next 7 days.',
  inputSchema: {},
  annotations: { readOnlyHint: true }
}, async () => {
  const rows = load().rows;
  const by = {};
  rows.forEach((r) => { by[r.status] = (by[r.status] || 0) + 1; });
  const active = rows.filter((r) => ACTIVE.has(r.status));
  const applied = rows.filter((r) => r.appliedAt);
  const replied = applied.filter((r) => ['screen', 'interview', 'offer'].includes(r.status) || (r.hist || []).some((h) => ['screen', 'interview', 'offer'].includes(h.s)));
  const week = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const due = rows.filter((r) => r.nextAt && r.nextAt <= week && r.status !== 'archived').sort((a, b) => a.nextAt.localeCompare(b.nextAt)).map(brief);
  const avg = active.length ? Math.round(active.reduce((s, r) => s + (r.score || 0), 0) / active.length) : null;
  return text({ total: rows.length, by_status: by, active: active.length, avg_active_score: avg, applied: applied.length, reply_rate: applied.length ? `${Math.round(100 * replied.length / applied.length)}%` : null, due_next_7_days: due });
});

server.registerResource('pipeline', 'interview-os://pipeline', {
  title: 'Pipeline file', description: 'The raw pipeline JSON this server reads and writes', mimeType: 'application/json'
}, async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(load(), null, 1) }] }));

await server.connect(new StdioServerTransport());
console.error(`interview-os MCP server on stdio · file: ${FILE}`);
