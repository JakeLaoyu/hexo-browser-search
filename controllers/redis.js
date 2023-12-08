const Config = require('../config')
const Redis = require('ioredis')
const redis = new Redis({
  port: Config.redis.port, // Redis port
  host: Config.redis.host, // Redis host
  username: Config.redis.username || 'default', // Redis username
  password: Config.redis.password || '' // Redis password
})

/**
 * 设置缓存
 * @param {String} key  redis key
 * @param {JSON} data 数据
 */
exports.set = (key, data) => {
  redis.set(key, JSON.stringify(data))
}

/**
 * 读取redis缓存
 * @param  {String} key redis key
 * @return {JSON}     数据
 */
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

/**
 * 删除数据
 * @param  {String} key redis key
 * @return {[type]}     [description]
 */
exports.del = (key) => {
  redis.del(key)
}
