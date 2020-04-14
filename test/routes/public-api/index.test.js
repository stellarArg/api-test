const {
    request,
    Sinon
} = require('..');


describe('public-api', () => {
    it('should return true', done => {
       true.should.be.equalTo(true);
	done();
    }
});
