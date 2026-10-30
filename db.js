/**
 * =============================================================================
 * MILESTONES PLATFORM - CENTRAL DATABASE & REPOSITORY LAYER (db.js)
 * Shared client-side relational data store persisted in localStorage.
 * Synchronizes Admin Dashboard, Freelancer Dashboard, Auth, and Marketplace.
 * =============================================================================
 */

(function (window) {
    'use strict';

    const DB_STORAGE_KEY = 'milestones_platform_db_v2';
    const SESSION_KEY = 'milestones_active_session_v2';

    // Seed Data
    const INITIAL_SEED_DATA = {
        users: [
            {
                id: "USR-801",
                name: "Administrator",
                email: "admin@milestones.com",
                role: "admin",
                status: "Active",
                verified: true,
                skills: ["System Administration", "Arbitration", "Escrow Management"],
                joined: "Jan 10, 2026",
                projects: 0,
                phone: "+1 (555) 019-2834"
            },
            {
                id: "USR-802",
                name: "Ali Hassan",
                email: "freelancer@milestones.com",
                role: "Freelancer",
                status: "Active",
                verified: true,
                skills: ["UI/UX Design", "Figma", "Design Systems", "Mobile Prototyping"],
                joined: "Feb 14, 2026",
                projects: 3,
                phone: "+1 (555) 342-8921",
                bio: "Lead Product Designer specializing in accessible fintech and healthcare design systems.",
                availableBalance: 2150.00,
                inEscrow: 3400.00,
                totalEarned: 7850.00
            },
            {
                id: "USR-803",
                name: "Sara Khan",
                email: "sara@urbanchic.pk",
                role: "Client",
                status: "Active",
                verified: true,
                company: "Urban Chic Brands",
                skills: [],
                joined: "Mar 01, 2026",
                projects: 2,
                phone: "+1 (555) 891-2344"
            },
            {
                id: "USR-804",
                name: "Usman Ali",
                email: "usman@novabrand.co",
                role: "Client",
                status: "Active",
                verified: true,
                company: "Nova Brand Partners",
                skills: [],
                joined: "Mar 15, 2026",
                projects: 1,
                phone: "+1 (555) 431-7788"
            },
            {
                id: "USR-805",
                name: "David Miller",
                email: "david.m@devstudio.com",
                role: "Freelancer",
                status: "Active",
                verified: true,
                skills: ["Fullstack", "Stripe", "Next.js", "Node.js"],
                joined: "Apr 02, 2026",
                projects: 2,
                phone: "+1 (555) 902-1144"
            },
            {
                id: "USR-806",
                name: "Kavita Patel",
                email: "kavita.p@flutterhub.dev",
                role: "Freelancer",
                status: "Pending",
                verified: false,
                skills: ["Flutter", "Dart", "Firebase"],
                joined: "May 10, 2026",
                projects: 1,
                phone: "+1 (555) 671-8890"
            }
        ],

        projects: [
            {
                id: "#PRJ-101",
                name: "App Redesign",
                category: "UI/UX Design",
                client: "Ali Hassan (Client Rep)",
                clientCompany: "FinTech Venture Labs",
                clientEmail: "ali.client@fintechlabs.io",
                clientInitials: "AH",
                freelancer: "Ali Hassan",
                freelancerEmail: "freelancer@milestones.com",
                freelancerInitials: "AH",
                budget: "$4,500",
                budgetValue: 4500,
                escrow: "$4,500 (100%)",
                deadline: "Dec 15, 2026",
                status: "In Progress",
                description: "Complete redesign and native mobile app overhaul. Encompasses design token architecture, high-fidelity responsive UI components, user flow optimization, and performance tuning.",
                milestones: [
                    { title: "User Research & Information Architecture", amount: "$1,500", status: "Approved", done: true, canApprove: false },
                    { title: "Component Design System & Figma Prototype", amount: "$1,500", status: "Under Review", done: false, canApprove: true, canSubmit: true },
                    { title: "Frontend Implementation & QA Testing", amount: "$1,500", status: "Pending", done: false, canApprove: false }
                ]
            },
            {
                id: "#PRJ-102",
                name: "E-Commerce Website",
                category: "Web Development",
                client: "Sara Khan",
                clientCompany: "Urban Chic Brands",
                clientEmail: "sara@urbanchic.pk",
                clientInitials: "SK",
                freelancer: "Ali Hassan",
                freelancerEmail: "freelancer@milestones.com",
                freelancerInitials: "AH",
                budget: "$3,200",
                budgetValue: 3200,
                escrow: "$3,200 (100%)",
                deadline: "Nov 30, 2026",
                status: "Proposed",
                description: "Modern headless Shopify & Next.js storefront with dynamic currency converter, cart drawer, and customer reviews carousel.",
                milestones: [
                    { title: "Next.js Frontend Storefront & Cart Engine", amount: "$1,600", status: "Under Client Review", done: false, canApprove: true },
                    { title: "Stripe Escrow Integration & ERP Sync", amount: "$1,600", status: "Pending", done: false }
                ]
            },
            {
                id: "#PRJ-103",
                name: "Logo Design",
                category: "Branding",
                client: "Usman Ali",
                clientCompany: "Nova Brand Partners",
                clientEmail: "usman@novabrand.co",
                clientInitials: "UA",
                freelancer: "Ali Hassan",
                freelancerEmail: "freelancer@milestones.com",
                freelancerInitials: "AH",
                budget: "$1,200",
                budgetValue: 1200,
                escrow: "$1,200 (100%)",
                deadline: "Oct 20, 2026",
                status: "Completed",
                description: "Complete corporate rebranding, geometric vector monogram logo, typography system, and brand guidelines PDF.",
                milestones: [
                    { title: "Moodboard, Concept Sketches & Monograms", amount: "$600", status: "Approved", done: true },
                    { title: "Final Deliverable Package & Vector Guidelines", amount: "$600", status: "Approved", done: true }
                ]
            },
            {
                id: "#PRJ-104",
                name: "Fintech Mobile Banking Dashboard",
                category: "UI/UX Design",
                client: "Zaid Al-Harbi",
                clientCompany: "Al-Harbi Capital",
                clientEmail: "zaid@alharbicapital.sa",
                clientInitials: "ZH",
                freelancer: "Unassigned",
                freelancerEmail: "",
                freelancerInitials: "--",
                budget: "$3,800",
                budgetValue: 3800,
                escrow: "$3,800 (100%)",
                deadline: "Dec 15, 2026",
                status: "Open Marketplace",
                description: "Seeking a senior designer to create dark-mode crypto and fiat asset tracking screens with biometric authentication flow.",
                skills: ["Figma", "Fintech", "Mobile App", "Design Systems"],
                milestones: [
                    { title: "Biometric Security & Authentication Flow", amount: "$1,800", status: "Pending", done: false },
                    { title: "Multi-Currency Asset Tracking Screens", amount: "$2,000", status: "Pending", done: false }
                ]
            },
            {
                id: "#PRJ-105",
                name: "Healthcare Telehealth Patient Portal",
                category: "Web Development",
                client: "Dr. Marcus Vance",
                clientCompany: "BioHealth Diagnostics",
                clientEmail: "marcus@biohealth.org",
                clientInitials: "MV",
                freelancer: "Unassigned",
                freelancerEmail: "",
                freelancerInitials: "--",
                budget: "$6,500",
                budgetValue: 6500,
                escrow: "$6,500 (100%)",
                deadline: "Jan 10, 2027",
                status: "Open Marketplace",
                description: "HIPAA-compliant patient appointment booking engine with real-time WebRTC audio/video consultations.",
                skills: ["React", "TypeScript", "TailwindCSS", "WebRTC"],
                milestones: [
                    { title: "HIPAA Encryption & Database Schema", amount: "$3,000", status: "Pending", done: false },
                    { title: "WebRTC Video Consultation Module", amount: "$3,500", status: "Pending", done: false }
                ]
            }
        ],

        proposals: [
            {
                id: "#PROP-301",
                projectId: "#PRJ-104",
                projectTitle: "Fintech Mobile Banking Dashboard",
                freelancer: "Ali Hassan",
                freelancerEmail: "freelancer@milestones.com",
                bidAmount: 3800,
                timeline: "2-4 weeks",
                coverLetter: "I specialize in financial services UI systems with high contrast dark mode and accessible typography.",
                status: "Pending Review",
                submittedDate: "Oct 29, 2026"
            }
        ],

        transactions: [
            {
                id: "#TX-901",
                projectId: "#PRJ-101",
                project: "App Redesign",
                party: "Ali Hassan (Freelancer)",
                freelancerEmail: "freelancer@milestones.com",
                client: "Ali Hassan (Client Rep)",
                amount: "$1,500.00",
                amountValue: 1500,
                type: "Milestone Payout",
                date: "Oct 28, 2026",
                status: "Completed"
            },
            {
                id: "#TX-882",
                projectId: "#PRJ-103",
                project: "Logo Design",
                party: "Ali Hassan (Freelancer)",
                freelancerEmail: "freelancer@milestones.com",
                client: "Usman Ali",
                amount: "$600.00",
                amountValue: 600,
                type: "Milestone Payout",
                date: "Oct 20, 2026",
                status: "Completed"
            },
            {
                id: "#TX-850",
                projectId: "#PRJ-103",
                project: "Logo Design",
                party: "Ali Hassan (Freelancer)",
                freelancerEmail: "freelancer@milestones.com",
                client: "Usman Ali",
                amount: "$600.00",
                amountValue: 600,
                type: "Milestone Payout",
                date: "Oct 12, 2026",
                status: "Completed"
            },
            {
                id: "#TX-760",
                projectId: "#PRJ-101",
                project: "App Redesign",
                party: "Escrow Deposit",
                freelancerEmail: "freelancer@milestones.com",
                client: "FinTech Venture Labs",
                amount: "$4,500.00",
                amountValue: 4500,
                type: "Escrow Funded",
                date: "Oct 01, 2026",
                status: "Completed"
            }
        ],

        disputes: [
            {
                id: "#DSP-401",
                projectRef: "#PRJ-101",
                projectName: "App Redesign",
                client: "Ali Hassan (Client Rep)",
                clientEmail: "ali.client@fintechlabs.io",
                freelancer: "Ali Hassan",
                freelancerEmail: "freelancer@milestones.com",
                amount: "$1,500",
                amountValue: 1500,
                reason: "Deliverable milestone did not cover required cross-platform biometric fallbacks specified in kick-off call.",
                status: "Pending Resolution",
                filedDate: "Oct 26, 2026"
            },
            {
                id: "#DSP-402",
                projectRef: "#PRJ-102",
                projectName: "E-Commerce Website",
                client: "Sara Khan",
                clientEmail: "sara@urbanchic.pk",
                freelancer: "David Miller",
                freelancerEmail: "david.m@devstudio.com",
                amount: "$1,600",
                amountValue: 1600,
                reason: "Payment gateway integration test sandbox keys were delayed by 10 business days.",
                status: "Pending Resolution",
                filedDate: "Oct 27, 2026"
            }
        ]
    };

    /**
     * Database Manager Implementation
     */
    const MilestonesDB = {
        /**
         * Load entire database from localStorage or seed
         */
        _getDB: function () {
            try {
                const stored = localStorage.getItem(DB_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.users && parsed.projects) {
                        return parsed;
                    }
                }
            } catch (e) {
                console.warn("Storage error reading DB:", e);
            }
            // Seed DB
            this._saveDB(INITIAL_SEED_DATA);
            return JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
        },

        /**
         * Persist entire database
         */
        _saveDB: function (data) {
            try {
                localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error("Storage error saving DB:", e);
                return false;
            }
        },

        // =====================================================================
        // AUTHENTICATION & SESSION MANAGEMENT
        // =====================================================================

        getCurrentUser: function () {
            try {
                const sessionStr = sessionStorage.getItem(SESSION_KEY);
                if (sessionStr) {
                    return JSON.parse(sessionStr);
                }
            } catch (e) {}
            return null;
        },

        setCurrentUser: function (user) {
            try {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
            } catch (e) {}
        },

        clearCurrentUser: function () {
            try {
                sessionStorage.removeItem(SESSION_KEY);
            } catch (e) {}
        },

        /**
         * Route Protection Guard
         * Redirects to login if not authenticated or not authorized
         */
        requireAuth: function (allowedRoles = []) {
            const user = this.getCurrentUser();
            if (!user) {
                const currentUrl = encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
                window.location.href = `login.html?redirect=${currentUrl}`;
                return false;
            }
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role.toLowerCase())) {
                alert(`Access Denied: Your account role (${user.role}) is not authorized for this dashboard.`);
                if (user.role.toLowerCase() === 'admin') {
                    window.location.href = 'admin.html';
                } else if (user.role.toLowerCase() === 'freelancer') {
                    window.location.href = 'freelancer.html';
                } else {
                    window.location.href = 'index.html';
                }
                return false;
            }
            return user;
        },

        /**
         * Authenticate Login
         */
        login: function (emailOrUsername, password) {
            const trimmed = (emailOrUsername || '').trim().toLowerCase();
            const pass = (password || '').trim();

            // Demo hardcoded admin check
            if ((trimmed === 'admin@milestones.com' || trimmed === 'admin') && (pass === 'admin123' || pass === 'admin')) {
                const user = {
                    id: "USR-801",
                    name: "Administrator",
                    email: "admin@milestones.com",
                    role: "admin",
                    verified: true
                };
                this.setCurrentUser(user);
                return { success: true, user };
            }

            // Demo hardcoded freelancer check
            if ((trimmed === 'freelancer@milestones.com' || trimmed === 'freelancer') && (pass === 'freelancer123' || pass === 'freelancer')) {
                const dbUser = this.getUserByEmail('freelancer@milestones.com') || {
                    id: "USR-802",
                    name: "Ali Hassan",
                    email: "freelancer@milestones.com",
                    role: "freelancer",
                    verified: true
                };
                this.setCurrentUser(dbUser);
                return { success: true, user: dbUser };
            }

            // Database user check
            const db = this._getDB();
            const user = db.users.find(u => 
                u.email.toLowerCase() === trimmed || 
                (u.name && u.name.toLowerCase() === trimmed)
            );

            if (user) {
                // If user registered, verify password (or default test password)
                if (user.password) {
                    if (user.password === pass) {
                        this.setCurrentUser(user);
                        return { success: true, user };
                    } else {
                        return { success: false, message: "Invalid password for this account." };
                    }
                } else {
                    // Seed users without password accept test password or role name
                    this.setCurrentUser(user);
                    return { success: true, user };
                }
            }

            return { success: false, message: "Account not found. Please verify your email or sign up." };
        },

        logout: function () {
            this.clearCurrentUser();
            window.location.href = 'index.html';
        },

        // =====================================================================
        // USERS CRUD
        // =====================================================================

        getUsers: function () {
            const db = this._getDB();
            return db.users || [];
        },

        getUserById: function (id) {
            return this.getUsers().find(u => u.id === id) || null;
        },

        getUserByEmail: function (email) {
            if (!email) return null;
            return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
        },

        createUser: function (userData) {
            const db = this._getDB();
            
            // Generate clean, strictly unique USR-xxx ID even after deletions
            let maxId = 800;
            if (db.users && db.users.length) {
                db.users.forEach(u => {
                    const num = parseInt(String(u.id || '').replace(/\D/g, ''), 10);
                    if (!isNaN(num) && num > maxId) maxId = num;
                });
            }
            const newId = `USR-${maxId + 1}`;
            
            // Normalize role
            const rawRole = (userData.role || 'Freelancer').toString().trim().toLowerCase();
            const role = rawRole === 'client' ? 'Client' : (rawRole === 'admin' ? 'Admin' : 'Freelancer');
            
            const user = {
                id: newId,
                name: userData.name ? userData.name.trim() : "New User",
                email: (userData.email || "").toString().trim().toLowerCase(),
                role: role,
                status: userData.status || "Active",
                verified: userData.verified !== undefined ? !!userData.verified : (role === 'Client'),
                skills: Array.isArray(userData.skills) ? userData.skills : (role === 'Freelancer' ? ["Web Development", "UI/UX Design"] : []),
                joined: userData.joined || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                projects: typeof userData.projects === 'number' ? userData.projects : 0,
                phone: userData.phone || "+1 (555) 000-0000",
                password: userData.password || "password123",
                bio: userData.bio || (role === 'Freelancer' ? "Professional freelancer on Milestones platform." : ""),
                availableBalance: userData.availableBalance !== undefined ? Number(userData.availableBalance) : 0.00,
                inEscrow: 0.00,
                totalEarned: 0.00
            };
            
            db.users.unshift(user);
            this._saveDB(db);
            return user;
        },

        updateUser: function (id, updates) {
            const db = this._getDB();
            const idx = db.users.findIndex(u => u.id === id);
            if (idx === -1) return false;
            db.users[idx] = Object.assign({}, db.users[idx], updates);
            this._saveDB(db);

            // If updating currently logged in user, refresh session
            const current = this.getCurrentUser();
            if (current && current.id === id) {
                this.setCurrentUser(db.users[idx]);
            }
            return db.users[idx];
        },

        deleteUser: function (id) {
            const db = this._getDB();
            const idx = db.users.findIndex(u => u.id === id);
            if (idx === -1) return false;
            db.users.splice(idx, 1);
            this._saveDB(db);
            return true;
        },

        toggleUserVerification: function (id) {
            const user = this.getUserById(id);
            if (!user) return false;
            return this.updateUser(id, { verified: !user.verified });
        },

        // =====================================================================
        // PROJECTS CRUD & WORKFLOWS
        // =====================================================================

        getProjects: function () {
            const db = this._getDB();
            return db.projects || [];
        },

        getProjectById: function (id) {
            return this.getProjects().find(p => p.id === id) || null;
        },

        getFreelancerProjects: function (email) {
            const projects = this.getProjects();
            if (!email) return projects;
            const normEmail = email.toLowerCase();
            const user = this.getUserByEmail(normEmail);
            const userName = user && user.name ? user.name.toLowerCase() : '';
            return projects.filter(p => {
                const pEmail = (p.freelancerEmail || '').toLowerCase();
                const pName = (p.freelancer || '').toLowerCase();
                return (pEmail && pEmail === normEmail) || (userName && pName === userName);
            });
        },

        getMarketplaceProjects: function () {
            const projects = this.getProjects();
            return projects.filter(p => {
                const status = (p.status || '').toString().trim().toLowerCase();
                const freelancer = (p.freelancer || '').toString().trim().toLowerCase();
                const freelancerEmail = (p.freelancerEmail || '').toString().trim().toLowerCase();

                // Project is in marketplace if explicitly open OR if no freelancer is assigned
                const isExplicitMarketplace = status === 'open marketplace' || status === 'open' || status === 'open bid' || status === 'proposed' || status === 'pending review';
                const isUnassigned = !p.freelancer || freelancer === 'unassigned' || freelancer === '' || freelancer === '--' || !freelancerEmail;
                const isNotFinished = status !== 'completed' && status !== 'resolved';

                return (isExplicitMarketplace || isUnassigned) && isNotFinished;
            });
        },

        createProject: function (data) {
            const db = this._getDB();
            
            // Clean non-colliding PRJ ID
            let maxId = 100;
            if (db.projects && db.projects.length) {
                db.projects.forEach(p => {
                    const num = parseInt(String(p.id || '').replace(/\D/g, ''), 10);
                    if (!isNaN(num) && num > maxId) maxId = num;
                });
            }
            const newId = `#PRJ-${maxId + 1}`;
            const rawBudget = Number(String(data.budget).replace(/[^0-9.]/g, '')) || 2500;

            const isAssigned = data.freelancer && 
                               data.freelancer.toString().trim().toLowerCase() !== 'unassigned' && 
                               data.freelancer.toString().trim() !== '';

            const project = {
                id: newId,
                name: data.name ? data.name.trim() : "Untitled Project",
                category: data.category || "General",
                client: data.client ? data.client.trim() : "Client Representative",
                clientCompany: data.clientCompany || (data.client ? data.client.trim() : "Enterprise Client"),
                clientEmail: data.clientEmail || "client@milestones.com",
                clientInitials: (data.client || "CL").substring(0, 2).toUpperCase(),
                freelancer: isAssigned ? data.freelancer.trim() : "Unassigned",
                freelancerEmail: isAssigned ? (data.freelancerEmail || "") : "",
                freelancerInitials: isAssigned ? data.freelancer.substring(0, 2).toUpperCase() : "--",
                budget: `$${rawBudget.toLocaleString()}`,
                budgetValue: rawBudget,
                escrow: `$${rawBudget.toLocaleString()} (100%)`,
                deadline: data.deadline || "In 30 Days",
                status: data.status || (isAssigned ? "In Progress" : "Open Marketplace"),
                description: data.description ? data.description.trim() : "Project specifications and deliverable milestones.",
                skills: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : [data.category || "Professional Deliverables"],
                milestones: Array.isArray(data.milestones) && data.milestones.length > 0 ? data.milestones : [
                    { title: "Milestone 1: Kickoff & Initial Scope", amount: `$${Math.round(rawBudget * 0.5).toLocaleString()}`, status: "Pending", done: false },
                    { title: "Milestone 2: Final Delivery & Handoff", amount: `$${Math.round(rawBudget * 0.5).toLocaleString()}`, status: "Pending", done: false }
                ]
            };

            db.projects.unshift(project);
            this._saveDB(db);
            return project;
        },

        updateProject: function (id, updates) {
            const db = this._getDB();
            const idx = db.projects.findIndex(p => p.id === id);
            if (idx === -1) return false;
            db.projects[idx] = Object.assign({}, db.projects[idx], updates);
            this._saveDB(db);
            return db.projects[idx];
        },

        deleteProject: function (id) {
            const db = this._getDB();
            const idx = db.projects.findIndex(p => p.id === id);
            if (idx === -1) return false;
            db.projects.splice(idx, 1);
            this._saveDB(db);
            return true;
        },

        /**
         * Freelancer Submits Deliverables for a Milestone
         */
        submitMilestoneWork: function (projectId, milestoneIndex) {
            const db = this._getDB();
            const project = db.projects.find(p => p.id === projectId);
            if (!project || !project.milestones[milestoneIndex]) return false;

            project.milestones[milestoneIndex].status = "Under Review";
            project.milestones[milestoneIndex].canApprove = true;
            this._saveDB(db);
            return true;
        },

        /**
         * Admin Approves a Milestone -> Releases Escrow -> Updates Balances & Transactions
         */
        approveMilestone: function (projectId, milestoneIndex) {
            const db = this._getDB();
            const project = db.projects.find(p => p.id === projectId);
            if (!project || !project.milestones[milestoneIndex]) return false;

            const milestone = project.milestones[milestoneIndex];
            milestone.done = true;
            milestone.status = "Approved";
            milestone.canApprove = false;

            // Check if all milestones done
            const allDone = project.milestones.every(m => m.done);
            if (allDone) {
                project.status = "Completed";
            } else {
                project.status = "In Progress";
            }

            // Extract numeric amount
            const numericAmount = Number(String(milestone.amount).replace(/[^0-9.]/g, '')) || 1000;

            // Create Completed Transaction Record
            const newTxId = `#TX-${900 + db.transactions.length + 1}`;
            const tx = {
                id: newTxId,
                projectId: project.id,
                project: project.name,
                party: `${project.freelancer} (Freelancer)`,
                freelancerEmail: project.freelancerEmail || "freelancer@milestones.com",
                client: project.client,
                amount: `$${numericAmount.toLocaleString()}.00`,
                amountValue: numericAmount,
                type: "Milestone Payout",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: "Completed"
            };
            db.transactions.unshift(tx);

            // Update freelancer user's balances
            const freelancerUser = db.users.find(u => 
                (u.email && u.email.toLowerCase() === (project.freelancerEmail || '').toLowerCase()) ||
                u.name === project.freelancer
            );
            if (freelancerUser) {
                freelancerUser.availableBalance = (freelancerUser.availableBalance || 0) + numericAmount;
                freelancerUser.totalEarned = (freelancerUser.totalEarned || 0) + numericAmount;
                freelancerUser.inEscrow = Math.max(0, (freelancerUser.inEscrow || 0) - numericAmount);
            }

            this._saveDB(db);
            return { project, tx };
        },

        // =====================================================================
        // PROPOSALS WORKFLOW
        // =====================================================================

        getProposals: function () {
            const db = this._getDB();
            return db.proposals || [];
        },

        createProposal: function (data) {
            const db = this._getDB();
            // Check for duplicate proposal
            const existing = db.proposals.find(p => 
                p.projectId === data.projectId && 
                p.freelancerEmail.toLowerCase() === data.freelancerEmail.toLowerCase()
            );
            if (existing) {
                return { success: false, message: "You have already submitted a proposal for this project!" };
            }

            const newId = `#PROP-${300 + db.proposals.length + 1}`;
            const proposal = {
                id: newId,
                projectId: data.projectId,
                projectTitle: data.projectTitle,
                freelancer: data.freelancer || "Ali Hassan",
                freelancerEmail: data.freelancerEmail || "freelancer@milestones.com",
                bidAmount: Number(data.bidAmount) || 2000,
                timeline: data.timeline || "2-4 weeks",
                coverLetter: data.coverLetter || "Experienced professional ready to execute deliverables.",
                status: "Pending Review",
                submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            db.proposals.unshift(proposal);
            this._saveDB(db);
            return { success: true, proposal };
        },

        approveProposal: function (proposalId) {
            const db = this._getDB();
            const proposal = db.proposals.find(p => p.id === proposalId);
            if (!proposal) return false;

            proposal.status = "Approved";

            // Assign freelancer to project
            const project = db.projects.find(pr => pr.id === proposal.projectId);
            if (project) {
                project.freelancer = proposal.freelancer;
                project.freelancerEmail = proposal.freelancerEmail;
                project.freelancerInitials = proposal.freelancer.substring(0, 2).toUpperCase();
                project.status = "In Progress";
                project.budgetValue = proposal.bidAmount;
                project.budget = `$${proposal.bidAmount.toLocaleString()}`;
                project.escrow = `$${proposal.bidAmount.toLocaleString()} (100%)`;

                // Add escrow transaction
                db.transactions.unshift({
                    id: `#TX-${900 + db.transactions.length + 1}`,
                    projectId: project.id,
                    project: project.name,
                    party: "Escrow Deposit",
                    freelancerEmail: proposal.freelancerEmail,
                    client: project.client,
                    amount: project.budget,
                    amountValue: project.budgetValue,
                    type: "Escrow Funded",
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: "Completed"
                });
            }

            this._saveDB(db);
            return true;
        },

        rejectProposal: function (proposalId) {
            const db = this._getDB();
            const proposal = db.proposals.find(p => p.id === proposalId);
            if (!proposal) return false;
            proposal.status = "Rejected";
            this._saveDB(db);
            return true;
        },

        // =====================================================================
        // TRANSACTIONS & PAYMENTS
        // =====================================================================

        getTransactions: function () {
            const db = this._getDB();
            return db.transactions || [];
        },

        requestWithdrawal: function (freelancerEmail, amount, method = 'Bank Wire') {
            const db = this._getDB();
            const numAmount = Number(amount);
            if (isNaN(numAmount) || numAmount <= 0) {
                return { success: false, message: "Please specify a positive withdrawal amount." };
            }

            const user = db.users.find(u => 
                u.email.toLowerCase() === (freelancerEmail || '').toLowerCase()
            );
            const currentBal = user ? (user.availableBalance || 2150.00) : 2150.00;

            if (numAmount > currentBal) {
                return { success: false, message: `Withdrawal exceeds available balance ($${currentBal.toFixed(2)}).` };
            }

            // Deduct balance
            if (user) {
                user.availableBalance = currentBal - numAmount;
            }

            // Create Transaction record
            const newTxId = `#TX-${900 + db.transactions.length + 1}`;
            const tx = {
                id: newTxId,
                projectId: "N/A",
                project: `Payout Withdrawal (${method})`,
                party: user ? user.name : "Freelancer Payout",
                freelancerEmail: freelancerEmail,
                client: "Milestones Escrow Vault",
                amount: `-$${numAmount.toLocaleString()}.00`,
                amountValue: numAmount,
                type: "Payout Withdrawal",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: "Completed"
            };

            db.transactions.unshift(tx);
            this._saveDB(db);
            return { success: true, tx, newBalance: user ? user.availableBalance : 0 };
        },

        // =====================================================================
        // DISPUTES & COMPLAINTS
        // =====================================================================

        getDisputes: function () {
            const db = this._getDB();
            return db.disputes || [];
        },

        resolveDispute: function (id, resolution) {
            const db = this._getDB();
            const idx = db.disputes.findIndex(d => d.id === id);
            if (idx === -1) return false;

            const dispute = db.disputes[idx];
            dispute.status = "Resolved";
            dispute.resolution = resolution;
            
            // Remove from active list
            db.disputes.splice(idx, 1);
            this._saveDB(db);
            return true;
        },

        // =====================================================================
        // DYNAMIC PLATFORM STATISTICS
        // =====================================================================

        getAdminStats: function () {
            const db = this._getDB();
            const users = db.users || [];
            const projects = db.projects || [];
            const proposals = db.proposals || [];
            const disputes = db.disputes || [];
            const transactions = db.transactions || [];

            let pendingMilestones = 0;
            let totalEscrowReserve = 0;
            projects.forEach(p => {
                if (p.budgetValue) totalEscrowReserve += p.budgetValue;
                if (p.milestones) {
                    p.milestones.forEach(m => {
                        if (m.canApprove || m.status === 'Under Review' || m.status === 'Under Client Review') {
                            pendingMilestones++;
                        }
                    });
                }
            });

            let releasedFunds = 0;
            transactions.forEach(t => {
                if (t.type === 'Milestone Payout' && t.amountValue) {
                    releasedFunds += t.amountValue;
                }
            });

            const platformFeeRevenue = Math.round(releasedFunds * 0.05);

            const isFreelancer = u => (u.role || '').toLowerCase() === 'freelancer';
            const isClient = u => (u.role || '').toLowerCase() === 'client';
            const isActive = u => (u.status || '').toLowerCase() === 'active';
            const isSuspended = u => (u.status || '').toLowerCase() === 'suspended' || (u.status || '').toLowerCase() === 'flagged';

            return {
                totalUser: users.length,
                totalFreelancer: users.filter(isFreelancer).length,
                activeFreelancer: users.filter(u => isFreelancer(u) && isActive(u)).length,
                totalClients: users.filter(isClient).length,
                suspendedUsers: users.filter(isSuspended).length,
                activeProject: projects.filter(p => p.status === 'In Progress' || p.status === 'Active').length,
                pendingApprovals: pendingMilestones + proposals.filter(pr => pr.status === 'Pending Review').length + disputes.length,
                totalEscrowReserve: totalEscrowReserve,
                releasedFunds: releasedFunds,
                platformFeeRevenue: platformFeeRevenue
            };
        },

        resetToSeedData: function () {
            this._saveDB(INITIAL_SEED_DATA);
            return true;
        }
    };

    // Expose to window
    window.MilestonesDB = MilestonesDB;

})(window);
