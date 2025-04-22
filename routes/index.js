var express = require('express')
const moment = require('moment')
const striptags = require('striptags')
var router = express.Router()
var firebaseAdminDb = require('../connections/firebase_admin')
const convertPagination = require('../modules/convertPagination')

// const ref = firebaseAdminDb.ref('myName')
// ref.once('value', function (snapshot) {
//   console.log('snapshot', snapshot.val())
// })

const categoriesRef = firebaseAdminDb.ref('/categories/')
const articlesRef = firebaseAdminDb.ref('/articles/')

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' })

  const currentPage = Number.parseInt(req.query.page, 10) || 1
  let categories = {}

  categoriesRef
    .once('value')
    .then((snapshot) => {
      categories = snapshot.val()
      return articlesRef.orderByChild('update_time').once('value')
    })
    .then((snapshot) => {
      var articles = []
      snapshot.forEach(function (snapshotChild) {
        // console.log('child', snapshotChild.val())

        if ('public' === snapshotChild.val().status) {
          articles.push(snapshotChild.val())
        }
      })

      articles.reverse()
      var pageData = convertPagination(articles, currentPage)
      console.log('pageData', pageData)

      res.render('archives', {
        title: 'Express',
        categoryId: null,
        articles: articles,
        // pagination: data.page,
        page: pageData.page,
        categories,
        striptags, // 去除 HTML 標籤套件
        moment // 時間套件
      })
    })
})

// router.get('/post', function (req, res, next) {
//   res.render('post', { title: 'Express' })
// })

router.get('/post/:id', (req, res) => {
  const id = req.param('id')
  let categories = {}
  categoriesRef
    .once('value')
    .then((snapshot) => {
      categories = snapshot.val()
      return articlesRef.child(id).once('value')
    })
    .then((snapshot) => {
      console.log(snapshot.val())
      const article = snapshot.val()
      if (!article) {
        // return errorPage(res, '找不到該文章')
        return res.render('error', {
          title: '找不到該文章'
        })
      }
      res.render('post', {
        title: 'Express',
        categoryId: null,
        article,
        categories,
        moment // 時間套件
      })
    })
})

router.get('/dashboard/signup', function (req, res, next) {
  res.render('dashboard/signup', { title: 'Express' })
})

module.exports = router
