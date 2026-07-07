# 质量节拍

> **开发质量不是靠检查清单堆出来的，是靠固定节奏的日常循环跑出来的。**
>
> **AI 编程不是自动写代码，而是辅助完整开发流程。** — 《Codex、ChatGPT 和程序员效率提升》

---

## 核心理念：从文章出发

### 文章核心观点

> 代码生成只是第一层价值。AI 编程真正的价值，是辅助完整开发流程：
>
> **理解需求 → 拆解功能 → 设计接口 → 设计数据库 → 判断技术方案 → 编写代码 → 处理异常 → 补充测试 → 代码审查 → 写接口文档 → 上线前检查 → 复盘踩坑经验**

这 12 步就是质量节拍要覆盖的全流程。每个步骤都可以从 52 个已集成的 skill 中找到对应的工具。

### 文章的价值分层

```
第七层：经验沉淀 ← /retro, /learn, /ai-collaboration (Pillar 4)
第六层：文档整理 ← /document-release, documentation-and-adrs
第五层：代码审查 ← /review, code-review-and-quality, /cso
第四层：测试设计 ← TDD, /qa, testing-anti-patterns
第三层：报错排查 ← /investigate, systematic-debugging
第二层：代码理解 ← source-driven-dev, context-engineering, codex
第一层：代码生成 ← incremental-impl, source-driven-dev
```

**质量节拍让 AI 自动帮你往上爬** — 每次日常循环，价值层自动上移一层。

---

## 第一章：全流程覆盖总图

质量节拍将完整的开发流程划分为 5 个大阶段、13 个子阶段，覆盖从 0 到 1 的端到端交付。

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        质量节拍 全流程                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Phase 0: 探索期 (Explore)                                                │
│  ├── 0.0 目标定义 ──→ /define-goal                                         │
│  ├── 0.1 市场调研 ──→ /office-hours, /interview-me, idea-refine            │
│  ├── 0.2 创意构想 ──→ /pm, /plan-ceo-review, design-consultation           │
│  ├── 0.3 需求确认 ──→ /pm (PRD), /office-hours Phase 2.8, spec-driven-dev    │
│  └── 0→1 方案输出 ──→ /create-plan, Feature List (功能点拆解+优先级)     │
│                                                                         │
│  Phase 1: 规划期 (Plan)                                                 │
│  ├── 1.1 技术架构 ──→ /plan-eng-review, api-and-interface-design, 架构文档, DB设计文档  │
│  ├── 1.2 设计评审 ──→ /plan-design-review, /design-review              │
│  ├── 1.3 开发计划 ──→ planning-and-task-breakdown, writing-plans       │
│  └── 1.4 DX 审查  ──→ /plan-devex-review, /plan-tune                   │
│  ├── 1→2 测试计划 ──→ Test Plan (策略+范围+场景矩阵)              │
│                                                                         │
│  Phase 2: 开发期 (Build) — 进入日常循环                                  │
│  ├── 2.1 编码     ──→ 日常循环 ⓪→①→②→③→④→⑤                          │
│  ├── 2.2 集成测试 ──→ /qa, verification-before-completion, 组合测试(跨模块交互)  │
│  └── 2.3 安全审查 ──→ /cso, /guard, /freeze                            │
│                                                                         │
│  Phase 3: 交付期 (Ship)                                                 │
│  ├── 3.1 发布审查 ──→ /review (完整), /ship                            │
│  ├── 3.2 灰度验证 ──→ /canary, /browse, pair-agent, Dogfooding检查清单      │
│  ├── 3.3 发布上线 ──→ /land-and-deploy, ci-cd-and-automation, 部署手册   │
│  ├── 3.4 文档同步 ──→ /document-release                                 │
│  ├── 3.5 用户说明 ──→ User Manual / 使用说明                      │
│  ├── 3.6 决策归档 ──→ Decision Log (决策+理由+替代方案)            │
│  └── 3.7 用户反馈 ──→ User Feedback (反馈收集+优先级评估)   │
│                                                                         │
│  Phase 4: 复盘期 (Retro)                                                │
│  ├── 4.1 质量体检 ──→ /health                                           │
│  ├── 4.2 技术复盘 ──→ /retro, Bug反哺分析(为什么没测出来)  │
│  └── 4.3 经验沉淀 ──→ /learn, /ai-collaboration (Pillar 4)             │
│                                                                         │
│  Phase 5: 运营期 (Operate)                                              │
│  ├── 5.1 问题排查 ──→ /investigate                                     │
│  ├── 5.2 性能优化 ──→ /benchmark, performance-optimization             │
│  ├── 5.3 可观测性 ──→ observability-and-instrumentation                │
│  ├── 5.4 安全运营 ──→ /cso (daily mode)                                │
│  ├── 5.5 运维手册 ──→ Operations Manual (运维指南+常见问题)       │
│  └── 5.6 安全审计 ──→ Security Audit Report (定期审计报告)        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 总计集成的 57 个 Skills

| 类别 | Skills |
|------|--------|
| **gstack 核心 (33)** | /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review, /plan-devex-review, /plan-tune, /autoplan, /review, /investigate, /retro, /learn, /ai-collaboration, /ship, /land-and-deploy, /canary, /cso, /guard, /freeze, /unfreeze, /qa, /qa-only, /design-review, /design-consultation, /design-html, /design-shotgun, /document-release, /health, /benchmark, /browse, /pair-agent, /codex, /careful, /pm, /define-goal, /create-plan, /interview-me, /auto-exec |
| **Superpowers (11)** | subagent-driven-development, executing-plans, writing-plans, requesting-code-review, receiving-code-review, dispatching-parallel-agents, finishing-a-development-branch, systematic-debugging, root-cause-tracing, verification-before-completion, test-driven-development, testing-anti-patterns, condition-based-waiting, remembering-conversations, using-git-worktrees, brainstorming, defense-in-depth |
| **Addy-Agent (15)** | planning-and-task-breakdown, spec-driven-development, incremental-implementation, code-review-and-quality, idea-refine, shipping-and-launch, ci-cd-and-automation, documentation-and-adrs, source-driven-development, doubt-driven-development, code-simplification, context-engineering, api-and-interface-design, frontend-ui-engineering, performance-optimization, observability-and-instrumentation, security-and-hardening, git-workflow-and-versioning, deprecation-and-migration, interview-me |
| **总计** | **57 个技能** |

---

## 第二章：三种触发机制（文章映射）

文章说 **"让 AI 在正确的时间做正确的事"** — 质量节拍的三种触发方式就是它的实现。

### 触发方式 A：全流程自动路由（新增）

文章强调 **"ChatGPT 更适合想清楚，Codex 更适合改代码"** — 质量节拍根据当前 Phase 自动路由到合适的 skill：

