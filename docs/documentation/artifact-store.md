---
sidebar_position: 3
---

# Artifact Store

Magniv offers the ability to spin up a Redis instance on each workspace with one-click.

_In the future, this will be integrated in `magniv-core` so that you can keep track of metadata as well as access the artifact store in a schema-agnostic way._

:::info
Each provisioned Redis instance is 1 GB in size. If you need more please [let us know](mailto:hello@magniv.io?subject=Increase%20Redis%20Size). 
:::
___

## Adding a Redis instance

To add a Redis instance to your workspace, navigate to your config page and click "Add Artifact Store".

![Add Artifact Store](../../static/img/add_artifact_store.png)

The artifact store takes about 15 minutes to set up. Once it is complete, you will recieve an email. Your config page will then be populated with Redis connection strings.

![Artifact Store Config](../../static/img/artifact_store_config.png)

Magniv will automatically add the `REDIS_URL` environment variable. Do not remove this.


## Connecting to Redis from a Magniv task

To connect to the Redis instance:

- [Install `redis`](https://redis.io/docs/getting-started/) 
- [Install `redis-py`](https://redis-py.readthedocs.io/en/stable/) and add it to your `requirements.txt`
- Connect using the [`from_url` option](https://redis-py.readthedocs.io/en/stable/connections.html?highlight=from_url#redis.Redis.from_url) in `redis` as well as the environment variable `REDIS_URL`.

Here is an example code snippet:
```python
from magniv.core import task
import redis
import os

@task(schedule='@daily')
def redis_test():
    r = redis.from_url(os.environ.get("REDIS_URL"))
    r.set("hello", "world")
    print(r.get("hello"))

```

And that is it! Be sure to check out [our tutorials](../tutorials) to see some use cases of an artifact store!
