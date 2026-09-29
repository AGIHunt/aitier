# 天梯榜复核任务（给复核子 agent）

今天 2026-09-29。首期天梯榜由各厂商 agent 分头收录，每家自己定档，跨厂商没有统一对齐，出了明显问题：视频类把 **Gemini Omni 1.1 Flash** 放在 SSS，而作者（资深从业者）认为 **Seedance 2.5** 显然是当前最强的视频模型。你的任务是对一个类别做**跨厂商复核**，给出有证据的调档方案。

⚠️ 你的训练知识停在更早的时候，当前世界已有 GPT-6、Claude Opus 5.5 等。一切以当下检索到的资料为准；但也要警惕「检索摘要里出现的模型名不一定真实存在」——首期里有 agent 可能把错误的名字当成了真模型。**每个 S 档及以上的模型，都要确认它真实存在、已公开可用（或明确是 preview），并且榜单名次是你亲眼在榜单页 / 可靠报道里看到的。**

## 输入

- 当前排名：`research/recal/current_<category>.txt`（每行：tier score [vendor] id | name | status | released | benchmarks）
- 原始数据：`src/data/vendors/*.json`（只读，不要改）
- 参照：`research/tier_ref_jp.png`（网友天梯图，只覆盖 LLM）

## 数据源（双向对比，任何单一来源都不是权威）

1. **Artificial Analysis**（artificialanalysis.ai）：LLM 看 Intelligence Index 及其分项（Coding Index、Agentic Index 等）；图像看 Text-to-Image Arena、Image Editing Arena；视频看 Text-to-Video、Image-to-Video Arena（有无音频两个口径都看）。
2. **LMArena / Arena**（lmarena.ai 或 arena.ai）：Text、WebDev、Vision、Text-to-Image、Image Edit、Text-to-Video、Image-to-Video。
3. 其它：Agent Arena、SWE-bench / Terminal-Bench、Vals AI、OpenRouter 用量；视频/图像还可看 Video Arena 类第三方榜。
4. **agihunt 站内搜索（近 7 天的口碑和实测）**：
   ```bash
   cd ~/workspace/mp-skills/shared/material-fetch
   python3 agihunt.py search "<关键词>"
   python3 agihunt.py fetch https://agihunt.info/e/<id>
   ```
   最多 20 次调用，不要并发。
5. WebSearch / WebFetch（先用 ToolSearch `select:WebSearch,WebFetch` 加载）。**不要用浏览器工具**。

「双向」的意思：
- 正向：我们排得高的，去榜上核对是不是真的高；
- 反向：榜上排得高的，检查我们有没有收、是不是排低了；
- 两个榜单打架时（AA 高 LMArena 低或反之），说清楚分歧，给出你的综合判断和理由（考虑样本量、口径差异如有无音频、是否 preview 不可用、社区实测口碑）。

## 定档原则

- 档位是**同类别内相对 2026-09 全球前沿**的综合实力。SSS 全类别只能 1 个（最多 2 个并列），SS 1–3 个，S 3–7 个。
- score 与 tier 对齐：SSS 97–100 · SS 93–96 · S 88–92 · A 80–87 · B 72–79 · C 64–71 · D 55–63 · E <55。
- 仅 preview、无公开访问的模型不宜占 SSS；`rumored` 模型最高只能到它最可信的证据所支持的位置，没有硬证据就放到 B 以下或建议删除。
- 已退役（deprecated）的模型档位按其当时实力，但不应压过现役同代强者。

## 输出

1. `research/recal/<category>.md`：报告。包括：
   - 一张「主要榜单现状」表：AA 和 LMArena 前 15 名（模型、分数、名次），注明抓取日期和 URL
   - 核对结论：哪些模型是否真实存在 / 名次是否属实
   - 双向对比发现的问题清单
   - 建议的新天梯（按档列出）
2. `research/recal/<category>.json`：机器可读的修改方案（我会据此改数据）：
   ```json
   {
     "changes": [{"id": "gemini-omni-1-1-flash", "tier": "S", "score": 90, "reason": "一句话理由", "evidence": ["url"]}],
     "remove": [{"id": "...", "reason": "不存在 / 无证据"}],
     "add": [{"vendorId": "bytedance", "model": { /* 完整模型对象，字段同 src/data/vendors/*.json */ }}],
     "benchmarkUpdates": [{"id": "...", "benchmarks": [ /* 替换后的完整 benchmarks 数组 */ ]}]
   }
   ```
   只列需要改的；`add` 的 vendorId 必须是已存在的厂商文件名（不含 .json），确实需要新厂商就在报告里说明。

最终回复 ≤250 字中文摘要：最关键的 3–5 处调整、SSS/SS 是谁、仍不确定的地方。
