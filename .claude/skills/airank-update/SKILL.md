---
name: airank-update
description: 更新「AI 天梯」3D 模型天梯榜（~/workspace/airank）：扫描新发布模型与榜单变化，派子 agent 分类别收录 / 复核，生成修改方案，应用、翻译英文、开新一期并发布快照。用户说「更新天梯榜」「天梯榜加上 XX」「XX 发布了，更新一下榜单」「airank 更新」「新一期天梯」「update the AI ladder」时触发；也用于调整某个模型的档位。
---

# AI 天梯 · 更新流程

项目：`/Users/john/workspace/airank`（React + three.js，中英双语）。所有命令在项目根目录执行。和作者用中文沟通。

## 0. 先了解现状（每次必做）

```bash
cd /Users/john/workspace/airank
git status --short          # 有未提交改动先问作者
npm run -s report           # 当前天梯（带上期对比），加 llm/image/video 只看一类，加 --bench 看基准
cat src/data/meta.json      # 当前期号、日期
```

再读 `research/EDITORIAL.md`——作者拍板过的判断，**任何 agent 都不能推翻**。作者本次对话里给出新的判断（「XX 明显最强」「YY 排太高了」），先追加进 EDITORIAL.md 再动数据。

## 1. 数据怎么存

| 路径 | 内容 | 谁改 |
|---|---|---|
| `src/data/vendors/<id>.json` | 厂商 + 模型（事实、tier、score、中文文案）。**唯一的排名真相源** | 只通过 `npm run apply` 或手工小改 |
| `src/data/locales/en/<id>.json` | 英文覆盖层，按模型 id 索引，`_zh` 记录译自哪版中文 | 翻译子 agent |
| `src/data/meta.json` | 当前期 `edition`（日期）、`issue`、`changelog` | `npm run edition` |
| `src/data/history.json` | 每期发布时的快照 `{id: [tier, score]}`。界面上的 ▲▼ / NEW 由「当前数据 vs 上一期快照」自动算出，**不要手填升降** | `npm run edition publish` |
| `research/EDITORIAL.md` | 作者的既定判断 | 主 agent |
| `research/runs/<日期>/` | 每次更新的原始证据、子 agent 报告、patch 文件 | 子 agent |

字段定义见 `src/types.ts`。分档区间：SSS 97–100 · SS 93–96 · S 88–92 · A 80–87 · B 72–79 · C 64–71 · D 55–63 · E <55（同类别内，相对当期全球前沿）。SSS 每类最多 1–2 个，SS ≤3，S ≤7。

## 2. 判断这次是「开新一期」还是「本期修订」

- 上次发布快照之后有新模型发布 / 榜单明显变化，且距上一期 ≥ 约一周 → **开新一期**：`npm run edition new`（自动先给当前期存快照，再切到今天、期号 +1）。
- 同一天内的纠错、作者要求的调档 → **本期修订**，不开新期，改完重新 `npm run edition publish` 覆盖本期快照。
- 作者只是点名加一两个模型：直接走第 4 步的小流程，不必全量扫描。

## 3. 收集信号（全量更新时）

1. **agihunt 近况**（配额有限，全程 ≤15 次）：
   ```bash
   cd ~/workspace/mp-skills/shared/material-fetch
   python3 agihunt.py search "发布"          # 近 7 天；再按需搜 "模型" "视频生成" "图像生成" "Arena" "Artificial Analysis" 及具体模型名
   ```
   也可用 agihunt skill 拉 `models` / `multimodal` 频道近 3 天热帖，和 https://agihunt.info/stories 的事件线。
2. 拿到一份「上期以来的新发布 / 新榜单变化」清单，按类别分组，写进 `research/runs/<今天>/signals.md`。

## 4. 派子 agent（并行，一个 message 里发）

模板在 `references/`，派发前把 `{{TODAY}}` 换成今天，并在「已知当前格局」处贴上第 3 步的相关线索：

- **收录**（`references/collect-brief.md`）：每个有新模型的厂商或类别一个 agent，产出 `research/runs/<今天>/<name>.patch.json`。
- **复核**（`references/verify-brief.md`）：llm / image / video 各一个，`model: "opus"`。双向对照 AA 与 LMArena（AA 不是唯一权威），核实 S 档以上模型真实存在、名次属实。产出 `verify-<category>.md` + `.patch.json`。
- 子 agent 不直接改 `src/data/`，只写 patch；**不要让它们用浏览器工具**（并行会抢）。

小流程（作者点名加一两个模型）：自己查资料，手写一个 patch，跳到第 5 步。

## 5. 审阅并应用

```bash
node scripts/apply.mjs research/runs/<今天>/<x>.patch.json --dry   # 先看改动
node scripts/apply.mjs research/runs/<今天>/<x>.patch.json         # 再应用
npm run -s validate
npm run -s report                                                   # 看整体排名和相对上期的变化
```

审阅要点：
- 多个 patch 冲突时以复核 patch 为准，收录 patch 补新模型；
- 对照 EDITORIAL.md，任何与之冲突的改动都拿出来问作者；
- 跨厂商看一遍各档是否对齐（同档模型实力应可比），名额是否超标；
- 删除模型要谨慎：退役但有影响力的保留并标 `deprecated`。

## 6. 英文

新增或改了中文文案 / benchmarks 的模型，派一个翻译子 agent（`references/translate-brief.md`，`model: "sonnet"`），只写 `src/data/locales/en/`。覆盖层每条带 `_zh` 中文指纹：中文一改，validate 就提示「英文可能过期」，译者核对后用 `node scripts/i18n-stamp.mjs <id ...>` 重新盖戳。完成标准：`npm run -s validate -- --strict` 零错误、零「过期」提示。

## 7. 发布

```bash
npm run edition log "<中文更新摘要>" "<English summary>"   # 一句话，列最重要的 2–4 个变化
npm run edition publish                                   # 快照本期
npm run build                                             # 严格校验 + 类型检查 + 打包
```

然后用浏览器预览确认（`.claude/launch.json` 里有 `airank`，端口 5188；预览面板隐藏时动画会停，用 DOM 检查代替截图）：各类别 SSS 是否正确、新模型卡片、详情面板中英文都正常。

提交：`git add -A && git commit -m "第 N 期：<摘要>"`（本仓库是作者本地仓库，提交前不需要再问；不要 push，除非作者要求）。

## 8. 汇报

用中文，简短：本期新增 / 升降档的关键模型、各类别 SSS、有哪些判断需要作者拍板（尤其与 EDITORIAL 或作者印象可能冲突的）、哪些数据仍不确定。
