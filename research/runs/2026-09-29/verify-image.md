# 图像类（image）天梯复核

复核日期：2026-09-29。机器可读方案见 `research/recal/image.json`。

## 1. 主要榜单现状

抓取日期均为 2026-09-29（WebFetch）。

- LMArena 文生图：https://arena.ai/leaderboard/text-to-image（页面标注 2026-09-24 更新，总票数 647.9 万）
- LMArena 图像编辑：https://arena.ai/leaderboard/image-edit（页面标注 2026-09-21 更新）
- AA 文生图：https://artificialanalysis.ai/image/leaderboard/text-to-image
- AA 图像编辑：https://artificialanalysis.ai/image/leaderboard/editing

### 文生图

| # | LMArena 文生图 | 分数 | AA 文生图 | Elo |
|---|---|---|---|---|
| 1 | gpt-image-2.5-sunburst | 1424 | GPT Image 2.5 Sunburst (max) | 1195 |
| 2 | gpt-image-2.5-flare | 1401 | GPT Image 2.5 Flare (max) | 1189 |
| 3 | gpt-image-2 (medium) | 1383 | GPT Image 2 (high) | 1171 |
| 4 | mai-image-2.6 | 1335 | Grok Imagine Image 2.0 | 1154 |
| 5 | reve-2.1 | 1302 | MAI-Image-2.6 | 1148 |
| 6 | grok-imagine-image-2.0 (low) | 1301 | Nano Banana 2 | 1124 |
| 7 | muse-image | 1276 | Muse Image | 1111 |
| 8 | reve-2.0 | 1269 | GPT Image 1.5 (high) | 1105 |
| 9 | nano-banana-2 [web-search] | 1261 | MAI-Image-2.6-Flash | 1103 |
| 10 | seedream-5.0-pro | 1256 | MAI-Image-2.5 | 1103 |
| 11 | **qwen-image-3.0-pro**（未收录） | 1256 | Nano Banana Pro | 1100 |
| 12 | mai-image-2.5 | 1254 | MAI-Image-2.5-Pro | 1099 |
| 13 | nano-banana-2-lite | 1250 | Nano Banana 2 Lite | 1094 |
| 14 | nano-banana-pro (2k) | 1247 | **Qwen-Image-3.0-Pro**（未收录） | 1088 |
| 15 | gpt-image-1.5-high-fidelity | 1238 | Seedream 5.0 Pro | 1080 |

LMArena 16–20：nano-banana-pro-preview 1234、qwen-image-2.1 1228、ideogram-4.0-quality 1205、qwen-image-2.0-pro 1192、Luma uni-1.1-max 1189。
AA 16–20：Qwen-Image-3.0 1074、grok-imagine-image-quality 1046、Qwen-Image-2.1 1034、MAI-Image-2.5-Flash 1033、Qwen Image 2.0 Pro 1030。
AA 上 Reve 只有旧版 Reve Image (Halfmoon)，排第 95；Midjourney 只有 V7 Alpha（第 112）、V6/V6.1。Ideogram 4.0 (Quality) 在 AA 排第 35。

### 图像编辑

| # | LMArena 图像编辑 | 分数 | AA 图像编辑 | Elo |
|---|---|---|---|---|
| 1 | gpt-image-2.5-sunburst | 1526 | GPT Image 2.5 Sunburst (max) | 1181 |
| 2 | gpt-image-2.5-flare | 1482 | GPT Image 2.5 Flare (max) | 1161 |
| 3 | gpt-image-2 (medium) | 1461 | MAI-Image-2.6 | 1135 |
| 4 | grok-imagine-image-2.0 (low) | 1430 | MAI-Image-2.6-Flash | 1124 |
| 5 | mai-image-2.6 | 1429 | GPT Image 2 (high) | 1122 |
| 6 | muse-image | 1402 | Muse Image | 1117 |
| 7 | mai-image-2.5 | 1400 | MAI-Image-2.5 | 1113 |
| 8 | seedream-5.0-pro | 1394 | Nano Banana 2 | 1108 |
| 9 | nano-banana-pro (2k) | 1390 | Grok Imagine Image 2.0 | 1106 |
| 10 | grok-imagine-image-quality | 1390 | MAI-Image-2.5-Pro | 1106 |
| 11 | chatgpt-image-latest-hf (=GPT-Image-1.5) | 1388 | Seedream 5.0 Pro | 1106 |
| 12 | nano-banana-2 [web-search] | 1388 | GPT Image 1.5 (high) | 1102 |
| 13 | nano-banana-pro-preview | 1385 | Nano Banana Pro | 1099 |
| 14 | reve-2.1 | 1375 | **HunyuanImage 3.5 (Preview)** | 1090 |
| 15 | gpt-image-1.5-high-fidelity | 1370 | MAI-Image-2.5-Flash | 1087 |

