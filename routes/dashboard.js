var express = require('express')
const router = express.Router()
const firebaseAdminDb = require('../connections/firebase_admin')

const categoriesRef = firebaseAdminDb.ref('/categories/')

router.get('/article', function (req, res, next) {
  res.render('dashboard/article', { title: 'Express' })
})

router.get('/categories', function (req, res, next) {
  res.render('dashboard/categories', { title: 'Express' })
})

router.get('/archives', function (req, res, next) {
  res.render('dashboard/archives', { title: 'Express' })
})

router.post('/categories/create', function (req, res) {
  const categoryRef = categoriesRef.push()
  const key = categoryRef.key

  const data = req.body
  data.id = key
  var postdata = JSON.parse(JSON.stringify(data))
  console.log('postdata', postdata)

  categoryRef.set(postdata).then(function () {
    res.redirect('/dashboard/categories')
  })
})

module.exports = router
