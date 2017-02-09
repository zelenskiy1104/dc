let assert = require('chai').assert;

const User = require('../models/user');

describe("User", function() {
    it("when auth returns user data", function(done){
        var name = 'Mocha';
        var email = 'mocha@test.com';
        var socketid = '';

        User.auth(name, email, socketid, function(data) {
            assert.equal(data.object.name, name);
            assert.equal(data.object.email, email);
            done();
        });
    });

    it("can change balance", function(done){
        var name = 'Mocha';
        var email = 'mocha@test.com';
        var socketid = '';

        User.auth(name, email, socketid, function(data) {
            var oldBalance = data.object.balance;
            var sum = 100;

            User.changeBalance(data.object.email, sum, (data) => {
                var newBalance = data.balance;
                assert.equal(oldBalance + sum, newBalance);

                done();
            });
        });
    });
});