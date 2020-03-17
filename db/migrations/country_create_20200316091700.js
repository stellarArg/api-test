exports.up = function(knex) {
    return knex.schema
        .createTable('country', function (table) {
            table.string('id');
            table.string('name', 255);
            table.string('code', 255);
            table.string('iso2', 2);
            table.boolean('deleted');
            table.timestamp('createdAt');
            table.timestamp('updatedAt');
            table.timestamp('deletedAt');
            table.integer('__v');
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('products');
};
