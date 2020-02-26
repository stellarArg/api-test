const {CountriesController} = require('../controllers');

module.exports = router => {
    router.get('/', (req, res) => CountriesController.fetch);

    return router;
}
