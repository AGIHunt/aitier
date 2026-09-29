# 视频类复核报告（2026-09-29）

复核范围：`research/recal/current_video.txt` 全部 32 个视频模型，重点是 Gemini Omni 1.1 Flash / Gemini Omni Flash、Seedance 2.5、Wan3.0、MiniMax H3、FLUX 3 Video、Kling 4.0 和 Veo 系列。

抓取方式：Arena 和 AA 两边都是用 curl 下载页面原始 HTML，再从内嵌 JSON 里解析出分数、置信区间和票数，没有经过摘要模型转述。

## 一、主要榜单现状

### 1. Arena（原 LMArena）Text-to-Video
来源 https://arena.ai/leaderboard/text-to-video ，页面标注更新于 2026-09-21，共 718,577 票、48 个模型，抓取于 2026-09-29。「名次区间」是 Arena 按置信区间给出的 rankUpper–rankLower。

| # | 模型 | 分数 | ±CI | 票数 | 名次区间 |
|---|---|---|---|---|---|
| 1 | gemini-omni-1.1-flash | 1516 | 15 | 1,784 | 1–4 |
| 2 | gemini-omni-flash | 1513 | 9 | 26,576 | 1–4 |
| 3 | flux-3-video（标 pre_release） | 1493 | 17 | 1,302 | 1–7 |
| 4 | grok-imagine-video-1.5-agent | 1492 | 18 | 1,218 | 1–7 |
| 5 | dreamina-seedance-2.0-720p | 1479 | 8 | 56,318 | 3–7 |
| 6 | wan3.0 | 1476 | 13 | 2,598 | 3–9 |
| 7 | dreamina-seedance-2.5-720p | 1474 | 9 | 8,001 | 3–9 |
| 8 | minimax-h3 | 1460 | 9 | 11,417 | 6–9 |
| 9 | muse-video | 1456 | 15 | 2,188 | 6–9 |
| 10 | happyhorse-1.0 | 1427 | 13 | 22,264 | 10 |
| 11 | sora-2-pro | 1368 | 7 | 54,167 | 11–15 |
| 12 | veo-3.1-audio | 1364 | 14 | 13,741 | 11–17 |
| 13 | veo-3.1-audio-1080p | 1362 | 10 | 25,076 | 11–17 |
| 14 | veo-3.1-fast-audio | 1362 | 10 | 39,484 | 11–17 |
| 15 | veo-3.1-fast-audio-1080p | 1358 | 10 | 25,870 | 11–19 |

### 2. Arena Image-to-Video
来源 https://arena.ai/leaderboard/image-to-video ，更新于 2026-09-21，共 2,081,953 票。

| # | 模型 | 分数 | ±CI | 票数 | 名次区间 |
|---|---|---|---|---|---|
| 1 | minimax-h3 | 1495 | 5 | 57,112 | 1–3 |
| 2 | gemini-omni-1.1-flash | 1488 | 11 | 3,734 | 1–5 |
| 3 | wan3.0 | 1480 | 11 | 3,442 | 1–6 |
| 4 | dreamina-seedance-2.5-720p | 1477 | 7 | 15,729 | 2–6 |
| 5 | dreamina-seedance-2.0-720p | 1475 | 7 | 121,427 | 2–6 |
| 6 | gemini-omni-flash | 1465 | 6 | 87,155 | 3–8 |
| 7 | hidream-o1-video-1.0 | 1456 | 8 | 6,488 | 6–10 |
| 8 | grok-imagine-video-1.5-720p | 1456 | 4 | 137,459 | 6–9 |
| 9 | flux-3-video-20260811 | 1449 | 5 | 37,042 | 7–10 |
| 10 | happyhorse-1.0 | 1442 | 10 | 70,640 | 8–11 |
| 11 | wan2.7-i2v | 1428 | 5 | 85,521 | 10–11 |
| 12 | grok-imagine-video-720p | 1415 | 4 | 554,050 | 12 |
| 13 | veo-3.1-audio | 1398 | 10 | 25,116 | 13–16 |
| 14 | veo-3.1-audio-1080p | 1390 | 9 | 53,089 | 13–16 |
| 15 | veo-3.1-fast-audio | 1385 | 9 | 99,804 | 13–17 |

### 3. Arena Video Edit（全榜 10 个模型）
来源 https://arena.ai/leaderboard/video-edit

