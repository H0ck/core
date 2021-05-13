'use strict'

var varapiv1jobsidController = require('./apiv1jobsidControllerService');

module.exports.findJobByid = function findJobByid(req, res, next) {
  varapiv1jobsidController.findJobByid(req.swagger.params, res, next);
};


module.exports.findJobResultByid = function findJobResultByid(req, res, next) {
  varapiv1jobsidController.findJobResultByid(req.swagger.params, res, next);
};


module.exports.deleteJob = function deleteJob(req, res, next) {
  varapiv1jobsidController.deleteJob(req.swagger.params, res, next);
};

module.exports.updateJob = function updateJob(req, res, next) {
  varapiv1jobsidController.updateJob(req.swagger.params, res, next);
};