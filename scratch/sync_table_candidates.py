import requests
import json
import time

API_BASE = "http://localhost:3000"

def clean_experience(exp_str):
    exp_str = exp_str.lower().strip()
    if not exp_str or exp_str == "—" or "intern" in exp_str or "entry" in exp_str:
        return 0
    # Extract digit
    digits = []
    for char in exp_str:
        if char.isdigit() or char == '.':
            digits.append(char)
        elif digits and char not in ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']:
            break
    try:
        return float(''.join(digits)) if digits else 0
    except ValueError:
        return 0

def main():
    table_candidates = [
        {"name": "Abinash Sahu", "phone": "+91-8658241346", "email": "email2abinash@gmail.com", "profile": "Senior Lead Data Analyst & AI / Power BI & Tableau Developer", "experience": "10+ yrs"},
        {"name": "Anil Kumar", "phone": "+91 8971101846", "email": "Anilkumardevops190@gmail.com", "profile": "SRE / Senior DevOps / AWS Engineer", "experience": "7+ yrs"},
        {"name": "Arun Ravindar", "phone": "+91 9047210884", "email": "arunravindar1997@gmail.com", "profile": "Senior Software Developer – Java / Spring Boot", "experience": "5+ yrs"},
        {"name": "Aryadeep Ghosh", "phone": "+91 9903746131", "email": "aryadeep.gh@gmail.com", "profile": "AI Decision Science Analyst / Data Engineering", "experience": "~3 yrs"},
        {"name": "Beeshetti Pavan Sai", "phone": "+91 9052648907", "email": "beeshettipavansai@gmail.com", "profile": "Azure Data Engineer", "experience": "~3.5 yrs"},
        {"name": "Chinmaya Gupta", "phone": "7428665406", "email": "g.chinmaya34@gmail.com", "profile": "Data Engineer", "experience": "3 yrs"},
        {"name": "Dasa Bhavana", "phone": "+91 9704209193", "email": "dasabhavana2001@gmail.com", "profile": "Data Engineer", "experience": "—"},
        {"name": "Jeet Pawar", "phone": "+91 9604443125", "email": "jeet.pawar444@gmail.com", "profile": "DevOps Engineer / GenAI Cloud", "experience": "4.5 yrs"},
        {"name": "Diksha Ravindra Dhait", "phone": "+91 8390913715", "email": "diksha03dhait@gmail.com", "profile": "Software Testing → DevOps Engineer", "experience": "8 yrs testing"},
        {"name": "Gaurav Sanjay Raut", "phone": "+91 8788223239", "email": "rautgaurav0512@gmail.com", "profile": "AWS / DevOps Engineer", "experience": "~2.5+ yrs"},
        {"name": "Gouthami P", "phone": "7411685747", "email": "gautamip1988@gmail.com", "profile": "Azure Data Engineer", "experience": "14 yrs IT / 6+ yrs Azure DE"},
        {"name": "Kalash Tiwari", "phone": "+91 9619717457", "email": "kalasht.work@gmail.com", "profile": "AI/ML / Generative AI Engineer", "experience": "~2.5–3 yrs"},
        {"name": "Kevin Dos Santos", "phone": "(203) 402-9459", "email": "kevindossantos281@gmail.com", "profile": "Software Developer", "experience": "Internship / Entry-level"},
        {"name": "Koushick Sivasankaran", "phone": "+91 9841260416", "email": "Koushick.S@yahoo.com", "profile": "Finance / BI / Analytics", "experience": "20+ yrs"},
        {"name": "Lalit Patidar", "phone": "+91 8224884457", "email": "lalitptdr5799@gmail.com", "profile": "Data Scientist / AI / Data Engineering", "experience": "2+ yrs"},
        {"name": "M. Deepika", "phone": "+91 9063475546", "email": "Deepikamanuka1122@gmail.com", "profile": "Azure Data Engineer", "experience": "6+ yrs"},
        {"name": "Michael Mobley", "phone": "619 438 8801", "email": "mikemobley808@gmail.com", "profile": "Security / Operations", "experience": "~5+ yrs security"},
        {"name": "Pawan Pratap Porwal", "phone": "+91 73008 32345", "email": "rajanporwal@gmail.com", "profile": "Sales / Consulting / Customer Operations", "experience": "10+ yrs"},
        {"name": "Prashant Raghava", "phone": "+1 720-927-4613", "email": "msatya@quantomtech.com", "profile": "AWS Cloud Architect", "experience": "18+ yrs"},
        {"name": "Prem Kumar", "phone": "+91 91006 71882", "email": "premkaanolla@gmail.com", "profile": "DevOps / Web Development", "experience": "~2 yrs"},
        {"name": "Arun Mehra", "phone": "+91 74151 21322", "email": "mehraaruncac@gmail.com", "profile": "Senior Data Engineer / AI-ML", "experience": "9+ yrs"},
        {"name": "Vishnu Sankritya", "phone": "+91 8100113604", "email": "vishnusankritya@gmail.com", "profile": "QA Automation / Performance Testing", "experience": "5+ yrs"},
        {"name": "Rajendra Prasad Pati", "phone": "+91 9040606961", "email": "rajendrapati.0601@gmail.com", "profile": "ETL Developer / Data Engineer", "experience": "11+ yrs"},
        {"name": "Sagar D. Bhut", "phone": "7567715076", "email": "bhutsagar95@gmail.com", "profile": "iOS / Flutter Developer", "experience": "7+ yrs"},
        {"name": "Sahil Kamble", "phone": "+91 84830 43102", "email": "sahilkamble1002@gmail.com", "profile": "DevOps Engineer / AWS", "experience": "~2+ yrs"},
        {"name": "Shihas Backer", "phone": "+91 95028 96729", "email": "9shihas@gmail.com", "profile": "Healthcare Consultant", "experience": "20+ yrs IT / 18+ yrs Healthcare"},
        {"name": "Vikas Kumar", "phone": "+91-9164323111", "email": "vikas.senforth@gmail.com", "profile": "Java/J2EE Technical Expert / DevOps & Cloud / Technical Leadership", "experience": "13+ yrs"},
        {"name": "Yogesh Pal", "phone": "9998475004", "email": "yogeshpal136@gmail.com", "profile": "Automation / QA Engineer", "experience": "3 yrs"},
        {"name": "Pavan Sai (duplicate)", "phone": "+91 9052648907", "email": "beeshettipavansai@gmail.com", "profile": "Azure Data Engineer", "experience": "~3.5 yrs"},
        {"name": "Ranjith Ganapathi", "phone": "+91 9677546392", "email": "ranjithvinay15@gmail.com", "profile": "Data Engineer", "experience": "~8 yrs"},
        {"name": "Vikas Yadav", "phone": "986748102 / 9137361248", "email": "vikaskk108@gmail.com", "profile": "Data Science & AI / Data Engineer / AI Trainee", "experience": "Intern: Dec 2025–Feb 2026; AI Trainee: Mar 2026–Present"}
    ]

    print("Fetching current database state...")
    try:
        res = requests.get(f"{API_BASE}/api/db")
        db_state = res.json()["db"]
    except Exception as e:
        print(f"Error: {e}")
        return

    current_users = db_state.get("users", [])
    current_profiles = db_state.get("candidateProfiles", [])
    current_cvs = db_state.get("cvs", [])

    final_users_dict = {u["id"]: u for u in current_users}
    final_profiles_dict = {p["userId"]: p for p in current_profiles}
    final_cvs_dict = {c["id"]: c for c in current_cvs}

    existing_emails = {u["email"].lower(): u for u in current_users if u.get("role") == "candidate"}

    for idx, cand in enumerate(table_candidates):
        name = cand["name"]
        email = cand["email"]
        phone = cand["phone"]
        profile = cand["profile"]
        exp_str = cand["experience"]
        exp_years = clean_experience(exp_str)
        email_lower = email.lower()

        existing_user = existing_emails.get(email_lower)
        if existing_user:
            user_id = existing_user["id"]
            existing_user["name"] = name
            final_users_dict[user_id] = existing_user

            # Retrieve profile
            p_doc = final_profiles_dict.get(user_id)
            if not p_doc:
                # Find by email
                for p in current_profiles:
                    if p["email"].lower() == email_lower:
                        p_doc = p
                        break
            if not p_doc:
                p_doc = {"id": f"prof_{int(time.time() * 1000) + idx}", "userId": user_id}
            
            p_doc.update({
                "fullName": name,
                "email": email,
                "phone": phone,
                "bio": profile,
                "experienceYears": exp_years,
                "updatedAt": "2026-08-26T00:20:00Z"
            })
            final_profiles_dict[user_id] = p_doc
            print(f"Updated candidate table details for: {name} ({email})")
        else:
            # Create new
            user_id = f"usr_cand_{int(time.time() * 1000) + idx}"
            profile_id = f"prof_{int(time.time() * 1000) + idx}"
            cv_id = f"cv_{int(time.time() * 1000) + idx}"

            user_doc = {
                "id": user_id,
                "name": name,
                "email": email,
                "password": "password123",
                "role": "candidate",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
                "provider": "email",
                "createdAt": "2026-08-26T00:20:00Z"
            }

            cv_doc = {
                "id": cv_id,
                "candidateId": user_id,
                "title": f"{name} Resume",
                "isPrimary": True,
                "rawText": f"Manual table import for {name}. Email: {email}, Phone: {phone}, Profile: {profile}, Experience: {exp_str}.",
                "parsedData": {
                    "fullName": name,
                    "email": email,
                    "phone": phone,
                    "location": "Remote Friendly",
                    "summary": profile,
                    "experienceYears": exp_years,
                    "expectedSalary": "₹8,00,000 / yr",
                    "availability": "Immediate",
                    "skills": [],
                    "experience": [],
                    "education": [],
                    "certifications": []
                },
                "uploadedAt": "2026-08-26T00:20:00Z",
                "updatedAt": "2026-08-26T00:20:00Z"
            }

            profile_doc = {
                "id": profile_id,
                "userId": user_id,
                "fullName": name,
                "email": email,
                "phone": phone,
                "location": "Remote Friendly",
                "bio": profile,
                "avatar": user_doc["avatar"],
                "experienceYears": exp_years,
                "expectedSalary": "₹8,00,000 / yr",
                "availability": "Immediate",
                "openToWork": True,
                "domain": "Engineering",
                "skills": [],
                "experience": [],
                "education": [],
                "certifications": [],
                "primaryCvId": cv_id,
                "profileCompletion": 85,
                "createdAt": "2026-08-26T00:20:00Z",
                "updatedAt": "2026-08-26T00:20:00Z"
            }

            final_users_dict[user_id] = user_doc
            final_profiles_dict[user_id] = profile_doc
            final_cvs_dict[cv_id] = cv_doc
            print(f"Created new candidate from table: {name} ({email})")

    # Sync back to DB
    print("Syncing updated collections back to MongoDB...")
    try:
        r1 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "users", "data": list(final_users_dict.values())})
        r2 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "candidateProfiles", "data": list(final_profiles_dict.values())})
        r3 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "cvs", "data": list(final_cvs_dict.values())})

        if r1.json().get("success") and r2.json().get("success") and r3.json().get("success"):
            print("Successfully synchronized all candidates table details with MongoDB!")
        else:
            print("Failed to sync some collections.")
    except Exception as e:
        print(f"Error syncing back to DB: {e}")

if __name__ == "__main__":
    main()
