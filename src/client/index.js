import ready from 'document-ready'
import React from 'react'
import ReactDOM from 'react-dom'
import Application from './application.jsx'

ready(() => ReactDOM.render(
  React.createElement(Application, {}, null),
  document.getElementById('root')
))
