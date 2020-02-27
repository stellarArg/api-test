const {CountriesController} = include('controllers');

module.exports = router => {
    router.get('/', CountriesController.fetch);

    return router;
};
