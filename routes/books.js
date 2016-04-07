var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);
/* GET users listing. */
router.get('/', function(req, res, next) {
    var result = {}

    knex('authors_books')
    .then(function (data){
        result.books = data;
    })
    knex('books')
    .whereIn('id', result.books.book_id)
    .then(function (books){
        console.log('books: ',books);
    })

    res.render('books');
});

module.exports = router;
