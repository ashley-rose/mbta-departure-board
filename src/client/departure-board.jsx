import React from 'react'
import Moment from 'react-moment'
import Trip from '../common/trip'

const defaultInteval = 20000 // 20 seconds

export default class DepartureBoard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {trips: [], error: null}
    this.timeout = null
    this.lastStationId = null
    this.poll = this.poll.bind(this)
    this.clear = this.clear.bind(this)
  }

  componentDidMount () {
    this.poll()
  }

  componentDidUpdate () {
    if (this.lastStationId !== this.props.station.id) {
      this.clear()
      this.poll()
    }
  }

  componentWillUnmount () {
    this.clear()
  }

  clear () {
    if (this.timeout) {
      window.clearTimeout(this.timeout)
    }
    this.lastStationId = null
  }

  poll () {
    if (this.props.station && this.props.station.id) {
      this.lastStationId = this.props.station.id
      window.fetch(`/stations/${this.props.station.id}/departures.json`)
        .then(response => response.json())
        .then(trips => this.setState({
          trips: trips
            .map(trip => new Trip(trip))
            .sort((a, b) => a.scheduledDeparture - b.scheduledDeparture),
          error: null
        }))
        .then(() => {
          const interval = this.props.interval || defaultInteval
          this.timeout = window.setTimeout(this.poll, interval)
          if (this.props.onUpdate) {
            this.props.onUpdate({lastUpdated: new Date()})
          }
        })
        .catch(error => this.setState({error: error.toString()}))
    }
  }

  render () {
    return <div>
      {this.state.error && <div>Error: {this.state.error}</div>}
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Destination</th>
            <th>Train</th>
            <th>Track</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {this.state.trips.map(trip => {
            return (
              <tr key={trip.id}>
                <td><Moment format='h:mm' date={trip.scheduledDeparture} /></td>
                <td>{trip.destination.name}</td>
                <td>{trip.number}</td>
                <td>{trip.trackNumber || 'TBD'}</td>
                <td>
                  {trip.departureStatus}
                  {trip.updatedDeparture && <span>
                    (Now: <Moment format='h:mm' date={trip.updatedDeparture} />)
                  </span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  }
}
