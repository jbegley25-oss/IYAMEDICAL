'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from '@/lib/use-in-view'
import { Clock, Star, Zap, Shield } from 'lucide-react'

const stats = [
  { icon: Clock, value: 30, suffix: '+', label: 'Years Combined Experience' },
  { icon: Star, value: 4.9, suffix: '/5', label: 'Patient Rating' },
  { icon: Zap, value: 100, suffix: '%', label: 'Same-Day Procedures' },
  { icon: Shield, value: 5, suffix: '', label: 'Board-Certified Physicians' },
]

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || value === 0) return
    const steps = 40
    const stepDuration = 1500 / steps
    const isDecimal = value % 1 !== 0
    let step = 0

    const timer = setInterval(() => {
      step++
      const eased = 1 - Math.pow(1 - step / steps, 3)
      setDisplay(isDecimal ? parseFloat((value * eased).toFixed(1)) : Math.round(value * eased))
      if (step >= steps) clearInterval(timer)
    }, stepDuration)

    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span className="text-4xl font-bold text-cyan-200 sm:text-5xl">
      {display}{suffix}
    </span>
  )
}

export function TrustStats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section suppressHydrationWarning ref={ref} className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-emerald-300/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 transition-colors duration-300 group-hover:border-emerald-300/50 group-hover:bg-emerald-300/15">
                  <Icon className="h-6 w-6 text-cyan-300 transition-colors duration-300 group-hover:text-emerald-300" />
                </div>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={inView} />
                <span className="text-sm font-medium text-slate-400 transition-colors duration-300 group-hover:text-slate-200 sm:text-base">
                  {stat.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
