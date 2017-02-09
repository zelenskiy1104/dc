describe('When load kitchen page', function() {
    beforeEach(function() {
        browser.get('/kitchen');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Drone Cafe - Kitchen');
    });

    it('shoud have an order list', function() {
        expect($('.order-list').isPresent()).toBe(true);
    });

    it('shoud have a cooking list', function() {
        expect($('.cooking-list').isPresent()).toBe(true);
    });

    it('shoud update an order list', function() {
        let oldOrderList = element.all(by.css('.order-list-item'));
        oldOrderList.count().then((oldCount) => {
            browser.get('/');
            element(by.id('name')).sendKeys('John Doe');
            element(by.id('email')).sendKeys('john@doe.com');
            element(by.id('loginButton')).click();

            element(by.id('menu-open')).click();
            var cart = $$('.material-icons').first();

            browser.driver.sleep(1000);

            cart.click();

            browser.get('/kitchen');

            browser.driver.sleep(1000);

            let newOrderList = element.all(by.css('.order-list-item'));
            expect(newOrderList.count()).toEqual(oldCount + 1);
        });
    });

    it('shoud remove order when start cooking click', function() {
        let oldOrderList = element.all(by.css('.order-list-item'));
        oldOrderList.count().then((oldOrderCount) => {
            browser.driver.sleep(1000);
            let startCooking = element.all(by.css('.start-cooking')).first();
            startCooking.click();
            browser.driver.sleep(1000);
            let newOrderList = element.all(by.css('.order-list-item'));
            expect(newOrderList.count()).toEqual(oldOrderCount - 1);
        });
    });

    it('shoud add cooking list item when start cooking click', function() {

        browser.get('/');
        element(by.id('name')).sendKeys('John Doe');
        element(by.id('email')).sendKeys('john@doe.com');
        element(by.id('loginButton')).click();

        element(by.id('menu-open')).click();
        var cart = $$('.material-icons').first();

        browser.driver.sleep(1000);

        cart.click();

        browser.get('/kitchen');

        browser.driver.sleep(1000);

        let oldCookingList = element.all(by.css('.cooking-list-item'));
        oldCookingList.count().then((oldCookingCount) => {
            let startCooking = element.all(by.css('.start-cooking')).first();
            startCooking.click();
            browser.driver.sleep(1000);
            let newCookingList = element.all(by.css('.cooking-list-item'));
            expect(newCookingList.count()).toEqual(oldCookingCount + 1);
        });
    });
});