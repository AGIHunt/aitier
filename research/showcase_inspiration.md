# 3D 天梯榜 · 设计灵感报告：Opus 5.5 出片潮案例拆解

> 调研日期：2026-09-29 ｜ 素材：agihunt 近 7 天（23 次调用）+ WebSearch 补充
> 目标项目栈：React 19 + @react-three/fiber 9 + drei + @react-three/postprocessing + framer-motion + zustand；已装字体 Orbitron / Space Grotesk / JetBrains Mono
> 说明：案例描述来自帖子原文和 agihunt 摘要，大多数 demo 只有视频，没有拿到源码。技术手法凡是原帖明确写了的，下文都照写；属于推断的，会标注「推测」。

---

## 1. 最出彩的 18 个案例

### A. 实时 3D / shader / 程序化世界

| # | 案例 | 视觉 / 交互上具体做了什么 | 链接 |
|---|---|---|---|
| 1 | **90 年代 demoscene demo**（gandamu_ml） | C/C++ + OpenGL，配乐是 Second Reality 的 S3M 音轨。prompt 要求模型**先解析音轨的段落结构和各段情绪**，特效切换和物理效果都按音乐段落同步，实时 blit 和 shader 混着用。一条 prompt，自主跑了 3 小时 10 分钟 | [x.com](https://x.com/gandamu_ml/status/2102919394775220530) · [prompt 原文](https://x.com/gandamu_ml/status/2102920889767485554) · [agihunt](https://agihunt.info/e/1a0d0e09c62892e03d5b508f23b) |
| 2 | **「grand theft code」134KB 实时 3D 城市**（gandamu_ml） | 单文件、约 134KB 的实时城市场景，MacBook 上能跑。卖点是 4K intro 那一路「小体积、大场面」的程序化生成 | [x.com](https://x.com/gandamu_ml/status/2103117079293604274) |
| 3 | **《Another World》风像素实时 demo × Kavinsky《Nightcall》**（gandamu_ml） | 让 Opus 通过 Blender MCP 先搭出一套几何一致的 3D 场景，再**转描（rotoscope）**成 low-poly 平涂风格。画面有 3D 的一致性，看起来又是 2D 复古风 | [x.com](https://x.com/gandamu_ml/status/2103116003689550013) |
| 4 | **three.js 法术 + 程序化 VFX + 音效**（majidmanzarpour） | 可交互的施法 demo，粒子/拖尾/冲击波这类 VFX 和音效都是代码现场生成的，技法参考 @chirovisuals，成品以 artifact 形式发布 | [x.com](https://x.com/majidmanzarpour/status/2102586912993116411) · [demo 帖](https://x.com/majidmanzarpour/status/2102586915124068553) |
| 5 | **任意截图 → 动态 3D 游戏主菜单背景**（majidmanzarpour） | 一条 prompt：recreate this perfectly, fully procedural, animated main menu background in three.js single HTML。第二条 prompt 追加「自由相机」，可以飞进菜单背景里看 | [x.com](https://x.com/majidmanzarpour/status/2102544198335373576) · [追加飞行相机](https://x.com/majidmanzarpour/status/2102603944224591875) |
| 6 | **纯 TSL 的 AAA 级怪兽模拟**（majidmanzarpour） | 一句话 prompt，要求 pure TSL（three.js Shading Language，WebGPU 路线）加 modern techniques，模型自主跑了 3.5 小时 | [x.com](https://x.com/majidmanzarpour/status/2102810712779194418) |
| 7 | **日本山水乘船场景**（@MengTo） | three.js 可玩场景：乘船穿行山谷，有动态天气、昼夜光照循环和水面反射。有人评价「很难相信是 Three.js」 | [x.com](https://x.com/nateliason/status/2102786253871820992) |
| 8 | **零素材全程序化 three.js 世界**（AndreiProvkin） | 零下载素材，连音效也是生成的。流程是 1 个 prompt + 1 张参考图 → 出计划 → 执行 3 步，共 445 次请求、约 5010 行代码、约 60 美元 | [x.com](https://x.com/EricBuess/status/2104017126050734490) |
| 9 | **27.7 万逻辑门计算机 + 3D 语义缩放**（Matt Shumer） | 从 NAND 门一路搭到 CPU/内存/OS/游戏。**3D 可视化可以从游戏画面一路缩放，穿过芯片，一直到单个门电路，实时看信号流动**。一条 prompt 自主跑了 30 小时 | [x.com](https://x.com/mattshumer_/status/2104303934760218625) · [在线](https://somethingbig.ai/computer) · [agihunt](https://agihunt.info/e/1a0e47d4be33ef64074856061d0) |

### B. 网页 hero / 落地页 / UI 演出（和我们最接近）

| # | 案例 | 视觉 / 交互上具体做了什么 | 链接 |
|---|---|---|---|
| 10 | **手游「高光时刻」3D 动效页：开宝箱 / 段位晋升 / 成就解锁**（op7418） | 这是**和天梯榜最直接相关的一个**。Three.js 的真实几何（铆钉、锁扣都是几何体拼的）；MeshToonMaterial 配 3–4 阶渐变贴图做卡通分阶着色；主光/天光/轮廓光三灯；**描边用后期边缘检测**：先渲法线图和深度图，再在着色器里画线，外轮廓粗、交界处细；1.5× 超采样 + MSAA；箱盖绕铰链翻开、奖章绕轴旋转；待机时缓慢自转、上下浮动，投影随高度变化；**标题逐字「砸」入并带回弹**；**配色按等级阶梯切换：绿 → 蓝 → 紫 → 金** | [x.com](https://x.com/op7418/status/2104085539419021491) |
| 11 | **个人官网 hero shader：光标搅动烟雾粒子**（AIandDesign / Marco van Hylckama Vlieg） | 用光标搅拌烟雾和粒子（推测是 GPU 流体或 curl noise 场），屏幕支持 HDR 时用 **HDR 粒子**，亮度可以超过 SDR 白 | [x.com](https://x.com/AIandDesign/status/2102895424281747558) |
| 12 | **WebGPU 3D 落地页**（kevinkern） | 和 Opus 对话约 1 小时，给一个金融小应用做了 three.js + 自定义 shader 的 3D 背景落地页 | [x.com](https://x.com/kevinkern/status/2102486130738544691) |
| 13 | **实时 WebGL 房间首页**（NathanWilbanks） | 首页是一个实时 3D 房间：**滑块控制光线从黎明到黄昏**，还能**逐层看建筑怎么装配起来**（explode / assemble） | [x.com](https://x.com/NathanWilbanks_/status/2104638051720790223) |
| 14 | **草图「长」成住宅**（techartist_） | Three.js + TSL 分四个阶段演进：首笔线条 → 体块 → 细节 → 成品，是一种「生长式」揭示动画 | [x.com](https://x.com/techartist_/status/2102503719762018434) |

### C. 代码直出视频 / MV / 声画同步

| # | 案例 | 视觉 / 交互上具体做了什么 | 链接 |
|---|---|---|---|
| 15 | **《Everything Is Motion》97 秒视听短片**（Reddit，Claude Code + subagents） | **每一帧都是 WebGL2 shader，全部音乐由 WebAudio 实时合成**，不用图片、采样和第三方库。10 个场景包含 shader、**30 万粒子系统**、动态字体。一个 subagent 负责作曲，其余并行搭场景。**自检方式：把渲染帧拼成 contact sheet，同时分析音频** | [reddit](https://www.reddit.com/r/ClaudeAI/comments/1wsup4y/motion_design_showreel_with_sonnet_55_on_par_with/) |
| 16 | **《Claude Pop》MV 接龙**（donald → anabology 5 分钟版，马斯克转发） | 人物、歌词、拼贴、颗粒、转场都**贴着节拍轮番出现**。donald 公开了约 9500 字符的 prompt，模型自主跑 12 小时。同题接龙里还有乔布斯 MV：**23 种转场踩着 120 BPM**（见量子位报道） | [donald](https://x.com/donaldjewkes/status/2102801274173587569) · [anabology 长版](https://x.com/anabology/status/2103534482930491441) · [agihunt](https://agihunt.info/e/1a0e65ed001418c0ee9046d0079) |
| 17 | **奥迪 RS6 15 秒动效**（@Dys_hay，React + Remotion） | 100% 代码，**合成 V8 引擎声**；**气缸按真实点火顺序闪烁**；0–100 计时器实时跑到 3.4 秒。细节和真实数据一一对上 | [x.com](https://x.com/EricBuess/status/2103909275122942058) |
| 18 | **Lemo-Opuscar：39 种风格代码视频库**（lemomo_ai） | 水墨、皮影、厚涂、80 年代赛璐璐、像素 RPG、60 年代间谍片头、立体书等 39 种风格，每帧都是 Canvas/WebGL 代码渲染的。仓库里有 DIRECTOR.md（故事/声音/节奏/镜头/自检）、TECHNIQUE.md 和每种风格的 STYLE.md | [x.com](https://x.com/EricBuess/status/2103907808056168879) |

### 补充（值得扫一眼）

- **赛博朋克像素奔跑动画 + 自动配乐，单 HTML，prompt 只有一句「make it dope」**（itsmnjn）：[x.com](https://x.com/itsmnjn/status/2102792222018314250)
- **《memory-fading-into-watercolor》**：Three.js + GLSL + Rough.js 手绘质感 + Simplex 噪声，配 Tone.js + Salamander 钢琴采样的音景（techartist_，MIT 开源）：[x.com](https://x.com/techartist_/status/2104186357824487573)
- **《Hollow Crown》像素 RPG**：320×180 原生分辨率，精灵、特效、音乐、音效全由代码生成后烘焙成 sprite sheet / WAV，模型还自己剪了演示视频（noahsolomon）：[x.com](https://x.com/noahsolomon/status/2103874559715975210)
- **Dynamic Workflows 动画短片**：编剧室 workflow、并行 agent 分别搭角色/场景/渲染管线、Python 生成配乐、对抗式审稿 agent 和 polish workflow（daniel_mac8）：[x.com](https://x.com/daniel_mac8/status/2103834979268784565)
- **音乐实时转 ASCII 字符画 + CRT 着色器**（measure_plan）：[x.com](https://x.com/measure_plan/status/2102767276277797372)
- **Sentinel**（工具，不是 Opus 的 demo，但它的手法值得抄）：把系统音频解析成频谱、mel 频带和节拍检测，**可以映射到任意参数，比如让鼓点把粒子群打散**：[x.com](https://x.com/PurzBeats/status/2103728228242198944)
- **9 个 agent 做的「街头霸王」风预告片**，前沿模型互殴（Haider，约 190 美元）：[x.com](https://x.com/haider1/status/2104256000341524770)
- **Namedrop 评测**：给模型一个**具名风格参考**（比如「James Turrell」），比给一串形容词强，90 对落地页盲测中胜率 68%：[x.com](https://x.com/maxsloef/status/2103936387208921518)
- 聚合页（二手来源，可顺藤摸瓜）：[magiccreator.ai Opus 5.5 demos](https://magiccreator.ai/claude-opus-5-5-demos)、[awesome-opus-5-5-prompts](https://github.com/TripoGrowthLab/awesome-opus-5-5-prompts)、[Tripo 3D prompts](https://www.tripo3d.ai/3d-prompts/claude-opus-5-5-2102529695908806728)

---
## 2. 这些案例共同的「爽点」模式

1. **声画卡点**：几乎所有被疯转的作品都会先把音乐拆成节拍地图（BPM、重拍、段落、音量峰值），切镜头、弹字幕、变色、音效全部扣在这些时间点上（demoscene、Claude Pop、乔布斯 MV 23 转场 × 120BPM）。没有声音的 demo 很少出圈，发帖人经常特意叮嘱「记得开声音」。
2. **零素材、全程序化**：没有贴图、没有模型文件、没有采样，画面和声音全由代码当场算出来（Everything Is Motion、AndreiProvkin、Hollow Crown）。观众会惊叹「这还是纯代码？」。对我们来说，这意味着体积小、加载快、风格统一。
3. **细节忠于真实数据**：RS6 的气缸按真实点火顺序闪、计时器真的跑 3.4 秒；Shumer 的计算机里信号真的在门电路之间流动。懂行的人一看就知道不是摆拍，这类作品的传播力最强。
4. **尺度跨越 / 语义缩放**：从宏观一路钻到微观（游戏 → 芯片 → 门），或者从一笔线条长成一栋房子。镜头的连续性让信息层级变成一次「旅程」。
5. **即时「高光时刻」演出**：开宝箱、段位晋升这一类时刻用的是手游演出语法：蓄力 → 爆开 → 逐字砸入回弹 → 待机浮动，靠这个制造多巴胺。
6. **复古氛围包装**：demoscene、像素、CRT、颗粒、ASCII、《Another World》平涂。低保真的外壳配上高保真的内核，观众觉得既怀旧又惊艳。
7. **光标 / 手感即玩具**：光标搅烟雾、自由飞行相机、昼夜滑块，用户第一秒就能「玩」到，不需要先读懂内容。
8. **单文件 / 小体积炫技**：134KB 就是一座城、单 HTML 就是一部片。「这么小怎么做到的」本身就能传播。
9. **幕后工序透明**：公开 prompt、时长、成本（3h10m、$60、30 小时、$190）。观众爱看「怎么做的」，那等于第二个传播点。
10. **先定风格文档，再逐镜打磨**：出片稳定的团队都会先写 styleguide 或 STYLE.md，再做分镜和低清预览，然后拿 contact sheet 自检。Movez 的说法是「提示词只占 10%，90% 是生产框架」。

---

## 3. 针对「3D 天梯榜」的落地建议（按冲击力排序）

> 超越思路：前面这些案例大多是**一次性视频或玩具 demo**，好看但没有信息量，也不能长期用。我们的机会是做一个**可交互、数据真实、可以分享的**作品：视觉语言借 demoscene 和手游演出，信息层借 Shumer 式语义缩放，**每个动效参数都绑定一个真实字段**（学 RS6 的「点火顺序」）。

### 第一梯队：决定第一印象，必须做

**① 开场「冷启动」序列（0–8 秒）**
- 首屏全黑，只有一个 `[ PRESS TO ENTER · 开声音体验 ]` 按钮，用 JetBrains Mono 显示并带光标闪烁。这个按钮同时解决浏览器禁止音频自动播放的限制。
- 点击后是 boot log：终端字符快速滚过 `LOADING LMArena… Artificial Analysis… 62 models / 18 vendors`，每行配一个短促 tick 音（Web Audio 振荡器 + 包络）。
- 第一个重拍落下时屏幕白闪，SSS 徽章（Opus 5.5）从中心爆开成数万粒子，粒子飞散后重组成整座天梯塔。镜头从高空俯冲进场，同时一个 sub-bass 下潜（60Hz → 30Hz 扫频）。
- 实现：整段开场写成 `seek(t)` 的纯函数时间线（见 ⑫），用 zustand 存 `t`，R3F 的 `useFrame` 读取；粒子用 `InstancedMesh` 或 GPGPU points，目标位置用 morph。

**② 天梯 = 一座垂直的「光之塔」，镜头沿样条线飞行**
- 8 个 tier 是 8 层悬浮平台，从上到下是 SSS → E。每层的颜色、辉光和平台材质都不同：SSS 是熔金加全息，E 是冷灰线框。
- 滚动驱动镜头沿 CatmullRom 样条从塔顶螺旋下降，每层停留时镜头微微环绕。drei 的 `ScrollControls` 加自定义 camera rig 就能做。
- 层与层之间有能量束连接。某个模型升档时，粒子沿能量束往上流。

**③ SSS / SS「王座演出」：直接用 op7418 的段位晋升语法**
- 徽章是 3D 奖章或硬币，MeshToonMaterial 做 3–4 阶着色，外加**法线 + 深度边缘检测描边**的后期 pass（外粗内细），效果是卡通渲染但精致。
- 进入视野时的节奏：蓄力光圈收缩 → 爆开（bloom 峰值 + 色差脉冲 + 屏幕微震）→ 「S S S」三个字母**逐字砸入并回弹**（framer-motion 的 spring 或自写 overshoot 曲线）→ 待机时绕轴慢转，上下浮动，投影随高度变化。
- 每个字母落地配一记低频打击音，第三个字母落地时叠一个和弦。

**④ 程序化配乐 + 全站节拍总线（Beat Bus）**
- 用 Tone.js 或原生 Web Audio 生成一首约 110–120 BPM 的 synthwave / darksynth 循环：kick、sub、琶音、pad，全部由振荡器、噪声和滤波器合成，没有采样文件，体积接近 0。
- 在 zustand 里暴露一个 `beat` / `bar` / `phase` store，**所有动效量化到拍子上**：tier 揭示落在小节头，卡片出现落在 16 分音符上，背景网格随 kick 脉冲。
- 滚动到哪一层，音乐就切到对应段落。SSS 层满编 + 合唱 pad，E 层只剩孤零零的 bass 和 bitcrusher。**音乐本身就在讲排名**。

**⑤ 数据声化（sonification）+ 交互反馈音**
- hover 模型卡时播一个音符，**音高 = score 映射到五声音阶**，分越高音越高越亮。扫过一整排卡片会弹出一段旋律，而且每一档的旋律都不一样。
- 点击：短 whoosh + 镜头 dolly-in。拖拽比较：滤波器随距离扫频。
- 开源模型用更「木质」的音色，比如 FM 拨弦；闭源用玻璃质感的 bell。
- 全局静音键常驻右上角，状态存进 localStorage，同时尊重 `prefers-reduced-motion`。

### 第二梯队：信息层和「玩」的深度

**⑥ Shumer 式语义缩放：塔 → 模型 → 基准 → 来源**
- 点一张模型卡，镜头连续钻进去（不切页）。卡片展开成一个小星系：中心是模型徽章，外圈轨道是各 benchmark，**轨道半径或亮度 = 分数**，环上刻着 LMArena、SWE-bench 等名称。
- 再点一个 benchmark，钻进它的数值面板（历史曲线、第几名、来源链接）。
- 返回时镜头原路倒放。全程只有一个 R3F Canvas，DOM 层用 drei 的 `<Html>` 或 overlay 叠加。

**⑦ 三种视图一键切换，同一批数据不同隐喻**
- **Tower**：天梯塔，默认视图。
- **City**：学「grand theft code」，每个模型是一栋楼，**高度 = score，楼顶灯色 = tier，街区 = 厂商**，镜头可以自由飞行。
- **Galaxy**：每个厂商是一个恒星系，模型是行星，**轨道半径 = tier，行星大小 = 用量或热度**。
- 切换时所有模型实例补间到新位置，数百个 InstancedMesh 同时 morph，这一下本身就很壮观。

**⑧ 时间回放滑块：看天梯怎么变**
- 底部是一条时间轴（2025-01 → 2026-09），拖动时模型在各层之间升降，身后留下粒子拖尾。
- 关键事件（比如「9/23 Opus 5.5 发布」）触发全塔冲击波（屏幕空间 ripple + 音效 impact），**Opus 5.5 冲上 SSS 那一下就是整站的高光帧**。
- 学 NathanWilbanks 的昼夜滑块：时间轴同时驱动天空色温，早期偏冷，越接近现在越热。

**⑨ 光标即玩具：流体烟雾背景**
- 塔周围的星云和烟雾用 GPU 流体（stable fluids 或 curl-noise 粒子）做，光标拖过会搅动；hover 某一层时，烟雾染成那一层的颜色。
- 支持 HDR 的屏幕上，SSS 的光能亮到 EDR（参考 AIandDesign 的 HDR 粒子，推测需要 WebGPU 或 canvas HDR 配置，要实测）。

**⑩ VS 对决模式（学 Haider 的街霸预告片）**
- 任选两个模型，画面切到格斗游戏选人屏：左右立绘（徽章加 monogram 大字），中间闪 `VS`，血条长度 = 各项 benchmark，逐项「出招」对比并配打击音效。
- 结算用 ③ 的晋升演出宣布胜者。这是最容易被截图和录屏转发的模式。

### 第三梯队：细节、彩蛋和传播

**⑪ 每个视觉参数绑定一个真实字段（RS6 的「点火顺序」原则）**
- `score` → 辉光强度和平台高度偏移；`released` → 越新越亮，旧模型带一点「氧化」噪声；`openWeights` → 玻璃透明材质加内部可见的线框「骨架」；`status: rumored` → 故障风（glitch）加半透明全息，并打上 `UNCONFIRMED` 扫描字；`pricing` → 卡背刻价格码。
- 懂行的用户会自己发现这些规则，然后去讨论和转发。

**⑫ 一切动画写成 `seek(t)` 纯函数（Movez 技巧）**
- 开场、升档、VS 演出都用确定性时间线：给定 t 就能算出唯一画面。这样可以跳帧调试、并行截帧做 contact sheet 自检，也能导出视频。

**⑬ 一键导出「我的天梯」15 秒短片**
- 用户拖拽调整自己的排名后，点「生成短片」：`canvas.captureStream()` + Web Audio 的 `MediaStreamDestination` + `MediaRecorder`，录下按 seek(t) 回放的 15 秒开场演出，带上配乐，直接下载 webm 发 X 或小红书。这一条对传播最关键。

**⑭ 风格皮肤 / 彩蛋模式（学 Opuscar 39 风格）**
- `?style=demo93`：Second Reality 致敬版，包括 plasma 背景、copper bars、rotozoom 旋转缩放、正弦波滚动字幕，配乐切成 tracker 风格的 chiptune。
- `?style=toon`：op7418 手游卡通描边风。
- `?style=ascii`：整个场景后处理成 ASCII 字符，再叠 CRT 扫描线（参考 measure_plan）。
- 输入 Konami 码（↑↑↓↓←→←→BA）解锁 demo93。

**⑮ 后处理栈（@react-three/postprocessing 现成可用）**
- 选择性 Bloom（只让 emissive 层发光，mipmapBlur）、ChromaticAberration（只在转场和冲击时脉冲，平时为 0）、Noise 胶片颗粒（约 0.04）、Vignette、DepthOfField（钻入模型时开启）、自定义 Outline/边缘检测 pass（toon 模式用）、可选 Scanline。
- 性能兜底：drei 的 `PerformanceMonitor` 加 `AdaptiveDpr`。帧率掉下来时依次关掉 DOF → 降粒子数 → 关 bloom。**移动端要实测**：Reddit 上有 three.js 产品页手机端帧率暴跌、后来重构的案例。

**⑯ 「幕后」页**
- 页脚放「How it's made」，公开数据来源、每个模型的定档理由，以及这个站本身是怎么用 AI 做出来的（prompt 和耗时）。第 2 节第 9 条说过，观众就吃这一套。

### 开工前的流程建议（从出片案例里学来的）

1. 先写 `STYLE.md`：用 1–3 个**具名参考**（比如「Second Reality × Tron Legacy × 原神抽卡演出」），不要只写「高级感」这类形容词（Namedrop 评测显示具名参考胜率 68%）。
2. 先写 `BEATMAP`：BPM、段落和每个关键动效落在哪一拍。
3. 先做低清灰盒版本，关键帧拼成 contact sheet 自检，挑出最差的 3 个问题改完再上材质。

---

## 4. 配色 / 字体 / 氛围关键词

### 配色

**Tier 阶梯色**（沿用参考天梯图 `tier_ref_jp.png` 的彩虹梯度，便于用户认知迁移，饱和度提高后做成 emissive）：

| Tier | 建议主色 | 辉光 / 材质 |
|---|---|---|
| SSS | `#FF3DF5` 品红 → 叠 `#FFD66B` 金色高光 | 熔金 + 全息镭射（iridescence / thin-film） |
| SS | `#B06CFF` 紫 | 紫水晶 |
| S | `#FF6B6B` 珊瑚红 | 红宝石 |
| A | `#FF9F43` 橙 | 琥珀 |
| B | `#FFE066` 黄 | 暖光 |
| C | `#B8F35A` 黄绿 | 荧光 |
| D | `#5BE7A9` 绿 | 冷光 |
| E | `#5CE1FF` 青 | 线框 / 冷灰 |

- 底色：近黑偏紫 `#07060C` / `#0D0B16`，网格线 `#1E1B2E`，正文 `#E8E6F0`，次要文字 `#8A87A0`。
- 另一套方案是 op7418 的「稀有度梯度」**绿 → 蓝 → 紫 → 金**，可以放进 toon 皮肤。
- Anthropic 珊瑚 `#D97757` 只留给 Opus 5.5 的专属演出，不当成全局主色。
- 原则：高亮只出现在「光」上（emissive、bloom），UI 面板保持低饱和，不要做成满屏霓虹。

### 字体
- **Orbitron**（已装）：只用于 tier 大字母（SSS/SS/S…）和分数数字，字重 800–900，加字距。
- **Space Grotesk**（已装）：模型名、标题和 UI。
- **JetBrains Mono**（已装）：boot log、benchmark 数值、来源链接和 HUD 标注。
- **中文需要补一款**：推荐 `Noto Sans SC` / 思源黑体 Heavy 做中文标题，正文用 Regular。三款英文字体都不含 CJK 字形，不补的话中文会回落到系统字体，风格会断。
- 3D 场景里的文字用 drei `<Text>`（troika SDF），同样加载上面这些字体文件。

### 氛围关键词（写进 STYLE.md，给后续 agent 当具名参考）
`90s demoscene (Second Reality, Future Crew)` · `synthwave / darksynth` · `Tron Legacy 光轨` · `街机选人屏 / 格斗游戏 VS` · `手游抽卡 & 段位晋升演出` · `电竞直播包装 HUD` · `天文台 / 光之大教堂` · `全息镭射卡` · `CRT 扫描线 + 胶片颗粒` · `《Another World》平涂 low-poly` · `James Turrell 光场`（柔和大色块的光） · `数据即光`

---

## Sources
- agihunt 事件簇：[demoscene](https://agihunt.info/e/1a0d0e09c62892e03d5b508f23b) · [发布即刷屏合集](https://agihunt.info/e/1a0ca7c775e75f2507249585a8b) · [MV 出片潮（量子位/新智元）](https://agihunt.info/e/1a0e65ed001418c0ee9046d0079) · [27.7 万门计算机](https://agihunt.info/e/1a0e47d4be33ef64074856061d0) · [Opuscar 39 风格 / RS6](https://agihunt.info/e/1a0dee74e12d3f4e0e2371d1b33) · [法术 demo](https://agihunt.info/e/1a0cc2362793b3340d48f83d0d2) · [像素动画配乐](https://agihunt.info/e/1a0cf0cf8cd22d2809cf138250a)
- Web：[magiccreator.ai Opus 5.5 demos](https://magiccreator.ai/claude-opus-5-5-demos) · [awesome-opus-5-5-prompts](https://github.com/TripoGrowthLab/awesome-opus-5-5-prompts) · [Tripo 3D prompts](https://www.tripo3d.ai/3d-prompts/claude-opus-5-5-2102529695908806728)
