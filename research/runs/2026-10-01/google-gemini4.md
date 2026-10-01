# Google · Gemini 4 Argon 收录报告（2026-10-01）

## 结论

- **Gemini 4 Argon 是真的**，Google 于 2026-09-30 官宣；「恶搞页面」是误报。
- **还没有公开可用**：只给美国政府和 Fairwind 计划里的受信网络防御者，AI Studio / Gemini App / API 文档都没有入口。按 `preview` 收录。
- **定档 S 92**（不进 SSS，不改动现有 SSS / SS）。SS 93 也说得通，理由见「定档」一节，请作者拍板。
- 只发了 Argon 一款，没有 Gemini 4 Flash / Pro，也没有图像、视频新模型。

## 一、真伪核实

| 证据 | 内容 | 链接 |
|---|---|---|
| Google 官方博客 | 《Introducing Gemini 4 Argon》，页面可访问，有定价、基准、发布安排 | https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/ |
| Sundar Pichai | 「Introducing Gemini 4 Argon!」，称已交付美国政府和 Fairwind 防御者 | https://x.com/sundarpichai/status/2105387952478277979 |
| Google DeepMind 官号 | 「our new frontier model」，今日向受信测试者开放；输出上限 1M token | https://x.com/GoogleDeepMind/status/2105388084154056939 |
| Logan Kilpatrick | 介绍价 $2 / $10 | https://x.com/OfficialLoganK/status/2105388054274080946 |
| Demis Hassabis | 先给政府和受信网络防御者，之后扩大 | https://x.com/demishassabis/status/2105417239432200636 |
| Artificial Analysis | 已有模型页 Gemini 4 Argon (High) | https://artificialanalysis.ai/models/gemini-4-argon |
| LMArena 官号 + 榜单页 | Text / WebDev / Agent 三榜均已上榜 | https://x.com/arena/status/2105411271525052418 |

**「恶搞」说法的来源**：Reddit @MrTimeHacker1 的帖子标题是「Wake up babe, it's Gemini 4 fr」，正文就是上面那个 blog.google 官方链接，本身是在报喜。「恶搞、Gemini 4 并不存在」是 agihunt 摘要模型自己加的判断，原帖没有这个意思（https://agihunt.info/e/1a0f401c7502984fda163a001df）。

### 官方事实

| 项 | 内容 |
|---|---|
| 正式名称 | Gemini 4 Argon（无 Pro / Flash 后缀，官方只称 frontier model） |
| API model id | **未公布**。ai.google.dev 模型列表里没有任何 gemini-4 / argon 条目；Arena 的内部标识是 `gemini-4-argon-high` |
| 推理档 | 第三方榜单只有 High 一档，AA 注明是「the highest available」；官方博客没写档位 |
| 上下文 / 输出 | 上下文 1M（AA 模型页）；输出上限从 64K 提到 1M（官方） |
| 定价 | 介绍价 $2 / $10 每百万 token，之后 $4 / $20；缓存输入 95% 折扣 |
| 可用性 | 9/30 起仅美国政府 + Fairwind 受信网络防御者；下一批是付费 API 客户和 Google AI Ultra，时间只说「尽快」 |
| 同时发布 | 无。博客只讲 Argon |
| 官方基准 | DeepSWE v1.1 77.9%、AutomationBench 51.3%（第 1）、LVBench 91.7%、CWE-bench v1 68%（并列第 1）、Vals Index 第 1 |

此前占位条目里的泄露成绩（DeepSWE 88.7%、Terminal-bench 2.1 95.3%、GDPval 2064）与官方数字对不上，作废。

## 二、榜单数据（均为 10/01 亲自抓取榜单页）

### LMArena Text（https://arena.ai/leaderboard/text ，9/30 榜）

| 名次 | 模型 | 分数 | 95% CI | 票数 |
|---|---|---|---|---|
| 1 | gemini-4-argon-high | 1525 | ±9 | 4,942 |
| 2 | claude-opus-4-6-high | 1505 | ±3 | 77,193 |
| 3 | claude-fable-5-high | 1505 | ±4 | 37,900 |
| 4 | claude-opus-5.5-high | 1504 | ±10 | 3,932 |
| 5 | claude-opus-4-7-high | 1502 | ±4 | 64,607 |
| 6 | claude-fable-5.1-max | 1501 | ±7 | 11,241 |
| 11 | gemini-3.8-flash-high | 1494 | ±5 | 24,828 |

