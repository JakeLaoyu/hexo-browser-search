const router = require('koa-router')()
const search = require('../controllers/search')

router.get('/search', search.reptile)

module.exports = router