```
当前 Phase       AI 自动调用的 Skill 序列
──────────────────────────────────────────────────
Phase 0.0 (目标) → /define-goal
Phase 0.1 (调研) → /office-hours → /interview-me → idea-refine
Phase 0.2 (构想) → /pm → /plan-ceo-review → design-consultation
Phase 0.3 (需求) → /pm (PRD) → /office-hours Phase 2.8 → spec-driven-dev
Phase 0→1 (方案) → /create-plan
Phase 0→1 (功能) → Feature List (功能点列表)
Phase 1→2 (测试) → Test Plan (测试计划)
Phase 1.1 (架构) → /plan-eng-review → api-and-interface-design
Phase 1.2 (设计) → /plan-design-review
Phase 1.3 (计划) → /autoplan → planning-and-task-breakdown
Phase 1.4 (DX)   → /plan-devex-review
Phase 2.x (开发) → 日常循环 ⓪→①→②→③→④→⑤
Phase 3.1 (发布) → /review → /ship
Phase 3.2 (灰度) → /canary → /browse → pair-agent → Dogfooding 检查清单
Phase 3.3 (上线) → /land-and-deploy → ci-cd-and-automation
Phase 3.4 (文档) → /document-release → documentation-and-adrs
Phase 3.5 (说明) → User Manual (使用说明)
Phase 3.6 (归档) → Decision Log (决策日志)
Phase 3.7 (反馈) → User Feedback (用户反馈记录)
Phase 4.x (复盘) → /health → /retro → /learn → Bug 反哺分析
Phase 5.x (运营) → /investigate → /benchmark → /cso
Phase X.X (紧急) → 热修复通道（跳过 Phase 0-1，加速发布）
Phase X.X (轻量) → 轻量模式（跳过非必要阶段）
```

**你做的事：** 只说 "Phase X" 或描述当前工作，AI 自动路由。

### 触发方式 B：AI 主动提示（增强版）

文章说 **"把踩坑经验沉淀成可复用的提示词/模板"** — AI 在检测到以下信号时主动提示：

```
信号                        AI 提示
──────────────────────────────────────────────────
你说了"有个想法"            → "需要跑一轮 /office-hours 吗？"
任务描述模糊不清             → "需要先出 PRD 吗？"
代码变更涉及数据库           → "检查了事务一致性吗？"
引入了新依赖                → "安全检查跑了吗？"
子任务完成                  → "要跑 /verification-before-completion 吗？"
PHASE 结束                  → "要跑 /health + /retro 全身体检吗？"
同类型问题出现 3 次以上     → "这个模式反复出现，试试 /learn skillify？"
```

### 触发方式 C：你的一句话（52 场景全覆盖）

文章说 **"一次只做一件事"** — 你的自然语言触发 AI 自动匹配 skill：

```
你说                        AI 调用
──────────────────────────────────────────────────
"出 bug 了"                → /investigate + systematic-debugging
"帮我想个方案"              → /office-hours → /plan-ceo-review
"审查一下"                  → /review + code-review-and-quality
"出安全审计"               → /cso + /guard
"做 dogfooding"                   /browse + Dogfooding 检查清单
"做性能测试"               → /benchmark
"灰度发布"                 → /canary
"上线"                     → /ship → /land-and-deploy
"复盘一下"                 → /retro → /learn
"检查质量"                 → /health
"优化性能"                 → performance-optimization
"做设计系统"               → design-consultation
"写文档"                   → /document-release
"做市场营销"               → /office-hours (builder mode)
"产品需求不清楚"           → /office-hours Phase 2.8 + /ai-collaboration Pillar 1
"不知道怎么用 AI"          → /ai-collaboration + /codex
"团队协作"                 → dispatching-parallel-agents + subagent-driven-development
```

---

## 第三章：日常循环增强版

文章的核心方法论是 **"小步开发 — 一次只改一个模块 → 改完立刻测试 → AI 参与审查"**。质量节拍 的日常循环升级为 6 步，每一步都注入文章的洞察：

```
你开始一个新子任务
    │
    ▼
⓪ pre-flight（自动检查）
    ├── 子任务有明确的验收标准吗？       → 没有 → ❌ 提示先补
    ├── 依赖的上下游功能已经就绪吗？     → 没有 → ❌ 标记阻塞
    ├── 需要先写 PRD 或架构文档吗？      → 需要 → ⚠️ 调用 /office-hours
    ├── 需求边界清楚吗？                → 模糊 → ⚠️ 调用 /ai-collaboration Pillar 1
    │
    ▼
① 上下文检查 + source-driven-dev（文章：贴完整上下文）
    ├── ①-a 上下文完整性自检
    │   ├── 错误信息/堆栈完整？   → /investigate Step 0
    │   ├── 相关代码已读取？      → context-engineering
    │   └── 技术栈/版本已确认？   → source-driven-dev
    ├── ①-b 读取相关源码
    │   └── 提取关键接口签名（spec-driven-dev 自动伴随）
    └── 输出：上下文就绪确认
    │
    ▼
② AI 辅助测试场景脑暴（文章：让 AI 补测试 — 先想再写）
    ├── 正常路径（Happy Path）
    ├── 异常路径（Error Path）
    ├── 业务规则与验证逻辑
    ├── 幂等性与重复提交
    ├── 数据边界（空/零/负/极大值、特殊字符、Unicode、超长输入）
    ├── 组合场景（多个功能同时操作、状态交叉）
    ├── 竞态条件（并发请求、快速重复提交、网络抖动）
    ├── 破坏性测试（用户乱点、非常规操作流、浏览器回退/刷新）
    ├── 真实数据模拟（脱敏生产数据代替纯构造数据）
    ├── 使用 TDD Phase 0 模板
    ├── 先写测试（normal + error + edge）
    ├── 检查测试质量（testing-anti-patterns 自动伴随）
    └── 输出：测试通过
    │
    ▼
③ 增量实现（文章：小步+约束）
    ├── 一次只实现一个模块
    ├── 🔍 依赖审查
    │   ├── 这个依赖真的需要吗？
    │   ├── 有已知安全漏洞吗？
    │   └── 锁定版本号
    ├── 🔍 代码简化检查（code-simplification 自动伴随）
    └── 输出：功能实现
    │
    ▼
④ 上下文完整性审查（文章：审查 AI 输出是核心职责）
    ├── 扫描改动文件
    ├── 6 大专项检查（从 /review Step 3.75 继承）：
    │   ├── 🔴 异常处理 — 每个新函数有 try-catch？错误不吞掉？
    │   ├── 🔴 权限边界 — 新 API 有鉴权？现有鉴权被绕过？
    │   ├── 🔴 事务一致性 — 多步写入能回滚？
    │   ├── 🔴 边界值 — 空/零/最大值处理了？
    │   ├── 🔴 代码风格 — 与项目一致？
    │   └── 🔴 Demo 代码 — 有硬编码？日志完整？
    ├── 自动修复 CRITICAL 问题
    │   └── 复杂问题 → 调用 questioning-code-review
    ├── API 在线文档同步
    └── 输出：审查报告
    │
    ▼
⑤ 文档更新（文档是第六层价值）
    ├── [诊断] 变更类型检查 => 自动匹配需更新的文档
    ├── API 新增/修改 => 更新接口文档
    ├── 架构/模块变更 => 更新架构文档
    ├── 新增功能 => 更新使用说明
    ├── DB 变更 => 更新数据库设计文档
    ├── CHANGELOG 追加本次变更
    ├── [技术债务] 记录本次技术债务
    └── 输出：文档更新清单
    │
    ▼
⑥ AI 协作质量检查（文章：AI 协作能力 — 新技能）
    ├── 用 /ai-collaboration Pillar 3 checklist 自检
    ├── 记录本次协作经验
    └── 输出：协作质量评分
    │
    ▼
回到 ①，进入下一个子任务
```

