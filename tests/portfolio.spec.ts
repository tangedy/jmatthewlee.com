import { expect, test, type Page } from '@playwright/test'

async function enterPortfolio(page: Page) {
  await page.getByRole('button', { name: 'hello' }).click()
  await expect(page.locator('.landing-gate')).toHaveClass(/is-entering/)
  await expect(page.getByRole('navigation', { name: 'Portfolio sections' })).toBeVisible({
    timeout: 5000,
  })
}

test('desktop entry, wheel, drag, and section navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'hello' })).toBeVisible()
  await page.screenshot({ path: 'test-results/landing-desktop.png' })
  await enterPortfolio(page)

  const viewport = page.locator('.horizontal-viewport')
  const homeCopy = await page.locator('.home-copy').boundingBox()
  const homeInstrument = await page.locator('.home-instrument').boundingBox()
  expect(homeCopy).not.toBeNull()
  expect(homeInstrument).not.toBeNull()
  expect(homeCopy!.x + homeCopy!.width).toBeLessThanOrEqual(homeInstrument!.x + 2)

  const hasVerticalOverflow = await page.evaluate(
    () => document.documentElement.scrollHeight > window.innerHeight + 1,
  )
  expect(hasVerticalOverflow).toBe(false)
  await page.screenshot({ path: 'test-results/home-desktop.png' })

  const wheelStart = await viewport.evaluate((element) => element.scrollLeft)
  await page.mouse.move(720, 450)
  await page.mouse.wheel(0, 1100)
  await page.waitForTimeout(700)
  const wheelEnd = await viewport.evaluate((element) => element.scrollLeft)
  expect(wheelEnd).toBeGreaterThan(wheelStart + 80)

  await page.getByRole('button', { name: 'Go to Projects' }).click()
  await page.waitForTimeout(1500)
  await expect(page.locator('#projects')).toBeInViewport({ ratio: 0.25 })
  await expect(page.getByRole('button', { name: 'Go to Projects' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await page.screenshot({ path: 'test-results/projects-desktop.png' })

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
  await page.screenshot({ path: 'test-results/links-desktop.png' })
})

test('mobile canvas preserves horizontal composition', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.screenshot({ path: 'test-results/landing-mobile.png' })
  await enterPortfolio(page)

  const homeSection = await page.locator('#home').boundingBox()
  const homeCopy = await page.locator('.home-copy').boundingBox()
  const homeInstrument = await page.locator('.home-instrument').boundingBox()
  expect(homeSection).not.toBeNull()
  expect(homeSection!.width).toBeLessThan(390)
  expect(homeCopy!.y + homeCopy!.height).toBeLessThanOrEqual(homeInstrument!.y + 2)
  await page.screenshot({ path: 'test-results/home-mobile.png' })

  await page.getByRole('button', { name: 'Go to About' }).click()
  await page.waitForTimeout(1500)
  await expect(page.locator('#about')).toBeInViewport({ ratio: 0.2 })

  await page.getByRole('button', { name: 'Go to Projects' }).click()
  await page.waitForTimeout(1500)
  await expect(page.getByRole('heading', { name: 'Systems in motion.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Go to Projects' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await page.screenshot({ path: 'test-results/projects-mobile.png' })
})