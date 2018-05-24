const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')

const Trip = require('../common/trip')
const hashId = require('./hash-id')

const url = 'https://developer.mbta.com/lib/gtrtfs/Departures.csv'
const ttl = 30 * 1000 // milliseconds

// Make the source hash of name and ID for a Station
function mkStation (name) {
  return {
    id: hashId(name, 'sta'),
    name
  }
}

// Mangement and caching layer for the departures feed
module.exports = class DepartureManager {
  constructor () {
    this._trips = []
    this._lastUpdated = null
  }

  // Get a list of all trips
  trips () {
    if (this._trips && this._lastUpdated !== null) {
      return Promise.resolve(this._trips)
    } else {
      return this.pollOnce().then(() => this._trips)
    }
  }

  // Get a list of all trips leaving from a given station
  tripsFrom (stationId) {
    return this.trips()
      .then(trips => trips.filter(trip => trip.origin.id === stationId))
  }

  // Get a list of origin stations
  originStations () {
    return this.trips()
      .then(trips => Object.values(trips.reduce((stations, trip) => {
        if (!stations[trip.origin.id]) {
          stations[trip.origin.id] = trip.origin
        }
        return stations
      }, {})))
  }

  pollOnce () {
    if (this._lastUpdated === null || Date.now() - this._lastUpdated > ttl) {
      return fetch(url)
        .then(response => response.text())
        .then(body => {
          this._lastUpdated = Date.now()
          this._trips = parse(body, {
            columns: true,
            cast: true
          }).map(row => new Trip({
            id: hashId([row.Origin, row.Destination, row.scheduledTime], 'trp'),
            number: row.Trip.toString(),
            origin: mkStation(row.Origin),
            destination: mkStation(row.Destination),
            trackNumber: row.Track,
            departureStatus: row.Status,
            scheduledDeparture: row.ScheduledTime * 1000,
            lateness: (row.Lateness || 0) * 1000
          }))
          return this
        })
    } else {
      return Promise.resolve(this)
    }
  }
}