---

## 第四章：阶段检查扩展版（覆盖全流程）

### Phase 0（探索期）阶段检查

```
[必] 需求完整性检查      → /office-hours Phase 2.8
[必] 创意压力测试        → /plan-ceo-review
[必] 竞品分析            → /office-hours (Landscape Awareness)
[按需] 市场调研          → /browse + WebSearch
[按需] 技术预研          → /plan-eng-review + api-and-interface-design
```

### Phase 1（规划期）阶段检查

```
[必] 架构审查            → /plan-eng-review
[必] 设计审查            → /plan-design-review
[必] DX 审查            → /plan-devex-review
[必] 开发计划审查        → /autoplan
[必] 任务粒度检查        → /autoplan Section 3.6
[必] 测试/文档/审查阶段   → /autoplan Section 3.7
```

### Phase 2（开发期）阶段检查

```
[必] 日常循环完整性      → 6 步都走了吗？
[必] verification-before-completion
[必] /health
[按需] /cso（引入外部依赖时）
[按需] /guard（碰生产环境时）
[按需] /freeze（调试范围锁定时）
```

### Phase 3（交付期）阶段检查

```
[必] 完整 /review        → 含 Step 3.75 上下文自检 + 6 大专项
[必] /qa                → 功能+视觉+响应式+可访问性+安全
[必] /cso              → comprehensive mode
[必] /ship              → 版本+CHANGELOG+PR
[按需] /canary          → 灰度验证
[按需] /browse          → dogfooding 验收
[按需] /land-and-deploy → 发布
[按需] /document-release → 文档同步
```

### Phase 4（复盘期）阶段检查

```
[必] /health             → 质量评分
[必] /retro              → 技术复盘
[必] /learn              → 经验沉淀
[必] /ai-collaboration   → 协作能力总结
[按需] /learn skillify   → 检查是否生成新 skill
[按需] documentation-and-adrs → ADR 归档
```

### Phase 5（运营期）阶段检查

```
[按需] /investigate       → 问题排查
[按需] /benchmark         → 性能基准
[按需] /cso (daily)       → 日常安全检查
[按需] observability-and-instrumentation → 监控
[按需] performance-optimization → 性能优化
[按需] security-and-hardening → 安全加固
```

---

## 第五章：57 个技能的集成与映射

### 5.1 gstack 核心技能（27 个）

| Skill | 文章对应 | 在全流程中的位置 | 集成方式 |
|-------|---------|-----------------|---------|
| **/office-hours** | "让 AI 帮你想清楚" | Phase 0.1-0.3 | 自动触发于"我有想法"信号; Phase 2.8 需求边界探测 |
| **/plan-ceo-review** | "方案比较" | Phase 0.2 | 办公室时间后自动串联 |
| **/plan-eng-review** | "设计接口、判断技术方案" | Phase 1.1 | 架构设计阶段自动调用 |
| **/plan-design-review** | "设计评审" | Phase 1.2 | 有 UI 范围时自动调用 |
| **/plan-devex-review** | "开发者体验" | Phase 1.4 | 面向开发者的产品时调用 |
| **/plan-tune** | "调整 AI 协作方式" | 所有 Phase | 全局配置，按需调用 |
| **/autoplan** | "先拆功能再设计方案" | Phase 1.3 | 规划审查管道; Section 3.6 粒度 + 3.7 阶段 |
| **/review** | "代码审查是核心职责" | Phase 2→④ / Phase 3.1 | 日常循环 Step ④; Step 3.75 自检 + 6 大专项 |
| **/investigate** | "贴完整错误信息和上下文" | Phase 5.1 | 触发于"出 bug 了"; Step 0 上下文检查 + 连环追问 |
| **/retro** | "技术复盘 = 做了什么→踩坑→经验" | Phase 4.2 | 技能提取 + learnings 沉淀 |
| **/learn** | "把经验沉淀成模板" | Phase 4.3 | skillify 命令: learnings→skill |
| **/ai-collaboration** | "AI 协作是新能力" | 所有 Phase | Pillar 1-4: 描述/上下文/审查/模板 |
| **/ship** | "发布流程" | Phase 3.1 | 版本+CHANGELOG+PR |
| **/land-and-deploy** | "上线" | Phase 3.3 | 合并+CI+部署+金丝雀 |
| **/canary** | "灰度验证" | Phase 3.2 | 自动回滚 |
| **/cso** | "安全考量" | Phase 2.3 / 3.1 / 5.4 | 综合模式+每日模式 |
| **/guard** | "敏感信息保护" | Phase 2.3 | 范围锁定 |
| **/freeze/unfreeze** | "调试范围锁定" | Phase 2→③ 时 | 按需 |
| **/qa / qa-only** | "测试设计" | Phase 2.2 / 3.1 | 功能+视觉+响应式+可访问性+安全 |
| **/design-review** | "设计审查" | Phase 1.2 | 对已有站点 |
| **/design-consultation** | "设计系统" | Phase 0.2 | 新项目开始时 |
| **/design-html** | "设计→代码" | Phase 2.1 | 设计实现 |
| **/design-shotgun** | "快速视觉方案" | Phase 0.2 | 多方案探索 |
| **/document-release** | "文档整理" | Phase 3.4 | README/架构/CHANGELOG 同步 |
| **/health** | "质量检查" | Phase 4.1 | 加权评分+趋势 |
| **/benchmark** | "性能基准" | Phase 5.2 | 多方案对比 |
| **/browse** | "Web 浏览" | Phase 3.2 / 0.1 | 市场调研/dogfooding |
| **/pair-agent** | "团队协作" | Phase 3.2 | 远程 Agent 协作 |
| **/codex** | "第二意见" | Phase 2→④ | 对抗性审查 |
| **/careful** | "安全操作" | Phase 2.3 | 破坏性命令保护 |

### 5.2 Superpowers Skills（11 个）

