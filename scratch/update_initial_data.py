import requests
import json
import re

API_BASE = "http://localhost:3000"

def main():
    print("Fetching current database state from MongoDB...")
    try:
        res = requests.get(f"{API_BASE}/api/db")
        db_state = res.json()["db"]
    except Exception as e:
        print(f"Error fetching DB: {e}")
        return

    users = db_state.get("users", [])
    profiles = db_state.get("candidateProfiles", [])
    cvs = db_state.get("cvs", [])
    jobs = db_state.get("jobs", [])

    # Escape backslashes for safe re.sub usage
    users_ts = json.dumps(users, indent=2).replace('\\', '\\\\')
    profiles_ts = json.dumps(profiles, indent=2).replace('\\', '\\\\')
    cvs_ts = json.dumps(cvs, indent=2).replace('\\', '\\\\')
    jobs_ts = json.dumps(jobs, indent=2).replace('\\', '\\\\')

    initial_data_path = r"c:\Users\Abhishekh Kumar Jha\OneDrive\Desktop\hire_ai\src\data\initialData.ts"
    
    print(f"Reading {initial_data_path}...")
    with open(initial_data_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace INITIAL_USERS
    content = re.sub(
        r"export const INITIAL_USERS: User\[\] = \[.*?\];",
        f"export const INITIAL_USERS: User[] = {users_ts};",
        content,
        flags=re.DOTALL
    )

    # Replace INITIAL_CANDIDATE_PROFILES
    content = re.sub(
        r"export const INITIAL_CANDIDATE_PROFILES: CandidateProfile\[\] = \[.*?\];",
        f"export const INITIAL_CANDIDATE_PROFILES: CandidateProfile[] = {profiles_ts};",
        content,
        flags=re.DOTALL
    )

    # Replace INITIAL_CVS
    content = re.sub(
        r"export const INITIAL_CVS: CVItem\[\] = \[.*?\];",
        f"export const INITIAL_CVS: CVItem[] = {cvs_ts};",
        content,
        flags=re.DOTALL
    )

    # Replace INITIAL_JOBS
    content = re.sub(
        r"export const INITIAL_JOBS: Job\[\] = \[.*?\];",
        f"export const INITIAL_JOBS: Job[] = {jobs_ts};",
        content,
        flags=re.DOTALL
    )

    print(f"Writing updated initialData.ts...")
    with open(initial_data_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Successfully pre-populated initialData.ts with corrected candidates & jobs!")

if __name__ == "__main__":
    main()
