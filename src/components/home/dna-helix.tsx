'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SAMPLES = 256
const TURNS = 4.7
const RUNG_COUNT = 56

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  switch (i % 6) {
    case 0: return [v, t, p]
    case 1: return [q, v, p]
    case 2: return [p, v, t]
    case 3: return [p, q, v]
    case 4: return [t, p, v]
    default: return [v, p, q]
  }
}

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private radius: number,
    private height: number,
    private phase: number
  ) {
    super()
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    const angle = t * TURNS * Math.PI * 2 + this.phase
    return target.set(
      Math.cos(angle) * this.radius,
      (0.5 - t) * this.height,
      Math.sin(angle) * this.radius
    )
  }
}

const STRAND_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

const STRAND_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uHeat;
  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    float heat = texture2D(uHeat, vec2(vUv.x, 0.5)).r;

    vec3 N = normalize(vNormal);
    vec3 V = normalize(-vViewPos);
    vec3 L1 = normalize(vec3(0.55, 0.65, 0.7));
    vec3 L2 = normalize(vec3(-0.6, -0.25, 0.5));

    float dif = max(dot(N, L1), 0.0) * 0.85 + max(dot(N, L2), 0.0) * 0.35;
    float spec = pow(max(dot(reflect(-L1, N), V), 0.0), 64.0);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.5);

    // Resting look: glossy porcelain white with a cool rim.
    vec3 base = vec3(0.88, 0.93, 1.0) * (0.42 + 0.6 * dif)
      + vec3(1.0) * spec * 0.9
      + vec3(0.62, 0.82, 1.0) * fres * 0.5;

    // Ignited look: liquid spectral color flowing along the strand.
    float hot = smoothstep(0.02, 0.55, heat);
    float flow = vUv.x * 10.0
      - uTime * 0.45
      + 0.42 * sin(vUv.x * 34.0 + uTime * 1.7)
      + 0.26 * sin(vUv.y * 6.2831 + uTime * 1.1)
      + heat * 0.7;
    vec3 rainbow = hsv2rgb(vec3(fract(flow), 0.97, 1.0));

    vec3 col = mix(
      base,
      rainbow * (0.5 + 0.5 * dif) + vec3(spec) * 0.9 + rainbow * fres * 0.7,
      hot
    );
    col += rainbow * hot * 0.5;

    float edge = smoothstep(0.0, 0.045, vUv.x) * (1.0 - smoothstep(0.955, 1.0, vUv.x));
    gl_FragColor = vec4(col, uOpacity * edge);
  }
