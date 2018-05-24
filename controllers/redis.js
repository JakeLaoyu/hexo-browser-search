const Config = require('../config')
const Redis = require('ioredis')
const redis = new Redis({
  port: Config.redis.port, // Redis port
  host: Config.redis.host // Redis host
})

exports.set = (key, data) => {
  redis.set(key, JSON.stringify(data))
}

exports.get = (key) => {
  return new Promise((resolve, reject) => {
    redis.get(key, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      resolve(JSON.parse(result))
    })
  })
}

exports.del = (key) => {
  redis.del(key)
}
