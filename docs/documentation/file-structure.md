---
sidebar_position: 1
---

# File Structure

There are two requirements when it comes to file structure for any magniv project:
1. There needs to be a root tasks folder where all the magniv tasks live
2. There needs to be a requirements.txt in the root or parent of where the magniv task lives

You can have multiple subfolder within a tasks folder and each of those folders can have a different requirements.txt file.
If no requirements.txt file is defined in a subfolder, the nearest parent requirements.txt file will be used.



Here are examples of valid file structures

```bash
tasks
├── requirements.txt
├── fraud_tasks.py
└── recommender_tasks.py
```


```bash
tasks
└──fraud_task_folder
   ├── requirements.txt
   └── fraud_tasks.py 
└──reccomender_task_folder
   ├── requirements.txt
   └── reccomender_tasks.py 
```


or 

```bash
tasks
├── requirements.txt
└──fraud_task_folder
   └── fraud_tasks.py 
└──reccomender_task_folder
   ├── requirements.txt
   └── reccomender_tasks.py 
```



