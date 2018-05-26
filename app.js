const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const mount = require('koa-mount')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')
const Cron = require('./controllers/cron')
var Config = require('./config')

const index = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

if (process.env.NODE_ENV === 'development') {
  app.use(require('koa-static')(path.join(__dirname, '/public')))
} else {
  app.use(mount('/search', require('koa-static')(path.join(__dirname, '/public'))))
}

app.use(views(path.join(__dirname, '/views'), {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  // 向ejs传递数据
  ctx.state.NODE_ENV = process.env.NODE_ENV
  ctx.state.ROUTER = Config.api.search
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

Cron.startCronJob()

module.exports = app
