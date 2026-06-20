'use client'

import { useRef, useEffect, useCallback, type ReactNode } from 'react'

type Easing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'

interface ClickSparkProps {
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  easing?: Easing
  extraScale?: number
  children?: ReactNode
}

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

const ClickSpark = ({
  sparkColor = '#67e8f9',
  sparkSize = 11,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 420,
  easing = 'ease-out',
  extraScale = 1.0,
  children,
}: ClickSparkProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sparksRef = useRef<Spark[]>([])
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let resizeTimeout: ReturnType<typeof setTimeout>

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.floor(window.innerWidth * dpr)
      const height = Math.floor(window.innerHeight * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`
      }
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }

    window.addEventListener('resize', handleResize)
    resizeCanvas()

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t
        case 'ease-in':
          return t * t
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        default:
          return t * (2 - t)
      }
    },
    [easing]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const draw = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) {
          return false
        }

        const progress = elapsed / duration
        const eased = easeFunc(progress)

        const distance = eased * sparkRadius * extraScale
        const lineLength = sparkSize * (1 - eased)

        const x1 = (spark.x + distance * Math.cos(spark.angle)) * dpr
        const y1 = (spark.y + distance * Math.sin(spark.angle)) * dpr
        const x2 = (spark.x + (distance + lineLength) * Math.cos(spark.angle)) * dpr
        const y2 = (spark.y + (distance + lineLength) * Math.sin(spark.angle)) * dpr

        ctx.strokeStyle = sparkColor
        ctx.lineWidth = 2 * dpr
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        return true
      })

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now()
    const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
      x: e.clientX,
      y: e.clientY,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now,
    }))

    sparksRef.current.push(...newSparks)
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          userSelect: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />
      {children}
    </div>
  )
}

export default ClickSpark
