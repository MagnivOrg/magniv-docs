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
|`--gcp-dag-folder <location of DAG folder>`|argument| Argument must be set when `--gcp` is set.| 
