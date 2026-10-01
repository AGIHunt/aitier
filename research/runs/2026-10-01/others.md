# 第 2 期 · 其它厂商补扫（2026-09-29 → 10-01）

抓取时间 2026-10-01。未触碰 google / openai 模型。patch：`others.patch.json`（已 `--dry` 通过，未正式应用）。

结论先行：**没有新增模型，没有调档**。patch 只刷新 7 个现有条目的榜单数字和备注。

## 1. Cello / Kling 4.0

- Cello 是否为 Kling 4.0：**未确认**。唯一来源仍是 9/26 @koltregaskes 转 @BrentLynch 的猜测帖（https://agihunt.info/e/1a0dd81448059859b56f6edaf6d），快手和 AA 都没有表态。
- Kling 4.0 榜单成绩：**没有**。亲自核对的四个榜都没有 Kling 4.0 / 4.0 Flash / Cello：
  - AA 文生视频 v2.0（27 个模型，Kling 系只有 3.0 Omni 1015、3.0 Pro 1000 锚点）
  - AA 图生视频 v1.0（35 个模型）
  - Arena 文生视频、图生视频（两榜更新日期仍是 9/21）
- 发布状态没变：9/28 官宣，完整版「10 月上线」，目前内测；Flash 版只对 Ultra 年费用户开放。
- 处理：Kling 4.0 维持 B 78、Kling 4.0 Flash 维持 B 75，只改 Kling 4.0 备注。等正式上线和进榜后再评。

## 2. Utopai X（基于 MiniMax H3）

- 是什么：AI 原生影视公司 Utopai Studios 在开源的 MiniMax H3 上**后训练**出的视频模型，9/30 在其叙事平台 PAI 内上线。来源是 AA 官方帖（https://agihunt.info/e/1a0f28e0646a5d02936d63bc93c）和 AA 榜单页，榜单上的名字就写作「Utopai X (MiniMax H3)」。
- 成绩：AA 文生视频 v2.0（带音频）1150，第 2，5455 样本，CI 1139–1161。高于 H3 本体 12 分，CI 重叠。
- 是否独立可用：**否**。AA 标注「No API」，只能在 PAI 里按 93 credits/秒使用（订阅 $15/月起含 1000 credits）。Utopai 官网没有模型卡，也没有权重。Arena 两个视频榜都没有它。
- 建议：**不收**。它是 H3 的衍生微调版，绑在单一产品里，和 fal 的 H3 Max 同类，而 H3 Max 首期也没有单列。已把它写进 MiniMax H3 的备注和榜单注释。若作者想收，应归新厂商 Utopai Studios（US），不归 MiniMax，档位参考 H3 给 S 90 左右。

## 3. AA 文生视频榜换代（顺带发现，影响多个条目）

AA 在 9/30 发布 AA-Video-T2V v2.0：统一 1080p、约 1000 条提示词、6.8 万票，Elo 重新标定（Kling 3.0 Pro = 1000）。库里原有的 AA 带音频文生视频数字（1220–1230 一档）都是旧口径。

| 名次 | 模型 | Elo | 样本 | 当前档位 |
|---|---|---|---|---|
| 1 | Wan 3.0 | 1157 | 6391 | SS 94 |
| 2 | Utopai X (MiniMax H3) | 1150 | 5455 | 不收 |
| 3 | Dreamina Seedance 2.5 | 1143 | 6375 | SSS 98 |
| 4 | MiniMax H3 (768p) | 1138 | 6343 | SS 95 |
| 5 | FLUX 3 | 1129 | 5628 | A 87 |
| 6 | Gemini Omni Flash 1.1 | 1120 | 6649 | SS 96（google，未动） |
| 7 | Dreamina Seedance 2.0 | 1118 | 5412 | S 89 |
| 8 | SkyReels V4 | 1074 | 5300 | B 72 |
| 9 | Agnes-Video-2.5（Sapiens AI） | 1059 | 3754 | 未收 |
| 10 | HappyHorse-1.1 | 1046 | 4917 | A 83 |
| 11 | grok-imagine-video-1.5 | 1046 | 3786 | S 88 |
| 12 | Wan2.7 | 1029 | 3806 | A 81 |
| 14–15 | Kling 3.0 Omni / Pro | 1015 / 1000 | | B 72 |
| 16 | PixVerse V6 | 989 | | C 70 |
| 18 | MAGI-2 Preview (0912) | 964 | 3508 | A 82 |
| 23 / 24 | Vidu Q3 Pro / Turbo | 942 / 912 | | C 70 / D 62 |

来源：https://artificialanalysis.ai/video/leaderboard/text-to-video 。v2.0 无音频榜没抓到表格，库里的无音频数字保留并标了「v1 旧口径」。

patch 里已更新 Wan 3.0、Seedance 2.5、MiniMax H3、FLUX 3 四条的榜单数字。Seedance 2.5 和 FLUX 3 原备注写「AA 未收录」，现已改正。

