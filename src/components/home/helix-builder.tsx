'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type HelixPoint = {
  left: THREE.Vector3
  right: THREE.Vector3
  y: number
}

type BuildParticle = {
  mesh: THREE.Mesh
  halo: THREE.Sprite
  target: THREE.Vector3
  start: THREE.Vector3
  control: THREE.Vector3
  rung: number
  order: number
  seed: number
}

type RungBuild = {
  mesh: THREE.Mesh
  glow: THREE.Mesh
  leftCap: THREE.Mesh
  rightCap: THREE.Mesh
  seal: THREE.Mesh
  sealHalo: THREE.Sprite
  leftSealHalo: THREE.Sprite
  rightSealHalo: THREE.Sprite
  rung: number
}

type StrandBuild = {
  mesh: THREE.Mesh
  glow: THREE.Mesh
  rung: number
}

type BreakawayOrb = {
  mesh: THREE.Mesh
  origin: THREE.Vector3
  control: THREE.Vector3
  end: THREE.Vector3
  seed: number
  trigger: number
}

type CursorOrb = {
  mesh: THREE.Mesh
  offset: THREE.Vector3
  lag: number
  velocity: THREE.Vector3
  burst: number
}

const RUNG_COUNT = 96
const PARTICLES_PER_RUNG = 7
const HELIX_HEIGHT = 30
const HELIX_RADIUS = 1.9
const HELIX_TURNS = 4.4
const RUNG_STEP_SECONDS = 0.92
const ORB_TRAVEL_SECONDS = 5.65
const PREBUILT_RUNG_WINDOW = 34
const CYCLE_DURATION = RUNG_COUNT * RUNG_STEP_SECONDS + 7

const DNA_WHITE = new THREE.Color('#f7fbff')
const DNA_BLUE_WHITE = new THREE.Color('#e9f5ff')
const PALETTE = ['#eb201b', '#f5762c', '#fed434', '#a8e648', '#4fd196', '#37b5db', '#4d5bd6', '#ce2edf']

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function easeInOutCubic(value: number) {
  const t = clamp(value, 0, 1)
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function easeOutCubic(value: number) {
  const t = clamp(value, 0, 1)
  return 1 - Math.pow(1 - t, 3)
}

function easeInOutSine(value: number) {
  const t = clamp(value, 0, 1)
  return -(Math.cos(Math.PI * t) - 1) / 2
}

function paletteColor(seed: number, time: number) {
  const index = Math.abs(Math.floor(seed + time * 1.15)) % PALETTE.length
  const next = (index + 1) % PALETTE.length
  const mix = (Math.sin(time * 1.35 + seed * 0.41) + 1) / 2

  return new THREE.Color(PALETTE[index]).lerp(new THREE.Color(PALETTE[next]), mix * 0.42)
}

function rainbowColor(seed: number, time: number) {
  const color = new THREE.Color()
  color.setHSL(((seed * 0.087 + time * 0.08) % 1 + 1) % 1, 0.98, 0.68)
  return color
}

function bezierPoint(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, t: number) {
  const one = 1 - t
  return new THREE.Vector3()
    .addScaledVector(a, one * one)
    .addScaledVector(b, 2 * one * t)
    .addScaledVector(c, t * t)
}

function makeHelixPoints() {
  const points: HelixPoint[] = []

  for (let i = 0; i < RUNG_COUNT; i += 1) {
    const t = i / (RUNG_COUNT - 1)
    const y = -HELIX_HEIGHT / 2 + t * HELIX_HEIGHT
    const angle = t * Math.PI * 2 * HELIX_TURNS - 0.66
    const x = Math.sin(angle) * HELIX_RADIUS
    const z = Math.cos(angle) * 0.92

    points.push({
      left: new THREE.Vector3(x, y, z),
      right: new THREE.Vector3(-x, y, -z),
      y,
    })
  }

  return points
}

function makeSegment(start: THREE.Vector3, end: THREE.Vector3, radius: number, material: THREE.Material) {
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  const direction = new THREE.Vector3().subVectors(end, start)
  const length = direction.length()
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 24, 1)
  const mesh = new THREE.Mesh(geometry, material)

  mesh.position.copy(midpoint)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())

  return mesh
}

