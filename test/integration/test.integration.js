var tape = require('blue-tape');
var when = require('when');
var _ = require('underscore');
var Db = require('@saio/db-component');
var Tester = require('@saio/service-runner').Tester;
var RandomService = require('./helpers/randomService.js');

tape('create an invalid customer with empty name', function(t) {

  var customer = {
    name: '',
    maxUsers: 2
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createCustomer(customer).then(function(res) {
      t.fail('customer have been created');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});

tape('create an invalid customer with 0 maxUsers', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createCustomer({
      name: 'saio',
      maxUsers: 0
    }).then(function(res) {
      t.fail('customer have been created');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});

tape('create an invalid customer with undefined values', function(t) {

  var customer = {};

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createCustomer(customer).then(function(res) {
      t.fail('customer have been created');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});

// We will use it later to get, update, delete the created customer.
var customerId = null;

tape('create a valid customer', function(t) {

  var customer = {
    name: 'saio',
    maxUsers: 2
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createCustomer(customer).then(function(res) {
      customerId = res.id;
      t.pass('customer created');
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('get all customers', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.getAll().then(function(res) {
      if (res[0].name === 'saio' && res[0].maxUsers === 2) {
        t.pass('customers can be retrieved');
      } else {
        t.fail('customers do not match with previously created ones');
      }
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('get a specific customer', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.getCustomer(customerId).then(function(res) {
      if (res.name === 'saio' && res.maxUsers === 2) {
        t.pass('customer created & can be retrieved');
      } else {
        t.fail('customer do not match with previously created one');
      }
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('update a specific customer', function(t) {

  var customer = {
    name: 'saio v2',
    maxUsers: 8
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.updateCustomer(customerId, customer).then(function(res) {
      if (res.name === 'saio v2' && res.maxUsers === 8) {
        t.pass('customer updated & can be retrieved');
      } else {
        t.fail('customer do not match with previously updated one');
      }
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('delete a specific customer', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.deleteCustomer(customerId).then(function(res) {
      return client.getAll().then(function(res) {
        if (_.isEmpty(res)) {
          t.pass('customer has been deleted');
        } else {
          t.fail('customer has not been deleted');
        }
        return tester.stop();
      });
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('update an invalid customer', function(t) {

  var customer = {
    name: 'saio v2',
    maxUsers: 8
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.updateCustomer('5858-59595-343-44', customer).then(function(res) {
      t.fail('customer has been updated');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});
