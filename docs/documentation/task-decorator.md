---
sidebar_position: 2
---

# Task Decorator

All scheduled tasks are decorated with the `@task()` decorator. 
The class definition can be found [here](https://github.com/MagnivOrg/magniv/blob/master/magniv/core/task.py)
 

## Fields

|Attribute Name|Required|Description|
|--------------|--------|-----------|
|schedule         |Yes        |The schedule either needs to be in the form of a crontab or one of the presets in [this table](https://airflow.apache.org/docs/apache-airflow/1.10.1/scheduler.html#dag-runs) excluding `None`           |
|description      |No         |A string description of the task, useful for organization and collaboration           |
|key              |No -- defaults to the name of the function        |There are two requirements for the key: <ol> <li> The key can only contain alphanumeric characters, -, _, . and space. </li> <li>The key is unique across the whole workspace</li></ol>|


## Usage example


```python
from magniv.core import task

@task(schedule="@daily", description="Daily hello world!", key="hello world")
def hello_world():
    print("hello world")
```

