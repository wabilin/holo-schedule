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
    time: 2020-07-30T08:01:00.000Z,
    streamer: '天音かなた',
    guests: [ '赤井はあと', '姫森ルーナ' ]
  },
  {
    time: 2020-07-30T08:01:00.000Z,
    streamer: '姫森ルーナ',
    guests: [ '赤井はあと', '天音かなた' ]
  },
  { time: 2020-07-30T08:20:00.000Z, streamer: 'ロボ子さん', guests: [] },
  ...
]
```

For detail, see the TypeScript definition.
