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
 * The interaction is adapted from the hummingbird iridescence experiment:
 * cursor proximity creates a non-linear flare, then a short-lived color memory
 * trail lets the warmth echo behind the pointer. Here the palette is restrained:
 * deep ocean blue at rest, rich orange heat as the cursor approaches.
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
      const range = clamp(Math.max(width, window.innerHeight) * 0.16, 150, 300)
      let heat = 0

      if (pointer.active) {
        const distance = Math.hypot(x - pointer.x, y - pointer.y)
        const cursorWave = Math.max(0, 1 - distance / range)
        const movingBand = (Math.cos(distance * 0.035 - time * 0.007 + t * 10) + 1) * 0.5
        const alignment = smoothstep(0.16, 0.78, cursorWave * 0.82 + movingBand * 0.18)
        heat += Math.pow(cursorWave, 1.86) * alignment * 1.35
      }

      for (const point of memory) {
        const distance = Math.hypot(x - point.x, y - point.y)
        const wave = Math.max(0, 1 - distance / (range * 0.82))
        const fade = Math.pow(1 - point.age, 1.7) * point.strength
        heat += Math.pow(wave, 2.12) * fade * 0.7
      }

      const frontBoost = smoothstep(0.1, 1, (z + 1) * 0.5) * 0.08
      return clamp(heat + frontBoost, 0, 1)
    }

    const drawBackground = (time: number) => {
      const bg = ctx.createLinearGradient(0, 0, width, height)
      bg.addColorStop(0, '#03101d')
      bg.addColorStop(0.44, '#061a2e')
      bg.addColorStop(1, '#010712')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      const abyss = ctx.createRadialGradient(
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
      ctx.fillStyle = abyss
      ctx.fillRect(0, 0, width, height)

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
      glow.addColorStop(0, 'rgba(255, 122, 45, 0.22)')
      glow.addColorStop(0.22, 'rgba(253, 176, 86, 0.11)')
      glow.addColorStop(0.46, 'rgba(23, 147, 171, 0.04)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = pointer.active ? 0.12 : 0.04
      ctx.strokeStyle = 'rgba(255, 177, 92, 0.38)'
      ctx.lineWidth = 1
      for (let i = 0; i < 2; i += 1) {
        const r = 24 + i * 42 + Math.sin(time * 0.004 + i) * 5
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()
    }

    const project = (rawT: number, strand: 0 | 1, time: number) => {
      const t = rawT
      const mobile = width < 720
      const centerX = width * (mobile ? 0.5 : 0.53)
      const radius = clamp(width * (mobile ? 0.18 : 0.135), mobile ? 54 : 82, mobile ? 92 : 158)
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

    const colorFor = (heat: number, depth: number) => {
      const hot = smoothstep(0.08, 0.82, heat)
      const hue = mix(193, 24, hot)
      const sat = mix(72, 98, hot)
      const light = mix(44 + depth * 20, 58 + hot * 10, hot)
      return { hue, sat, light, hot }
    }

    const makePoints = (time: number) => {
      const points: StrandPoint[] = []
      const count = width < 720 ? 150 : 190
      const travel = scrollPhase * 0.24

      for (let i = 0; i < count; i += 1) {
        const baseT = i / (count - 1)
        const t = baseT + travel
        if (t < -0.03 || t > 1.28) continue

        for (let strand: 0 | 1 = 0; strand < 2; strand += 1) {
          const point = project(t, strand, time)
          const depth = (point.z + 1) * 0.5
          const edgeFade = smoothstep(-0.03, 0.1, baseT) * (1 - smoothstep(0.88, 1.03, baseT))
          points.push({
            ...point,
            heat: heatAt(point.x, point.y, point.t, point.z, time),
            alpha: edgeFade * (0.2 + depth * 0.8),
          })
        }
      }

      return points
    }

    const drawBackbone = (points: StrandPoint[]) => {
      for (let strand: 0 | 1 = 0; strand < 2; strand += 1) {
        const strandPoints = points
          .filter((point) => point.strand === strand)
          .sort((a, b) => a.t - b.t)

        for (let i = 1; i < strandPoints.length; i += 1) {
          const a = strandPoints[i - 1]
          const b = strandPoints[i]
          const depth = ((a.z + b.z) * 0.5 + 1) * 0.5
          const heat = Math.max(a.heat, b.heat)
          const color = colorFor(heat, depth)

          ctx.save()
          ctx.globalCompositeOperation = 'screen'
          ctx.strokeStyle = hsla(color.hue, color.sat, color.light, (0.08 + depth * 0.22 + color.hot * 0.2) * b.alpha)
          ctx.lineWidth = (1.1 + depth * 3.2 + color.hot * 2.4) * b.alpha
          ctx.shadowBlur = 9 + color.hot * 20
          ctx.shadowColor = hsla(color.hue, color.sat, color.light, 0.68)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
          ctx.restore()
        }
      }
    }

    const drawRungs = (points: StrandPoint[]) => {
      const byKey = new Map<string, StrandPoint>()
      for (const point of points) {
        const key = `${Math.round(point.t * 1000)}-${point.strand}`
        byKey.set(key, point)
      }

      const sorted = points
        .filter((point) => point.strand === 0)
        .sort((a, b) => a.t - b.t)

      for (let i = 0; i < sorted.length; i += 4) {
        const a = sorted[i]
        const b = byKey.get(`${Math.round(a.t * 1000)}-1`)
        if (!a || !b) continue

        const depth = ((a.z + b.z) * 0.25) + 0.5
        const heat = Math.max(a.heat, b.heat)
        const color = colorFor(heat, depth)

        const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        gradient.addColorStop(0, hsla(color.hue, color.sat, color.light + 6, 0.03 + a.alpha * 0.18 + color.hot * 0.2))
        gradient.addColorStop(0.5, hsla(color.hue, color.sat, color.light + 11, 0.08 + a.alpha * 0.22 + color.hot * 0.26))
        gradient.addColorStop(1, hsla(color.hue, color.sat, color.light + 6, 0.03 + b.alpha * 0.18 + color.hot * 0.2))

        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.strokeStyle = gradient
        ctx.lineWidth = 0.7 + depth * 1.5 + color.hot * 1.2
        ctx.shadowBlur = color.hot * 18
        ctx.shadowColor = hsla(color.hue, color.sat, color.light, 0.72)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
        ctx.restore()
      }
    }

    const drawNodes = (points: StrandPoint[]) => {
      const sorted = [...points].sort((a, b) => a.z - b.z)

      for (const point of sorted) {
        const depth = (point.z + 1) * 0.5
        const color = colorFor(point.heat, depth)
        const size = (1.7 + depth * 4.8 + color.hot * 2.5) * point.alpha
        if (size <= 0.1) continue

        const pearl = ctx.createRadialGradient(
          point.x - size * 0.32,
          point.y - size * 0.35,
          0,
          point.x,
          point.y,
          size * 2.4
        )
        pearl.addColorStop(0, hsla(color.hue, color.sat, color.light + 28, 0.98))
        pearl.addColorStop(0.3, hsla(color.hue, color.sat, color.light + 10, 0.9))
        pearl.addColorStop(1, hsla(color.hue, color.sat, Math.max(16, color.light - 18), 0.12))

        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.shadowBlur = 10 + depth * 14 + color.hot * 28
        ctx.shadowColor = hsla(color.hue, color.sat, color.light + 6, 0.85)
        ctx.fillStyle = pearl
        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fill()

        if (color.hot > 0.18) {
          ctx.globalAlpha = color.hot * 0.38
          ctx.strokeStyle = hsla(38, 98, 74, 0.72)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(point.x, point.y, size * (2.4 + color.hot * 2), 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.restore()
      }
    }

    const render = (time: number) => {
      raf = requestAnimationFrame(render)
      if (!visible) return

      pointer.x += (pointer.targetX - pointer.x) * 0.28
      pointer.y += (pointer.targetY - pointer.y) * 0.28

      for (const point of memory) {
        point.age += reduceMotion ? 0.075 : 0.038
      }
      while (memory.length && memory[0].age >= 1) {
        memory.shift()
      }

      drawBackground(time)
      drawCursorHeat(time)

      const points = makePoints(time)
      drawBackbone(points)
      drawRungs(points)
      drawNodes(points)
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
