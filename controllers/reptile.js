const axios = require('axios')
const Redis = require('./redis')
const Config = require('../config')

/**
 * 获取搜索数据
 * @return {[type]} [description]
 */
exports.getDatas = async () => {
  const redisDatas = await Redis.get(Config.redis.key)
  const isXml = !/json$/i.test(Config.searchFile)

  if (redisDatas) {
    return redisDatas
  }

  const res = await axios({
    method: 'get',
    url: `${Config.index}/${Config.searchFile}`,
    responseType: isXml ? 'xml' : 'json'
  })

  const datas = isXml ? await new Promise((resolve, reject) => {
    require('jsdom/lib/old-api').env('', function (err, window) {
      if (err) {
        reject(err)
        return
      }
      var $ = require('jquery')(window)
      var datas = $('entry', res.data).map(function () {
        return {
          title: $('title', this).text(),
          content: $('content', this).text(),
          url: $('url', this).text()
        }
      }).get()
      resolve(datas)
    })
  }) : res.data

  console.log('set redis data')

  Redis.set(Config.redis.key, datas)

  return datas
}
