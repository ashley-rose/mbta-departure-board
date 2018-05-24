const crypto = require('crypto')

const salt = 'random ;)'
const algorithm = 'sha1'
const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const keyLength = 8
const separator = '-'

// Generate a scoped ID for something from a source object and a prefix
module.exports = function hashId (source, prefix) {
  const hash = crypto.createHash(algorithm)

  hash.update(JSON.stringify(source))
  hash.update(salt)

  const digest = hash.digest()
  let result = prefix.toLowerCase() + separator

  for (let i = 0; i < keyLength; i++) {
    result += alphabet[digest[i] % alphabet.length]
  }

  return result
}