| Skill | 文章对应 | 在全流程中的位置 | 集成方式 |
|-------|---------|-----------------|---------|
| **subagent-driven-dev** | "小步开发" + "一次只改一个模块" | Phase 2.x | 任务粒度指导; "独立模块"规则 |
| **executing-plans** | "拆解功能" | Phase 1.3→2.x | 批次执行+检查点 |
| **writing-plans** | "规划模板" | Phase 1.3 | 测试/文档/审查三阶段模板 |
| **requesting-code-review** | "代码审查" | Phase 2→④ | 子Agent审查门禁 |
| **receiving-code-review** | "审查 AI 输出" | Phase 2→④ | 技术严谨性处理 |
| **dispatching-parallel-agents** | "并行任务" | Phase 2.x | 3+独立问题并行 |
| **finishing-a-development-branch** | "小步+验收" | Phase 2→3 | 分支完成标准化 |
| **systematic-debugging** | "排查报错" | Phase 5.1 | 上下文清单 + 四阶段 |
| **root-cause-tracing** | "根因分析" | Phase 5.1 | 调用链回溯 |
| **verification-before-completion** | "测试验证" | Phase 2.2 | 阶段门禁 |
| **test-driven-development** | "让 AI 补测试" | Phase 2→② | Phase 0 场景脑暴 |
| **testing-anti-patterns** | "测试质量" | Phase 2→② | 不 mock 行为+第三方 |
| **condition-based-waiting** | "条件测试" | Phase 2→② | 时间敏感测试 |
| **remembering-conversations** | "上下文管理" | 所有 Phase | 跨会话上下文 |
| **using-git-worktrees** | "并行分支" | Phase 2.x | 工作区隔离 |
| **brainstorming** | "需求拆解" | Phase 0.1 | 发散收敛 |
| **defense-in-depth** | "异常处理" | Phase 2→④ | 多层验证 |

### 5.3 Addy-Agent Skills（14 个）

| Skill | 文章对应 | 在全流程中的位置 | 集成方式 |
|-------|---------|-----------------|---------|
| **planning-and-task-breakdown** | "拆解功能" | Phase 1.3 | 验收标准+可独立测试 |
| **spec-driven-development** | "理解需求→设计方案" | Phase 0.3→1.1 | 先写规范再编码 |
| **incremental-implementation** | "小步开发" | Phase 2→③ | 薄垂直切片+边界检查 |
| **code-review-and-quality** | "代码审查" | Phase 2→④ | 五轴审查 |
| **idea-refine** | "需求拆解" | Phase 0.1 | 发散收敛+压力测试 |
| **shipping-and-launch** | "上线检查" | Phase 3.1-3.3 | 版本/CHANGELOG/上线清单 |
| **ci-cd-and-automation** | "自动化" | Phase 3.3 | 构建测试部署 |
| **documentation-and-adrs** | "写接口文档" | Phase 3.4 / Phase 4 | ADR+文档 |
| **source-driven-development** | "代码理解" | Phase 2→① | 源码驱动+权威来源 |
| **doubt-driven-development** | "对抗思维" | Phase 2→④ | 非平凡决策审查 |
| **code-simplification** | "代码质量" | Phase 2→③ | 行为保持简化 |
| **context-engineering** | "提供上下文" | Phase 2→① | 上下文层级管理 |
| **api-and-interface-design** | "设计接口" | Phase 1.1 | 接口规范+版本策略 |
| **frontend-ui-engineering** | "前端工程" | Phase 2.x | 组件+状态+样式 |
| **performance-optimization** | "性能优化" | Phase 5.2 | 系统化性能分析 |
| **observability-and-instrumentation** | "可观测性" | Phase 5.3 | 日志/指标/追踪 |
| **security-and-hardening** | "安全考量" | Phase 2.3 | OWASP+加固 |
| **git-workflow-and-versioning** | "版本管理" | Phase 2→3 | 分支策略+规范 |
| **deprecation-and-migration** | "技术债务" | Phase 4.2 | 废弃+迁移路径 |

---

## 第六章：特殊场景映射表（完整版）

当你说以下任意一句话时，AI 自动路由到对应的技能组合：

```
你说                                    AI 映射的技能链
────────────────────────────────────────────────────────────────
"我有一个想法"                          /office-hours → /plan-ceo-review
"帮我分析一下这个需求"                   /office-hours Phase 2.8 → spec-driven-dev
"出个技术方案"                           /plan-eng-review → api-and-interface-design
"审查一下架构"                           /plan-eng-review (双模型审查)
"这个设计怎么样"                         /plan-design-review
"规划一下"                              /autoplan → planning-and-task-breakdown
"开始开发"                              → 日常循环 ⓪→①→②→③→④→⑤→⑥
"出 bug 了"                             /investigate + systematic-debugging
"修一下这个"                             /investigate (先根因再修)
"帮我看一下代码"                         /review + code-review-and-quality
"安全审计"                              /cso comprehensive + /guard
"跑测试"                                /qa + TDD
"做灰度"                                /canary + /browse
"上线"                                  /ship → /land-and-deploy
"复盘一下"                              /retro → /learn → /learn skillify
"检查质量"                              /health + verification-before-completion
"优化性能"                              /benchmark → performance-optimization
"做监控"                                observability-and-instrumentation
"写文档"                                /document-release + documentation-and-adrs
"做设计系统"                            design-consultation → /design-html
"市场调研"                              /office-hours (builder mode) + /browse
"团队协作"                              dispatching-parallel-agents + subagent-driven-dev
"并行搞这几个任务"                       dispatching-parallel-agents
"第二意见"                              /codex (consult/challenge)
"冻结范围"                              /freeze
"安全模式"                              /guard
"AI 怎么用"                             /ai-collaboration (Pillar 1-4)
"这个模式反复出现"                       /learn skillify
"环境配置"                              setup-deploy + ci-cd-and-automation
"紧急修复"                          热修复通道（快速通道）
"轻量模式"                          轻量模式（跳过非必要阶段）
"版本管理"                              git-workflow-and-versioning
```

---

## 第七章：文章核心方法论的集成

### 7.1 "ChatGPT 更适合想清楚，Codex 更适合改代码"

质量节拍在每个 Phase 的开始和结束嵌入"想清楚"阶段：

```
Phase 开始:
  用 /ai-collaboration Pillar 1 → 描述问题
  用 /office-hours / /plan-ceo-review → 想清楚

Phase 执行:
  用日常循环 → 改代码

Phase 结束:
  用 /ai-collaboration Pillar 3 → 审查输出
  用 /retro → 复盘
  用 /learn → 经验沉淀
```

### 7.2 "AI 协作能力是新技能"

文章第 12 节的 AI 协作能力被集成为日常循环的 Step ⑥：

> **每次与 AI 交互后，自我检查：**
> - 我描述清楚问题了吗？（Pillar 1）
> - 我提供了足够的上下文吗？（Pillar 2）
> - 我审查了 AI 的输出吗？（Pillar 3）
> - 我能从这次交互中沉淀出模板吗？（Pillar 4）

### 7.3 "代码生成只是第一层"

质量节拍确保你不会停留在第一层：

