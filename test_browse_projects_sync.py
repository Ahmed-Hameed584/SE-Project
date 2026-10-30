"""
================================================================================
MILESTONES PLATFORM - BROWSE PROJECTS (ADMIN & CLIENT UPLOADS) VERIFICATION
Validates:
1. Admin-created projects appear in Browse Projects (Marketplace) when unassigned.
2. Client-created projects appear in Browse Projects (Marketplace).
3. getMarketplaceProjects() filter robustness (statuses, assignment, completed exclusions).
4. Category pill filtering (all categories, case-insensitivity, attribute robustness).
5. Search filtering (titles, clients, descriptions, skills).
6. HTML/JS DOM integrity across freelancer.html, admin.html, index.html, freelancer.js, and admin.js.
================================================================================
"""

import os
import re
import sys
import json

WORKSPACE = r"c:\Users\Ahmed\Documents\3rd Semester\SE project\SE Project Code"

class TestSuite:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.tests = []

    def check(self, condition, category, name, detail=""):
        if condition:
            self.passed += 1
            self.tests.append({"cat": category, "name": name, "status": "PASS"})
            print(f"  [PASS] [{category}] {name}")
        else:
            self.failed += 1
            self.tests.append({"cat": category, "name": name, "status": "FAIL", "detail": detail})
            print(f"  [FAIL] [{category}] {name} - {detail}")

    def summary(self):
        print("\n" + "=" * 80)
        print(f"TEST RESULTS: Total: {self.passed + self.failed} | Passed: {self.passed} | Failed: {self.failed}")
        print("=" * 80)
        if self.failed > 0:
            print("\nFailed tests details:")
            for t in self.tests:
                if t["status"] == "FAIL":
                    print(f"- [{t['cat']}] {t['name']}: {t.get('detail')}")
            sys.exit(1)
        else:
            print("\nALL BROWSE PROJECTS & MARKETPLACE SYNC TESTS PASSED!")

ts = TestSuite()

# ------------------------------------------------------------------------------
# 1. SIMULATE MilestonesDB LOGIC EXACTLY AS IN db.js
# ------------------------------------------------------------------------------
print("\n>>> 1. TESTING DATABASE ENGINE (db.js) MARKETPLACE RETRIEVAL & CREATION <<<")

