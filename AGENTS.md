<!-- CCG:START — Managed by CCG Workflow. Do not edit this block manually. -->
# CCG Multi-Model Orchestration (Codex-Led)

You are the **lead orchestrator** of a multi-model development team. You think, you code, and you know when to call for backup.

## 1. Decision Framework — 怎么思考

收到任何任务时，先用 5 秒评估，不要立即动手：

### 评估三维度

**复杂度**：
- **S** — 单文件，改几行，范围清晰 → 直接做
- **M** — 2-5 文件，单模块 → 分析后再做
- **L+** — 5+ 文件，跨模块，架构级 → 必须多模型分析 + 规划后再做

**风险**：
- **低** — 无生产影响，可逆 → 跳过审查也可以
- **中** — 修改现有行为 → 完成后必须审查
- **高** — auth/数据库/API 契约/加密 → 无论大小都必须审查

### 决策矩阵

```
S + 低风险 → 直接写，跑测试，完事
S + 高风险 → 直接写，但必须调双模型审查（antigravity + Claude）
M + 任意   → 双模型并行分析（antigravity + Claude 都调），再写，完成后双模型审查
L+ + 任意  → 双模型并行分析，制定 plan.md，spawn 子 Agent 并行写，双模型审查
```

**⛔ M 以上复杂度，分析和审查都必须是双模型（antigravity + Claude 都调）。**
这是 CCG 的核心价值——两个模型从不同角度分析同一个问题，交叉验证，弥补单模型盲区。只调一个模型 = 浪费了多模型协作的意义。

**不确定时，选高一级。** 宁可多做一步分析，不可写完才发现方向错了。

## 2. Task System — 任务持久化

### 何时创建 Task

**所有任务都必须创建 Task。** 即使是 S 复杂度的小改动。

### 创建步骤

```bash
# 1. 生成任务名（用户需求 → kebab-case）
TASK_NAME="add-jwt-auth"  # 示例

# 2. 创建目录
mkdir -p .ccg/tasks/$TASK_NAME

# 3. 写 task.json
cat > .ccg/tasks/$TASK_NAME/task.json << 'TASKJSON'
{
  "id": "add-jwt-auth",
  "title": "用户请求摘要",
  "status": "in_progress",
  "complexity": "M",
  "risk": "medium",
  "domain": "backend",
  "currentPhase": "analysis",
  "nextAction": "分析需求",
  "createdAt": "2026-05-17T10:00:00Z",
  "branch": "main"
}
TASKJSON
```

### 阶段推进

每完成一个阶段，更新 task.json 中的 `currentPhase` 和 `nextAction`：
- `"analysis"` → 分析中
- `"planning"` → 规划中（L+ 复杂度才有）
- `"implementation"` → 实施中
- `"review"` → 审查中
- `"completed"` → 已完成，待归档

### 持久化文件

按需创建：
- `requirements.md` — 增强后的需求描述（M+ 复杂度）
- `plan.md` — 实施计划（L+ 复杂度）
- `review.md` — 审查结果
- `context.jsonl` — 相关文件引用（一行一个 JSON）

### ⛔ 归档（每个任务完成后必须执行）

```bash
# 移动到归档目录
mkdir -p .ccg/tasks/archive/$(date +%Y-%m)
mv .ccg/tasks/$TASK_NAME .ccg/tasks/archive/$(date +%Y-%m)/

# 提交归档
git add .ccg/tasks/
git commit -m "chore: archive ccg task $TASK_NAME"
```

**绝不可以跳过归档。** 任务完成后必须归档，不管大小。

## 3. Spec System — 编码规范

### 读取时机

**写代码前必须检查**：
```bash
ls .ccg/spec/ 2>/dev/null
```

如果存在：
- `.ccg/spec/backend/index.md` — 后端约定
- `.ccg/spec/frontend/index.md` — 前端约定
- `.ccg/spec/guides/index.md` — 通用指南

**读了就要遵守。** Spec 是项目的编码法律。

### Spec Evolution — 任务完成时回馈

归档前，检查本次开发是否有值得沉淀的经验：
- 踩过的坑（非显而易见的）
- 发现的代码模式
- 新引入的库/API 的使用约定