`

/**
 * Hero DNA helix — real 3D (three.js).
 *
 * Two thick glossy-white tubes spin slowly around a vertical axis. Passing
 * the cursor directly over a strand injects "heat" at that spot; heat
 * diffuses along the strand like ink in water and drives a flowing spectral
 * shader — the liquid rainbow — then cools back to porcelain white. The
 * whole structure recedes as the hero scrolls away.
 */
export function DnaHelix() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -4000, 4000)
    camera.position.z = 600

    const group = new THREE.Group()
    scene.add(group)

    let width = 0
    let height = 0
    let scrollPhase = 0
    let heroFocus = 1
    let visible = true
    let raf = 0

    const pointer = { x: -9999, y: -9999, active: false }
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()

    // Heat per strand, diffused every frame so touches bleed like liquid.
    const heat = [new Float32Array(SAMPLES), new Float32Array(SAMPLES)]
    const scratch = new Float32Array(SAMPLES)
    const heatTextures = heat.map(() => {
      const tex = new THREE.DataTexture(
        new Uint8Array(SAMPLES * 4),
        SAMPLES,
        1,
        THREE.RGBAFormat
      )
      tex.magFilter = THREE.LinearFilter
      tex.minFilter = THREE.LinearFilter
      tex.needsUpdate = true
      return tex
    })

    const strandMaterials = heatTextures.map(
      (tex) =>
        new THREE.ShaderMaterial({
          vertexShader: STRAND_VERTEX,
          fragmentShader: STRAND_FRAGMENT,
          uniforms: {
            uHeat: { value: tex },
            uTime: { value: 0 },
            uOpacity: { value: 1 },
          },
          transparent: true,
        })
    )

    const strandMeshes = strandMaterials.map((material, index) => {
      const mesh = new THREE.Mesh(new THREE.BufferGeometry(), material)
      mesh.userData.strand = index
      group.add(mesh)
      return mesh
    })

    // Invisible fatter tubes make the cursor hit test forgiving.
    const hitMeshes = strandMeshes.map((_, index) => {
      const mesh = new THREE.Mesh(
        new THREE.BufferGeometry(),
        new THREE.MeshBasicMaterial()
      )
      mesh.userData.strand = index
      mesh.visible = false
      group.add(mesh)
      return mesh
    })

    const rungMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.42,
    })
    const rungGeometry = new THREE.CylinderGeometry(1, 1, 1, 8, 1)
    const rungs = new THREE.InstancedMesh(rungGeometry, rungMaterial, RUNG_COUNT)
    rungs.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(RUNG_COUNT * 3),
      3
    )
    group.add(rungs)

    const curves: [HelixCurve, HelixCurve] = [
      new HelixCurve(1, 1, 0),
      new HelixCurve(1, 1, Math.PI),
    ]

    const rebuildGeometry = () => {
      const mobile = width < 720
      const radius = clamp(width * (mobile ? 0.22 : 0.185), mobile ? 68 : 110, mobile ? 118 : 236)
      const tubeRadius = clamp(width * 0.011, 8, mobile ? 11 : 15)
      const helixHeight = height * 1.12

      curves[0] = new HelixCurve(radius, helixHeight, 0)
      curves[1] = new HelixCurve(radius, helixHeight, Math.PI)

      strandMeshes.forEach((mesh, index) => {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.TubeGeometry(curves[index], 420, tubeRadius, 14, false)
      })
      hitMeshes.forEach((mesh, index) => {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.TubeGeometry(curves[index], 140, tubeRadius * 3, 6, false)
      })

      const a = new THREE.Vector3()
      const b = new THREE.Vector3()
      const matrix = new THREE.Matrix4()
      const position = new THREE.Vector3()
      const quaternion = new THREE.Quaternion()
      const scale = new THREE.Vector3()
      const up = new THREE.Vector3(0, 1, 0)
      const dir = new THREE.Vector3()

      for (let i = 0; i < RUNG_COUNT; i += 1) {
        const t = mix(0.035, 0.965, i / (RUNG_COUNT - 1))
        curves[0].getPoint(t, a)
        curves[1].getPoint(t, b)
        position.addVectors(a, b).multiplyScalar(0.5)
        dir.subVectors(b, a)
        const length = dir.length()
        quaternion.setFromUnitVectors(up, dir.normalize())
        scale.set(tubeRadius * 0.32, length, tubeRadius * 0.32)
        matrix.compose(position, quaternion, scale)
        rungs.setMatrixAt(i, matrix)
      }
      rungs.instanceMatrix.needsUpdate = true
      group.position.x = mobile ? 0 : width * 0.03
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      camera.left = -width / 2
      camera.right = width / 2
      camera.top = height / 2
      camera.bottom = -height / 2
      camera.updateProjectionMatrix()
      rebuildGeometry()
    }

    const onScroll = () => {
      const rect = parent.getBoundingClientRect()
      const travel = window.innerHeight + rect.height
      scrollPhase = clamp((window.innerHeight - rect.top) / Math.max(1, travel), 0, 1)
      heroFocus = 1 - smoothstep(0.12, 0.92, window.scrollY / Math.max(1, window.innerHeight))
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      pointer.x = x
      pointer.y = y
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    resize()
    onScroll()

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting)
      },
      { rootMargin: '180px' }
    )
    io.observe(parent)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    const injectHeat = (strand: number, t: number) => {
      const center = t * (SAMPLES - 1)
      for (let di = -9; di <= 9; di += 1) {
        const idx = Math.round(center + di)
        if (idx < 0 || idx >= SAMPLES) continue
        const gain = Math.exp((-di * di) / 16) * 0.6
        heat[strand][idx] = Math.min(1.35, heat[strand][idx] + gain)
      }
    }

    const stepHeat = (dt: number) => {
      // Time-based so the cool-down takes ~1.8s regardless of frame rate.
      const decay = Math.pow(reduceMotion ? 0.012 : 0.18, dt)
      for (let s = 0; s < 2; s += 1) {
        const arr = heat[s]
        for (let i = 0; i < SAMPLES; i += 1) {
          const left = arr[Math.max(0, i - 1)]
          const right = arr[Math.min(SAMPLES - 1, i + 1)]
          scratch[i] = (arr[i] * 0.62 + (left + right) * 0.19) * decay
        }
        arr.set(scratch)

        const data = heatTextures[s].image.data as Uint8Array
        for (let i = 0; i < SAMPLES; i += 1) {
          data[i * 4] = Math.min(255, arr[i] * 255)
        }
        heatTextures[s].needsUpdate = true
      }
    }

    const pickAndIgnite = () => {
      if (!pointer.active) return
      ndc.set((pointer.x / width) * 2 - 1, -(pointer.y / height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(hitMeshes, false)
      const hit = hits[0]
      if (hit?.uv) {
        injectHeat(hit.object.userData.strand as number, hit.uv.x)
      }
    }

    const rungColor = new THREE.Color()
    const updateRungColors = (timeSec: number) => {
      for (let i = 0; i < RUNG_COUNT; i += 1) {
        const t = mix(0.035, 0.965, i / (RUNG_COUNT - 1))
        const idx = Math.round(t * (SAMPLES - 1))
        const h = Math.max(heat[0][idx], heat[1][idx])
        const hot = smoothstep(0.02, 0.55, h)
        // Mirror the strand shader's flowing hue so rungs match their strands.
        const hue = (((t * 10 - timeSec * 0.45) % 1) + 1) % 1
        const [r, g, b] = hsvToRgb(hue, 0.97, 1)
        rungColor.setRGB(
          mix(0.94, r, hot),
          mix(0.97, g, hot),
          mix(1.0, b, hot)
        )
        rungs.setColorAt(i, rungColor)
      }
      if (rungs.instanceColor) rungs.instanceColor.needsUpdate = true
    }

    let lastTime = 0
    const render = (timeMs: number) => {
      raf = requestAnimationFrame(render)
      if (!visible) return

      const time = timeMs / 1000
      const dt = clamp(time - (lastTime || time), 0.001, 0.1)
      lastTime = time
      const presence = mix(0.22, 1, heroFocus)

      pickAndIgnite()
      stepHeat(dt)
      updateRungColors(time)

      group.rotation.y = (reduceMotion ? 0 : time * 0.42) + scrollPhase * Math.PI * 2.1

      strandMaterials.forEach((material) => {
        material.uniforms.uTime.value = time
        material.uniforms.uOpacity.value = presence
      })
      rungMaterial.opacity = 0.42 * presence

      renderer.render(scene, camera)
    }

    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerLeave)
      window.removeEventListener('scroll', onScroll)
      strandMeshes.forEach((mesh) => mesh.geometry.dispose())
      hitMeshes.forEach((mesh) => {
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
      })
      strandMaterials.forEach((material) => material.dispose())
      heatTextures.forEach((tex) => tex.dispose())
      rungGeometry.dispose()
      rungMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{
        background:
          'radial-gradient(1100px 760px at 50% 30%, #0a2236 0%, #061a2e 46%, #010712 100%)',
      }}
    />
  )
}
