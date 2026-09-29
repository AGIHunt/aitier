/**
 * 纯程序化音频：不依赖任何音频文件，全部用 Web Audio 实时合成。
 * - 环境：低频 drone + 高频微光 + 生成式五声音阶琶音
 * - 交互：hover 音高随档位升高，选择是 FM 钟声，切换类别是气流 whoosh
 * - 开场：上升 riser + 抵达 SSS 的冲击
 */
const A3 = 220
const PENTA = [0, 3, 5, 7, 10] // A 小调五声

const hz = (semi: number) => A3 * Math.pow(2, semi / 12)

class AudioEngine {
  ctx: AudioContext | null = null
  private master!: GainNode
  private sfx!: GainNode
  private music!: GainNode
  private reverbIn!: GainNode
  private noise!: AudioBuffer
  private ambientNodes: AudioNode[] = []
  muted = false

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const ctx = new AudioContext()
    this.ctx = ctx
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -16
    comp.ratio.value = 4
    comp.connect(ctx.destination)

    this.master = ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.9
    this.master.connect(comp)

    const reverb = ctx.createConvolver()
    reverb.buffer = this.impulse(3.2, 2.4)
    this.reverbIn = ctx.createGain()
    this.reverbIn.gain.value = 0.55
    this.reverbIn.connect(reverb)
    reverb.connect(this.master)

    this.sfx = ctx.createGain()
    this.sfx.gain.value = 0.8
    this.sfx.connect(this.master)
    this.sfx.connect(this.reverbIn)

    this.music = ctx.createGain()
    this.music.gain.value = 0.0
    this.music.connect(this.master)
    this.music.connect(this.reverbIn)