function revealForRung(loopTime: number, rung: number, order = PARTICLES_PER_RUNG - 1) {
  const local =
    (loopTime + PREBUILT_RUNG_WINDOW * RUNG_STEP_SECONDS - rung * RUNG_STEP_SECONDS - order * 0.08) /
    ORB_TRAVEL_SECONDS

  return {
    local,
    reveal: easeOutCubic((local - 0.92) / 0.08),
    seal: Math.exp(-Math.pow((local - 0.94) / 0.07, 2)),
  }
}

export function HelixBuilder() {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch (error) {
      console.error('Unable to initialize DNA helix WebGL scene', error)
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 130)
    const root = new THREE.Group()
    const helix = makeHelixPoints()
    const pointer = new THREE.Vector2(9, 9)
    const pointerWorld = new THREE.Vector3()
    const hoverHeat = new Array(RUNG_COUNT).fill(0) as number[]
    const resolvedObjects: THREE.Object3D[] = []
    const strands: StrandBuild[] = []
    const rungBuilds: RungBuild[] = []
    const buildParticles: BuildParticle[] = []
    const breakaways: BreakawayOrb[] = []
    const cursorOrbs: CursorOrb[] = []
    const raycaster = new THREE.Raycaster()
    const startTime = performance.now()
    const scrollHost = host.closest<HTMLElement>('[data-helix-scroll]') ?? host

    let frame = 0
    let disposed = false
    let scrollProgress = 0
    let aspect = 1
    let smoothActiveY = helix[Math.floor(PREBUILT_RUNG_WINDOW * 0.82)]?.y ?? helix[0].y

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    host.appendChild(renderer.domElement)

    root.position.set(0, 0, 0)
    scene.add(root)
    scene.fog = new THREE.FogExp2('#01030a', 0.024)

    const ambient = new THREE.AmbientLight('#dbe8ff', 1.15)
    const key = new THREE.DirectionalLight('#ffffff', 2.55)
    const rim = new THREE.PointLight('#d9e8ff', 8.6, 42)
    const underGlow = new THREE.PointLight('#6d5bff', 4.4, 28)

    key.position.set(-4, 9, 8)
    rim.position.set(4, 4, -6)
    underGlow.position.set(0, -10, 5)
    scene.add(ambient, key, rim, underGlow)

    const starGeometry = new THREE.SphereGeometry(0.018, 8, 8)
    const innerOrbGeometry = new THREE.SphereGeometry(0.055, 18, 18)
    const endpointOrbGeometry = new THREE.SphereGeometry(0.08, 18, 18)
    const lockCapGeometry = new THREE.SphereGeometry(0.255, 28, 18)
    const cursorOrbGeometry = new THREE.SphereGeometry(0.014, 12, 12)

    for (let i = 0; i < 240; i += 1) {
      const star = new THREE.Mesh(
        starGeometry,
        new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.62 + Math.random() * 0.12, 0.4, 0.72),
          transparent: true,
          opacity: 0.08 + Math.random() * 0.26,
          depthWrite: false,
        }),
      )
      const angle = Math.random() * Math.PI * 2
      const radius = 8 + Math.random() * 20

      star.position.set(Math.cos(angle) * radius, -13 + Math.random() * 32, Math.sin(angle) * radius - 10)
      scene.add(star)
    }

    const makeWhiteMaterial = (opacity = 0) =>
      new THREE.MeshStandardMaterial({
        color: '#f7fbff',
        emissive: '#eef7ff',
        emissiveIntensity: 0.26,
        metalness: 0.01,
        roughness: 0.78,
        transparent: true,
        opacity,
        depthWrite: true,
      })

    const makeGlowMaterial = (opacity = 0) =>
      new THREE.MeshBasicMaterial({
        color: '#f8fbff',
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      })

    const glowTexture = (() => {
      const canvas = document.createElement('canvas')
      const size = 128
      const center = size / 2
      const context = canvas.getContext('2d')

      canvas.width = size
      canvas.height = size

      if (context) {
        const gradient = context.createRadialGradient(center, center, 1, center, center, center)

        gradient.addColorStop(0, 'rgba(255,255,255,1)')
        gradient.addColorStop(0.18, 'rgba(255,255,255,0.78)')
        gradient.addColorStop(0.42, 'rgba(255,255,255,0.28)')
        gradient.addColorStop(1, 'rgba(255,255,255,0)')
        context.fillStyle = gradient
        context.fillRect(0, 0, size, size)
      }

      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace

      return texture
    })()

    const makeGlowSprite = (color = '#f8fbff') => {
      const material = new THREE.SpriteMaterial({
        map: glowTexture,
        color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      })
      const sprite = new THREE.Sprite(material)

      sprite.renderOrder = 30

      return sprite
    }

    for (let i = 0; i < helix.length - 1; i += 1) {
      const left = makeSegment(helix[i].left, helix[i + 1].left, 0.255, makeWhiteMaterial())
      const right = makeSegment(helix[i].right, helix[i + 1].right, 0.255, makeWhiteMaterial())
      const leftGlow = makeSegment(helix[i].left, helix[i + 1].left, 0.42, makeGlowMaterial())
      const rightGlow = makeSegment(helix[i].right, helix[i + 1].right, 0.42, makeGlowMaterial())

      left.userData.rung = i
      right.userData.rung = i
      left.renderOrder = 4
      right.renderOrder = 4
      leftGlow.renderOrder = 1
      rightGlow.renderOrder = 1
      root.add(leftGlow, rightGlow, left, right)
      strands.push({ mesh: left, glow: leftGlow, rung: i }, { mesh: right, glow: rightGlow, rung: i })
      resolvedObjects.push(left, right)
    }

    helix.forEach((point, rung) => {
      const rungMaterial = makeWhiteMaterial()
      const glowMaterial = makeGlowMaterial()
      const capMaterial = makeWhiteMaterial()
      const sealMaterial = makeGlowMaterial()
      const rungMesh = makeSegment(point.left, point.right, 0.092, rungMaterial)
      const rungGlow = makeSegment(point.left, point.right, 0.24, glowMaterial)
      const leftCap = new THREE.Mesh(lockCapGeometry, capMaterial.clone())
      const rightCap = new THREE.Mesh(lockCapGeometry, capMaterial.clone())
      const seal = makeSegment(point.left, point.right, 0.24, sealMaterial)
      const sealHalo = makeGlowSprite()
      const leftSealHalo = makeGlowSprite()
      const rightSealHalo = makeGlowSprite()
      const center = new THREE.Vector3().addVectors(point.left, point.right).multiplyScalar(0.5)

      rungMesh.userData.rung = rung
      rungMesh.renderOrder = 8
      rungGlow.renderOrder = 6
      leftCap.renderOrder = 9
      rightCap.renderOrder = 9
      seal.renderOrder = 12
      leftCap.position.copy(point.left)
      rightCap.position.copy(point.right)
      sealHalo.position.copy(center)
      leftSealHalo.position.copy(point.left)
      rightSealHalo.position.copy(point.right)
      root.add(rungGlow, rungMesh, leftCap, rightCap, seal, sealHalo, leftSealHalo, rightSealHalo)
      rungBuilds.push({ mesh: rungMesh, glow: rungGlow, leftCap, rightCap, seal, sealHalo, leftSealHalo, rightSealHalo, rung })
      resolvedObjects.push(rungMesh, leftCap, rightCap)

      for (let p = 0; p < PARTICLES_PER_RUNG; p += 1) {
        const amount = p / (PARTICLES_PER_RUNG - 1)
        const target = new THREE.Vector3().lerpVectors(point.left, point.right, amount)
        const seed = rung * 17 + p * 11
        const side = (seed % 2 === 0 ? 1 : -1) * (2.8 + (seed % 5) * 0.28)
        const fromSide = seed % 9 === 0
        const start = new THREE.Vector3(
          fromSide ? target.x + side * 1.35 : target.x + side,
          target.y - 12.4 - (seed % 8) * 0.34,
          target.z + 6.2 + Math.sin(seed * 0.73) * 2.6,
        )
        const control = new THREE.Vector3(
          target.x + side * 1.02 + Math.sin(seed) * 1.1,
          target.y - 5.9 - (seed % 4) * 0.42,
          target.z + 4.35 + Math.cos(seed * 0.51) * 1.5,
        )
        const material = new THREE.MeshBasicMaterial({
          color: paletteColor(seed, 0),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const orb = new THREE.Mesh(p === 0 || p === PARTICLES_PER_RUNG - 1 ? endpointOrbGeometry : innerOrbGeometry, material)
        const halo = makeGlowSprite(paletteColor(seed, 0).getStyle())

        orb.renderOrder = 18
        orb.position.copy(start)
        halo.renderOrder = 17
        halo.position.copy(start)
        root.add(halo, orb)
        buildParticles.push({ mesh: orb, halo, target, start, control, rung, order: p, seed })
      }

      if (rung % 2 === 0) {
        for (const origin of [point.left, point.right, new THREE.Vector3().lerpVectors(point.left, point.right, 0.5)]) {
          const seed = rung * 23 + breakaways.length * 7
          const end = new THREE.Vector3(
            origin.x + Math.sin(seed) * 2.8,
            origin.y - 15.2 - (seed % 9) * 0.56,
            origin.z + 5.6 + Math.cos(seed * 0.7) * 2.1,
          )
          const control = new THREE.Vector3(
            origin.x + Math.cos(seed * 0.4) * 3.8,
            origin.y - 7.4,
            origin.z + 4.5,
          )
          const orb = new THREE.Mesh(
            seed % 3 === 0 ? endpointOrbGeometry : innerOrbGeometry,
            new THREE.MeshBasicMaterial({
              color: paletteColor(seed, 0),
              transparent: true,
              opacity: 0,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            }),
          )

          orb.renderOrder = 24
          root.add(orb)
          breakaways.push({
            mesh: orb,
            origin: origin.clone(),
            control,
            end,
            seed,
            trigger: 0.04 + (seed % 37) / 78,
          })
        }
      }
    })

    for (let i = 0; i < 11; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: paletteColor(i * 9, 0),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      })
      const mesh = new THREE.Mesh(cursorOrbGeometry, material)

      mesh.renderOrder = 40
      scene.add(mesh)
      cursorOrbs.push({
        mesh,
        lag: 0.08 + i * 0.025,
        offset: new THREE.Vector3(Math.sin(i * 1.7) * 0.16, Math.cos(i * 1.3) * 0.16, 0),
        velocity: new THREE.Vector3(),
        burst: 0,
      })
    }

    const updateScroll = () => {
      const rect = scrollHost.getBoundingClientRect()
      const span = Math.max(1, rect.height - window.innerHeight)
      scrollProgress = clamp(-rect.top / span, 0, 1)
    }

    const resize = () => {
      const width = Math.max(host.clientWidth, 1)
      const height = Math.max(host.clientHeight, 1)

      aspect = width / height
      renderer.setSize(width, height, false)
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      updateScroll()
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    }

    const onPointerLeave = () => {
      pointer.set(9, 9)
    }

    const onPointerDown = () => {
      if (pointer.x >= 2) return

      cursorOrbs.forEach((orb, index) => {
        const angle = index * 2.399 + performance.now() * 0.001
        const force = 0.72 + (index % 5) * 0.14

        orb.velocity.set(Math.cos(angle) * force, Math.sin(angle) * force, 0.2 + Math.sin(angle * 1.7) * 0.18)
        orb.burst = 1
      })
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    window.addEventListener('scroll', updateScroll, { passive: true })
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerleave', onPointerLeave)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    resize()

    const animate = () => {
      if (disposed) return

      const time = (performance.now() - startTime) / 1000
      const loopTime = time % CYCLE_DURATION
      const activeRung = clamp(
        loopTime / RUNG_STEP_SECONDS + PREBUILT_RUNG_WINDOW - (ORB_TRAVEL_SECONDS * 0.78) / RUNG_STEP_SECONDS,
        0,
        RUNG_COUNT - 1,
      )
      const activeIndex = Math.floor(activeRung)
      const activeMix = activeRung - activeIndex
      const activeYTarget = THREE.MathUtils.lerp(
        helix[activeIndex]?.y ?? helix[0].y,
        helix[Math.min(RUNG_COUNT - 1, activeIndex + 1)]?.y ?? helix[RUNG_COUNT - 1].y,
        activeMix,
      )
      smoothActiveY = THREE.MathUtils.lerp(smoothActiveY, activeYTarget, 0.055)
      const activeY = smoothActiveY
      const lowerY = activeY - (aspect < 1 ? 17 : 24)
      const upperY = activeY + (aspect < 1 ? 5.5 : 7.6)
      const scrollBreak = easeInOutSine(scrollProgress)
      const structureScrollFade = 1 - scrollBreak * 0.42
      const cameraDistance = aspect < 1 ? 19.5 : 16.2
      const rootScale = aspect < 1 ? 1.26 : 1.55
      const activeWorldY = activeY * rootScale
      const cameraHeight = activeWorldY - 6.1 + scrollBreak * 0.55 + Math.sin(time * 0.5) * 0.08
      const lookAtY = activeWorldY + 4.15 - scrollBreak * 0.35

      root.scale.setScalar(rootScale)
      camera.position.set(Math.sin(time * 0.12) * 1.85, cameraHeight, cameraDistance)
      camera.lookAt(Math.sin(time * 0.16) * 0.38, lookAtY, -0.85)
      root.rotation.y = 0.16 + Math.sin(time * 0.1) * 0.24

      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(resolvedObjects, false)[0]

      if (hit?.object.userData.rung !== undefined) {
        const hitRung = Number(hit.object.userData.rung)
        for (let i = Math.max(0, hitRung - 4); i <= Math.min(RUNG_COUNT - 1, hitRung + 4); i += 1) {
          hoverHeat[i] = Math.max(hoverHeat[i], 1 - Math.abs(i - hitRung) * 0.14)
        }
      }

      for (let i = 0; i < hoverHeat.length; i += 1) {
        hoverHeat[i] *= 0.72
      }

      strands.forEach((strand) => {
        const { reveal } = revealForRung(loopTime, strand.rung)
        const inWindow = helix[strand.rung].y >= lowerY && helix[strand.rung].y <= upperY
        const heat = hoverHeat[strand.rung]
        const mat = strand.mesh.material as THREE.MeshStandardMaterial
        const glowMat = strand.glow.material as THREE.MeshBasicMaterial
        const opacity = inWindow && reveal > 0.08 ? structureScrollFade : 0

        mat.opacity = opacity
        mat.color.copy(DNA_WHITE)
        mat.emissive.copy(DNA_WHITE).multiplyScalar(0.32 + heat * 0.2)
        glowMat.opacity = opacity * (0.07 + Math.sin(time * 2 + strand.rung) * 0.012 + heat * 0.58)
        glowMat.color.copy(heat > 0.08 ? rainbowColor(strand.rung + 14, time) : DNA_BLUE_WHITE)
      })

      rungBuilds.forEach((build) => {
        const { reveal, seal } = revealForRung(loopTime, build.rung)
        const y = helix[build.rung].y
        const inWindow = y >= lowerY && y <= upperY
        const heat = hoverHeat[build.rung]
        const baseOpacity = inWindow && reveal > 0.08 ? structureScrollFade : 0
        const rungMat = build.mesh.material as THREE.MeshStandardMaterial
        const glowMat = build.glow.material as THREE.MeshBasicMaterial
        const leftCapMat = build.leftCap.material as THREE.MeshStandardMaterial
        const rightCapMat = build.rightCap.material as THREE.MeshStandardMaterial
        const sealMat = build.seal.material as THREE.MeshBasicMaterial
        const sealHaloMat = build.sealHalo.material as THREE.SpriteMaterial
        const leftSealHaloMat = build.leftSealHalo.material as THREE.SpriteMaterial
        const rightSealHaloMat = build.rightSealHalo.material as THREE.SpriteMaterial
        const whiteFlash = seal * (1 - scrollBreak * 0.5)

        rungMat.opacity = baseOpacity
        rungMat.color.copy(DNA_BLUE_WHITE)
        rungMat.emissive.copy(DNA_BLUE_WHITE).multiplyScalar(0.18 + heat * 0.15)
        glowMat.opacity = baseOpacity * (0.025 + heat * 0.3)
        glowMat.color.copy(heat > 0.08 ? rainbowColor(build.rung + 8, time) : DNA_BLUE_WHITE)
        leftCapMat.opacity = baseOpacity
        rightCapMat.opacity = baseOpacity
        leftCapMat.color.copy(DNA_WHITE)
        leftCapMat.emissive.copy(DNA_WHITE).multiplyScalar(0.28 + heat * 0.18)
        rightCapMat.color.copy(DNA_WHITE)
        rightCapMat.emissive.copy(DNA_WHITE).multiplyScalar(0.28 + heat * 0.18)
        sealMat.opacity = whiteFlash * 0.16
        build.seal.scale.setScalar(1 + whiteFlash * 0.24)
        sealHaloMat.opacity = whiteFlash * 0.46
        leftSealHaloMat.opacity = whiteFlash * 0.34
        rightSealHaloMat.opacity = whiteFlash * 0.34
        sealHaloMat.color.copy(DNA_WHITE)
        leftSealHaloMat.color.copy(DNA_WHITE)
        rightSealHaloMat.color.copy(DNA_WHITE)
        build.sealHalo.scale.set(1.55 + whiteFlash * 1.35, 1.55 + whiteFlash * 1.35, 1)
        build.leftSealHalo.scale.set(0.9 + whiteFlash * 0.75, 0.9 + whiteFlash * 0.75, 1)
        build.rightSealHalo.scale.set(0.9 + whiteFlash * 0.75, 0.9 + whiteFlash * 0.75, 1)
      })

      buildParticles.forEach((particle) => {
        const { local, seal } = revealForRung(loopTime, particle.rung, particle.order)
        const progress = easeInOutSine(local)
        const settle = easeOutCubic((local - 0.78) / 0.2)
        const visible = local > -0.1 && local < 1.03 && scrollBreak < 0.78
        const heat = hoverHeat[particle.rung]
        const material = particle.mesh.material as THREE.MeshBasicMaterial
        const haloMaterial = particle.halo.material as THREE.SpriteMaterial
        const wobble = new THREE.Vector3(
          Math.sin(time * 0.82 + particle.seed) * (1 - settle) * 0.22,
          Math.cos(time * 0.62 + particle.seed * 0.3) * (1 - settle) * 0.09,
          Math.sin(time * 0.7 + particle.seed * 0.51) * (1 - settle) * 0.15,
        )
        const point = bezierPoint(particle.start, particle.control, particle.target, progress).add(wobble)

        particle.mesh.position.copy(point)
        particle.halo.position.copy(point)
        particle.mesh.scale.setScalar(1 + (1 - settle) * 0.9 + seal * 2.45 + heat * 0.95)
        const orbColor =
          heat > 0.04
            ? rainbowColor(particle.seed + 19, time)
            : seal > 0.12
              ? DNA_WHITE
              : settle > 0.82
                ? DNA_BLUE_WHITE
                : paletteColor(particle.seed, time)

        material.color.copy(orbColor)
        haloMaterial.color.copy(orbColor)
        material.opacity = Math.max(
          visible ? clamp(local * 2.4 + 0.45, 0, 1) * (1 - settle * 0.56) + seal * 0.9 : 0,
          heat > 0.04 ? heat * 0.82 : 0,
        )
        haloMaterial.opacity = visible
          ? clamp(local * 2.2 + 0.3, 0, 1) * (0.28 + (1 - settle) * 0.2) + seal * 0.5 + heat * 0.32
          : heat * 0.18
        particle.halo.scale.setScalar(0.62 + (1 - settle) * 0.78 + seal * 1.65 + heat * 0.86)
      })

      breakaways.forEach((orb) => {
        const local = clamp((scrollBreak - orb.trigger) / 0.78, 0, 1)
        const eased = easeInOutCubic(local)
        const material = orb.mesh.material as THREE.MeshBasicMaterial
        const position = bezierPoint(orb.origin, orb.control, orb.end, eased)

        position.x += Math.sin(time * 1.4 + orb.seed) * eased * 0.24
        position.z += Math.cos(time * 1.1 + orb.seed) * eased * 0.18
        orb.mesh.position.copy(position)
        orb.mesh.scale.setScalar(1 + eased * 1.4)
        material.color.copy(local > 0.05 && local < 0.22 ? DNA_WHITE : paletteColor(orb.seed, time))
        material.opacity = local <= 0 || local >= 1 ? 0 : Math.sin(local * Math.PI) * 0.82
      })

      if (pointer.x < 2) {
        pointerWorld.set(pointer.x, pointer.y, 0.82).unproject(camera)
      }

      cursorOrbs.forEach((orb, index) => {
        const material = orb.mesh.material as THREE.MeshBasicMaterial
        const visible = pointer.x < 2 ? 1 : 0
        const followTarget = pointerWorld
          .clone()
          .add(orb.offset)
          .add(new THREE.Vector3(Math.sin(time * 1.7 + index) * 0.08, Math.cos(time * 1.5 + index) * 0.08, 0))

        orb.velocity.multiplyScalar(0.84)
        orb.burst *= 0.88
        const target = followTarget.clone().add(orb.velocity)

        orb.mesh.position.lerp(target, orb.lag)
        orb.mesh.scale.setScalar(0.46 + index * 0.018 + Math.sin(time * 3 + index) * 0.05 + orb.burst * 0.42)
        material.color.copy(paletteColor(index * 13, time))
        material.opacity = visible * (0.28 - index * 0.012 + orb.burst * 0.18)
      })

      scene.rotation.y = Math.sin(time * 0.04) * 0.01
      renderer.render(scene, camera)
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', updateScroll)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        } else if (object instanceof THREE.Sprite) {
          object.material.dispose()
        }
      })
      glowTexture.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0 overflow-hidden" />
}
