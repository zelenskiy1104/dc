/*
 * Когда пользователь залогинен
 * */

describe('When user logged in', function() {
    beforeEach(function() {
        browser.get('/');

        element(by.id('name')).sendKeys('John Doe');
        element(by.id('email')).sendKeys('john@doe.com');
        element(by.id('loginButton')).click();
    });

    it('should see own name', function() {
        var name = element(by.className('card-title'));

        expect(name.getText()).toEqual('John Doe');
    });

    it('should see own email', function() {
        var email = element(by.className('user-email'));

        expect(email.getText()).toEqual('john@doe.com');
    });

    it('should see own balance', function() {
        var balance = element(by.className('user-balance'));

        expect(balance.isPresent()).toBeTruthy();
    });

    it('can increase own balance', function() {
        var userBalance = element(by.className('user-balance'));

        userBalance.getText().then(function (oldBalance) {
            element(by.className('increase-balance')).click();

            let floatOldBalance = parseFloat(oldBalance);

            userBalance.getText().then((newBalance) => {
                let floatNewBalance = parseFloat(newBalance);

                expect(floatOldBalance + 100).toEqual(floatNewBalance);
            });
        });
    });

    it('can open menu', function() {
        element(by.id('menu-open')).click();

        var modal = element(by.className('modal'));

        expect(modal.isDisplayed()).toBe(true);
    });

    it('can close menu', function() {
        element(by.id('menu-open')).click();
        element(by.id('menu-close')).click();
        browser.driver.sleep(1000);
        var menu = element(by.id('menu'));
        expect(menu.getCssValue('display')).toBe('none');
    });

    it('can add item to order', function() {
        browser.driver.sleep(1000);
        let oldList = element.all(by.css('.order-list-title'));

        oldList.count().then((oldCount) => {
            element(by.id('menu-open')).click();
            var cart = $$('.material-icons').first();
            cart.click();
            browser.driver.sleep(1000);
            let newList = element.all(by.css('.order-list-title'));
            expect(newList.count()).toEqual(oldCount + 1);
        });
    });
});