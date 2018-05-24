const Station = require('./station')

module.exports = class Trip {
  constructor (that) {
    this.id = that.id
    this.number = that.number
    this.origin = new Station(that.origin)
    this.destination = new Station(that.destination)
    this.trackNumber = that.trackNumber || null
    this.departureStatus = that.departureStatus
    this.scheduledDeparture = new Date(that.scheduledDeparture)

    if (that.updatedDeparture) {
      this.updatedDeparture = new Date(that.updatedDeparture)
    } else if (that.lateness > 0) {
      this.updatedDeparture = new Date(
        this.scheduledDeparture.getTime() + that.lateness)
    } else {
      this.updatedDeparture = null
    }
  }
}
