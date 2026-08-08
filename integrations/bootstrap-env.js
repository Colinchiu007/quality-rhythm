#!/usr/bin/env node
/**
 * 机制整合包 — 新环境用户级一键配置（质量节拍 5.6 机制集成）
 *
 * 用法（新电脑执行一次）：
 *   node bootstrap-env.js [--dry-run] [--yes]
 *
 * 自动化范围：
 *   1. fastctx：npm i -g fastctx + fastctx apply --yes + status
 *   2. codegraph：npm i -g @colbymchenry/codegraph（已装跳过）
 *   3. ~/.codex/config.toml：备份后只追加缺失的 [mcp_servers.*] 段（自动检测路径，不覆盖已有配置）
 *   4. 质量节拍 skill：git clone Colinchiu007/quality-rhythm → ~/.agents/skills/质量节拍（可选）
 *
 * 仍需手工（脚本只提示）：Claude/antigravity/Gemini 认证与 API Key、Codex 完全重启。
 * 安全：不读取/写入任何密钥；config.toml 修改前自动备份；--dry-run 只打印计划。
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const DRY = process.argv.includes('--dry-run');
const YES = process.argv.includes('--yes');
const HOME = os.homedir();
const CODEX_CONFIG = path.join(HOME, '.codex', 'config.toml');
const SKILL_DEST = path.join(HOME, '.agents', 'skills', '质量节拍');
const QR_REPO = 'https://github.com/Colinchiu007/quality-rhythm.git';
const BOOTSTRAP_DIR = __dirname;

function log(msg) { console.log(msg); }
function run(cmd, opts = {}) {
  if (DRY) { log(`  [dry-run] 将执行: ${cmd}`); return ''; }
  try { return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }); }
  catch (e) { return String(e.stdout || '') + String(e.stderr || ''); }
}
function has(cmd) {
  try { execSync(`${cmd} --version`, { stdio: 'pipe', encoding: 'utf8' }); return true; } catch { return false; }
}
function detectFastCtxBin() {
  const candidates = [
    path.join(HOME, '.fastctx', 'bin', 'fastctx.exe'),
    path.join(HOME, '.fastctx', 'bin', 'fastctx'),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c.replace(/\\/g, '/');
  try {
    const out = execSync('npm prefix -g 2>nul || npm prefix -g', { encoding: 'utf8' }).trim();
    if (out) {
      const exe = path.join(out, 'fastctx.exe');
      if (fs.existsSync(exe)) return exe.replace(/\\/g, '/');
    }
  } catch (_) {}
  return '{{FASTCTX_BIN}}';
}
function detectNodeRepl() {
  const runtimes = path.join(HOME, 'AppData', 'Local', 'OpenAI', 'Codex', 'runtimes');
  if (!fs.existsSync(runtimes)) return '{{NODE_REPL_EXE}}';
  const found = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name === 'node_repl.exe') found.push(full);
    }
  };
  walk(runtimes);
  return found.length ? found[0].replace(/\\/g, '/') : '{{NODE_REPL_EXE}}';
}

function ensureMcpSegment(existing, header, lines) {
  if (existing.includes(header)) return false; // 已有该段，不覆盖
  return lines;
}

async function main() {
  log(`
╔══════════════════════════════════════════════════╗
║  机制整合包 — 新环境用户级一键配置                ║
╚══════════════════════════════════════════════════╝
${DRY ? '模式: --dry-run（只打印计划，不执行）' : '模式: 执行'}
`);

  // ── 1. fastctx ──
  log('\n[1/5] fastctx...');
  if (has('fastctx')) { log('  已安装，跳过 npm install'); }
  else { run('npm i -g fastctx'); log('  npm i -g fastctx 完成'); }
  run('fastctx apply --yes');
  run('fastctx status');

  // ── 2. codegraph ──
  log('\n[2/5] codegraph...');
  if (has('codegraph')) { log('  已安装，跳过'); }
  else { run('npm i -g @colbymchenry/codegraph'); log('  npm i -g @colbymchenry/codegraph 完成'); }

  // ── 3. config.toml 合并 ──
  log('\n[3/5] ~/.codex/config.toml...');
  const fastCtxBin = detectFastCtxBin();
  const nodeRepl = detectNodeRepl();
  const mcpBlocks = [
    [`[mcp_servers.codegraph]`, `command = "codegraph"\nargs = [ "serve", "--mcp" ]\n\n[mcp_servers.codegraph.tools.codegraph_node]\napproval_mode = "approve"`],
    [`[mcp_servers.context7]`, `type = "stdio"\ncommand = "cmd"\nargs = [ "/c", "npx", "-y", "@upstash/context7-mcp@latest" ]`],
    [`[mcp_servers.fastctx]`, `command = "${fastCtxBin}"\nargs = ["serve", "--enable-shell"]\nstartup_timeout_sec = 120\n\n[mcp_servers.fastctx.env]\nFASTCTX_TOKEN_BUDGET = "8500"\nFASTCTX_GLOB_TOKEN_BUDGET = "4300"`],
    [`[mcp_servers.node_repl]`, `args = []\ncommand = '${nodeRepl}'\nstartup_timeout_sec = 120`],
  ];
  const appendLines = [];
  let existing = '';
  if (fs.existsSync(CODEX_CONFIG)) {
    existing = fs.readFileSync(CODEX_CONFIG, 'utf8');
    for (const [header, body] of mcpBlocks) {
      if (!existing.includes(header)) appendLines.push(`\n${header}\n${body}`);
    }
    if (!DRY) {
      const bak = `${CODEX_CONFIG}.bak-${new Date().toISOString().replace(/[:.]/g, '-')}`;
      fs.copyFileSync(CODEX_CONFIG, bak);
      log(`  已备份: ${bak}`);
    }
  } else {
    if (!DRY) fs.mkdirSync(path.dirname(CODEX_CONFIG), { recursive: true });
    const all = mcpBlocks.map(([h, b]) => `\n${h}\n${b}`).join('');
    appendLines.push(all);
  }
  if (appendLines.length) {
    if (!DRY) fs.appendFileSync(CODEX_CONFIG, appendLines.join(''));
    log(`  追加 ${appendLines.length} 个缺失 MCP 段${DRY ? '（dry-run 未写入）' : ''}`);
    for (const l of appendLines) log(`    + ${l.split('\n')[0]}`);
  } else {
    log('  所有 MCP 段已存在，无改动');
  }

  // ── 4. 质量节拍 skill ──
  log('\n[4/5] 质量节拍 skill...');
  if (fs.existsSync(SKILL_DEST)) { log(`  已存在: ${SKILL_DEST}（跳过 clone）`); }
  else if (YES) {
    fs.mkdirSync(path.dirname(SKILL_DEST), { recursive: true });
    run(`git clone --depth 1 ${QR_REPO} "${SKILL_DEST}"`);
    log(`  git clone → ${SKILL_DEST}`);
  } else {
    log(`  建议: git clone --depth 1 ${QR_REPO} "${SKILL_DEST}"`);
  }

  // ── 5. 手工清单 ──
  log('\n[5/5] 仍需手工（脚本不处理）:');
  log('  - Claude / antigravity / Gemini 登录与 API Key（CCG 双模型认证）');
  log('  - 目标项目: openspec init --tools codex --force + node integrations/install-mechanism.js <项目>');
  log('  - Codex 完全重启（.agents/skills 与 AGENTS.md 启动时加载）');
  log('  - 生效验证: 见 integrations/env-checklist.md 第 7 节');

  log('\n完成。');
}

main().catch((e) => { console.error(e); process.exit(1); });