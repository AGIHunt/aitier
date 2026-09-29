# AI 模型天梯榜 · 收录任务说明（收录子 agent 必读）

今天是 **{{TODAY}}**。项目：`/Users/john/workspace/airank`，3D「AI 模型天梯榜」网站（SSS/SS/S/A/B/C/D/E 八档）。你负责收录一家（或几家）厂商的模型，或补录新发布的模型。

先运行 `cd /Users/john/workspace/airank && npm run -s report` 看当前天梯，已有模型的定档是你的参照系；再读 `research/EDITORIAL.md`，那是作者的既定判断，**不要推翻**。

⚠️ 你的训练知识很可能落后于今天。一切以检索到的最新资料为准，不要凭记忆补名字、日期、分数。查不到的字段宁可留空/null，也不要编。

## 已知当前格局

由主 agent 在派发时补充（本期新闻线索、需要重点核实的模型）。

## 可用工具

1. **agihunt 站内全文搜索（近 7 天，首选）**：
   ```bash
   cd ~/workspace/mp-skills/shared/material-fetch
   python3 agihunt.py search "<关键词>"          # 返回帖子摘要 + /p /e 链接
   python3 agihunt.py fetch https://agihunt.info/e/<id>      # 事件簇全文（含图片 URL）
   python3 agihunt.py fetch https://agihunt.info/story/<id>  # 事件线专题
   ```
   配额有限，**每个 agent 最多约 25 次 agihunt 调用**，不要并发、不要循环刷。
2. **WebSearch / WebFetch**（用 ToolSearch `select:WebSearch,WebFetch` 加载）：查官方发布页、模型卡、LMArena / Artificial Analysis 榜单、更早的发布（>7 天前的 agihunt 搜不到）。
3. 不要用浏览器（Claude_Browser / chrome）工具——多个 agent 并行会抢同一个浏览器。

## 收录范围

- 三个类别：`llm`（含 VLM、推理模型、编程模型、全模态对话模型）、`image`（文生图/图像编辑）、`video`（文生视频/图生视频/世界模型可放 video）。TTS/音乐等**不收**。
- 每家收**当前仍有意义**的模型：现役旗舰、主力中端/轻量、重要开源权重、重要的上一代（近 ~12–18 个月内、仍被广泛使用或作为对比基准的）。很老的（如 GPT-4、Claude 3）不收。
- 同一模型的推理档位（high/max/xhigh）不拆条，合并成一条，档位写进 notes。
- 每家一般 5–20 条，按实际情况定；大厂多模态多就多收。
- `rumored`（传闻/暗测）模型可以收，但 `status` 标 `rumored`，最多 1–2 条最有热度的。

## 输出

**不要直接改 `src/data/vendors/`**。把结果写成修改方案 `research/runs/{{TODAY}}/<你的名字>.patch.json`（格式见 `scripts/apply.mjs` 顶部注释：`changes` / `add` / `remove` / `benchmarkUpdates` / `vendors`），`add` 里是完整模型对象（字段见下方 schema）。严格 JSON，中文内容用中文。**文件较大时先 Write 前半，再用 Edit 追加，避免一次写太长被截断。**写完用 `python3 -m json.tool <file> > /dev/null` 校验，再用 `node scripts/apply.mjs <file> --dry` 试跑确认 id 都能对上。

```json
{
  "vendor": {
    "id": "openai",                // 小写短 id
    "name": "OpenAI",
    "nameZh": "OpenAI",            // 中文常用名，如「字节跳动」「阿里巴巴·通义」
    "country": "US",               // US / CN / FR / ...
    "color": "#10a37f",            // 品牌主色（hex）
    "accent": "#ffffff",           // 第二色
    "monogram": "O",               // 1–2 个字符，用来画我们自己的徽章（不用官方 logo 图）
    "blurb": "一句话中文介绍这家当前的地位/打法（≤40 字）"
  },
  "models": [
    {
      "id": "gpt-6-astra",                 // 全局唯一：小写-连字符
      "name": "GPT-6 Astra",               // 官方写法
      "category": "llm",                   // llm | image | video
      "family": "GPT-6",
      "released": "2026-09-xx",            // YYYY-MM-DD，只知道月份就 YYYY-MM；未知 null
      "status": "released",                // released | preview | rumored | deprecated
      "openWeights": false,
      "params": null,                      // 如 "320B MoE / 22B 激活"，未知 null
      "context": "1M",                     // llm 的上下文；image/video 可写最高分辨率/时长，如 "4K" "1080p·15s"
      "pricing": "$10 / $50 每百万 token",  // 或 "$0.04/张"、"$0.5/秒"；未知 null
      "tier": "SS",                        // 你的提议：SSS | SS | S | A | B | C | D | E（相对 2026-09 同类别的全球前沿）
      "score": 95,                         // 0–100 同类别综合实力分，与 tier 对齐（见下）
      "tags": ["编程", "Agent", "推理"],    // 2–4 个中文能力标签
      "tagline": "一句话中文定位（≤24 字），要有记忆点",
      "highlights": ["2–4 条中文亮点，每条 ≤40 字，尽量带具体数字"],
      "benchmarks": [
        {"name": "LMArena Text", "value": "1502", "note": "第 2", "source": "https://..."}
      ],
      "notes": "推理档位、争议、口碑等补充（≤80 字，可空）",
      "sources": ["https://官方或可靠来源", "https://agihunt.info/e/..."]
    }
  ],
  "tierRationale": "3–6 句话说明你给这家各模型定档的依据（引用了哪些榜单）"
}
```

### 分档标尺（每个类别内部独立）

| tier | score | 含义 |
|---|---|---|
| SSS | 97–100 | 该类别当前公认第一，全类别最多 1–2 个 |
| SS | 93–96 | 紧贴第一的顶级旗舰 |
| S | 88–92 | 前沿第一梯队 |
| A | 80–87 | 强，接近前沿（主力旗舰/最强开源常在这） |
| B | 72–79 | 能打的中端 / 上一代旗舰 |
| C | 64–71 | 轻量/老一代但仍常用 |
| D | 55–63 | 明显落后 |
| E | <55 | 边缘 |

首期参考过的外部天梯图（`research/tier_ref_jp.png`（本地参考图，未入库），2026-09-28）：SSS Opus 5.5；SS GPT-6 Astra；S Fable 5.1、GPT-6 Sol；A Opus 5、Fable 5、GPT-5.6 Sol、Kimi K3、Grok 4.6、Qwen3.8 Max、GLM-5.3、GPT-6 Luna、Muse Spark 1.3、DeepSeek V4.1 Flash、Hy-4 Preview、Grok 4.7；B GPT-5.6 Terra、Qwen3.8-Flash-Next、GLM-5.3 Flash、Sonnet 5、K2 Horizon；C GPT-5.6 Luna、Grok 4.5、Qwen3.8 27B、Muse Spark 1.2、MiMo V2.5 Pro、Hy-3、MiniMax M3；D Inkling、Nemotron 3 Ultra、Muse Glimmer；E Haiku 4.5、Mistral Medium 3.5、Nemotron 3.5 Lightning。这是个人向图，带玩梗成分，**作为参照而非真理**——要结合榜单数据独立判断；它没收录的新模型（如 Sonnet 5.5、Kimi K3.1、M3.1）你来补。图像/视频类要自己按 LMArena / Artificial Analysis 的图像、视频榜定档。

## 最终回复

写完文件后，回复一段 ≤200 字的中文摘要：收了几条、各类别最高档是谁、哪些字段/事实不确定。不要把 JSON 全文贴回来。
