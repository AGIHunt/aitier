# LLM 类别跨厂商复核（2026-09-29）

复核对象：`current_llm.txt` 共 93 个模型（其中 rumored 9 个、preview 5 个；任务描述里的「12 条 rumored」与数据不符，实际 rumored 为 9 条）。
修改方案见同目录 `llm.json`（changes 15 条 / remove 7 条 / benchmarkUpdates 15 条 / add 0 条）。

## 一、主要榜单现状（2026-09-29 抓取）

### Artificial Analysis Intelligence Index（按模型去重，取最高档位）

来源：https://artificialanalysis.ai/leaderboards/models（页面内嵌数据直接解析，共 679 行）

| 去重名次 | 模型（最佳档位） | 指数 | 原始行名次 | 备注 |
|---|---|---|---|---|
| 1 | Claude Opus 5.5 (max) | 57.6 | 1 | |
| 2 | Claude Sonnet 5.5 (max) | 56.0 | 3 | 9/28 刚发布 |
| 3 | Claude Fable 5.1 (max) | 53.4 | 5 | |
| 4 | GPT-6 Astra (max) | 52.7 | 7 | |
| 5 | Claude Opus 5 (max) | 50.8 | 13 | AA 标记已被取代 |
| 6 | Claude Fable 5 (max) | 49.6 | 15 | AA 标记已被取代 |
| 7 | Muse Spark 1.3 (max) | 48.1 | 19 | |
| 8 | GPT-6 Sol (max) | 47.5 | 20 | |
| 9 | GPT-5.6 Sol (max) | 47.0 | 21 | AA 标记已被取代 |
| 10 | Grok 4.7 (xhigh) | 46.4 | 24 | |
| 11 | MiMo-V2.6-Pro | 46.3 | 26 | 开源权重第 1 |
| 12 | Qwen3.8 Max (0902) | 45.4 | 28 | |
| 13 | GLM-5.3 (max) | 44.8 | 31 | |
| 14 | Grok 4.6 (high) | 44.3 | 32 | |
| 15 | Step 5 Preview（阶跃星辰） | 43.7 | 36 | **我们未收录** |
| 16 | Kimi K3 (max) | 43.6 | 37 | |

AA 的 Coding / Agentic 口径：现版 AA 首页已改为 **Coding Agent Index**（DeepSWE v1.1 + SWE-Atlas-QnA + Terminal-Bench v4 三项均值，按「agent 框架 + 模型」计），来源 https://artificialanalysis.ai/#coding-agents 。旧的 Coding Index / Agentic Index 页面现在返回 404。Agentic 方面用 GDPval-AA 和 Terminal-Bench 4.0 分项代替。

| 名次 | Coding Agent Index | 分数 | 同行的 GDPval-AA（归一化） |
|---|---|---|---|
| 1 | Claude Code – Sonnet 5.5 (max) | 68.4 | 67.2 |
| 2 | Claude Code – Opus 5.5 (max) | 66.0 | 67.3 |
| 3 | Claude Code – Sonnet 5.5 (xhigh) | 62.9 | 61.2 |
| 4 | Claude Code – Fable 5.1 (max) | 62.2 | 61.7 |
| 6 | Codex – GPT-6 Astra (max) | 61.6 | 52.1 |
| 7 | Claude Code – Opus 5 (max) | 59.7 | 60.4 |
| 9 | Codex – GPT-6 Sol (max) | 56.7 | 49.3 |
| 10 | Grok Build – Grok 4.7 (xhigh) | 56.3 | 59.8 |
| 13 | Muse Code – Muse Spark 1.3 (max) | 54.3 | 58.7 |
| 14 | Opencode – GLM-5.3 (max) | 53.6 | 57.2 |
| 15 | Kimi Code – Kimi K3 | 51.9 | 51.2 |
| 19 | Claude Code – Qwen3.8 Max | 43.3 | 54.8 |
| 23 | Antigravity – Gemini 3.8 Flash (high) | 41.9 | 45.6 |

### LMArena（arena.ai）Text 与 Code（WebDev）前 16

来源：https://arena.ai/leaderboard/text 、https://arena.ai/leaderboard/code （Code Arena 的 overall 即 WebDev 口径；/leaderboard/webdev 现在是空页）