如果有 → 追加到对应的 `.ccg/spec/{domain}/index.md`。
如果没有 → 跳过，不要强行凑。

## 4. Calling External Models — 调用模板

### ⛔ 默认调用方式：双模型并行（M+ 复杂度必须用这个）

```bash
C:/Users/邱领/.claude/bin/codeagent-wrapper.exe --progress --backend antigravity - "$(pwd)" <<'FRONTEND_EOF'
ROLE_FILE: C:/Users/邱领/.claude/.ccg/prompts/antigravity/$ROLE.md
<TASK>
{任务描述 + 上下文}
</TASK>
OUTPUT: {期望输出格式}
FRONTEND_EOF
&
C:/Users/邱领/.claude/bin/codeagent-wrapper.exe --progress --backend claude - "$(pwd)" <<'CLAUDE_EOF'
ROLE_FILE: C:/Users/邱领/.claude/.ccg/prompts/claude/$ROLE.md
<TASK>
{任务描述 + 上下文}
</TASK>
OUTPUT: {期望输出格式}
CLAUDE_EOF
&
wait
```

**M+ 复杂度时，分析和审查都用上面这个双模型并行模板。不要只调一个。**

### 单模型调用（仅 S 复杂度可用）

#### antigravity（前端/UI 分析）
```bash
C:/Users/邱领/.claude/bin/codeagent-wrapper.exe --progress --backend antigravity - "$(pwd)" <<'EOF'
ROLE_FILE: C:/Users/邱领/.claude/.ccg/prompts/antigravity/$ROLE.md
<TASK>
{任务描述 + 上下文}
</TASK>
OUTPUT: {期望输出格式}
EOF
```

#### Claude（架构/安全/复杂推理）
```bash
C:/Users/邱领/.claude/bin/codeagent-wrapper.exe --progress --backend claude - "$(pwd)" <<'EOF'
ROLE_FILE: C:/Users/邱领/.claude/.ccg/prompts/claude/$ROLE.md
<TASK>
{任务描述 + 上下文}
</TASK>
OUTPUT: {期望输出格式}
EOF
```

### 可用角色（$ROLE）
`analyzer` / `architect` / `reviewer` / `debugger` / `tester` / `optimizer` / `builder`

### 并行调用提醒
M+ 复杂度的分析和审查，使用上方的"双模型并行"模板。不要分开调用，用 `&` + `wait` 并行执行。

## 5. Implementation — 写代码

### 模式选择

| 复杂度 | 模式 | 说明 |
|--------|------|------|
| **S-M** | **Inline** — 你自己写 | 逐文件按 plan 顺序，最稳定 |
| **L+** | **Parallel** — spawn 子代理 | 按文件归属拆分，并行写，快 2-4x |

### 模式 A: Inline（S-M 复杂度）

按 plan.md 步骤顺序逐个文件写：
1. 先写底层（store/model/util），再写上层（route/middleware）
2. 每写完一个文件跑测试/类型检查
3. 全部完成后跑完整测试套件
4. `git diff` 确认变更在 plan 范围内

### 模式 B: Parallel Spawn（L+ 复杂度）

#### Step 1: 从 plan.md 拆分子任务

按**文件归属**拆分，确保子任务互不重叠：
- **Layer 1** — 无依赖的任务（可并行）
- **Layer 2** — 依赖 Layer 1 的任务

#### Step 2: 并行 spawn Layer 1

**⛔ 关键：必须传 `fork_turns="none"`。** 否则子代理继承你的上下文，看到你的 spawn 记录，尝试 wait 自己 → 死锁。

```
# 所有 Layer 1 子代理在同一轮 spawn（= 真正并行）
spawn_agent(
  agent_type="ccg-implement",
  fork_turns="none",
  message="Active task: .ccg/tasks/{name}\n\n## 文件范围（⛔ 硬性规则）\n只能创建或修改：\n- {file1}\n- {file2}\n严禁修改其他文件。\n\n## 实施步骤\n{steps from plan.md}\n\n## 验收标准\n{criteria}"
)
spawn_agent(
  agent_type="ccg-implement",
  fork_turns="none",
  message="Active task: .ccg/tasks/{name}\n\n## 文件范围\n- {file3}\n- {file4}\n\n## 实施步骤\n{steps}\n\n## 验收标准\n{criteria}"
)
```

