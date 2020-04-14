const {CountryController} = include('controllers');

module.exports = router => {

    router.route('/')
        .get(CountryController.fetch);

    return router;
};