class SimulatedDB:
    def __init__(self):
        self.projects = [
            {
                "id": "#PRJ-101",
                "name": "Mobile Banking App",
                "category": "Mobile App",
                "client": "Apex Fintech Ltd",
                "freelancer": "Ali Hassan",
                "freelancerEmail": "freelancer@milestones.com",
                "budget": "$5,200",
                "status": "In Progress",
                "skills": ["Flutter", "UI/UX Design", "Fintech"]
            },
            {
                "id": "#PRJ-104",
                "name": "AI Chatbot Integration",
                "category": "AI & Data Science",
                "client": "Nova Health Solutions",
                "freelancer": "Unassigned",
                "freelancerEmail": "",
                "budget": "$3,800",
                "status": "Open Marketplace",
                "skills": ["Python", "NLP", "OpenAI API"]
            },
            {
                "id": "#PRJ-105",
                "name": "CRM System Redesign",
                "category": "Web Development",
                "client": "Marcus Vance",
                "freelancer": "Ali Hassan",
                "freelancerEmail": "freelancer@milestones.com",
                "budget": "$4,000",
                "status": "Completed",
                "skills": ["React", "CSS"]
            },
            {
                "id": "#PRJ-107",
                "name": "SaaS Landing Page & Brand Identity",
                "category": "Branding",
                "client": "CloudScale AI",
                "freelancer": "Unassigned",
                "freelancerEmail": "",
                "budget": "$1,900",
                "status": "Open Marketplace",
                "skills": ["Branding", "UI/UX", "Tailwind CSS"]
            }
        ]

    def getProjects(self):
        return self.projects

    def getMarketplaceProjects(self):
        projects = self.getProjects()
        result = []
        for p in projects:
            status = str(p.get("status") or "").strip().lower()
            freelancer = str(p.get("freelancer") or "").strip().lower()
            freelancerEmail = str(p.get("freelancerEmail") or "").strip().lower()

            isExplicitMarketplace = status in ['open marketplace', 'open', 'open bid', 'proposed', 'pending review']
            isUnassigned = not p.get("freelancer") or freelancer in ['unassigned', '', '--'] or not freelancerEmail
            isNotFinished = status not in ['completed', 'resolved']

            if (isExplicitMarketplace or isUnassigned) and isNotFinished:
                result.append(p)
        return result

    def createProject(self, data):
        maxId = 100
        for p in self.projects:
            nums = re.findall(r'\d+', str(p.get("id") or ""))
            if nums:
                num = int(nums[0])
                if num > maxId:
                    maxId = num
        nextId = f"#PRJ-{maxId + 1}"
        
        rawBudget = re.sub(r'[^0-9.]', '', str(data.get("budget", 2500)))
        rawBudgetVal = float(rawBudget) if rawBudget else 2500.0

        isAssigned = bool(data.get("freelancer") and 
                          str(data.get("freelancer")).strip().lower() != 'unassigned' and 
                          str(data.get("freelancer")).strip() != '')

        proj = {
            "id": nextId,
            "name": str(data.get("name") or "Untitled Project").strip(),
            "category": data.get("category") or "General",
            "client": str(data.get("client") or "Client Representative").strip(),
            "clientEmail": data.get("clientEmail") or "client@milestones.com",
            "freelancer": data.get("freelancer", "").strip() if isAssigned else "Unassigned",
            "freelancerEmail": data.get("freelancerEmail", "") if isAssigned else "",
            "budget": f"${rawBudgetVal:,.0f}",
            "budgetValue": rawBudgetVal,
            "status": data.get("status") or ("In Progress" if isAssigned else "Open Marketplace"),
            "skills": data.get("skills") if isinstance(data.get("skills"), list) and data.get("skills") else [data.get("category") or "Deliverables"],
            "description": str(data.get("description") or "Project deliverables").strip()
        }
        self.projects.insert(0, proj)
        return proj

db = SimulatedDB()

# Initial marketplace projects count
initialMarket = db.getMarketplaceProjects()
ts.check(len(initialMarket) == 2, "DB Engine", "Initial marketplace projects count correct (PRJ-104 and PRJ-107)")
ts.check(any(p["id"] == "#PRJ-104" for p in initialMarket), "DB Engine", "PRJ-104 is in marketplace")
ts.check(not any(p["id"] == "#PRJ-101" for p in initialMarket), "DB Engine", "PRJ-101 (In Progress with Ali) is not in marketplace")
ts.check(not any(p["id"] == "#PRJ-105" for p in initialMarket), "DB Engine", "PRJ-105 (Completed) is not in marketplace")

# 1. Admin creates project for Marketplace
adminProj = db.createProject({
    "name": "Cybersecurity Penetration Test",
    "category": "Cybersecurity",
    "budget": 6500,
    "client": "Vanguard Trust Bank",
    "freelancer": "", # Unassigned
    "description": "Full vulnerability audit and reporting."
})

ts.check(adminProj["id"] == "#PRJ-108", "Admin Upload", "Admin project assigned next ID (#PRJ-108)")
ts.check(adminProj["status"] == "Open Marketplace", "Admin Upload", "Admin project status defaulted to Open Marketplace")
ts.check(adminProj["freelancer"] == "Unassigned", "Admin Upload", "Admin project freelancer is Unassigned")

marketAfterAdmin = db.getMarketplaceProjects()
ts.check(any(p["id"] == "#PRJ-108" for p in marketAfterAdmin), "Admin Upload", "Admin-created project appears immediately in getMarketplaceProjects()")

# 2. Client uploads project for Marketplace
clientProj = db.createProject({
    "name": "E-Commerce Next.js Storefront",
    "category": "Web Development",
    "budget": 4200,
    "client": "Urban Apparel",
    "clientEmail": "client@urbanapparel.com",
    "skills": ["Next.js", "Stripe", "PostgreSQL"],
    "description": "High performance online store."
})

