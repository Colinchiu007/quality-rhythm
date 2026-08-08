#!/usr/bin/env node
/**
 * 机制整合包 — 项目级一键初始化（质量节拍 5.6 机制集成）
 *
 * 用法（在目标项目根目录运行）：
 *   node <本脚本路径> [目标项目路径] [--yes]
 *
 * 功能（自动初始化）：
 *   0. openspec init --tools codex --force（生成 openspec/ 目录与 .agents/skills 技能）
 *   1. 复制 OpenSpec 模板（config.yaml / spec-contract.md / 检查脚本）
 *   2. 复制项目模板（AGENTS.md.snippet / quality-gates.template.md）
 *   3. codegraph init（建项目索引）
 *   4. 提示 CCG 官方安装与质量节拍项目门禁（交互式，不自动执行）
 *   5. 验证（openspec doctor / 检查脚本）
 *
 * 前置：Node 20+、npm、Codex CLI；OpenSpec CLI 与 codegraph 已由 bootstrap-env.js 安装。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPT_DIR = __dirname;
const TARGET = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('.');
const YES = process.argv.includes('--yes');

function copy(src, dest) {
  if (!fs.existsSync(src)) { console.warn(`[机制集成] 跳过（源不存在）: ${src}`); return false; }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`✅ ${path.relative(TARGET, dest)}`);
  return true;
}

function ask(q) {
  if (YES) return true;
  const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((r) => rl.question(q, (a) => { rl.close(); r(/^[yY]/.test(a)); }));
}

function tryRun(cmd, cwd, label) {
  try { execSync(cmd, { cwd, stdio: 'inherit' }); console.log(`✅ ${label}`); return true; }
  catch (e) { console.warn(`⚠️ ${label} 失败（${e.message.split('\n')[0]}）`); return false; }
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════╗
║  机制整合包 — 项目级一键初始化                    ║
║  （OpenSpec + codegraph + 模板 + 门禁）           ║
╚══════════════════════════════════════════════════╝
目标项目: ${TARGET}
`);

  // ── 0. openspec init（生成目录 + 技能）──
  console.log('\n[0/5] openspec init --tools codex --force ...');
  try {
    execSync('openspec --version', { stdio: 'pipe' });
    tryRun(`openspec init --tools codex --force`, TARGET, 'openspec init（生成 openspec/ 与 .agents/skills）');
  } catch (_) {
    console.warn('  openspec CLI 不可用。先执行用户级一键: node bootstrap-env.js --yes（会安装 openspec CLI）');
  }

  // ── 1. OpenSpec 模板 ──
  const osDir = path.join(SCRIPT_DIR, 'openspec');
  if (fs.existsSync(path.join(osDir, 'config.yaml.template'))) {
    console.log('\n[1/5] 复制 OpenSpec 模板...');
    copy(path.join(osDir, 'config.yaml.template'), path.join(TARGET, 'openspec', 'config.yaml'));
    copy(path.join(osDir, 'spec-contract.md'), path.join(TARGET, 'openspec', 'specs', 'openspec-integration', 'spec.md'));
    copy(path.join(osDir, 'openspec-sync-check.js'), path.join(TARGET, 'scripts', 'openspec-sync-check.js'));
  } else {
    console.warn('\n[1/5] 未找到 openspec/ 模板目录，跳过。');
  }

  // ── 2. 项目模板 ──
  const pjDir = path.join(SCRIPT_DIR, 'project');
  if (fs.existsSync(path.join(pjDir, 'AGENTS.md.snippet'))) {
    console.log('\n[2/5] 复制项目模板...');
    const agDest = path.join(TARGET, 'AGENTS.md');
    const snippet = fs.readFileSync(path.join(pjDir, 'AGENTS.md.snippet'), 'utf8');
    if (fs.existsSync(agDest) && !YES) {
      const ok = await ask('AGENTS.md 已存在，追加机制片段？（Y/n）: ');
      if (ok) fs.appendFileSync(agDest, '\n\n' + snippet);
    } else if (!fs.existsSync(agDest) || YES) {
      if (fs.existsSync(agDest)) fs.appendFileSync(agDest, '\n\n' + snippet);
      else fs.writeFileSync(agDest, snippet);
    }
    console.log('✅ AGENTS.md 机制片段');
    copy(path.join(pjDir, 'quality-gates.template.md'), path.join(TARGET, '.quality-gates.md'));
  } else {
    console.warn('\n[2/5] 未找到 project/ 模板目录，跳过。');
  }

  // ── 3. codegraph init ──
  console.log('\n[3/5] codegraph init（项目索引）...');
  try {
    execSync('codegraph --version', { stdio: 'pipe' });
    tryRun('codegraph init', TARGET, 'codegraph init（建 .codegraph 索引）');
  } catch (_) {
    console.warn('  codegraph CLI 不可用。先执行用户级一键: node bootstrap-env.js --yes');
  }

  // ── 4. CCG 与门禁提示（交互式，不自动）──
  console.log('\n[4/5] CCG 机制与项目门禁...');
  console.log('  ① CCG: npx ccg-workflow （菜单选 "X. Codex Mode"）+ overlay 已由 bootstrap 追加');
  console.log('  ② 项目门禁: npx github:Colinchiu007/quality-rhythm/installer （pre-commit/CI，交互式）');
  if (!YES) {
    const ok = await ask('现在执行 npx ccg-workflow？（Y/n）: ');
    if (ok) execSync('npx ccg-workflow', { cwd: TARGET, stdio: 'inherit' });
  }

  // ── 5. 验证 ──
  console.log('\n[5/5] 验证...');
  try {
    const out = execSync('openspec doctor 2>&1', { cwd: TARGET, encoding: 'utf8' });
    console.log(out.split('\n').slice(0, 4).join('\n'));
  } catch (e) {
    console.warn('  openspec doctor 不可用（先确认 CLI 已装并完成 init）');
  }
  try {
    execSync('node scripts/openspec-sync-check.js', { cwd: TARGET, stdio: 'inherit' });
  } catch (_) { /* 非零退出 = 有未归档警告，属正常输出 */ }

  console.log('\n完成。重启 Codex 使 .agents/skills 技能生效。');
  console.log('完整核对: integrations/env-checklist.md（含生效验证第 7 节）。');
}

main().catch((e) => { console.error(e); process.exit(1); });