var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {
var youBooks = [];

        knex('books')
        .orderBy('title')
        .then(function (data){
            for (var i = 0; i < data.length; i++) {
                youBooks.push({
                    id: data[i].id,
                    title: data[i].title,
                    description: data[i].description,
                    genre: data[i].genre,
                    cover_url: data[i].cover_url,
                    authors:[]
                })
            }
        })

        return knex('books')
        .innerJoin('authors_books', 'books.id', 'authors_books.book_id')
        .innerJoin('authors', 'authors_books.author_id', 'authors.id')
        .select('authors_books.book_id','authors.first_name', 'authors.last_name')
        .then(function (data){
            for (var i = 0; i < youBooks.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    if(youBooks[i].id == data[j].book_id){
                        youBooks[i].authors.push(data[j].first_name+ ' '+ data[j].last_name)
                    }
                }
            }
            res.render('books',{result: youBooks, authors: youBooks})
        })


});

router.get('/add', function(req, res, next){
    knex('authors')
    .select('last_name', 'first_name', 'id')
    .then(function (authors){
        var name= [];
        for (var i = 0; i < authors.length; i++) {
            name.push({author: authors[i].first_name+' '+authors[i].last_name, id: authors[i].id})
        }
        res.render('addBook',{authors: name})
    })
})

router.get('/:id/edit', function (req, res, next){
    res.render('editBook')
})

router.get('/:id', function(req, res, next){

    return knex('books')
    .where('books.id', req.params.id)
    .innerJoin('authors_books', 'books.id', 'authors_books.book_id')
    .innerJoin('authors', 'authors_books.author_id', 'authors.id')
    .select('books.title','authors.first_name', 'authors.last_name', 'books.description', 'books.genre', 'books.cover_url')
    .then(function(data){
        var authorsArray= [];
        for (var i = 0; i < data.length; i++) {
            authorsArray.push(data[i].first_name + " " + data[i].last_name)
        }
        res.render('book',{book: data[0], authors: authorsArray})
    })

})
module.exports = router;
