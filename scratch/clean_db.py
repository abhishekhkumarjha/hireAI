import os
import sys
import json
import time
import requests
import pypdf
import docx2txt

API_BASE = "http://localhost:3000"

def extract_pdf_text(filepath):
    try:
        reader = pypdf.PdfReader(filepath)
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        return text.strip()
    except Exception:
        return ""

def extract_docx_text(filepath):
    try:
        return docx2txt.process(filepath).strip()
    except Exception:
        return ""

def main():
    downloads_dir = r"C:\Users\Abhishekh Kumar Jha\Downloads"
    
    specified_files = [
        os.path.join(downloads_dir, "Diksha_Resume (1).pdf"),
        os.path.join(downloads_dir, "Beeshetti Pavan Sai - Resume.pdf"),
        os.path.join(downloads_dir, "Lalit_Resume.pdf"),
        os.path.join(downloads_dir, "Kevin_Dos_Santos_Modern_Resume.pdf"),
        os.path.join(downloads_dir, "Prashant_Raghava_Cloud_Architect (1).docx"),
        os.path.join(downloads_dir, "Kalash_Tiwari_AI_Resume.pdf"),
        os.path.join(downloads_dir, "Anil kumar  update Resume.docx"),
        os.path.join(downloads_dir, "CV_Chanuka_Welagedara.pdf"),
        os.path.join(downloads_dir, "proposal_for_data_science_genAI_instructor.docx"),
        os.path.join(downloads_dir, "Shihas_Backer_Resume_August_2026_NC.pdf"),
        os.path.join(downloads_dir, "Dasa_Bhavana_AI_QA_Automation_Resume.pdf"),
        os.path.join(downloads_dir, "Resume_QA_Vishnu.pdf")
    ]
    
    subfolders = [
        os.path.join(downloads_dir, "data engineer"),
        os.path.join(downloads_dir, "devops")
    ]
    
    target_files = []
    for f in specified_files:
        if os.path.exists(f):
            target_files.append(f)
    for folder in subfolders:
        if os.path.exists(folder):
            for root, dirs, files in os.walk(folder):
                for file in files:
                    if file.lower().endswith(('.pdf', '.docx')):
                        target_files.append(os.path.join(root, file))
                        
    target_files = list(set(target_files))
    
    # Extract emails from all target files using backend parser (or read from already parsed results if we can, but let's parse them to compile the list of real emails)
    real_emails = set()
    print("Compiling the list of real candidate emails from Downloads files...")
    
    for filepath in target_files:
        filename = os.path.basename(filepath)
        if filename.lower().endswith('.pdf'):
            text = extract_pdf_text(filepath)
        elif filename.lower().endswith('.docx'):
            text = extract_docx_text(filepath)
        else:
            continue
            
        if not text:
            continue
            
        try:
            parse_res = requests.post(f"{API_BASE}/api/parse-cv", json={"cvText": text})
            parse_data = parse_res.json()
            if parse_data.get("success"):
                email = parse_data["data"].get("email")
                if email:
                    real_emails.add(email.lower())
        except Exception as e:
            print(f"Error parsing {filename}: {e}")
            
    # Include default email if parser failed for any specific candidate but we know it's a real file
    # Adding known real emails from previous logs as fallback:
    known_emails = {
        "msatya@quantomtech.com", "rajendrapati.0601@gmail.com", "ranjithvinay15@gmail.com",
        "gautamip1988@gmail.com", "pekalasht.work@gmail.com", "deepikamanuka1122@gmail.com",
        "dasabhavana2001@gmail.com", "9shihas@gmail.com", "anilkumardevops190@gmail.com",
        "mehraaruncac@gmail.com", "bhutsagar95@gmail.com", "diksha03dhait@gmail.com",
        "sahilkamble1002@gmail.com", "yogeshpal136@gmail.com", "koushick.s@yahoo.com",
        "g.chinmaya34@gmail.com", "beeshettipavansai@gmail.com", "vishnusankritya@gmail.com",
        "kevindossantos281@gmail.com", "rautgaurav0512@gmail.com", "pelalitptdr5799@gmail.com",
        "chanukawelagedara@gmail.com", "mikemobley808@gmail.com", "rahul.sharma98@gmail.com"
    }
    real_emails.update(known_emails)
    
    print(f"Total real candidate emails compiled: {len(real_emails)}")
    
    # Fetch current DB
    print("Fetching current database state...")
    try:
        res = requests.get(f"{API_BASE}/api/db")
        db_state = res.json()["db"]
    except Exception as e:
        print(f"Error: {e}")
        return
        
    users = db_state.get("users", [])
    profiles = db_state.get("candidateProfiles", [])
    cvs = db_state.get("cvs", [])
    
    # Filter users: keep non-candidates (admins/recruiters) or candidates who have real emails
    kept_users = []
    kept_user_ids = set()
    
    for u in users:
        role = u.get("role")
        email = u.get("email", "").lower()
        if role in ["super_admin", "admin", "recruiter"] or email in real_emails:
            kept_users.append(u)
            kept_user_ids.add(u["id"])
            
    # Filter profiles and CVs to match kept user IDs
    kept_profiles = [p for p in profiles if p.get("userId") in kept_user_ids]
    kept_cvs = [c for c in cvs if c.get("candidateId") in kept_user_ids]
    
    print(f"Original db size -> users: {len(users)}, profiles: {len(profiles)}, cvs: {len(cvs)}")
    print(f"Cleaned db size -> users: {len(kept_users)}, profiles: {len(kept_profiles)}, cvs: {len(kept_cvs)}")
    
    # Sync back to DB
    print("Updating database with real-only candidate profiles...")
    try:
        r1 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "users", "data": kept_users})
        r2 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "candidateProfiles", "data": kept_profiles})
        r3 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "cvs", "data": kept_cvs})
        
        # Also clean up applications that are not associated with our kept users
        applications = db_state.get("applications", [])
        kept_applications = [a for a in applications if a.get("candidateId") in kept_user_ids]
        requests.post(f"{API_BASE}/api/db/sync", json={"collection": "applications", "data": kept_applications})
        
        if r1.json().get("success") and r2.json().get("success") and r3.json().get("success"):
            print("Successfully updated database and removed dummy profiles!")
        else:
            print("Failed to sync some collections.")
    except Exception as e:
        print(f"Error syncing back to DB: {e}")

if __name__ == "__main__":
    main()
