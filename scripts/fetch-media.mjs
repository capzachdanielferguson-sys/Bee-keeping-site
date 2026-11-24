#!/usr/bin/env node
/**
 * Downloads the full-quality (1080p / 720p) hero video into /public/media so
 * the site serves it from your own host. The <video> element already prefers
 * these local files, then the Higgsfield CDN, then the bundled 540p copy —
 * no code change needed after running this.
 *
 *   npm run fetch-media
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const MEDIA = [
  {
    file: 'public/media/hero-1080.mp4',
    url: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Jq1Qb3rUA0JTrven74DInYKsC1/68270e96-0c77-4805-9f49-70de5ff10caa.mp4',
  },
  {
    file: 'public/media/hero-720.mp4',
    url: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Jq1Qb3rUA0JTrven74DInYKsC1/9cd71008-481b-437b-9c33-c72a2fe47850.mp4',
  },
]

const root = path.resolve(import.meta.dirname, '..')

for (const { file, url } of MEDIA) {
  const dest = path.join(root, file)
  try {
    const s = await stat(dest)
    if (s.size > 0) {
      console.log(`✓ ${file} already present (${(s.size / 1e6).toFixed(1)} MB)`)
      continue
    }
  } catch {
    /* not downloaded yet */
  }
  process.stdout.write(`↓ ${file} … `)
  const res = await fetch(url)
  if (!res.ok) {
    console.error(`failed (${res.status} ${res.statusText})`)
    process.exitCode = 1
    continue
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, buf)
  console.log(`${(buf.length / 1e6).toFixed(1)} MB`)
}
