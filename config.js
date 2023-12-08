module.exports = {
  index: 'https://i.jakeyu.top', // 网站首页
  searchFile: 'localsearch.json',
  favicon: '/images/favicon.ico',
  port: 3500,
  cronTime: '00 59 23 * * *', // 设置定时任务时间 参考 https://github.com/kelektiv/node-cron
  sentryUrl: '', // https://sentry.io 监控错误，如果不需要删除即可
  redis: {
    port: 6379,
    host: '127.0.0.1',
    username: 'default',
    password: '',
    key: 'search' // redis key
  },
  api: {
    search: '/search', // 搜索路由
    cache: '/search/cache' // 刷新缓存路由
  }
}
