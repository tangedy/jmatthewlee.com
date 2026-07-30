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
  beforeEach(() => {
    vi.useFakeTimers()
    window.localStorage.clear()
    delete document.documentElement.dataset.theme
    document.documentElement.style.colorScheme = ''
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('moves from the hello gate to the horizontal portfolio', () => {
    render(<App />)

    const welcome = screen.getByRole('button', { name: 'welcome!' })
    expect(welcome).toBeVisible()
    expect(screen.queryByRole('navigation', { name: 'Portfolio sections' })).not.toBeInTheDocument()

    fireEvent.click(welcome)
    expect(document.querySelector('.landing-gate')).toHaveClass('is-entering')

    act(() => vi.advanceTimersByTime(2350))

    expect(screen.getByRole('navigation', { name: 'Portfolio sections' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Matthew Lee' })).toBeInTheDocument()
  })

  it('renders all six projects and verified contact outputs', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'welcome!' }))
    act(() => vi.advanceTimersByTime(2350))

    expect(screen.getByRole('heading', { name: 'FPGA DSP Workshop' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dutch Blitz Card Sorter' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'About myself' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'My works' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'PLEASE HIRE ME PLEASE PLEASE' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.getByRole('link', { name: /m88lee@uwaterloo.ca/i })).toHaveAttribute(
      'href',
      'mailto:m88lee@uwaterloo.ca',
    )
  })

  it('sets and persists each theme from its keyboard sequence and the control', () => {
    render(<App />)

    for (const key of ['d', 'a', 'r', 'k']) {
      fireEvent.keyDown(document.body, { key })
    }

    expect(document.querySelector('main')).toHaveAttribute('data-theme', 'dark')
    expect(window.localStorage.getItem('portfolio-theme')).toBe('dark')

    for (const key of ['d', 'a', 'r', 'k']) {
      fireEvent.keyDown(document.body, { key })
    }

    expect(document.querySelector('main')).toHaveAttribute('data-theme', 'dark')

    for (const key of ['l', 'i', 'g', 'h', 't']) {
      fireEvent.keyDown(document.body, { key })
    }

    expect(document.querySelector('main')).toHaveAttribute('data-theme', 'light')
    expect(window.localStorage.getItem('portfolio-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: 'welcome!' }))
    act(() => vi.advanceTimersByTime(2350))
    fireEvent.click(screen.getByRole('button', { name: 'Use dark mode' }))

    expect(document.querySelector('main')).toHaveAttribute('data-theme', 'dark')
    expect(window.localStorage.getItem('portfolio-theme')).toBe('dark')
  })
})