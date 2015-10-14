var tape = require('blue-tape');
var when = require('when');
var _ = require('underscore');

var Wsocket = require('@saio/wsocket-component');

var RandomService = function(container, options) {
  this.ws = container.use('ws', Wsocket, {
    url: 'ws://crossbar:8081',
    realm: 'saio',
    authId: 'service',
    password: 'service'
  });
};

RandomService.prototype.start = function() {
  return when.resolve();
};

RandomService.prototype.stop = function() {
  return when.resolve();
};

RandomService.prototype.getAll = function() {
  return this.ws.call('fr.saio.api.customer.getAll');
};

RandomService.prototype.getCustomer = function(license) {
  return this.ws.call('fr.saio.api.customer.get.' + license);
};

RandomService.prototype.createCustomer = function(customer) {
  return this.ws.call('fr.saio.api.customer.create', [], {customer: customer});
};

RandomService.prototype.updateCustomer = function(license, customer) {
  return this.ws.call('fr.saio.api.customer.update.' + license, [], {customer: customer});
};

RandomService.prototype.deleteCustomer = function(license) {
  return this.ws.call('fr.saio.api.customer.delete.' + license);
};

module.exports = RandomService;
