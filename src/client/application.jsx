import React from 'react'
import Moment from 'react-moment'
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
        <Moment format='dddd, MMM, D h:mm A' date={this.state.lastUpdated} />
      </div>
      <DepartureBoard
        station={this.state.station}
        onUpdate={(event) => this.setState({lastUpdated: event.lastUpdated})} />
    </div>
  }
}