```
日常循环每轮自动上移一层：
  第 1 轮：代码生成（第一层）
  第 2 轮：代码理解（第二层）
  第 3 轮：测试（第四层）
  第 4 轮：审查（第五层）
  第 5 轮：文档（第六层）
  第 6 轮：复盘 → 经验沉淀（第七层）
```

### 7.4 "小步开发 — 一次只改一个模块"

日常循环 Step ③ 通过增量约束确保这一点：

```
✅ 正确：实现一个独立模块，提交，测试
❌ 错误：同时改 3 个文件，一次性提交
❌ 错误：改代码时"顺手"修了另一个不相关的 bug
❌ 错误：一个任务里既重构又加新功能
```

### 7.5 "管理 AI 输出，而非复制 AI 代码"

日常循环 Step ④ + ⑥ 确保：

```
Step ④ 审查：
  - 代码风格与项目一致？
  - 命名符合规范？
  - 没有硬编码？
  - 异常处理完整？
  - 权限正确？
  - 事务一致？

Step ⑥ 协作质量：
  - 我给了 AI 什么上下文？
  - AI 输出质量如何？
  - 下次怎么改进？
```

---

## 第八章：开始使用

### 首次会话

```
使用质量节拍，当前焦点：[Phase 编号] —— [子任务名称]
```

### 后续会话

```
遵循质量节拍。当前焦点：[Phase 编号] —— [新子任务]
```

### 快速切换 Phase

```
"Phase 0 — 调研视频转推文功能"
"Phase 1 — 出技术方案"
"Phase 2 — 实现核心模块"
"Phase 3 — 准备发布"
"Phase 4 — 复盘这个 Sprint"
"Phase 5 — 排查线上问题"
```

### 一句话检查

> **我在质量节拍的哪一层？**
> - Phase 0：我在想清楚还是写代码？
> - Phase 1-2：日常循环 6 步走完了吗？
> - Phase 3-4：阶段检查跑了吗？
> - 特殊场景：当前状况触发映射表的哪一条？
> - 协作质量：我用了 /ai-collaboration 吗？

---



## 第九章：文章深度集成（完整对照）

### 9.1 文章 12 节 × 质量节拍对照表

```
文章章节                             质量节拍中的体现
────────────────────────────────────────────────────────────────
前言：AI 编程不是自动写代码          全篇基调 — 日常循环不只有"写代码"
一、代码生成只是第一层价值           日常循环 Step ②③（写代码），但只占 2/6
二、ChatGPT 想清楚 / Codex 改代码    Phase 0-1 用 /office-hours, Phase 2 用日常循环
三、代码理解比代码生成更实用         日常循环 Step ① — source-driven-dev 是第一步
                                     文章说："真实项目 80% 时间是读代码，不是写代码"
                                     所以质量节拍第一步不是写，是读
四、报错排查最能体现 AI 价值         /investigate — 场景映射表第一位
                                     触发方式 C "出 bug 了" → 自动路由
                                     文章说："如果你直接把错误信息贴进去，效果会好很多"
                                     这就是 Step ① 上下文完整性检查的源头
五、小步开发 — 一次改一个模块        日常循环 Step ③ 增量约束
                                     文章说："改完一个功能立刻测试"
                                     所以 Step ②（测试）在 Step ③ 之前
六、测试设计：让 AI 补测试           日常循环 Step ② 场景脑暴 + TDD
                                     文章说："列出可能出问题的场景"
                                     文章又说："如果测试场景都列不清楚，说明需求还没想清楚"
                                     这就是 pre-flight 的验收标准检查
七、代码审查：让 AI 查你的代码       日常循环 Step ④ /review
                                     文章说："代码审查有三个层次：
                                      第一层：低级错误（拼写、语法、类型）
                                      第二层：架构问题（耦合、设计模式、扩展性）
                                      第三层：业务逻辑漏洞（边界情况、异常流程）"
                                     所以 Step ④ 也从这三个层次展开检查
八、文档整理：AI 最被低估的能力      日常循环 Step ⑤ update-docs
                                     文章给了具体模板："整理文章提纲 → 整理周报 → 写技术文档"
                                     详见 9.4 提示词模板
九、复盘踩坑：让 AI 帮你沉淀经验     Phase 4 复盘期：/retro → /learn → /learn skillify
                                     文章说："把踩坑经历整理成文档"
                                     文章说："把经验沉淀成提示词"
                                     这就是 /learn skillify 的核心理念
十、提示词模板                       详见 9.4
十一、AI 编程最容易出问题的 6 种情况  详见 9.2 — 质量节拍内置了 6 道防线
十二、AI 协作能力是新能力            日常循环 Step ⑥ + /ai-collaboration
                                     质量节拍本身就是在训练 AI 协作能力
总结：技术基础 + 工程经验 + AI 协作   详见 9.3 — 程序员能力结构模型
```

### 9.2 文章 6 大失败场景 × 质量节拍 6 道防线

文章第 11 节列出了 AI 编程最容易出问题的 6 种情况。质量节拍内置了对应的 6 道防线：

```
文章说                          质量节拍防得住吗？        怎么防？
──────────────────────────────────────────────────────────────
1. 需求不清楚                     ✅ Phase 0.3 + 2.8       /office-hours 需求边界探测
2. 上下文不足                     ✅ 日常循环 Step ①      上下文完整性自检清单
3. 任务太大                       ✅ /autoplan 3.6        小步粒度检查 + 独立模块规则
4. 没有人工审查                   ✅ 日常循环 Step ④      /review + 6 大专项检查
5. 没有测试验证                   ✅ 日常循环 Step ②      TDD + 场景脑暴 + 先写测试再实现
6. 敏感信息处理不当               ✅ /guard + /careful     安全模式 + 破坏性命令保护
```

**这 6 道防线是 pre-flight 的核心检查项：**

```
⓪ pre-flight 检查（文章 6 大问题版）：
    ├── ✅ 防线 1：需求是否清楚？
    │   ├── 有 PRD 吗？→ 没有 → ⚠️ 调用 /office-hours
    │   └── 验收标准明确吗？→ 没有 → ❌ 不能开始
    ├── ✅ 防线 2：上下文是否足够？
    │   ├── 相关代码已读取？→ 没有 → ⚠️ 先 source-driven-dev
    │   └── 技术栈/版本已确认？→ 没有 → ⚠️ 先 context-engineering
    ├── ✅ 防线 3：任务是否太大？
    │   ├── >5 个文件？→ ⚠️ 建议拆解
    │   └── 跨 3 个模块？→ ⚠️ 建议拆解
    ├── ✅ 防线 4：有人审查吗？
    │   └── 审查 gate 已配置？→ 没有 → ⚠️ 确认审查人
    ├── ✅ 防线 5：有测试验证吗？
    │   └── 测试计划存在？→ 没有 → ⚠️ 先出测试计划
    └── ✅ 防线 6：敏感信息已保护？
        ├── API Key / 密钥已排除？→ 没有 → ❌ 检查后再提交
        └── 客户数据不上传？→ ⚠️ 确认
```

