# 🎯 MileStone - Transparent Project & Escrow Management Platform

> An escrow-protected, milestone-driven freelance workspace that eliminates payment friction and aligns expectations between **Clients**, **Freelancers**, and **Administrators**.

Built entirely with standard **HTML5**, **CSS3**, and **Vanilla JavaScript** (ES6+), powered by a centralized client-side relational storage engine (`db.js`) persisted in `localStorage` with real-time cross-tab synchronization. **No complex backend setup, database servers, or build tools required.**

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Quick Start Guide](#-quick-start-guide)
- [Demo Credentials](#-demo-credentials)
- [Project Architecture & File Structure](#-project-architecture--file-structure)
- [Role-by-Role Feature Guide](#-role-by-role-feature-guide)
  - [1. Client Workspace (`client.html`)](#1-client-workspace-clienthtml)
  - [2. Freelancer Workspace (`freelancer.html`)](#2-freelancer-workspace-freelancerhtml)
  - [3. Administrator Portal (`admin.html`)](#3-administrator-portal-adminhtml)
  - [4. Public Landing & Auth (`index.html`, `login.html`, `register.html`)](#4-public-landing--auth)
- [End-to-End Workflow Walkthrough](#-end-to-end-workflow-walkthrough)
- [Central Relational Storage Engine (`db.js`)](#-central-relational-storage-engine-dbjs)
- [Design System & Theme](#-design-system--theme)
- [Browser Compatibility](#-browser-compatibility)

---

## 🌟 Overview

Freelance projects often fail due to vague deliverables, delayed approvals, or disputes over payment. **MileStone** solves this by breaking contracts into discrete, trackable milestones backed by simulated escrow reserves:
1. **Clients** post contracts, review proposals, inspect submitted deliverables, release payments milestone-by-milestone, or dispute incomplete work with required feedback.
2. **Freelancers** discover open contracts in the marketplace, submit custom milestone proposals, upload deliverables, and withdraw earned funds.
3. **Administrators** monitor platform-wide metrics, manage accounts, audit escrow balances, arbitrate disputes, and approve/reject proposals.

---

## 🚀 Quick Start Guide

You can launch and explore the platform immediately using any of the options below:

### Option A: Direct Browser Launch (Simplest)
1. Navigate to the project folder on your computer.
2. Double-click **`index.html`** or **`login.html`** to open it directly in Chrome, Firefox, Safari, or Edge.

### Option B: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by *Ritwick Dey*).
3. Right-click **`index.html`** and select **"Open with Live Server"**.
4. The site will open at `http://127.0.0.1:5500/index.html`.

### Option C: Local HTTP Server (Terminal)
If you have Python or Node.js installed, open a terminal in the project directory and run:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve -l 8000
```
Open your browser to: **`http://localhost:8000`**

---

## 🔑 Demo Credentials

For instant demonstration and grading, **1-Click Autofill buttons** are available directly on the login page (`login.html`):

| Role | Email / Alias | Password | 1-Click Button | Landing Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **Client** | `client@milestones.com` *(or `client`)* | `client123` | **Client Fill** (Blue) | [`client.html`](client.html) |
| **Freelancer** | `freelancer@milestones.com` *(or `freelancer`)* | `freelancer123` | **Freelancer Fill** (Purple) | [`freelancer.html`](freelancer.html) |
| **Administrator** | `admin@milestones.com` *(or `admin`)* | `admin123` | **Admin Fill** (Green) | [`admin.html`](admin.html) |

> 💡 **Tip:** You can also register fresh client or freelancer accounts anytime via [`register.html`](register.html).

---

## 📂 Project Architecture & File Structure

```
SE Project Code/
│
├── index.html                   # Public landing page with features & hero CTAs
├── style.css                    # Public landing page stylesheet
├── script.js                    # Landing page mobile menu & scroll animations
│
├── login.html                   # Unified authentication login with 1-click autofill
├── login.js                     # Login controller, credential checks & role router
├── register.html                # Account registration form (Client & Freelancer)
├── register.css                 # Authentication pages stylesheet
├── register.js                  # Registration validation & database creation
│
├── client.html                  # Client Workspace (Dashboard, Post Project, Proposal, Milestones, Payments)
├── client.css                   # Client Workspace dark slate stylesheet
├── client.js                    # Client controller (proposals, milestone review, simulated payouts)
│
├── freelancer.html              # Freelancer Workspace (My Projects, Marketplace, Bidding, Wallet)
├── freelancer.css               # Freelancer Workspace stylesheet
├── freelancer.js                # Freelancer controller (deliverables, proposals, withdrawals)
│
├── admin.html                   # Administrator Portal (Stats, User Mgmt, Projects, Proposals, Disputes)
├── admin.css                    # Administrator Portal stylesheet
├── admin.js                     # Admin controller (stats, approvals, arbitration, project CRUD)
│
├── db.js                        # Central relational data store, localStorage engine & seed data
├── test_browse_projects_sync.py # Automated test suite for marketplace synchronization
└── README.md                    # Project documentation & user guide
```

---

## 🖥️ Role-by-Role Feature Guide

### 1. Client Workspace (`client.html`)

Designed strictly from the project wireframes (`Client_Panel_Updated.epgz`):

* **Main Menu (Sidebar):**
  * `[T1]` **Dashboard:** Displays active tip banner (*"Tip: when a freelancer sends a proposal, open the project to accept or decline it"*), project count badge, and the **My Projects** table.
  * `[T2]` **Post Project:** Dedicated contract publication screen.
  * `[T3]` **Payments:** Financial audit ledger of all completed payouts.
  * `[T4]` **Logout:** Securely terminates session and returns to login.
* **My Projects Table (`[T7]`):**
  * Displays: `Project`, `Budget`, `Freelancer`, `Status`, `Milestones`, and `Action`.
  * Pre-loaded demo contracts matching wireframes:
    1. **App Redesign** ($45,000 | Ahmed Raza | `Active` | `1 / 4 paid`)
    2. **Landing Page** ($20,000 | Bilal Khan | `Proposed` | `0 / 2 paid`)
    3. **Blog Setup** ($10,000 | Unassigned `-` | `Open` | `0 / 0 paid`)
    4. **Logo Refresh** ($20,000 | Zara Malik | `Completed` | `2 / 2 paid`)
  * `[T8]` Click **"Open"** on any row to open the detailed management view.
  * `[T10]` Includes dashed empty state when no projects match.
* **Post a Project (`[T5] - [T10]`):**
  * Form inputs for **Project Title** (`[T6]`), **Requirements** (`[T7]`), and **Budget** (`[T8]`).
  * Real-time validation: shows `[Validation] Title, requirements and budget are required.` if inputs are incomplete.
  * Clicking **"Post project"** (`[T9]`) instantly saves the project as `Open` and redirects to the Dashboard.
* **Review Proposals (`client_details_proposal`):**
  * Opens when clicking "Open" on a project with status `Proposed` (e.g. *Landing Page*).
  * Displays the freelancer's cover letter (`[T6]`) and itemized proposed milestones (`[T7]`).
  * `[T8]` **"Accept proposal"**: Starts the project, transitions status to `Active`, and sets proposed milestones.
  * `[T9]` **"Decline"**: Re-opens project for other freelancers to bid.
* **Manage Deliverables & Release Payouts (`client_details_milestones`):**
  * Opens when clicking "Open" on an `Active` project (e.g. *App Redesign*).
  * `[T6]` **Paid & Locked:** Paid milestones display a green lock indicator (*"Paid. This milestone is locked."*).
  * `[T7]` **Approved Milestones:** Displays the **"Release payment (simulated)"** button. Clicking this logs a transaction, locks the milestone, credits the freelancer, and updates progress.
  * `[T8] - [T10]` **Submitted Deliverables:** Displays the freelancer's submission notes. The client can click **"Approve"** (`[T9]`) or enter feedback and click **"Reject"** (`[T10]`).
  * `[T11] - [T12]` **Disputed Milestones:** Shows client's previous feedback and alerts that the contract is under admin arbitration.
* **Payments Made Ledger (`client_payments`):**
  * View every payout timestamp, milestone title, recipient freelancer, and amount.
  * Displays real-time **Total Paid** summary card (`[T8]`).

---

### 2. Freelancer Workspace (`freelancer.html`)

* **Verification Status (`[T5]`):**
  * Banners reflect whether the freelancer is identity-verified.
  * Includes a **"Toggle Verification (Simulation)"** button to test verified vs unverified bidding restrictions.
* **Assigned Contracts (Tab 1: My Projects):**
  * Track active client contracts, milestones completed, and percent progress.
  * Click **"Open"** to launch the contract workspace and click **"Submit Work for Milestone X"** to send deliverables to the client.
* **Marketplace & Proposal Bidding (Tab 2: Browse Projects):**
  * Filter open contracts by category pills (*All, UI/UX Design, Web Development, Mobile App, AI & Data Science, Cybersecurity, Branding*).
  * Search contracts by keyword, skill tag, or client name.
  * Click **"Submit Proposal"** on any open contract to specify bid amount, timeline, and cover letter.
  * Includes a **"Post a Project (Client Upload)"** shortcut button to simulate client contract uploads.
* **Earnings & Wallet (Tab 3: Payments):**
  * Live stat cards: *Total Earnings*, *In Escrow Protection*, *Milestones Completed*, and *Available for Payout*.
  * Click **"Withdraw"** to submit a payout request (Bank Wire, PayPal, Stripe) with overdraft protection.

---

### 3. Administrator Portal (`admin.html`)

* **Executive Dashboard:**
  * Real-time metrics: Total Users, Active Freelancers, Active Projects, Pending Approvals, Total Clients, Released Escrow, and 5% Platform Revenue.
  * Filter recent platform contracts by status (*All, In Progress, Completed, Proposed*).
* **Project Oversight & Approval:**
  * Click **"View"** on any project to inspect the milestone sequence or release escrow funds.
  * Publish new contracts using the **"Create Project"** modal.
* **User Management:**
  * Inspect full user directory with filterable roles (*Freelancers, Clients, Administrators*).
  * Add users, edit user roles/emails, toggle freelancer verification badges, or delete accounts.
* **Escrow Arbitration & Dispute Resolution:**
  * Dedicated **Disputes Tab** displays rejected milestones.
  * Administrators can inspect client feedback and arbitrate by clicking **"Refund Client"** or **"Release to Freelancer"**.
* **Proposal Review:**
  * Review all freelancer proposals across contracts and approve or reject them.

---

### 4. Public Landing & Auth

* **`index.html`:** Modern marketing homepage highlighting features, security trust badges, and navigation links.
* **`login.html`:** Clean authentication screen with 1-click credential autofills for Admin, Freelancer, and Client.
* **`register.html`:** Self-service registration with format validation, password length checks, and role selection.

---

## 🔄 End-to-End Workflow Walkthrough

Here is how to test the complete freelance contract lifecycle across all portals:

```
[Client] Posts Contract
         │
         ▼
[Freelancer] Bids in Marketplace
         │
         ▼
[Client] Accepts Proposal
         │
         ▼
[Freelancer] Submits Milestone Work
         │
         ▼
[Client] Approves & Releases Payment
         │
         ▼
[Freelancer] Withdraws Earnings from Wallet
```

### Step 1: Log in as Client & Post a Project
1. Go to `login.html`, click **"Client Fill"**, then **"Login"**.
2. Click **"Post Project"** in the sidebar.
3. Enter Title: `Fintech iOS App`, Requirements: `Design high-fidelity screens`, Budget: `30000`.
4. Click **"Post project"**. The project appears in the table with status `Open`.

### Step 2: Switch to Freelancer & Submit a Proposal
1. Open user dropdown on top-right $\to$ click **"Switch to Freelancer Workspace"** (or log in via `freelancer@milestones.com`).
2. Click **"Browse Projects"** in the sidebar.
3. Locate `Fintech iOS App` and click **"Submit Proposal"**.
4. Enter your bid ($30,000), timeline, and cover letter $\to$ click **"Submit Proposal"**.

### Step 3: Switch back to Client & Accept the Proposal
1. Switch back to Client (`client.html`).
2. In **My Projects**, click **"Open"** on `Fintech iOS App` (badge will show `Proposed`).
3. Inspect the proposal and click **"Accept proposal"**. The project transitions to `Active`.

### Step 4: Freelancer Submits Milestone Deliverables
1. Switch to Freelancer (`freelancer.html`).
2. Under **My Projects**, click **"Open"** on `Fintech iOS App`.
3. Click **"Submit Work for Milestone 1"**. Milestone status becomes `Submitted - Under Review`.

### Step 5: Client Approves & Releases Payout
1. Switch to Client (`client.html`).
2. Click **"Open"** on `Fintech iOS App`.
3. Locate Milestone 1, click **"Approve"**, then click **"Release payment (simulated)"** and confirm.
4. Milestone is now marked `Paid` and locked.
5. Click **"Payments"** in the sidebar to view the newly logged payout record and updated total paid.

### Step 6: Freelancer Withdraws Funds
1. Switch to Freelancer (`freelancer.html`).
2. Click **"Payments"** tab. The Available Balance has increased.
3. Click **"Withdraw"**, enter an amount, select **Bank Wire**, and confirm. Balance is debited and transaction history is updated.

---

## 💾 Central Relational Storage Engine (`db.js`)

All data is structured relationally client-side in `localStorage` under `milestones_platform_db_v2`:

```
               ┌─────────────────────────────────────┐
               │         MilestonesDB (db.js)        │
               └──────────────────┬──────────────────┘
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
  │    users     │         │   projects   │         │ transactions │
  │  (Accounts & │         │ (Milestones, │         │ (Escrow,     │
  │   Balances)  │         │  Proposals)  │         │  Payouts)    │
  └──────────────┘         └──────────────┘         └──────────────┘
```

* **Zero Data Loss on Refresh:** All additions, status transitions, and withdrawals persist across page reloads.
* **Automatic Schema Migration:** If a browser holds an older storage version, `_getDB()` safely injects wireframe projects and client demo data without erasing user additions.
* **Cross-Tab Reactivity:** When data changes in one browser tab (e.g. client releases payment), other open tabs (freelancer, admin) instantly update via the `storage` event.
* **Route Protection:** `MilestonesDB.requireAuth(['role'])` protects dashboards against unauthorized direct URL navigation.

---

## 🎨 Design System & Theme

* **Color Palette:**
  * Background: Slate 950 (`#020617`) & Slate 900 (`#0f172a`)
  * Cards / Surfaces: Slate 900 (`#0f172a`) & Slate 800 (`#1e293b`)
  * Accents: Emerald (`#10b981`), Blue (`#3b82f6`), Purple (`#8b5cf6`), Amber (`#f59e0b`), Rose (`#ef4444`)
  * Text: Slate 50 (`#f8fafc`) & Slate 400 (`#94a3b8`)
* **Typography:** `Inter` via Google Fonts (weights 400, 500, 600, 700, 800).
* **Iconography:** Official [Phosphor Icons](https://phosphoricons.com/) web library.
* **Accessibility & Security:**
  * High contrast ratios ($> 7:1$, exceeding WCAG AAA).
  * Strict entity encoding (`escapeHtml`) on all user-supplied inputs to eliminate XSS risks.
  * Full responsive design from mobile ($375\text{px}$) to wide screens ($1920\text{px}+$).

---

## 🌐 Browser Compatibility

Tested and fully supported on all modern evergreen browsers:
* **Google Chrome** / Chromium (v100+)
* **Mozilla Firefox** (v100+)
* **Microsoft Edge** (v100+)
* **Apple Safari** (v15+)

---

## 👥 Authors & Academic Context

* **Project:** Milestones Platform (SE Semester Project)
* **Course:** Software Engineering (3rd Semester)
* **Technologies:** HTML5, CSS3, JavaScript (ES6+), LocalStorage Relational Architecture

