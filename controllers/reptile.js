var superagent = require('superagent')
var cheerio = require('cheerio')
var config = require('../config')
var mcache = require('memory-cache')

/**
 * 服务端缓存
 * @param  {[type]} duration 缓存时间
 * @return {[type]}          [description]
 */
exports.cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000)
        res.sendResponse(body)
      }
      next()
    }
  }
}

var items = []
var mainNum = 1

function main(link, total, res, search) {
  var searchReg = new RegExp(search)
  superagent.get(link)
    .end(function(err, sres, next) {
      // 常规的错误处理
      if (err) {
        return next(err)
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text)
      $('.post-type-normal').each(function(idx, element) {
        var $element = $(element)
        var title = $element.find('.post-title-link span').text().trim()

        // console.log('title: ' + title)
        // console.log(searchReg.test(title))

        if (searchReg.test(title.toLowerCase())) {
          items.push({
            title: title,
            dom: $element.html()
          })
        }
      })
      mainNum++
      if (total == mainNum) {
        res.render('index', {
          siteIndex: config.index,
          items: items,
          search: search || '搜索结果'
        })
      }
    })
}



exports.reptile = (req, res, next) => {
  var search = req.query.search
  if (search) {
    search = search.toLowerCase()
  }
  var searchReg = new RegExp(search)
  items = []
  mainNum = 1
  superagent.get(config.link)
    .end(function(err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err)
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text)
      $('.post-type-normal').each(function(idx, element) {
        var $element = $(element)
        var title = $element.find('.post-title-link span').text().trim()

        // console.log('title: ' + title)
        // console.log(searchReg.test(title))

        if (searchReg.test(title.toLowerCase())) {
          items.push({
            title: title,
            dom: $element.html()
          })
        }
      })

      var lastPage = 1
      $('.pagination .page-number').each(function(index, item) {
        console.log('index: ' + index)
        if (index + 1 == $('.pagination .page-number').length) {
          lastPage = $(item).html()
        }
      })
      console.log('lastPage: ' + lastPage)

      if (lastPage > 1) {
        for (let i = 2; i <= lastPage; i++) {
          main(config.link + 'page/' + i + '/', lastPage, res, search)
        }
      }
    })
}
