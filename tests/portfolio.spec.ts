import { expect, test, type Page } from '@playwright/test'

async function enterPortfolio(page: Page) {
  await expect(page.locator('main')).toHaveAttribute('data-phase', 'idle')
  await page.getByRole('button', { name: 'welcome!' }).click()
  await expect(page.locator('.landing-gate')).toHaveClass(/is-entering/)

  await page.waitForTimeout(320)
  const origin = await page.locator('.landing-origin').boundingBox()
  const seamDelta = await page.evaluate(() => {
    const gate = document.querySelector('.landing-gate')!.getBoundingClientRect()
    const portfolio = document.querySelector('.horizontal-viewport')!.getBoundingClientRect()
    return Math.abs(gate.right - portfolio.left)
  })
  expect(origin?.width).toBeCloseTo(8, 0)
  expect(origin?.height).toBeCloseTo(8, 0)
  expect(seamDelta).toBeLessThan(1)

  await page.waitForTimeout(210)
  const entryTelemetry = await page.evaluate(() => {
    const meta = document.querySelector<HTMLElement>('.landing-meta')!
    const signal = document.querySelector<HTMLElement>('.landing-signal-target')!
    const wave = document.querySelector<SVGElement>('.landing-wave')!.getBoundingClientRect()
    const home = document.querySelector<HTMLElement>('#home')!.getBoundingClientRect()
    return {
      status: document.querySelector('.landing-status')?.textContent,
      signal: signal.textContent,
      color: getComputedStyle(meta).color,
      waveBleed: wave.right - home.left,
    }
  })
  expect(entryTelemetry.status).toBe('START')
  expect(entryTelemetry.signal).toBe('1.000')
  expect(entryTelemetry.color).toBe('rgb(124, 53, 232)')
  expect(entryTelemetry.waveBleed).toBeGreaterThanOrEqual(page.viewportSize()!.width - 1)

  await expect(page.getByRole('navigation', { name: 'Portfolio sections' })).toBeVisible({
    timeout: 5000,
  })

  await expect(page.locator('.landing-gate')).toHaveCount(0)
  await expect(page.locator('.home-signal-residue')).toHaveCSS('opacity', '1')
  const persistentWave = await page.evaluate(() => {
    const residue = document.querySelector<SVGElement>('.home-signal-residue')!
    const content = document.querySelector<HTMLElement>('.home-copy')!
    const endpoints = [...residue.querySelectorAll('.signal-endpoint')].map((endpoint) =>
      endpoint.getAttribute('cx'),
    )
    const endpointHeights = [...residue.querySelectorAll('.signal-endpoint')].map((endpoint) =>
      Number(endpoint.getAttribute('cy')),
    )
    const accentPath = residue.querySelector('.intro-signal-accent path')?.getAttribute('d') ?? ''
    const bio = document.querySelector<HTMLElement>('.home-bio')!
    const bioBackplate = bio.querySelector<HTMLElement>('.home-text-backplate')!
    const bioRange = document.createRange()
    bioRange.selectNodeContents(bioBackplate)
    const headingWidths = [
      ...document.querySelectorAll<HTMLElement>('.home-copy h1 .home-text-backplate'),
    ].map((line) => line.getBoundingClientRect().width)
    return {
      residueZ: Number(getComputedStyle(residue).zIndex),
      contentZ: Number(getComputedStyle(content).zIndex),
      endpoints,
      endpointHeights,
      accentPath,
      bioBlur:
        getComputedStyle(bioBackplate).backdropFilter ||
        getComputedStyle(bioBackplate).webkitBackdropFilter,
      bioWidth: bio.getBoundingClientRect().width,
      bioFragmentWidths: [...bioRange.getClientRects()].map((fragment) => fragment.width),
      headingWidths,
    }
  })
  expect(persistentWave.residueZ).toBeLessThan(persistentWave.contentZ)
  expect(new Set(persistentWave.endpoints).size).toBe(4)
  expect(Math.max(...persistentWave.endpointHeights)).toBeGreaterThan(700)
  expect(persistentWave.endpointHeights.some((height) => height >= 400 && height <= 600)).toBe(true)
  expect(persistentWave.accentPath).toContain('414 H')
  expect(persistentWave.accentPath).toContain('730 H')
  expect(persistentWave.bioBlur).toBe('blur(4px)')
  expect(persistentWave.headingWidths[1]).toBeLessThan(persistentWave.headingWidths[0])
  expect(Math.min(...persistentWave.bioFragmentWidths)).toBeLessThan(persistentWave.bioWidth)
}

