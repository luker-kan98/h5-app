import os

broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
result_backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
task_serializer = "json"
result_serializer = "json"
accept_content = ["json"]
task_soft_time_limit = 1800   # 30 min
task_time_limit = 2700         # 45 min
worker_concurrency = 2
