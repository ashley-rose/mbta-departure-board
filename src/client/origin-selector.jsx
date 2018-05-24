import React from 'react'
import Station from '../common/station'

export default class OriginSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = { stations: [], value: '', error: null }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    window
      .fetch('/stations/origins.json')
      .then(response => response.json())
      .then(stations => this.setState({
        stations: stations
          .map(station => new Station(station))
          .sort((a, b) => a.name.localeCompare(b.name))
      }))
      .catch(() => window.alert('Unable to fetch stations'))
  }

  handleChange (event) {
    const value = event.target.value
    this.setState({value})
    if (this.props.onChange && value !== '') {
      this.props.onChange(
        this.state.stations.find(station => station.id === value)
      )
    }
  }

  render () {
    return <span>
      <select value={this.state.value} onChange={this.handleChange}>
        {this.state.value === '' &&
          <option value=''>Select Station</option>
        }
        {this.state.stations.map(station =>
          <option key={station.id} value={station.id}>{station.name}</option>
        )}
      </select>
      {this.state.error && <div>Error: {this.state.error}</div>}
    </span>
  }
}
