---
sidebar_position: 1
slug: /
---

# Getting Started

Let's get rocking with Magniv 🚀

## Installation
Magniv core can be found on [pypi](https://pypi.org/project/magniv/) and installed with pip
```bash
    pip install magniv
```

Once you have everything set up, take a look at the documentation for the [`magniv` library](../documentation) and follow one of [our tutorials](../tutorials).

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
