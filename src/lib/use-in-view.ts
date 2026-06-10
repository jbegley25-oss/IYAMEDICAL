'use client'

import { useEffect, useState, type RefObject } from 'react'

interface UseInViewOptions {
  /** Stop observing after the first time it enters the viewport. */
  once?: boolean
  /** CSS rootMargin string, e.g. '-80px' or '-50px 0px'. */
  margin?: string
}

/**
 * Drop-in replacement for framer-motion's `useInView`, backed by the native
 * IntersectionObserver — which fires reliably in this Next 16 / React 19 setup
 * (framer's version was never flipping to true, leaving content stuck at
 * opacity:0 and counters stuck at 0).
 *
 * Same signature: `const inView = useInView(ref, { once, margin })`.
 * If IntersectionObserver is unavailable, it returns true so content is always
 * visible — animation is polish, never a prerequisite for seeing the page.
 */
export function useInView(
  ref: RefObject<Element | null>,
  options: UseInViewOptions = {}
): boolean {
  const { once = false, margin = '0px' } = options
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => setInView(true))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin: margin }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, margin])

  return inView
}