LMArena 16–20：qwen-image-2.1 1367、reve-2.0 1358、uni-1.1-max 1334、grok-imagine-image 1329、uni-1.1 1315。
AA 16–20：grok-imagine-image-quality 1083、Qwen-Image-3.0-Pro 1077、Qwen-Image-2.1 1072、grok-imagine-image 1068、Luma UNI 1 Max 1067。

## 2. 核对结论

- **GPT-Image-2.5 Sunburst / Flare 真实存在**：OpenAI 9/8 发布 ChatGPT Images 2.5，API 同时上线 `gpt-image-2.5-sunburst`（高端精修档）和 `gpt-image-2.5-flare`（默认档，延迟比 GPT-Image-2 低 50%），fal、MindStudio 等第三方已接入（https://openai.com/index/introducing-chatgpt-images-2-5/ 、https://fal.ai/gpt-image-2.5 ）。
- **「双榜第一」属实，而且是四榜第一**：Sunburst 在 LMArena 文生图、LMArena 编辑、AA 文生图、AA 编辑全部第 1，Flare 四榜全部第 2。LMArena 样本 1.0–2.9 万票，AA 1.3–1.8 万，不是小样本。OpenAI 三款模型包揽 LMArena 两榜和 AA 文生图前三。
- 口碑有杂音但不改变结论：Reddit 吐槽噪点伪影半年未修、审查过严（agihunt e/1a0d31bc479c62228f758c48e18、e/1a0ead84d829fe5a76de1a17079）；同时它已成为 Seedance 2.5 首帧、Codex 自动造数据集等工作流的默认图像模型。
- 其余 S 档候选均亲眼在榜上核对：MAI-Image-2.6（Foundry public preview，可公开调用）、Grok Imagine Image 2.0、Muse Image、Reve 2.1 均存在且名次与原数据一致。
- **Nano Banana 2.1 仍未发布**：截至 9/29 只有 TestingCatalog 在 Flow 构建里看到的命名痕迹，外加「或与 Gemini 4 Pro 同周」的传闻，没有实测。
- **Midjourney V8.2 已发布但不上榜**：LMArena、AA 都没收 V8.x，定档只能靠口碑。

## 3. 双向对比发现的问题

正向（我们排得偏高或证据单边）：
1. **Reve 2.1（S 89）证据单边**：LMArena 文生图第 5，但编辑只排第 14，AA 完全没收。降到 S 档底部 88，排在 Muse 之后。
2. **Nano Banana 2.1（A 84，rumored）**：只有代码痕迹，却按 NB2 分数占位。按规则降到 C 64，发布后重评。
3. **Midjourney V8.2（B 76）**：没有任何盲测数据，却压过有榜单证据的 Qwen-Image-2.1。降到 B 74。

反向（榜上排得高，我们漏收或排低）：
4. **漏收 Qwen-Image-3.0-Pro**：LMArena 文生图第 11（1256，和 Seedream 5.0 Pro 同分），AA 文生图第 14、编辑第 17。7/21 发布，闭源 API。新增为 A 83，同时补收标准版 Qwen-Image-3.0（AA 文生图第 16），定 B 78。
5. **GPT-Image-1.5 严重偏低**（B 74）：AA 文生图第 8，高于 Seedream 5.0 Pro 和 Nano Banana Pro；两个 LMArena 榜第 15，ChatGPT 版编辑第 11。上调到 A 81。
6. **Muse Image 偏低**（A 86）：四榜都在第 6–7，比 Reve 2.1 更稳。升到 S 89。
7. **GPT-Image-2 应进 SS**：四榜中三榜第 3，领先外家第一名 30–50 分，样本量最大。
8. **Hy Image 3.5 Preview 标注过时**：原记「未进榜」，现在已上 AA 编辑榜第 14（1090），高于 Qwen-Image-3.0-Pro。C 70 升到 B 76。
9. **Grok Imagine Image（1.x 合并条目）偏低**：quality 版在 LMArena 编辑第 10、AA 编辑第 16、AA 文生图第 17。C 69 升到 B 75。
10. **Nano Banana 2 在 AA 上被低估**：AA 文生图第 6，是谷歌最强、高于 Muse 和 Seedream。升到 A 86，排 A 档头部。

