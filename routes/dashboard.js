var express = require('express')
const moment = require('moment')
const striptags = require('striptags')
const router = express.Router()
const firebaseAdminDb = require('../connections/firebase_admin')

const categoriesRef = firebaseAdminDb.ref('/categories/')
const articlesRef = firebaseAdminDb.ref('/articles/')

router.get('/archives', function (req, res, next) {
  const status = req.query.status || 'public'
  console.log('status', status)
  let categories = {}
  categoriesRef
    .once('value')
    .then(function (snapshot) {
      categories = snapshot.val()
      return articlesRef.orderByChild('update_time').once('value')
    })
    .then(function (snapshot) {
      const articles = []
      snapshot.forEach(function (snapshotChild) {
        console.log('child', snapshotChild.val())

        if (status === snapshotChild.val().status) {
          articles.push(snapshotChild.val())
        }
      })
      articles.reverse()
      // console.log('articles', articles)
      res.render('dashboard/archives', {
        title: 'Express',
        articles,
        categories,
        striptags,
        moment,
        status
      })
    })
})

/**
 * 種類
 */

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

router.post('/categories/create', function (req, res) {
  const categoryRef = categoriesRef.push()
  const key = categoryRef.key

  const data = req.body
  data.id = key
  var postdata = JSON.parse(JSON.stringify(data))
  console.log('postdata', postdata)
  categoriesRef
    .orderByChild('path')
    .equalTo(data.path)
    .once('value')
    .then(function (snapshot) {
      console.log('snapshot', snapshot.val())
      if (snapshot.val() !== null) {
        req.flash('info', '已有相同路徑')
        res.redirect('/dashboard/categories')
      } else {
        categoryRef.set(postdata).then(function () {
          res.redirect('/dashboard/categories')
        })
      }
    })
})

router.post('/categories/delete/:id', function (req, res) {
  const id = req.param('id')
  console.log('id', id)
  categoriesRef.child(id).remove()
  req.flash('info', '資料已刪除')
  res.redirect('/dashboard/categories')
})

/**
 * 文章
 */

router.get('/article', function (req, res, next) {
  categoriesRef.once('value').then(function (snapshot) {
    const categories = snapshot.val()
    console.log('categories', categories)
    res.render('dashboard/article', {
      title: 'Express',
      categories
    })
  })
})

router.post('/article/create', function (req, res, next) {
  console.log(req.body)
  const data = req.body
  const articleRef = articlesRef.push()
  const key = articleRef.key
  const updateTime = Math.floor(Date.now() / 1000)
  data.id = key
  data.update_time = updateTime
  console.log('data', data)
  var postdata = JSON.parse(JSON.stringify(data))
  articleRef.set(postdata).then(function () {
    // res.redirect('/dashboard/article')
    res.redirect(`/dashboard/article/${key}`)
  })
})

router.post('/article/update/:id', function (req, res) {
  console.log(req.body)
  const data = req.body
  const id = req.param('id')
  console.log('update data', data)

  articlesRef
    .child(id)
    .update(data)
    .then(() => {
      res.redirect(`/dashboard/article/${data.id}`)
    })
})

router.post('/article/delete/:id', function (req, res) {
  console.log(req.body)
  const data = req.body
  const id = req.param('id')
  articlesRef.child(id).remove()
  req.flash('info','文章已刪除')
  res.send('文章已刪除')
  res.end()
})

router.get('/article/:id', function (req, res, next) {
  const id = req.param('id')
  // console.log('id', id)
  let categories = {}
  categoriesRef
    .once('value')
    .then(function (snapshot) {
      categories = snapshot.val()
      // const categories = snapshot.val()
      return articlesRef.child(id).once('value')
    })
    .then(function (snapshot) {
      const article = snapshot.val()
      console.log(article)
      res.render('dashboard/article', {
        title: 'Express',
        categories,
        article
      })
    })
})

module.exports = router
