# AI 天梯 · airank

3D 交互式 AI 模型天梯榜：LLM / 图像 / 视频三大类，SSS → E 八档。

- **3D 光之塔**：每一档是一层悬浮平台，模型卡片环绕排列；中央光柱、星云背景、上升光尘、Bloom / 色差 / 胶片颗粒后期
- **开场演出**：boot log → 螺旋上升穿过八层（每层一个音）→ 抵达塔顶冲击 + 「SSS」逐字砸入揭晓第一名
- **程序化声音**：零音频文件，全部 Web Audio 实时合成。104 BPM 音序器，越靠近塔顶编制越满（pad → bass → kick → 琶音 → hats → clap）；hover 音高 = 分数映射五声音阶，开源模型是木质拨弦、闭源是玻璃钟；传闻模型带故障风
- **交互**：拖动旋转 · 滚轮升降（自动吸附到档位）· 点卡片镜头飞入 + 详情面板 · ⚔ 对决模式 · ⌘K 搜索 · 厂商筛选 · 表格视图（手机默认）

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

`research/` 是更新过程的工作区：`EDITORIAL.md`（作者拍板过的判断，更新时不能推翻）、`runs/<日期>/`（每次更新的子 agent 报告与 patch 文件）、`showcase_inspiration.md`、`tier_ref_jp.png`。

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
```

数据来源：LMArena、Artificial Analysis、Agent Arena、Design Arena、Bug Hunt Bench、Terminal-Bench、各家官方发布，以及 [AGI HUNT](https://agihunt.info)。
