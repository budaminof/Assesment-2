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
    return knex('books')
        .where('books.id', req.params.id)
        .innerJoin('authors_books', 'books.id', 'authors_books.book_id')
        .innerJoin('authors', 'authors_books.author_id', 'authors.id')
        .select('authors.id', 'books.title', 'authors.first_name', 'authors.last_name', 'books.description', 'books.cover_url', 'books.genre')
        .then(function(data){
	            var authorsArray=[];
            for (var i = 0; i < data.length; i++) {
                authorsArray.push({author: data[i].first_name+' '+data[i].last_name, id: data[i].id, bookId: req.params.id})
            }

            knex('authors')
            .select('authors.first_name', 'authors.last_name', 'authors.id')
            .then(function (authors){
                    var authorsArr = []
                    for (var i = 0; i < authors.length; i++) {
                        authorsArr.push({author: authors[i].first_name+' '+authors[i].last_name, id: authors[i].id})
                    }
                res.render('editBook',{
                    book_id: req.params.id,
                    result: data[0],
                    authors: authorsArray,
                    allAuthors: authorsArr
                });
            })
        })
})

router.get('/:id', function(req, res, next){

    return knex('books')
    .where('books.id', req.params.id)
    .innerJoin('authors_books', 'books.id', 'authors_books.book_id')
    .innerJoin('authors', 'authors_books.author_id', 'authors.id')
    .select('books.title','authors.first_name', 'authors.last_name', 'books.description', 'books.genre', 'books.cover_url', 'books.id')
    .then(function(data){
        var authorsArray= [];
        for (var i = 0; i < data.length; i++) {
            authorsArray.push(data[i].first_name + " " + data[i].last_name)
        }
        res.render('book',{book: data[0], authors: authorsArray})
    })

})

router.post('/add', function(req, res, next){
    var authors = req.body.author_id;
    var authorsArray = authors instanceof Array ? authors : [authors];

    knex('books')
    .insert({
        title: req.body.title,
        genre: req.body.genre,
        cover_url: req.body.cover_url,
        description: req.body.description
    })
    .returning('id')
    .then(function(id){
        var author_array = authorsArray.map(function(author_id){
            return ({book_id: id[0], author_id: author_id})
        })
        return knex('authors_books')
            .insert(author_array)
            .then(function (data){
                res.redirect('/books');
            })
    })
})

router.post('/:idBook/edit', function (req, res, next){
    var authorId = req.body.author_id;
    var authorsIdArray = authorId instanceof Array ? authorId : [authorId];

    knex('books')
    .where({id: req.params.idBook})
    .update({
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.cover_url
    })
    .returning('id')
    .then(function(id){
        var authorObj = authorsIdArray.map(function(author_id){
            return ({book_id: id[0], author_id: author_id})
        })
        return knex('authors_books')
            .insert(authorObj)
            .then(function (data){
                res.redirect('/books');
            })
    })

})

router.get('/:idAuthor/:idBook/removeAuthor', function (req, res, next){
    knex('authors_books')
    .where({author_id: req.params.idAuthor, book_id: req.params.idBook})
    .first()
    .del()
    .then(function(){
        res.redirect('/books/'+req.params.idBook+'/edit');
    })
})

router.get('/:id/delete', function(req, res, next){
        knex('books')
        .where({id: req.params.id})
        .first()
        .del()
        .then(function (data){
            res.redirect('/books')
        })
})

module.exports = router;
