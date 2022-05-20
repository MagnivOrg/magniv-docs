# CLI

The Magniv CLI is relevant to debug failing builds and roll out a self-hosted Magniv installation. You can export your Magniv tasks into Airflow DAGs through the CLI.

The CLI has 3 actions:

* [build](./build) — traverses your `/tasks/` folder and builds a representation of all the tasks
* [export](./export) — uses the built representation to export Airflow DAGs 
* [run](./run) — command used by the Airflow DAGs to actually run an individual task

To export tasks into Airflow DAGs you need to run:

```bash
magniv-cli build
magniv-cli export 
```

This will create a `/dags/` folder from your `/tasks/` folder.
