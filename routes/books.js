var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {

var resultData= {};
var array= [];

        knex('books')
        .orderBy('title')
        .then(function (booksInfo){
            resultData.books = booksInfo;
            console.log('------------------------------', booksInfo);
            res.render('books', {result: booksInfo})
        })

});

router.get('/:id', function(req, res, next){
    
    return knex('books')
    .where('books.id', req.params.id)
    .innerJoin('authors_books', 'books.id', 'authors_books.book_id')
    .innerJoin('authors', 'authors_books.author_id', 'authors.id')
    .select('books.title', 'authors.last_name', 'books.description', 'books.genre', 'books.cover_url')
    .then(function(data){
        var authorsArray= [];
        for (var i = 0; i < data.length; i++) {
            authorsArray.push(data[i].last_name)
        }
        res.render('book',{book: data[0], authors: authorsArray})
    })

})
module.exports = router;
