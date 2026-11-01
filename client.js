/**
 * =============================================================================
 * MILESTONE - CLIENT WORKSPACE CONTROLLER (client.js)
 * Implements wireframe specifications:
 * - Client/Dashboard (client_dashboard): My Projects table, status badges, tip banner
 * - Client/Post Project (client_post_project): Validation, title, requirements, budget
 * - Client/Project Details Proposal (client_details_proposal): Accept / Decline proposal
 * - Client/Project Details Milestones (client_details_milestones): Approve, reject with feedback, release simulated payments
 * - Client/Payments (client_payments): Payments Made ledger, Total paid calculation
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 0. AUTHENTICATION & ACCESS GUARD
    // =========================================================================
    let currentUser = null;
    if (window.MilestonesDB) {
        currentUser = window.MilestonesDB.requireAuth(['client', 'admin']);
    }
    if (!currentUser) {
        currentUser = {
            id: "USR-800",
            name: "Client",
            email: "client@milestones.com",
            role: "Client",
            company: "Client Representative",
            verified: true
        };
    }

    // Active state
    let currentTab = 'dashboard';
    let currentProject = null;
    let globalSearchQuery = '';

    // Helper: Safe DB Access
    function getDB() {
        return window.MilestonesDB || null;
    }

    // =========================================================================
    // 1. DOM ELEMENT REFERENCES
    // =========================================================================

    // Top Navigation & Profile
    const brandLogo = document.getElementById('brandLogo');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const globalSearchInput = document.getElementById('globalSearchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');

    // Notifications
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const clearNotifsBtn = document.getElementById('clearNotifsBtn');
    const notificationList = document.getElementById('notificationList');

    // User Profile Dropdown
    const clientProfileBtn = document.getElementById('clientProfileBtn');
    const clientDropdown = document.getElementById('clientDropdown');
    const navClientName = document.getElementById('navClientName');
    const navUserAvatar = document.getElementById('navUserAvatar');
    const menuClientName = document.getElementById('menuClientName');
    const menuClientEmail = document.getElementById('menuClientEmail');
    const menuLogoutBtn = document.getElementById('menuLogoutBtn');
    const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');

    // Tab Navigation Links
    const navTabDashboard = document.getElementById('navTabDashboard');
    const navTabPostProject = document.getElementById('navTabPostProject');
    const navTabPayments = document.getElementById('navTabPayments');
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    // Tab Views
    const tabViews = {
        'dashboard': document.getElementById('viewDashboard'),
        'post-project': document.getElementById('viewPostProject'),
        'proposal-details': document.getElementById('viewDetailsProposal'),
        'milestones-details': document.getElementById('viewDetailsMilestones'),
        'payments': document.getElementById('viewPayments')
    };

    // Dashboard View Elements
    const btnPostNewProject = document.getElementById('btnPostNewProject');
    const emptyStatePostBtn = document.getElementById('emptyStatePostBtn');
    const clientProjectsTable = document.getElementById('clientProjectsTable');
    const clientProjectsTableBody = document.getElementById('clientProjectsTableBody');
    const emptyStateProjects = document.getElementById('emptyStateProjects');
    const myProjectsCountBadge = document.getElementById('myProjectsCountBadge');

    // Post Project View Elements
    const postProjectForm = document.getElementById('postProjectForm');
    const projectTitleInput = document.getElementById('projectTitle');
    const projectRequirementsInput = document.getElementById('projectRequirements');
    const projectBudgetInput = document.getElementById('projectBudget');
    const postProjectValidation = document.getElementById('postProjectValidation');
    const btnCancelPostProject = document.getElementById('btnCancelPostProject');
    const groupProjectTitle = document.getElementById('groupProjectTitle');
    const groupProjectRequirements = document.getElementById('groupProjectRequirements');
    const groupProjectBudget = document.getElementById('groupProjectBudget');

    // Proposal View Elements
    const backFromProposalBtn = document.getElementById('backFromProposalBtn');
    const proposalProjectTitle = document.getElementById('proposalProjectTitle');
    const proposalProjectBadge = document.getElementById('proposalProjectBadge');
    const proposalProjectDesc = document.getElementById('proposalProjectDesc');
    const proposalMetaFreelancer = document.getElementById('proposalMetaFreelancer');
    const proposalMetaBudget = document.getElementById('proposalMetaBudget');
    const proposalCardTitle = document.getElementById('proposalCardTitle');
    const proposalAuthorAvatar = document.getElementById('proposalAuthorAvatar');
    const proposalMessageText = document.getElementById('proposalMessageText');
    const proposedMilestonesList = document.getElementById('proposedMilestonesList');
    const btnAcceptProposal = document.getElementById('btnAcceptProposal');
    const btnDeclineProposal = document.getElementById('btnDeclineProposal');

    // Milestones View Elements
    const backFromMilestonesBtn = document.getElementById('backFromMilestonesBtn');
    const milestonesProjectTitle = document.getElementById('milestonesProjectTitle');
    const milestonesProjectBadge = document.getElementById('milestonesProjectBadge');
    const milestonesProjectDesc = document.getElementById('milestonesProjectDesc');
    const milestonesMetaFreelancer = document.getElementById('milestonesMetaFreelancer');
    const milestonesMetaBudget = document.getElementById('milestonesMetaBudget');
    const milestonesProgressPill = document.getElementById('milestonesProgressPill');
    const clientMilestonesCardList = document.getElementById('clientMilestonesCardList');

    // Payments View Elements
    const clientPaymentsTableBody = document.getElementById('clientPaymentsTableBody');
    const emptyStatePayments = document.getElementById('emptyStatePayments');
    const totalPaidDisplay = document.getElementById('totalPaidDisplay');

    // Confirmation Modal Elements
    const actionModalBackdrop = document.getElementById('actionModalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalIconWrap = document.getElementById('modalIconWrap');
    let pendingModalAction = null;

    // Toast Container
    const toastContainer = document.getElementById('toastContainer');

    // =========================================================================
    // 2. INITIALIZATION & USER DISPLAY SETUP
    // =========================================================================

    function initUserDisplay() {
        if (!currentUser) return;
        const name = currentUser.name || "Client";
        const email = currentUser.email || "client@milestones.com";
        const initials = name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || "CL";

        if (navClientName) navClientName.textContent = name;
        if (menuClientName) menuClientName.textContent = name;
        if (menuClientEmail) menuClientEmail.textContent = email;

        const avatarElements = [navUserAvatar, document.querySelector('.profile-card-avatar')];
        avatarElements.forEach(el => {
            if (el) el.textContent = initials;
        });
    }

    // =========================================================================
    // 3. TAB NAVIGATION CONTROLLER
    // =========================================================================

    function switchTab(targetTab, updateHistory = true) {
        if (!tabViews[targetTab]) targetTab = 'dashboard';
        currentTab = targetTab;

        // Update tab views visibility
        Object.keys(tabViews).forEach(tabKey => {
            const el = tabViews[tabKey];
            if (el) {
                if (tabKey === targetTab) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            }
        });

        // Update sidebar links active class
        sidebarNavLinks.forEach(link => {
            const tabAttr = link.getAttribute('data-tab');
            if (tabAttr === targetTab) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // If mobile sidebar open, close it
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }

        // Render tab content
        if (targetTab === 'dashboard') {
            renderProjectsTable();
        } else if (targetTab === 'payments') {
            renderPaymentsTable();
        } else if (targetTab === 'post-project') {
            resetPostProjectForm();
        }

        // Push URL state
        if (updateHistory) {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', targetTab);
            if (targetTab !== 'proposal-details' && targetTab !== 'milestones-details') {
                url.searchParams.delete('project');
            }
            window.history.pushState({}, '', url.toString());
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Wire Sidebar Navigation Click Handlers
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            if (tab) switchTab(tab);
        });
    });

    if (btnPostNewProject) {
        btnPostNewProject.addEventListener('click', () => switchTab('post-project'));
    }
    if (emptyStatePostBtn) {
        emptyStatePostBtn.addEventListener('click', () => switchTab('post-project'));
    }
    if (btnCancelPostProject) {
        btnCancelPostProject.addEventListener('click', () => switchTab('dashboard'));
    }
    if (backFromProposalBtn) {
        backFromProposalBtn.addEventListener('click', () => switchTab('dashboard'));
    }
    if (backFromMilestonesBtn) {
        backFromMilestonesBtn.addEventListener('click', () => switchTab('dashboard'));
    }

    // =========================================================================
    // 4. VIEW 1: MY PROJECTS TABLE (Dashboard)
    // =========================================================================

    function renderProjectsTable() {
        const db = getDB();
        if (!db || !clientProjectsTableBody) return;

        let projects = db.getClientProjects(currentUser.email);

        // Apply global search if present
        if (globalSearchQuery.trim()) {
            const q = globalSearchQuery.trim().toLowerCase();
            projects = projects.filter(p => {
                return (p.name && p.name.toLowerCase().includes(q)) ||
                       (p.freelancer && p.freelancer.toLowerCase().includes(q)) ||
                       (p.status && p.status.toLowerCase().includes(q)) ||
                       (String(p.budget || '').toLowerCase().includes(q));
            });
        }

        // Update count badge
        if (myProjectsCountBadge) {
            myProjectsCountBadge.textContent = `${projects.length} project${projects.length === 1 ? '' : 's'}`;
        }

        // Empty state
        if (projects.length === 0) {
            clientProjectsTableBody.innerHTML = '';
            clientProjectsTable.classList.add('hidden');
            emptyStateProjects.classList.remove('hidden');
            return;
        }

        clientProjectsTable.classList.remove('hidden');
        emptyStateProjects.classList.add('hidden');

        // Render rows matching wireframe
        let html = '';
        projects.forEach(project => {
            const statusBadge = getStatusBadge(project.status);
            const paidCountText = getMilestonesPaidText(project);
            const rawBudget = Number(String(project.budget || '').replace(/[^0-9.]/g, '')) || project.budgetValue || 0;
            const formattedBudget = rawBudget > 0 ? rawBudget.toLocaleString() : (project.budget || "0");
            const freelancerText = project.freelancer && project.freelancer.trim() !== 'Unassigned' ? project.freelancer : '-';

            html += `
                <tr data-project-id="${project.id}">
                    <td class="td-project-title">
                        <strong>${escapeHTML(project.name)}</strong>
                    </td>
                    <td class="td-budget">${formattedBudget}</td>
                    <td class="td-freelancer">${escapeHTML(freelancerText)}</td>
                    <td>${statusBadge}</td>
                    <td class="td-milestones">${paidCountText}</td>
                    <td style="text-align: right;">
                        <button class="btn-action-open" data-project-id="${project.id}" title="Open Project Details">
                            Open
                        </button>
                    </td>
                </tr>
            `;
        });

        clientProjectsTableBody.innerHTML = html;

        // Wire Open button handlers
        clientProjectsTableBody.querySelectorAll('.btn-action-open').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-project-id');
                openProjectDetails(id);
            });
        });
    }

    function getMilestonesPaidText(project) {
        if (!project.milestones || project.milestones.length === 0) {
            return "0 / 0 paid";
        }
        const total = project.milestones.length;
        const paid = project.milestones.filter(m => m.status === 'Paid' || m.done).length;
        return `${paid} / ${total} paid`;
    }

    function getStatusBadge(status) {
        const s = (status || '').toString().trim().toLowerCase();
        if (s === 'active' || s === 'in progress') {
            return `<span class="badge badge-active">Active</span>`;
        } else if (s === 'proposed' || s === 'pending review') {
            return `<span class="badge badge-proposed">Proposed</span>`;
        } else if (s === 'open' || s === 'open marketplace') {
            return `<span class="badge badge-open">Open</span>`;
        } else if (s === 'completed' || s === 'resolved') {
            return `<span class="badge badge-completed">Completed</span>`;
        } else if (s === 'disputed' || s === 'rejected') {
            return `<span class="badge badge-disputed">Disputed</span>`;
        }
        return `<span class="badge badge-pending">${escapeHTML(status || 'Open')}</span>`;
    }

    // =========================================================================
    // 5. OPEN PROJECT DETAILS (Proposal or Milestones)
    // =========================================================================

    function openProjectDetails(projectId) {
        const db = getDB();
        if (!db) return;

        const project = db.getProjectById(projectId);
        if (!project) {
            showToast("Project not found", "warning");
            return;
        }

        currentProject = project;

        // Determine whether to display Proposal view or Milestones view
        const status = (project.status || '').toLowerCase();
        const hasProposal = !!project.proposal || (db.proposals && db.proposals.some(pr => pr.projectId === projectId && pr.status === 'Pending Review'));

        if (status === 'proposed' || hasProposal) {
            renderProposalView(project);
            switchTab('proposal-details');
        } else {
            renderMilestonesView(project);
            switchTab('milestones-details');
        }

        // Update URL query param
        const url = new URL(window.location.href);
        url.searchParams.set('project', projectId);
        window.history.pushState({}, '', url.toString());
    }

    // =========================================================================
    // 6. VIEW 3: PROJECT DETAILS - PROPOSAL VIEW
    // =========================================================================

    function renderProposalView(project) {
        const db = getDB();
        const rawBudget = Number(String(project.budget || '').replace(/[^0-9.]/g, '')) || project.budgetValue || 0;
        const formattedBudget = rawBudget > 0 ? rawBudget.toLocaleString() : (project.budget || "0");

        // Find attached proposal
        let proposal = project.proposal;
        if (!proposal && db && db.proposals) {
            proposal = db.proposals.find(pr => pr.projectId === project.id);
        }

        const authorName = proposal ? (proposal.freelancer || proposal.author || "Bilal Khan") : (project.freelancer || "Bilal Khan");
        const authorInitials = authorName.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || "BK";
        const messageText = proposal && proposal.coverLetter ? proposal.coverLetter : 
            "I will design the page first and share mockups for your review, then build it in HTML and CSS. I can finish within two weeks.";

        // Header
        proposalProjectTitle.textContent = project.name;
        proposalProjectBadge.textContent = "Proposed";
        proposalMetaFreelancer.textContent = authorName;
        proposalMetaBudget.textContent = formattedBudget;
        proposalProjectDesc.textContent = project.description || "Project specifications and deliverable milestones.";

        // Card
        proposalCardTitle.textContent = `Proposal from ${authorName}`;
        proposalAuthorAvatar.textContent = authorInitials;
        proposalMessageText.textContent = messageText;

        // Proposed milestones
        let milestones = [];
        if (proposal && proposal.proposedMilestones && proposal.proposedMilestones.length > 0) {
            milestones = proposal.proposedMilestones;
        } else if (project.milestones && project.milestones.length > 0) {
            milestones = project.milestones;
        } else {
            milestones = [
                { title: "Design Mockup", amount: "8,000", description: "Create the layout for the page." },
                { title: "Build Page", amount: "12,000", description: "Convert the design into HTML and CSS." }
            ];
        }

        let msHtml = '';
        milestones.forEach(m => {
            const rawAmt = Number(String(m.amount || '').replace(/[^0-9.]/g, '')) || m.amountValue || 0;
            const amtStr = rawAmt > 0 ? rawAmt.toLocaleString() : (m.amount || '0');

            msHtml += `
                <div class="proposed-milestone-item">
                    <div class="proposed-milestone-info">
                        <div class="proposed-milestone-title-row">
                            <span class="proposed-milestone-title">${escapeHTML(m.title)}</span>
                            <span class="proposed-milestone-amt">- ${amtStr}</span>
                        </div>
                        <p class="proposed-milestone-desc">${escapeHTML(m.description || '')}</p>
                    </div>
                </div>
            `;
        });
        proposedMilestonesList.innerHTML = msHtml;
    }

    // Accept Proposal Handler
    if (btnAcceptProposal) {
        btnAcceptProposal.addEventListener('click', () => {
            if (!currentProject) return;
            const db = getDB();
            if (!db) return;

            openConfirmModal({
                title: "Accept Proposal",
                message: `Are you sure you want to accept this proposal for "${currentProject.name}"? This will start the project and set milestones into motion.`,
                icon: "ph-check",
                confirmText: "Accept & Start Project",
                onConfirm: () => {
                    db.acceptClientProposal(currentProject.id);
                    currentProject = db.getProjectById(currentProject.id);
                    showToast(`Proposal accepted! "${currentProject.name}" is now Active.`, "success");
                    renderMilestonesView(currentProject);
                    switchTab('milestones-details');
                }
            });
        });
    }

    // Decline Proposal Handler
    if (btnDeclineProposal) {
        btnDeclineProposal.addEventListener('click', () => {
            if (!currentProject) return;
            const db = getDB();
            if (!db) return;

            openConfirmModal({
                title: "Decline Proposal",
                message: `Are you sure you want to decline this proposal? This will open the project again for new proposals from freelancers.`,
                icon: "ph-x",
                confirmText: "Decline Proposal",
                onConfirm: () => {
                    db.declineClientProposal(currentProject.id);
                    showToast(`Proposal declined. "${currentProject.name}" is open again for proposals.`, "warning");
                    switchTab('dashboard');
                }
            });
        });
    }

    // =========================================================================
    // 7. VIEW 4: PROJECT DETAILS - MILESTONES VIEW
    // =========================================================================

    function renderMilestonesView(project) {
        const db = getDB();
        if (!project) return;

        const rawBudget = Number(String(project.budget || '').replace(/[^0-9.]/g, '')) || project.budgetValue || 0;
        const formattedBudget = rawBudget > 0 ? rawBudget.toLocaleString() : (project.budget || "0");
        const freelancerName = project.freelancer && project.freelancer !== '-' ? project.freelancer : "Ahmed Raza";

        // Header info
        milestonesProjectTitle.textContent = project.name;
        milestonesProjectBadge.className = `badge ${getStatusBadgeClass(project.status)}`;
        milestonesProjectBadge.textContent = project.status || "Active";
        milestonesMetaFreelancer.textContent = freelancerName;
        milestonesMetaBudget.textContent = formattedBudget;
        milestonesProjectDesc.textContent = project.description || "Redesign the mobile app screens with a cleaner look and better navigation.";

        // Progress pill
        const paidText = getMilestonesPaidText(project);
        if (milestonesProgressPill) {
            milestonesProgressPill.textContent = paidText;
        }

        // Render milestone cards
        const milestones = project.milestones || [];
        if (milestones.length === 0) {
            clientMilestonesCardList.innerHTML = `
                <div class="empty-state-dashed">
                    <p class="empty-text">No milestones defined for this project yet.</p>
                </div>
            `;
            return;
        }

        let html = '';
        milestones.forEach((ms, index) => {
            const rawAmt = Number(String(ms.amount || '').replace(/[^0-9.]/g, '')) || ms.amountValue || 0;
            const amtStr = rawAmt > 0 ? rawAmt.toLocaleString() : (ms.amount || '0');
            const msStatus = (ms.status || 'Pending');

            let badgeHtml = '';
            if (msStatus === 'Paid' || ms.done) {
                badgeHtml = `<span class="badge badge-paid">Paid</span>`;
            } else if (msStatus === 'Approved') {
                badgeHtml = `<span class="badge badge-approved">Approved</span>`;
            } else if (msStatus === 'Submitted' || msStatus === 'Under Review') {
                badgeHtml = `<span class="badge badge-submitted">Submitted</span>`;
            } else if (msStatus === 'Disputed' || msStatus === 'Rejected') {
                badgeHtml = `<span class="badge badge-disputed">Disputed</span>`;
            } else {
                badgeHtml = `<span class="badge badge-pending">${escapeHTML(msStatus)}</span>`;
            }

            // Milestone description
            const desc = ms.description || "Deliverable milestone scope and acceptance criteria.";

            // Special notes / states
            let specialContentHtml = '';

            // T6: Paid / Locked Notice
            if (msStatus === 'Paid' || ms.done || ms.locked) {
                specialContentHtml += `
                    <div class="ms-notice-locked">
                        <i class="ph-bold ph-lock-key"></i>
                        <span>Paid. This milestone is locked.</span>
                    </div>
                `;
            }

            // T7: Approved -> Release payment (simulated) button
            if (msStatus === 'Approved' && !ms.done) {
                specialContentHtml += `
                    <div class="milestone-action-row">
                        <span>Milestone is approved and ready for payment.</span>
                        <button class="btn btn-primary btn-release-payment" data-ms-index="${index}">
                            <i class="ph-bold ph-currency-dollar"></i>
                            <span>Release payment (simulated)</span>
                        </button>
                    </div>
                `;
            }

            // T8 - T10: Submitted -> Freelancer's notes + Approve button + Reject with feedback input
            if (msStatus === 'Submitted' || msStatus === 'Under Review') {
                const freelancerNotes = ms.freelancerNotes || "Homepage and product pages are finished.";
                specialContentHtml += `
                    <div class="ms-notes-box">
                        <strong>Freelancer's notes:</strong> ${escapeHTML(freelancerNotes)}
                    </div>
                    <div class="milestone-action-row">
                        <button class="btn btn-success btn-approve-milestone" data-ms-index="${index}">
                            <i class="ph-bold ph-check"></i>
                            <span>Approve</span>
                        </button>
                        <div class="reject-group">
                            <input 
                                type="text" 
                                class="reject-feedback-input" 
                                id="rejectFeedbackInput_${index}" 
                                placeholder="Feedback is required to reject"
                                aria-label="Feedback is required to reject"
                            >
                            <button class="btn btn-danger btn-reject-milestone" data-ms-index="${index}">
                                <span>Reject</span>
                            </button>
                        </div>
                    </div>
                `;
            }

            // T11 - T12: Disputed / Rejected -> Feedback note + Dispute note
            if (msStatus === 'Disputed' || msStatus === 'Rejected') {
                const feedback = ms.clientFeedback || "Please fix the footer layout and resubmit.";
                const disputeNotice = ms.disputeNotice || "Freelancer disputed this rejection. Under admin review - awaiting decision.";
                specialContentHtml += `
                    <div class="ms-feedback-box">
                        <strong>Your feedback:</strong> ${escapeHTML(feedback)}
                    </div>
                    <div class="ms-notice-dispute">
                        <i class="ph-bold ph-scales"></i>
                        <span>${escapeHTML(disputeNotice)}</span>
                    </div>
                `;
            }

            html += `
                <div class="milestone-card" data-ms-index="${index}">
                    <div class="milestone-card-top">
                        <div class="milestone-title-wrap">
                            <h3 class="milestone-card-title">${escapeHTML(ms.title)}</h3>
                            <span class="milestone-card-amount">${amtStr}</span>
                        </div>
                        ${badgeHtml}
                    </div>
                    <p class="milestone-card-desc">${escapeHTML(desc)}</p>
                    ${specialContentHtml}
                </div>
            `;
        });

        clientMilestonesCardList.innerHTML = html;

        // Wire Event Handlers
        // 1. Release Payment
        clientMilestonesCardList.querySelectorAll('.btn-release-payment').forEach(btn => {
            btn.addEventListener('click', () => {
                const msIdx = parseInt(btn.getAttribute('data-ms-index'), 10);
                const ms = project.milestones[msIdx];
                const rawAmt = Number(String(ms.amount || '').replace(/[^0-9.]/g, '')) || ms.amountValue || 0;

                openConfirmModal({
                    title: "Release Simulated Payment",
                    message: `Are you sure you want to release simulated payment of $${rawAmt.toLocaleString()} for "${ms.title}" to ${project.freelancer}? No real money will be transferred.`,
                    icon: "ph-currency-dollar",
                    confirmText: "Release Payment",
                    onConfirm: () => {
                        db.releaseClientMilestonePayment(project.id, msIdx);
                        currentProject = db.getProjectById(project.id);
                        showToast(`Simulated payment of $${rawAmt.toLocaleString()} released successfully!`, "success");
                        renderMilestonesView(currentProject);
                        // Also update notifications
                        addSimulatedNotification(`Payment of $${rawAmt.toLocaleString()} released for "${ms.title}".`);
                    }
                });
            });
        });

        // 2. Approve Milestone
        clientMilestonesCardList.querySelectorAll('.btn-approve-milestone').forEach(btn => {
            btn.addEventListener('click', () => {
                const msIdx = parseInt(btn.getAttribute('data-ms-index'), 10);
                const ms = project.milestones[msIdx];

                db.approveMilestoneByClient(project.id, msIdx);
                currentProject = db.getProjectById(project.id);
                showToast(`Milestone "${ms.title}" approved! You can now release payment.`, "success");
                renderMilestonesView(currentProject);
            });
        });

        // 3. Reject Milestone with Feedback
        clientMilestonesCardList.querySelectorAll('.btn-reject-milestone').forEach(btn => {
            btn.addEventListener('click', () => {
                const msIdx = parseInt(btn.getAttribute('data-ms-index'), 10);
                const feedbackInput = document.getElementById(`rejectFeedbackInput_${msIdx}`);
                const feedbackVal = feedbackInput ? feedbackInput.value.trim() : "";

                if (!feedbackVal) {
                    showToast("Feedback is required to reject this milestone.", "warning");
                    if (feedbackInput) {
                        feedbackInput.focus();
                        feedbackInput.style.borderColor = "#ef4444";
                    }
                    return;
                }

                db.rejectMilestoneByClient(project.id, msIdx, feedbackVal);
                currentProject = db.getProjectById(project.id);
                showToast(`Milestone rejected and sent to dispute review with your feedback.`, "danger");
                renderMilestonesView(currentProject);
            });
        });
    }

    function getStatusBadgeClass(status) {
        const s = (status || '').toString().trim().toLowerCase();
        if (s === 'active' || s === 'in progress') return 'badge-active';
        if (s === 'proposed' || s === 'pending review') return 'badge-proposed';
        if (s === 'open' || s === 'open marketplace') return 'badge-open';
        if (s === 'completed' || s === 'resolved') return 'badge-completed';
        if (s === 'disputed' || s === 'rejected') return 'badge-disputed';
        return 'badge-pending';
    }

    // =========================================================================
    // 8. VIEW 2: POST A PROJECT (Form & Validation)
    // =========================================================================

    function resetPostProjectForm() {
        if (postProjectForm) postProjectForm.reset();
        if (postProjectValidation) postProjectValidation.classList.add('hidden');
        [groupProjectTitle, groupProjectRequirements, groupProjectBudget].forEach(group => {
            if (group) group.classList.remove('has-error');
        });
    }

    if (postProjectForm) {
        postProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const titleVal = projectTitleInput.value.trim();
            const requirementsVal = projectRequirementsInput.value.trim();
            const rawBudgetStr = projectBudgetInput.value.trim().replace(/[^0-9.]/g, '');
            const budgetVal = Number(rawBudgetStr);

            let hasErrors = false;

            // Validate Title
            if (!titleVal) {
                groupProjectTitle.classList.add('has-error');
                hasErrors = true;
            } else {
                groupProjectTitle.classList.remove('has-error');
            }

            // Validate Requirements
            if (!requirementsVal) {
                groupProjectRequirements.classList.add('has-error');
                hasErrors = true;
            } else {
                groupProjectRequirements.classList.remove('has-error');
            }

            // Validate Budget
            if (isNaN(budgetVal) || budgetVal <= 0) {
                groupProjectBudget.classList.add('has-error');
                hasErrors = true;
            } else {
                groupProjectBudget.classList.remove('has-error');
            }

            // T5: Show Validation Banner if invalid
            if (hasErrors) {
                if (postProjectValidation) postProjectValidation.classList.remove('hidden');
                showToast("Please fill all required fields properly.", "warning");
                return;
            }

            if (postProjectValidation) postProjectValidation.classList.add('hidden');

            const db = getDB();
            if (!db) return;

            // Save new project
            const newProj = db.postClientProject({
                title: titleVal,
                requirements: requirementsVal,
                budget: budgetVal
            }, currentUser);

            showToast(`Project "${newProj.name}" posted successfully! Freelancers can now view it.`, "success");
            resetPostProjectForm();
            switchTab('dashboard');
        });
    }

    // Real-time error clear on input
    [projectTitleInput, projectRequirementsInput, projectBudgetInput].forEach(inp => {
        if (inp) {
            inp.addEventListener('input', () => {
                const group = inp.closest('.form-group');
                if (group) group.classList.remove('has-error');
                if (postProjectValidation) postProjectValidation.classList.add('hidden');
            });
        }
    });

    // =========================================================================
    // 9. VIEW 5: PAYMENTS MADE LEDGER (Table & Total Calculation)
    // =========================================================================

    function renderPaymentsTable() {
        const db = getDB();
        if (!db || !clientPaymentsTableBody) return;

        let payments = db.getClientPayments(currentUser.email);

        // Apply global search if present
        if (globalSearchQuery.trim()) {
            const q = globalSearchQuery.trim().toLowerCase();
            payments = payments.filter(p => {
                return (p.project && p.project.toLowerCase().includes(q)) ||
                       (p.milestone && p.milestone.toLowerCase().includes(q)) ||
                       ((p.party || p.to || p.freelancer) && (p.party || p.to || p.freelancer).toLowerCase().includes(q)) ||
                       (String(p.amount || '').toLowerCase().includes(q)) ||
                       (String(p.date || '').toLowerCase().includes(q));
            });
        }

        // Empty state
        if (payments.length === 0) {
            clientPaymentsTableBody.innerHTML = '';
            document.getElementById('paymentsTable').classList.add('hidden');
            emptyStatePayments.classList.remove('hidden');
            if (totalPaidDisplay) totalPaidDisplay.textContent = "$0";
            return;
        }

        document.getElementById('paymentsTable').classList.remove('hidden');
        emptyStatePayments.classList.add('hidden');

        let totalAmount = 0;
        let html = '';

        payments.forEach(tx => {
            const rawAmt = Number(String(tx.amount || '').replace(/[^0-9.]/g, '')) || tx.amountValue || 0;
            totalAmount += rawAmt;
            const amtStr = rawAmt.toLocaleString();
            const toParty = tx.party || tx.to || tx.freelancer || "Ahmed Raza";
            const dateStr = tx.date || "2026-10-20 14:30";

            html += `
                <tr>
                    <td style="color: var(--text-muted); font-family: monospace; font-size: 0.85rem;">${escapeHTML(dateStr)}</td>
                    <td style="font-weight: 600; color: var(--text-primary);">${escapeHTML(tx.project || "App Redesign")}</td>
                    <td>${escapeHTML(tx.milestone || "Project Setup")}</td>
                    <td>${escapeHTML(toParty)}</td>
                    <td style="text-align: right; font-weight: 700; color: #34d399;">${amtStr}</td>
                </tr>
            `;
        });

        clientPaymentsTableBody.innerHTML = html;

        // T8: Update Total paid summary
        if (totalPaidDisplay) {
            totalPaidDisplay.textContent = `$${totalAmount.toLocaleString()}`;
        }
    }

    // =========================================================================
    // 10. GLOBAL SEARCH BOX FILTERING
    // =========================================================================

    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', () => {
            globalSearchQuery = globalSearchInput.value;
            if (searchClearBtn) {
                if (globalSearchQuery.length > 0) {
                    searchClearBtn.classList.remove('hidden');
                } else {
                    searchClearBtn.classList.add('hidden');
                }
            }

            if (currentTab === 'dashboard') {
                renderProjectsTable();
            } else if (currentTab === 'payments') {
                renderPaymentsTable();
            }
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (globalSearchInput) globalSearchInput.value = '';
            globalSearchQuery = '';
            searchClearBtn.classList.add('hidden');
            if (currentTab === 'dashboard') renderProjectsTable();
            if (currentTab === 'payments') renderPaymentsTable();
        });
    }

    // =========================================================================
    // 11. DROPDOWNS & MOBILE SIDEBAR
    // =========================================================================

    // Profile Dropdown Toggle
    if (clientProfileBtn && clientDropdown) {
        clientProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !clientDropdown.classList.contains('hidden');
            closeAllDropdowns();
            if (!isOpen) {
                clientDropdown.classList.remove('hidden');
                clientProfileBtn.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // Notifications Dropdown Toggle
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !notificationDropdown.classList.contains('hidden');
            closeAllDropdowns();
            if (!isOpen) {
                notificationDropdown.classList.remove('hidden');
                notificationBtn.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // Mark notifications read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            if (notificationBadge) notificationBadge.classList.add('hidden');
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => item.classList.remove('unread'));
            const unreadPill = document.getElementById('unreadPill');
            if (unreadPill) unreadPill.textContent = '0 new';
            showToast("All notifications marked as read.", "success");
        });
    }

    // Clear notifications
    if (clearNotifsBtn) {
        clearNotifsBtn.addEventListener('click', () => {
            if (notificationList) {
                notificationList.innerHTML = `<li style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No new notifications.</li>`;
            }
            if (notificationBadge) notificationBadge.classList.add('hidden');
            const unreadPill = document.getElementById('unreadPill');
            if (unreadPill) unreadPill.textContent = '0';
        });
    }

    function addSimulatedNotification(text) {
        if (!notificationList) return;
        const li = document.createElement('li');
        li.className = 'notification-item unread';
        li.innerHTML = `
            <div class="notif-icon success">
                <i class="ph-bold ph-check-circle"></i>
            </div>
            <div class="notif-content">
                <p class="notif-text">${escapeHTML(text)}</p>
                <span class="notif-time">Just now</span>
            </div>
            <span class="unread-dot"></span>
        `;
        notificationList.prepend(li);
        if (notificationBadge) {
            notificationBadge.classList.remove('hidden');
            const cur = parseInt(notificationBadge.textContent, 10) || 0;
            notificationBadge.textContent = cur + 1;
        }
    }

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
        closeAllDropdowns();
    });

    function closeAllDropdowns() {
        if (clientDropdown) clientDropdown.classList.add('hidden');
        if (notificationDropdown) notificationDropdown.classList.add('hidden');
        if (clientProfileBtn) clientProfileBtn.setAttribute('aria-expanded', 'false');
        if (notificationBtn) notificationBtn.setAttribute('aria-expanded', 'false');
    }

    // Mobile Sidebar Toggle
    if (mobileSidebarToggle && sidebar) {
        mobileSidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            if (sidebar) sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        });
    }

    // =========================================================================
    // 12. LOGOUT HANDLERS
    // =========================================================================

    function handleLogout() {
        openConfirmModal({
            title: "Sign Out",
            message: "Are you sure you want to sign out of your client account?",
            icon: "ph-sign-out",
            confirmText: "Sign Out",
            onConfirm: () => {
                const db = getDB();
                if (db) {
                    db.logout();
                } else {
                    sessionStorage.clear();
                    window.location.href = 'index.html';
                }
            }
        });
    }

    if (menuLogoutBtn) menuLogoutBtn.addEventListener('click', handleLogout);
    if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleLogout);

    // =========================================================================
    // 13. CONFIRMATION MODAL HELPER
    // =========================================================================

    function openConfirmModal(config) {
        modalTitle.textContent = config.title || "Confirm Action";
        modalMessage.textContent = config.message || "Are you sure?";
        modalConfirmBtn.textContent = config.confirmText || "Confirm";

        if (modalIconWrap && config.icon) {
            modalIconWrap.innerHTML = `<i class="ph-bold ${config.icon}"></i>`;
        }

        pendingModalAction = config.onConfirm || null;
        actionModalBackdrop.classList.remove('hidden');
    }

    function closeConfirmModal() {
        actionModalBackdrop.classList.add('hidden');
        pendingModalAction = null;
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeConfirmModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeConfirmModal);
    if (actionModalBackdrop) {
        actionModalBackdrop.addEventListener('click', (e) => {
            if (e.target === actionModalBackdrop) closeConfirmModal();
        });
    }
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            if (typeof pendingModalAction === 'function') {
                pendingModalAction();
            }
            closeConfirmModal();
        });
    }

    // =========================================================================
    // 14. TOAST NOTIFICATIONS
    // =========================================================================

    function showToast(message, type = 'success') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconClass = 'ph-check-circle';
        if (type === 'warning') iconClass = 'ph-warning-circle';
        if (type === 'danger') iconClass = 'ph-x-circle';

        toast.innerHTML = `
            <i class="ph-bold ${iconClass}"></i>
            <span>${escapeHTML(message)}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.2s ease-out';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 250);
        }, 3200);
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // =========================================================================
    // 15. URL ROUTING & CROSS-TAB SYNC
    // =========================================================================

    function checkInitialUrl() {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        const projId = params.get('project');

        if (projId) {
            openProjectDetails(projId);
        } else if (tab) {
            switchTab(tab, false);
        } else {
            switchTab('dashboard', false);
        }
    }

    window.addEventListener('popstate', () => {
        checkInitialUrl();
    });

    // Cross-tab storage sync
    window.addEventListener('storage', (e) => {
        if (e.key === 'milestones_platform_db_v2' || e.key === 'milestones_active_session_v2') {
            if (currentTab === 'dashboard') renderProjectsTable();
            if (currentTab === 'payments') renderPaymentsTable();
            if (currentProject) {
                const db = getDB();
                if (db) {
                    const fresh = db.getProjectById(currentProject.id);
                    if (fresh) {
                        currentProject = fresh;
                        if (currentTab === 'proposal-details') renderProposalView(fresh);
                        if (currentTab === 'milestones-details') renderMilestonesView(fresh);
                    }
                }
            }
        }
    });

    // Run Startup
    initUserDisplay();
    checkInitialUrl();

});

