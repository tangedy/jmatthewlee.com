import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('lenis', () => ({
  default: class LenisMock {
    progress = 0
    scroll = 0
    velocity = 0
    limit = 6000

    destroy() {}
    on(_event: string, callback: (instance: LenisMock) => void) {
      callback(this)
      return () => undefined
    }
    scrollTo() {}
  },
}))

describe('portfolio entry', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('moves from the hello gate to the horizontal portfolio', () => {
    render(<App />)

    const hello = screen.getByRole('button', { name: 'hello' })
    expect(hello).toBeVisible()
    expect(screen.queryByRole('navigation', { name: 'Portfolio sections' })).not.toBeInTheDocument()

    fireEvent.click(hello)
    expect(document.querySelector('.landing-gate')).toHaveClass('is-entering')

    act(() => vi.advanceTimersByTime(2350))

    expect(screen.getByRole('navigation', { name: 'Portfolio sections' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Matthew Lee' })).toBeInTheDocument()
  })

  it('renders all six projects and verified contact outputs', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'hello' }))
    act(() => vi.advanceTimersByTime(2350))

    expect(screen.getByRole('heading', { name: 'FPGA DSP Workshop' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dutch Blitz Card Sorter' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.getByRole('link', { name: /m88lee@uwaterloo.ca/i })).toHaveAttribute(
      'href',
      'mailto:m88lee@uwaterloo.ca',
    )
  })
})