const axios = require('axios')
const Config = require('../config')
const xml2js = require('xml2js')

exports.reptile = async (ctx, next) => {
  var items = []
  const searchText = ctx.query.search
  const searchReg = new RegExp(searchText)
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
      if (searchReg.test(item.content[0]._.toLowerCase())) {
        let index = item.content[0]._.toLowerCase().indexOf(searchText)
        var searchContent = item.content[0]._.substr(index - 10, 150)
        searchContent = searchContent.replace(searchReg, '<b class="search__keyword">' + searchText + '</b>')
      }
      if (searchReg.test(item.title[0].toLowerCase())) {
        var searchTitle = item.title[0].toLowerCase().replace(searchReg, '<b class="search__keyword">' + searchText + '</b>')
      }
      items.push({
        ...item,
        searchContent: searchContent || item.content[0]._.substr(0, 150),
        searchTitle: searchTitle || item.title[0]
      })
    }
  })

  await ctx.render('index', {
    siteIndex: Config.index,
    items: items,
    search: ctx.query.search || '搜索结果'
  })
}
