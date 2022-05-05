---
sidebar_position: 1
---

# magniv-cli build

the build command takes your task folder and creates an internal representation of all your tasks.

It is throw an error if it can't find requirments.txt or if a key for a task is not unique.

You need to run it in the folder containing the `tasks` folder. IE the folder that is the parent to `tasks`.

It will create a `dump.json` which is all the required meta information for `magniv-cli export` 
