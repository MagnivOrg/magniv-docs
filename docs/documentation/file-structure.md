---
sidebar_position: 1
---

# File Structure

There are two main file structure requirements for Magniv projects:
1. A `tasks/` folder must exist at the root of the project. This is where all tasks will live.
2. At least one `requirements.txt` file must exist in the `tasks/` folder.

Inside the `/tasks/` folder, your project can be structured however you wish. Magniv will recursively search for tasks to orchestrate. In projects with nested subdirectories inside of `/tasks/`, Magniv will match each task with its closest `requirements.txt` (moving up each directory until reaching the `/tasks`).

---

Below are examples of valid file structures:

#### Flat project structure

```bash
tasks
├── requirements.txt
├── fraud_tasks.py
└── recommender_tasks.py
```

#### Subdirectories each with individual `requirements.txt`

```bash
tasks
└──fraud_task_folder
   ├── requirements.txt
   └── fraud_tasks.py 
└──reccomender_task_folder
   ├── requirements.txt
   └── reccomender_tasks.py 
```

#### Subdirectories with mixed `requirements.txt`

```bash
tasks
├── requirements.txt
└──fraud_task_folder
   └── fraud_tasks.py 
└──reccomender_task_folder
   ├── requirements.txt
   └── reccomender_tasks.py 
```



