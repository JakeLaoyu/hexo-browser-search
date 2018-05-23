const router = require('koa-router')()
var reptile = require('../controllers/reptile')

router.get('/search', reptile.reptile)

module.exports = router
