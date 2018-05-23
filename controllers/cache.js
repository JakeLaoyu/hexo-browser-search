const Config = require('../config')
const Redis = require('ioredis')
const redis = new Redis({
  port: Config.redis.port, // Redis port
  host: Config.redis.host // Redis host
})

exports.set = (key, data) => {
  redis.set(`${Config.redis.keyPreifx}/${key}`, JSON.stringify(data), 'EX', Config.redis.expire)
}

exports.get = (key) => {
  return new Promise((resolve, reject) => {
    redis.get(`${Config.redis.keyPreifx}/${key}`, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      resolve(JSON.parse(result))
    })
  })
}