| # | Text 模型 | 分数 | 票数 | # | Code / WebDev 模型 | 分数 | 票数 |
|---|---|---|---|---|---|---|---|
| 1 | claude-opus-5.5-high | 1509 | 2,307（名次区间 1–10） | 1 | claude-opus-5.5-max | 1827 | 1,607 |
| 2 | claude-opus-4-6-high | 1505 | 76,518 | 2 | gpt-6-astra-max | 1792 | 4,908 |
| 3 | claude-fable-5-high | 1504 | 36,462 | 3 | claude-fable-5.1-max | 1751 | 5,313 |
| 4 | claude-opus-4-7-high | 1502 | 64,007 | 4 | claude-opus-5-max | 1693 | 15,627 |
| 5 | claude-fable-5.1-max | 1501 | 9,942 | 5 | gpt-6-sol-max | 1681 | 2,019 |
| 6 | claude-opus-4-6 | 1498 | 80,836 | 6 | qwen3.8-max | 1672 | 3,469 |
| 7 | muse-spark-1.2 (xHigh) | 1496 | 3,422 | 7 | claude-opus-5-high | 1662 | 18,930 |
| 8 | claude-opus-4-7 | 1495 | 65,051 | 8 | qwen3.8-max-0902 | 1662 | 6,203 |
| 9 | muse-spark-1.3-max | 1494 | 10,036 | 9 | kimi-k3-max | 1660 | 14,739 |
| 10 | gemini-3.8-flash-high | 1492 | 21,728 | 10 | muse-spark-1.3-max | 1656 | 5,945 |
| 11 | claude-opus-5-high | 1491 | 55,063 | 11 | qwen3.8-flash-next | 1636 | 4,980 |
| 12 | muse-spark-1.1 | 1491 | 34,760 | 12 | **hy4-preview** | 1631 | 4,954 |
| 13 | muse-spark | 1489 | 14,131 | 13 | grok-4.7-xhigh | 1629 | 2,047 |
| 14 | claude-opus-5-max | 1488 | 26,760 | 14 | claude-fable-5-high | 1627 | 13,086 |
| 15 | gemini-3.7-flash-high | 1488 | 19,044 | 15 | muse-spark-1.3 (xHigh) | 1626 | 5,043 |
| 16 | kimi-k3-max | 1488 | 26,400 | 16 | deepseek-v4.1-flash-max | 1621 | 3,815 |

Text 榜其余相关名次：GPT-6 Astra 第 26（1478）、GPT-6 Sol 第 60（1457）、GPT-6 Luna 第 86、Grok 4.7 第 92（1439）、MiMo-V2.6-Pro 第 23、GLM-5.3 第 24、Qwen3.8 Max 第 25、DeepSeek V4.1 Flash 第 29。Sonnet 5.5 和 Hy4 Preview 还没进 Text 榜。

### Arena Agent 榜（辅助）

来源：https://arena.ai/leaderboard/agent

1 Fable 5.1 Max +14.1% · 2 Opus 5.5 High +11.8% · 3 GPT-6 Astra Max +10.4% · 4 Opus 5 Max +9.5% · 5 Opus 5 High · 6 GPT-6 Sol Max +8.8% · 7 Fable 5 · 8 Opus 4.8 · 9 GPT-5.6 Sol · 10 Sonnet 5 · 11 GPT-5.5 · **12 Hy4 Preview +4.1%** · 13 Kimi K3 · 14 Grok 4.7 · 15 DeepSeek V4.1 Flash · 16 GLM-5.2 · 17 Muse Spark 1.3 · 18 Gemini 3.8 Flash · 19 GLM-5.3 · 20 Qwen3.8 Max。

## 二、真实性与名次核对

