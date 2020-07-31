import { JSDOM } from "jsdom";
import { mapNodeList } from "./util";

function selectTrimTextContent(ele: Element, selector: string): string {
 return ele.querySelector(selector)?.textContent?.replace(/\s+/g, "") || "";
}

function dataFromAThumbnail(thumb: Element) {
  const time = selectTrimTextContent(thumb, ".datetime")
  const name = selectTrimTextContent(thumb, ".name")

  const images = mapNodeList(
    thumb.querySelectorAll("img"),
    (img) => img.src
  )
  .filter((src) => src.startsWith("https://yt3.ggpht.com"));

  return {
    time,
    name,
    images,
  };
}

interface LiveBlock {
  time: Date,
  streamer: string,
  images: string[],
}

function parseToLiveBlocks(html: string | Buffer): LiveBlock[] {
  const { window } = new JSDOM(html);
  const { document } = window;
  const year = (new Date()).getFullYear().toString()

  const rows = document.querySelectorAll('#all > .container > .row')

  let date = ''

  const lives: LiveBlock[] = []

  rows.forEach(row => {
    const dateDiv = row.querySelector('.holodule')
    if (dateDiv) {
      date = dateDiv.textContent?.replace(/\s+/g, "") || "";
      date = date.match(/\d+\/\d+/)![0].replace('/', '-')
    } else {
      const allThumbnail = row.querySelectorAll("a.thumbnail");
      allThumbnail.forEach(thumbnail => {
        const { time, name, images } = dataFromAThumbnail(thumbnail)
        lives.push({
          images,
          time: new Date(`${year}-${date}T${time}:00+09:00`),
          streamer: name,
        });
      })
    }
  })

  return lives;
}

type StreamerImageDict = Record<string, string>
type ImageStreamerDict = Record<string, string>

function nextStreamerImageDict(liveBlocks: LiveBlock[], oldDict: StreamerImageDict) {
  const dict = {...oldDict}
  liveBlocks.forEach(({ images, streamer }) => {
    dict[streamer] = images[0];
  });

  return dict
}

function reverseDict(dict: StreamerImageDict): ImageStreamerDict {
  const reversed: ImageStreamerDict = {}
  Object.entries(dict).forEach(([streamer, img]) => {
    reversed[img] = streamer
  })

  return reversed
}

interface LiveInfo {
  time: Date
  streamer: string
  guests: string[]
}

interface ParseResult {
  lives: LiveInfo[]
  dict: StreamerImageDict
}

/**
 * @param html - Html of https://schedule.hololive.tv. Get with Japan timezone (GTM+9)
 * @param storedDict - An object stored { vtuberName: iconImageSrc }
 * @returns - Lives schedule and updated dict
 */
function parseScheduleHtml(
  html: string | Buffer,
  storedDict: StreamerImageDict = {}
): ParseResult {
  const liveBlocks = parseToLiveBlocks(html)
  const streamerImageDict = nextStreamerImageDict(liveBlocks, storedDict)
  const dict = reverseDict(streamerImageDict)

  const lives = liveBlocks.map(liveBlocks => {
    const { streamer, images, time } = liveBlocks

    const guests = images.splice(1).map(x => dict[x]).filter(Boolean)

    return {
      time,
      streamer,
      guests,
    }
  })

  return { lives, dict };
}

export default parseScheduleHtml;
