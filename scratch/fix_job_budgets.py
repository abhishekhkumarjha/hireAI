import requests
import json

API_BASE = "http://localhost:3000"

def main():
    print("Fetching current jobs...")
    try:
        res = requests.get(f"{API_BASE}/api/db")
        db_state = res.json()["db"]
        jobs = db_state.get("jobs", [])
    except Exception as e:
        print(f"Error: {e}")
        return

    # Update budgets to monthly values (LPM)
    budget_mapping = {
        "job_genai_cloud_terraform": (170000, 170000),
        "job_snowflake_data_eng_new": (150000, 150000),
        "job_servicenow_tech_lead": (140000, 150000),
        "job_servicenow_mobile_consultant": (130000, 140000),
        "job_servicenow_sr_dev": (140000, 150000),
        "job_workday_finance_consultant": (160000, 160000),
        "job_salesforce_qa_lead": (140000, 140000)
    }

    updated_jobs = []
    for job in jobs:
        jid = job["id"]
        if jid in budget_mapping:
            min_val, max_val = budget_mapping[jid]
            job["salaryMin"] = min_val
            job["salaryMax"] = max_val
            job["salaryCurrency"] = "INR"
        updated_jobs.append(job)

    print("Syncing updated jobs back to database...")
    try:
        res = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "jobs", "data": updated_jobs})
        if res.json().get("success"):
            print("Successfully updated job budgets to monthly LPM values!")
        else:
            print("Failed to sync jobs collection.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
