import requests

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

    updated_jobs = []
    for job in jobs:
        if job["id"] == "job_genai_cloud_terraform":
            # Update budget to 1.3 LPM (130000 INR)
            job["salaryMin"] = 130000
            job["salaryMax"] = 130000
            print(f"Updating GenAI/Cloud/Terraform Engineer budget to 1.3 LPM...")
        updated_jobs.append(job)

    print("Syncing updated jobs back to database...")
    try:
        res = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "jobs", "data": updated_jobs})
        if res.json().get("success"):
            print("Successfully updated GenAI/Cloud/Terraform Engineer budget to 1.3 LPM!")
        else:
            print("Failed to sync jobs collection.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
