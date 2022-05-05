---
sidebar_position: 3
---

# magniv-cli export

The export command is responsible for taking the `dump.json` and moving it into compatible airflow dags. 

In the future it can be customized to export to any other job orchestration service.


There are some arguments that can be currently passed into the command:


|Parameter|Type|Description|
|---------|----|-----------|
|`--gcp`    |option| A flag that needs to be set if you want to export to Google Cloud Composer compatible Airflow Dags|
|`--gcp-project-id <PROJECT ID>` | argument | Argument that needs to be set if `--gcp` is set |
|`--gcp-dag-folder <location of DAG folder>`|argument| Argument that needs to be set if `--gcp` is set| 
