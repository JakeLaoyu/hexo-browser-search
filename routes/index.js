const router = require('koa-router')()
const search = require('../controllers/search')
const Cache = require('../controllers/cache')

router.get('/search', search.reptile)

router.get('/test', async (ctx, next) => {
  ctx.body = await Cache.get('git')
})

module.exports = router