| 模型 | 结论 |
|---|---|
| Opus 5.5（SSS） | 存在，已公开可用。AA 第 1、Text 第 1、Code 第 1 都属实。需要注意的是：Text 只有 2,307 票，统计上名次区间是 1–10，和 Opus 4.6 / Fable 5 属于并列第一集团。Code Arena 现为 1827（原数据写的是 1818）。Agent Arena 第 2。 |
| GPT-6 Astra（SS） | 存在，可用。AA 52.7 按模型去重排第 4（原注「全榜第 7」是按行算的）、Code 第 2、Agent 第 3，均属实。Text 第 26 属实。 |
| Fable 5.1 | 存在，可用。AA 53.4、Text 第 5、Code 第 3、Agent 第 1 均属实。 |
| Mythos 5.1 | 存在，但官方原话是 Fable 5.1 和 Mythos 5.1「是同一模型，只是护栏等级不同」（https://www.anthropic.com/claude-fable-and-mythos-5-1）。Mythos 只通过 Cyber / Life Sciences 验证计划开放给美国机构。**应合并**。 |
| Sonnet 5.5 | 9/28 发布，存在。AA 56.0 第 2、Coding Agent Index 第 1 属实。LMArena 和 Agent Arena 都还没有它的数据。社区口碑两极：有人说它强过 Opus 5.5，bindureddy 等人说它在 max 档空转、不如 Terra。 |
| GPT-6 Sol | 存在。AA 47.5、Code 第 5、Text 第 60 属实。 |
| Hy4 Preview | 存在，已开源并上架 OpenRouter。原数据说「未见 LMArena 成绩」**不对**：它在 Code Arena 排第 12（1631），Agent Arena 排第 12。AA 暂无成绩。 |
| MiMo-V2.6-Pro / GLM-5.3 / Qwen3.8 Max / Kimi K3 / Grok 4.7 / DeepSeek V4.1 Flash / Muse Spark 1.3 / Gemini 3.8 Flash | 均存在，AA 与 Arena 数值和原数据一致（小数四舍五入的差别不计）。 |
| GPT-6.1 Astra（rumored，原 SS） | WSJ / The Decoder 9/29 报道：因欺骗和越权问题，**取消** 10 月上线，没有任何分数。 |
| Gemini 4 Pro（rumored，原 S） | DeepMind SVP 确认过「年底前发布 Gemini 4」。Arena 上出现的匿名 checkpoint 身份未证实（也有说法认为它挂的是 3.8 Flash 的名字），泄露跑分同样未证实。有「Gemini 4 远低于 SOTA」的反向爆料，也有 10/1 发布的传闻。 |
| Fable 5.5 | 只有 Slack 梗图和 YouTube「泄露」标题，没有官方信息。 |
| Kimi K3.1 | 只有「官方暗示」的二手转述，且多次跳票。 |
| DeepSeek-V4.1-Pro | 官方公告写了「V4.1-Pro 上线前……」，存在性可信，但没有任何分数。 |
| Grok 4.8 | 只有 Cursor commit 泄露的模型名。 |
| Doubao-Seed-2.2 | 只有「已延期」的报道。 |
| MiniMax M3.1 | 「Space Bunny」已被多家媒体对应到 9/28 公测的 M3.1-Flash-Preview（已单独收录）。完整版 M3.1 没有官方信息。 |
| Haiku 5.5 | Sonnet 5.5 发布页原话写明它将在「coming weeks」加入 5.5 家族，存在性可信，没有分数。 |

## 三、双向对比发现的问题

**正向（我们排得高，榜上是否也高）**
1. **GPT-6.1 Astra 挂在 SS 93**：模型已被取消、没有分数，属于首期最严重的错误。建议删除。
2. **Gemini 4 Pro 挂在 S 91**：全部依据是泄露信息。建议降到 C 70 占位，发布后重评。
3. **Fable 5.5 挂在 S 90**：没有证据。建议删除。
4. **GPT-6 Sol（S 90）排在 Opus 5（A 86）之上**：数据方向正好相反。Opus 5 的 AA（50.8 vs 47.5）、Code Arena（1693 vs 1681）、Agent Arena（第 4 vs 第 6）、Text（第 11 vs 第 60）、Coding Agent Index（59.7 vs 56.7）五项全部领先 Sol。