| # | 模型 | 分数 | ±CI | 票数 | 名次区间 |
|---|---|---|---|---|---|
| 1 | wan3.0 | 1414 | 26 | 463 | 1–3 |
| 2 | dreamina-seedance-2.5-720p | 1410 | 26 | 429 | 1–3 |
| 3 | minimax-h3 | 1392 | 19 | 962 | 1–5 |
| 4 | gemini-omni-flash | 1367 | 15 | 2,109 | 3–5 |
| 5 | dreamina-seedance-2.0-720p | 1365 | 14 | 3,852 | 3–5 |
| 6 | happyhorse-1.0 | 1307 | 14 | 3,116 | 6 |
| 7 | grok-imagine-video | 1258 | 10 | 13,724 | 7–8 |
| 8 | kling-o3-pro | 1255 | 11 | 7,540 | 7–8 |

### 4. Artificial Analysis Text-to-Video
来源 https://artificialanalysis.ai/video/leaderboard/text-to-video ，抓取于 2026-09-29。

| # | 带音频 | Elo ±CI | 出场次数 | # | 无音频 | Elo ±CI |
|---|---|---|---|---|---|---|
| 1 | Gemini Omni Flash | 1233 ±7 | 15,172 | 1 | Wan 3.0 | 1335 ±12 |
| 2 | Wan 3.0 | 1229 ±9 | 6,011 | 2 | Gemini Omni Flash | 1332 ±10 |
| 3 | Minimax H3 Max（fal 后训练版） | 1227 ±9 | 5,689 | 3 | MiniMax H3 | 1302 ±10 |
| 4 | MiniMax H3 | 1220 ±8 | 8,602 | 4 | HappyHorse-1.0 | 1286 ±8 |
| 5 | Seedance 2.0 720p | 1210 ±6 | 20,345 | 5 | HappyHorse-1.1 | 1272 ±9 |
| 6 | MAGI-2 Preview (0912) | 1156 ±9 | 5,103 | 6 | Seedance 2.0 720p | 1259 ±8 |
| 7 | Wan2.7-260612 | 1149 ±6 | 16,694 | 7 | Wan2.7-260612 | 1243 ±9 |
| 8 | HappyHorse-1.1 | 1147 ±6 | 16,670 | 8 | grok-imagine-video | 1235 ±8 |
| 9 | HappyHorse-1.0 | 1119 ±7 | 7,618 | 9 | PixVerse V5.6 | 1230 ±8 |
| 10 | Wan 2.7 | 1098 ±7 | 4,856 | 10 | PixVerse V6 | 1230 ±8 |
| 11 | SkyReels V4 | 1095 ±7 | 4,991 | 11 | Kling 3.0 Omni 1080p Pro | 1230 ±8 |
| 12 | Kling 3.0 1080p Pro | 1095 ±6 | 18,305 | 12 | Kling 3.0 1080p Pro | 1230 ±8 |
| 13 | Kling 3.0 720p Std | 1089 ±6 | 17,426 | 13 | Vidu Q3 Pro | 1225 ±8 |
| 14 | Veo 3.1 | 1088 ±7 | 7,529 | 14 | Bach-1.0 Preview | 1222 ±9 |
| 15 | Veo 3.1 Fast | 1085 ±6 | 16,439 | 15 | PixVerse V5.5 | 1219 ±10 |

（带音频口径第 16 名是 Veo 3.1 Lite，1083 ±7。）

### 5. Artificial Analysis Image-to-Video
来源 https://artificialanalysis.ai/video/leaderboard/image-to-video

