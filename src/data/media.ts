/**
 * Hero video: a 8.8 s seamless loop generated with Higgsfield (Kling 3.0,
 * image-to-video from a Higgsfield GPT Image keyframe), crossfaded at the
 * seam and encoded for the web.
 *
 * The <video> tries the self-hosted copy in /public/media first and falls
 * back to the Higgsfield CDN copy. Run `npm run fetch-media` once to
 * download the files into /public/media so the site is fully self-hosted.
 */
export const HERO_VIDEO = {
  desktop: {
    local: 'media/hero-1080.mp4',
    cdn: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Jq1Qb3rUA0JTrven74DInYKsC1/68270e96-0c77-4805-9f49-70de5ff10caa.mp4',
  },
  mobile: {
    local: 'media/hero-720.mp4',
    cdn: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Jq1Qb3rUA0JTrven74DInYKsC1/9cd71008-481b-437b-9c33-c72a2fe47850.mp4',
  },
  poster: 'media/hero-poster-loop.jpg',
}
