/**
 * =============================================================================
 * MILESTONES ADMIN DASHBOARD (DARK THEME) - JAVASCRIPT CONTROLLER
 * Full administrative features: dynamic DB stats, recents table, project modal,
 * create project modal, edit user modal, proposals approval, escrow arbitration,
 * global search, notifications, tabs, and authentication guard.
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 0. AUTHENTICATION & ACCESS GUARD
    // =========================================================================
    if (window.MilestonesDB) {
        MilestonesDB.requireAuth(['admin']);
    }

    // Active Selected Project (for Modal)
    let currentModalProject = null;

    // Filter states
    let activeProjectFilter = 'all';
    let searchQueryFilter = '';

    // =========================================================================
    // 1. DOM ELEMENT REFERENCES
    // =========================================================================

    // Top Navigation & Sidebar Controls
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    const floatingSidebarTab = document.getElementById('floatingSidebarTab');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const globalSearchInput = document.getElementById('globalSearchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    const searchResultsDropdown = document.getElementById('searchResultsDropdown');
    const searchResultsList = document.getElementById('searchResultsList');
    const resultsCount = document.getElementById('resultsCount');

    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const unreadPill = document.getElementById('unreadPill');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const viewAllNotifsBtn = document.getElementById('viewAllNotifsBtn');

    const adminProfileBtn = document.getElementById('adminProfileBtn');
    const adminDropdown = document.getElementById('adminDropdown');
    const navLogoutBtn = document.getElementById('navLogoutBtn');

    // Sidebar Menu Items
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link:not(.logout-btn)');
    const menuLogout = document.getElementById('menuLogout');
    const disputeCounter = document.getElementById('disputeCounter');

    // Tab Panels
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Dashboard Statistics Elements
    const statTotalUser = document.getElementById('statTotalUser');
    const statActiveFreelancer = document.getElementById('statActiveFreelancer');
    const statTotalFreelancer = document.getElementById('statTotalFreelancer');
    const statActiveProject = document.getElementById('statActiveProject');
    const statPendingApprovals = document.getElementById('statPendingApprovals');
    const statTotalClients = document.getElementById('statTotalClients');
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    const quickNewProjectBtn = document.getElementById('quickNewProjectBtn');

    // Mini Stats Bar in User Management
    const miniTotalUsers = document.getElementById('miniTotalUsers');
    const miniFreelancers = document.getElementById('miniFreelancers');
    const miniClients = document.getElementById('miniClients');
    const miniSuspended = document.getElementById('miniSuspended');
    const totalUsersCountBadge = document.getElementById('totalUsersCountBadge');
    const userCounter = document.getElementById('userCounter');

    // Recents Table Elements
    const recentsTableBody = document.getElementById('recentsTableBody');
    const recentsSearchInput = document.getElementById('recentsSearchInput');
    const projectFilterPills = document.querySelectorAll('#projectFilterPills .filter-pill');
    const recentsTotalBadge = document.getElementById('recentsTotalBadge');
    const tableEmptyState = document.getElementById('tableEmptyState');
    const paginationInfo = document.getElementById('paginationInfo');
    const resetFilterBtn = document.getElementById('resetFilterBtn');

    // Other Tabs Bodies
    const usersTableBody = document.getElementById('usersTableBody');
    const allProjectsTableBody = document.getElementById('allProjectsTableBody');
    const adminProposalsTableBody = document.getElementById('adminProposalsTableBody');
    const proposalsCountBadge = document.getElementById('proposalsCountBadge');
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    const disputesContainer = document.getElementById('disputesContainer');

    // Project Details Modal Elements
    const projectModalBackdrop = document.getElementById('projectModalBackdrop');
    const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
    const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');
    const modalApproveMilestoneBtn = document.getElementById('modalApproveMilestoneBtn');
    const modalDeleteProjectBtn = document.getElementById('modalDeleteProjectBtn');
    const modalProjectId = document.getElementById('modalProjectId');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalStatusBadge = document.getElementById('modalStatusBadge');
    const modalBudget = document.getElementById('modalBudget');
    const modalEscrow = document.getElementById('modalEscrow');
    const modalDeadline = document.getElementById('modalDeadline');
    const modalClientName = document.getElementById('modalClientName');
    const modalClientCompany = document.getElementById('modalClientCompany');
    const modalClientEmail = document.getElementById('modalClientEmail');
    const modalClientInitials = document.getElementById('modalClientInitials');
    const modalFreelancerName = document.getElementById('modalFreelancerName');
    const modalFreelancerTitle = document.getElementById('modalFreelancerTitle');
    const modalFreelancerEmail = document.getElementById('modalFreelancerEmail');
    const modalFreelancerInitials = document.getElementById('modalFreelancerInitials');
    const modalDescription = document.getElementById('modalDescription');
    const modalMilestoneCount = document.getElementById('modalMilestoneCount');
    const modalMilestonesList = document.getElementById('modalMilestonesList');

    // Create Project Modal Elements
    const createProjectModalBackdrop = document.getElementById('createProjectModalBackdrop');
    const closeCreateProjectModalBtn = document.getElementById('closeCreateProjectModalBtn');
    const cancelCreateProjectBtn = document.getElementById('cancelCreateProjectBtn');
    const createProjectForm = document.getElementById('createProjectForm');
    const newProjectFreelancer = document.getElementById('newProjectFreelancer');
    const createProjectFromTabBtn = document.getElementById('createProjectFromTabBtn');

    // Add User Modal Elements
    const userModalBackdrop = document.getElementById('userModalBackdrop');
    const addNewUserBtn = document.getElementById('addNewUserBtn');
    const closeUserModalBtn = document.getElementById('closeUserModalBtn');
    const cancelAddUserBtn = document.getElementById('cancelAddUserBtn');
    const addUserForm = document.getElementById('addUserForm');

    // Edit User Modal Elements
    const editUserModalBackdrop = document.getElementById('editUserModalBackdrop');
    const closeEditUserModalBtn = document.getElementById('closeEditUserModalBtn');
    const cancelEditUserBtn = document.getElementById('cancelEditUserBtn');
    const editUserForm = document.getElementById('editUserForm');
    const deleteUserFromEditBtn = document.getElementById('deleteUserFromEditBtn');

    // Dispute Modal Elements
    const disputeModalBackdrop = document.getElementById('disputeModalBackdrop');
    const closeDisputeModalBtn = document.getElementById('closeDisputeModalBtn');
    const cancelDisputeActionBtn = document.getElementById('cancelDisputeActionBtn');
    const refundClientBtn = document.getElementById('refundClientBtn');
    const releaseFreelancerBtn = document.getElementById('releaseFreelancerBtn');
    const disputeModalBody = document.getElementById('disputeModalBody');
    const disputeCaseId = document.getElementById('disputeCaseId');

    // Logout Modal Elements
    const logoutModalBackdrop = document.getElementById('logoutModalBackdrop');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    // Toast Container
    const toastContainer = document.getElementById('toastContainer');

    // Helper: Safe access to MilestonesDB
    function getDB() {
        return window.MilestonesDB || null;
    }

    // =========================================================================
    // 2. STATS INITIALIZATION & DYNAMIC RENDERING FROM DATABASE
    // =========================================================================

    function renderDashboardStats() {
        const db = getDB();
        if (!db) return;

        const stats = db.getAdminStats();
        if (statTotalUser) statTotalUser.textContent = stats.totalUser.toLocaleString();
        if (statActiveFreelancer) statActiveFreelancer.textContent = stats.activeFreelancer.toLocaleString();
        if (statTotalFreelancer) statTotalFreelancer.textContent = stats.totalFreelancer.toLocaleString();
        if (statActiveProject) statActiveProject.textContent = stats.activeProject.toLocaleString();
        if (statPendingApprovals) statPendingApprovals.textContent = stats.pendingApprovals.toLocaleString();
        if (statTotalClients) statTotalClients.textContent = stats.totalClients.toLocaleString();

        const disputes = db.getDisputes();
        if (disputeCounter) disputeCounter.textContent = disputes.length;
        if (userCounter) userCounter.textContent = stats.totalUser;

        // Mini Stats Bar in User Management
        if (miniTotalUsers) miniTotalUsers.textContent = stats.totalUser.toLocaleString();
        if (miniFreelancers) miniFreelancers.textContent = stats.totalFreelancer.toLocaleString();
        if (miniClients) miniClients.textContent = stats.totalClients.toLocaleString();
        if (miniSuspended) miniSuspended.textContent = (stats.suspendedUsers || 0).toLocaleString();
        if (totalUsersCountBadge) totalUsersCountBadge.textContent = `${stats.totalUser} Accounts`;
    }

    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', () => {
            renderDashboardStats();
            renderRecentsTable();
            renderAllProjectsTable();
            renderAdminProposals();
            renderUsersTable();
            renderTransactionsTable();
            renderDisputes();
            showToast("Platform telemetry refreshed from database.", "info");
        });
    }

    // =========================================================================
    // 3. RECENT PROJECTS TABLE RENDERING
    // =========================================================================

    function getStatusBadge(status) {
        switch (status) {
            case 'In Progress':
            case 'Active':
                return `<span class="badge badge-in-progress"><span class="badge-dot"></span>In Progress</span>`;
            case 'Completed':
                return `<span class="badge badge-completed"><span class="badge-dot"></span>Completed</span>`;
            case 'Pending Approval':
            case 'Proposed':
                return `<span class="badge badge-pending"><span class="badge-dot"></span>Pending</span>`;
            case 'Under Review':
            case 'In Review':
                return `<span class="badge badge-review"><span class="badge-dot"></span>In Review</span>`;
            case 'Open Marketplace':
                return `<span class="badge badge-pending"><span class="badge-dot"></span>Open Bid</span>`;
            default:
                return `<span class="badge badge-in-progress">${escapeHtml(status)}</span>`;
        }
    }

    function renderRecentsTable() {
        if (!recentsTableBody) return;
        const db = getDB();
        const allProjects = db ? db.getProjects() : [];

        const filteredProjects = allProjects.filter(proj => {
            const matchesFilter = (activeProjectFilter === 'all') || (proj.status === activeProjectFilter);
            const matchesSearch = searchQueryFilter === '' || 
                proj.id.toLowerCase().includes(searchQueryFilter.toLowerCase()) ||
                proj.name.toLowerCase().includes(searchQueryFilter.toLowerCase()) ||
                proj.client.toLowerCase().includes(searchQueryFilter.toLowerCase()) ||
                (proj.freelancer && proj.freelancer.toLowerCase().includes(searchQueryFilter.toLowerCase()));
            return matchesFilter && matchesSearch;
        });

        if (recentsTotalBadge) {
            recentsTotalBadge.textContent = `Showing ${filteredProjects.length} Projects`;
        }
        if (paginationInfo) {
            paginationInfo.textContent = `Showing 1 to ${filteredProjects.length} of ${allProjects.length} projects`;
        }

        if (filteredProjects.length === 0) {
            recentsTableBody.innerHTML = '';
            if (tableEmptyState) tableEmptyState.classList.remove('hidden');
            return;
        } else {
            if (tableEmptyState) tableEmptyState.classList.add('hidden');
        }

        recentsTableBody.innerHTML = filteredProjects.map(proj => `
            <tr data-project-id="${proj.id}">
                <td class="project-id-cell">${proj.id}</td>
                <td class="project-name-cell"><strong>${escapeHtml(proj.name)}</strong></td>
                <td class="parties-cell">
                    <div class="party-line">
                        <span class="party-prefix">C:</span>
                        <span class="party-client-name">${escapeHtml(proj.client)}</span>
                    </div>
                    <div class="party-line">
                        <span class="party-prefix">F:</span>
                        <span class="party-freelancer-name">${escapeHtml(proj.freelancer || 'Unassigned')}</span>
                    </div>
                </td>
                <td class="budget-cell">${proj.budget}</td>
                <td class="status-cell">${getStatusBadge(proj.status)}</td>
                <td style="text-align: center;">
                    <button class="btn-view-action" data-view-id="${proj.id}" aria-label="View project details for ${proj.id}">
                        <i class="ph ph-eye"></i>
                        <span>View</span>
                    </button>
                </td>
            </tr>
        `).join('');

        const viewButtons = recentsTableBody.querySelectorAll('.btn-view-action');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projId = btn.getAttribute('data-view-id');
                openProjectModal(projId);
            });
        });

        const rows = recentsTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const projId = row.getAttribute('data-project-id');
                if (projId) openProjectModal(projId);
            });
        });
    }

    projectFilterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            projectFilterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeProjectFilter = pill.getAttribute('data-filter');
            renderRecentsTable();
        });
    });

    if (recentsSearchInput) {
        recentsSearchInput.addEventListener('input', (e) => {
            searchQueryFilter = e.target.value.trim();
            renderRecentsTable();
        });
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            activeProjectFilter = 'all';
            searchQueryFilter = '';
            if (recentsSearchInput) recentsSearchInput.value = '';
            projectFilterPills.forEach(p => {
                if (p.getAttribute('data-filter') === 'all') p.classList.add('active');
                else p.classList.remove('active');
            });
            renderRecentsTable();
        });
    }

    // =========================================================================
    // 4. PROJECT DETAILS MODAL & MILESTONE ARBITRATION
    // =========================================================================

    function openProjectModal(projectId) {
        const db = getDB();
        const project = db ? db.getProjectById(projectId) : null;
        if (!project) return;

        currentModalProject = project;

        modalProjectId.textContent = project.id;
        modalProjectTitle.textContent = project.name;
        modalStatusBadge.innerHTML = getStatusBadge(project.status);
        modalBudget.textContent = project.budget;
        modalEscrow.textContent = project.escrow || `${project.budget} (100%)`;
        modalDeadline.textContent = project.deadline || "Within 30 Days";

        modalClientName.textContent = project.client;
        modalClientCompany.textContent = project.clientCompany || "Enterprise Client";
        modalClientEmail.textContent = project.clientEmail || "client@milestones.com";
        modalClientInitials.textContent = project.clientInitials || (project.client ? project.client.substring(0, 2).toUpperCase() : "CL");

        modalFreelancerName.textContent = project.freelancer || "Unassigned";
        modalFreelancerTitle.textContent = project.freelancerTitle || "Platform Freelancer";
        modalFreelancerEmail.textContent = project.freelancerEmail || "freelancer@milestones.com";
        modalFreelancerInitials.textContent = project.freelancerInitials || (project.freelancer ? project.freelancer.substring(0, 2).toUpperCase() : "--");

        modalDescription.textContent = project.description || "Detailed project specifications and deliverables roadmap.";
        modalMilestoneCount.textContent = `${(project.milestones || []).length} Milestones`;

        modalMilestonesList.innerHTML = (project.milestones || []).map((m, idx) => `
            <div class="milestone-item">
                <div class="milestone-item-info">
                    <span class="milestone-number">${idx + 1}</span>
                    <div>
                        <div class="milestone-title-text">${escapeHtml(m.title)}</div>
                        <div class="milestone-amount-text">Escrow: ${m.amount}</div>
                    </div>
                </div>
                <div>
                    ${m.done 
                        ? '<span class="badge badge-completed"><i class="ph ph-check-circle"></i> Approved</span>' 
                        : (m.canApprove || m.status === 'Under Review' || m.status === 'Under Client Review'
                            ? `<button class="btn btn-primary btn-sm approve-milestone-single" data-milestone-index="${idx}">Approve (${m.amount})</button>` 
                            : '<span class="badge badge-pending">Pending</span>')
                    }
                </div>
            </div>
        `).join('');

        const approveBtns = modalMilestonesList.querySelectorAll('.approve-milestone-single');
        approveBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const mIdx = parseInt(btn.getAttribute('data-milestone-index'), 10);
                executeApproveMilestone(project.id, mIdx);
            });
        });

        const hasPendingApproval = (project.milestones || []).some(m => (m.canApprove || m.status === 'Under Review') && !m.done);
        if (hasPendingApproval) {
            modalApproveMilestoneBtn.disabled = false;
            modalApproveMilestoneBtn.innerHTML = `<i class="ph ph-check"></i><span>Approve Current Milestone</span>`;
        } else {
            modalApproveMilestoneBtn.disabled = true;
            modalApproveMilestoneBtn.innerHTML = `<i class="ph ph-check-circle"></i><span>All Milestones Approved</span>`;
        }

        projectModalBackdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function executeApproveMilestone(projectId, milestoneIndex) {
        const db = getDB();
        if (!db) return;

        const res = db.approveMilestone(projectId, milestoneIndex);
        if (res) {
            renderDashboardStats();
            renderRecentsTable();
            renderAllProjectsTable();
            renderTransactionsTable();
            openProjectModal(projectId);
            showToast(`Milestone approved for ${projectId}. Escrow funds released to ${res.project.freelancer}!`, "success");
        }
    }

    if (modalApproveMilestoneBtn) {
        modalApproveMilestoneBtn.addEventListener('click', () => {
            if (!currentModalProject) return;
            const targetIndex = (currentModalProject.milestones || []).findIndex(m => (m.canApprove || m.status === 'Under Review') && !m.done);
            if (targetIndex !== -1) {
                executeApproveMilestone(currentModalProject.id, targetIndex);
            }
        });
    }

    if (modalDeleteProjectBtn) {
        modalDeleteProjectBtn.addEventListener('click', () => {
            if (!currentModalProject) return;
            if (confirm(`Are you sure you want to delete project ${currentModalProject.name} (${currentModalProject.id})?`)) {
                const db = getDB();
                if (db) {
                    db.deleteProject(currentModalProject.id);
                    renderDashboardStats();
                    renderRecentsTable();
                    renderAllProjectsTable();
                    closeProjectModal();
                    showToast(`Project ${currentModalProject.id} deleted from platform.`, "warning");
                }
            }
        });
    }

    function closeProjectModal() {
        projectModalBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
        currentModalProject = null;
    }

    if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
    if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeProjectModal);
    if (projectModalBackdrop) {
        projectModalBackdrop.addEventListener('click', (e) => {
            if (e.target === projectModalBackdrop) closeProjectModal();
        });
    }

    // =========================================================================
    // 5. CREATE NEW PROJECT MODAL
    // =========================================================================

    function openCreateProjectModal() {
        const db = getDB();
        if (newProjectFreelancer && db) {
            const freelancers = db.getUsers().filter(u => (u.role || '').toLowerCase() === 'freelancer');
            newProjectFreelancer.innerHTML = `
                <option value="">-- Open for Freelancer Bidding in Marketplace --</option>
                ${freelancers.map(f => `<option value="${f.name}">${f.name} (${f.email})${f.verified ? ' [Verified]' : ''}</option>`).join('')}
            `;
        }
        if (createProjectForm) createProjectForm.reset();
        createProjectModalBackdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeCreateProjectModal() {
        createProjectModalBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
        if (createProjectForm) createProjectForm.reset();
    }

    if (quickNewProjectBtn) quickNewProjectBtn.addEventListener('click', openCreateProjectModal);
    if (createProjectFromTabBtn) createProjectFromTabBtn.addEventListener('click', openCreateProjectModal);
    if (closeCreateProjectModalBtn) closeCreateProjectModalBtn.addEventListener('click', closeCreateProjectModal);
    if (cancelCreateProjectBtn) cancelCreateProjectBtn.addEventListener('click', closeCreateProjectModal);
    if (createProjectModalBackdrop) {
        createProjectModalBackdrop.addEventListener('click', (e) => {
            if (e.target === createProjectModalBackdrop) closeCreateProjectModal();
        });
    }

    if (createProjectForm) {
        createProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('newProjectTitle').value.trim();
            const category = document.getElementById('newProjectCategory').value;
            const budget = parseFloat(document.getElementById('newProjectBudget').value);
            const client = document.getElementById('newProjectClient').value.trim();
            const deadline = document.getElementById('newProjectDeadline').value;
            const freelancer = document.getElementById('newProjectFreelancer').value;
            const description = document.getElementById('newProjectDescription').value.trim();

            if (!title || !client || isNaN(budget) || budget <= 0 || !deadline) {
                alert("Please fill all required project fields with a valid budget.");
                return;
            }

            const db = getDB();
            if (db) {
                const newProject = db.createProject({
                    name: title,
                    category: category,
                    budget: budget,
                    client: client,
                    deadline: deadline,
                    freelancer: freelancer || "Unassigned",
                    description: description
                });

                renderDashboardStats();
                renderRecentsTable();
                renderAllProjectsTable();
                closeCreateProjectModal();
                showToast(`Project "${title}" (${newProject.id}) published successfully!`, "success");
            }
        });
    }

    // =========================================================================
    // 6. ALL PROJECTS TAB RENDERING
    // =========================================================================

    function renderAllProjectsTable(filter = 'all') {
        if (!allProjectsTableBody) return;
        const db = getDB();
        const allProjects = db ? db.getProjects() : [];

        const filtered = allProjects.filter(p => (filter === 'all') || (p.status === filter));

        allProjectsTableBody.innerHTML = filtered.map(p => {
            const milestones = p.milestones || [];
            const completedCount = milestones.filter(m => m.done).length;
            const totalCount = milestones.length || 1;
            const percentage = Math.round((completedCount / totalCount) * 100);

            return `
                <tr>
                    <td class="project-id-cell">${p.id}</td>
                    <td><strong>${escapeHtml(p.name)}</strong></td>
                    <td>${escapeHtml(p.client)}</td>
                    <td>${escapeHtml(p.freelancer || 'Unassigned')}</td>
                    <td>
                        <div style="font-size: 0.8rem; font-weight: 600;">${percentage}% (${completedCount}/${totalCount})</div>
                        <div class="progress-bar-wrap">
                            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                        </div>
                    </td>
                    <td class="budget-cell">${p.budget}</td>
                    <td>${getStatusBadge(p.status)}</td>
                    <td style="text-align: center; white-space: nowrap;">
                        <button class="btn-view-action" onclick="window.viewProjectById('${p.id}')">
                            <i class="ph ph-eye"></i>
                            <span>Details</span>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="window.deleteProjectById('${p.id}')" style="margin-left: 0.35rem;" title="Delete project">
                            <i class="ph ph-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.viewProjectById = function(projId) {
        openProjectModal(projId);
    };

    window.deleteProjectById = function(projId) {
        if (confirm(`Delete project ${projId} permanently?`)) {
            const db = getDB();
            if (db) {
                db.deleteProject(projId);
                renderDashboardStats();
                renderRecentsTable();
                renderAllProjectsTable();
                showToast(`Project ${projId} deleted.`, "warning");
            }
        }
    };

    const allProjectsFilters = document.querySelectorAll('#allProjectsFilter .filter-pill');
    allProjectsFilters.forEach(pill => {
        pill.addEventListener('click', () => {
            allProjectsFilters.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filter = pill.getAttribute('data-filter');
            renderAllProjectsTable(filter);
        });
    });

    // =========================================================================
    // 7. INCOMING FREELANCER PROPOSALS TABLE
    // =========================================================================

    function renderAdminProposals() {
        if (!adminProposalsTableBody) return;
        const db = getDB();
        const proposals = db ? db.getProposals() : [];

        if (proposalsCountBadge) {
            const pending = proposals.filter(p => p.status === 'Pending Review').length;
            proposalsCountBadge.textContent = `${pending} Pending Review`;
        }

        if (proposals.length === 0) {
            adminProposalsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
                        No incoming proposals found. Freelancers can submit proposals from the Marketplace.
                    </td>
                </tr>
            `;
            return;
        }

        adminProposalsTableBody.innerHTML = proposals.map(prop => `
            <tr>
                <td class="project-id-cell">${prop.id}</td>
                <td><strong>${escapeHtml(prop.projectTitle)}</strong> (${prop.projectId})</td>
                <td>${escapeHtml(prop.freelancer)}</td>
                <td class="budget-cell">$${Number(prop.bidAmount).toLocaleString()}</td>
                <td>${escapeHtml(prop.timeline)}</td>
                <td>
                    <span class="badge ${prop.status === 'Approved' ? 'badge-completed' : (prop.status === 'Rejected' ? 'badge-review' : 'badge-pending')}">
                        ${prop.status}
                    </span>
                </td>
                <td style="text-align: center; white-space: nowrap;">
                    ${prop.status === 'Pending Review' ? `
                        <button class="btn btn-primary btn-sm" onclick="window.approveProposalById('${prop.id}')">
                            <i class="ph ph-check"></i> Approve &amp; Assign
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="window.rejectProposalById('${prop.id}')" style="margin-left: 0.35rem;">
                            <i class="ph ph-x"></i> Reject
                        </button>
                    ` : `<span style="font-size: 0.8rem; color: var(--text-muted);">${prop.status}</span>`}
                </td>
            </tr>
        `).join('');
    }

    window.approveProposalById = function(propId) {
        const db = getDB();
        if (db) {
            db.approveProposal(propId);
            renderDashboardStats();
            renderAdminProposals();
            renderAllProjectsTable();
            renderRecentsTable();
            renderTransactionsTable();
            showToast(`Proposal ${propId} approved! Project assigned and escrow funded.`, "success");
        }
    };

    window.rejectProposalById = function(propId) {
        const db = getDB();
        if (db) {
            db.rejectProposal(propId);
            renderDashboardStats();
            renderAdminProposals();
            showToast(`Proposal ${propId} marked as rejected.`, "info");
        }
    };

    // =========================================================================
    // 8. USER MANAGEMENT & MODALS
    // =========================================================================

    function renderUsersTable(filterRole = 'all', searchQuery = '') {
        if (!usersTableBody) return;
        const db = getDB();
        const users = db ? db.getUsers() : [];

        const filtered = users.filter(u => {
            const matchesRole = (filterRole === 'all') || (u.role.toLowerCase() === filterRole.toLowerCase());
            const matchesSearch = searchQuery === '' ||
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesRole && matchesSearch;
        });

        usersTableBody.innerHTML = filtered.map(u => `
            <tr>
                <td class="project-id-cell">${u.id}</td>
                <td>
                    <div class="user-info-cell">
                        <div class="user-avatar-small">${(u.name || "US").substring(0, 2).toUpperCase()}</div>
                        <div>
                            <div class="user-name-title">${escapeHtml(u.name)} ${u.verified ? '<i class="ph-bold ph-seal-check text-emerald" title="Identity Verified"></i>' : ''}</div>
                            <div class="user-email-sub">${escapeHtml(u.email)}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge ${u.role === 'Freelancer' ? 'badge-completed' : (u.role === 'Admin' ? 'badge-review' : 'badge-in-progress')}">
                        ${u.role}
                    </span>
                </td>
                <td><strong>${u.projects || 0} Projects</strong></td>
                <td>${u.joined || '2026'}</td>
                <td>
                    <span class="badge ${u.status === 'Active' ? 'badge-completed' : 'badge-pending'}">
                        <span class="badge-dot"></span>${u.status}
                    </span>
                </td>
                <td style="text-align: center; white-space: nowrap;">
                    <button class="btn btn-secondary btn-sm" onclick="window.openEditUserModal('${u.id}')" title="Edit account">
                        <i class="ph ph-pencil-simple"></i>
                        <span>Edit</span>
                    </button>
                    ${(u.role || '').toLowerCase() === 'freelancer' ? `
                        <button class="btn ${u.verified ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="window.toggleUserVerificationById('${u.id}')" style="margin-left: 0.35rem;" title="${u.verified ? 'Revoke verification' : 'Verify freelancer'}">
                            <i class="ph ${u.verified ? 'ph-x-circle' : 'ph-seal-check'}"></i>
                            <span>${u.verified ? 'Revoke' : 'Verify'}</span>
                        </button>
                    ` : ''}
                    ${(u.role || '').toLowerCase() !== 'admin' ? `
                        <button class="btn btn-danger btn-sm" onclick="window.deleteUserById('${u.id}')" style="margin-left: 0.35rem;" title="Delete user account">
                            <i class="ph ph-trash"></i>
                            <span>Delete</span>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    window.deleteUserById = function(userId) {
        const db = getDB();
        const user = db ? db.getUserById(userId) : null;
        if (!user) return;
        const name = user.name || userId;
        if (confirm(`Are you sure you want to permanently delete user account "${name}" (${userId})?\n\nThis will remove the user from the database and decrease the total account number in the admin panel.`)) {
            db.deleteUser(userId);
            renderDashboardStats();
            renderUsersTable();
            showToast(`User account "${name}" (${userId}) deleted. Total accounts decreased.`, "warning");
        }
    };

    window.toggleUserVerificationById = function(userId) {
        const db = getDB();
        if (db) {
            db.toggleUserVerification(userId);
            renderDashboardStats();
            renderUsersTable();
            showToast(`User verification toggled for ${userId}.`, "success");
        }
    };

    window.openEditUserModal = function(userId) {
        const db = getDB();
        const user = db ? db.getUserById(userId) : null;
        if (!user) return;

        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserRole').value = user.role;
        document.getElementById('editUserStatus').value = user.status;
        document.getElementById('editUserVerified').checked = !!user.verified;

        editUserModalBackdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    function closeEditUserModal() {
        editUserModalBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
        if (editUserForm) editUserForm.reset();
    }

    if (closeEditUserModalBtn) closeEditUserModalBtn.addEventListener('click', closeEditUserModal);
    if (cancelEditUserBtn) cancelEditUserBtn.addEventListener('click', closeEditUserModal);
    if (editUserModalBackdrop) {
        editUserModalBackdrop.addEventListener('click', (e) => {
            if (e.target === editUserModalBackdrop) closeEditUserModal();
        });
    }

    if (editUserForm) {
        editUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('editUserId').value;
            const name = document.getElementById('editUserName').value.trim();
            const email = document.getElementById('editUserEmail').value.trim();
            const role = document.getElementById('editUserRole').value;
            const status = document.getElementById('editUserStatus').value;
            const verified = document.getElementById('editUserVerified').checked;

            if (!name || !email) {
                alert("Please provide valid name and email.");
                return;
            }

            const db = getDB();
            if (db) {
                db.updateUser(id, { name, email, role, status, verified });
                renderDashboardStats();
                renderUsersTable();
                closeEditUserModal();
                showToast(`User account ${name} updated successfully!`, "success");
            }
        });
    }

    if (deleteUserFromEditBtn) {
        deleteUserFromEditBtn.addEventListener('click', () => {
            const id = document.getElementById('editUserId').value;
            const db = getDB();
            const user = db ? db.getUserById(id) : null;
            const name = user ? user.name : id;
            if (confirm(`Permanently remove user "${name}" (${id}) from platform? This will decrease the total account count.`)) {
                if (db) {
                    db.deleteUser(id);
                    renderDashboardStats();
                    renderUsersTable();
                    closeEditUserModal();
                    showToast(`User account "${name}" (${id}) removed. Total accounts count decreased.`, "warning");
                }
            }
        });
    }

    const userRoleFilters = document.querySelectorAll('#userRoleFilter .filter-pill');
    userRoleFilters.forEach(pill => {
        pill.addEventListener('click', () => {
            userRoleFilters.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const role = pill.getAttribute('data-role');
            const query = document.getElementById('userSearchInput') ? document.getElementById('userSearchInput').value.trim() : '';
            renderUsersTable(role, query);
        });
    });

    const userSearchInput = document.getElementById('userSearchInput');
    if (userSearchInput) {
        userSearchInput.addEventListener('input', (e) => {
            const activeRoleBtn = document.querySelector('#userRoleFilter .filter-pill.active');
            const role = activeRoleBtn ? activeRoleBtn.getAttribute('data-role') : 'all';
            renderUsersTable(role, e.target.value.trim());
        });
    }

    if (addNewUserBtn) {
        addNewUserBtn.addEventListener('click', () => {
            userModalBackdrop.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeUserModal() {
        userModalBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
        if (addUserForm) addUserForm.reset();
    }

    if (closeUserModalBtn) closeUserModalBtn.addEventListener('click', closeUserModal);
    if (cancelAddUserBtn) cancelAddUserBtn.addEventListener('click', closeUserModal);
    if (userModalBackdrop) {
        userModalBackdrop.addEventListener('click', (e) => {
            if (e.target === userModalBackdrop) closeUserModal();
        });
    }

    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('newUserName').value.trim();
            const email = document.getElementById('newUserEmail').value.trim();
            const role = document.getElementById('newUserRole').value;
            const status = document.getElementById('newUserStatus').value;
            const password = document.getElementById('newUserPassword') ? document.getElementById('newUserPassword').value.trim() : '';

            if (!name || !email) {
                alert("Please complete name and email fields.");
                return;
            }

            const db = getDB();
            if (db) {
                const existing = db.getUserByEmail(email);
                if (existing) {
                    alert("A user with this email already exists on the platform.");
                    return;
                }

                db.createUser({
                    name,
                    email,
                    role,
                    status,
                    password: password || "password123",
                    verified: role === 'Freelancer' ? true : true
                });

                renderDashboardStats();
                renderUsersTable();
                closeUserModal();
                showToast(`User account "${name}" successfully created! Total accounts count increased.`, "success");
            }
        });
    }

    // =========================================================================
    // 9. PAYMENTS & TRANSACTIONS VIEW
    // =========================================================================

    function renderTransactionsTable() {
        if (!transactionsTableBody) return;
        const db = getDB();
        const transactions = db ? db.getTransactions() : [];

        transactionsTableBody.innerHTML = transactions.map(t => `
            <tr>
                <td class="project-id-cell">${t.id}</td>
                <td><strong>${escapeHtml(t.project)}</strong></td>
                <td>${escapeHtml(t.party)}</td>
                <td>${t.date}</td>
                <td class="budget-cell">${t.amount}</td>
                <td><span class="badge badge-in-progress">${t.type}</span></td>
                <td><span class="badge badge-completed"><span class="badge-dot"></span>${t.status}</span></td>
                <td style="text-align: center;">
                    <button class="btn btn-secondary btn-sm" onclick="alert('Transaction Audit:\\nID: ${t.id}\\nProject: ${t.project}\\nAmount: ${t.amount}\\nStatus: Verified Escrow Payout')">
                        <i class="ph ph-receipt"></i>
                        <span>Receipt</span>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // =========================================================================
    // 10. DISPUTES & COMPLAINTS VIEW
    // =========================================================================

    function renderDisputes() {
        if (!disputesContainer) return;
        const db = getDB();
        const disputes = db ? db.getDisputes() : [];

        if (disputes.length === 0) {
            disputesContainer.innerHTML = `
                <div class="empty-state" style="padding: 3rem 1rem; text-align: center; color: var(--text-muted);">
                    <i class="ph-bold ph-shield-check" style="color: var(--primary); font-size: 2.5rem; margin-bottom: 0.5rem; display: block;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.25rem;">Zero Active Disputes</h3>
                    <p>All platform deliverables and payments are in complete alignment!</p>
                </div>
            `;
            return;
        }

        disputesContainer.innerHTML = disputes.map(d => `
            <div class="dispute-card">
                <div class="dispute-main">
                    <div class="dispute-header-row">
                        <span class="dispute-ref">${d.id}</span>
                        <h4 class="dispute-title">${d.projectRef} - ${escapeHtml(d.projectName)}</h4>
                        <span class="badge badge-review">${d.status}</span>
                    </div>
                    <div class="dispute-parties">
                        <strong>Client:</strong> ${escapeHtml(d.client)} &bull; <strong>Freelancer:</strong> ${escapeHtml(d.freelancer)} &bull; <strong>Filed:</strong> ${d.filedDate}
                    </div>
                    <p class="dispute-reason">"${escapeHtml(d.reason)}"</p>
                </div>
                <div style="text-align: right; min-width: 160px;">
                    <div class="dispute-amount">${d.amount}</div>
                    <button class="btn btn-secondary btn-sm" onclick="window.openDisputeModal('${d.id}')">
                        <i class="ph ph-gavel"></i>
                        <span>Arbitrate</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    window.openDisputeModal = function(disputeId) {
        const db = getDB();
        const disputes = db ? db.getDisputes() : [];
        const dispute = disputes.find(d => d.id === disputeId);
        if (!dispute) return;

        disputeCaseId.textContent = dispute.id;
        disputeModalBody.innerHTML = `
            <div class="modal-highlight-bar">
                <div class="highlight-item">
                    <span class="highlight-label">Disputed Project</span>
                    <strong class="highlight-val">${dispute.projectRef} - ${escapeHtml(dispute.projectName)}</strong>
                </div>
                <div class="highlight-item">
                    <span class="highlight-label">Escrow Value</span>
                    <strong class="highlight-val text-red">${dispute.amount}</strong>
                </div>
                <div class="highlight-item">
                    <span class="highlight-label">Status</span>
                    <span class="badge badge-review">${dispute.status}</span>
                </div>
                <div class="highlight-item">
                    <span class="highlight-label">Case Timestamp</span>
                    <span class="highlight-val">${dispute.filedDate}</span>
                </div>
            </div>

            <div class="modal-section">
                <h3 class="modal-section-title">Complaint Overview</h3>
                <p class="modal-text">${escapeHtml(dispute.reason)}</p>
            </div>

            <div class="modal-parties-grid">
                <div class="party-card">
                    <div class="party-badge client-badge">Claimant (Client)</div>
                    <h4>${escapeHtml(dispute.client)}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">
                        "Deliverable milestone did not cover required cross-platform biometric fallbacks specified in kick-off call."
                    </p>
                </div>
                <div class="party-card">
                    <div class="party-badge freelancer-badge">Respondent (Freelancer)</div>
                    <h4>${escapeHtml(dispute.freelancer)}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">
                        "Biometric specs were added post-contract. I delivered 100% of the agreed scope in the written milestone."
                    </p>
                </div>
            </div>
        `;

        disputeModalBackdrop.classList.remove('hidden');

        refundClientBtn.onclick = () => {
            resolveDisputeCase(dispute.id, `Refunded ${dispute.amount} to Client ${dispute.client}.`);
        };
        releaseFreelancerBtn.onclick = () => {
            resolveDisputeCase(dispute.id, `Released ${dispute.amount} to Freelancer ${dispute.freelancer}.`);
        };
    };

    function resolveDisputeCase(disputeId, message) {
        const db = getDB();
        if (db) {
            db.resolveDispute(disputeId, message);
            renderDashboardStats();
            renderDisputes();
            closeDisputeModal();
            showToast(message, "success");
        }
    }

    function closeDisputeModal() {
        disputeModalBackdrop.classList.add('hidden');
    }

    if (closeDisputeModalBtn) closeDisputeModalBtn.addEventListener('click', closeDisputeModal);
    if (cancelDisputeActionBtn) cancelDisputeActionBtn.addEventListener('click', closeDisputeModal);
    if (disputeModalBackdrop) {
        disputeModalBackdrop.addEventListener('click', (e) => {
            if (e.target === disputeModalBackdrop) closeDisputeModal();
        });
    }

    // =========================================================================
    // 11. GLOBAL NAVBAR SEARCH
    // =========================================================================

    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', () => {
            const query = globalSearchInput.value.trim().toLowerCase();

            if (query.length > 0) {
                searchClearBtn.classList.remove('hidden');
            } else {
                searchClearBtn.classList.add('hidden');
                searchResultsDropdown.classList.add('hidden');
                return;
            }

            const db = getDB();
            const projects = db ? db.getProjects() : [];
            const users = db ? db.getUsers() : [];

            const matchedProjects = projects.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.id.toLowerCase().includes(query) ||
                p.client.toLowerCase().includes(query) ||
                (p.freelancer && p.freelancer.toLowerCase().includes(query))
            );

            const matchedUsers = users.filter(u => 
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                u.role.toLowerCase().includes(query)
            );

            const totalMatches = matchedProjects.length + matchedUsers.length;
            resultsCount.textContent = `${totalMatches} found`;

            if (totalMatches === 0) {
                searchResultsList.innerHTML = `
                    <div style="padding: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                        No matches found for "<strong>${escapeHtml(query)}</strong>"
                    </div>
                `;
            } else {
                let html = '';
                matchedProjects.forEach(p => {
                    html += `
                        <div class="search-result-item" data-type="project" data-id="${p.id}">
                            <span class="search-result-badge project">Project</span>
                            <div class="search-result-info">
                                <span class="search-result-title">${p.id} - ${escapeHtml(p.name)}</span>
                                <span class="search-result-sub">C: ${escapeHtml(p.client)} &bull; F: ${escapeHtml(p.freelancer || 'Unassigned')} &bull; ${p.budget}</span>
                            </div>
                        </div>
                    `;
                });
                matchedUsers.forEach(u => {
                    html += `
                        <div class="search-result-item" data-type="user" data-id="${u.id}">
                            <span class="search-result-badge user">${u.role}</span>
                            <div class="search-result-info">
                                <span class="search-result-title">${escapeHtml(u.name)}</span>
                                <span class="search-result-sub">${escapeHtml(u.email)}</span>
                            </div>
                        </div>
                    `;
                });
                searchResultsList.innerHTML = html;

                const items = searchResultsList.querySelectorAll('.search-result-item');
                items.forEach(item => {
                    item.addEventListener('click', () => {
                        const type = item.getAttribute('data-type');
                        const id = item.getAttribute('data-id');
                        searchResultsDropdown.classList.add('hidden');
                        globalSearchInput.value = '';
                        searchClearBtn.classList.add('hidden');

                        if (type === 'project') {
                            switchToTab('dashboard');
                            openProjectModal(id);
                        } else if (type === 'user') {
                            switchToTab('users');
                            showToast(`Navigated to User: ${id}`, "info");
                        }
                    });
                });
            }

            searchResultsDropdown.classList.remove('hidden');
        });

        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', () => {
                globalSearchInput.value = '';
                searchClearBtn.classList.add('hidden');
                searchResultsDropdown.classList.add('hidden');
                globalSearchInput.focus();
            });
        }
    }

    // =========================================================================
    // 12. NOTIFICATION & ADMIN DROPDOWNS
    // =========================================================================

    if (notificationBtn) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (adminDropdown) adminDropdown.classList.add('hidden');
            if (searchResultsDropdown) searchResultsDropdown.classList.add('hidden');
            const isHidden = notificationDropdown.classList.contains('hidden');
            notificationDropdown.classList.toggle('hidden', !isHidden);
            notificationBtn.setAttribute('aria-expanded', isHidden);
        });
    }

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const unreadItems = notificationDropdown.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
                const dot = item.querySelector('.unread-dot');
                if (dot) dot.remove();
            });
            if (notificationBadge) notificationBadge.style.display = 'none';
            if (unreadPill) unreadPill.textContent = '0 unread';
            showToast("All notifications marked as read.", "info");
        });
    }

    if (viewAllNotifsBtn) {
        viewAllNotifsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const list = document.getElementById('notificationList');
            if (list) {
                list.innerHTML = `<li style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No new notifications.</li>`;
            }
            if (notificationBadge) notificationBadge.style.display = 'none';
            if (unreadPill) unreadPill.textContent = '0 unread';
        });
    }

    if (adminProfileBtn) {
        adminProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (notificationDropdown) notificationDropdown.classList.add('hidden');
            if (searchResultsDropdown) searchResultsDropdown.classList.add('hidden');
            const isHidden = adminDropdown.classList.contains('hidden');
            adminDropdown.classList.toggle('hidden', !isHidden);
            adminProfileBtn.setAttribute('aria-expanded', isHidden);
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item-dropdown-wrap') && !e.target.closest('.search-box-wrapper')) {
            if (notificationDropdown) notificationDropdown.classList.add('hidden');
            if (adminDropdown) adminDropdown.classList.add('hidden');
            if (searchResultsDropdown) searchResultsDropdown.classList.add('hidden');
        }
    });

    // =========================================================================
    // 13. SIDEBAR NAVIGATION & TAB SWITCHING
    // =========================================================================

    function switchToTab(tabId) {
        navLinks.forEach(link => {
            if (link.getAttribute('data-tab') === tabId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            panel.classList.add('hidden');
        });

        const targetPanel = document.getElementById(`tab-${tabId}`);
        if (targetPanel) {
            targetPanel.classList.remove('hidden');
            targetPanel.classList.add('active');
        }

        closeMobileSidebar();
        renderDashboardStats();

        if (tabId === 'dashboard') {
            renderRecentsTable();
        } else if (tabId === 'users') {
            renderUsersTable();
        } else if (tabId === 'projects') {
            renderAllProjectsTable();
            renderAdminProposals();
        } else if (tabId === 'payments') {
            renderTransactionsTable();
        } else if (tabId === 'disputes') {
            renderDisputes();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            switchToTab(tabId);
        });
    });

    // =========================================================================
    // 14. SIDEBAR TOGGLE & HIDE/SHOW LOGIC (Ctrl+B)
    // =========================================================================

    function isMobileView() {
        return window.innerWidth <= 992;
    }

    function toggleSidebar() {
        if (isMobileView()) {
            const isOpen = sidebar ? sidebar.classList.toggle('open') : false;
            if (sidebarOverlay) sidebarOverlay.classList.toggle('active', isOpen);
        } else {
            const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
            if (floatingSidebarTab) {
                floatingSidebarTab.classList.toggle('hidden', !isCollapsed);
            }
            try {
                localStorage.setItem('milestones_sidebar_collapsed', isCollapsed ? 'true' : 'false');
            } catch (err) {}
            showToast(isCollapsed ? "Sidebar hidden (Press Ctrl+B to expand)" : "Sidebar expanded", "info");
        }
    }

    function hideSidebar() {
        if (isMobileView()) {
            closeMobileSidebar();
            showToast("Sidebar hidden", "info");
        } else {
            if (!document.body.classList.contains('sidebar-collapsed')) {
                document.body.classList.add('sidebar-collapsed');
                if (floatingSidebarTab) floatingSidebarTab.classList.remove('hidden');
                try {
                    localStorage.setItem('milestones_sidebar_collapsed', 'true');
                } catch (err) {}
                showToast("Sidebar hidden (Click arrow tab or press Ctrl+B)", "info");
            }
        }
    }

    function showSidebar() {
        if (isMobileView()) {
            if (sidebar) sidebar.classList.add('open');
            if (sidebarOverlay) sidebarOverlay.classList.add('active');
            document.body.classList.add('mobile-sidebar-open');
            if (floatingSidebarTab) floatingSidebarTab.classList.add('hidden');
        } else {
            document.body.classList.remove('sidebar-collapsed');
            if (floatingSidebarTab) floatingSidebarTab.classList.add('hidden');
            try {
                localStorage.setItem('milestones_sidebar_collapsed', 'false');
            } catch (err) {}
            showToast("Sidebar expanded", "info");
        }
    }

    function closeMobileSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.classList.remove('mobile-sidebar-open');
        if (floatingSidebarTab && isMobileView()) floatingSidebarTab.classList.remove('hidden');
    }

    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (sidebarCollapseBtn) sidebarCollapseBtn.addEventListener('click', hideSidebar);
    if (floatingSidebarTab) floatingSidebarTab.addEventListener('click', showSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileSidebar);

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
            e.preventDefault();
            toggleSidebar();
        }
    });

    try {
        if (isMobileView()) {
            if (floatingSidebarTab) floatingSidebarTab.classList.remove('hidden');
        } else {
            const savedState = localStorage.getItem('milestones_sidebar_collapsed');
            if (savedState === 'true') {
                document.body.classList.add('sidebar-collapsed');
                if (floatingSidebarTab) floatingSidebarTab.classList.remove('hidden');
            }
        }
    } catch (err) {}

    window.addEventListener('resize', () => {
        if (isMobileView()) {
            if (!sidebar || !sidebar.classList.contains('open')) {
                if (floatingSidebarTab) floatingSidebarTab.classList.remove('hidden');
            }
        } else {
            const isCollapsed = document.body.classList.contains('sidebar-collapsed');
            if (floatingSidebarTab) floatingSidebarTab.classList.toggle('hidden', !isCollapsed);
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            document.body.classList.remove('mobile-sidebar-open');
        }
    });

    // =========================================================================
    // 15. LOGOUT MODAL & FLOW
    // =========================================================================

    function openLogoutModal() {
        logoutModalBackdrop.classList.remove('hidden');
        if (adminDropdown) adminDropdown.classList.add('hidden');
    }

    function closeLogoutModal() {
        logoutModalBackdrop.classList.add('hidden');
    }

    if (menuLogout) menuLogout.addEventListener('click', openLogoutModal);
    if (navLogoutBtn) navLogoutBtn.addEventListener('click', openLogoutModal);
    if (cancelLogoutBtn) cancelLogoutBtn.addEventListener('click', closeLogoutModal);
    if (logoutModalBackdrop) {
        logoutModalBackdrop.addEventListener('click', (e) => {
            if (e.target === logoutModalBackdrop) closeLogoutModal();
        });
    }

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => {
            confirmLogoutBtn.disabled = true;
            confirmLogoutBtn.innerHTML = `<span>Logging out...</span>`;
            if (window.MilestonesDB) {
                window.MilestonesDB.clearCurrentUser();
            }
            sessionStorage.removeItem('milestones_user');
            showToast("Administrator session terminated. Redirecting to login...", "info");
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 600);
        });
    }

    // =========================================================================
    // 16. TOAST NOTIFICATIONS UTILITY
    // =========================================================================

    function showToast(message, type = 'info') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'ph-info';
        if (type === 'success') icon = 'ph-check-circle';
        if (type === 'warning') icon = 'ph-warning-circle';

        toast.innerHTML = `
            <i class="ph ${icon}" style="font-size: 1.15rem;"></i>
            <span>${escapeHtml(message)}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.25s ease';
            setTimeout(() => toast.remove(), 250);
        }, 3500);
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Action button listeners
    const exportProjectsBtn = document.getElementById('exportProjectsBtn');
    if (exportProjectsBtn) {
        exportProjectsBtn.addEventListener('click', () => {
            showToast("Projects ledger successfully exported as CSV.", "success");
        });
    }

    const exportTransactionsBtn = document.getElementById('exportTransactionsBtn');
    if (exportTransactionsBtn) {
        exportTransactionsBtn.addEventListener('click', () => {
            showToast("Financial escrow report generated for download.", "info");
        });
    }

    const profileSettingsBtn = document.getElementById('profileSettingsBtn');
    if (profileSettingsBtn) {
        profileSettingsBtn.addEventListener('click', () => {
            adminDropdown.classList.add('hidden');
            showToast("Admin Profile: Administrator (Super Admin)", "info");
        });
    }

    const systemSettingsBtn = document.getElementById('systemSettingsBtn');
    if (systemSettingsBtn) {
        systemSettingsBtn.addEventListener('click', () => {
            adminDropdown.classList.add('hidden');
            showToast("Platform Settings: Security & Escrow parameters active.", "info");
        });
    }

    // =========================================================================
    // 17. REAL-TIME STORAGE SYNC & INITIALIZATION
    // =========================================================================
    
    // Automatically synchronize when another tab creates/updates an account or project
    window.addEventListener('storage', (e) => {
        if (!e.key || e.key.includes('milestones')) {
            renderDashboardStats();
            renderRecentsTable();
            renderAllProjectsTable();
            renderAdminProposals();
            renderUsersTable();
            renderTransactionsTable();
            renderDisputes();
        }
    });

    window.addEventListener('pageshow', () => {
        renderDashboardStats();
        renderRecentsTable();
        renderAllProjectsTable();
        renderAdminProposals();
        renderUsersTable();
        renderTransactionsTable();
        renderDisputes();
    });

    renderDashboardStats();
    renderRecentsTable();
    renderAllProjectsTable();
    renderAdminProposals();
    renderUsersTable();
});