| # | 带音频 | Elo ±CI | 出场次数 | # | 无音频 | Elo ±CI |
|---|---|---|---|---|---|---|
| 1 | Minimax H3 Max（fal） | 1194 ±9 | 5,765 | 1 | Gemini Omni Flash | 1369 ±11 |
| 2 | MiniMax H3 | 1181 ±8 | 7,162 | 2 | Bach 1.0 Pro（Video Rebirth，9/29 上榜） | 1362 ±11 |
| 3 | Gemini Omni Flash | 1178 ±7 | 11,828 | 3 | Wan 3.0 | 1362 ±13 |
| 4 | Seedance 2.0 720p | 1176 ±7 | 15,199 | 4 | MiniMax H3 | 1357 ±11 |
| 5 | HiDream-O1-Video | 1174 ±10 | 3,088 | 5 | PixVerse V6 | 1340 ±10 |
| 6 | Wan 3.0 | 1164 ±8 | 8,742 | 6 | Seedance 2.0 720p | 1340 ±9 |
| 7 | HappyHorse-1.1 | 1104 ±7 | 12,649 | 7 | grok-imagine-video-1.5 | 1330 ±11 |
| 8 | grok-imagine-video-1.5 | 1099 ±8 | 5,197 | 8 | grok-imagine-video | 1328 ±9 |
| 9 | MAGI-2 Preview | 1094 ±7 | 11,824 | 9 | HappyHorse-1.1 | 1314 ±10 |
| 10 | HappyHorse-1.0 | 1083 ±7 | 7,409 | 10 | Kling 2.5 Turbo 1080p | 1299 ±9 |
| 11 | Veo 3.1 | 1082 ±7 | 6,987 | 11 | HappyHorse-1.0 | 1295 ±9 |
| 12 | Wan 2.7 | 1078 ±8 | 4,514 | 12 | Vidu Q3 Pro | 1290 ±9 |
| 13 | grok-imagine-video | 1072 ±7 | 14,371 | 13 | PixVerse V5.6 | 1287 ±10 |
| 14 | Veo 3.1 Lite | 1072 ±8 | 5,077 | 14 | SkyReels V4 | 1282 ±11 |
| 15 | PixVerse V6 | 1070 ±7 | 6,986 | 15 | Kling O1 Pro (Dec) | 1281 ±24 |

### 6. Artificial Analysis Video Editing（带音频）
来源 https://artificialanalysis.ai/video/leaderboard/video-editing

排名依次为：Wan 3.0 1188、MiniMax H3 1132、Gemini Omni Flash 1125、HappyHorse-1.0 1089、Wan 2.7 1077、Seedance 2.0 1034。

**AA 四个视频榜都没有这些模型：Seedance 2.5、Gemini Omni 1.1 Flash、FLUX 3 Video、Muse Video、Kling 4.0。** 我在 AA 两个页面嵌入的约 90 个模型名里逐一搜过，确认没有。另外 Kling 4.0 被疑为 AA 上的匿名模型「Cello」，这个名字在 AA 页面数据里也查不到。

### 7. 其它来源
- Design Arena Multi-Image-to-Video：Seedance 2.5 第 1（Elo 1400），MiniMax H3 第 2（1355）。这是 8/16 的推文快照（x.com/DesignArena/status/2089139856660476065），当时 Wan3.0 和 Omni 1.1 还没发布，可能已过时。Design Arena 页面是客户端渲染，没能抓到实时数据。
- Atlas Cloud 8/20 的对比文章：AA I2V 在 7/31 已有 H3 的成绩，Seedance 2.5「has no rating there yet」，到今天仍然没有。

## 二、核对结论：模型是否真实存在，名次是否属实