### 9.3 文章总结的"程序员能力结构"模型

文章总结说 **"2026 年以后，优秀程序员的能力结构 = 技术基础 + 工程经验 + AI 协作能力"**。

质量节拍对应这三个能力的训练场：

```
能力支柱             质量节拍中的对应
─────────────────────────────────────────────────────────
技术基础            日常循环 Step ①-⑤ 强制执行编码规范、测试、审查
（编程语言/数据库/   每次循环都是一次技术基本功的训练
 框架/操作系统/网络） 

工程经验            /plan-eng-review → /review → /retro
（架构设计/方案取舍/  每次审查看到架构问题，每次复盘沉淀工程经验
 踩坑复盘）          /plan-ceo-review 训练方案判断能力

AI 协作能力         日常循环 Step ⑥ + /ai-collaboration
（描述问题/提供上下文/ 每次循环结束时的自检，就是 AI 协作能力的刻意练习
 审查输出/沉淀模板）   /learn skillify 训练"从经验到模板"的转化能力
```

**三根支柱互相加强：**

```
技术基础越好 → 越能准确描述问题给 AI → 协作质量越高
工程经验越丰富 → 越能审查 AI 输出 → 错误越少
AI 协作能力越强 → 越快完成任务 → 有更多时间学技术
```

### 9.4 文章第 10 节的具体提示词模板（直接集成）

文章给出了具体的提示词模板，质量节拍直接内置：

#### 代码审查提示（文章原版 → 集成到 Step ④）

```
原版："请审查这段 Python 代码，重点检查命名规范、异常处理和性能瓶颈"

质量节拍版（自动展开）：
  Step ④ /review 自动执行 6 大专项检查：
    🔴 异常处理 — 每个新函数有 try-catch？错误不吞掉？
    🔴 权限边界 — 新 API 有鉴权？现有鉴权被绕过？
    🔴 事务一致性 — 多步写入能回滚？
    🔴 边界值 — 空/零/最大值处理了？
    🔴 代码风格 — 与项目一致？命名符合规范？
    🔴 Demo 代码 — 有硬编码？日志完整？
```

#### 测试设计提示（文章原版 → 集成到 Step ②）

```
原版："我要测试一个用户注册功能，帮我列出需要覆盖的测试场景"

质量节拍版（自动展开）：
  Step ② 自动执行 TDD Phase 0 脑暴模板：
    正常路径 → 异常路径 → 业务规则 → 幂等性
    最少列出 3 个场景 → 不够说明需求没想清楚
```

#### 文档整理提示（文章原版 → 集成到 Step ⑤）

```
原版："请把这段代码的设计思路整理成技术文档，包括背景、方案选型、核心逻辑"

质量节拍版（自动展开）：
  Step ⑤ 自动判断并更新对应文档：
    新增 API 接口 → 更新接口文档
    用户可见功能变化 → 更新 CHANGELOG
    架构变更 → 更新架构文档
    代码设计思路 → 在代码注释区生成设计说明
```

#### 复盘提示（文章原版 → 集成到 Phase 4）

```
原版："请把下面开发经历整理成 CSDN 技术文章提纲，包括背景、问题、排查、解决方案、踩坑点和总结"

质量节拍版（自动展开）：
  Phase 4 /retro 自动结构：
    背景 → 需求回顾 → 做了什么 → 踩坑 → 经验
    输出到 learnings.jsonl → 跨会话可查
    多次重复的模式 → 触发 /learn skillify
```

### 9.5 "代码理解比代码生成更实用" — 文章第三节的深度应用

文章指出：**"真实项目里，80% 的时间是在读代码，而不是写代码。"**

质量节拍的日常循环以代码理解（Step ①）开头，而非代码生成：

```
你开始一个新子任务
    │
    ▼
⓪ pre-flight
    │
    ▼
① 代码理解 ← 第一步不是写，是读！（文章第三节）
    ├── 读取相关源码（source-driven-dev）
    ├── 理解现有逻辑
    ├── 找到改动点
    └── 确认"要改什么"之后 → 才进入 Step ②
```

**文章说：** "代码理解的价值，甚至比代码生成更高。因为大部分时候，你只是不知道代码在干什么，而不是写不出来。"

**质量节拍的应用：** 如果日常循环跳过了 Step ① 直接写代码，说明没有遵守质量节拍。

---




## 第十章：来自"项目开发和管理"知识库的深度集成

### 10.1 四层团队架构（来自 协作机制和开发流程.md 和 agent-workflow）

真实开发不是单枪匹马，而是**多角色协作**。质量节拍引入四层团队架构：

```
你（人类）—— L1 决策层（CEO）
  │  战略方向、资源分配、优先级决策、最终验收
  │
  ▼
AI 架构师/COO —— L2 设计/审查/分配层
  │  架构设计、任务分配、代码审查、质量门禁
  │  参与：/plan-eng-review, /review, /autoplan, /retro
  │  LLM 分配：重模型（Sonnet/o4-mini）
  │
  ├──▶ Agent A（会话 1）—— L3 执行层
  │    职责：模块 A 全权开发与维护
  │    参与：日常循环 ⓪→①→②→③→④→⑤→⑥
  │    LLM 分配：重模型决策 + 轻模型执行
  │
  ├──▶ Agent B（会话 2）—— L3 执行层
  │    职责：模块 B 全权开发与维护
  │    参与：日常循环（同上）
  │
  ├──▶ Agent C（会话 3）—— L3 执行层
  │    职责：模块 C 全权开发与维护
  │    参与：日常循环（同上）
  │
  └──▶ opencode（远程服务器）—— L3 运维层
       职责：服务器运维、爬虫健康、数据修复
       参与：机械执行任务，不参与环形审查

  L4 监督层 —— 自动化
    │  GitHub CI/GitHub Actions / crontab
    │  实时反馈、异常升级、自动修复
```

**STATUS.yaml 作为协同枢纽**（来自 agent-workflow）：

```yaml
# 每个项目根目录下的 STATUS.yaml
agents:
  agent_a:
    status: busy          # idle/busy/blocked/review
    task: P2-01
    design_note: DN-001    # 已提交的 Design Note
    pending_review: DN-001 # 待审查
  agent_b:
    status: idle
  agent_c:
    status: blocked
    blocked_by: P2-01

tasks:
  P2-01:
    assignee: agent_a
    status: in_review
  P2-02:
    assignee: agent_c
    status: blocked
```

### 10.2 Design Note 流程（来自 协作机制和开发流程.md）

在实施任何非平凡变更前，必须先写 Design Note（DN）：

