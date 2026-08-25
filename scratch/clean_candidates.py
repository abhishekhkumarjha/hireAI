import requests

API_BASE = "http://localhost:3000"

def main():
    print("Fetching current database state...")
    try:
        res = requests.get(f"{API_BASE}/api/db")
        db_state = res.json()["db"]
    except Exception as e:
        print(f"Error: {e}")
        return

    users = db_state.get("users", [])
    
    # Keep only recruiters, admins, and super_admins
    kept_users = [u for u in users if u.get("role") in ["super_admin", "admin", "recruiter"]]
    
    print(f"Original users count: {len(users)}, kept: {len(kept_users)}")

    # Sync back clean candidate-free collections
    try:
        r1 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "users", "data": kept_users})
        r2 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "candidateProfiles", "data": []})
        r3 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "cvs", "data": []})
        r4 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "applications", "data": []})
        r5 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "interviews", "data": []})
        r6 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "offerLetters", "data": []})
        
        if all(r.json().get("success") for r in [r1, r2, r3, r4, r5, r6]):
            print("Successfully cleared all candidates and associated data from database!")
        else:
            print("Failed to sync some collections.")
    except Exception as e:
        print(f"Error syncing back to DB: {e}")

if __name__ == "__main__":
    main()
