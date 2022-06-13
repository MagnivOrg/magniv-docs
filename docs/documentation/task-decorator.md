---
sidebar_position: 2
---

# Task Decorator

All scheduled tasks are decorated with the `@task()` decorator. This is what tells Magniv to orchestrate the given function.

The class definition can be found [here](https://github.com/MagnivOrg/magniv-core/blob/master/magniv/core/task.py).

## Location

```python
from magniv.core import task
```
 

## Fields

|Attribute Name|Required|Description|
|--------------|--------|-----------|
|schedule (_str_)         |Yes        |The schedule must be formatted as a crontab or one of the following shortcuts: <ol><li>`@once`</li><li>`@hourly`</li><li>`@daily`</li><li>`@weekly`</li><li>`@monthly`</li><li>`@yearly`</li></ol> [See here for the corresponding crontab](https://airflow.apache.org/docs/apache-airflow/1.10.1/scheduler.html#dag-runs).|
|description (_str_)      |No         |A text description of the task, useful for organization and collaboration           |
|key (_str_)              |No -- defaults to the name of the function        |There are two requirements for the key: <ol> <li> The key can only contain alphanumeric characters, dash (-), period (.) , and underscore (_)  </li> <li>The key is unique across the whole workspace</li></ol>|


## Usage example


```python
from magniv.core import task

@task(schedule="@daily", description="Daily hello world!", key="hello world")
def hello_world():
    print("hello world")
```

