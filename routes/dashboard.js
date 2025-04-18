var express = require('express')
const router = express.Router()
const firebaseAdminDb = require('../connections/firebase_admin')

const categoriesRef = firebaseAdminDb.ref('/categories/')

router.get('/article', function (req, res, next) {
  res.render('dashboard/article', { title: 'Express' })
})

router.get('/categories', function (req, res, next) {
  const messages = req.flash('info')
  categoriesRef.once('value').then(function (snapshot) {
    const categories = snapshot.val()
    console.log('categories', categories)
    res.render('dashboard/categories', {
      title: 'Express',
      messages: messages,
      hasInfo: messages.length > 0,
      categories: categories
    })
  })
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

router.post('/categories/delete/:id', function (req, res) {
  const id = req.param('id')
  console.log('id', id)
  categoriesRef.child(id).remove()
  req.flash('info', '資料已刪除')
  res.redirect('/dashboard/categories')
})

module.exports = router
