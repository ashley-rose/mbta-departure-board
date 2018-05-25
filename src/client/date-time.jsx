import React from 'react'
const locale = 'en-US'

export default function (props) {
  if (props.dateTime instanceof Date) {
    const format = new Intl.DateTimeFormat(locale, props.format)
    return <time dateTime={props.dateTime.toISOString()}>
      {format.format(props.dateTime)}
    </time>
  } else {
    return <span />
  }
}
