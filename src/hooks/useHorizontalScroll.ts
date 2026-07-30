import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

export const sectionIds = ['home', 'about', 'projects', 'links'] as const
export type SectionId = (typeof sectionIds)[number]

type DragState = {
  pointerId: number
  startPosition: number
  lastPosition: number
  lastTime: number
  startScroll: number
  velocity: number
  moved: boolean
}

type ScrollAxis = 'horizontal' | 'vertical'

function getScrollAxis(): ScrollAxis {
  return typeof window !== 'undefined' && window.matchMedia?.('(max-width: 760px)').matches
    ? 'vertical'
    : 'horizontal'
}

export function useHorizontalScroll(enabled: boolean) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const [activeSection, setActiveSection] = useState<SectionId>('home')
  const [scrollAxis, setScrollAxis] = useState<ScrollAxis>(getScrollAxis)

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(max-width: 760px)')
    if (!mediaQuery) return

    const updateScrollAxis = () => setScrollAxis(mediaQuery.matches ? 'vertical' : 'horizontal')
    mediaQuery.addEventListener('change', updateScrollAxis)
    return () => mediaQuery.removeEventListener('change', updateScrollAxis)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current

    if (!enabled || !viewport || !track) return

    const isVertical = scrollAxis === 'vertical'
    const lenis = new Lenis({
      wrapper: viewport,
      content: track,
      eventsTarget: viewport,
      orientation: scrollAxis,
      gestureOrientation: isVertical ? 'vertical' : 'both',
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.09,
      touchInertiaExponent: 1.75,
      lerp: 0.075,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.1,
      overscroll: false,
      autoRaf: true,
    })

    lenisRef.current = lenis
    let currentSection: SectionId = 'home'
    let dragState: DragState | null = null

    const updateActiveSection = (instance: Lenis) => {
      viewport.style.setProperty('--scroll-progress', instance.progress.toFixed(4))
      viewport.style.setProperty('--backdrop-shift', `${(-instance.scroll * 0.065).toFixed(2)}px`)
      viewport.style.setProperty(
        '--scroll-velocity',
        Math.min(Math.abs(instance.velocity) / 35, 1).toFixed(4),
      )

      const home = track.querySelector<HTMLElement>('#home')
      const viewportSize = isVertical ? viewport.clientHeight : viewport.clientWidth
      const homeSize = isVertical ? home?.offsetHeight : home?.offsetWidth
      const blurStart = Math.max((homeSize ?? viewportSize) - viewportSize * 0.55, 0)
      const blurDistance = Math.max(viewportSize * 0.28, 180)
      const backdropSubdue = Math.min(Math.max((instance.scroll - blurStart) / blurDistance, 0), 1)
      viewport.style.setProperty('--backdrop-blur', `${(backdropSubdue * 2.2).toFixed(2)}px`)
      viewport.style.setProperty('--backdrop-opacity', (0.96 - backdropSubdue * 0.46).toFixed(3))

      const samplePoint = instance.scroll + viewportSize * 0.48
      let visibleSection: SectionId = 'home'

      sectionIds.forEach((id) => {
        const section = track.querySelector<HTMLElement>(`#${id}`)
        if (!section) return
        const sectionStart = isVertical ? section.offsetTop : section.offsetLeft
        if (samplePoint >= sectionStart) visibleSection = id
      })

      if (visibleSection !== currentSection) {
        currentSection = visibleSection
        setActiveSection(visibleSection)
      }
    }

    const unsubscribe = lenis.on('scroll', updateActiveSection)

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      if ((event.target as HTMLElement).closest('a, button, input, textarea')) return

      const pointerPosition = isVertical ? event.clientY : event.clientX
      dragState = {
        pointerId: event.pointerId,
        startPosition: pointerPosition,
        lastPosition: pointerPosition,
        lastTime: event.timeStamp,
        startScroll: lenis.scroll,
        velocity: 0,
        moved: false,
      }
      viewport.setPointerCapture(event.pointerId)
      viewport.classList.add('is-dragging')
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragState || event.pointerId !== dragState.pointerId) return

      const pointerPosition = isVertical ? event.clientY : event.clientX
      const totalDelta = pointerPosition - dragState.startPosition
      const frameTime = Math.max(event.timeStamp - dragState.lastTime, 1)
      const frameDelta = pointerPosition - dragState.lastPosition
      dragState.velocity = frameDelta / frameTime
      dragState.lastPosition = pointerPosition
      dragState.lastTime = event.timeStamp
      dragState.moved = dragState.moved || Math.abs(totalDelta) > 3

      lenis.scrollTo(dragState.startScroll - totalDelta, {
        immediate: true,
        force: true,
      })
      event.preventDefault()
    }

    const finishDrag = (event: PointerEvent) => {
      if (!dragState || event.pointerId !== dragState.pointerId) return

      if (dragState.moved) {
        const projected = Math.max(
          0,
          Math.min(lenis.limit, lenis.scroll - dragState.velocity * 280),
        )
        lenis.scrollTo(projected, {
          duration: 1.15,
          easing: (time) => 1 - Math.pow(1 - time, 4),
          force: true,
        })
      }

      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId)
      }
      viewport.classList.remove('is-dragging')
      dragState = null
    }

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', finishDrag)
    viewport.addEventListener('pointercancel', finishDrag)
    updateActiveSection(lenis)

    return () => {
      unsubscribe()
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', finishDrag)
      viewport.removeEventListener('pointercancel', finishDrag)
      viewport.classList.remove('is-dragging')
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled, scrollAxis])

  const scrollToSection = (sectionId: SectionId) => {
    const target = trackRef.current?.querySelector<HTMLElement>(`#${sectionId}`)
    if (!target) return

    const targetPosition = scrollAxis === 'vertical' ? target.offsetTop : target.offsetLeft
    lenisRef.current?.scrollTo(targetPosition, {
      duration: 1.35,
      easing: (time) => 1 - Math.pow(1 - time, 4),
    })
  }

  return { viewportRef, trackRef, activeSection, scrollToSection }
}