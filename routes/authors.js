var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);

/* GET users listing. */
router.get('/', function(req, res, next) {
    var youGuys= [];

    knex('authors')
    .then(function (authors){
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
    .select('title', 'id')
    .then(function (allBooks){
        var books= [];
        for (var i = 0; i < allBooks.length; i++) {
            books.push({title: allBooks[i].title, id: allBooks[i].id});
        }
        res.render('addAuthor',{allBooks: books})
    })
})

router.get('/:id/edit', function (req, res, next){
    return knex('authors')
    .where('authors.id', req.params.id)
    .innerJoin('authors_books', 'authors.id', 'authors_books.author_id')
    .innerJoin('books', 'authors_books.book_id', 'books.id')
    .select('books.id', 'books.title', 'authors.first_name', 'authors.last_name', 'authors.biography', 'authors.portrait_url')
    .then(function(data){
        var booksArray=[];
        for (var i = 0; i < data.length; i++) {
            booksArray.push({title: data[i].title, id: data[i].id, authorID: req.params.id})
        }
        return knex('books')
        .select('title', 'id')
        .then(function (allBooks){
            res.render('editAuthor',{
                authorId: req.params.id,
                result: data[0],
                books: booksArray,
                allBooks: allBooks
            });
        })
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

router.post('/add', function (req, res, next){
    var bookId = req.body.book_id;
    var bookIdArray = bookId instanceof Array ? bookId : [bookId];

    knex('authors')
    .insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        portrait_url: req.body.portrait_url,
        biography: req.body.biography
    }).returning('id')
    .then(function (id){
        var bookIdOjb = bookIdArray.map(function(bookIdArrayI){
            return ({author_id: id[0], book_id: bookIdArrayI})
        })
        return knex('authors_books')
        .insert(bookIdOjb)
        .then(function (data){
            res.redirect('/authors');
        })
    })
})

router.post('/:idAuthor/edit', function (req, res, next){
    var bookId = req.body.book_id;
    var booksIdArray = bookId instanceof Array ? bookId : [bookId];
    knex('authors')
    .where({id: req.params.idAuthor})
    .update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        portrait_url: req.body.portrait_url,
        biography: req.body.biography
    })
    .returning('id')
    .then(function(id){
        var booksObj = booksIdArray.map(function(booksID){
            return ({author_id: id[0], book_id: booksID})
        })
        return knex('authors_books')
            .insert(booksObj)
            .then(function (data){
                res.redirect('/authors');
            })
    })

})

router.get('/:idBook/:authorId/removeBook', function(req, res, next){
    knex('authors_books')
    .where({book_id: req.params.idBook, author_id: req.params.authorId})
    .first()
    .del()
    .then(function (data){
        res.redirect('/authors/'+req.params.authorId+'/edit');
    })
})

router.get('/:id/delete', function(req, res, next){
        knex('authors')
        .where({id: req.params.id})
        .first()
        .del()
        .then(function (data){
            res.redirect('/authors');
        })
})

module.exports = router;