**反向（榜上排得高，我们是否漏了或排低了）**
5. **Fable 5.1 被低估**。和 Astra 对比：AA 略高（53.4 vs 52.7）、Text 高很多（第 5 vs 第 26）、Agent Arena 第 1 vs 第 3、GDPval 61.7 vs 52.1、Coding Agent Index 62.2 vs 61.6。Astra 只在 Code Arena（1792 vs 1751）和 AA 的 Terminal-Bench 4（59.1 vs 52.0）上领先。两者应同档。
6. **Hy4 Preview 被低估**：Code Arena 和 Agent Arena 都排第 12，是国产模型里 Agent 表现最好的一个。原来的 A 82 偏低。
7. **漏收**：
   - **Step 5 Preview（阶跃星辰）**：AA 43.7，与 Kimi K3 并列；Code Arena 第 29（1565）；有社区实测。需要新建 `stepfun` 厂商文件，建议 A 80，状态 preview。
   - **Claude Opus 4.7**：Text 第 4（1502，6.4 万票），AA 40.7（估算），已被取代。可补收到 B 76，但发布日期和价格没核实，这次没有放进 add。
   - **K2 Horizon 375B（MBZUAI-IFM）**：AA 30.5，日本天梯图放在 B。数据上应在 C，需要新厂商。
   - **ERNIE 5.1（百度）**：Text 第 45（1468），需要新厂商，档位约 C。
   - Nemotron 3 Ultra（AA 22.9）、Inkling（AA 25.0）在 D 档附近，影响不大。

**榜单打架**
8. **Sonnet 5.5：AA 高，Arena 还没有数据**。AA 智能指数第 2、Coding Agent Index 第 1，但只有 AA 单一来源，AA 也提示它 token 消耗极高，发布 1 天社区口碑两极。**维持 S 92**，列为升 SS 的候选：等 Arena Text / Code 入榜后，如果能进前 5，就升 SS 93–94。
9. **GPT-6 Astra：Code 强，Text 弱**（Code 第 2，Text 第 26）。Text 榜偏向对话风格，Astra 的强项在 Agent 和编程，所以不因 Text 名次降档。
10. **Opus 5.5 的 Text 第 1 样本量太小**（2,307 票）。但它同时是 AA 第 1、Code 第 1（领先 35 分，置信区间不重叠）、Agent 第 2，SSS 仍然成立。
11. **Grok 4.7：AA 高，Text 低**。AA 46.4、Coding Agent Index 56.3 都不错，但 Text 第 92，维持 A 84。
12. **Gemini 3.8 Flash：Text 高，Code 和 AA 一般**。Text 第 10，但 Code Arena 第 28、AA 40.9、Agent 第 18。A 84 偏宽松，但它和 DeepSeek V4.1 Flash（A 83）互有胜负，维持不变。

## 四、建议的新天梯（LLM）

- **SSS**：Claude Opus 5.5（98）
- **SS**：Claude Fable 5.1（94，↑ 自 S 91）、GPT-6 Astra（94，↓1）
- **S**：Claude Sonnet 5.5（92，SS 候选）、Claude Opus 5（89，↑ 自 A 86）、GPT-6 Sol（88，↓2）
- **A**：Claude Fable 5（87）、Muse Spark 1.3（87）、Kimi K3（86）、Qwen3.8 Max（85）、GLM-5.3（85）、MiMo-V2.6-Pro（85）、GPT-5.6 Sol（85）、Gemini 3.8 Flash（84）、Grok 4.7（84）、Hy4 Preview（84，↑2）、DeepSeek V4.1 Flash（83）、Grok 4.6（81）
- **B**：GPT-6 Luna、GLM-5.3-Flash（79），Opus 4.8（78，↑2）、Qwen3.8-Flash-Next、Gemini 3.7 Flash、MiMo-V2.6-Flash、Mythos Preview（78）……（其余不变）
- **C 占位（rumored，保留）**：Gemini 4 Pro（70）、DeepSeek-V4.1-Pro（70）、Haiku 5.5（70，不变）
- **删除**：Mythos 5.1（并入 Fable 5.1）、GPT-6.1 Astra、Fable 5.5、Kimi K3.1、Grok 4.8、Doubao-Seed-2.2、MiniMax M3.1

C 档及以下除上面列出的条目外没有变动。

## 五、仍不确定的地方

- **OpenAI DevDay 今天（9/29）召开**，官方预告有 20+ 项发布，可能包括常驻 Agent「O」或 Astra 更新。本次抓取时还没有结果，会后需要补查。
- **Gemini 4 Pro** 有 10/1 发布的传闻，一旦发布需要立刻重评，可能直接冲进 SS。
- **Sonnet 5.5** 的 Arena 成绩预计 1–2 周内出来，届时决定是否升 SS。
- AA 把 Opus 5 / Fable 5 / GPT-5.6 Sol / Opus 4.8 标为 deprecated，意思是「已被新版取代」，不代表 API 已下线。本方案按「现役但已被取代」处理，没有改 status 字段。
