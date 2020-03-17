const {
    CountriesController, StatesController
} = include('controllers');

module.exports = router => {
    router.get('/', CountriesController.fetch, StatesController.fetch);
    return router;
};
