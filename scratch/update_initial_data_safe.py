import requests
import json

API_BASE = "http://localhost:3000"

def replace_variable(content, var_name, type_annotation, new_data_json):
    start_marker = f"export const {var_name}: {type_annotation} = ["
    idx = content.find(start_marker)
    if idx == -1:
        print(f"Marker {start_marker} not found!")
        return content

    # Find the closing ]; of the array
    # Since it is formatted, the closing array bracket ]; will be on its own line or at the start of a line after the opening.
    # Let's search from idx + len(start_marker)
    search_start = idx + len(start_marker)
    end_idx = -1
    
    # We trace brackets to find the matching closing bracket of the array
    bracket_count = 1 # We started inside the '['
    for i in range(search_start, len(content)):
        char = content[i]
        if char == '[':
            bracket_count += 1
        elif char == ']':
            bracket_count -= 1
            if bracket_count == 0:
                # Found the closing bracket!
                # Ensure the next character is a semicolon
                if i + 1 < len(content) and content[i + 1] == ';':
                    end_idx = i + 2
                    break
    
    if end_idx == -1:
        print(f"Closing ]; for {var_name} not found!")
        return content
        
    new_declaration = f"export const {var_name}: {type_annotation} = {new_data_json};"
    return content[:idx] + new_declaration + content[end_idx:]

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

    users_json = json.dumps(users, indent=2)
    profiles_json = json.dumps(profiles, indent=2)
    cvs_json = json.dumps(cvs, indent=2)
    jobs_json = json.dumps(jobs, indent=2)

    initial_data_path = r"c:\Users\Abhishekh Kumar Jha\OneDrive\Desktop\hire_ai\src\data\initialData.ts"
    
    print(f"Reading {initial_data_path}...")
    with open(initial_data_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace variables one by one
    content = replace_variable(content, "INITIAL_USERS", "User[]", users_json)
    content = replace_variable(content, "INITIAL_CANDIDATE_PROFILES", "CandidateProfile[]", profiles_json)
    content = replace_variable(content, "INITIAL_CVS", "CVItem[]", cvs_json)
    content = replace_variable(content, "INITIAL_JOBS", "Job[]", jobs_json)

    print(f"Writing updated initialData.ts...")
    with open(initial_data_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Successfully pre-populated initialData.ts safely!")

if __name__ == "__main__":
    main()
