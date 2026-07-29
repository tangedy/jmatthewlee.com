import { mkdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'rawcontents')
const output = path.join(root, 'src', 'assets', 'media')

const animatedMedia = [
  ['project thumbnails/FFT-DYdSgg7M.gif', 'fpga-dsp', 0, false],
  ['project thumbnails/Timebound-DZIWEC5d.gif', 'timebound'],
  ['project thumbnails/Spikeball_Detector-eCx22H_A.gif', 'spikeball', 20, true],
  ['project thumbnails/DutchBlitzer-B4kgbOrg.gif', 'dutch-blitzer'],
]

const stillMedia = [
  ['MatthewLee2-CXQd3G1t.png', 'matthew-home', 1200],
  ['MatthewLee-C6F5E-Dz.JPG', 'matthew-about', 1200],
  ['project thumbnails/MacroPad2-BcMRTy8M.png', 'macro-pad', 1280],
  ['project thumbnails/storybites-B3ElCN0D.png', 'storybites', 1280],
]

const megabytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

await mkdir(output, { recursive: true })
await rm(path.join(output, 'sharp-check.webp'), { force: true })

for (const [relativePath, name, posterPage = 0, includeAnimation = true] of animatedMedia) {
  const input = path.join(source, relativePath)
  const animationOutput = path.join(output, `${name}.webp`)
  const posterOutput = path.join(output, `${name}-poster.webp`)

  if (includeAnimation) {
    await sharp(input, { animated: true, limitInputPixels: false })
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 68, effort: 5, loop: 0 })
      .toFile(animationOutput)
  } else {
    await rm(animationOutput, { force: true })
  }

  await sharp(input, { page: posterPage, limitInputPixels: false })
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(posterOutput)

  const before = await stat(input)
  if (includeAnimation) {
    const after = await stat(animationOutput)
    console.log(`${name}: ${megabytes(before.size)} -> ${megabytes(after.size)}`)
  } else {
    const poster = await stat(posterOutput)
    console.log(`${name}: ${megabytes(before.size)} -> ${megabytes(poster.size)} poster`)
  }
}

for (const [relativePath, name, width] of stillMedia) {
  const input = path.join(source, relativePath)
  const imageOutput = path.join(output, `${name}.webp`)

  await sharp(input, { limitInputPixels: false })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(imageOutput)

  const [before, after] = await Promise.all([stat(input), stat(imageOutput)])
  console.log(`${name}: ${megabytes(before.size)} -> ${megabytes(after.size)}`)
}