const Reptile = require('./reptile')
const Config = require('../config')
const Redis = require('./redis')

/**
 * 搜索
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {Promise}       [description]
 */
exports.reptile = async (ctx, next) => {
  const searchText = ctx.query.search.trim().toLocaleString()
  var resultItems = []
  var datas = []
  const searchDatas = await Redis.get(Config.redis.key)

  if (searchDatas) {
    console.log('读取缓存')
    datas = searchDatas
  } else {
    console.log('无缓存，遍历搜索')
    datas = await Reptile.getDatas()
  }
  let keywords = searchText.split(/[\s]+/)
  if (keywords.length > 1) {
    keywords.push(searchText)
  }
  // perform local searching
  datas.forEach(function (data) {
    var isMatch = false
    var hitCount = 0
    var searchTextCount = 0
    var title = data.title.trim()
    var titleInLowerCase = title.toLowerCase()
    var content = data.content.trim().replace(/<[^>]+>/g, '')
    var contentInLowerCase = content.toLowerCase()
    var articleUrl = decodeURIComponent(data.url)
    var indexOfTitle = []
    var indexOfContent = []
    // only match articles with not empty titles
    if (title !== '') {
      keywords.forEach(function (keyword) {
        function getIndexByWord (word, text, caseSensitive) {
          var wordLen = word.length
          if (wordLen === 0) {
            return []
          }
          var startPosition = 0
          var position = []
          var index = []
          if (!caseSensitive) {
            text = text.toLowerCase()
            word = word.toLowerCase()
          }
          while ((position = text.indexOf(word, startPosition)) > -1) {
            index.push({
              position: position,
              word: word
            })
            startPosition = position + wordLen
          }
          return index
        }

        indexOfTitle = indexOfTitle.concat(getIndexByWord(keyword, titleInLowerCase, false))
        indexOfContent = indexOfContent.concat(getIndexByWord(keyword, contentInLowerCase, false))
      })
      if (indexOfTitle.length > 0 || indexOfContent.length > 0) {
        isMatch = true
        hitCount = indexOfTitle.length + indexOfContent.length
      }
    }

    // show search results

    if (isMatch) {
      // sort index by position of keyword

      [indexOfTitle, indexOfContent].forEach(function (index) {
        index.sort(function (itemLeft, itemRight) {
          if (itemRight.position !== itemLeft.position) {
            return itemRight.position - itemLeft.position
          } else {
            return itemLeft.word.length - itemRight.word.length
          }
        })
      })

      // merge hits into slices

      function mergeIntoSlice (text, start, end, index) {
        var item = index[index.length - 1]
        var position = item.position
        var word = item.word
        var hits = []
        var searchTextCountInSlice = 0
        while (position + word.length <= end && index.length !== 0) {
          if (word === searchText) {
            searchTextCountInSlice++
          }
          hits.push({
            position: position,
            length: word.length
          })
          var wordEnd = position + word.length

          // move to next position of hit

          index.pop()
          while (index.length !== 0) {
            item = index[index.length - 1]
            position = item.position
            word = item.word
            if (wordEnd > position) {
              index.pop()
            } else {
              break
            }
          }
        }
        searchTextCount += searchTextCountInSlice
        return {
          hits: hits,
          start: start,
          end: end,
          searchTextCount: searchTextCountInSlice
        }
      }

      var slicesOfTitle = []
      if (indexOfTitle.length !== 0) {
        slicesOfTitle.push(mergeIntoSlice(title, 0, title.length, indexOfTitle))
      }

      var slicesOfContent = []
      while (indexOfContent.length !== 0) {
        var item = indexOfContent[indexOfContent.length - 1]
        var position = item.position
        var word = item.word
        // cut out 100 characters
        var start = position - 20
        var end = position + 80
        if (start < 0) {
          start = 0
        }
        if (end < position + word.length) {
          end = position + word.length
        }
        if (end > content.length) {
          end = content.length
        }
        slicesOfContent.push(mergeIntoSlice(content, start, end, indexOfContent))
      }

      // sort slices in content by search text's count and hits' count

      slicesOfContent.sort(function (sliceLeft, sliceRight) {
        if (sliceLeft.searchTextCount !== sliceRight.searchTextCount) {
          return sliceRight.searchTextCount - sliceLeft.searchTextCount
        } else if (sliceLeft.hits.length !== sliceRight.hits.length) {
          return sliceRight.hits.length - sliceLeft.hits.length
        } else {
          return sliceLeft.start - sliceRight.start
        }
      })

      // select top N slices in content

      var upperBound = parseInt('1')
      if (upperBound >= 0) {
        slicesOfContent = slicesOfContent.slice(0, upperBound)
      }

      // highlight title and content
      /* eslint no-inner-declarations: 0 */
      function highlightKeyword (text, slice) {
        var result = ''
        var prevEnd = slice.start
        slice.hits.forEach(function (hit) {
          result += text.substring(prevEnd, hit.position)
          var end = hit.position + hit.length
          result += '<b class="search__keyword">' + text.substring(hit.position, end) + '</b>'
          prevEnd = end
        })
        result += text.substring(prevEnd, slice.end)
        return result
      }

      var resultTitle = ''
      var resultContent = ''

      if (slicesOfTitle.length !== 0) {
        resultTitle += highlightKeyword(title, slicesOfTitle[0])
      } else {
        resultTitle += title
      }

      slicesOfContent.forEach(function (slice) {
        resultContent += highlightKeyword(content, slice)
      })

      resultItems.push({
        resultTitle: resultTitle,
        resultContent: resultContent,
        articleUrl: articleUrl,
        searchTextCount: searchTextCount,
        hitCount: hitCount,
        id: resultItems.length
      })
    }
  })

  await ctx.render('index', {
    siteIndex: Config.index,
    items: resultItems,
    search: ctx.query.search || '搜索结果',
    searchText: searchText
  })
}

/**
 * 刷新缓存
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {Promise}       [description]
 */
exports.cache = async (ctx, next) => {
  Redis.del(Config.redis.key)
  await Reptile.getDatas()
  ctx.body = '刷新缓存成功'
}
