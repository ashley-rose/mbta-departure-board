import React from 'react'
import DateTime from './date-time.jsx'
import DepartureBoard from './departure-board.jsx'
import OriginSelector from './origin-selector.jsx'

export default class Application extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      station: null,
      lastUpdated: new Date()
    }
  }

  render () {
    return <div>
      <div>
        <OriginSelector onChange={(station) => this.setState({station})} />
        <DateTime dateTime={this.state.lastUpdated} format={{
          weekday: 'long',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }} />
      </div>
      <DepartureBoard
        station={this.state.station}
        onUpdate={(event) => this.setState({lastUpdated: event.lastUpdated})} />
    </div>
  }
}