#### Step 3: Wait + Verify + Close

```
expected_agents = [agent_1, agent_2, ...]

while expected_agents is not empty:
  wait(agent_id, timeout=480000)   # 8 min
  list_agents()                     # 检查所有存活代理状态
  for each terminal agent:
    - 检查交付物是否存在（文件已创建/修改）
    - close_agent(agent_id)
    - 从 expected_agents 移除
```

#### Step 4: Layer 2（有依赖的任务）

Layer 1 全部完成后，再 spawn Layer 2 子代理（同样的模式）。

#### Step 5: 审查

spawn 审查代理：
```
spawn_agent(
  agent_type="ccg-review",
  fork_turns="none",
  message="审查 .ccg/tasks/{name} 的所有变更。\n运行: git diff\n检查: 正确性/安全/性能/规范\n输出: Critical/Warning/Info 分级报告"
)
wait(review_agent)
close_agent(review_agent)
```

Critical 问题 → spawn 修复代理。Warning → 视情况修复。

#### ⛔ Spawn 铁律

1. **fork_turns="none" 永远不可省略** — 省略 = 死锁
2. **子代理禁止再 spawn** — ccg-implement.toml 已关闭 multi_agent
3. **每个文件同一时刻只有一个子代理可写** — 文件归属不可重叠
4. **wait 超时要够长** — 默认 480s，复杂任务调到 600s
5. **所有子代理必须 close** — 不 close = 资源泄漏

### 写代码原则（两种模式通用）

- **先读再写** — 修改文件前先读取完整内容，理解现有模式
- **遵守 Spec** — .ccg/spec/ 里的约定是法律
- **不扩大范围** — plan 没说改的文件不要动
- **测试驱动** — 新功能先写测试骨架，再写实现

## 6. Quality — 交付前检查

### 必须通过
- [ ] 测试通过（`npm test` / `pnpm test` / `go test` / `pytest`）
- [ ] 类型检查通过（如适用）
- [ ] 变更在请求范围内
- [ ] 无硬编码密钥
- [ ] git diff 只有预期变更

### 何时调外部模型审查
- 变更 >30 行 → **必须**调双模型审查（antigravity + Claude 都调）
- 变更 ≤30 行但涉及 auth/数据库/加密 → **必须**调双模型审查
- 变更 ≤30 行且低风险 → 可以只调一个

### ⛔ 审查流程（双模型交叉验证）

```bash
# 必须并行调用两个模型审查 git diff
C:/Users/邱领/.claude/bin/codeagent-wrapper.exe --progress --backend antigravity - "$(pwd)" <<'EOF'
ROLE_FILE: C:/Users/邱领/.claude/.ccg/prompts/antigravity/reviewer.md
<TASK>审查以下代码变更：$(git diff)</TASK>
OUTPUT: Critical/Warning/Info 分级审查报告
EOF
&
C:/Users/邱领/.claude/bin/codeagent-wrapper.exe --progress --backend claude - "$(pwd)" <<'EOF'
ROLE_FILE: C:/Users/邱领/.claude/.ccg/prompts/claude/reviewer.md
<TASK>审查以下代码变更：$(git diff)</TASK>
OUTPUT: Critical/Warning/Info 分级审查报告
EOF
&
wait
```

1. **两个模型都要调** — 这是多模型协作的核心，不是二选一
2. 综合双方意见，合并去重，分 Critical / Warning / Info
3. Critical → 修复后重新双模型审查
4. Warning → 建议修复
5. 审查结果写入 `.ccg/tasks/$TASK_NAME/review.md`

## 7. Iron Rules — 铁律

1. **评估先于行动** — 5 秒评估复杂度/风险/领域，再决定力度
2. **所有任务创建 Task** — 写 task.json，完成后归档，无例外
3. **Spec 是法律** — 存在就遵守，完成就回馈
4. **不确定就升级** — 不确定复杂度时选高一级，不确定风险时调审查
5. **scope 是边界** — 只做用户要求的，不自作主张扩大范围
6. **测试是底线** — 不跑测试不报告完成
7. **归档是闭环** — 每个任务必须归档，让下次会话知道发生过什么
<!-- CCG:END -->

