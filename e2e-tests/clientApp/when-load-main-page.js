describe('When load main page', function() {
    beforeEach(function() {
        browser.get('/');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Drone Cafe');
    });

    it('should show login form', function() {
        expect($('.login-form').isPresent()).toBeTruthy();
    });
});