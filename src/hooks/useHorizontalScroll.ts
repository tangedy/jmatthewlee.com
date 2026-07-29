import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

export const sectionIds = ['home', 'about', 'projects', 'links'] as const
export type SectionId = (typeof sectionIds)[number]

type DragState = {
  pointerId: number
  startX: number
  lastX: number
  lastTime: number
  startScroll: number
  velocity: number
  moved: boolean
}

export function useHorizontalScroll(enabled: boolean) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const [activeSection, setActiveSection] = useState<SectionId>('home')

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current

    if (!enabled || !viewport || !track) return

    const lenis = new Lenis({
      wrapper: viewport,
      content: track,
      eventsTarget: viewport,
      orientation: 'horizontal',
      gestureOrientation: 'both',
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
      const blurStart = Math.max((home?.offsetWidth ?? viewport.clientWidth) - viewport.clientWidth * 0.55, 0)
      const blurDistance = Math.max(viewport.clientWidth * 0.28, 180)
      const backdropSubdue = Math.min(Math.max((instance.scroll - blurStart) / blurDistance, 0), 1)
      viewport.style.setProperty('--backdrop-blur', `${(backdropSubdue * 2.2).toFixed(2)}px`)
      viewport.style.setProperty('--backdrop-opacity', (0.96 - backdropSubdue * 0.46).toFixed(3))

      const samplePoint = instance.scroll + viewport.clientWidth * 0.48
      let visibleSection: SectionId = 'home'

      sectionIds.forEach((id) => {
        const section = track.querySelector<HTMLElement>(`#${id}`)
        if (!section) return
        if (samplePoint >= section.offsetLeft) visibleSection = id
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

      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        lastX: event.clientX,
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

      const totalDelta = event.clientX - dragState.startX
      const frameTime = Math.max(event.timeStamp - dragState.lastTime, 1)
      const frameDelta = event.clientX - dragState.lastX
      dragState.velocity = frameDelta / frameTime
      dragState.lastX = event.clientX
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
  }, [enabled])

  const scrollToSection = (sectionId: SectionId) => {
    const target = trackRef.current?.querySelector<HTMLElement>(`#${sectionId}`)
    if (!target) return

    lenisRef.current?.scrollTo(target.offsetLeft, {
      duration: 1.35,
      easing: (time) => 1 - Math.pow(1 - time, 4),
    })
  }

  return { viewportRef, trackRef, activeSection, scrollToSection }
}