# 机制整合包 — 新环境复制整套流程

> 目标：新电脑/新环境用 Codex 时复制「CCG + 质量节拍 + OpenSpec」整套机制。
> ⚠️ 这是**核对清单驱动的安装**，不是"跑一条命令就全好"——完整核对见 **[env-checklist.md](env-checklist.md)**。

## 前置条件

- Node.js 20+、Codex CLI、git + GitHub 认证
- Claude Code CLI（可选；CCG 双模型分析需要）

## 安装步骤（6 步）

### 1. CCG 机制（官方安装器）

```bash
npx ccg-workflow        # 交互式菜单 → 选 "X. Codex Mode"
```

生成：`~/.codex/AGENTS.md`（CCG 决策矩阵/任务系统/铁律）+ `config.toml`（multi_agent_v2）+ `codeagent-wrapper` + hooks。

安装后**追加本地增强**（`ccg/codex-overlay.md` 区块到 `~/.codex/AGENTS.md`）：codegraph 优先路由 / fastctx 说明 / 子代理使用编排。

**双模型认证（手工）**：Claude Code 登录 + antigravity/Gemini CLI 登录 + API Key 配置——没有认证则 CCG 退化为单模型 + 子代理，机制文本仍生效但双模型交叉验证不可用。

### 2. MCP 工具链（机制依赖，易漏！）

```bash
npm i -g fastctx && fastctx apply --yes && fastctx status   # fastctx（overlay 依赖）
npm i -g <codegraph> && cd <项目> && codegraph init          # codegraph（CCG 路由依赖）
```

复制 `codex/config.toml.template` → `~/.codex/config.toml`，替换 `{{FASTCTX_BIN}}` 等占位符。

### 3. OpenSpec（官方 CLI，OPSX 1.8+）

```bash
npm i -g @fission-ai/openspec
cd <项目> && openspec init --tools codex --force
```

复制本包模板（或用一键脚本）：
- `openspec/config.yaml.template` → `openspec/config.yaml`（context 项目约定 + artifact rules）
- `openspec/spec-contract.md` → `openspec/specs/openspec-integration/spec.md`（11 条契约，按项目裁剪）
- `openspec/openspec-sync-check.js` → `scripts/`

### 4. 质量节拍 skill（两部分，缺一不可）

**a) skill 本体**（SKILL.md + 57 技能 + integrations）——installer 不装 skill：
```bash
git clone https://github.com/Colinchiu007/quality-rhythm.git
# 复制到 ~/.agents/skills/质量节拍/（或直接使用本目录）
```

**b) 项目门禁**（pre-commit / CI / 标记）：
```bash
npx github:Colinchiu007/quality-rhythm/installer
```

### 5. 项目模板

- `project/AGENTS.md.snippet` → 合并进项目 `AGENTS.md`（分支分层/机制硬化）
- `project/quality-gates.template.md` → 项目 `.quality-gates.md`

### 6. 重启 Codex + 验证

**必须完全重启 Codex**（技能/AGENTS.md 启动时加载），然后逐项验证（详见 env-checklist 第 7 节）：
```bash
openspec doctor                                   # OpenSpec 健康
openspec list --specs                             # 契约可见
node scripts/openspec-sync-check.js               # 归档同步
fastctx status                                    # MCP handshake
codegraph status                                  # 索引
# 会话内：skills 可见 [$quality-rhythm]、/opsx:* 可用
```

## 整合包结构

```
integrations/
├── README.md                  ← 本文件
├── env-checklist.md           ← 完整核对清单（含生效验证，必读）
├── install-mechanism.js       ← 一键复制模板脚本（已验证）
├── ccg/codex-overlay.md       ← CCG 本地增强区块（官方安装后追加）
├── codex/config.toml.template ← ~/.codex/config.toml 骨架（MCP 配置，无密钥）
├── openspec/
│   ├── config.yaml.template   ← 1.8 context/rules 配置模板
│   ├── spec-contract.md       ← 11 条机制契约（按项目裁剪）
│   └── openspec-sync-check.js ← 归档三同步检查
└── project/
    ├── AGENTS.md.snippet      ← 分支分层 + 机制硬化片段
    └── quality-gates.template.md
```

## 诚实边界（不会自动复制）

- API Key / 登录态（Claude、antigravity/Gemini、Stitch、CloudBase）
- 插件市场 local source、历史项目 trust 列表
- Multica 平台运行时块
- 项目历史（.ccg/tasks 归档、openspec 历史、codegraph 索引）
- 机制文本与模板可复制；**工具链与认证需按 checklist 手工配置，重启后验证生效**