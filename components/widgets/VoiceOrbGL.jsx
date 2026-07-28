'use client'

import { useEffect, useRef } from 'react'

/* WebGL orb for the voice widget — the reference shader recolored to the
   brand blues (#3B82F6 / #06b6d4 / #22396E) on the site's light background.
   One small canvas, mounted only while the widget is open. Falls back to a
   CSS conic ring without WebGL; renders a single static frame under
   reduced motion. */

const VERT = `
precision highp float;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
uniform float iTime;
uniform vec3 iResolution;
varying vec2 vUv;

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
  p3 += dot(p3, p3.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3(p3.x + p3.y, p3.x + p3.z, p3.y + p3.z) * p3.zyx);
}
float snoise3(vec3 p) {
  const float K1 = 0.333333333;
  const float K2 = 0.166666667;
  vec3 i = floor(p + (p.x + p.y + p.z) * K1);
  vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
  vec3 e = step(vec3(0.0), d0 - d0.yzx);
  vec3 i1 = e * (1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy * (1.0 - e);
  vec3 d1 = d0 - (i1 - K2);
  vec3 d2 = d0 - (i2 - K1);
  vec3 d3 = d0 - 0.5;
  vec4 h = max(0.6 - vec4(dot(d0,d0), dot(d1,d1), dot(d2,d2), dot(d3,d3)), 0.0);
  vec4 n = h * h * h * h * vec4(
    dot(d0, hash33(i)),
    dot(d1, hash33(i + i1)),
    dot(d2, hash33(i + i2)),
    dot(d3, hash33(i + 1.0))
  );
  return dot(vec4(31.316), n);
}
vec4 extractAlpha(vec3 colorIn) {
  float a = max(max(colorIn.r, colorIn.g), colorIn.b);
  return vec4(colorIn.rgb / (a + 1e-5), a);
}

const vec3 color1 = vec3(0.231, 0.510, 0.965); /* #3B82F6 sapphire */
const vec3 color2 = vec3(0.024, 0.714, 0.831); /* #06b6d4 cyan */
const vec3 color3 = vec3(0.137, 0.224, 0.431); /* #22396E navy */
/* Black background = fully transparent outside the glowing ring (the
   canvas composites over the page with no visible disc behind it). */
const vec3 backgroundColor = vec3(0.0, 0.0, 0.0);
const float innerRadius = 0.6;
const float noiseScale = 0.65;

float light1(float intensity, float attenuation, float dist) {
  return intensity / (1.0 + dist * attenuation);
}
float light2(float intensity, float attenuation, float dist) {
  return intensity / (1.0 + dist * dist * attenuation);
}

vec4 draw(vec2 uv) {
  float len = length(uv);
  float invLen = len > 0.0 ? 1.0 / len : 0.0;
  float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));
  float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
  float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
  float d0 = distance(uv, (r0 * invLen) * uv);
  float v0 = light1(1.0, 10.0, d0);
  v0 *= smoothstep(r0 * 1.05, r0, len);
  float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
  v0 *= mix(innerFade, 1.0, bgLuminance * 0.7);
  float ang = atan(uv.y, uv.x);
  float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
  float a = iTime * -1.0;
  vec2 pos = vec2(cos(a), sin(a)) * r0;
  float d = distance(uv, pos);
  float v1 = light2(1.5, 5.0, d);
  v1 *= light1(1.0, 50.0, d0);
  float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
  float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
  vec3 colBase = mix(color1, color2, cl);
  float fadeAmount = mix(1.0, 0.1, bgLuminance);
  vec3 darkCol = mix(color3, colBase, v0);
  darkCol = (darkCol + v1) * v2 * v3;
  darkCol = clamp(darkCol, 0.0, 1.0);
  vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
  lightCol = mix(backgroundColor, lightCol, v0);
  lightCol = clamp(lightCol, 0.0, 1.0);
  vec3 finalCol = mix(darkCol, lightCol, bgLuminance);
  return extractAlpha(finalCol);
}

void main() {
  vec2 center = iResolution.xy * 0.5;
  float size = min(iResolution.x, iResolution.y);
  vec2 uv = (vUv * iResolution.xy - center) / size * 2.0;
  vec4 col = draw(uv);
  gl_FragColor = vec4(col.rgb * col.a, col.a);
}
`

const FALLBACK_RING =
  'conic-gradient(from 210deg, #22396E 0deg, #3859a8 90deg, #3B82F6 180deg, #06b6d4 265deg, #22396E 360deg)'

export function VoiceOrbGL({ size = 170, speed = 1, className = '', style }) {
  const containerRef = useRef(null)
  const speedRef = useRef(speed)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    container.appendChild(canvas)

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!gl) {
      canvas.remove()
      container.style.background = FALLBACK_RING
      return
    }

    gl.clearColor(0, 0, 0, 0)

    const makeShader = (type, source) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = makeShader(gl.VERTEX_SHADER, VERT)
    const fs = makeShader(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      canvas.remove()
      container.style.background = FALLBACK_RING
      return
    }

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.remove()
      container.style.background = FALLBACK_RING
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, 'iTime')
    const uRes = gl.getUniformLocation(program, 'iResolution')

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    gl.viewport(0, 0, canvas.width, canvas.height)

    const drawFrame = (t) => {
      gl.uniform1f(uTime, t)
      gl.uniform3f(uRes, canvas.width, canvas.height, 1)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    let raf = 0
    let virtual = 0
    let last = null
    if (reduce) {
      drawFrame(1.5)
    } else {
      const loop = (ts) => {
        raf = requestAnimationFrame(loop)
        if (last === null) last = ts
        virtual += ((ts - last) / 1000) * speedRef.current
        last = ts
        drawFrame(virtual)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      canvas.remove()
      const lose = gl.getExtension('WEBGL_lose_context')
      lose?.loseContext()
    }
  }, [size])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, ...style }}
    />
  )
}
