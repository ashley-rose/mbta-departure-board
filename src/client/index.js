import ready from 'document-ready'
import React from 'react'
import ReactDOM from 'react-dom'
import Application from './application.jsx'

function boot () {
  ready(() => ReactDOM.render(
    React.createElement(Application, {}, null),
    document.getElementById('root')
  ))
}

if (!global.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js'
  ], function (require) {
    require('intl')
    require('intl/locale-data/jsonp/en.js')
    boot()
  })
} else {
  boot()
}