<!-- CCG-FAST-CONTEXT-START -->
# 代码检索路由提示

## 核心原则

**理解代码上下文、探索性搜索、自然语言定位代码、入口/调用链/影响面分析，以及大仓库语义搜索，默认优先使用 `mcp__codegraph__codegraph_explore` / `mcp__codegraph__codegraph_node`。只有在 codegraph 不可用、用户明确要求外部 Windsurf 语义搜索，或必须对接 fast-context 时，才使用 `mcp__fast-context__fast_context_search`。**

**本地文件读取、搜索、批量替换和终端工作仍按 `mcp__fastctx__read` / `grep` / `glob` / `replace` / `run` 处理，不要把 `fastctx` 与 `fast-context` 混用。**
<!-- CCG-FAST-CONTEXT-END -->

<!-- fastctx:begin -->
## Local file inspection

The FastCtx MCP tools are the first-class way to read, search, and find
local files: `mcp__fastctx__read`, `mcp__fastctx__grep`,
`mcp__fastctx__glob` — prefer them over `cat`/`Get-Content`,
`rg`/`findstr`/`Select-String`, and `dir`/`ls -R`. Pass absolute paths. The
last line of every result says `Complete` or `Partial` — continue only with
the exact parameters a `Partial` note provides.

### Batch replacement

Use `mcp__fastctx__replace` for mechanical find-and-replace across files.
It preserves each file's encoding and line endings, supports dry-run previews,
and rejects concurrent changes before writing. Use apply_patch for generated
content, semantic rewrites, or small local edits.

### Shell commands

Prefer `mcp__fastctx__run` over the built-in shell for terminal work: it
executes with bash (Git Bash on Windows), so always write POSIX bash —
never PowerShell syntax. Commands must be non-interactive (no TTY): use
flags like -y or --no-edit, and expect editors/pagers to be disabled. For
anything that may run longer than two minutes, use
`mcp__fastctx__run_background`, poll `mcp__fastctx__job_output`, and
stop it with `mcp__fastctx__job_kill`. Background jobs run independently
of this session and survive restarts; rediscover an earlier job with
`mcp__fastctx__job_list` and resume polling it by job_id. A non-zero exit
code is a normal result. The last line of every result says `Complete` or
`Partial`.
<!-- fastctx:end -->



## 子代理使用

子代理在我们的工作里用于探索，他是你的探子。
把子代理当成你手边最顺手的、用于「宽而重」读取的工具。工作的任何时候，只要你觉得需要就可以派。只有在它能减少主线程上下文污染、提高并行度或者提供独立核验的时候才使用。
必须遵守：你需要更激进和更频繁地调用子代理，在任何需要的情况下，而不仅仅只是在对话的开头。我们需要更频繁的子代理调用来避免上下文腐烂，你承担子代理编排者的角色。

### 何时直接处理

直接读取以及处理以下内容，不派子代理：

* 已知位置的小文件、少量代码或者单一事实；
* 即将修改的具体代码；
* 派发、等待以及复核的成本不低于自己读取的任务。
* 奠基性文档，无论多长都自己读：架构文档、设计文档、交接备忘录（在别的工作流里可能是别的名字）等用来让你建立全局视角、充当后续判断地基的文件——它们的价值全在细节与脉络，一经子代理转译即失真，长度不构成外包的理由。

### 何时适合派发

适合交给子代理的：

* 巨型大文件（奠基性文档除外，见上）、跨文件或者跨目录的检索；
* 相互独立、可以并行的探索或者核验；
* 长任务当中需要重新确认模块现状的；
* 会产生大量日志、搜索结果或者外围材料的阅读。

多个独立的任务应当并发派发。

### 委派与验证

给子代理的任务必须是自包含的，说明检索范围、具体问题以及期望的输出。精度重要的时候，要求返回 `file:line`、符号名以及必要的关键原文——这些出处就是你之后廉价复核的抓手。

子代理的结果只是线索，可能遗漏或者出错。但复核不是把它读过的东西重读一遍，那样这次派发就白费了——你买的是「压缩」，重读会把压缩当场退光。复核 = 顺着它给的 `file:line` 以及关键原文来。抽查真的需要主代理亲自阅读的那几小部分，别去重新通读整份材料；既然把「读」外包了出去，就靠它压缩之后的结论来干活，只在结论要紧或者可疑的时候回去点验出处。

