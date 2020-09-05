import { JSDOM } from 'jsdom'
import { mapNodeList } from './util'

function selectTrimTextContent(ele: Element, selector: string): string {
  return ele.querySelector(selector)?.textContent?.trim() || ''
}

function dataFromAThumbnail(thumb: Element) {
  const time = selectTrimTextContent(thumb, '.datetime')
  const name = selectTrimTextContent(thumb, '.name')

  const images = mapNodeList(
    thumb.querySelectorAll('img'),
    (img) => img.src,
  )

  const avatarImages = images.filter((src) => src.startsWith('https://yt3.ggpht.com'))
  const livePreviewImage = images.find(src => src.startsWith('https://img.youtube.com/')) || ''

  return {
    time,
    name,
    avatarImages,
    livePreviewImage,
  }
}

interface LiveBlock {
  time: Date
  streamer: string
  avatarImages: string[]
  livePreviewImage: string
  link: string
  streaming: boolean
}

function parseToLiveBlocks(html: string | Buffer): LiveBlock[] {
  const { window } = new JSDOM(html)
  const { document } = window
  const year = (new Date()).getFullYear().toString()

  const rows = document.querySelectorAll('#all > .container > .row')

  let date = ''

  const lives: LiveBlock[] = []

  rows.forEach(row => {
    const dateDiv = row.querySelector('.holodule')
    if (dateDiv) {
      date = dateDiv.textContent?.replace(/\s+/g, '') || ''
      date = date.match(/\d+\/\d+/)![0].replace('/', '-')
    }

    const allThumbnail: NodeListOf<HTMLAnchorElement> = row.querySelectorAll('a.thumbnail')
    allThumbnail.forEach(thumbnail => {
      const link = thumbnail.href
      const streaming = thumbnail.style.borderColor === 'red'
      const { time, name, avatarImages, livePreviewImage } = dataFromAThumbnail(thumbnail)

      lives.push({
        link,
        avatarImages,
        livePreviewImage,
        time: new Date(`${year}-${date}T${time}:00+09:00`),
        streamer: name,
        streaming,
      })
    })
  })

  return lives
}

export type StreamerImageDict = Record<string, string>
type ImageStreamerDict = Record<string, string>

function nextStreamerImageDict(liveBlocks: LiveBlock[], oldDict: StreamerImageDict) {
  const dict = { ...oldDict }
  liveBlocks.forEach(({ avatarImages: images, streamer }) => {
    dict[streamer] = images[0]
  })

  return dict
}

function reverseDict(dict: StreamerImageDict): ImageStreamerDict {
  const reversed: ImageStreamerDict = {}
  Object.entries(dict).forEach(([streamer, img]) => {
    reversed[img] = streamer
  })

  return reversed
}

export interface LiveInfo {
  time: Date
  link: string
  videoId: string
  streamer: string
  livePreviewImage: string
  guests: string[]
  streaming: boolean
}

interface ParseResult {
  lives: LiveInfo[]
  dict: StreamerImageDict
}

function getVideoId(link: string): string {
  return link.replace('https://www.youtube.com/watch?v=', '')
}

/**
 * @param html - Html of https://schedule.hololive.tv. Get with Japan timezone (GTM+9)
 * @param storedDict - An object stored { vtuberName: iconImageSrc }
 * @returns - Lives schedule and updated dict
 */
function parseScheduleHtml(
  html: string | Buffer,
  storedDict: StreamerImageDict = {},
): ParseResult {
  const liveBlocks = parseToLiveBlocks(html)
  const streamerImageDict = nextStreamerImageDict(liveBlocks, storedDict)

  const dict = reverseDict(streamerImageDict)

  const lives = liveBlocks.map(liveBlocks => {
    const { streamer, avatarImages, time, link, livePreviewImage, streaming } = liveBlocks

    const guests = avatarImages.splice(1).map(x => dict[x]).filter(Boolean)
    const videoId = getVideoId(link)

    return {
      time,
      streamer,
      guests,
      link,
      videoId,
      livePreviewImage,
      streaming,
    }
  })

  return { lives, dict: streamerImageDict }
}

export default parseScheduleHtml
