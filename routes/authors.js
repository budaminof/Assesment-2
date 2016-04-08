var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {
    var youGuys= [];

    knex('authors')
    .then(function (authors){
        console.log('kitties');
        for (var i = 0; i < authors.length; i++) {
            youGuys.push({
                id: authors[i].id,
                first_name: authors[i].first_name,
                last_name: authors[i].last_name,
                biography:authors[i].biography,
                portrait_url: authors[i].portrait_url,
                booksTitle: []
            })
        }
    })

    return knex('authors')
    .innerJoin('authors_books', 'authors.id', 'authors_books.author_id')
    .innerJoin('books', 'authors_books.book_id', 'books.id')
    .select('books.title', 'authors_books.author_id')
    .then(function (data){
        for (var i = 0; i < youGuys.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if(youGuys[i].id == data[j].author_id){
                    youGuys[i].booksTitle.push(data[j].title)
                }
            }
        }
        res.render('authors', {result: youGuys, booksTitle: youGuys})
    })
});

router.get('/add', function(req, res, next){
    knex('books')
    .pluck('title')
    .then(function (allBooks){
        res.render('add',{allBooks: allBooks})
    })
})

router.get('/:id', function (req, res, next){
    return knex('authors')
        .where('authors.id', req.params.id)
        .innerJoin('authors_books', 'authors.id', 'authors_books.author_id')
        .innerJoin('books', 'authors_books.book_id', 'books.id')
        .select('books.title', 'authors.first_name', 'authors.last_name', 'authors.biography', 'authors.portrait_url', 'authors.id')
        .then(function(data){
            var booksArray=[];
            for (var i = 0; i < data.length; i++) {
                booksArray.push(data[i].title)
            }
            res.render('author',{books: booksArray, result: data[0]});
        })
})

router.get('/:id/edit', function (req, res, next){
    return knex('authors')
        .where('authors.id', req.params.id)
        .innerJoin('authors_books', 'authors.id', 'authors_books.author_id')
        .innerJoin('books', 'authors_books.book_id', 'books.id')
        .select('books.title', 'authors.first_name', 'authors.last_name', 'authors.biography', 'authors.portrait_url', 'authors.id')
        .then(function(data){
            var booksArray=[];
            for (var i = 0; i < data.length; i++) {
                booksArray.push(data[i].title)
            }
            knex('books')
            .pluck('title')
            .then(function (allBooks){
                res.render('editAuthor',{
                    result: data[0],
                    books: booksArray,
                    allBooks: allBooks
                });
            })
        })
})


module.exports = router;
