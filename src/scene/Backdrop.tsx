import { Stars } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { TOWER_TOP } from '../data/tiers'

// 星云只在启动时往一张等距柱状贴图里烘焙一次，之后当天空背景用（每帧只采样一次贴图）
const nebulaVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

const nebulaFrag = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
float noise(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
void main() {
  // 逐像素把 uv 还原成方向，与 three 的 equirect 背景采样（atan(z, x) / asin(y)）互逆
  float lon = (vUv.x - 0.5) * 6.28318530718;
  float lat = (vUv.y - 0.5) * 3.14159265359;
  vec3 d = vec3(cos(lat) * cos(lon), sin(lat), cos(lat) * sin(lon));
  float h = d.y;
  vec3 top = vec3(0.10, 0.03, 0.20);
  vec3 mid = vec3(0.012, 0.014, 0.04);
  vec3 bot = vec3(0.0, 0.03, 0.06);
  vec3 col = h > 0.0 ? mix(mid, top, smoothstep(0.0, 1.0, h)) : mix(mid, bot, smoothstep(0.0, -1.0, h));
  float n = fbm(d * 2.2 + vec3(0.0, uTime * 0.01, uTime * 0.006));
  float n2 = fbm(d * 4.0 - vec3(uTime * 0.008));
  col += vec3(0.45, 0.10, 0.55) * pow(n, 3.0) * 0.55 * smoothstep(-0.2, 0.6, h);
  col += vec3(0.05, 0.25, 0.55) * pow(n2, 3.5) * 0.5;
  // 顶部「天门」光晕
  col += vec3(1.0, 0.45, 0.9) * pow(max(h, 0.0), 14.0) * 0.5;
  gl_FragColor = vec4(col, 1.0);
}`

function useBakedNebula() {
  const gl = useThree((st) => st.gl)
  const target = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(2048, 1024, { type: THREE.HalfFloatType, depthBuffer: false })
    const mat = new THREE.ShaderMaterial({ vertexShader: nebulaVert, fragmentShader: nebulaFrag, uniforms: { uTime: { value: 0 } } })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
    const scene = new THREE.Scene()
    scene.add(quad)
    const prev = gl.getRenderTarget()
    gl.setRenderTarget(rt)
    gl.render(scene, new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1))
    gl.setRenderTarget(prev)
    mat.dispose()
    quad.geometry.dispose()
    rt.texture.mapping = THREE.EquirectangularReflectionMapping
    return rt
  }, [gl])
  useEffect(() => () => target.dispose(), [target])
  return target.texture
}

export function Backdrop() {
  const scene = useThree((st) => st.scene)
  const sky = useBakedNebula()
  useEffect(() => {
    scene.background = sky
    return () => {
      scene.background = null
    }
  }, [scene, sky])
  // 星云缓慢自转，代替原来逐帧重算噪声
  useFrame((st) => {
    scene.backgroundRotation.y = st.clock.elapsedTime * 0.004
  })
  return (
    <>
      <Stars radius={220} depth={120} count={4000} factor={5} saturation={0.6} fade speed={0.6} />
      <RisingMotes />
    </>
  )
}

/** 沿塔身缓缓上升的光尘：位移全在顶点着色器里算，CPU 每帧只更新一个时间 uniform */
const moteVert = /* glsl */ `
attribute float aSpeed;
attribute vec3 aColor;
uniform float uTime;
uniform float uRange;
uniform float uPx;
varying vec3 vColor;
void main() {
  vec3 p = position;
  p.y = -12.0 + mod(p.y + 12.0 + uTime * aSpeed, uRange);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = 0.28 * uPx / -mv.z;
  vColor = aColor;
}`
const moteFrag = /* glsl */ `
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor * a * 0.85, a * 0.85);
}`

function RisingMotes({ count = 1400 }) {
  const size = useThree((st) => st.size)
  const dpr = useThree((st) => st.viewport.dpr)
  const { geo, mat } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const palette = ['#ff4fd8', '#b26bff', '#4dabf7', '#ffffff', '#ffa94d'].map((c) => new THREE.Color(c))
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.pow(Math.random(), 0.7) * 34
      const a = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = -12 + Math.random() * (TOWER_TOP + 34)
      pos[i * 3 + 2] = Math.sin(a) * r
      const c = palette[Math.floor(Math.random() * palette.length)]
      col.set([c.r, c.g, c.b], i * 3)
      speeds[i] = 0.3 + Math.random() * 1.2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    // 粒子在动，包围球要足够大，避免被错误剔除
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, TOWER_TOP / 2, 0), 200)
    const mat = new THREE.ShaderMaterial({
      vertexShader: moteVert,
      fragmentShader: moteFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uRange: { value: TOWER_TOP + 34 }, uPx: { value: 800 } },
    })
    return { geo, mat }
  }, [count])
  useEffect(
    () => () => {
      geo.dispose()
      mat.dispose()
    },
    [geo, mat],
  )
  // 与 sizeAttenuation 的 PointsMaterial 相同的屏幕尺寸换算
  mat.uniforms.uPx.value = (size.height * dpr) / 2
  useFrame((st) => (mat.uniforms.uTime.value = st.clock.elapsedTime))
  return <points geometry={geo} material={mat} />
}
