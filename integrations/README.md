# 机制整合包 — 新环境一键复制整套流程

> 目标：新电脑/新环境用 Codex 时，通过官方安装器 + 本整合包复制「CCG + 质量节拍 + OpenSpec」整套机制。

## 前置条件

- Node.js 20+
- Codex CLI
- Claude Code CLI（可选；CCG 双模型分析需要它作为主控）

## 安装步骤（5 步）

### 1. CCG 机制（官方安装器）

```bash
npx ccg-workflow        # 交互式菜单 → 选 "X. Codex Mode"
```

生成：`~/.codex/AGENTS.md`（CCG 决策矩阵/任务系统/铁律）+ `config.toml`（multi_agent_v2）+ `codeagent-wrapper`。

安装后**追加本地增强**（复制本包 `ccg/codex-overlay.md` 中的区块到 `~/.codex/AGENTS.md` 末尾）：
- 代码检索路由（codegraph 优先）
- fastctx 本地文件工具说明
- 子代理使用编排规则

### 2. OpenSpec（官方 CLI，OPSX 1.8+）

```bash
npm i -g @fission-ai/openspec
cd <项目> && openspec init --tools codex --force
```

复制本包模板：
- `openspec/config.yaml.template` → `openspec/config.yaml`（含 context 项目约定注入 + artifact rules）
- `openspec/spec-contract.md` → `openspec/specs/openspec-integration/spec.md`（11 条机制契约，按项目裁剪）
- `openspec/openspec-sync-check.js` → `scripts/`（归档三同步检查）

### 3. 质量节拍

```bash
npx github:Colinchiu007/quality-rhythm/installer
```

或复制本 skill 目录到 `~/.agents/skills/质量节拍/`。

### 4. 项目模板

- `project/AGENTS.md.snippet` → 合并进项目 `AGENTS.md`（分支隔离分层/机制硬化规则）
- `project/quality-gates.template.md` → 项目 `.quality-gates.md`

### 5. 验证

```bash
openspec doctor                                   # OpenSpec 健康
node scripts/openspec-sync-check.js               # 归档同步检查
openspec list --specs                             # 契约可见
# 重启 Codex 使 .agents/skills 技能生效
```

## 机制契约要点（spec-contract.md 摘要）

- 三层分工：CCG（编排）→ 质量节拍（门禁）→ OpenSpec（规格工件）
- M+/中高风险任务必须建 change；S/低风险可跳过
- 差异审计前置、进度单一来源、归档三同步、分层分支策略、场景-测试映射

## 注意事项

- CCG 双模型调用（antigravity/Gemini + Claude）需按官方安装器配置外部 CLI 与 API Key
- Multica 等平台运行时块不包含在本整合包（平台特定）
- 项目特定 QM 条款（打包验证/测试命令）在项目 AGENTS.md，本包只带通用框架