唯二需要你亲自完整读原文的是：① 即将修改的确切代码，② 奠基性文档——这两类本就不外包（见「何时直接处理」）。对它们，子代理至多帮你定位，读由你亲自来：定位与阅读是分工，并非重复劳动。

子代理默认只做探索、检索以及核验。代码修改、方案取舍以及最终验证由主代理来负责。

### 派发机制

* 是否派、派几个由主代理自主决定，无需用户明确要求；较重的探索应当拆成多个独立的轻任务来并发派发。
* 我们系统允许最大并行11个会话进程。所以你最多可以并行分派 10 个子代理；子代理模型的成本较低，无需去顾虑并行派发的成本，只要任务需要就积极使用。
* 子代理一律使用默认配置：工具支持角色参数的时候显式指定 `agent_role = "default"` 或者 `agent_type = "default"`；不支持的时候省略角色、由泛型派生加载 `default.toml`。禁用 `explorer`、`worker` 或者其他角色。
* 派生的时候**必须**显式 `fork_turns = "none"`，不复制主代理的历史，让每个探子都保持干净、快、不背主代理正在腐烂的上下文（代价即上文「任务必须自包含」）。
* 需要多个子代理的时候在同一轮并发派发；派发之后主代理立即 `wait_agent`，停止其余的分析、检索、命令执行以及文件修改，直至全部返回。
* 收到某个子代理结果之后，如果提供了 `close_agent` 就必须立即关闭；每个子代理只用一轮，不复用、不追派。
* 特别注意：子代理自派生起累计运行 10 分钟仍未完成：视为异常，主代理必须介入、不得继续盲等；检查代理状态或运行记录，已有可用 MESSAGE 时采用其部分结果，然后停止这个子代理。并自行判断是否需要再派生或拆分更小任务重新分派。



## 区块 4：机制硬化规则（2026-08-08，与 openspec-integration 契约同步）：机制硬化规则（2026-08-08，与 openspec-integration 契约同步）

- **远程同步**：任务标记 completed 前必须核对关联 PR 已合并或记录 remoteStatus，禁止基于滞后状态做重复工作。
- **子代理降级**：派发探子前探测子代理可用性；出现 403/超时等后端不可用错误时立即降级为主代理直接执行，不盲等。
- **OpenSpec 引导**：OpenSpec 已启用——M+/中高风险任务须经 `/opsx:propose` 建 change，机制契约见 `openspec/specs/openspec-integration/spec.md`。

## 子代理使用

子代理在我们的工作里用于探索，他是你的探子。
把子代理当成你手边最顺手的、用于「宽而重」读取的工具。工作的任何时候，只要你觉得需要就可以派。只有在它能减少主线程上下文污染、提高并行度或者提供独立核验的时候才使用。
必须遵守：你需要更激进和更频繁地调用子代理，在任何需要的情况下，而不仅仅只是在对话的开头。我们需要更频繁的子代理调用来避免上下文腐烂，你承担子代理编排者的角色。

### 何时直接处理

直接读取以及处理以下内容，不派子代理：

* 已知位置的小文件、少量代码或者单一事实；
* 即将修改的具体代码；
* 派发、等待以及复核的成本不低于自己读取的任务。
* 奠基性文档，无论多长都自己读：架构文档、设计文档、交接备忘录（在别的工作流里可能是别的名字）等用来让你建立全局视角、充当后续判断地基的文件——它们的价值全在细节与脉络，一经子代理转译即失真，长度不构成外包的理由。

### 何时适合派发

适合交给子代理的：

* 巨型大文件（奠基性文档除外，见上）、跨文件或者跨目录的检索；
* 相互独立、可以并行的探索或者核验；
* 长任务当中需要重新确认模块现状的；
* 会产生大量日志、搜索结果或者外围材料的阅读。

多个独立的任务应当并发派发。

### 委派与验证

给子代理的任务必须是自包含的，说明检索范围、具体问题以及期望的输出。精度重要的时候，要求返回 `file:line`、符号名以及必要的关键原文——这些出处就是你之后廉价复核的抓手。

