---
sidebar_position: 5
title: 'GitHub Scraper'
description: How to get GitHub Stargazers using Magniv
keywords: [github stargazers, magniv, get github emails tutorial, data science, magniv tutorial, github profiles email]
---

# Scraping GitHub Stargazers using Magniv

In this tutorial, we will create a Magniv data application that retrieves the full GitHub profile of all stargazers on a given GitHub repository (despite API rate limits).

## Motivation

Scraping data can be a painful process. The amount of data that needs to be scraped makes it almost impossible to run locally. Beyond that, scrapers can fail because they are rate limited and the data being scraped is changing.
 
A robust webscraper needs good error handling, easy scheduling and fast iterability. Magniv offers all of this as part of its platform.

<div style={{position:"relative", paddingBottom:"62.5%", height:"0", marginBottom:"15px"}}><iframe src="https://www.loom.com/embed/002d77f02e294644aa680eec5d249e09" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style={{position:"absolute", top:"0", left:"0", width:"100%", height:"100%"}}></iframe></div>

## Overview

This tutorial illustrates how Magniv allows you to:
1. Work with an API that has a rate limit
2. Create a modular data application
3. Implement a light-weight artifact store between Magniv tasks using Redis

:::tip

The code for this tutorial can be [found here](https://github.com/MagnivOrg/magniv-github).

:::

## Stargazers

Stargazers is the name GitHub gives to users who have starred a repo:
![Stargazers screenshot](../../static/img/stargazers.png)

[The GitHub API](https://docs.github.com/en/rest) allows you to retrieve a list of stargazers on a repo. You can then further use the GitHub API to get the full profile information of each user. This information can be used to calculate interesting metrics about repositories, as well as being used to create lists of GitHub users who have certain interests.

Given the sheer amount of stargazers for some repos and [GitHub's rate limits](https://docs.github.com/en/developers/apps/building-github-apps/rate-limits-for-github-apps), it is unrealistic to constantly re-run this on a local machine. Scheduling these jobs on the cloud with a platform like Magniv will greatly help.

## Requirements

Before starting this tutorial, make sure to:
- Create a [Github OAuth app](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
- Create a Redis instance you can connect to ([Render](https://render.com/) and [Render](https://railway.app/) are both good choices for this)
- Create a Postgres database you can connect to (Railway and Render are good choices here as well)

## Task Architecture 

This scraper will consist of three different Magniv tasks:
1. Retrieve a list of stargazers from a repo
2. Fetch full profile information for each stargazer user
3. Clean fetched user profiles and save into a Postgres database

We will be using [Redis sets](https://redis.io/docs/manual/data-types/#sets) to pass data between the three tasks. This will serve as an artifact store.

## Task 1: Retrieving stargazers for a repo {#task1}

We must now read from a Redis set containing name of the repos that have yet to be scraped. For this tutorial, we will manually add a list of repos to this set. This could easily be extended through an endpoint to allow anyone to add repos to the Redis set.

This task should be scheduled to run daily. On each run, a repo is popped from the Redis set `github_repos`, the GitHub API is called to retrieve the list of stargazers for the repo, and the stargazers are pushed to another Redis set `github_list`.
```python
@task(
    schedule="@daily",
    description="Get new repos from prepare list and add them to the github list",
)
def prepare():
    r = redis.from_url(os.environ.get("REDIS_URL"))
    next_repo = r.spop("github_repos")
    while next_repo:
        next_repo = next_repo.decode()
        users = []
        _get_star_gazers(
            next_repo,
            os.environ.get("GITHUB_CLIENT_ID"),
            os.environ.get("GITHUB_CLIENT_SECRET"),
            user_profiles=users,
        )
        f = "ghost_list/1_{}_.json".format(next_repo.replace("/", "_"))
        for user in users:
            user_info = {"github_info": user, "file": f}
            r.sadd("github_list", json.dumps(user_info))
        next_repo = r.spop("github_repos")

def _get_star_gazers(repo, client_id, client_secret, page=1, user_profiles=[]):
    url = "https://api.github.com/repos/{}/stargazers?per_page=100&page={}".format(
        repo, page
    )
    resp = requests.get(url, auth=(client_id, client_secret))
    if resp.status_code == 200:
        response = resp.json()
        user_profiles.extend(response)
        print(len(user_profiles))
        if len(response) < 100:
            # we are done
            print("we are done")
            return user_profiles
        else:
            print("we are going to the next page ", page)
            time.sleep(1)
            _get_star_gazers(
                repo,
                client_id,
                client_secret,
                page=page + 1,
                user_profiles=user_profiles,
            )
    else:
        print("failed --- page: ", page, " repo ", repo)
        # save
        return user_profiles

```

## Task 2: Collecting profile information {#task2}

This next task uses the profiles from [Task 1](#task1), which are stored in the Redis set `github_list`, and retrieves the full user profile information by querying the GitHub API. The GitHub response is then added to the Redis set `finished_profiles`. 

The difficulty with this task is that GitHub rate limits your credentials to 5000 requests per hour. To work around this, we schedule the task to run every two hours and continue popping new users from the Redis set until getting rate limited. 


```python
@task(
    schedule="0 */2 * * *",
    description="Get emails from the github_list on Redis and then add them to finished_profiles",
)
def get_email():
    r = redis.from_url(os.environ.get("REDIS_URL"))
    # first step is SPOP
    print("starting task ...")
    email_count = 0
    i = 0
    while True:
        i += 1
        profile = r.spop("github_list")
        if profile is not None:
            profile = profile.decode()
        else:
            break
        profile = json.loads(profile)
        resp = requests.get(
            profile["github_info"]["url"],
            auth=(
                os.environ("GITHUB_CLIENT_ID"),
                os.environ.get("GITHUB_CLIENT_SECRET"),
            ),
        )
        if resp.status_code == 200:
            response = resp.json()
            profile["github_user_profile"] = response
            r.sadd("finished_profiles", json.dumps(profile))
            if response["email"] is not None:
                email_count += 1
            time.sleep(0.3)
        elif resp.status_code == 404:
            pass
        else:
            r.sadd("github_list", json.dumps(profile))
            print("failed --- i ", i, email_count)
            print(resp.status_code)
            print(resp.json())
            # save
            break
```

## Task 3: Saving to Postgres

The third Magniv task cleans up the profiles from the `finished_profiles` Redis set and saves them to a Postgres database.

```python
@task(
    schedule="@daily",
    description="Task to clean up the finished_profiles redis set and move things into a DB",
)
def clean_redis_set():
    engine = create_engine(os.environ.get("DB_CONNECTION_STRING"))
    connection = engine.connect()
    r = redis.from_url(os.environ.get("REDIS_URL"))
    profile = r.spop("finished_profiles")
    while profile:
        profile = json.loads(profile.decode())
        # move this into the SQL DB
        try:
            _create_new_lead(
                connection,
                source_file=profile["file"],
                source_repo=_get_repo(profile["file"]),
                gh_login=profile["github_user_profile"]["login"],
                gh_id=profile["github_user_profile"]["id"],
                gh_name=profile["github_user_profile"]["name"],
                gh_email=profile["github_user_profile"]["email"],
                gh_twitter=profile["github_user_profile"]["twitter_username"],
                gh_public_repos=profile["github_user_profile"]["public_repos"],
                gh_followers=profile["github_user_profile"]["followers"],
                gh_created_at=profile["github_user_profile"]["created_at"],
                gh_updated_at=profile["github_user_profile"]["updated_at"],
                raw=json.dumps(profile),
            )
        except:
            print("failed on ", profile)
            r.sadd("finished_profiles_error", json.dumps(profile))
        profile = r.spop("finished_profiles")
    connection.close()


def _create_new_lead(
    connection,
    source_file=None,
    source_repo=None,
    gh_login=None,
    gh_id=None,
    gh_name=None,
    gh_email=None,
    gh_twitter=None,
    gh_public_repos=None,
    gh_followers=None,
    gh_created_at=None,
    gh_updated_at=None,
    raw=None,
):
    connection.execute(
        "insert into github_leads (source_file, source_repo, gh_login, gh_id, gh_name, gh_email, gh_twitter, gh_public_repos, gh_followers, gh_created_at, gh_updated_at, raw) values ('{}', '{}', '{}', '{}', '{}', '{}', '{}', {}, {}, '{}', '{}', '{}')".format(
            source_file,
            source_repo,
            gh_login,
            gh_id,
            gh_name,
            gh_email,
            gh_twitter,
            gh_public_repos,
            gh_followers,
            gh_created_at,
            gh_updated_at,
            raw,
        )
    )

def _get_repo(file_name):
    main_name = "_".join(file_name.split("/")[1].split("_")[1:])
    github_repo_name = "{}/{}".format(main_name.split("_")[0], main_name.split("_")[1])
    return github_repo_name
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
3. Deployed three tasks on Magniv using Redis as an artifact store to pass data around and Postgres to store cleaned data.

## What's next?


Imagine all the projects you can build now that Magniv deals with the infrastructure headaches. Enjoy your amazing data application and enjoy how quickly you built it.

Feel free to fork [this repo](https://github.com/MagnivOrg/magniv-github) and adjust it to your needs.
