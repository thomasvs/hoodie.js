require('../../lib/setup');

var isPromise = require('../../../src/utils/promise/is_promise');
var resolve = require('../../../src/utils/promise/resolve');
var reject = require('../../../src/utils/promise/reject');
var resolveWith = require('../../../src/utils/promise/resolve_with');
var rejectWith = require('../../../src/utils/promise/reject_with');

var noop = function() {};

describe('hoodie promises API', function() {

  describe('#isPromise(object)', function() {

    it('should return true if object is a promise', function() {
      var object = {};
      object.then = noop;
      expect(isPromise(object)).to.be(true);
    });

    it('should return false for deferred objects', function() {
      var object = {};
      expect(isPromise(object)).to.be(false);
    });

    it('should return false when object is undefined', function() {
      expect(isPromise(void 0)).to.be(false);
    });

  });

  describe('#resolve()', function() {

    it('simply returns resolved promise', function() {
      expect(typeof resolve()).to.be('object');
    });

    it.skip('should be applyable', function() {
      var promise = reject().then(null, resolve);
      expect(promise).to.be.resolved();
    });

  });

  describe('#reject()', function() {

    it('simply returns rejected promise', function() {
      expect(typeof reject()).to.be('object');
    });

    it.skip('should be applyable', function() {
      var promise = resolve();
      expect(promise).to.be.rejected();
    });

  });

  describe('#resolveWith(something)', function() {

    it('wraps passad arguments into a promise and returns it', function() {
      resolveWith('funky', 'fresh')
      .then(function (a, b) {
        expect(a, b).to.eql('funky', 'fresh');
      });

    });

    it('should be applyable', function() {
      rejectWith('FUNKY!')
      .then(null, resolveWith)
      .then(function (error) {
        expect(error.message).to.eql('FUNKY!');
      });
    });

  });

  describe('#rejectWith(something)', function() {

    it('wraps passed arguments into a promise and returns it as Error', function() {
      rejectWith('funk overflow!')
      .then(this.noop, function (error) {
        expect(error).to.be.an(Error);
        expect(error).to.eql({
          name: 'HoodieError',
          message: 'funk overflow!'
        });
      });

    });

    it('should be applyable', function() {
      resolveWith('wicked!')
      .then(rejectWith)
      .then(this.noop, function (error) {
        expect(error).to.be.an(Error);
        expect(error.name).to.eql('HoodieError');
        expect(error).to.eql({
          name: 'HoodieError',
          message: 'wicked!'
        });
      });
    });

  });

});