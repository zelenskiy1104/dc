let assert = require('chai').assert;

const Order = require('../models/order');
const User = require('../models/user');

/*
 * Тесты модели order
 * */

describe("Order", function() {
    it("user can add item to order", function(done){
        var name = 'Mocha';
        var email = 'mocha@test.com';
        var socketid = '';

        User.auth(name, email, socketid, function(data) {
            var user_id = data.object._id;
            var menu = {id: 587071};

            Order.create(menu, user_id, function(data) {
                assert.equal(data.status, 'ok');

                done();
            });
        });
    });

    it("can return order list for kitchen", function(done){
        var status = 'order';

        Order.kitchenList(status, function(collection) {
            var count = collection.length;
            assert.notEqual(count, 0);

            done();
        });
    });

    it("can change status", function(done){
        var status = 'order';

        Order.kitchenList(status, function(collection) {
            let order = collection[0];

            Order.changeStatus('cooking', order._id, function(result) {
                let res = result.result.result.nModified;
                assert.equal(res, 1);

                done();
            });
        });
    });

    it("can drop order", function(done){
        var status = 'cooking';
        var email = 'mocha@test.com';

        Order.kitchenList(status, (collection) => {
            let order = collection[0];

            Order.dropOrder(order._id, email, (result) => {
                assert.equal(result.status, 1);

                done();
            });
        });
    });
});