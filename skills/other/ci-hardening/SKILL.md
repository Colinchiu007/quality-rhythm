---
name: ci-hardening
description: "CI/CD 硬化与优化（自托管 runner 迁移、并行化、触发去重、workflow 契约测试同步）。Use when (1) 把 GitHub Actions job 从自托管/ECS runner 迁到 GitHub 官方 runner；(2) CI 单 job 串行过长需要并行拆分与触发去重；(3) 修改 .github/workflows 前需要全仓排查契约测试；(4) 为新的 Node/Electron 项目初始化质量门禁（并行 Quality Gate + 本地 .quality-gates.md + Electron CI）。"
---

# CI Hardening

把「CI 迁移判断、瓶颈实测、并行拆分、触发去重、契约同步」沉淀为可跨项目复用的方法与模板（源于 Multi-Publish 2026-08-09 实战：electron-tests 迁移 GitHub runner 7.5min、Quality Gate 25min→12min）。

## 何时使用（触发）
- 用户要求 CI 更快 / 排队 / 迁移 runner / 优化 Quality Gate。
- 修改或新建 `.github/workflows/*.yml`。
- 为新项目初始化质量门禁体系。

## 使用步骤
1. **读方法论**：`references/methodology.md`（M1 迁移判断法 / M2 优化法 / M3 契约同步法 / M4 三层门禁 / M5 交付节奏 + 通用清单）。
2. **初始化新项目门禁**（B+C 集成）：
   ```bash
   node scripts/apply-ci-hardening.js --repo <target> [--with-electron] [--dry-run]
   ```
   生成：并行 `quality-gate.yml`（触发去重）+ `.quality-gates.md`（本地清单）+ 可选 `electron-ci.yml`。可在目标仓库放 `ci-hardening.config.json` 覆盖占位符（见脚本 DEFAULTS）。
3. **优化既有 CI**：先 `node scripts/analyze-ci-steps.js <run-id>` 实测瓶颈（M2），再并行拆分。
4. **契约同步（必做）**：改 workflow 前全仓 grep 契约测试（`.github/scripts/*.test.js` 与 `*/tests/*.test.js`），改结构后本地跑通再推 CI。
5. **Electron 注意**：`@electron/rebuild` 必须在 vitest（Node ABI）之后、Electron 冒烟之前；保留 checksum pin 与镜像。

## 铁律
- 运行时代码/CI 变更禁止直改默认分支：隔离 worktree → 分支 + PR → PR 自身 CI 验证 → 合并 → 归档三同步 → 记忆。
- 本地通过 ≠ 交付通过：push 后必须确认 CI（Quality Gate）通过。
- 模板中的 `REPLACE_ME` 与占位命令必须替换为项目真实值，不得原样提交。

## 资源
- `assets/templates/`：quality-gate.yml.tpl / electron-ci.yml.tpl / quality-gates.md.tpl（参数化模板，B）
- `scripts/`：apply-ci-hardening.js（脚手架，C）/ analyze-ci-steps.js（瓶颈分析）
- `references/methodology.md`：方法论（A）
