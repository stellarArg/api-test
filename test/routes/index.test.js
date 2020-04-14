const {request} = require('.');

const packageJson = root_path('package.json');

describe('index', () => {
    it(`should return version number equals to ${packageJson.version}`, done => {
        request
            .get('/ping')
            .expect(200)
            .end((err, res) => {
                res.body.should.have.property('version').which.is.a.String();
                res.body.version.should.be.equal(packageJson.version);
                done();
            });
    });

    it('should return if application is ready', done => {
        request
            .get('/ready')
            .expect(200)
            .end((err, res) => {
                res.body.should.have.property('deps').which.is.an.Array();
                res.body.should.have.property('name').which.is.a.String();
                res.body.should.have.property('status').which.is.a.String();
                done();
            });
    });

    it('should return health of application', done => {
        request
            .get('/health')
            .expect(200)
            .end((err, res) => {
                res.body.should.have.property('name').which.is.a.String();
                done();
            });
    });
});
