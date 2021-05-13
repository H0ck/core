'use strict'

var varapiv1jobsController = require('./apiv1jobsControllerService');

module.exports.getJobs = function getJobs(req, res, next) {
  varapiv1jobsController.getJobs(req.swagger.params, res, next);
};

module.exports.getJobsResumed = function getJobsResumed(req, res, next) {
  varapiv1jobsController.getJobsResumed(req.swagger.params, res, next);
};

module.exports.addJob = function addJob(req, res, next) {
  varapiv1jobsController.addJob(req.swagger.params, res, next);
};