```
你接到一个任务
    │
    ▼
① 写 Design Note
    ├── 问题/需求描述
    ├── 方案选择（至少 2 个方案对比）
    ├── 影响范围（文件、模块、API）
    ├── 风险点（兼容性、性能、安全）
    └── 测试策略（怎么验证）
    │
    ▼
② AI 架构师审查 DN
    ├── ✅ 通过 → 进入实施
    ├── ❌ 打回 → 修改后重新提交
    └── 🔄 需要讨论 → 标记问题点
    │
    ▼
③ 实施（日常循环 ⓪→①→②→③→④→⑤→⑥）
    │
    ▼
④ Review（Step ④ 验证实现与 DN 一致）
```

**触发时机：** 
- Phase 1→2 过渡：每个子任务开始前
- 任何涉及跨模块变更、API 设计、数据库改动的任务
- 开发者不确定方案时主动要求

### 10.3 LLM 分级策略（来自 协作机制和开发流程.md）

文章说 **"重模型花在想上，轻模型花在干上"**。质量节拍集成 LLM 分级：

```
🟥 重模型（Sonnet/o4-mini 级）—— 花预算的地方
   适用环节              原因                替代风险
   ─────────────────────────────────────────────────────
   架构/接口设计          一个错误决策=全白写     轻模型漏边界条件
   代码 Review           需要理解设计意图        轻模型只抓格式问题
   复杂调试              跨模块追踪根因          轻模型陷入局部最优
   核心业务逻辑           出错=生产事故          —
   测试策略设计           决定测什么不测什么      轻模型测无关用例
   多 Agent 分配/调度    这个位置没有替代         —

🟩 轻模型（Haiku/4o-mini/Flash 级）—— 省预算的地方
   适用环节              前提条件               省多少
   ─────────────────────────────────────────────────────
   CRUD 样板代码         接口契约已锁死          ~70%
   单元测试实现           测试策略已定            ~60%
   类型标注/格式化        纯机械填充              ~80%
   Config 文件           有现成模板              ~70%
   文档/docstring        代码已写完              ~60%
   批量修改（模式已知）   改法已确认              ~80%

🟡 中庸层（可上可下）
   写 Feature 代码        看复杂度：接口锁死→轻；含逻辑判断→重
   集成测试              重（跨模块验证，漏一个就是漏 bug）
   AI 写代码时的"自检"    轻模型写→重模型快速过一眼（性价比最高）
```

**实战流水线：**

```
你确认方向
  ↓
L2 架构师（重模型）分析 → 拆任务 → 标注哪些可走轻模型
  ↓
轻量子 Agent（Haiku）写 CRUD / 改配置 / 补测试
  ↓
L2 架构师（重模型）review diff → 验证 → push
```

### 10.4 环形审查机制（来自 协作机制和开发流程.md）

多 Agent 并行开发时，引入**环形审查**：

```
Agent A 完成 P2-01
    │
    ▼
写 Design Note DN-001 → push → STATUS.yaml 标记 pending_review
    │
    ▼
L2 架构师审查 DN-001
    ├── 架构合理性
    ├── 接口设计
    └── 测试策略
    │
    ▼
Agent A 实施
    │
    ▼
Agent B 审查 Agent A 的代码（环形审查）
    ├── 代码质量
    ├── 边界情况
    └── 与 Agent B 模块的接口兼容性
    │
    ▼
L2 架构师最终审查 → merge
```

**环形审查原则：**
- Agent B 审查 A 的代码 → Agent C 审查 B 的代码 → Agent A 审查 C 的代码
- 审查聚焦在**接口兼容性**和**跨模块影响**，不在编码细节
- 编码细节由 Step ④ `/review` 自动处理

### 10.5 Bug 反思循环（来自 bug-and-problem-reflection.md）

每次发现 bug，触发质量节拍的 **Bug 反思循环**：

```
发现 bug
    │
    ▼
① 5 Whys 根因分析（/bug-reflection skill）
    │
    ▼
② 四维分类：
    ├── PRD 层面：需求写清楚了吗？边界条件定义了吗？
    ├── 代码层面：实现有逻辑错误吗？
    ├── 测试层面：测试覆盖到了吗？Mock 正确吗？
    └── 流程层面：质量节拍的哪一步没执行到位？
    │
    ▼
③ 生成改进措施
    ├── 必须对应到具体文件变更（不能"以后注意"）
    ├── 写入 learnings（/learn）
    └── 更新质量节拍（如果发现流程漏洞）
    │
    ▼
④ 执行验证
    ├── 修代码 → 补测试 → 更新文档
    └── 标记为"已修复"（cross-session 可查）
```

**集成到日常循环：** Step ⑥ 在完成一个子任务后，自动检查当前会话有没有发现新的 bug，有则触发反思循环。

### 10.6 Research 阶段：先想清楚再动手（来自 Research提示词.md）

在 Phase 0 之前，增设 **Research 前置阶段**，基于 First Principles 方法：

```
任何开发任务开始前：
    │
    ▼
① 理解问题（Research）
    ├── 问题的本质是什么？
    ├── 用户真正想解决什么？
    └── 成功标准是什么？
    │
    ▼
② 构建多个假设
    ├── 至少 2~3 种可能解释或方案
    ├── 不要默认第一个想法是对的
    └── 主动寻找反例
    │
    ▼
③ 区分事实和假设
    ├── 已知事实（有证据支持）
    ├── 缺失信息（需要收集）
    └── 隐含假设（需要验证）
    │
    ▼
④ 验证后再进入 Phase 0
    ├── 每个关键结论标注确信度（高/中/低）
    ├── 不确定不是错误，不标注不确定才是
    └── 信息不足时提关键问题，不猜测
```

**触发时机：**
- Phase 0 调研前自动进入（用户说"帮我分析一下X"）
- 任务涉及陌生领域或不确定方案时
- 项目重大决策时由 L2 架构师触发

### 10.7 Page-Level TDD：状态枚举优先于测试编写（来自 开发流程和机制优化）

前端页面开发时，日常循环 Step ② 扩展为：

```
② 页面级 TDD（增强版）：
    ├── Phase 1：状态枚举（新增）
    │   ├── 梳理所有用户交互路径（正常路径 A/B/C）
    │   ├── 生成状态覆盖矩阵：
    │   │   └── 每个数据源的 Loading / Empty / Error / Success / Edge Case
    │   └── 枚举所有非正常状态的 UI 提示文字
    │
    ├── Phase 2：TDD 执行
    │   ├── 逐条 RED→GREEN→REFACTOR
    │   └── 覆盖所有枚举状态
    │
    └── 门禁：状态枚举不全 → ❌ 不能开始写代码
```

### 10.8 质量门禁系统（来自 quality-playbook-ai-prompt.md）

质量节拍的每个 Phase 结束时，自动触发质量门禁检查：