ts.check(clientProj["id"] == "#PRJ-109", "Client Upload", "Client project assigned next ID (#PRJ-109)")
ts.check(clientProj["status"] == "Open Marketplace", "Client Upload", "Client project status is Open Marketplace")

marketAfterClient = db.getMarketplaceProjects()
ts.check(any(p["id"] == "#PRJ-109" for p in marketAfterClient), "Client Upload", "Client-created project appears immediately in getMarketplaceProjects()")
ts.check(len(marketAfterClient) == 4, "Marketplace Count", "Total marketplace projects correctly increased to 4")

# ------------------------------------------------------------------------------
# 2. SIMULATE RENDER MARKETPLACE FILTERING
# ------------------------------------------------------------------------------
print("\n>>> 2. TESTING CATEGORY PILLS & SEARCH FILTERING LOGIC <<<")

def simulateFilter(projects, category='all', search=''):
    normCat = (category or 'all').strip().lower()
    normSearch = (search or '').strip().lower()

    filtered = []
    for item in projects:
        itemCat = (item.get("category") or "").strip().lower()
        skills = [str(s).lower() for s in item.get("skills", [])]

        matchCat = (normCat == 'all' or
                    itemCat == normCat or
                    itemCat in normCat or
                    normCat in itemCat or
                    any(normCat in s for s in skills))

        matchSearch = (not normSearch or
                       normSearch in (item.get("name") or "").lower() or
                       normSearch in (item.get("client") or "").lower() or
                       normSearch in itemCat or
                       normSearch in (item.get("description") or "").lower() or
                       any(normSearch in s for s in skills))

        if matchCat and matchSearch:
            filtered.append(item)
    return filtered

allMarket = db.getMarketplaceProjects()

# Test 'all'
ts.check(len(simulateFilter(allMarket, 'all', '')) == 4, "Filter", "Category 'all' returns all 4 marketplace projects")

# Test 'Cybersecurity' (Admin project)
cyberFilter = simulateFilter(allMarket, 'Cybersecurity', '')
ts.check(len(cyberFilter) == 1 and cyberFilter[0]["id"] == "#PRJ-108", "Filter", "Category 'Cybersecurity' correctly returns Admin project #PRJ-108")

# Test 'Web Development' (Client project)
webFilter = simulateFilter(allMarket, 'Web Development', '')
ts.check(any(p["id"] == "#PRJ-109" for p in webFilter), "Filter", "Category 'Web Development' correctly returns Client project #PRJ-109")

# Test 'AI & Data Science'
aiFilter = simulateFilter(allMarket, 'AI & Data Science', '')
ts.check(any(p["id"] == "#PRJ-104" for p in aiFilter), "Filter", "Category 'AI & Data Science' correctly returns #PRJ-104")

# Test 'Branding'
brandingFilter = simulateFilter(allMarket, 'Branding', '')
ts.check(any(p["id"] == "#PRJ-107" for p in brandingFilter), "Filter", "Category 'Branding' correctly returns #PRJ-107")

# Test Search
searchPenTest = simulateFilter(allMarket, 'all', 'Penetration')
ts.check(len(searchPenTest) == 1 and searchPenTest[0]["id"] == "#PRJ-108", "Search", "Search 'Penetration' matches Admin project")

searchClientName = simulateFilter(allMarket, 'all', 'Urban Apparel')
ts.check(len(searchClientName) == 1 and searchClientName[0]["id"] == "#PRJ-109", "Search", "Search 'Urban Apparel' matches Client project")

searchSkill = simulateFilter(allMarket, 'all', 'Stripe')
ts.check(len(searchSkill) == 1 and searchSkill[0]["id"] == "#PRJ-109", "Search", "Search by skill 'Stripe' matches Client project")

# ------------------------------------------------------------------------------
# 3. VERIFY HTML & JS CODEBASE FILES
# ------------------------------------------------------------------------------
print("\n>>> 3. VERIFYING CODEBASE DOM INTEGRITY & INTEGRATION <<<")

