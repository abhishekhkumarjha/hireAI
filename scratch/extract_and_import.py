import os
import sys
import zipfile
import json
import time
import requests
import pypdf
import docx2txt

API_BASE = "http://localhost:3000"

def normalize_spacing(text):
    if not text:
        return ""
    lines = text.split('\n')
    new_lines = []
    for line in lines:
        tokens = line.strip().split(' ')
        # Filter empty tokens
        tokens = [t for t in tokens if t]
        if not tokens:
            new_lines.append("")
            continue
        single_chars = [t for t in tokens if len(t) == 1]
        # If a significant ratio of characters are single letters, it's spaced out
        if len(tokens) > 2 and (len(single_chars) / len(tokens)) > 0.5:
            # Reconstruct words: split by multi-spaces
            # Usually double spaces separate words in kerning-spaced text
            placeholder = "___WORD_SEP___"
            temp = line.replace('   ', placeholder).replace('  ', placeholder)
            temp = temp.replace(' ', '')
            normalized_line = temp.replace(placeholder, ' ')
            new_lines.append(normalized_line.strip())
        else:
            new_lines.append(line)
    return '\n'.join(new_lines).strip()

def extract_pdf_text(filepath):
    try:
        reader = pypdf.PdfReader(filepath)
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        raw_text = text.strip()
        normalized = normalize_spacing(raw_text)
        return normalized
    except Exception as e:
        print(f"Error reading PDF {filepath}: {e}")
        return ""

def extract_docx_text(filepath):
    try:
        raw_text = docx2txt.process(filepath).strip()
        normalized = normalize_spacing(raw_text)
        return normalized
    except Exception as e:
        print(f"Error reading DOCX {filepath}: {e}")
        return ""

def main():
    zip_path = r"C:\Users\Abhishekh Kumar Jha\Downloads\data engineer.zip"
    extract_dir = r"C:\Users\Abhishekh Kumar Jha\Downloads\extracted_data_engineer"
    
    # Extract zip file
    print(f"Extracting {zip_path} to {extract_dir}...")
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        print("Extraction complete.")
    except Exception as e:
        print(f"Failed to extract zip file: {e}")
        return

    # Gather extracted files
    target_files = []
    for root, dirs, files in os.walk(extract_dir):
        for file in files:
            if file.lower().endswith(('.pdf', '.docx')):
                target_files.append(os.path.join(root, file))

    # Remove duplicates by filename to prevent redundant operations
    unique_files = {}
    for path in target_files:
        filename = os.path.basename(path)
        if filename not in unique_files:
            unique_files[filename] = path
            
    target_files = list(unique_files.values())
    print(f"Found {len(target_files)} unique resumes to parse.")

    # Fetch current DB state
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

    final_users_dict = {u["id"]: u for u in current_users}
    final_profiles_dict = {p["userId"]: p for p in current_profiles}
    final_cvs_dict = {c["id"]: c for c in current_cvs}

    existing_emails = {u["email"].lower() for u in current_users}

    # Process each resume
    for idx, filepath in enumerate(target_files):
        filename = os.path.basename(filepath)
        print(f"[{idx+1}/{len(target_files)}] Processing: {filename}")

        if filename.lower().endswith('.pdf'):
            text = extract_pdf_text(filepath)
        elif filename.lower().endswith('.docx'):
            text = extract_docx_text(filepath)
        else:
            continue

        if not text:
            print(f"Skip {filename}: Empty text content.")
            continue

        # Parse using Gemini via Express endpoint
        try:
            parse_res = requests.post(f"{API_BASE}/api/parse-cv", json={"cvText": text})
            parse_data = parse_res.json()
            if not parse_data.get("success"):
                print(f"Gemini failed to parse {filename}: {parse_data.get('error')}")
                continue
            parsed_profile = parse_data["data"]
        except Exception as e:
            print(f"Request failed for {filename}: {e}")
            continue

        name = parsed_profile.get("fullName") or os.path.splitext(filename)[0].replace("_", " ").title()
        email = parsed_profile.get("email") or f"candidate_{int(time.time() * 1000) + idx}@cloudinntech.co.in"
        email_lower = email.lower()

        # Check duplicate emails to avoid double insertion in this run
        if email_lower in existing_emails:
            print(f"User {email} already exists or processed in this batch. Skipping.")
            continue
        existing_emails.add(email_lower)

        # Create new records cleanly
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
            "createdAt": "2026-08-26T00:10:00Z"
        }

        cv_doc = {
            "id": cv_id,
            "candidateId": user_id,
            "title": f"{name} Resume",
            "isPrimary": True,
            "rawText": text,
            "parsedData": parsed_profile,
            "uploadedAt": "2026-08-26T00:10:00Z",
            "updatedAt": "2026-08-26T00:10:00Z"
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
            "profileCompletion": 85,
            "createdAt": "2026-08-26T00:10:00Z",
            "updatedAt": "2026-08-26T00:10:00Z"
        }

        final_users_dict[user_id] = user_doc
        final_profiles_dict[user_id] = profile_doc
        final_cvs_dict[cv_id] = cv_doc
        print(f"Created clean candidate details for: {name} ({email})")

    # Sync back to DB
    print("Syncing updated collections back to MongoDB...")
    try:
        r1 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "users", "data": list(final_users_dict.values())})
        r2 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "candidateProfiles", "data": list(final_profiles_dict.values())})
        r3 = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "cvs", "data": list(final_cvs_dict.values())})

        if r1.json().get("success") and r2.json().get("success") and r3.json().get("success"):
            print("Successfully updated database and corrected all candidate details!")
        else:
            print("Failed to sync some collections.")
    except Exception as e:
        print(f"Error syncing back to DB: {e}")

if __name__ == "__main__":
    main()