Argon 下界 1516，高于第 2–6 名的上界（最高 1514），领先在统计上成立，但票数不到 5 千，分数还会动。

### Code Arena WebDev（https://arena.ai/leaderboard/code ）

| 名次 | 模型 | 分数 | CI | 票数 |
|---|---|---|---|---|
| 1 | claude-opus-5.5-max | 1818 | ±17 | 1,976 |
| 2 | gpt-6-astra-max | 1789 | ±10 | 5,918 |
| 3 | gpt-6.1-sol-max | 1759 | ±19 | 1,264 |
| 4 | claude-fable-5.1-max | 1751 | ±10 | 6,137 |
| 5 | claude-sonnet-5.5-high | 1709 | ±16 | 1,810 |
| 6 | claude-opus-5-max | 1694 | ±6 | 16,747 |
| 7 | gpt-6-sol-max | 1689 | ±12 | 3,197 |
| 8 | gemini-4-argon-high | 1679 | ±14 | 2,184 |
| 28 | gemini-3.8-flash-high | 1583 | ±8 | 8,357 |

### Agent Arena（https://arena.ai/leaderboard/agent ）

Fable 5.1 Max +14.55% → Opus 5.5 High +13.78% → Astra Max +12.18% → GPT-6 Sol Max +10.65% → Opus 5 High +8.76% → Opus 5 Max +8.55% → Fable 5 High +8.37% → **Argon High +7.92%（第 8，3,417 会话，$0.63/任务）**。Arena 自己说这是初步结果。

### Artificial Analysis Intelligence Index（https://artificialanalysis.ai/leaderboards/models ）

| 行 | 模型 | 分数 |
|---|---|---|
| 1 | Claude Opus 5.5 (max) | 58 |
| 2 | Claude Opus 5.5 (xhigh) | 56 |
| 3 | Claude Sonnet 5.5 (max) | 56 |
| 4 | Claude Opus 5.5 (high) | 54 |
| 5–6 | Claude Fable 5.1 (max / xhigh) | 53 |
| 7 | GPT-6 Astra (max) | 53 |
| 8 | **Gemini 4 Argon (high)** | 53 |
| 11 | GPT-6.1 Sol (max) | 52 |

按模型去重：Opus 5.5 → Sonnet 5.5 → Fable 5.1 / Astra / Argon 三家同分。AA 分项（AA 官号帖 https://x.com/ArtificialAnlys/status/2105392630989504675 ）：AutomationBench-AA 77.5% 第 1（Sonnet 5.5 max 71.3%）；Terminal-Bench 4 57%，低于 Sonnet 5.5 64%、Opus 5.5 60%、Astra 59%。跑完指数耗 110M 输出 token，偏啰嗦；每任务成本 $1.99，约为 Astra 的 60%。Coding Index / Agentic Index 的单独数字没抓到。

### Vals Index（https://www.vals.ai/benchmarks/vals_index ）

Argon 68.90% → Sonnet 5.5 67.04% → Opus 5.5 66.97% → Fable 5.1 65.83% → Opus 5 63.67% → Astra 63.13%。标准误约 ±0.9，Argon 领先约 2 个标准误。

### 口碑

- 彭博（经机器之心、APPSO 转述）：Google 内部有人认为 Argon 基准强、实战编程尤其前端不稳；Google 发言人否认。与 WebDev 第 8 的榜单位置吻合。
- 幻觉率：第三方转述 AA-Omniscience 幻觉率 15%，远低于 Opus 5.5 的 59%，但答对率 50% 低于 Opus 5.5 max 的 66%（未在 AA 页面上亲自核到，没写进 patch）。
- 几乎没有独立实测，因为外部用不到。

## 三、定档：S 92

| 对照 | 档 | AA | Text | WebDev | Agent | 可用性 |
|---|---|---|---|---|---|---|
| Opus 5.5 | SSS 98 | 58 | 1504（#4） | 1818（#1） | +13.78%（#2） | 公开 |
| Fable 5.1 | SS 94 | 53 | 1501（#6） | 1751（#4） | +14.55%（#1） | 公开 |
| GPT-6 Astra | SS 94 | 53 | 1478 | 1789（#2） | +12.18%（#3） | 公开 |
| Sonnet 5.5 | S 92 | 56 | 未入榜 | 1709（#5） | — | 公开 |
| **Gemini 4 Argon** | **S 92** | 53 | **1525（#1）** | 1679（#8） | +7.92%（#8） | **仅 Fairwind** |

