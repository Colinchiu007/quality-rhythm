/**
 * 质量节拍 — 通用 pre-commit 钩子
 *
 * 检查：
 * 1. 改动的源文件必须有对应的测试文件
 * 2. 禁止直接提交到 main 分支
 * 3. .quality-gates.md「本次执行记录」最近一条必须全部勾选（文件存在时强制）
 *
 * 使用方式：node .husky/install.js
 * 跳过：git commit --no-verify（不推荐）
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════
//  配置区 — 可根据项目需求修改
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  // 禁止直接提交的分支列表
  protectedBranches: ["main", "master", "production"],

  // 源文件匹配模式（匹配到的文件必须有测试）
  srcPatterns: [
    /^src\/.*\.(vue|js|ts|tsx)$/,
    /^app\/.*\.(vue|js|ts|tsx)$/,
    /^packages\/.*\/src\/.*\.(js|ts|tsx|vue)$/,
    /^electron\/.*\.(js|ts)$/,
    /^server\/.*\.(js|ts|py)$/,
    /^.*\.(py)$/,
  ],

  // 测试文件命名规则
  testMarkers: {
    ".js": ".test.js",
    ".ts": ".test.ts",
    ".tsx": ".test.tsx",
    ".vue": ".test.js",
    ".py": "_test.py",
    ".jsx": ".test.jsx",
  },

  // 测试文件查找目录
  testDirs: ["tests", "__tests__", "test", "spec"],

  // 质量门禁文件（缺失时仅 WARN，不阻塞——兼容未初始化项目）
  gatesFile: ".quality-gates.md",
  // 执行记录节标题（模板结构：## 本次执行记录）
  recordMarker: "## 本次执行记录",
  // 记录段落标题匹配（形如：## 2026-08-09 修复bug 提交前自检）
  recordTitleRe: /^## \d{4}[-/.]\d{1,2}[-/.]\d{1,2}.*提交前自检.*$/gm,
  // 未勾选项匹配（- [ ] 前缀）
  uncheckedRe: /^- \[ \].*$/gm,
};

// ═══════════════════════════════════════════════════════════════════
//  逻辑（通常不需要改）
// ═══════════════════════════════════════════════════════════════════

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: "pipe", ...opts }).trim();
  } catch {
    return "";
  }
}

function findTestFile(srcFile) {
  const ext = path.extname(srcFile);
  const marker = CONFIG.testMarkers[ext];
  if (!marker) return null;

  const dir = path.dirname(srcFile);
  const base = path.basename(srcFile, ext);

  // 同目录下找 test/ 子目录
  for (const td of CONFIG.testDirs) {
    const candidate = path.join(dir, td, `${base}${marker}`);
    if (fs.existsSync(candidate)) return candidate;
  }

  // 项目根 tests/ 下找
  for (const td of CONFIG.testDirs) {
    const candidate = path.join(td, `${base}${marker}`);
    if (fs.existsSync(candidate)) return candidate;
  }

  // 平级测试文件
  const flat = path.join(dir, `${base}${marker}`);
  if (fs.existsSync(flat)) return flat;

  return null;
}

// ── 主逻辑 ──
let hasError = false;
const errors = [];

// 1. 检查分支
const branch = run("git rev-parse --abbrev-ref HEAD");
if (CONFIG.protectedBranches.includes(branch)) {
  errors.push(`❌ 禁止直接提交到 ${branch} 分支。请先切换到 feature 分支。`);
  hasError = true;
}

// 2. 检查改动的源文件是否有测试
const staged = run("git diff --cached --name-only --diff-filter=ACMR")
  .split("\n")
  .filter(Boolean);

for (const file of staged) {
  const isSrc = CONFIG.srcPatterns.some((p) => p.test(file));
  if (!isSrc) continue;

  // 跳过测试文件本身
  const ext = path.extname(file);
  const marker = CONFIG.testMarkers[ext];
  if (marker && file.includes(marker)) continue;

  const testFile = findTestFile(file);
  if (!testFile) {
    errors.push(`❌ ${file}\n    没有对应的测试文件。请先创建测试再提交。`);
    hasError = true;
  }
}

// 3. 质量门禁强制卡点：.quality-gates.md「本次执行记录」最近一条必须全部勾选
const gatesAbs = path.join(process.cwd(), CONFIG.gatesFile);
if (fs.existsSync(gatesAbs)) {
  const gatesText = fs.readFileSync(gatesAbs, "utf8");
  const recIdx = gatesText.indexOf(CONFIG.recordMarker);
  if (recIdx >= 0) {
    const recSection = gatesText.slice(recIdx + CONFIG.recordMarker.length);
    const titles = recSection.match(CONFIG.recordTitleRe) || [];
    if (!titles.length) {
      errors.push(`❌ .quality-gates.md 缺少「提交前自检」执行记录。\n    请按模板追加（记录在「## 本次执行记录」节内）：\n    ## ${new Date().toISOString().slice(0, 10)} <本次任务> 提交前自检\n    - [x] ...逐项勾选并附验证证据（file:line / 命令输出）...`);
      hasError = true;
    } else {
      const lastTitle = titles[titles.length - 1];
      const lastIdx = recSection.lastIndexOf(lastTitle);
      const lastRecord = recSection.slice(lastIdx);
      const unchecked = lastRecord.match(CONFIG.uncheckedRe) || [];
      if (unchecked.length) {
        errors.push(`❌ .quality-gates.md 最近一条「提交前自检」还有 ${unchecked.length} 项未勾选：`);
        unchecked.slice(0, 6).forEach((u) => errors.push(`    ${u.replace(/^- \[ \]/, "  [ ]")}`));
        if (unchecked.length > 6) errors.push(`    ...另有 ${unchecked.length - 6} 项`);
        errors.push("    请逐项确认勾选后再提交（--no-verify 可跳过，不推荐）。");
        hasError = true;
      }
    }
  } else {
    console.warn("⚠️ .quality-gates.md 缺少「## 本次执行记录」节，跳过勾选检查（请用 ci-hardening 模板重建）");
  }
} else {
  console.warn("⚠️ 未找到 .quality-gates.md，跳过质量门禁勾选检查（建议先运行 install-mechanism.js 初始化）");
}

// 4. 输出
if (hasError) {
  console.error("\n🔴 质量节拍 pre-commit 检查未通过：\n");
  errors.forEach((e) => console.error(e));
  console.error(`\n提示：补充测试文件 / 勾选 .quality-gates.md 执行记录，或用 git commit --no-verify 跳过（不推荐）`);
  process.exit(1);
} else {
  console.log("✅ 质量节拍 pre-commit 检查通过");
}
