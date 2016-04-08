var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {
    var authorsObj= {};

    knex('authors')
    .orderBy('last_name')
    .then(function (authorsInfo){
        console.log(authorsInfo);
        authorsObj.authors = authorsInfo
        res.render('authors',{result: authorsInfo});
    })

    knex('books')
    .pluck('id')
    .then(function(){

    })


});

router.get('/:id', function (req, res, next){
    return knex('authors')
        .where('authors.id', req.params.id)
        .innerJoin('authors_books', 'authors.id', 'authors_books.author_id')
        .innerJoin('books', 'authors_books.book_id', 'books.id')
        .select('books.title', 'authors.first_name', 'authors.last_name', 'authors.biography', 'authors.portrait_url')
        .then(function(data){
            var booksArray=[];
            for (var i = 0; i < data.length; i++) {
                booksArray.push(data[i].title)
            }
            res.render('author',{books: booksArray, result: data[0]});
        })
})

module.exports = router;
