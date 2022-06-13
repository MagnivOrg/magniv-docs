---
sidebar_position: 3
---

# magniv-cli export

The export command is responsible for processing the `dump.json` output of [the build step](./build). Export builds Airflow DAGs from your Magniv tasks.

In the future, the export command will support other orchestration frameworks in addition to just Airflow. Please [contact us](mailto:hello@magniv.io) if you are in need of this. Magniv currently supports exporting to standard Airflow DAGs as well as Google Cloud Composer compatible DAGs.

Optional arguments:

|Parameter|Type|Description|
|---------|----|-----------|
|`--gcp`    | flag | Set this flag to export Google Cloud Composer compatible Airflow DAGs.|
|`--gcp-project-id <PROJECT ID>` | argument | Argument must be set when `--gcp` is set. |
|`--gcp-dag-folder <location of DAG folder>`|argument| Argument must be set when `--gcp` is set. This will be a URL beginning with `gs://` from GCP. | 
|`--callback-hook <url to callback after a task runs>`|argument| Callback to be called when a task is either successful or has failed [see callback](#callback) to learn what information gets sent| 
|`--kubernetes-startup-timeout <seconds>`|argument| Defaults to 120 seconds, this is passed in as the `startup_timeout_seconds` in the `kubernetesPodOperator` in Airflow| 
|`--env-file-path <filepath to env file>`|argument| Location of file with environment variables to be passed into tasks should be in the format of `KEY=VALUE`|


## Task Callbacks {#callaback} 

If you optionally provide a `callback-hook` when using `magniv-cli export` a `POST` will be sent to the provided url with the following values in `JSON` 

|Key|Value|
|---|-----|
|`callback_type`| Either `success` or `failure`|
|`task_id`|The task id in airflow|
|`run_id`| The run id of the run that just completed|
|`id`| The key of the magniv task that just ran| 
