import https from 'https'

const OPTIONS = {
  hostname: 'schedule.hololive.tv',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    Cookie: 'timezone=Asia/Tokyo'
  }
}

function getScheduleHtml(): Promise<string> {
  const chunks: Uint8Array[] = [];

  return new Promise((resolve, reject) => {
    const req = https.request(OPTIONS, res => {
      res.on('data', chunk => {
        chunks.push(chunk)
      })

      res.on('end', () => {
        const html = Buffer.concat(chunks).toString('utf-8')
        resolve(html)
      })
    })

    req.on('error', error => {
      reject(error)
    })

    req.end()
  })
}

export default getScheduleHtml
