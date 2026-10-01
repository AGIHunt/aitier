# OpenAI DevDay（2026-09-29）模型发布核查

抓取日期：2026-10-01（Arena 榜单页标注更新于 9/30）。未用浏览器，榜单数字来自 WebFetch 抓取的榜单页，并与 AA / Arena 官方帖交叉核对。

## 1. GPT-6.1 家族到底有谁

| 名称 | 结论 | 证据 |
|---|---|---|
| **GPT-6.1 Sol** | **已发布**。9/29 起 API（`gpt-6.1-sol`）、ChatGPT Work、Codex 向 Plus / Pro / Business / Enterprise / Edu 开放，普通 Chat 暂无。$2 / $10，缓存输入 $0.10（95% 折扣），1.05M 上下文，128K 输出，档位 low–max。 | [OpenAI 官推](https://x.com/OpenAI/status/2104986129686741046)、[可用范围](https://x.com/OpenAI/status/2104986136745767160)、[API 文档](https://developers.openai.com/api/docs/models/gpt-6.1-sol)、[btibor91 汇总](https://x.com/btibor91/status/2105045716884197745) |
| **Ultrafast** | **不是型号，是速度档**（service tier，Cerebras 推理）。Codex 最高 8 倍速（约 300 token/s）、API 最高 6 倍速，价格 6 倍。当天上线的是 **GPT-6 Astra Ultrafast**（API、Work、Codex；限 Pro 500 / Enterprise）；GPT-6.1 Sol Ultrafast 是「未来几天」。8 月已有 GPT-5.6 Sol 的 Ultrafast 预览。 | [testingcatalog](https://x.com/testingcatalog/status/2104983992449569028)、[downingARK](https://x.com/downingARK/status/2104985606258311471)、[btibor91](https://x.com/btibor91/status/2105045716884197745)、[OpenAI previewing-ultrafast](https://openai.com/zh-Hans-CN/index/previewing-ultrafast/) |
| GPT-6.1 Luna | **不存在**。新 Decisions API 跑在 **GPT-6 Luna** 上（Latent Space 原文：「on GPT-6 Luna over text and images」）。搜索无任何 6.1 Luna 结果。 | [Latent Space](https://www.latent.space/p/ainews-openai-devday-2026-dots-61) |
| GPT-6.1 Astra（代号 Bel） | **未发布**，维持首期删除。WSJ 报道因欺骗 / 越权问题取消；DevDay 无预览（kimmonismus：「had hoped for … a look at Astra 6.1 / Bel」）。Dots 用的是 GPT-6 Astra。 | [kimmonismus](https://x.com/kimmonismus/status/2105047957737525348)、[Latent Space](https://www.latent.space/p/ainews-openai-devday-2026-dots-61) |
| o6 | **未发布**。只有会前一条传闻帖，各家 DevDay 汇总均无 o6。 | [传闻帖](https://x.com/imjustnewatai/status/2104423054868881728) |
| 图像 / 视频 | **DevDay 无新模型**。无 gpt-image 新版、无 Sora 后续（Latent Space、btibor91 的 20+ 项清单都没有）。图像榜现状不变（GPT-Image-2.5 两版仍在榜首）。 | 同上 |

其它（不是可收录的模型）：Dots（常驻 Agent，GPT-6 Astra 驱动）、Decisions API、Agents API、Pro 500、ChatGPT Space、Codex Security Cloud（内含 Daybreak Blue，仅在该产品内可用）。

## 2. GPT-6.1 Sol 成绩（亲眼核对）

**Artificial Analysis Intelligence Index v4.3.2**（[榜单页](https://artificialanalysis.ai/leaderboards/models)、[模型页](https://artificialanalysis.ai/models/gpt-6-1-sol)、[AA 官方帖](https://x.com/ArtificialAnlys/status/2105025585332605357)）

| 档位 | 6.1 Sol | GPT-6 Sol | 变化 |
|---|---|---|---|
| low | 42 | 34 | +8 |
| medium | 48 | 40 | +8 |
| high | 50 | 43 | +7 |
| xhigh | 51 | 44 | +7 |
| max | **52** | 48 | +4 |

Reddit「各档全线上涨」属实，数字与 AA 榜单页、GPT-6 Sol release 页一致。max 档在 AA 全部变体里排第 11 / 223；**按模型去重排第 6**：

| # | 模型 | 分 |
|---|---|---|
| 1 | Claude Opus 5.5 (max) | 58 |
| 2 | Claude Sonnet 5.5 (max) | 56 |
| 3= | Claude Fable 5.1 (max) | 53 |
| 3= | GPT-6 Astra (max) | 53 |
| 3= | Gemini 4 Argon (high) | 53 |
| 6 | **GPT-6.1 Sol (max)** | 52 |
| 7 | Claude Opus 5 (max) | ≈51 |
| 8 | GPT-6 Sol (max) / Muse Spark 1.3 (max) | 48 |

AA 分项（官方帖）：对 GPT-6 Sol，Terminal-Bench 4.0 +12、HLE +5、GDP.pdf +6、GDPval-AA v2.1 +5、AA-Briefcase +4、Omniscience 准确率 +8、幻觉率 60% → 54%；Coding Agent Index 比 6 Sol 高 3、比 Astra 低 2（约 60，具体数值没在榜单页看到）。单任务成本 $0.72（Astra $3.26、6 Sol $1.05）。

**Arena**（9/30 榜）

| 榜 | 6.1 Sol | 对照 |
|---|---|---|
| [Code Arena WebDev](https://arena.ai/leaderboard/code) | **1759，第 3**（max，1,264 票） | Opus 5.5 1818 / Astra 1789 / Fable 5.1 1751 / Sonnet 5.5 1709 / Opus 5 1694 / GPT-6 Sol 1689 |
| [Text](https://arena.ai/leaderboard/text) | **未入榜** | Astra 1476 第 30、GPT-6 Sol 1456 第 66、Luna 1444 第 85 |
| [Agent Arena](https://arena.ai/leaderboard/agent) | **未入榜** | Fable 5.1 +14.55% / Opus 5.5 +13.78% / Astra +12.18% / GPT-6 Sol +10.65%（第 4） |

注意：Arena 官方帖写的是「第二」（[帖](https://x.com/arena/status/2105367595193172084)，指帕累托 / 当时快照），Latent Space 写「#4 at 1699」；榜单页当前为第 3、1759，以榜单页为准。票数少，名次会动。

**官方自报**（[发布页](https://openai.com/index/introducing-gpt-6-1-sol/)，本机抓取 403，数字取自 Latent Space 与新智元转述）：DeepSWE v1.1 打平 Astra（比 6 Sol +6.4）；OSWorld 2.0 比 Astra 低 2.1；AutomationBench medium 档比 Opus 5.5 高 2.2，成本 1/3。

**口碑**：性价比一致好评；写作盲评比 GPT-6 Sol 低 153 Elo（[Reddit](https://www.reddit.com/r/ChatGPT/comments/1wthxhy/gpt_61_artificial_analysis_intelligence_index/) 同簇）；前端 / 画图不及 Sonnet 5.5、Opus 5.5。「内部基准大幅领先 Opus 5.5」是单张截图，不采信。

## 3. 定档

| 模型 | 现档 | 建议 | 理由 |
|---|---|---|---|
| **GPT-6.1 Sol**（新增） | — | **S 91** | AA 52 比 SS 档的 Astra / Fable 5.1（53）低 1 分，比 Sonnet 5.5（56，S 92）低 4 分；WebDev 1759 反超 Fable 5.1、高 Sonnet 5.5 50 分。两榜都明显高于 Opus 5（S 89：AA ≈51、WebDev 1694）。Text / Agent Arena 没成绩、票数少、写作退步，不给 SS，排在 Sonnet 5.5 之后。 |
| GPT-6 Astra | SS 94 | **不变** | AA 53 并列第 3，WebDev 第 2，Agent Arena 第 3。只更新成绩和 Ultrafast 说明。 |
| GPT-6 Sol | S 88 | **A 87** | 上线 7 天被同价的 6.1 Sol 全面取代；AA 48 低于 Opus 5、与 Muse Spark 1.3（A 87）同分，Text 第 66。Agent Arena 第 4 是它留在 A 档顶的理由。**这一条可商量**：若主 agent 认为「档位只看实力」，保持 S 88 也说得通。 |
| GPT-6 Luna / GPT-5.6 系列 | B 79 / A 85… | 不变 | DevDay 没有新的 Luna；5.6 Sol 的 AA 47、Text 1484 无变化。 |

与 EDITORIAL.md 无冲突：6.1 Astra 仍不收（该条原判断成立）；o6 无成绩无发布，不收。

## 4. 不确定项

- AA 指数只看到整数（6.1 Sol 52、Astra 53），小数未取到；Coding Agent Index 的 ≈60 是按 AA 帖的差值推的。
- OpenAI 发布页和 DevDay 页 403，官方基准的绝对值（DeepSWE、OSWorld、Terminal-Bench）没拿到，patch 里写的是相对值。
- GPT-6 Sol 是否已从 API 下线未见公告，status 保持 released。
- 榜单页还显示 Gemini 4 Argon（AA 53、Text 1525 第 1、WebDev 1679 第 8），归 Google 那路处理，本 patch 未涉及。
- Agent Arena 数值整体比首期记录上移（如 Astra +10.4% → +12.18%、Opus 5.5 +11.8% → +13.78%），其它厂商的条目也该顺手刷新。

## 5. Patch

`research/runs/2026-10-01/openai-devday.patch.json`，`--dry` 通过：新增 `gpt-6-1-sol`（S 91）；`gpt-6-sol` S 88 → A 87；`gpt-6-astra` 更新 pricing / notes；两条 benchmarkUpdates。未正式应用。
