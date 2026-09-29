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

## 数据怎么更新

所有数据在 `src/data/`：

| 文件 | 作用 |
|---|---|
| `vendors/<厂商>.json` | 一家一个文件。新增厂商 = 丢一个新文件，无需改代码 |
| `meta.json` | 期号、更新日期、更新日志 |
| `tiers.ts` | 档位颜色 / 名称 / 音高（一般不用动） |

模型字段见 `src/types.ts`，关键几个：

- `tier`：`SSS | SS | S | A | B | C | D | E`，同类别内相对当期全球前沿
- `score`：0–100，须落在档位区间（SSS 97–100 · SS 93–96 · S 88–92 · A 80–87 · B 72–79 · C 64–71 · D 55–63 · E <55），`npm run validate` 会提醒
- `prevTier`：**每期更新时把上一期的 tier 填进来**，界面就会显示 ▲▼ 升降；新上榜留空（两周内发布的自动显示 NEW）
- `status`：`released | preview | rumored | deprecated`；`rumored` 在 3D 里是故障风
- `category`：`llm | image | video`

每期更新流程：

1. 改 `meta.json` 的 `updatedAt` / `edition`，在 `changelog` 追加一条
2. 已有模型：先把当前 `tier` 复制到 `prevTier`，再改新 `tier` / `score`
3. 新模型：往对应厂商文件的 `models` 里加一条
4. `npm run validate && npm run dev` 看一眼

`research/` 下是首期收录的原始资料：`BRIEF.md`（给子 agent 的收录规范，可复用来做下一期）、`vendors/`（原始收录结果）、`showcase_inspiration.md`（视觉灵感调研）、`tier_ref_jp.png`（参照的网友天梯图）。

数据来源：LMArena、Artificial Analysis、Agent Arena、Bug Hunt Bench、Terminal-Bench、各家官方发布，以及 [AGI HUNT](https://agihunt.info)。
