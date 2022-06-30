---
sidebar_position: 1
slug: /
---

# Getting Started

Let's get rocking with Magniv 🚀

Using [Magniv](https://www.magniv.io/) is the easiest way to build and deploy data applications, pipelines, or cron-like jobs. A Python decorator based orchestration library at the core, Magniv allows data scientists and developers to schedule arbitrary functions in one line. Monitoring, CI/CD, and compute management all come out of the box using the Magniv dashboard.

## Installation
Magniv core can be found on [pypi](https://pypi.org/project/magniv/) and installed with pip
```bash
    pip install magniv
```

Once you have everything set up, take a look at the documentation for the [`magniv` library](../documentation) and follow one of [our tutorials](../tutorials).

## Why Magniv?

Today’s data stack was built for yesterday’s software engineers. Data scientists deserve their own tools.

Magniv is for teams struggling to hire that unicorn data scientist with deep infrastructure experience or for teams scrambling to organize complex webs of cron tasks and Airflow DAGs. By offloading data infrastructure to Magniv, data teams can be built from only data scientists.

Data scientists need the ability to create, deploy, and maintain their data applications, without relying on support from software engineers. Responsibility handoffs waste time and inevitably priorities end up lost in the JIRA ether.

### Core Features

- Open source core
- Github-integrated CI/CD
- Task failure email notifications
- Task run logging
- Container native
- Little scaffolding, one line decorator
- Abstract away complex infrastructure
- Job organization and management
- Easy productionization of jobs
- Visibility into deployed jobs
- Workspace collaboration
- Simple Artifact Store *[coming soon]*
- Automatic Data Catologue *[coming soon]*

## Learn about Magniv

Please check out our tutorials and technical documentation using the sidebar.

Below are some recommended pages to check out:
- [The Magniv `@task` decorator](documentation/task-decorator)
- [Creating your first workspace (Tutorial)](tutorials/getting-started)
- [Building a simple Slack Bot with Magniv (Tutorial)](tutorials/slack-bot)
- [General FAQs](faq)

## Running Magniv
Magniv can be used in our fully-managed environment or you can self-host the orchestration servers.

Self-hosted setups work well for teams that need tight control of infrastructure and security. Fully managed setups are perfect for teams that want to move quickly and not worry about how things work in the backend.

||Fully Managed|Self-Hosted|
|-|------|-----------|
|Magniv Core|Yes|Yes|
|Export Tasks to Airflow|Yes|Yes|
|Magniv Dashboard|Yes|No|
|Github CI/CD Integration|Yes|No|
|Teams & Collaboration|Yes|No|
|Managed Infrastructure|Yes|No|

### Fully Managed

To get started with the hosted version of Magniv [create an account](https://dashboard.magniv.io) and connect your GitHub repo. Our [Getting Started Tutorial](tutorials/getting-started) details this process.

### Self-Hosted

For self-hosted installations take a look at our documentation for [exporting tasks to Airflow using Magniv Core](../documentation/cli/export).

## Privacy

User authentication on the hosted Magniv dashboard is set up through your GitHub account. Your source code will remain completely private to you, any users you share it with, and internally for debugging purposes. 

Magniv will never use your repositories for anything other than the workspaces you have created in our dashboard. Feel free to restrict the workspaces that Magniv can read using [this link](https://github.com/apps/magniv-io/installations/new).

All workspace instances live in their own Magniv instance. Users are completely isolated from eachother and user workspaces live in different boxes. Individual tasks are also isolated from eachother in separate containers.