# CI 硬化方法论（跨项目可迁移）

源于 Multi-Publish 实战（2026-08-09：electron-tests 迁移 GitHub runner、Quality Gate 并行化 + 触发去重）。

## M1 自托管 runner → GitHub 官方 runner 迁移判断法
1. **找先例**：目标 repo 是否已有在 GitHub 官方 runner 上跑同类任务的先例（如 gui-test 用 xvfb 跑 Electron GUI）→ 有则风险大降。
2. **三项适配点核对**：
   - 系统依赖：RHEL `dnf` → Ubuntu `apt`（包名可能不同：xvfb/build-essential/python3）
   - 原生模块 ABI：Electron 项目需 `npx @electron/rebuild -f -w <module>`（Node 运行 vitest 时**不得**在其之前 rebuild——会破坏 Node ABI；rebuild 应放在 vitest 之后、Electron 冒烟之前）
   - 网络：镜像（npmmirror）公网可达性；无内网/secrets 依赖才可迁移
3. **验证**：迁移 PR 自身 CI 即验收（观察 runner_name 为 `GitHub Actions *`、时长、通过率）。
4. 保留：checksum pin、`SKIP_*` 测试开关、失败诊断（进程树）。

## M2 CI 优化法（并行拆分 + 触发去重）
1. **实测定位瓶颈**：取一次通过 run 的 step 耗时（GitHub API `jobs/<id>` 的 steps.started_at/completed_at）→ 找出占 80% 的步骤。
2. **并行拆分**：把串行 gate 拆成独立 job（静态/单测/覆盖率/视觉/E2E/自主审计），关键路径 = max(各 job)；注意：
   - 每 job 独立 VM → 各自 `npm ci`（分钟略升，墙钟大降）
   - 覆盖率/单测这类重资源步骤拆到独立 job，避免同 job 争资源
   - 保留 gate 语义与顺序契约（如 watchdog、退出码捕获）
3. **触发去重**：`on:` 只保留 `pull_request`（+ `workflow_dispatch`），移除 `push: branches-ignore` 与 PR 的同 head 双跑 → CI 分钟减半。
4. **验证**：PR 自身 CI 观察各 job 时长与并行效果。

## M3 Workflow 契约测试同步法（改 workflow 前必查）
- **全仓 grep 契约测试**：不仅 `.github/scripts/*.test.js`，还有 `apps/*/tests/*.test.js`（Multi-Publish 的 gui-ci-exit-contract.test.js 就锁定了 workflow 结构）。
- 契约测试常见锁定点：步骤名、邻接注释/邻接步骤、`runs-on`、timeout、退出码模式、跨文件字符串。
- 并行化后：邻接锚点从 `# --- Gate N` 注释改为同 job 的后续步骤（如 Upload）；单 job 引用改跨 job 汇总（`Object.values(jobs).flatMap(j => j.steps||[])`）。
- 改完先本地跑契约测试（`node --test .github/scripts/*.test.js` + vitest 对应文件），再推 CI。

## M4 三层门禁体系
- 本地提交门禁：`.quality-gates.md` 提交前自检清单（QM-1~4）+ husky pre-commit。
- 流程 skill：质量节拍（Phase 0-5 + 日常循环 ⑦ CI 验证）。
- 远程 CI：GitHub Actions（PR 触发）。
- 三层各司其职：skill 把关过程，CI 把关结果，本地清单把关提交。

## M5 交付节奏（质量节拍式）
1. 隔离 worktree（`git worktree add -b codex/<slug> <path> origin/main`），不动并发会话主工作区。
2. 分支 + PR（运行时代码/CI 变更禁止直改 main）+ openspec change（M+ 复杂度）。
3. 双模型分析/审查（antigravity 缺失时降级 Claude + 主代理 grep 核验，记录降级）。
4. 全量测试 + 契约测试 + eslint/vite build。
5. 合并（Quality Gate 通过；自托管排队不阻塞——迁移后已消除）。
6. 归档三同步（openspec archive + CCG task 归档 + learnings）→ 记忆备注。

## 通用清单（新项目应用）
- [ ] 本地：`.quality-gates.md` + husky pre-commit + 流程 skill 引用
- [ ] CI：并行 quality-gate.yml（去重触发）+ 契约测试
- [ ] Electron 项目（可选）：electron-ci.yml + checksum pin + rebuild 顺序
- [ ] 契约测试：`node --test .github/scripts/*.test.js` + 对应 vitest 全绿
- [ ] 文档：PRD/CHANGELOG/learnings 同步
