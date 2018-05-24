const CronJob = require('cron').CronJob
const Datas = require('./datas')
const Redis = require('./redis')

var job = new CronJob({
  cronTime: '00 59 23 * * *',
  onTick: async function () {
    console.log('定时任务')
    Redis.del('searchDatas')
    await Datas.getDatas()
  },
  start: false,
  timeZone: 'Asia/Shanghai'
})

exports.startCronJob = async () => {
  job.start()
  var datas = await Datas.getDatas()
  Redis.set('searchDatas', datas)
}
