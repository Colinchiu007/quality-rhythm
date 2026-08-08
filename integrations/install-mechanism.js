#!/usr/bin/env node
/**
 * 机制整合包 — 一键复制脚本（质量节拍 5.6 机制集成）
 *
 * 用法（在目标项目根目录运行）：
 *   node <本脚本路径> [目标项目路径] [--yes]
 *
 * 功能：
 *   1. 复制 OpenSpec 模板（config.yaml / spec-contract.md / 检查脚本）
 *   2. 复制项目模板（AGENTS.md.snippet / quality-gates.template.md）
 *   3. 提示 CCG 官方安装（npx ccg-workflow Codex Mode）+ overlay 追加
 *   4. 验证（openspec doctor / 检查脚本）
 *
 * 前置：Node 20+、npm、Codex CLI。
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

async function main() {
  console.log(`
╔══════════════════════════════════════════════╗
║  机制整合包 — 一键复制（CCG + 质量节拍 + OpenSpec）║
╚══════════════════════════════════════════════╝
目标项目: ${TARGET}
`);

  // ── 1. OpenSpec 模板 ──
  const osDir = path.join(SCRIPT_DIR, 'openspec');
  if (fs.existsSync(path.join(osDir, 'config.yaml.template'))) {
    console.log('\n[1/4] 复制 OpenSpec 模板...');
    copy(path.join(osDir, 'config.yaml.template'), path.join(TARGET, 'openspec', 'config.yaml'));
    copy(path.join(osDir, 'spec-contract.md'), path.join(TARGET, 'openspec', 'specs', 'openspec-integration', 'spec.md'));
    copy(path.join(osDir, 'openspec-sync-check.js'), path.join(TARGET, 'scripts', 'openspec-sync-check.js'));
  } else {
    console.warn('\n[1/4] 未找到 openspec/ 模板目录，跳过。');
  }

  // ── 2. 项目模板 ──
  const pjDir = path.join(SCRIPT_DIR, 'project');
  if (fs.existsSync(path.join(pjDir, 'AGENTS.md.snippet'))) {
    console.log('\n[2/4] 复制项目模板...');
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
    console.warn('\n[2/4] 未找到 project/ 模板目录，跳过。');
  }

  // ── 3. CCG 官方安装提示 ──
  console.log('\n[3/4] CCG 机制...');
  console.log('  官方安装: npx ccg-workflow  （菜单选 "X. Codex Mode"）');
  console.log('  生成后追加增强: ccg/codex-overlay.md 区块到 ~/.codex/AGENTS.md');
  if (!YES) {
    const ok = await ask('现在执行 npx ccg-workflow？（Y/n）: ');
    if (ok) execSync('npx ccg-workflow', { cwd: TARGET, stdio: 'inherit' });
  }

  // ── 4. 验证 ──
  console.log('\n[4/4] 验证...');
  try {
    const out = execSync('openspec doctor 2>&1', { cwd: TARGET, encoding: 'utf8' });
    console.log(out.split('\n').slice(0, 4).join('\n'));
  } catch (e) {
    console.warn('  openspec doctor 不可用（先执行: npm i -g @fission-ai/openspec && openspec init）');
  }
  try {
    execSync('node scripts/openspec-sync-check.js', { cwd: TARGET, stdio: 'inherit' });
  } catch (_) { /* 非零退出 = 有未归档警告，属正常输出 */ }

  console.log('\n完成。重启 Codex 使 .agents/skills 技能生效。');
}

main().catch((e) => { console.error(e); process.exit(1); });