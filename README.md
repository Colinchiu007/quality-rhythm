# 质量节拍

> 开发质量不是靠检查清单堆出来的，是靠**固定节奏的日常循环**跑出来的。

---

## 一句话

按"操作节奏"分层管理开发质量：

```
日常循环（每次写代码自动跑）→ 4 步
阶段检查（每 Phase 结束触发）→ 3 步
特殊场景（条件满足时激活）  → 按需触发
```

你只需要记住日常循环的 4 步，剩下的事 AI 会在对的时间自动做。

---

## 用法

在任何支持 `~/.agents/skills/` 的 AI 工具中说：

```
使用质量节拍 skill。当前焦点：[Phase 编号] —— [子任务名称]
```

或：

```
质量节拍。当前焦点：[Phase 编号] —— [子任务名称]
```

---

## 结构

```
质量节拍/
├── SKILL.md    ← 完整技能定义（37 个技能，三层触发机制，完整场景映射）
└── README.md   ← 本文件
```

## 技能覆盖

37 个技能按三层组织：
- **日常循环（8 个）**：source-driven-dev, TDD, incremental-impl, /review 等
- **阶段检查（3 个）**：verification-before-completion, /health, documentation-and-adrs
- **特殊场景（26 个）**：/investigate, /cso, /guard, dispatching-parallel-agents 等

## 一键安装到任意项目

```bash
npx degit Colinchiu007/quality-rhythm/installer .quality-rhythm
node .quality-rhythm/run.js
rm -rf .quality-rhythm
```

详情见 [installer/](./installer/)。