test('desktop entry, wheel, drag, and section navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'welcome!' })).toBeVisible()
  await enterPortfolio(page)

  const viewport = page.locator('.horizontal-viewport')
  const homeCopy = await page.locator('.home-copy').boundingBox()
  const homeInstrument = await page.locator('.home-instrument').boundingBox()
  expect(homeCopy).not.toBeNull()
  expect(homeInstrument).not.toBeNull()
  expect(homeCopy!.x + homeCopy!.width).toBeLessThanOrEqual(homeInstrument!.x + 2)
  await expect(page.locator('.plot-trace').first()).toHaveCSS('stroke-width', '0.85px')
  await expect(page.locator('.plot-trace').first()).toHaveCSS('shape-rendering', 'crispedges')
  const portraitLayout = await page.evaluate(() => {
    const screen = document.querySelector<HTMLElement>('.portrait-screen')!
    const image = screen.querySelector<HTMLImageElement>('img')!
    return {
      naturalRatio: image.naturalWidth / image.naturalHeight,
      renderedRatio: screen.clientWidth / screen.clientHeight,
      objectFit: getComputedStyle(image).objectFit,
      plotHeight: document.querySelector<HTMLElement>('.signal-plot')!.clientHeight,
    }
  })
  expect(portraitLayout.renderedRatio).toBeCloseTo(portraitLayout.naturalRatio, 2)
  expect(portraitLayout.objectFit).toBe('contain')
  expect(portraitLayout.plotHeight).toBe(72)

  await page.getByRole('button', { name: 'Use dark mode' }).click()
  await expect(page.locator('main')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.project-content h3').first()).toHaveCSS('color', 'rgb(238, 242, 237)')
  expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('dark')
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  })
  await page.keyboard.type('dark')
  await expect(page.locator('main')).toHaveAttribute('data-theme', 'dark')
  await page.keyboard.type('light')
  await expect(page.locator('main')).toHaveAttribute('data-theme', 'light')

  const aboutProjectGap = await page.evaluate(() => {
    const skills = document.querySelector('.skills-column')!.getBoundingClientRect()
    const projects = document.querySelector('.project-intro')!.getBoundingClientRect()
    return projects.left - skills.right
  })
  expect(aboutProjectGap).toBeGreaterThanOrEqual(80)
  expect(aboutProjectGap).toBeLessThanOrEqual(100)

  const hasVerticalOverflow = await page.evaluate(
    () => document.documentElement.scrollHeight > window.innerHeight + 1,
  )
  expect(hasVerticalOverflow).toBe(false)

  const wheelStart = await viewport.evaluate((element) => element.scrollLeft)
  await page.mouse.move(720, 450)
  await page.mouse.wheel(0, 1100)
  await page.waitForTimeout(700)
  const wheelEnd = await viewport.evaluate((element) => element.scrollLeft)
  expect(wheelEnd).toBeGreaterThan(wheelStart + 80)
  const backdropState = await viewport.evaluate((element) => {
    const style = getComputedStyle(element)
    const shift = parseFloat(style.getPropertyValue('--backdrop-shift'))
    const backdropTransform = new DOMMatrix(
      getComputedStyle(document.querySelector<HTMLElement>('.circuit-field')!).transform,
    )
    const waveformTransform = new DOMMatrix(
      getComputedStyle(document.querySelector<SVGElement>('.home-signal-residue')!).transform,
    )
    return {
      ratio: Math.abs(shift / element.scrollLeft),
      blur: parseFloat(style.getPropertyValue('--backdrop-blur')),
      opacity: parseFloat(style.getPropertyValue('--backdrop-opacity')),
      backdropShift: backdropTransform.m41,
      waveformShift: waveformTransform.m41 + window.innerWidth,
    }
  })
  expect(backdropState.ratio).toBeCloseTo(0.065, 2)
  expect(backdropState.blur).toBeGreaterThan(0)
  expect(backdropState.opacity).toBeLessThan(0.96)
  expect(backdropState.waveformShift).toBeCloseTo(backdropState.backdropShift, 1)

  await page.getByRole('button', { name: 'Go to Projects' }).click()
  await page.waitForTimeout(1500)
  await expect(page.locator('#projects')).toBeInViewport({ ratio: 0.25 })
  await expect(page.getByRole('button', { name: 'Go to Projects' })).toHaveAttribute(
    'aria-current',
    'page',
  )

  await page.getByRole('button', { name: 'Go to Home' }).click()
  await page.waitForTimeout(1500)
  const dragStart = await viewport.evaluate((element) => element.scrollLeft)
  await page.mouse.move(1020, 760)
  await page.mouse.down()
  await page.mouse.move(520, 760, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(700)
  const dragEnd = await viewport.evaluate((element) => element.scrollLeft)
  expect(dragEnd).toBeGreaterThan(dragStart + 150)

  await page.getByRole('button', { name: 'Go to Links' }).click()
  await page.waitForTimeout(1500)
  await expect(page.locator('.terminal-link[href="https://github.com/JMatthewLee"]')).toBeVisible()
})

test('mobile canvas preserves horizontal composition', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await enterPortfolio(page)

  const homeSection = await page.locator('#home').boundingBox()
  const homeCopy = await page.locator('.home-copy').boundingBox()
  const homeInstrument = await page.locator('.home-instrument').boundingBox()
  expect(homeSection).not.toBeNull()
  expect(homeSection!.width).toBeLessThan(390)
  expect(homeCopy!.y + homeCopy!.height).toBeLessThanOrEqual(homeInstrument!.y + 2)

  await page.getByRole('button', { name: 'Go to About' }).click()
  await page.waitForTimeout(1500)
  await expect(page.locator('#about')).toBeInViewport({ ratio: 0.2 })

  await page.getByRole('button', { name: 'Go to Projects' }).click()
  await page.waitForTimeout(1500)
  await expect(page.getByRole('heading', { name: 'My works' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Go to Projects' })).toHaveAttribute(
    'aria-current',
    'page',
  )
})