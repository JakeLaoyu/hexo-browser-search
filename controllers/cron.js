const CronJob = require('cron').CronJob
const Reptile = require('./reptile')
const Redis = require('./redis')
const Config = require('../config')

var job = new CronJob({
  cronTime: Config.cronTime,
  onTick: async function () {
    console.log('定时任务')
    Redis.del(Config.redis.key)
    await Reptile.getDatas()
  },
  start: false,
  timeZone: 'Asia/Shanghai'
})

exports.startCronJob = async () => {
  job.start()
  var datas = await Reptile.getDatas()
  Redis.set(Config.redis.key, datas)
}