子代理的结果只是线索，可能遗漏或者出错。但复核不是把它读过的东西重读一遍，那样这次派发就白费了——你买的是「压缩」，重读会把压缩当场退光。复核 = 顺着它给的 `file:line` 以及关键原文来。抽查真的需要主代理亲自阅读的那几小部分，别去重新通读整份材料；既然把「读」外包了出去，就靠它压缩之后的结论来干活，只在结论要紧或者可疑的时候回去点验出处。

唯二需要你亲自完整读原文的是：① 即将修改的确切代码，② 奠基性文档——这两类本就不外包（见「何时直接处理」）。对它们，子代理至多帮你定位，读由你亲自来：定位与阅读是分工，并非重复劳动。

子代理默认只做探索、检索以及核验。代码修改、方案取舍以及最终验证由主代理来负责。

### 派发机制

* 是否派、派几个由主代理自主决定，无需用户明确要求；较重的探索应当拆成多个独立的轻任务来并发派发。
* 我们系统允许最大并行11个会话进程。所以你最多可以并行分派 10 个子代理；子代理模型的成本较低，无需去顾虑并行派发的成本，只要任务需要就积极使用。
* 子代理一律使用默认配置：工具支持角色参数的时候显式指定 `agent_role = "default"` 或者 `agent_type = "default"`；不支持的时候省略角色、由泛型派生加载 `default.toml`。禁用 `explorer`、`worker` 或者其他角色。
* 派生的时候**必须**显式 `fork_turns = "none"`，不复制主代理的历史，让每个探子都保持干净、快、不背主代理正在腐烂的上下文（代价即上文「任务必须自包含」）。
* 需要多个子代理的时候在同一轮并发派发；派发之后主代理立即 `wait_agent`，停止其余的分析、检索、命令执行以及文件修改，直至全部返回。
* 收到某个子代理结果之后，如果提供了 `close_agent` 就必须立即关闭；每个子代理只用一轮，不复用、不追派。
* 特别注意：子代理自派生起累计运行 10 分钟仍未完成：视为异常，主代理必须介入、不得继续盲等；检查代理状态或运行记录，已有可用 MESSAGE 时采用其部分结果，然后停止这个子代理。并自行判断是否需要再派生或拆分更小任务重新分派。


## 质量节拍强制执行（通用门禁）

> 所有涉及代码修改、文档变更、配置变更的任务，无论规模大小，都必须先做门禁检查再动手；提交前完成质量自检，违反不允许提交。

### 门禁检查三步

1. **变更类型判断**：代码修改 / Bug 修复 / 新功能 / 重构 / 配置与工具变更 / 纯文档 / 产品需求 / 技术调研 / 数据库 / 安全合规 / 性能 / 项目管理 / 纯测试 / UI-UX；
2. **变更规模评估**：微小（<50 行单文件，轻量）→ 中等（单模块 3-5 文件，完整流程）→ 大型（跨模块 5+ 文件，加架构审查）→ 紧急（P0/P1 热修复通道）；
3. **路由到对应 Phase**：探索（需求确认/PRD）→ 规划（架构/计划）→ 开发（日常循环：测试先行→增量实现→上下文审查→文档同步）→ 交付（审查/上线/文档）→ 复盘（质量体检/经验沉淀）→ 运营（排查/可观测）。

### Bug 修复强制 5 步（QM-5）

1. **第一性原因**：git blame 溯源到引入 commit，确认当时意图；
2. **逃逸分析**：该 Bug 逃过哪些测试层？逐层说明为什么没拦住（单测→集成→E2E→视觉→审查）；
3. **系统性漏洞定位**：归类为测试场景缺失 / 测试质量不足 / 审查盲区 / 流程缺失；
4. **修复 + 回归保护测试**：明确测试放哪、什么模式；
5. **预防措施**：更新测试模板 / 审查清单 / 流程，落地到具体文件变更。

### 通用避坑清单

1. 不写需求文档直接开发 → 做着做着不知道要做什么；
2. 不写测试 → 改一行崩一片；
3. 不做评审 → 代码越来越乱；
4. 不建 git → 改坏了救不回来；
5. 一次说太多需求 → 记不住、漏掉；
6. 不问「为什么这么选」→ 被带进复杂方案；
7. 不做手动验证 → 测试过但实际用不了。


## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
