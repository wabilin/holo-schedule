import getScheduleHtml from './getScheduleHtml'
import parse from './parseScheduleHtml'

async function main() {
  const html = await getScheduleHtml();
  const parsed = parse(html)

  console.log(parsed.lives)
}

main().catch(e => { console.error(e) })
