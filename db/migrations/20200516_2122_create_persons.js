exports.up = function(knex) {
    return knex.schema
        .createTable('persons', function (table) {
            table.string('id');
            table.string('name', 255);
            table.string('surname', 255);
            table.string('email', 255);
            table.string('gender', 255);
            table.string('avatar', 255);
            table.boolean('deleted');
            table.timestamp('createdAt');
            table.timestamp('updatedAt');
            table.timestamp('deletedAt');
            table.integer('__v');
        });
};

exports.down = function(knex) {
    return knex.schema.dropTable('products');
};
