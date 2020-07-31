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

function parseScheduleHtml(html: string | Buffer) {
  const { window } = new JSDOM(html);
  const { document } = window;

  const allThumbnail = document.querySelectorAll("a.thumbnail");
  const data = mapNodeList(allThumbnail, dataFromAThumbnail);

  console.log(data);

  return "";
}

export default parseScheduleHtml;
