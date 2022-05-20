---
sidebar_position: 1
---

# magniv-cli build

The build command traverses through your `/tasks/` folder and creates an internal representation of all your tasks. This is the intermediary Magniv build step. Use this to debug failing builds locally.

Errors thrown:
- `requirements.txt` not found
- Tasks have repeated keys. All tasks must have a unique key.

`magniv-cli build` must be run in the root directory of your project. That is, the directory that holds the `tasks/` folder.

This command will output all required metadata for the [export](./export) into `dump.json`. 