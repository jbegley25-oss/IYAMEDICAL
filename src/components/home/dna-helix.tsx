'use client'

import { useEffect, useRef } from 'react'

type MemoryPoint = {
  x: number
  y: number
  strength: number
  age: number
}

type StrandPoint = {
  x: number
  y: number
  z: number
  t: number
  strand: 0 | 1
  heat: number
  alpha: number
}

const MAX_SAMPLES = 240

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

function hsla(h: number, s: number, l: number, a = 1) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`
}

/**
 * Premium medical DNA visual system.
 *
 * Interaction model: cursor proximity ignites an iridescent, spectral shimmer
 * that sweeps along the strand like light across an oil film. Each strand
 * sample carries its own heat that flares quickly and then cools back to the
 * resting deep-ocean blue. As the page scrolls past the hero, the whole
 * structure recedes — dimmer, thinner, quieter — so content takes over.
 */
export function DnaHelix() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !parent || !ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let scrollPhase = 0
    let heroFocus = 1
    // Whole structure leans gently toward the cursor — parallax life.
    let sway = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
    }
    const memory: MemoryPoint[] = []
    let lastMemory = 0

    // Persistent per-sample heat: index = sample * 2 + strand. Lets a touched
    // segment keep glowing after the cursor moves on, then cool back to blue.
    const heatStore = new Float32Array(MAX_SAMPLES * 2)

    // The base gradients never change between resizes, so they are rendered
    // once into an offscreen layer and blitted each frame.
    const bgLayer = document.createElement('canvas')
    const bgCtx = bgLayer.getContext('2d')

    const paintBackgroundLayer = () => {
      if (!bgCtx) return
      bgLayer.width = Math.max(1, Math.floor(width * dpr))
      bgLayer.height = Math.max(1, Math.floor(height * dpr))
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const bg = bgCtx.createLinearGradient(0, 0, width, height)
      bg.addColorStop(0, '#03101d')
      bg.addColorStop(0.44, '#061a2e')
      bg.addColorStop(1, '#010712')
      bgCtx.fillStyle = bg
      bgCtx.fillRect(0, 0, width, height)

      const abyss = bgCtx.createRadialGradient(
        width * 0.5,
        height * 0.38,
        0,
        width * 0.5,
        height * 0.38,
        Math.max(width, height) * 0.72
      )
      abyss.addColorStop(0, 'rgba(18, 74, 105, 0.28)')
      abyss.addColorStop(0.42, 'rgba(5, 28, 50, 0.12)')
      abyss.addColorStop(1, 'rgba(0, 0, 0, 0.38)')
      bgCtx.fillStyle = abyss
      bgCtx.fillRect(0, 0, width, height)
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintBackgroundLayer()
    }

    const addMemory = (x: number, y: number, strength = 1) => {
      memory.push({ x, y, strength, age: 0 })
      if (memory.length > 34) memory.shift()
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height

      pointer.active = inside
      if (!inside) return

      if (pointer.x < -1000) {
        pointer.x = x
        pointer.y = y
      }

      pointer.targetX = x
      pointer.targetY = y

      const now = performance.now()
      if (now - lastMemory > 26) {
        addMemory(x, y, 0.9)
        lastMemory = now
      }
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const onScroll = () => {
      const rect = parent.getBoundingClientRect()
      const travel = window.innerHeight + rect.height
      scrollPhase = clamp((window.innerHeight - rect.top) / Math.max(1, travel), 0, 1)
      // Full presence at the top of the page; recede once the hero scrolls by.
      heroFocus = 1 - smoothstep(0.12, 0.92, window.scrollY / Math.max(1, window.innerHeight))
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

    const heatAt = (x: number, y: number, t: number, z: number, time: number) => {
      const range = clamp(Math.max(width, window.innerHeight) * 0.21, 190, 400)
      let heat = 0

      if (pointer.active) {
        const distance = Math.hypot(x - pointer.x, y - pointer.y)
        const cursorWave = Math.max(0, 1 - distance / range)
        const movingBand = (Math.cos(distance * 0.035 - time * 0.007 + t * 10) + 1) * 0.5
        const alignment = smoothstep(0.12, 0.72, cursorWave * 0.82 + movingBand * 0.18)
        heat += Math.pow(cursorWave, 1.55) * alignment * 1.75
      }

      for (const point of memory) {
        const distance = Math.hypot(x - point.x, y - point.y)
        const wave = Math.max(0, 1 - distance / (range * 0.82))
        const fade = Math.pow(1 - point.age, 1.7) * point.strength
        heat += Math.pow(wave, 2.12) * fade * 0.95
      }

      const frontBoost = smoothstep(0.1, 1, (z + 1) * 0.5) * 0.08
      return clamp(heat + frontBoost, 0, 1)
    }

    const drawBackground = (time: number) => {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(bgLayer, 0, 0)
      ctx.restore()

      ctx.save()
      ctx.globalAlpha = 0.28
      for (let i = 0; i < 90; i += 1) {
        const x = ((Math.sin(i * 17.17) * 0.5 + 0.5) * width + time * 0.004 * (i % 3)) % width
        const y = ((i * 61 + time * 0.008) % (height + 180)) - 90
        const radius = 0.35 + (i % 5) * 0.12
        ctx.fillStyle = i % 2 ? 'rgba(112, 194, 213, 0.08)' : 'rgba(229, 242, 244, 0.04)'
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    const drawCursorHeat = (time: number) => {
      if (!pointer.active && memory.length === 0) return

      const x = pointer.active ? pointer.x : memory[memory.length - 1]?.x ?? -9999
      const y = pointer.active ? pointer.y : memory[memory.length - 1]?.y ?? -9999
      const radius = clamp(Math.max(width, window.innerHeight) * 0.15, 145, 280)
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
      glow.addColorStop(0, 'rgba(168, 224, 255, 0.16)')
      glow.addColorStop(0.24, 'rgba(120, 190, 255, 0.08)')
      glow.addColorStop(0.5, 'rgba(60, 150, 200, 0.03)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = heroFocus
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = (pointer.active ? 0.12 : 0.04) * heroFocus
      ctx.lineWidth = 1
      for (let i = 0; i < 2; i += 1) {
        const r = 24 + i * 42 + Math.sin(time * 0.004 + i) * 5
        // Prismatic halo rings — hue drifts so the cursor aura feels spectral.
        const ringHue = (time * 0.05 + i * 90) % 360
        ctx.strokeStyle = hsla(ringHue, 90, 72, 0.4)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()
    }

    const project = (rawT: number, strand: 0 | 1, time: number) => {
      const t = rawT
      const mobile = width < 720
      const centerX = width * (mobile ? 0.5 : 0.53) + sway
      const radius = clamp(width * (mobile ? 0.22 : 0.185), mobile ? 68 : 110, mobile ? 118 : 236)
      const turns = mobile ? 4.1 : 4.7
      const spin = reduceMotion ? 0 : time * 0.00022
      const scrollRotation = scrollPhase * Math.PI * 2.1
      const phase = strand === 0 ? 0 : Math.PI
      const angle = t * Math.PI * 2 * turns + spin + scrollRotation + phase
      const z = Math.sin(angle)
      const perspective = mix(0.62, 1.08, (z + 1) * 0.5)
      const x = centerX + Math.cos(angle) * radius * perspective
      const visibleTop = -height * 0.08
      const visibleHeight = height * 1.12
      const y = visibleTop + t * visibleHeight
      return { x, y, z, t, strand }
    }

    /**
     * Resting color is deep ocean blue. As heat rises the hue unlocks into a
     * spectral sweep that travels along the strand — the iridescent moment —
     * and as the per-sample heat cools the color settles back into blue.
     */
    const colorFor = (heat: number, depth: number, t: number, time: number) => {
      const hot = smoothstep(0.05, 0.72, heat)
      const spectral = (time * 0.12 + t * 1400 + depth * 180) % 360
      const hue = mix(199, spectral, hot)
      const sat = mix(90, 100, hot)
      // A slow energy pulse travels up the strands so the helix breathes
      // even before the cursor arrives — stays blue, only brightness moves.
      const pulse = Math.pow(0.5 + 0.5 * Math.cos(t * Math.PI * 7 - time * 0.0042), 9)
      const light = mix(50 + depth * 20 + pulse * 16, 66 + hot * 10, hot)
      return { hue, sat, light, hot, pulse }
    }

    const makePoints = (time: number) => {
      const points: StrandPoint[] = []
      const count = width < 720 ? 150 : 190
      const travel = scrollPhase * 0.24
      const presence = mix(0.24, 1, heroFocus)

      // Cool every sample a little each frame; touched samples re-ignite below.
      for (let i = 0; i < heatStore.length; i += 1) {
        heatStore[i] *= reduceMotion ? 0.9 : 0.965
      }

      for (let i = 0; i < count; i += 1) {
        const baseT = i / (count - 1)
        const t = baseT + travel
        if (t < -0.03 || t > 1.28) continue

        for (const strand of [0, 1] as const) {
          const point = project(t, strand, time)
          const depth = (point.z + 1) * 0.5
          const edgeFade = smoothstep(-0.03, 0.1, baseT) * (1 - smoothstep(0.88, 1.03, baseT))

          const slot = i * 2 + strand
          const target = heatAt(point.x, point.y, point.t, point.z, time)
          if (target > heatStore[slot]) {
            heatStore[slot] += (target - heatStore[slot]) * 0.5
          }

          points.push({
            ...point,
            heat: heatStore[slot],
            alpha: edgeFade * (0.2 + depth * 0.8) * presence,
          })
        }
      }

      return points
    }

    // Glow is faked with a wide, faint "halo" stroke under a bright core
    // stroke — same look as shadowBlur at a fraction of the cost, which keeps
    // the page smooth on devices without GPU compositing.
    const drawBackbone = (points: StrandPoint[], time: number) => {
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.lineCap = 'round'

      for (const strand of [0, 1] as const) {
        const strandPoints = points
          .filter((point) => point.strand === strand)
          .sort((a, b) => a.t - b.t)

        for (let i = 1; i < strandPoints.length; i += 1) {
          const a = strandPoints[i - 1]
          const b = strandPoints[i]
          const depth = ((a.z + b.z) * 0.5 + 1) * 0.5
          const heat = Math.max(a.heat, b.heat)
          const color = colorFor(heat, depth, b.t, time)
          const coreWidth = (1.4 + depth * 3.8 + color.hot * 3) * b.alpha
          if (coreWidth <= 0.05) continue

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)

          const haloAlpha = (0.05 + color.hot * 0.16 + color.pulse * 0.05) * b.alpha
          if (haloAlpha > 0.018) {
            ctx.strokeStyle = hsla(color.hue, color.sat, color.light, haloAlpha)
            ctx.lineWidth = coreWidth * (3.6 + color.hot * 2.4)
            ctx.stroke()
          }

          ctx.strokeStyle = hsla(color.hue, color.sat, color.light, (0.14 + depth * 0.3 + color.hot * 0.3 + color.pulse * 0.14) * b.alpha)
          ctx.lineWidth = coreWidth
          ctx.stroke()
        }
      }
      ctx.restore()
    }

    const drawRungs = (points: StrandPoint[], time: number) => {
      const byKey = new Map<string, StrandPoint>()
      for (const point of points) {
        const key = `${Math.round(point.t * 1000)}-${point.strand}`
        byKey.set(key, point)
      }

      const sorted = points
        .filter((point) => point.strand === 0)
        .sort((a, b) => a.t - b.t)

      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      for (let i = 0; i < sorted.length; i += 3) {
        const a = sorted[i]
        const b = byKey.get(`${Math.round(a.t * 1000)}-1`)
        if (!a || !b) continue

        const depth = ((a.z + b.z) * 0.25) + 0.5
        const heat = Math.max(a.heat, b.heat)
        const color = colorFor(heat, depth, a.t, time)
        // Offset hue across the rung so a hot rung refracts like a prism.
        const midHue = color.hot > 0.05 ? (color.hue + color.hot * 35) % 360 : color.hue

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        if (color.hot > 0.08) {
          ctx.strokeStyle = hsla(color.hue, color.sat, color.light, color.hot * 0.12)
          ctx.lineWidth = (0.7 + depth * 1.5 + color.hot * 1.2) * 3
          ctx.stroke()
        }
        ctx.strokeStyle = hsla(midHue, color.sat, color.light + 10, 0.07 + ((a.alpha + b.alpha) * 0.5) * 0.2 + color.hot * 0.24)
        ctx.lineWidth = 0.7 + depth * 1.5 + color.hot * 1.2
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawNodes = (points: StrandPoint[], time: number) => {
      const sorted = [...points].sort((a, b) => a.z - b.z)

      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      for (const point of sorted) {
        const depth = (point.z + 1) * 0.5
        const color = colorFor(point.heat, depth, point.t, time)
        const size = (2.1 + depth * 5.6 + color.hot * 3.2) * point.alpha
        if (size <= 0.1) continue

        // Soft halo, bright core, white-hot center — pearl without gradients.
        ctx.fillStyle = hsla(color.hue, color.sat, color.light, 0.12 + color.hot * 0.18 + color.pulse * 0.08)
        ctx.beginPath()
        ctx.arc(point.x, point.y, size * 2.2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = hsla(color.hue, color.sat, color.light + 10, 0.85)
        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = hsla(color.hue, Math.max(40, color.sat - 24), color.light + 30, 0.9)
        ctx.beginPath()
        ctx.arc(point.x - size * 0.22, point.y - size * 0.24, size * 0.45, 0, Math.PI * 2)
        ctx.fill()

        if (color.hot > 0.18) {
          ctx.globalAlpha = color.hot * 0.38
          ctx.strokeStyle = hsla((color.hue + 64) % 360, 96, 74, 0.72)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(point.x, point.y, size * (2.4 + color.hot * 2), 0, Math.PI * 2)
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      }
      ctx.restore()
    }

    const render = (time: number) => {
      raf = requestAnimationFrame(render)
      if (!visible) return

      pointer.x += (pointer.targetX - pointer.x) * 0.28
      pointer.y += (pointer.targetY - pointer.y) * 0.28

      const anchorX = width * (width < 720 ? 0.5 : 0.53)
      const targetSway = pointer.active && !reduceMotion
        ? clamp((pointer.x - anchorX) * 0.055, -width * 0.045, width * 0.045)
        : 0
      sway += (targetSway - sway) * 0.04

      for (const point of memory) {
        point.age += reduceMotion ? 0.075 : 0.038
      }
      while (memory.length && memory[0].age >= 1) {
        memory.shift()
      }

      drawBackground(time)
      drawCursorHeat(time)

      const points = makePoints(time)
      drawBackbone(points, time)
      drawRungs(points, time)
      drawNodes(points, time)
    }

    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  )
}
