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
        .where({id: req.params.id})
        .then(function (author){
            return knex('authors_books')
            .where({author_id: req.params.id})
            .pluck('book_id')
            .then(function(booksId){
                return knex('books')
                .whereIn('id', booksId)
                .pluck('title')
                .then(function(titles){
                    res.render('author',{result: author[0], books: titles});
                })
            })
        })
})

module.exports = router;
