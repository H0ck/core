# H0ck Framework - Core API

Repository for H0ck Framework Core API, a restful API that manages all the jobs and the Lambda orchestration of the entire framework.
This API uses Open API Specification and the documentation of the API can be found in /docs endpoint once deployed.

This component can be deployed with npm start. Default deployment port is 7001. This value can be replaced with the environment variable PORT.

This component is dependant of a Redis Database. By default it tries to connect to localhost:6379 . This values can be replaced with environment variables REDIS_HOST and REDIS_PORT.

A docker image for this component is available in https://hub.docker.com/r/h0ck/core
The docker image can be built with command docker build . --tag <image-tag>

The API exposes the management of two types of entities. Jobs and Result Processors.


## Jobs
A job is a specification that contains information about tasks that should be executed. The results of this tasks executions will be stored and associated with its corresponding job.
The job contain the information of the code to execute, the list of params that should be pass to each task and the configuration with the limits in the execution, for example, the number of task per second.

### Job example

A complete list of examples can be found in /jobExamples folder

## Result Processors
When the results of the tasks from a Job are received, they are stored in plain text. If a job contains a big amount of task, the results will take up a lot of storage and will be slow to send over the network. To solve this problem, result processors can be created and executed dinamically. 
A result processor is a piece of code that receives all the results of a job and do a transformation to convert it in to a smaller piece of information. This code usually transform all the results in the minimum amount of data that the application using the framework need.

### Result processor example

The current list of default result processors code can be found in /src/resultProcessorUtils/defaults folder.

## Api usage
This section is intended for give a small overview across the endpoints that the Core API has available.

### Job Endpoints

**/jobs [GET, POST] :** Obtain the list of all the current jobs or creates a new one.
**/jobs/\<id\> [GET, PUT, DELETE]:** Obtain, update or delete a job via its id

### ResultProcessor Endpoints

**/resultProcessor [GET, POST] :** Obtain the list of all the current Result processors or creates a new one.
**/jobs/\<name\> [GET]:** Obtain a Result processor by its name.
**/jobs/\<name\>/process [POST]:** Obtain the result of the application the result processor to the jobs result.

