const {PersonsController} = include('controllers');

module.exports = router => {

    router.route('/')
        .get(PersonsController.fetch)
        .post(PersonsController.create);

    router.route('/:id')
        .get(PersonsController.fetchOne)
        .put(PersonsController.save)
        .delete(PersonsController.delete);

    return router;
};