```
    [ ] 决策记录已更新（关键决策+理由）
Phase 0 门禁：
  [ ] 需求边界清楚（/office-hours Phase 2.8）
  [ ] 至少 2 个技术方案对比
  [ ] 明确"不做什么"清单

Phase 1 门禁：
  [ ] 架构审查通过（/plan-eng-review）
  [ ] 任务粒度符合小步规则（/autoplan 3.6）
  [ ] 每个任务有测试/文档/审查阶段（/autoplan 3.7）

Phase 2 门禁：
  [ ] 日常循环 6 步完整执行
  [ ] 代码审查无 CRITICAL 问题
  [ ] 测试覆盖 >= 3 场景/模块
  [ ] API Key 无硬编码（/cso）

Phase 3 门禁：
  [ ] /review 全量审查通过
  [ ] /qa 端到端测试通过
  [ ] 文档同步完成（/document-release）
  [ ] CHANGELOG 更新

Phase 4 门禁：
  [ ] /health 评分 >= 7
  [ ] /retro 产出了 learnings
  [ ] Bug 反哺完成（每个 dogfooding bug 问“为什么没测出来”）
  [ ] learnings 已 review（/learn skillify 检查）
  [ ] 未触发 /bug-reflection 的未解决问题

Phase 5 门禁：
  [ ] /investigate 无未解决的告警
  [ ] /cso daily 安全扫描通过
  [ ] 性能指标在基线内（/benchmark）
```

**门禁失败处理：**
- ❌ 一个门禁失败 → 在当前 Phase 修复再重跑
- ❌❌ 三个门禁失败 → 降级到上一 Phase 重新执行
- ⚠️ 门禁被跳过 → 记录到 learnings，下次复盘时审查

---



---

## 第十一章：进阶优化（新增）

### 11.1 热修复通道（Hotfix Fast Track）

生产环境紧急 bug 不走全流程。触发方式：

`
@质量节拍 热修复通道
问题描述：[完整描述]
严重程度：P0（阻断）/ P1（严重）/ P2（一般）
`

热修复流程自动简化：

`
Phase 0: 跳过（不需要调研）
Phase 1: 跳过（不需要 PRD/架构）
          ↓
Phase 2-mini: 最小日常循环
  ① 上下文检查：只检查问题相关代码
  ② 场景脑暴：只覆盖修复相关的测试场景
  ③ 增量实现：最小改动 + 副作用检查
  ④ 代码审查：只审查改动部分（重点异常/权限/事务）
  ⑤ 文档更新：只更新 CHANGELOG
  ⑥ AI 协作检查：简化版
          ↓
Phase 3: 直接发布（灰度加速）
  /ship → /land-and-deploy（跳过完整 /review）
          ↓
Phase 4-mini: 事后补复盘（Bug 反哺必须执行）
  /retro → Bug 反哺分析：“这个 bug 为什么之前的测试没抓到？”　→ 更新测试场景库
  【门禁】Bug 反哺未完成 → 不得关闭热修复单
`

**规则**：热修复通道只用于 P0/P1 问题，事后必须补 Phase 4 复盘。

### 11.2 轻量模式（Light Mode）

适用于小型改动（< 50 行代码、单文件修改、配置变更）。

触发方式：
`
@质量节拍 轻量模式
`

自动跳过：
- Phase 0（不需要调研/PRD）
- Phase 1（不需要架构评审/设计评审）
- Phase 3.5-3.7（不需要使用说明/决策日志）
- Phase 5（不涉及运营）

保留必要门禁：
`
日常循环 6 步完整执行
代码审查（/review）无 CRITICAL 问题
CHANGELOG 更新
`

### 11.3 进度追踪（Progress Tracking）

在对话中随时查看当前项目进度：

`
@质量节拍 进度
`

AI 自动输出：
`
╔══════════════════════════════════════╗
║  项目：[名称]                        ║
║  当前阶段：Phase 2（开发期）          ║
║  已完成：                            ║
║    ✅ Phase 0.0 目标定义             ║
║    ✅ Phase 0.1-0.3 PRD + 规格       ║
║    ✅ Phase 1.1-1.4 架构 + 设计      ║
║    ✅ Phase 1→2 Test Plan            ║
║  进行中：                            ║
║    🔄 Phase 2.1 编码（模块 3/5）     ║
║  待处理：                            ║
║    ⬜ Phase 3 发布 + 文档             ║
║    ⬜ Phase 4 复盘 + 经验沉淀         ║
╚══════════════════════════════════════╝
`

### 11.4 风险预警（Risk Radar）

在以下节点自动触发风险评估：

| 触发时机 | 检查内容 | 预警信号 |
|---------|---------|---------|
| Phase 0→1 切换 | 需求是否充分？方案是否有 B 计划？ | "需求盲区：没有涉及数据迁移方案" |
| Phase 1→2 切换 | 架构决策是否被挑战过？ | "架构风险：单点故障未考虑" |
| Phase 2→3 切换 | 测试覆盖是否充分？异常场景是否覆盖？ | "测试盲区：竞态条件未覆盖" |
| Phase 3→4 切换 | 上线前 checklist 是否完整？ | "发布风险：回滚方案未准备" |

触发方式：
`
@质量节拍 风险评估
`

### 11.5 模式选择总表

| 模式 | 适用场景 | 耗时 | 质量等级 |
|------|---------|------|---------|
| **完整模式**（默认） | 新项目、重大功能 | 正常 | ⭐⭐⭐⭐⭐ |
| **轻量模式** | < 50 行改动、单文件 | 缩短 60% | ⭐⭐⭐⭐ |
| **热修复通道** | P0/P1 生产问题 | 缩短 80% | ⭐⭐⭐（事后补复盘） |
| **复盘模式** | 已完成项目回顾 | 按需 | - |


## 附录：版本变更

### 2026-07 重大更新
- 深度集成文章 12 节对照表
- 6 大失败场景 → 6 道防线 pre-flight 检查
- 程序员能力结构模型（技术基础 + 工程经验 + AI 协作）
- 文章原版提示词模板直接内置到日常循环各步骤
- 四层团队架构（L1 CEO→L2 架构师→L3 Agent→L4 自动化）
- Design Note 流程（DN 写→审→实施→验证）
- LLM 分级策略（重模型花在想，轻模型花在干）
- 环形审查机制（Agent 互审 + 架构师终审）
- Bug 反思循环（5 Whys + 四维分类 + 改进执行）
- Research 阶段（First Principles 先想清楚再动手）
- Page-Level TDD（状态枚举优先于测试编写）
- 质量门禁系统（每个 Phase 6 道门禁，失败降级处理）
- 深度集成文章 12 节对照表
- 6 大失败场景 → 6 道防线 pre-flight 检查
- 程序员能力结构模型（技术基础 + 工程经验 + AI 协作）
- 文章原版提示词模板直接内置到日常循环各步骤
- "代码理解 > 代码生成"原则 — 日常循环以读取代码开头
- 全流程覆盖：5 大 Phase、13 子阶段
- 集成 52 个技能到全流程映射
- 日常循环扩展为 6 步（新增 Step ① 上下文检查 + Step ⑥ 协作质量）
- 阶段检查扩展到每个 Phase
- 新增 /ai-collaboration 技能集成
- 场景映射表从 24 个扩展到 32 个
- 注入文章所有核心方法论
