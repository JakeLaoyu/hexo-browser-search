module.exports = {
  index: 'https://i.jakeyu.top', // 网站首页
  searchFile: 'localsearch.json',
  port: 3500,
  cronTime: '00 59 23 * * *', // 设置定时任务时间 参考 https://github.com/kelektiv/node-cron
  redis: {
    port: 6379,
    host: '127.0.0.1',
    keyPreifx: 'searchDatas' // redis key
  }
}
