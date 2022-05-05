# CLI


The CLI should only be relevant if you are trying to export your own code to Airflow or create your own hosted self-hosted version of magniv.


There are 3 parts to the cli:

* [build](./build) — traverses your task folder and builds a representation of all the tasks
* [export](./export) — uses the built representation to export into Airflow Dags 
* [run](./run) — command used by the Airflow dags to actually run a task


In order to export into airflow you need to run:

```bash
magniv-cli build
magniv-cli export 
```

This will create a dags folder from your tasks folder.
