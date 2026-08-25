import requests
import json
import time

API_BASE = "http://localhost:3000"

def main():
    new_jobs = [
        {
            "id": "job_genai_cloud_terraform",
            "title": "GenAI / Cloud / Terraform Engineer",
            "company": "CloudInnTech Corp",
            "department": "AI & DevOps Platforms",
            "location": "Hyderabad",
            "workMode": "onsite",
            "employmentType": "contract",
            "domain": "Data & AI",
            "salaryMin": 2040000, # 1.7 LPM yearly
            "salaryMax": 2040000,
            "salaryCurrency": "INR",
            "description": "We are seeking a highly skilled GenAI / Cloud / Terraform Engineer for a C2C engagement in Hyderabad. The role requires strong hands-on experience in Generative AI, agentic systems, infrastructure as code, and cloud platform architecture.",
            "responsibilities": [
                "Designing and developing reusable AI skills, copilots, agents, APIs, plugins, and automation components.",
                "Building enterprise GenAI solutions such as coding assistants, search assistants, chatbots, and workflow automation.",
                "Designing agent-based systems using LangGraph, AutoGen, or CrewAI with tool invocation and multi-step reasoning.",
                "Developing reusable Terraform frameworks, IaC templates, and building internal developer platforms for AI workloads."
            ],
            "requirements": [
                "Total Experience: 8+ Years.",
                "GenAI Experience: 3+ Years (OpenAI, LLMs, RAG, Agentic AI).",
                "Azure Cloud Experience: 5+ Years (AWS acceptable).",
                "Terraform Experience: 2+ Years mandatory.",
                "Hands-on experience with vector databases, LangGraph, CrewAI, AutoGen, and AI evaluation frameworks (RAGAS/DeepEval)."
            ],
            "requiredSkills": ["Generative AI", "LLMs", "RAG", "Agentic AI", "Azure", "Terraform", "LangGraph", "Python"],
            "preferredSkills": ["AutoGen", "CrewAI", "MCP Servers", "RAGAS", "DeepEval", "LoRA", "QLoRA"],
            "minimumExperience": 8,
            "maximumExperience": 15,
            "educationRequirements": ["B.Tech/M.Tech in Computer Science or equivalent"],
            "certifications": [],
            "numberOfOpenings": 3,
            "status": "published",
            "postedBy": "usr_super_admin",
            "createdAt": "2026-08-25T23:40:00Z",
            "updatedAt": "2026-08-25T23:40:00Z"
        },
        {
            "id": "job_snowflake_data_eng_new",
            "title": "Snowflake Data Engineer",
            "company": "CloudInnTech Corp",
            "department": "Data Engineering",
            "location": "Remote",
            "workMode": "remote",
            "employmentType": "contract",
            "domain": "Data & AI",
            "salaryMin": 1800000, # 1.5 LPM yearly
            "salaryMax": 1800000,
            "salaryCurrency": "INR",
            "description": "We are looking for experienced Snowflake Data Engineers with strong expertise in modern cloud data platforms and data engineering practices. This is a critical 2-3 months engagement (extendable).",
            "responsibilities": [
                "Design, develop, and maintain scalable ETL and ELT data pipelines using Snowflake.",
                "Build and optimize data-transformation workflows using dbt.",
                "Develop and manage data-processing workloads using Databricks.",
                "Build and orchestrate reliable data pipelines using Dagster.",
                "Implement and maintain data-ingestion and ELT pipelines using dlt and Fivetran."
            ],
            "requirements": [
                "Minimum 5 years of relevant Data Engineering experience.",
                "Valid Snowflake Certification is mandatory (proof required).",
                "Strong hands-on experience with Snowflake, dbt, and Databricks is mandatory.",
                "Experience with Dagster, dlt, Fivetran, advanced SQL, and Python."
            ],
            "requiredSkills": ["Snowflake", "dbt", "Databricks", "Dagster", "dlt", "Fivetran", "SQL", "Python"],
            "preferredSkills": ["AWS", "Azure", "GCP", "Apache Spark", "Delta Lake", "CI/CD"],
            "minimumExperience": 5,
            "maximumExperience": 10,
            "educationRequirements": ["B.Tech/M.Tech in CS/IT or equivalent"],
            "certifications": ["Snowflake Certified Data Engineer"],
            "numberOfOpenings": 2,
            "status": "published",
            "postedBy": "usr_super_admin",
            "createdAt": "2026-08-25T23:40:00Z",
            "updatedAt": "2026-08-25T23:40:00Z"
        },
        {
            "id": "job_servicenow_tech_lead",
            "title": "ServiceNow Tech Lead",
            "company": "CloudInnTech Corp",
            "department": "Enterprise Applications",
            "location": "Remote",
            "workMode": "remote",
            "employmentType": "contract",
            "domain": "Engineering",
            "salaryMin": 1680000, # 1.4 LPM - 1.5 LPM
            "salaryMax": 1800000,
            "salaryCurrency": "INR",
            "description": "Hands-on Tech Lead with strong AI and Modern UI expertise to guide the team in building Lit Web Components for AI-powered UI experiences on ServiceNow.",
            "responsibilities": [
                "Develop, code, and review pull requests.",
                "Guide the team in building Lit Web Components for AI-powered UI experiences.",
                "Mentor the team on AI-native UI patterns and best practices.",
                "Integrate with AI Agents, Skills, MCP Servers, and A2A Protocols."
            ],
            "requirements": [
                "8+ Years of total experience.",
                "Strong expertise in AI and modern frontend technologies.",
                "ServiceNow platform experience (Scoped Apps and Integration Hub) is a strong advantage."
            ],
            "requiredSkills": ["ServiceNow", "Lit Web Components", "AI Agents", "MCP Servers", "A2A Protocols", "Integration Hub"],
            "preferredSkills": ["Scoped Apps", "JavaScript", "React"],
            "minimumExperience": 8,
            "maximumExperience": 14,
            "educationRequirements": ["Bachelor's degree in CS/IT or equivalent"],
            "certifications": [],
            "numberOfOpenings": 1,
            "status": "published",
            "postedBy": "usr_super_admin",
            "createdAt": "2026-08-25T23:40:00Z",
            "updatedAt": "2026-08-25T23:40:00Z"
        },
        {
            "id": "job_servicenow_mobile_consultant",
            "title": "Senior Technical Consultant - Mobile App/Virtual Agent",
            "company": "CloudInnTech Corp",
            "department": "Enterprise Applications",
            "location": "Remote",
            "workMode": "remote",
            "employmentType": "contract",
            "domain": "Engineering",
            "salaryMin": 1560000, # 1.3 LPM - 1.4 LPM
            "salaryMax": 1680000,
            "salaryCurrency": "INR",
            "description": "Senior Technical Consultant specialized in ServiceNow Mobile Application development and Virtual Agent setup.",
            "responsibilities": [
                "Configure and design ServiceNow Mobile Application layouts and workflows.",
                "Build and optimize Virtual Agent conversational flows and NLU models.",
                "Implement integrations and scoped applications on ServiceNow."
            ],
            "requirements": [
                "5 Years of ServiceNow consultancy experience.",
                "Hands-on experience with ServiceNow Mobile App Builder and Virtual Agent Designer.",
                "Compliance and BGV check clearance is mandatory."
            ],
            "requiredSkills": ["ServiceNow", "ServiceNow Mobile App", "Virtual Agent", "NLU", "Scoped Apps", "Integrations"],
            "preferredSkills": ["Flow Designer", "Integration Hub"],
            "minimumExperience": 5,
            "maximumExperience": 10,
            "educationRequirements": ["Bachelor's degree in CS/IT or equivalent"],
            "certifications": [],
            "numberOfOpenings": 1,
            "status": "published",
            "postedBy": "usr_super_admin",
            "createdAt": "2026-08-25T23:40:00Z",
            "updatedAt": "2026-08-25T23:40:00Z"
        },
        {
            "id": "job_servicenow_sr_dev",
            "title": "ServiceNow Sr. Developer",
            "company": "CloudInnTech Corp",
            "department": "Enterprise Applications",
            "location": "Noida",
            "workMode": "hybrid",
            "employmentType": "contract",
            "domain": "Engineering",
            "salaryMin": 1680000, # 1.4 LPM - 1.5 LPM
            "salaryMax": 1800000,
            "salaryCurrency": "INR",
            "description": "ServiceNow Senior Developer focusing on the Customer Service Management (CSM) module. Shift timing is 10:00 AM to 7:00 PM IST.",
            "responsibilities": [
                "Design, develop, configure, and customize ServiceNow CSM solutions.",
                "Configure Case Management, Service Operations, Portals, Entitlements, and Omni-Channel Engagement.",
                "Develop integrations using REST, SOAP, Integration Hub, and MID Server.",
                "Perform code reviews and troubleshoot defects or performance bottlenecks."
            ],
            "requirements": [
                "5+ Years of ServiceNow development experience.",
                "Minimum 3 years of hands-on experience in ServiceNow Customer Service Management (CSM) module.",
                "BGV / Compliance clearance mandatory."
            ],
            "requiredSkills": ["ServiceNow", "ServiceNow CSM", "Integration Hub", "MID Server", "REST/SOAP", "Workflows"],
            "preferredSkills": ["Performance Analytics", "Knowledge Management", "Catalog Integration"],
            "minimumExperience": 5,
            "maximumExperience": 9,
            "educationRequirements": ["Bachelor's degree in CS/IT or equivalent"],
            "certifications": ["ServiceNow Certified Application Developer", "ServiceNow Implementation Specialist"],
            "numberOfOpenings": 1,
            "status": "published",
            "postedBy": "usr_super_admin",
            "createdAt": "2026-08-25T23:40:00Z",
            "updatedAt": "2026-08-25T23:40:00Z"
        },
        {
            "id": "job_workday_finance_consultant",
            "title": "Workday Finance Consultant",
            "company": "CloudInnTech Corp",
            "department": "Finance Systems",
            "location": "Bangalore",
            "workMode": "onsite",
            "employmentType": "contract",
            "domain": "HR",
            "salaryMin": 1920000, # 1.6 LPM + GST
            "salaryMax": 1920000,
            "salaryCurrency": "INR",
            "description": "We are seeking a highly experienced Workday Financial Consultant with strong expertise in Financial Management & configuration processes to support a critical enterprise engagement in Bangalore.",
            "responsibilities": [
                "Configure and support Workday Financial Management processes.",
                "Support Financial Accounting, Accounts Payable, Accounts Receivable, Revenue Management, Expenses, Banking & Settlement, and Procurement.",
                "Develop Workday Reporting & Analytics solutions."
            ],
            "requirements": [
                "5+ Years of experience in Workday Financials.",
                "Strong configuration experience in accounting, AP, AR, Revenue, Expenses, and Procurement.",
                "Workday Financials Certification is preferred."
            ],
            "requiredSkills": ["Workday Financials", "Accounts Payable", "Accounts Receivable", "Financial Accounting", "Procurement", "Workday Reporting"],
            "preferredSkills": ["Prism Analytics", "Adaptive Planning", "Integrations"],
            "minimumExperience": 5,
            "maximumExperience": 10,
            "educationRequirements": ["Bachelor's degree in Finance or CS/IT"],
            "certifications": ["Workday Financials Certification"],
            "numberOfOpenings": 1,
            "status": "published",
            "postedBy": "usr_super_admin",
            "createdAt": "2026-08-25T23:40:00Z",
            "updatedAt": "2026-08-25T23:40:00Z"
        },
        {
            "id": "job_salesforce_qa_lead",
            "title": "Salesforce QA Lead Engineer (Insurance: Life & Annuity)",
            "company": "CloudInnTech Corp",
            "department": "Quality Assurance",
            "location": "Remote",
            "workMode": "remote",
            "employmentType": "contract",
            "domain": "Engineering",
            "salaryMin": 1680000, # 1.4 LPM
            "salaryMax": 1680000,
            "salaryCurrency": "INR",
            "description": "We are seeking a Salesforce Quality Analyst Lead with 6 to 8 years experience, focusing on Insurance (Life & Annuity) projects. Exposure to AI-assisted testing tools and techniques is highly preferred.",
            "responsibilities": [
                "Lead the QA team and manage daily testing activities.",
                "Review business requirements, user stories, and create test strategies, plans, scenarios, and test data.",
                "Test Salesforce features including Apex, LWC, Flows, validation rules, security, API testing (Postman/SoapUI).",
                "Utilize approved AI-assisted tools for test-case generation, requirements analysis, and regression coverage."
            ],
            "requirements": [
                "6 to 8 Years of Salesforce QA testing experience.",
                "Insurance: Life & Annuity domain experience is mandatory.",
                "Strong experience testing Apex, LWC, Flows, API, profiles, roles, and field-level security."
            ],
            "requiredSkills": ["Salesforce Testing", "Life & Annuity Insurance", "API Testing", "Postman", "Apex/LWC Testing", "Jira"],
            "preferredSkills": ["SoapUI", "AI-assisted testing", "Azure DevOps"],
            "minimumExperience": 6,
            "maximumExperience": 8,
            "educationRequirements": ["Bachelor's degree in CS/IT or equivalent"],
            "certifications": [],
            "numberOfOpenings": 1,
            "status": "published",
            "postedBy": "usr_super_admin",
            "createdAt": "2026-08-25T23:40:00Z",
            "updatedAt": "2026-08-25T23:40:00Z"
        }
    ]
    
    print("Syncing the 7 new active requirements to the database...")
    try:
        res = requests.post(f"{API_BASE}/api/db/sync", json={"collection": "jobs", "data": new_jobs})
        if res.json().get("success"):
            print("Successfully updated database with the new requirements!")
        else:
            print("Failed to sync jobs collection.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
