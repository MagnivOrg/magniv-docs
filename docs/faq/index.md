import TOCInline from '@theme/TOCInline';

# FAQs

Don't see your question here? Email us at [hello@magniv.io](mailto:hello@magniv.app) 👋

<TOCInline toc={toc} />

## Where is my task?
If your task does not appear in the Magniv Dashboard, verify the following:

1. Your last build in the builds table has successfully ran (if not [see below](#build-fail))
2. The code for your task is located inside the `/tasks` folder. ([see more](../documentation/file-structure))
3. Your task is decorated with `@task` from `magniv.core` ([see here](../documentation/task-decorator))
4. Your task has no import errors in the workspace


## Why is my task not running on schedule?
Verify that the crontab that you used is correct. Use [this website](https://crontab.guru/) to verify

## Why is my task failing?
The best way to debug an individual task is to check the logs for its runs. Usually a Python runtime or import error will cause failures.

Common causes for task failures:
- Python runtime error (check the code for bugs)
- Python import error (forgot to import something)
- A Python library was never added to `requirements.txt`
- The version of Python used locally is different than your workspace version.

If your build run logs are empty, check to make sure you have `magniv` in your `requirements.txt`.

## Why did my build fail? {#build-fail}

Check the error in the Build History page, that will usually provide information to help triage the failure.

Common reasons for build failures are incorrect [file structure](../documentation/file-structure), forgetting a `requirements.txt` file, or using a task [name](https://docs.magniv.io/documentation/task-decorator#fields) more than once.

## How do I create a `requirements.txt`? 

In order for Magniv to work you must have a comprehensive `requirements.txt` that includes all Python libraries and versions that your project uses. If forget to include a `requirements.txt` your build will fail; if you missed or added the wrong libraries your task will fail. 

We highly reccomend using a [virtual environment](https://docs.python.org/3/library/venv.html). To create a `requirements.txt` when using a venv, run the following command in your tasks folder:
```bash 
    pip freeze > requirements.txt
```

If you are using conda to manage your virtual environment you need to run a slighly different command to create a `requirements.txt`: 
```bash
    pip list --format=freeze > requirements.txt
```
 
