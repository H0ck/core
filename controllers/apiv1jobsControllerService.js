'use strict'

let util = require('util');

let AppManager = require('./entities/AppManager');
let JobManager = require('./entities/JobManager')
module.exports.getJobs = function getJobs(req, res, next) {
  res.send(AppManager.getJobs());
};

module.exports.getJobsResumed = async function getJobs(req, res, next) {
  let jobs = AppManager.getJobs();
  let resumes = {};
  await Promise.all(AppManager.getJobs().map(async(job) => {
    resumes[job.id] = await AppManager.getResultResumed(job.id);
  }))

  res.send({jobs: jobs, resumes: resumes});
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