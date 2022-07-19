---
sidebar_position: 4
title: 'GitHub Scraper'
description: Scraping GitHub Stargazers for Influencers using Magniv
keywords: [github stargazers, magniv, get github emails tutorial, data science, magniv tutorial, github profiles email]
---

# Scraping GitHub Stargazers for Influencers using Magniv

_To view this project live on Magniv click [here](https://dashboard.magniv.io/w/example-web-scraper/tasks)._

In this tutorial, we will create a Magniv data application that retrieves the full GitHub profile of all stargazers on a given GitHub repository (despite API rate limits).

## Motivation

We would like to find the top influencers who starred a given GitHub repo. To do this, we need to find the GitHub profile of every user who starred a repo and then retrieve their current follower count. This should regularly update and notify us when the top 10 influencers for a repo has changed.

Scraping data can be a painful process. The amount of data that needs to be scraped makes this type of task almost impossible to run locally. Beyond that, scrapers can fail because many APIs are rate limited and and contain changing data.
 
A robust webscraper needs good error handling, easy scheduling and fast iterability. Magniv offers all of this as part of its platform.

<div style={{position:"relative", paddingBottom:"62.5%", height:"0", marginBottom:"15px"}}><iframe src="https://www.loom.com/embed/002d77f02e294644aa680eec5d249e09" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style={{position:"absolute", top:"0", left:"0", width:"100%", height:"100%"}}></iframe></div>

## Overview

This tutorial illustrates how Magniv allows you to:
1. Work with an API that has a rate limit
2. Create a modular data application
3. Implement a light-weight artifact store between Magniv tasks using Redis

:::tip

The code for this tutorial can be [found here](https://github.com/MagnivOrg/scraper-example).

:::

## Stargazers

Stargazers is the name GitHub gives to users who have starred a repo:
![Stargazers screenshot](../../static/img/stargazers.png)

[The GitHub API](https://docs.github.com/en/rest) allows you to retrieve a list of stargazers on a repo. You can then further use the GitHub API to get the full profile information of each user. This information can be used to calculate interesting metrics about repositories, as well as being used to create lists of GitHub users who have certain interests.

Given the sheer amount of stargazers for some repos and [GitHub's rate limits](https://docs.github.com/en/developers/apps/building-github-apps/rate-limits-for-github-apps), it is unrealistic to constantly re-run this on a local machine. Scheduling these jobs on the cloud with a platform like Magniv will greatly help.

## Requirements

Before starting this tutorial, make sure to:
- Create a [Github OAuth app](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
- Key-Value artifact store (we spun up a Redis server in Magniv's "Config" panel)

## Task Architecture 

This scraper will consist of three different Magniv tasks:
1. Retrieve and update the list of stargazers from a repo (`update_stargazers_for_repo`)
2. Fetch follower counts for each stargazer (`update_followers`)
3. Calculate (and re-calculate) top 10 influencers and send a Slack notification with the results (`calculate_influencers`)

We will be using Redis as an artifact store to pass data between tasks.

## Task 1: Retrieving stargazers list for a repo {#task1}

We will store the name of the GitHub repo we want to use in `tasks/repo.txt`. Every week, we will run this task to refresh our stargazers list for our repo. For this example, we will use ["kaggle/kaggle-api"](https://github.com/Kaggle/kaggle-api) to find the Kaggle superstars.

The list of stargazers is then added to our artifact store under the key `stargazers`.

```python title="build_stargazers_list.py"
from magniv.core import task
from utils.github_utils import _get_github_stargazers
import utils.redis_utils as store
from datetime import datetime
import os

@task(schedule="@weekly", description="Build/Update list of stargazers from repo")
def update_stargazers_for_repo():
    repo = None
    with open('tasks/repo.txt', 'r') as repos_file:
        repo = repos_file.read().strip()
    print("Repo to process:", repo)

    feteched_stars = _get_github_stargazers(
            repo, 
            os.environ.get("GITHUB_CLIENT_ID"), 
            os.environ.get("GITHUB_CLIENT_SECRET"))
    print(f'Found {len(feteched_stars)} stargazers')

    # Get stargazers from store
    r = store.Client()
    stargazers = r.get('stargazers') or []
    original_len = len(stargazers)
    users_processed = {u["login"] for u in stargazers}

    for user in feteched_stars:
        if user["login"] in users_processed:
            continue

        user_data = {
            "login": user["login"],
            "html_url": user["html_url"],
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        stargazers.append(user_data)
        users_processed.add(user["login"])  
    
    # Update stargazers in store
    print(f'Adding {len(stargazers) - original_len} stargazers')
    r.set('stargazers', stargazers)

```

## Task 2: Fetch follower counts for each stargazer {#task2}

This next task uses the stargazer list from [Task 1](#task1), which are stored in the artifact store as `stargazers`. The task will retrieve the amount of followers a user has by querying the GitHub API. We will then update the user entry in `stargazers` to include a `follower_count` and an updated `last_updated`.

With this task, we must consider GitHub's rate limit of 5000 requests per hour in combination with our desire to keep the follower counts as updated as possible. For this reason we can:
1. Schedule this task to run every 3 hours. If we get rate limited just do a partial update.
2. Update users in the order of `last_updated`. That is, update the most stale users first just incase we get rate limited halfway through.

```python title="update_followers.py"
from magniv.core import task
from datetime import datetime
from utils.github_utils import _get_follower_count
import utils.redis_utils as store
import os

@task(schedule="0 */3 * * *", description="Update follower count for each stargazer")
def update_followers():
    # Get stargazers from store
    r = store.Client()
    stargazers = r.get('stargazers')

    # Sort based on last_updated, oldest
    stargazers = sorted(stargazers, key=lambda x: datetime.strptime(x["last_updated"], '%Y-%m-%d %H:%M:%S'))

    updated_count = 0
    for idx, user in enumerate(stargazers):
        print(f'Updating user ID {idx}')
        follower_count = _get_follower_count(
            user["login"], 
            os.environ.get("GITHUB_CLIENT_ID"), 
            os.environ.get("GITHUB_CLIENT_SECRET"))

        if follower_count is not None:
            print(f'  User {idx} has {follower_count} followers')
            stargazers[idx]["follower_count"] = int(follower_count)
            stargazers[idx]["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            updated_count += 1
        else:
            # Probably hit rate limit
            print(f'Hit rate limit on user {idx}!')
            break

    # Save stargazers in store
    r.set('stargazers', stargazers)
    print(f'Updated {updated_count} users in store')
```

## Task 3: Calculate the top influencers

The third Magniv task calculates the top 10 influencers and sends the list in a Slack message. We should only send a slack message when this list changes, so let's store the previous value in our artifact store with the key `top_10`.

```python title="calculate_influencers.py"
from magniv.core import task
from datetime import datetime
import utils.redis_utils as store
import requests
import os

@task(schedule="@daily", description="Calculate top 10 influencers")
def calculate_influencers():
    # Get stargazers from store
    r = store.Client()
    stargazers = r.get('stargazers')

    # Only calculate influencers when >=75% users have been queried
    processed_user_count = sum(1.0 for u in stargazers if u.get("follower_count"))
    if processed_user_count / len(stargazers) < .75:
        print(f'Only processed: {processed_user_count / len(stargazers) // .01 / 100}%')
        return

    # Sort based on follower_count
    stargazers = sorted(stargazers, key=lambda x: x.get("follower_count", -1))[::-1]
    top_ten = stargazers[:10]

    # Get previous top 10 influencers
    yesterday_top_ten = r.get('top_ten') or []

    top_ten_formatted = "\n".join([f'#{idx+1}: {u["login"]} ({u.get("follower_count", -1)}) - {u["html_url"]}' for idx,u in enumerate(top_ten)])

    # Only notify if the top 10 has changed
    if not yesterday_top_ten or any(y["login"] != top_ten[idx]["login"] for idx, y in enumerate(yesterday_top_ten)):
        print("New top 10!")
        # Update store with new top 10
        r.set('top_ten', top_ten)

        req = requests.post(os.environ.get("SLACK_WEBHOOK_URL"), json={"text": "New top 10 influencers!\n\n" + top_ten_formatted})
        # Send slack notification
    else:
        print("No change in top 10")
    print("===")
    print(top_ten_formatted)
```

## Setting up environment variables

Once you have all your tasks and `requirements.txt` ready, push it to your Magniv workspace 🚀!

Check out [Your First Workspace](./getting-started) if you need help figuring out how to do that.

Finally, we must set up our environment variables. 

Luckily, that is pretty easy to do on Magniv! Just navigate to the "Config" page of your workspace and scroll to the bottom. There you will be able to add all your environment variables.

![Env variables](../../static/img/envvars.png)

Be sure to hit Save Changes 😊

Once you do that you are all done! 🎆
## Recap

**🎉 Congratulations! In this Github Scraper tutorial, you:**
1. Learned how Magniv can help you scrape data using a rate limited API.
2. Built a modular Magniv data application that scrapes data reliably and has good visibility. 
3. Deployed three tasks on Magniv using Redis as an artifact store to pass and strore data.

## What's next?


Imagine all the projects you can build now that Magniv deals with the infrastructure headaches. Enjoy your amazing data application and enjoy how quickly you built it.

Feel free to fork [this repo](https://github.com/MagnivOrg/scraper-example) and adjust it to your needs.
