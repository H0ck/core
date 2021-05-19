'use strict'


let AppManager = require('../src/entities/AppManager');
let JobManager = require('../src/entities/JobManager');
module.exports.getJobs = function getJobs(req, res, next) {
  res.send(AppManager.getJobs());
};

module.exports.addJob = function addJob(req, res, next) {
  try {
    
    let newJob = new JobManager.Job(req.job.value);
    newJob.validate();
    AppManager.addJob(newJob);
    res.status(200).send(newJob);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};