| 模型 | 是否存在 / 能否访问 | 名次是否属实 |
|---|---|---|
| Gemini Omni 1.1 Flash | **真实存在**。Google 8/27 官方博客发布，AI Studio、Agent Platform API、Flow、Gemini App 和 Vids 都能用。Cloud 文档写的是 `gemini-omni-1.1-flash-preview`，Launch stage: Preview。属于公开付费预览，有公开访问。 | Arena T2V 第 1（1516）、I2V 第 2（1488）**属实**。但 T2V 只有 1,784 票，名次区间 1–4；I2V 名次区间 1–5。**AA 完全没收录**。首期写的「文生视频双榜第一」不对：只有 Arena 一个榜是第一，而且和 Omni Flash 的差距不显著。 |
| Gemini Omni Flash | 真实存在，5/19 发布，状态为 preview | AA T2V 带音频第 1（1233）**属实**。但它和 Wan 3.0（1229）、H3 Max（1227）都落在 CI 内，属于三强并列。另外还有 AA I2V 无音频第 1、Arena T2V 第 2（26k 票，是头部票数最扎实的成绩之一）。 |
| Seedance 2.5 | **真实存在**。7/31 官方发布，即梦和豆包上线；BytePlus ModelArk API 已上线；fal（Seedance US 2.5，原生 1080p）、Runway、Pika、OpenArt、Magnific 都已接入。 | Arena I2V 第 4（1477）、T2V 第 7（1474）**属实**。首期漏了两处：**Arena Video Edit 第 2（1410，和第 1 名 Wan3.0 统计并列，名次区间 1–3）**，以及 Design Arena 多图生视频第 1。**AA 未收录**。 |
| Wan3.0 | 真实存在，8/19–8/24 上线，闭源 | AA T2V 无音频第 1、带音频第 2 **属实**。首期漏了：AA Video Editing 第 1（1188，领先第 2 名 56 分）、Arena Video Edit 第 1、Arena I2V 第 3。 |
| MiniMax H3 | 真实存在，**开放权重**（Community License） | Arena I2V 第 1 **属实**，57k 票、±5，是全类别统计上最稳的第 1。AA I2V 带音频第 2 属实；fal 后训练版第 1。 |
| FLUX 3 Video | 真实存在，Arena 页面链接到 bfl.ai/models/flux-3 | Arena T2V 第 3 属实，但只有 1,302 票、±17，而且 Arena 标记为 `pre_release`。I2V 有 37k 票，只排第 9（1449）。AA 没收录。**首期按 T2V 第 3 定到 S 89，高估了。** |
| Kling 4.0 | 官方 9/28 宣布 10 月发布，目前只有 Flash 版向 Ultra 年费用户开放 | **所有榜单都没有成绩**。released 字段写的是「2026-10」，这是未来日期。 |
| Veo 3.1 / Lite | 真实存在 | Veo 3.1 在 Arena T2V 排第 12、AA 带音频 T2V 排第 14，属实。**Veo 3.1 Lite 在 AA 其实有成绩**（T2V 带音频 1083，排第 16，和 Veo 3.1 的 1088 只差 5 分），首期写的「查不到」有误。**目前查不到 Veo 4 的任何可靠消息。** |

## 三、双向对比发现的问题

1. **SSS 单独给 Omni 1.1 Flash，证据不够**。它只在 Arena 一个榜上领先，而且 T2V 样本不到 1.8k 票。AA 没有收录，状态仍是 Preview。反过来也要承认，它在 Arena T2V 上领先 Seedance 2.5 约 42 分，两者 CI 不重叠（1500.8 对 1482.5），不能直接把它压下去。
2. **Seedance 2.5 被低估了**。首期只看了 Arena T2V 和 I2V 两个 720p 短片偏好榜，漏掉了它能拿第一的项目：视频编辑（Arena 第 2，和第 1 并列）、多参考生成（Design Arena 第 1）。它的独有能力也没算进去：单次 30 秒、一次吃 50 份参考、时间戳级局部重生成。落地面也最广，Runway、Pika、fal、OpenArt、Magnific、DaVinci/Premiere 插件都接了它，agihunt 近 7 天的实测帖也几乎被它包揽。但也要看到，Arena 上它和 Seedance 2.0 的分数统计持平（T2V 1474 对 1479，I2V 1477 对 1475），说明**纯短片画质偏好上它没有明显拉开差距**。它强在长镜头、参考和编辑这类工作流能力，而这几项现有 T2V/I2V 榜测不到。
3. **两榜打架**：
   - Arena T2V 上 Google Omni 两个版本领先；AA T2V 无音频榜 Wan 3.0 第 1，带音频榜 Omni Flash、Wan 3.0、H3 三者在 CI 内并列。
   - I2V 上 Arena 的 H3 第 1 最稳；AA 无音频榜 Omni Flash 第 1，带音频榜 H3 系第 1。
   - 编辑榜两家都是 Wan 3.0 第 1。

   综合来看，头部是 **Omni 1.1、Seedance 2.5、H3、Wan3.0** 四强，分差大多在 CI 内。没有哪一个在所有口径上都统治。