    const len = ctx.sampleRate * 2
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = this.noise.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  }

  private impulse(seconds: number, decay: number) {
    const ctx = this.ctx!
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c)
      for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
    return buf
  }

  setMuted(m: boolean) {
    this.muted = m
    if (!this.ctx) return
    this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.08)
  }

  private get t() {
    return this.ctx!.currentTime
  }

  private ok() {
    return !!this.ctx && this.ctx.state === 'running'
  }

  private env(g: GainNode, peak: number, attack: number, decay: number, at = this.t) {
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(peak, at + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay)
  }

  private noiseSrc() {
    const s = this.ctx!.createBufferSource()
    s.buffer = this.noise
    s.loop = true
    return s
  }

  // ───────────────────────── 环境音 ─────────────────────────
  startAmbient() {
    if (!this.ctx || this.ambientNodes.length) return
    const ctx = this.ctx
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 420
    lp.Q.value = 3
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.06
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 220
    lfo.connect(lfoGain).connect(lp.frequency)
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.045
    lp.connect(droneGain).connect(this.music)

    const freqs = [55, 55.4, 82.41, 110.2]
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator()
      o.type = i < 2 ? 'sawtooth' : 'triangle'
      o.frequency.value = f
      o.connect(lp)
      o.start()
      return o
    })

    // 高频微光
    const shimmer = ctx.createGain()
    shimmer.gain.value = 0.0
    const trem = ctx.createOscillator()
    trem.frequency.value = 0.15
    const tremGain = ctx.createGain()
    tremGain.gain.value = 0.006
    trem.connect(tremGain).connect(shimmer.gain)
    shimmer.connect(this.music)
    const sh = [880, 1318.5, 1760].map((f) => {
      const o = ctx.createOscillator()
      o.frequency.value = f
      o.connect(shimmer)
      o.start()
      return o
    })
    lfo.start()
    trem.start()

    this.music.gain.setTargetAtTime(1, this.t, 2.5)
    this.ambientNodes = [...oscs, ...sh, lfo, trem]
    this.scheduleArp()
  }

  // ───────────────────────── 节拍音序器 ─────────────────────────
  /** 0..1：越靠近塔顶越满编（pad → bass → kick → arp → hats → clap） */
  energy = 0.3
  private step = 0
  private nextTime = 0
  private beats: number[] = []
  readonly bpm = 104

  setEnergy(e: number) {
    this.energy = Math.max(0, Math.min(1, e))
  }

  /** 最近一拍的脉冲 0..1，给视觉用 */
  beatPulse() {
    if (!this.ctx) return 0
    const now = this.ctx.currentTime
    let last = -1
    for (const b of this.beats) if (b <= now) last = b
    if (last < 0) return 0
    return Math.exp(-(now - last) * 7)
  }

  private scheduleArp() {
    this.nextTime = this.t + 0.1
    const stepDur = 60 / this.bpm / 4
    // Am - F - C - G
    const prog = [
      [0, 3, 7],
      [-4, 0, 3],
      [3, 7, 10],
      [-2, 2, 5],
    ]
    const loop = () => {
      if (this.ctx) {
        while (this.nextTime < this.t + 0.15) {
          const st = this.step % 16
          const bar = Math.floor(this.step / 16) % 4
          const chord = prog[bar]
          const at = this.nextTime
          const e = this.muted ? 0 : this.energy
          if (st === 0) this.pad(chord, at, stepDur * 16, e)
          if (e > 0.22 && st % 2 === 0) this.bass(chord[0] - 24 + (st % 8 === 6 ? 12 : 0), at, stepDur * 1.6, e)
          const fourFloor = e > 0.45 ? st % 4 === 0 : e > 0.3 ? st % 8 === 0 : false
          if (fourFloor) {
            this.kick(at)
            this.beats.push(at)
            if (this.beats.length > 16) this.beats.shift()
          }
          if (e > 0.5) {
            const pattern = [0, 1, 2, 1, 2, 3, 2, 1]
            const idx = pattern[st % 8]
            const semi = chord[idx % 3] + 12 + (idx === 3 ? 12 : 0)
            if (e > 0.72 || st % 2 === 0) this.pluck(hz(semi), 0.022 + e * 0.02, 0.35, this.music, at - this.t)
          }
          if (e > 0.62 && st % 4 === 2) this.hat(at, 0.05)
          if (e > 0.86 && st % 2 === 1) this.hat(at, 0.022)
          if (e > 0.78 && (st === 4 || st === 12)) this.clap(at)
          this.nextTime += stepDur
          this.step++
        }
      }
      window.setTimeout(loop, 25)
    }
    loop()
  }

  private pad(chord: number[], at: number, dur: number, e: number) {
    const ctx = this.ctx!
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 500 + e * 2200
    lp.Q.value = 0.7
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(0.03 + e * 0.02, at + dur * 0.25)
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur * 1.05)
    lp.connect(g).connect(this.music)
    for (const semi of chord) {
      for (const det of [-7, 7]) {
        const o = ctx.createOscillator()
        o.type = 'sawtooth'
        o.frequency.value = hz(semi)
        o.detune.value = det
        o.connect(lp)
        o.start(at)
        o.stop(at + dur * 1.1)
      }
    }
  }

  private bass(semi: number, at: number, dur: number, e: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = hz(semi)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(300 + e * 900, at)
    lp.frequency.exponentialRampToValueAtTime(120, at + dur)
    lp.Q.value = 6
    const g = ctx.createGain()
    o.connect(lp).connect(g).connect(this.master)
    this.env(g, 0.08 + e * 0.05, 0.005, dur, at)
    o.start(at)
    o.stop(at + dur + 0.05)
  }

  private kick(at: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    o.frequency.setValueAtTime(140, at)
    o.frequency.exponentialRampToValueAtTime(42, at + 0.12)
    const g = ctx.createGain()
    o.connect(g).connect(this.master)
    this.env(g, 0.42, 0.002, 0.32, at)
    o.start(at)
    o.stop(at + 0.4)
  }

  private hat(at: number, peak: number) {
    const ctx = this.ctx!
    const n = this.noiseSrc()
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 7500
    const g = ctx.createGain()
    n.connect(hp).connect(g).connect(this.master)
    this.env(g, peak, 0.001, 0.05, at)
    n.start(at, Math.random())
    n.stop(at + 0.08)
  }

  private clap(at: number) {
    const ctx = this.ctx!
    const n = this.noiseSrc()
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1600
    bp.Q.value = 0.8
    const g = ctx.createGain()
    n.connect(bp).connect(g)
    g.connect(this.master)
    g.connect(this.reverbIn)
    this.env(g, 0.12, 0.002, 0.18, at)
    n.start(at, Math.random())
    n.stop(at + 0.25)
  }

  private pluck(freq: number, peak: number, decay: number, bus: AudioNode, delay = 0) {
    const ctx = this.ctx!
    const at = this.t + delay
    const o = ctx.createOscillator()
    const o2 = ctx.createOscillator()
    o.type = 'triangle'
    o2.type = 'sine'
    o.frequency.value = freq
    o2.frequency.value = freq * 2.002
    const g = ctx.createGain()
    const g2 = ctx.createGain()
    g2.gain.value = 0.35
    o.connect(g)
    o2.connect(g2).connect(g)
    g.connect(bus)
    this.env(g, peak, 0.006, decay, at)
    o.start(at)
    o2.start(at)
    o.stop(at + decay + 0.1)
    o2.stop(at + decay + 0.1)
  }

  // ───────────────────────── 交互音 ─────────────────────────
  /** hover：分数映射到五声音阶，越强越高；开源是木质拨弦，闭源是玻璃钟 */
  hover(score: number, open = false) {
    if (!this.ok()) return
    const idx = Math.max(0, Math.round(((score - 45) / 55) * 14))
    const semi = PENTA[idx % 5] + 12 * Math.floor(idx / 5) + 3
    if (open) this.pluck(hz(semi), 0.07, 0.3, this.sfx)
    else this.bell(hz(semi + 12), 0.035, 0.5)
  }

  private bell(f: number, peak: number, decay: number) {
    const ctx = this.ctx!
    const car = ctx.createOscillator()
    const mod = ctx.createOscillator()
    const mg = ctx.createGain()
    car.frequency.value = f
    mod.frequency.value = f * 2.76
    mg.gain.setValueAtTime(f * 1.2, this.t)
    mg.gain.exponentialRampToValueAtTime(1, this.t + decay)
    mod.connect(mg).connect(car.frequency)
    const g = ctx.createGain()
    car.connect(g).connect(this.sfx)
    this.env(g, peak, 0.003, decay)
    car.start()
    mod.start()
    car.stop(this.t + decay + 0.1)
    mod.stop(this.t + decay + 0.1)
  }

  tick() {
    if (!this.ok()) return
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    o.type = 'square'
    o.frequency.value = 2400
    const f = ctx.createBiquadFilter()
    f.type = 'highpass'
    f.frequency.value = 1500
    const g = ctx.createGain()
    o.connect(f).connect(g).connect(this.sfx)
    this.env(g, 0.025, 0.002, 0.03)
    o.start()
    o.stop(this.t + 0.06)
  }

  /** FM 钟声：选中模型 */
  select(semitone: number) {
    if (!this.ok()) return
    const ctx = this.ctx!
    const f = hz(semitone)
    ;[1, 1.5, 2].forEach((ratio, i) => {
      const at = this.t + i * 0.045
      const car = ctx.createOscillator()
      const mod = ctx.createOscillator()
      const modGain = ctx.createGain()
      car.frequency.value = f * ratio
      mod.frequency.value = f * ratio * 3.5
      modGain.gain.setValueAtTime(f * ratio * 2.2, at)
      modGain.gain.exponentialRampToValueAtTime(1, at + 1.2)
      mod.connect(modGain).connect(car.frequency)
      const g = ctx.createGain()
      car.connect(g).connect(this.sfx)
      this.env(g, 0.08 / (i + 1), 0.004, 1.6, at)
      car.start(at)
      mod.start(at)
      car.stop(at + 1.8)
      mod.stop(at + 1.8)
    })
  }

  /** 气流：切换类别 / 镜头飞行 */
  whoosh(dur = 0.7, up = true) {
    if (!this.ok()) return
    const ctx = this.ctx!
    const n = this.noiseSrc()
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 1.4
    const at = this.t
    bp.frequency.setValueAtTime(up ? 250 : 3500, at)
    bp.frequency.exponentialRampToValueAtTime(up ? 3800 : 220, at + dur * 0.8)
    const pan = ctx.createStereoPanner()
    pan.pan.setValueAtTime(-0.8, at)
    pan.pan.linearRampToValueAtTime(0.8, at + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(0.32, at + dur * 0.45)
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
    n.connect(bp).connect(pan).connect(g).connect(this.sfx)
    n.start(at, Math.random())
    n.stop(at + dur + 0.05)
  }

  /** 开场上升 */
  riser(dur: number) {
    if (!this.ok()) return
    const ctx = this.ctx!
    const at = this.t
    const n = this.noiseSrc()
    const hp = ctx.createBiquadFilter()
    hp.type = 'bandpass'
    hp.Q.value = 2
    hp.frequency.setValueAtTime(180, at)
    hp.frequency.exponentialRampToValueAtTime(7000, at + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(0.22, at + dur * 0.95)
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur + 0.08)
    n.connect(hp).connect(g).connect(this.sfx)
    n.start(at)
    n.stop(at + dur + 0.1)

    const saw = ctx.createOscillator()
    saw.type = 'sawtooth'
    saw.frequency.setValueAtTime(55, at)
    saw.frequency.exponentialRampToValueAtTime(440, at + dur)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(200, at)
    lp.frequency.exponentialRampToValueAtTime(2400, at + dur)
    const g2 = ctx.createGain()
    g2.gain.setValueAtTime(0.0001, at)
    g2.gain.exponentialRampToValueAtTime(0.08, at + dur * 0.95)
    g2.gain.exponentialRampToValueAtTime(0.0001, at + dur + 0.05)
    saw.connect(lp).connect(g2).connect(this.sfx)
    saw.start(at)
    saw.stop(at + dur + 0.1)
  }

  /** 冲击：抵达 SSS / 揭晓 */
  impact() {
    if (!this.ok()) return
    const ctx = this.ctx!
    const at = this.t
    const sub = ctx.createOscillator()
    sub.frequency.setValueAtTime(120, at)
    sub.frequency.exponentialRampToValueAtTime(32, at + 0.9)
    const sg = ctx.createGain()
    sub.connect(sg).connect(this.master)
    this.env(sg, 0.7, 0.005, 1.6, at)
    sub.start(at)
    sub.stop(at + 1.8)

    const n = this.noiseSrc()
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(5000, at)
    lp.frequency.exponentialRampToValueAtTime(300, at + 0.6)
    const ng = ctx.createGain()
    n.connect(lp).connect(ng).connect(this.sfx)
    this.env(ng, 0.35, 0.002, 0.7, at)
    n.start(at)
    n.stop(at + 0.9)

    // 大三和弦 stab
    ;[0, 4, 7, 12, 16].forEach((s) => {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = hz(s + 12)
      o.detune.value = (Math.random() - 0.5) * 14
      const f = ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.setValueAtTime(4000, at)
      f.frequency.exponentialRampToValueAtTime(400, at + 2.4)
      const g = ctx.createGain()
      o.connect(f).connect(g).connect(this.sfx)
      this.env(g, 0.045, 0.01, 3, at)
      o.start(at)
      o.stop(at + 3.2)
    })
  }

  /** 字母砸入的打击 */
  hit(semitone = 0) {
    if (!this.ok()) return
    const ctx = this.ctx!
    const at = this.t
    const o = ctx.createOscillator()
    o.frequency.setValueAtTime(180, at)
    o.frequency.exponentialRampToValueAtTime(48, at + 0.18)
    const g = ctx.createGain()
    o.connect(g).connect(this.master)
    this.env(g, 0.55, 0.002, 0.4, at)
    o.start(at)
    o.stop(at + 0.5)
    const n = this.noiseSrc()
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 900 + semitone * 60
    const ng = ctx.createGain()
    n.connect(bp).connect(ng).connect(this.sfx)
    this.env(ng, 0.25, 0.001, 0.2, at)
    n.start(at, Math.random())
    n.stop(at + 0.3)
  }

  /** 开场逐档点亮的音 */
  tierPing(semitone: number) {
    if (!this.ok()) return
    this.pluck(hz(semitone), 0.09, 0.9, this.sfx)
    this.pluck(hz(semitone - 12), 0.05, 0.9, this.sfx)
  }
}

export const audio = new AudioEngine()
