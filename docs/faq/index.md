import TOCInline from '@theme/TOCInline';

# FAQs

Don't see your question here? Email us at [hello@magniv.app](mailto:hello@magniv.app) 👋

<TOCInline toc={toc} />

## Where is my task?
If your task is not in your tasks page on the Magniv Dashboard verify the following:

1. Your last build in the builds table has successfully ran (if not [see below](#build-fail))
2. Your the file your task is located in is in the tasks folder
3. Your task is decorated with the magniv `@task` ([see here](../documentation/task-decorator))
4. Your task has no import errors in the workspace ([see here](./))


## Why is my task not running on schedule?
Verify that the crontab that you used is correct. Use [this website](https://crontab.guru/) to verify

## Why is my task failing?
The best way to debug this is to check the logs for the run and see what is going on, usually it is a python error. 

Common ones include forgetting to update the requirements.txt file or an incorrect version of python when setting up a workspace.


## Why did my build fail? {#build-fail}

Check the error in the builds history page, that will usually give you information on why the build failed.

Most common reasons are incorrect [file structure](../documentation/file-structure) or using a [key](https://docs.magniv.io/documentation/task-decorator#fields) more than once.
