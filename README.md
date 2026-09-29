# AI 天梯 · AI Tier

**🔗 [aitier.agihunt.info](https://aitier.agihunt.info)** · 3D 交互式 AI 模型天梯榜 / An interactive 3D tier list of frontier AI models

LLM / 图像 / 视频三大类，SSS → E 八档，数据来自 Artificial Analysis、LMArena、Agent Arena 等榜单的双向对照，由 [AGI Hunt](https://agihunt.info) 维护、按期更新。

LLMs, image and video models ranked SSS → E, cross-checked across Artificial Analysis, LMArena, Agent Arena and more. Maintained by [AGI Hunt](https://agihunt.info), updated in issues. Chinese browsers get Chinese, everyone else gets English (toggle top-right).

- **3D 光之塔 / Tower of light**：每一档是一层悬浮平台，模型卡片环绕排列；中央光柱、星云背景、上升光尘、Bloom / 色差 / 胶片颗粒后期
- **开场演出 / Intro**：打开即螺旋登塔，逐层点亮，抵达塔顶「SSS」逐字砸入揭晓第一名
- **程序化声音 / Procedural audio**：零音频文件，全部 Web Audio 实时合成。104 BPM 音序器，越靠近塔顶编制越满；hover 音高 = 分数映射五声音阶，开源模型是木质拨弦、闭源是玻璃钟；传闻模型带故障风。首次点击后出声（浏览器限制）
- **交互 / Interaction**：拖动 / 横滑旋转 · 滚轮 / 竖滑升降 · 点卡片镜头飞入 + 详情面板 · ⚔ 对决模式 · ⌘K 搜索 · 厂商筛选 · 表格视图
- 技术栈 / Stack：React 19 · Vite · three.js / react-three-fiber · postprocessing · framer-motion · zustand

## 开发

```bash
npm install
npm run dev        # http://localhost:5173
npm run validate   # 校验数据
npm run build      # 校验 + 类型检查 + 打包到 dist/
```

快捷键：`1/2/3` 切类别 · `↑↓` 升降档 · `←→` 逐名浏览 · `O` 全景 · `V` 3D/表格 · `M` 静音 · `Esc` 返回 · `⌘K` 搜索

## 语言

中文浏览器（`navigator.languages` 首选 zh-*）显示中文，其他一律英文；右上角 `中 / EN` 可切换并记住。

## 数据怎么存

所有数据在 `src/data/`，中文是主语言，英文是覆盖层：

| 路径 | 作用 |
|---|---|
| `vendors/<厂商>.json` | 厂商 + 模型：事实、`tier`、`score`、中文文案。**唯一的排名真相源**。新增厂商 = 丢一个新文件 |
| `locales/en/<厂商>.json` | 英文覆盖层，按模型 id 索引（tagline / highlights / tags / notes / bench 备注 / 含中文的价格等） |
| `meta.json` | 当前期 `edition`（日期）、`issue`（期号）、`changelog`（中英） |
| `history.json` | 每期发布时的快照 `{模型 id: [tier, score]}`。界面上的 ▲▼ / NEW **由当前数据对比上一期快照自动算出**，不用手填 |
| `tiers.ts` | 档位颜色 / 音高（一般不用动） |

字段定义见 `src/types.ts`。分档：SSS 97–100 · SS 93–96 · S 88–92 · A 80–87 · B 72–79 · C 64–71 · D 55–63 · E <55。

`research/` 是更新过程的工作区：`EDITORIAL.md`（作者拍板过的判断，更新时不能推翻）、`runs/<日期>/`（每次更新的子 agent 报告、原始证据与 patch 文件）、`showcase_inspiration.md`（视觉灵感调研）。

## 怎么更新

推荐直接在 Claude Code 里说「更新天梯榜」/「XX 发布了，加到天梯榜」，会触发 `airank-update` skill（`.claude/skills/airank-update/`，已软链到 `~/.claude/skills/`，任何目录下的会话都能用）。它会扫描 agihunt 新发布、派子 agent 收录与复核、生成 patch、翻译英文、开新一期并发布。

手动更新用这些命令：

```bash
npm run report [llm|image|video] [-- --bench]   # 看当前天梯及相对上期的变化
npm run edition new                             # 开新一期（先快照当前期，再切到今天、期号 +1）
npm run apply <patch.json> [-- --dry]           # 应用修改方案：changes / add / remove / benchmarkUpdates / vendors
npm run validate [-- --strict]                  # 校验；--strict 时缺英文也算错误（build 用）
npm run edition log "<中文>" "<English>"         # 追加本期更新日志
npm run edition publish                         # 快照本期（可重复执行覆盖）
npm run build
npm run deploy                                  # 构建并 rsync 到服务器（见 scripts/deploy.sh 与 deploy/ 下的 nginx 配置）
```

数据来源：LMArena、Artificial Analysis、Agent Arena、Design Arena、Bug Hunt Bench、Terminal-Bench、各家官方发布，以及 [AGI HUNT](https://agihunt.info)。

## License

代码 MIT。模型名称与商标归各自厂商所有；榜单数据引用自上述公开来源，定档为 AGI Hunt 编辑判断。

Code: MIT. Model names and trademarks belong to their owners; leaderboard figures are cited from the public sources above, and tier placements are AGI Hunt's editorial judgement.
