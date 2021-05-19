'use strict'

var resultProcessorService = require('./resultProcessorService');


module.exports.getJobResultProcessors = function getJobResultProcessors(req, res, next) {
  resultProcessorService.getJobResultProcessors(req.swagger.params, res, next);
};

module.exports.addJobResultProcessor = function addJobResultProcessor(req, res, next) {
  resultProcessorService.addJobResultProcessor(req.swagger.params, res, next);
};

module.exports.findJobResultProcessorByName = function findJobResultProcessorByName(req, res, next) {
  resultProcessorService.findJobResultProcessorByName(req.swagger.params, res, next);
};


module.exports.processResultProcessor = function processResultProcessor(req, res, next) {
  resultProcessorService.processResultProcessor(req.swagger.params, res, next);
};

module.exports.deleteJobResultProcessor = function deleteJobResultProcessor(req, res, next) {
  resultProcessorService.deleteJobResultProcessor(req.swagger.params, res, next);
};

module.exports.updateResultProcessor = function updateResultProcessor(req, res, next) {
  resultProcessorService.updateResultProcessor(req.swagger.params, res, next);
};