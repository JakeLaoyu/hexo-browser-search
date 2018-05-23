module.exports = {
  index: 'https://i.jakeyu.top', // 网站首页
  searchFile: 'localsearch.xml',
  port: 3500,
  redis: {
    port: 6379,
    host: '127.0.0.1',
    keyPreifx: 'hbs', // redis key前缀，用于防止和其他项目冲突
    expire: 60 * 60 * 24 // expire after the time(s)
  }
}
