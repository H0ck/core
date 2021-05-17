'use strict'

var resultProcessorService = require('./resultProcessorService');


module.exports.getResultProcessorsByJob = function getResultProcessorsByJob(req, res, next) {
  resultProcessorService.getResultProcessorsByJob(req.swagger.params, res, next);
};

module.exports.findResultProcessorById = function findResultProcessorById(req, res, next) {
  resultProcessorService.findResultProcessorById(req.swagger.params, res, next);
};


module.exports.processResultProcessorById = function processResultProcessorById(req, res, next) {
  resultProcessorService.processResultProcessorById(req.swagger.params, res, next);
};

module.exports.deleteResultProcessor = function deleteResultProcessor(req, res, next) {
  resultProcessorService.deleteResultProcessor(req.swagger.params, res, next);
};

module.exports.updateResultProcessor = function updateResultProcessor(req, res, next) {
  resultProcessorService.updateResultProcessor(req.swagger.params, res, next);
};