4. **Gemini Omni Flash 和 1.1 同家族，两个版本同时占 SS 以上会重复**。1.1 是增量升级，旧版应该降到 S 档顶部。
5. **FLUX 3 Video 高估**：T2V 小样本且标了 pre_release，I2V 大样本下只排第 9，AA 缺席。建议降到 A。
6. **HiDream-O1-Video 低估**：AA I2V 带音频 1174，和 Seedance 2.0 的 1176 持平；Arena I2V 1456，和 Grok 1.5 相同。建议升到 S 线。不过它只有图生视频成绩。
7. **Kling 4.0 定得偏高**：A 82 排在了 MAGI-2、Wan2.7 这些有实测分的模型前面，但它自己没有任何榜单成绩。建议暂定 B 78，10 月上榜后再调。released 字段建议改成 2026-09-28（官宣日），或者注明「预计 10 月」。
8. **Veo 3.1 Lite 低估**：AA 实测只比 Veo 3.1 低 5 分，建议从 C 68 升到 B 73。Veo 3.1 的 B 76 是合理的。Veo 3.1 的 status 标的是 preview，而 AA 记录的发布日期是 2026-01-30，可能早已 GA，建议作者再核一下。
9. **Genie 3（A 80）**：它是 2025 年的交互式世界模型预览，没有视频榜成绩，却排在实测 B 档的 Veo 3.1 前面。建议降到 B 74，或者移出视频类单列。
10. **HappyHorse-1.1 低估**：AA T2V 带音频 1147（第 8）、无音频 1272（第 5），I2V 带音频 1104（第 7），和 MAGI-2（A 82）同一水平。建议升到 A 83。
11. **反向漏收**：**Bach 1.0 Pro（Video Rebirth）** 今天（9/29）上榜，AA I2V 无音频排第 2（1362），和 Wan 3.0 并列。它的 Preview 版在 T2V 无音频榜排第 14。目前没有对应的厂商文件，需要新建厂商 `videorebirth`。它刚上榜，只有单一口径成绩，建议观察一周再收，暂定 A 档。其余漏收的都是衍生版或低位模型（Minimax H3 Max fal 版、LTX-2.5、Cosmos3、Agnes-Video-2.5），不必收。
12. **文案修正**：Omni 1.1 Flash 的 tagline「文生视频双榜第一」应改为「Arena 文生视频第一」。Seedance 2.5 notes 里「尚未进入 AA 视频榜」属实，保留。

## 四、建议的新天梯

**SSS（两个并列）**
- **Seedance 2.5**：97（原 S 91）。编辑榜并列第 1，多参考生成第 1，Arena I2V 和 T2V 都在前段。30 秒单镜和 50 份参考是代际级的能力领先，落地面也最广，是创作者口碑里的第一。
- **Gemini Omni 1.1 Flash**：97（维持）。Arena T2V 第 1、I2V 第 2，短片偏好目前最高。缺点是样本少、AA 未收录、还在 Preview。

> 如果作者坚持 SSS 只放一个，可以让 Seedance 2.5 单独 SSS 97，Omni 1.1 Flash 降到 SS 96。这样排的依据是长镜头、参考、编辑这些工作流能力比纯短片偏好权重更高，是个取舍问题。纯看盲测数据，还不足以把 Seedance 2.5 单独放在 Omni 1.1 之上。

**SS**
- **MiniMax H3**：95（原 93）。I2V 统计最稳的第 1，AA 带音频 T2V 和 I2V 都在前 4，而且是开放权重。
- **Wan3.0**：94（原 93）。AA T2V 无音频第 1，两家编辑榜都是第 1，Arena I2V 第 3。

**S**
- **Gemini Omni Flash**：92（原 SS 95）。榜单成绩依然顶级，但已被 1.1 取代。
- Seedance 2.0：89（维持）
- Grok Imagine Video 1.5：88（原 89）
- **HiDream-O1-Video 1.0**：88（原 A 86）

**A**
- **FLUX 3 Video**：87（原 S 89）
- Muse Video：84
- **HappyHorse-1.1**：83（原 80）
- MAGI-2 Preview：82
- Wan2.7：81
- （候选）Bach 1.0 Pro：约 85，待建厂商文件

**B**
- **Kling 4.0**：78（原 A 82，暂定）
- Veo 3.1：76
- Kling 4.0 Flash：75
- **Genie 3**：74（原 A 80）
- Grok Imagine Video：74
- **Veo 3.1 Lite**：73（原 C 68）
- Kling 3.0：72
- SkyReels V4：72

**C 及以下**：维持原样。可以顺带考虑一处：Sora 2 Pro 已退役，但 Arena T2V 1368 高于 Veo 3.1，可以升到 B 72；按「退役不压过现役同代」的原则，也可以留在 C。

## 五、仍不确定的地方
- Omni 1.1 Flash 在 Arena 只有 1.8k 和 3.7k 票，AA 也还没收录，排名随时可能变化。
- Seedance 2.5 没进 AA，原因不明（它的 API 已上线），无法做第二个榜的交叉验证。
- Design Arena 的数据是 8/16 的快照，时间较早。
- Kling 4.0 要等 10 月完整版上榜才能定档。
