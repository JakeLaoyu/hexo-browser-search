module.exports = {
  index: 'https://i.jakeyu.top', // 网站首页
  searchFile: 'localsearch.xml',
  port: 3500,
  redis: {
    port: 6379,
    host: '127.0.0.1',
    keyPreifx: 'searchDatas' // redis key
  }
}
