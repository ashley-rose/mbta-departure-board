// Simple express middleware to get from a Promise to a JSON response
module.exports = function handle (lamba) {
  return function (req, res, next) {
    lamba(req).then(json => res.status(200).json(json), next)
  }
}
