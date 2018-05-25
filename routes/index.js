const router = require('koa-router')()
const search = require('../controllers/search')
const Config = require('../config')

router.get(Config.api.search, search.reptile)

router.get(Config.api.cache, search.cache)

module.exports = router
