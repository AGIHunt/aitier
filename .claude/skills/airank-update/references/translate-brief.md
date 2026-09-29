# 英文覆盖层翻译任务

项目：/Users/john/workspace/airank（AI 模型天梯榜，中英双语）。中文是主语言，写在 `src/data/vendors/<vendorId>.json`；英文作为覆盖层写在 `src/data/locales/en/<vendorId>.json`（同名文件）。**不要修改 vendors/ 下的文件。**

## 覆盖层格式

```json
{
  "vendor": { "blurb": "英文版 vendor.blurb（≤90 字符）" },
  "models": {
    "<model id>": {
      "tagline": "英文一句话定位，≤48 字符，有记忆点，像产品 slogan，不要直译腔",
      "highlights": ["与中文 highlights 一一对应、条数相同，每条 ≤90 字符，保留所有数字"],
      "tags": ["与中文 tags 一一对应的英文短标签，1–2 个词，如 Coding / Agents / Reasoning / Open weights / Multimodal / Cheap"],
      "notes": "中文 notes 的英文（中文没有 notes 就省略此字段）",
      "bench": { "<benchmark 的 name 原文>": "该 benchmark 的 note 的英文，如 \"第 2\" → \"#2\"、\"第 11（Max）\" → \"#11 (Max)\"" },
      "pricing": "仅当中文 pricing 含中文字符时提供，如 \"$4 / $20 每百万 token\" → \"$4 / $20 per 1M tokens\"",
      "context": "同上，仅含中文时提供",
      "params": "同上，如 \"117B MoE / 5.1B 激活\" → \"117B MoE / 5.1B active\"",
      "benchName": { "<含中文的 benchmark name 原文>": "英文名" },
      "benchValue": { "<benchmark name 原文>": "仅当 value 含中文时的英文 value" }
    }
  }
}
```

- `bench` 只为**有 note** 的 benchmark 写条目；key 必须与 vendors 文件里 benchmark 的 `name` 完全一致。
- 每个模型 id 都要有条目，一个不漏。
- 英文面向海外 AI 圈读者：地道、简洁、科技媒体口吻（参考 The Verge / Latent Space）。专有名词保持官方写法（Claude Opus 5.5、Seedance 2.5、Artificial Analysis、LMArena）；中国厂商产品用官方英文名（如 豆包 → Doubao，可灵 → Kling，海螺 → Hailuo，通义万相 → Wan）。
- 价格、日期、数字不要改。「开源」→ open weights；「传闻」→ rumored；「预览」→ preview。

## 流程

1. 逐个读你负责的 vendors 文件，写对应的 locales/en 文件（文件大就分两次写：先 Write 前半，再 Edit 追加）。
2. 只翻译新增或中文有改动的条目时，保留该文件里其它已有译文不动。写完运行 `cd /Users/john/workspace/airank && npm run -s validate -- --strict`，把与你负责文件相关的英文缺失项清零。
3. validate 还会提示「中文已改动，英文可能过期」：对照当前中文逐条核对并修正该模型的全部英文字段，确认后运行 `node scripts/i18n-stamp.mjs <modelId ...>` 盖戳（戳记录中文指纹，中文再改会再次提示）。只给你真正核对过的模型盖戳。
4. 最终回复一句话：完成了哪些文件、有无问题。
