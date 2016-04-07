
exports.up = function(knex, Promise) {
    return knex.schema.createTable('books', function (table){
        table.increments();
        table.string('title').notNullable();
        table.text('description');
        table.string('genre').notNullable();
        table.string('cover_url');

    })

    .createTable('authors', function (table){
        table.increments();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.text('biography');
        table.string('portrait_url');
    })

    .createTable('authors_books', function (table){
        table.integer('book_id').references('books.id').onUpdate('CASCADE').onDelete('CASCADE');
        table.integer('author_id').references('authors.id').onUpdate('CASCADE').onDelete('CASCADE');
    })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('authors_books')
    .dropTable('authors')
    .dropTable('books');

};
