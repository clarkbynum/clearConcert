describe('rootServices', function(){
	var rootSrv;

	beforeEach(module('clearJazz'))

	beforeEach(inject(function(rootServices) {
		rootSrv = rootServices;
	}));

	it('should be an object', function() {
		expect(typeof rootSrv).toBe('object');
	});
});