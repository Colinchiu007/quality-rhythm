#!/usr/bin/env node
/**
 * 机制整合包 — 项目级一键初始化（质量节拍 5.6 机制集成）
 *
 * 用法（在目标项目根目录运行）：
 *   node <本脚本路径> [目标项目路径] [--yes]
 *
 * 功能（自动初始化）：
 *   0. openspec init --tools codex,claude,cursor,opencode --force（多 IDE 技能）
 *   1. 复制 OpenSpec 模板（config.yaml / spec-contract.md / 检查脚本）
 *   2. 复制项目模板（AGENTS.md.snippet 幂等追加 / quality-gates.template.md）
 *   3. codegraph init（建项目索引）
 *   4. 复制质量节拍项目门禁产物（.quality-rhythm 标记 / husky pre-commit / GitHub workflow）——不再依赖交互式 installer
 *   5. 提示 CCG 官方安装（交互式，不自动）
 *   6. 验证门禁（verify-env.js，任一 FAIL 阻塞完成）
 *
 * 前置：Node 20+、npm、Codex CLI；OpenSpec CLI 与 codegraph 已由 bootstrap-env.js 安装。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPT_DIR = __dirname;
const QR_SKILL_ROOT = path.resolve(SCRIPT_DIR, '..'); // 质量节拍 skill 根目录（含 installer/）
const TARGET = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('.');
const YES = process.argv.includes('--yes');
const AGENT_SNIPPET_MARKER = '机制硬化补充'; // AGENTS.md 幂等标记

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
║  （OpenSpec + codegraph + 模板 + 门禁产物）       ║
╚══════════════════════════════════════════════════╝
目标项目: ${TARGET}
`);

  // ── 0. openspec init（多 IDE 技能）──
  console.log('\n[0/6] openspec init --tools codex,claude,cursor,opencode --force ...');
  try {
    execSync('openspec --version', { stdio: 'pipe' });
    tryRun(`openspec init --tools codex,claude,cursor,opencode --force`, TARGET, 'openspec init（多 IDE 技能）');
  } catch (_) {
    console.warn('  openspec CLI 不可用。先执行用户级一键: node bootstrap-env.js --yes（会安装 openspec CLI）');
  }

  // ── 1. OpenSpec 模板 ──
  const osDir = path.join(SCRIPT_DIR, 'openspec');
  if (fs.existsSync(path.join(osDir, 'config.yaml.template'))) {
    console.log('\n[1/6] 复制 OpenSpec 模板...');
    copy(path.join(osDir, 'config.yaml.template'), path.join(TARGET, 'openspec', 'config.yaml'));
    copy(path.join(osDir, 'spec-contract.md'), path.join(TARGET, 'openspec', 'specs', 'openspec-integration', 'spec.md'));
    copy(path.join(osDir, 'openspec-sync-check.js'), path.join(TARGET, 'scripts', 'openspec-sync-check.js'));
  } else {
    console.warn('\n[1/6] 未找到 openspec/ 模板目录，跳过。');
  }

  // ── 2. 项目模板（AGENTS.md 幂等追加）──
  const pjDir = path.join(SCRIPT_DIR, 'project');
  if (fs.existsSync(path.join(pjDir, 'AGENTS.md.snippet'))) {
    console.log('\n[2/6] 复制项目模板...');
    const agDest = path.join(TARGET, 'AGENTS.md');
    const snippet = fs.readFileSync(path.join(pjDir, 'AGENTS.md.snippet'), 'utf8');
    const alreadyHas = fs.existsSync(agDest) && fs.readFileSync(agDest, 'utf8').includes(AGENT_SNIPPET_MARKER);
    if (alreadyHas) {
      console.log('✅ AGENTS.md 机制片段（已存在，幂等跳过）');
    } else if (fs.existsSync(agDest) && !YES) {
      const ok = await ask('AGENTS.md 已存在，追加机制片段？（Y/n）: ');
      if (ok) fs.appendFileSync(agDest, '\n\n' + snippet);
    } else {
      if (fs.existsSync(agDest)) fs.appendFileSync(agDest, '\n\n' + snippet);
      else fs.writeFileSync(agDest, snippet);
      console.log('✅ AGENTS.md 机制片段');
    }
    copy(path.join(pjDir, 'quality-gates.template.md'), path.join(TARGET, '.quality-gates.md'));
  } else {
    console.warn('\n[2/6] 未找到 project/ 模板目录，跳过。');
  }

  // ── 3. codegraph init ──
  console.log('\n[3/6] codegraph init（项目索引）...');
  try {
    execSync('codegraph --version', { stdio: 'pipe' });
    tryRun('codegraph init', TARGET, 'codegraph init（建 .codegraph 索引）');
  } catch (_) {
    console.warn('  codegraph CLI 不可用。先执行用户级一键: node bootstrap-env.js --yes');
  }

  // ── 4. 质量节拍项目门禁产物（直接复制，免交互 installer）──
  console.log('\n[4/6] 质量节拍项目门禁产物...');
  fs.writeFileSync(path.join(TARGET, '.quality-rhythm'), '此项目受质量节拍 skill 管辖。\n');
  console.log('✅ .quality-rhythm 标记');
  copy(path.join(QR_SKILL_ROOT, 'installer', 'husky', 'pre-commit.js'), path.join(TARGET, '.husky', 'pre-commit.js'));
  copy(path.join(QR_SKILL_ROOT, 'installer', 'husky', 'install.js'), path.join(TARGET, '.husky', 'install.js'));
  copy(path.join(QR_SKILL_ROOT, 'installer', 'github', 'quality-gate.yml'), path.join(TARGET, '.github', 'workflows', 'quality-gate.yml'));
  copy(path.join(QR_SKILL_ROOT, 'installer', 'github', 'branch-protection.json'), path.join(TARGET, '.github', 'branch-protection.json'));
  console.log('  （husky 钩子注册: 在项目执行 node .husky/install.js；CI 由 .github/workflows/quality-gate.yml 生效）');

  // ── 5. CCG 官方安装提示（交互式，不自动）──
  console.log('\n[5/6] CCG 机制...');
  console.log('  官方安装: npx ccg-workflow  （菜单选 "X. Codex Mode"；bootstrap-env.js 已尝试 --skip-prompt）');
  console.log('  overlay 增强已由 bootstrap-env.js 幂等追加');
  if (!YES) {
    const ok = await ask('现在执行 npx ccg-workflow？（Y/n）: ');
    if (ok) execSync('npx ccg-workflow', { cwd: TARGET, stdio: 'inherit' });
  }

  // ── 6. 验证门禁 ──
  console.log('\n[6/6] 验证门禁...');
  try {
    const out = execSync('openspec doctor 2>&1', { cwd: TARGET, encoding: 'utf8' });
    console.log(out.split('\n').slice(0, 4).join('\n'));
  } catch (e) {
    console.warn('  openspec doctor 不可用（先确认 CLI 已装并完成 init）');
  }
  try {
    execSync('node scripts/openspec-sync-check.js', { cwd: TARGET, stdio: 'inherit' });
  } catch (_) { /* 非零退出 = 有未归档警告，属正常输出 */ }

  // 强制验证门禁：verify-env.js（任一 FAIL → 非零退出）
  const verify = path.join(SCRIPT_DIR, 'verify-env.js');
  if (fs.existsSync(verify)) {
    console.log('\n[门禁] verify-env.js（FAIL 项会阻塞完成）...');
    try {
      execSync(`node "${verify}" "${TARGET}"`, { stdio: 'inherit' });
    } catch (_) {
      console.error('\n❌ 验证门禁未通过。请修复 FAIL 项后重跑 install-mechanism.js。');
      process.exitCode = 1;
      return;
    }
  }

  console.log('\n完成。重启 Codex 使 .agents/skills 技能生效。');
  console.log('完整核对: integrations/env-checklist.md（含生效验证第 7 节）。');
}

main().catch((e) => { console.error(e); process.exit(1); });