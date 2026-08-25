import os
import sys
import subprocess
import json
import time

def install_deps():
    try:
        import pypdf
        import docx2txt
        import requests
    except ImportError:
        print("Installing dependencies (pypdf, docx2txt, requests)...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf", "docx2txt", "requests"])

# Run dependency installation
install_deps()

import pypdf
import docx2txt
import requests

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
    except Exception as e:
        print(f"Error extracting PDF {filepath}: {e}")
        return ""

def extract_docx_text(filepath):
    try:
        return docx2txt.process(filepath).strip()
    except Exception as e:
        print(f"Error extracting DOCX {filepath}: {e}")
        return ""

def main():
    downloads_dir = r"C:\Users\Abhishekh Kumar Jha\Downloads"
    
    # 1. Compile target file paths
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
    # Add specified files if they exist
    for f in specified_files:
        if os.path.exists(f):
            target_files.append(f)
        else:
            print(f"Warning: Specified file does not exist: {f}")
            
    # Add files from subfolders
    for folder in subfolders:
        if os.path.exists(folder):
            for root, dirs, files in os.walk(folder):
                for file in files:
                    if file.lower().endswith(('.pdf', '.docx')):
                        target_files.append(os.path.join(root, file))
                        
    # Filter duplicate paths
    target_files = list(set(target_files))
    print(f"Found {len(target_files)} unique resumes to process.")
    
    # 2. Fetch current DB
    print("Fetching current database state...")
    try:
        res = requests.get(f"{API_BASE}/api/db")
        db_state = res.json()["db"]
    except Exception as e:
        print(f"Error fetching DB: {e}")
        return
        
    current_users = db_state.get("users", [])
    current_profiles = db_state.get("candidateProfiles", [])
    current_cvs = db_state.get("cvs", [])
    
    existing_emails = {u["email"].lower() for u in current_users}
    
    # Keep track of additions
    new_users = []
    new_profiles = []
    new_cvs = []
    
    # 3. Process each resume
    for idx, filepath in enumerate(target_files):
        filename = os.path.basename(filepath)
        print(f"[{idx+1}/{len(target_files)}] Processing: {filename}")
        
        # Extract text
        if filename.lower().endswith('.pdf'):
            text = extract_pdf_text(filepath)
        elif filename.lower().endswith('.docx'):
            text = extract_docx_text(filepath)
        else:
            continue
            
        if not text:
            print(f"Skip {filename}: No text content extracted.")
            continue
            
        # Parse using express AI api
        try:
            parse_res = requests.post(f"{API_BASE}/api/parse-cv", json={"cvText": text})
            parse_data = parse_res.json()
            if not parse_data.get("success"):
                print(f"Failed to parse resume via Gemini: {parse_data.get('error')}")
                continue
            parsed_profile = parse_data["data"]
        except Exception as e:
            print(f"Network error parsing resume: {e}")
            continue
            
        # Create record
        name = parsed_profile.get("fullName") or os.path.splitext(filename)[0].replace("_", " ").title()
        email = parsed_profile.get("email") or f"candidate_{int(time.time() * 1000)}@cloudinntech.co.in"
        
        # Check duplicate emails in existing DB or current batch
        email_lower = email.lower()
        if email_lower in existing_emails:
            print(f"User with email {email} already exists. Skipping insertion to avoid duplicates.")
            continue
        existing_emails.add(email_lower)
        
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
            "createdAt": "2026-08-25T23:26:00Z"
        }
        
        cv_doc = {
            "id": cv_id,
            "candidateId": user_id,
            "title": f"{name} Resume",
            "isPrimary": True,
            "rawText": text,
            "parsedData": parsed_profile,
            "uploadedAt": "2026-08-25T23:26:00Z",
            "updatedAt": "2026-08-25T23:26:00Z"
        }
        
        profile_doc = {
            "id": profile_id,
            "userId": user_id,
            "fullName": name,
            "email": email,
            "phone": parsed_profile.get("phone") or "",
            "location": parsed_profile.get("location") or "Remote Friendly",
            "bio": parsed_profile.get("summary") or "Candidate profile",
            "avatar": user_doc["avatar"],
            "experienceYears": parsed_profile.get("experienceYears") or 0,
            "expectedSalary": parsed_profile.get("expectedSalary") or "₹8,00,000 / yr",
            "availability": parsed_profile.get("availability") or "Immediate",
            "openToWork": True,
            "domain": "Engineering",
            "skills": parsed_profile.get("skills") or [],
            "experience": parsed_profile.get("experience") or [],
            "education": parsed_profile.get("education") or [],
            "certifications": parsed_profile.get("certifications") or [],
            "primaryCvId": cv_id,
            "profileCompletion": 80,
            "createdAt": "2026-08-25T23:26:00Z",
            "updatedAt": "2026-08-25T23:26:00Z"
        }
        
        new_users.append(user_doc)
        new_profiles.append(profile_doc)
        new_cvs.append(cv_doc)
        print(f"Successfully processed and prepared candidate profile: {name} ({email})")
        
    if not new_users:
        print("No new candidates to sync.")
        return
        
    # Append to existing
    updated_users = current_users + new_users
    updated_profiles = current_profiles + new_profiles
    updated_cvs = current_cvs + new_cvs
    
    # Sync back to DB
    print(f"Syncing {len(new_users)} new candidates to the database...")
    try:
        r1 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "users", "data": updated_users})
        r2 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "candidateProfiles", "data": updated_profiles})
        r3 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "cvs", "data": updated_cvs})
        
        if r1.json().get("success") and r2.json().get("success") and r3.json().get("success"):
            print("Successfully synced all collections to database!")
        else:
            print("Failed to sync some collections.")
    except Exception as e:
        print(f"Error syncing back to DB: {e}")

if __name__ == "__main__":
    main()
