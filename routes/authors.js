var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {
    knex('authors')
    .then(function (authorsInfo){
        res.render('authors',{result: authorsInfo});
    })
});

router.get('authors/:id',function (req, res, next){
    
})

module.exports = router;
