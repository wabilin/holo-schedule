# holo-schedule

[![npm version](https://badge.fury.io/js/holo-schedule.svg)](https://badge.fury.io/js/holo-schedule)

> I love Haachama.

Hololive schedule crawler and parser.

## Install
```sh
yarn add holo-schedule

# or
npm install holo-schedule
```

## Usage

```ts
import parseScheduleHtml from 'holo-schedule'
// or:
// const parseScheduleHtml  = require('holo-schedule').default

import getScheduleHtml from 'holo-schedule/lib/getScheduleHtml'

// You can also get the html by yourself
const html = await getScheduleHtml()

// The dict stores steamers' icon data, you can save for using next time
const { lives, dict } = parseScheduleHtml(html)

console.log(lives)
```

Gets list like
```
[
  {
    time: 2020-07-31T11:02:00.000Z,
    streamer: 'アステル・レダ',
    guests: [ '鏡見キラ', '奏手イヅル' ],
    link: 'https://www.youtube.com/watch?v=WntgMec1Q6A',
    livePreviewImage: 'https://img.youtube.com/vi/WntgMec1Q6A/mqdefault.jpg'
  },
  {
    time: 2020-08-01T10:00:00.000Z,
    streamer: '赤井はあと',
    guests: [],
    link: 'https://www.youtube.com/watch?v=bYKeO_RKh6I',
    livePreviewImage: 'https://img.youtube.com/vi/bYKeO_RKh6I/mqdefault.jpg'
  },
  ...
]
```

For detail, see the TypeScript definition.
