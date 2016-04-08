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
            res.render('books', {result: booksInfo})
        })

});

router.get('/:id', function(req, res, next){
    
})
module.exports = router;