需要作者或视频复核 agent 拍板的几处（我没有改档）：

- **Seedance 2.5 仍是 SSS**：AA 新榜排第 3，落后 Wan 3.0 14 分，CI 上沿 1153 与 Wan 下沿 1147 重叠，H3 与它统计并列。这是作者既定口径，不动，只在这里列出。
- **Gemini Omni 1.1 Flash（SS 96）**：EDITORIAL 里「AA 未收录」的理由已过时，它现在是 AA 第 6，低于 FLUX 3。归 google 那边的 agent 处理。
- **FLUX 3 Video（A 87）**：AA 第 5、Arena 文生视频第 3，图生视频第 9。够得上 S 88–89。
- **Grok Imagine Video 1.5（S 88）**：AA 新榜只排第 11（1046），AA 图生视频第 8；Arena 文生第 4、图生第 8。两榜分歧大，S 偏高，可考虑 A 86。
- **SkyReels V4（B 72）**：AA 新榜第 8（1074），高于 HappyHorse-1.1 和 Grok 1.5；但 AA 图生视频只排第 16，Arena 未见。可小幅上调到 B 76 左右。
- **MAGI-2 Preview（A 82）**：AA 新榜第 18（964），低于 Kling 3.0 锚点；图生视频第 9。A 档偏高。
- **HiDream-O1-Video-1.0（S 88）**：不在 AA 文生视频 v2.0 榜上，依据只有图生视频（AA 第 5、Arena 第 7）。

## 4. Claude Sonnet 5.5（S 92）

| 榜单 | 结果（9/30 抓取） |
|---|---|
| Arena Text | **未入榜** |
| Code Arena WebDev | claude-sonnet-5.5-high 1709 ±16，第 5，1810 票 |
| Agent Arena | 未入榜（只有 Sonnet 5 High 第 11） |
| AA 智能指数 | max 档 56，按模型算第 2；xhigh 52，high 47 |

WebDev 排在 Opus 5.5（1818）、GPT-6 Astra（1789）、GPT-6.1 Sol（1759）、Fable 5.1（1751）之后，高于 Opus 5 Max（1694）和 GPT-6 Sol（1689）。这正好是 S 档顶部的位置，不支持升 SS。口碑也有分歧（@bindureddy 称 max 档空转，@hrishioa 称好于 Opus）。**维持 S 92**，去掉备注里的「有望冲 SS」，补 WebDev 成绩。

顺带刷新 Opus 5.5 的数字（档位未动）：

- Text Arena 1509 第 1 → **1504 第 4**（3932 票，区间 2–14）。榜首现在是 gemini-4-argon-high 1525（4942 票）。
- WebDev 1827 → 1818，仍第 1，领先 Astra 29 分。
- Agent Arena +13.78%，第 2。
- AA 智能指数 58，仍第 1。

Opus 5.5 是否继续独占 SSS，取决于 Gemini 4 那边的结论。Argon 在 Text 第 1，但 WebDev 第 8（1679）、Agent 第 8、AA 53，综合看 Opus 5.5 仍领先。

## 5. agihunt 补扫（10 次搜索）

| 线索 | 状态 | 处理 |
|---|---|---|
| Claude Haiku 5.5 | Mike Krieger 再次确认「未来几周」，未发布 | 维持 rumored C 70 |
| Grok 4.8 | 出现在 Cursor 模型列表和 xAI Grok Build 仓库，未发布 | 不收 |
| DeepSeek V4.1 Pro | 只有灰度测试传闻 | 维持占位 C 70 |
| Kimi K3.1 | 爆料称最早 10 月，未发布 | 不收 |
| GLM-5.4 / GLM-5.5 Flash / Kimi K4 / Muse Spark 1.4 | OpenCode sitemap 泄露名，无成绩 | 不收 |
| Qwen | 只有 Qwen-Audio-3.1（音频，不收）和 Qwen-Image-2.1 生态 LoRA；视频提到的「Qwen 4.0」没有一手来源 | 不收 |
| Ideogram 4.5 | 9/30 发布的图像编辑模型，已上 API，权重「soon」 | **暂不收**，见下 |
| 字节、智谱、MiniMax、腾讯、小米、阶跃、Meta | 9/29 之后没有搜到新模型发布 | 无 |

Ideogram 4.5 是这轮唯一真正发布的新模型。Arena Image Edit 1351 排第 18（5441 票），AA Image Editing 1064 排第 23，$220/千张。水平约在 Qwen-Image-2.1（B 77）之下，对应 C 70–B 72，而且要新建厂商。不在榜单前列，建议不收；作者想收的话我再补 patch。

## 没核到的

- AA 文生视频 v2.0 无音频榜的完整表。
- Arena 两个视频榜自 9/21 起没更新，库里数字与页面一致。
- Utopai X 没找到 Utopai 官方的发布页，只有 AA 的说法。
- Arena Text 页面的名次区间是从抓取文本里拆出来的（「214」读作 2–14），可能有偏差。
