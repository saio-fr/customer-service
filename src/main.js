var _ = require('underscore');
var moment = require('moment');
var Wsocket = require('@saio/wsocket-component');
var Db = require('@saio/db-component');
var Config = require('./config.js');

var CustomerService = function(container, options) {
  var config = Config.build(options);
  this.ws = container.use('ws', Wsocket, config.ws);
  this.db = container.use('db', Db, config.db);
};

CustomerService.prototype.start = function() {
  var promises = [
    this.ws.register('fr.saio.api.customer.getAll',
      this.getAll.bind(this),
      { invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.customer.get.',
      this.get.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.customer.create',
      this.create.bind(this),
      { invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.customer.update.',
      this.update.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.customer.delete.',
      this.delete.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'})
  ];

  Promise.all(promises).then(function() {
    console.log('customer-service started');
    return Promise.resolve();
  }).catch(function(err) {
    console.log(err);
  });
};

CustomerService.prototype.stop = function() {
  return this.ws.unregister()
  .then(function() {
    console.log('customer-service stopped');
    return Promise.resolve();
  });
};

CustomerService.prototype.getAll = function(args, kwargs, details) {
  return this.db.model.Customer.findAll().catch((err) => {
    console.error(err.stack);
    throw new Error('Internal server error');
  });
};

/**
 * details.wildcards[0]: id
 */
CustomerService.prototype.get = function(args, kwargs, details) {

  return this.db.model.Customer.findOne({
    where: {id: details.wildcards[0]}
  }).catch((err) => {
    console.log(err.message);
    throw new Error('Internal server error');
  });
};

/**
 * kwargs.customer: object
 */
CustomerService.prototype.create = function(args, kwargs, details) {

  return this.db.model.Customer.create({
    name: kwargs.customer.name,
    maxUsers: kwargs.customer.maxUsers
  }).catch((err) => {
    console.log(err.message);
    throw err;
  });
};

/**
 * kwargs.customer: object
 * details.wildcards[0]: id
 */
CustomerService.prototype.update = function(args, kwargs, details) {

  return this.db.model.Customer.findOne({
    where: {id: details.wildcards[0]}
  }).then((customer) => {
    if (customer) {
      return customer.update({
        name: kwargs.customer.name,
        maxUsers: kwargs.customer.maxUsers
      }).catch((err) => {
        throw err;
      });
    } else {
      throw new Error('Customer not found. Check the license id provided.');
    }
  }).catch((err) => {
    console.error(err.stack);
    throw err;
  });
};

/**
 * details.wildcards[0]: id
 */
CustomerService.prototype.delete = function(args, kwargs, details) {

  return this.db.model.Customer.findOne({
    where: {id: details.wildcards[0]}
  }).then((customer) => {
    return customer.destroy();
  }).catch((err) => {
    console.error(err.stack);
    throw new Error('Internal server error');
  });
};

module.exports = CustomerService;