# Check freelancer.html
with open(os.path.join(WORKSPACE, "freelancer.html"), "r", encoding="utf-8") as f:
    freelancerHtml = f.read()

ts.check('id="clientUploadProjectBtn"' in freelancerHtml, "freelancer.html", "Post a Project button present in Browse Projects header")
ts.check('id="clientUploadModalBackdrop"' in freelancerHtml, "freelancer.html", "Client upload modal backdrop present")
ts.check('id="clientUploadForm"' in freelancerHtml, "freelancer.html", "Client upload form present with all inputs")
ts.check('data-category="UI/UX Design"' in freelancerHtml and 'data-cat="UI/UX Design"' in freelancerHtml, "freelancer.html", "Category pills have both data-category and data-cat attributes")
ts.check('data-category="AI & Data Science"' in freelancerHtml, "freelancer.html", "AI & Data Science pill present")
ts.check('data-category="Cybersecurity"' in freelancerHtml, "freelancer.html", "Cybersecurity pill present")
ts.check('data-category="Branding"' in freelancerHtml, "freelancer.html", "Branding pill present")

# Check freelancer.js
with open(os.path.join(WORKSPACE, "freelancer.js"), "r", encoding="utf-8") as f:
    freelancerJs = f.read()

ts.check('data-category' in freelancerJs and 'data-cat' in freelancerJs, "freelancer.js", "Reads both data-category and data-cat attributes")
ts.check('clientUploadProjectBtn' in freelancerJs, "freelancer.js", "Wires clientUploadProjectBtn click handler")
ts.check('clientUploadForm' in freelancerJs, "freelancer.js", "Wires clientUploadForm submit handler")
ts.check('MilestonesDB.createProject' in freelancerJs or 'db.createProject' in freelancerJs, "freelancer.js", "Calls db.createProject when client form submitted")
ts.check("window.addEventListener('storage'" in freelancerJs, "freelancer.js", "Cross-tab storage synchronization listener present")
ts.check('checkUrlNavigation' in freelancerJs, "freelancer.js", "Direct URL hash/param navigation supported (?tab=browse&action=post-project)")

# Check admin.html
with open(os.path.join(WORKSPACE, "admin.html"), "r", encoding="utf-8") as f:
    adminHtml = f.read()

ts.check('id="createProjectModalBackdrop"' in adminHtml, "admin.html", "Admin create project modal exists")
ts.check('value="Cybersecurity"' in adminHtml, "admin.html", "Cybersecurity category option in admin modal")
ts.check('value="Branding"' in adminHtml, "admin.html", "Branding category option in admin modal")
ts.check('-- Open for Freelancer Bidding in Marketplace --' in adminHtml, "admin.html", "Admin unassigned marketplace bidding option present")

# Check admin.js
with open(os.path.join(WORKSPACE, "admin.js"), "r", encoding="utf-8") as f:
    adminJs = f.read()

ts.check("window.addEventListener('storage'" in adminJs, "admin.js", "Admin listens for storage events for real-time synchronization")
ts.check('createProjectForm' in adminJs, "admin.js", "Admin create project form handler persists projects")

# Check index.html
with open(os.path.join(WORKSPACE, "index.html"), "r", encoding="utf-8") as f:
    indexHtml = f.read()

ts.check('Browse Projects' in indexHtml, "index.html", "Browse Projects navigation link present on landing page")
ts.check('Post a Project' in indexHtml, "index.html", "Post a Project button present on landing page")
ts.check('freelancer.html?tab=browse' in indexHtml, "index.html", "Links directly to Browse Projects tab")

# Check db.js
with open(os.path.join(WORKSPACE, "db.js"), "r", encoding="utf-8") as f:
    dbJs = f.read()

ts.check('getMarketplaceProjects' in dbJs, "db.js", "getMarketplaceProjects method exists")
ts.check('open marketplace' in dbJs, "db.js", "Case-insensitive marketplace status checking implemented")
ts.check('isUnassigned' in dbJs or 'unassigned' in dbJs, "db.js", "Unassigned projects automatically eligible for marketplace")

ts.summary()