**不进 SSS 的理由**
- EDITORIAL 明确：没有公开访问的模型不占 SSS。Argon 正是这种情况。
- AA 指数比 Opus 5.5 低 5 分；WebDev 低 139 分；Agent Arena 低近 6 个点；Terminal-Bench 4 也落后。

**支持进 SSS / SS 的证据（如实列出）**
- Text Arena 第 1，且领先幅度超出置信区间，在 Coding、Hard Prompts 等全部分项和各语言都第 1。
- Vals Index 第 1，AutomationBench-AA 第 1，官方 DeepSWE v1.1 SOTA。
- AA 指数与两个现役 SS 同分，价格更低。

**为什么是 S 92 而不是 SS 93**
- 与 Fable 5.1、Astra 的 AA 同分，但两个编程 / Agent 榜（WebDev、Agent Arena）都只到第 8，明显弱于这两家的前 4。
- 外部无法使用，Text 和 Agent 两榜样本都只有三五千。
- 领先的榜（Text Arena、Vals、AutomationBench）偏对话和企业知识工作；落后的榜全是编程与 Agent，正是当前前沿竞争的主战场。
- 与 Sonnet 5.5 同分并列：Sonnet 5.5 的 AA 更高、编程更强且公开可用，Argon 有 Text 第 1 和 Vals 第 1，互有胜负。

公开上线、票数涨上去之后若 Text 第 1 稳住且 WebDev / Agent 回升，升 SS 是合理的下一步。

## 四、对现有条目的处理

1. **`gemini-4-pro` → 删除，新增 `gemini-4-argon`**。不沿用旧 id 的理由：官方名没有 Pro；Google 今后很可能再出真正的 Gemini 4 Pro / Flash，旧 id 会撞名；旧条目的内容（泄露成绩、2M 上下文、$2.25 定价、Barium-B 代号）全部作废，没有可继承的字段。代价是历史曲线上它显示为新增，而不是从 C 70 升上来，对一个刚官宣的模型是合适的。连带需要手改 `src/data/locales/en/google.json` 里的键。
2. **Gemini 3.8 Flash**：档位不动（A 84）。Argon 没公开，3.8 Flash 没被取代，仍是能调用的最强 Gemini。tagline「谷歌现役最强」改为「谷歌公开可用的最强款」，Arena 名次更新为 Text 1494 第 11、WebDev 1583 第 28、Agent +2.96% 第 19。
3. **Gemini 3.1 Pro**：notes 里「Pro 线等 Gemini 4 接班」改写。
4. **需主 agent 手改**（写在 patch 的 `vendorNotes`，apply.mjs 不处理）：
   - vendor blurb 建议：「Gemini 4 Argon 重回第一梯队但仍限量内测，日常主力还是 Flash 和 Omni」
   - tierRationale 里「Gemini 4 Pro 以 S 占位」「LLM 最高只到 A」两句
   - `nano-banana-2-1` 的 highlight「有人推测会和 Gemini 4 Pro 同周发布」已落空
5. 图像、视频类无变化。

## 五、顺带看到、不在本任务范围的榜单变化（供其它 agent / 主 agent 参考，未写进 patch）

- Opus 5.5 的 Text Arena 现为 1504 第 4（3,932 票），库里记的是 1509 第 1；WebDev 1818（库里 1827）；Agent Arena +13.78%（库里 +11.8%）。
- GPT-6 Astra 的 Agent Arena 现为 +12.18%（库里 +10.4%）；WebDev 1789。
- GPT-6.1 Sol 已上榜：AA 52（max）、WebDev 1759 第 3、Vals 61.15%，库里还没有这条。
- Vals Index 上 Opus 5.5 现为 66.97% 第 3，库里记的是 69.69% 第 1，可能是指数版本更新，需要复核。
- Opus 5.5 仍是 AA、WebDev 第 1 和 Agent Arena 第 2，SSS 的依据没有变。

## 六、不确定项

- API model id、正式推理档位清单、知识截止日期：官方未公布。
- 上下文 1M 来自 AA 模型页，官方博客只写了输出上限。
- 公开上线时间未知。
- AA Coding / Agentic 分项和幻觉率数字没有在 AA 页面上亲自核到。
