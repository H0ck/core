'use strict'

const AppManager = require('./entities/AppManager')
module.exports.findJobByid = function findJobByid(req, res, next) {
  res.send({
    message: 'This is the mockup controller for findJobByid'
  });
};

module.exports.findJobResultByid = function findJobByid(req, res, next) {
  res.send(AppManager.getResults(req.id.value));
};

module.exports.deleteJob = function deleteJob(req, res, next) {
  res.send({
    message: 'This is the mockup controller for deleteJob'
  });
};

module.exports.updateJob = function updateJob(req, res, next) {
  res.send({
    message: 'This is the mockup controller for updateJob'
  });
};