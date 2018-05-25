const CronJob = require('cron').CronJob
const Datas = require('./datas')
const Redis = require('./redis')
const Config = require('../config')

var job = new CronJob({
  cronTime: Config.cronTime,
  onTick: async function () {
    console.log('定时任务')
    Redis.del(Config.redis.key)
    await Datas.getDatas()
  },
  start: false,
  timeZone: 'Asia/Shanghai'
})

exports.startCronJob = async () => {
  job.start()
  var datas = await Datas.getDatas()
  Redis.set(Config.redis.key, datas)
}
