const axios = require('axios')
const Config = require('../config')
const xml2js = require('xml2js')

exports.reptile = async (ctx, next) => {
  var items = []
  const searchReg = new RegExp(ctx.query.search)
  const res = await axios.get(`${Config.index}/${Config.searchFile}`)

  const result = await new Promise((resolve, reject) => {
    xml2js.parseString(res.data, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })

  result.search.entry.forEach(item => {
    if (searchReg.test(item.title[0].toLowerCase()) || searchReg.test(item.content[0]._.toLowerCase())) {
      items.push(item)
    }
  })

  await ctx.render('index', {
    siteIndex: Config.index,
    items: items,
    search: ctx.query.search || '搜索结果'
  })
}