两个榜单打架的地方：
- **Reve**：LMArena 文生图第 5，AA 没收 → 只按 LMArena 定档，打折处理。
- **MAI-Image-2.6-Flash**：AA 编辑第 4，没上 LMArena → 单榜证据，放 A 84。
- **Nano Banana 2**：AA 第 6，LMArena 第 9/12 → 两边取中。
- **Seedream 5.0 Pro**：LMArena 编辑第 8，AA 文生图第 15 → 综合下来和 Nano Banana Pro 打平。

相对位置结论（作者关心的几家）：
- OpenAI 三款明显领先所有外家。
- 外家第一梯队依次是 MAI-Image-2.6 ≈ Grok Imagine 2.0 > Muse > Reve 2.1。
- 第二梯队依次是 Nano Banana 2 > MAI-Image-2.5 > Seedream 5.0 Pro ≈ Nano Banana Pro ≈ MAI-2.6-Flash > Qwen-Image-3.0-Pro。
- 开源最强仍是 Qwen-Image-2.1（B 77）。Midjourney 没有榜单可比。

其它问题：
- **Qwen-Image-2.1 Edit 与 Qwen-Image-2.1 重复**：两者是同一个一体模型，LMArena 两榜同名。建议删掉 Edit 条目，编辑成绩并入主条目。
- **未收录的第三方厂商**（没有厂商文件，暂不 add，按需决定是否建厂商）：
  - Ideogram 4.0 Quality：LMArena 文生图第 18
  - Luma Uni-1.1 Max：LMArena 编辑第 18、AA 编辑第 20
  - Krea 2 Large：AA 文生图第 24
  - Recraft V4.1
  - 商汤 SenseNova U1 Pro：SuperCLUE-Image 中文榜第 1，未上国际榜
  - 这几家都在前 15 之外，不影响 S 档以上。
- 阿里 wan2.7-image-pro 在 LMArena 编辑排第 24，未收，影响小。

## 4. 建议的新天梯

- **SSS**
  - GPT-Image-2.5 Sunburst 98
- **SS**
  - GPT-Image-2.5 Flare 96
  - GPT-Image-2 93
- **S**
  - MAI-Image-2.6 92（preview）
  - Grok Imagine Image 2.0 91
  - Muse Image 89
  - Reve 2.1 88
- **A**
  - Nano Banana 2 86
  - MAI-Image-2.5 85
  - Seedream 5.0 Pro 84
  - Nano Banana Pro 84
  - MAI-Image-2.6-Flash 84（preview）
  - Qwen-Image-3.0-Pro 83（新增）
  - Reve 2.0 82
  - MAI-Image-2.5-Pro 82
  - GPT-Image-1.5 81
- **B**
  - Nano Banana 2 Lite 79
  - Qwen-Image-3.0 78（新增）
  - Qwen-Image-2.1 77
  - Hy Image 3.5 Preview 76
  - Grok Imagine Image 75
  - MAI-Image-2.5-Flash 75
  - Midjourney V8.2 74
- **C**（未列出的保持原档）
  - MAI-Image-2 70
  - Qwen-Image-2.0 70
  - FLUX.2 [max] 68
  - Seedream 4.5 67
  - Nano Banana / HiDream-O1-Image-1.5 / HunyuanImage 3.0 66
  - Seedream 5.0 Lite 65
  - Kling Image 3.0 64
  - Nano Banana 2.1 64（rumored 占位）
- **D / E**：不变

仍不确定：
- Flare 与 Sunburst 在 AA 文生图只差 6 Elo，也可以考虑并列 SSS；这里按编辑榜 20–44 分的差距，不并列。
- Midjourney 缺少盲测数据，74 分是估计。
- MAI-Image-2.6 如果转 GA 且进入 Copilot，可以考虑上 SS 93。
