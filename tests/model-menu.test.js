let assert = require('chai').assert;

const Menu = require('../models/menu');

describe("Menu", function() {
    it("has menu items", function(done){
        Menu.list(function(collection){
            assert.notEqual(collection.length, 0);
            done();
        });
    });
});