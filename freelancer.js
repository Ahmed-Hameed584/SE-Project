/**
 * =============================================================================
 * MILESTONES - FREELANCER WORKSPACE CONTROLLER
 * Full Freelancer Features:
 * - Dynamic data synchronization via MilestonesDB
 * - My Projects table (Wireframe T6 - T8) with status filters and Open modal
 * - T5 Verification Warning Banner with real-time toggle
 * - T9 Dashed Empty State with direct navigation to Marketplace
 * - Tab 2: Browse Projects Marketplace with category filters and proposal bidding
 * - Tab 3: Payments & Escrow Ledger with real-time withdrawal
 * - Freelancer Profile Settings modal (Account Management)
 * - Sidebar collapse (Ctrl+B, floating tab, morphing toggle) and logout guard
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 0. AUTHENTICATION & ACCESS GUARD
    // =========================================================================
    let currentUser = null;
    if (window.MilestonesDB) {
        currentUser = MilestonesDB.requireAuth(['freelancer', 'admin']);
    }
    if (!currentUser) {
        currentUser = {
            id: "USR-802",
            name: "Ali Hassan",
            email: "freelancer@milestones.com",
            role: "Freelancer",
            verified: true,
            availableBalance: 2150.00,
            inEscrow: 3400.00,
            totalEarned: 7850.00,
            skills: ["UI/UX Design", "Figma", "Design Systems"],
            phone: "+1 (555) 342-8921",
            bio: "Lead Product Designer specializing in accessible fintech and healthcare design systems."
        };
    }

    // Filter states
    let activeFilter = 'all';
    let searchQuery = '';
    let currentWorkspaceProject = null;
    let selectedMarketplaceProject = null;

    // Helper: Safe DB Access
    function getDB() {
        return window.MilestonesDB || null;
    }

    // Refresh active user object from DB
    function refreshCurrentUser() {
        const db = getDB();
        if (db && currentUser && currentUser.id) {
            const fresh = db.getUserById(currentUser.id);
            if (fresh) {
                currentUser = fresh;
            }
        }
        updateUserProfileDisplay();
    }

    // =========================================================================
    // 1. DOM ELEMENT REFERENCES
    // =========================================================================

    // Header & User Display Elements
    const adminNameEl = document.querySelector('.admin-name');
    const adminRoleEl = document.querySelector('.admin-role-text');
    const avatarInitialsEl = document.querySelector('.avatar-initials');
    const profileCardAvatar = document.querySelector('.profile-card-avatar');
    const profileCardName = document.querySelector('.profile-card-name');
    const profileCardEmail = document.querySelector('.profile-card-email');
    const profileRoleBadge = document.querySelector('.profile-role-badge');

    // Sidebar & Navigation Elements
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    const floatingSidebarTab = document.getElementById('floatingSidebarTab');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link:not(.logout-btn)');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const globalSearchInput = document.getElementById('globalSearchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');

    // Top Right Dropdowns
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const unreadPill = document.getElementById('unreadPill');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const viewAllNotifsBtn = document.getElementById('viewAllNotifsBtn');
    const freelancerProfileBtn = document.getElementById('freelancerProfileBtn');
    const freelancerDropdown = document.getElementById('freelancerDropdown');
    const myProfileMenuBtn = document.getElementById('myProfileMenuBtn');
    const paymentSettingsBtn = document.getElementById('paymentSettingsBtn');
    const menuLogout = document.getElementById('menuLogout');
    const navLogoutBtn = document.getElementById('navLogoutBtn');

    // T5: Verification Warning Banner
    const verificationBanner = document.getElementById('verificationBanner');
    const startVerificationBtn = document.getElementById('startVerificationBtn');
    const toggleVerificationSimBtn = document.getElementById('toggleVerificationSimBtn');
    const verificationStatusText = document.getElementById('verificationStatusText');

    // T6 - T9: My Projects Table Elements
    const myProjectsTableBody = document.getElementById('myProjectsTableBody');
    const myProjectsCountBadge = document.getElementById('myProjectsCountBadge');
    const projectStatusFilters = document.querySelectorAll('#projectStatusFilters .filter-pill');
    const myProjectsSearch = document.getElementById('myProjectsSearch');
    const emptyStateDashedBox = document.getElementById('emptyStateDashedBox');
    const myProjectsTable = document.getElementById('myProjectsTable');
    const emptyBrowseBtn = document.getElementById('emptyBrowseBtn');
    const projectsSummaryInfo = document.getElementById('projectsSummaryInfo');

    // Tab 2: Marketplace Elements
    const marketplaceGrid = document.getElementById('marketplaceGrid');
    const marketplaceSearch = document.getElementById('marketplaceSearch');
    const marketplaceCategoryPills = document.querySelectorAll('#marketplaceCategoryPills .filter-pill');
    const refreshMarketplaceBtn = document.getElementById('refreshMarketplaceBtn');
    const clientUploadProjectBtn = document.getElementById('clientUploadProjectBtn');
    const clientUploadModalBackdrop = document.getElementById('clientUploadModalBackdrop');
    const closeClientUploadModalBtn = document.getElementById('closeClientUploadModalBtn');
    const cancelClientUploadBtn = document.getElementById('cancelClientUploadBtn');
    const clientUploadForm = document.getElementById('clientUploadForm');

    // Tab 3: Payments Elements
    const freelancerTransactionsBody = document.getElementById('freelancerTransactionsBody');
    const requestPayoutBtn = document.getElementById('requestPayoutBtn');
    const withdrawNowBtn = document.getElementById('withdrawNowBtn');
    const quickWithdrawBtn = document.getElementById('quickWithdrawBtn');
    const availableBalanceDisplay = document.getElementById('availableBalanceDisplay') || document.querySelector('.stat-value');
    const statTotalEarnings = document.getElementById('statTotalEarnings');
    const statInEscrow = document.getElementById('statInEscrow');
    const withdrawModalBalance = document.getElementById('withdrawModalBalance');

    // Modals
    const projectModalBackdrop = document.getElementById('projectModalBackdrop');
    const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
    const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');
    const modalSubmitWorkBtn = document.getElementById('modalSubmitWorkBtn');
    const modalProjectId = document.getElementById('modalProjectId');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalClientName = document.getElementById('modalClientName');
    const modalContractBudget = document.getElementById('modalContractBudget');
    const modalProjectStatus = document.getElementById('modalProjectStatus');
    const modalPaidRatio = document.getElementById('modalPaidRatio');
    const modalProjectDesc = document.getElementById('modalProjectDesc');
    const modalMilestoneCount = document.getElementById('modalMilestoneCount');
    const modalMilestonesList = document.getElementById('modalMilestonesList');

    const proposalModalBackdrop = document.getElementById('proposalModalBackdrop');
    const closeProposalModalBtn = document.getElementById('closeProposalModalBtn');
    const cancelProposalBtn = document.getElementById('cancelProposalBtn');
    const proposalForm = document.getElementById('proposalForm');
    const proposalTargetTitle = document.getElementById('proposalTargetTitle');

    const verificationModalBackdrop = document.getElementById('verificationModalBackdrop');
    const closeVerificationModalBtn = document.getElementById('closeVerificationModalBtn');
    const cancelVerificationBtn = document.getElementById('cancelVerificationBtn');
    const verificationForm = document.getElementById('verificationForm');

    const withdrawalModalBackdrop = document.getElementById('withdrawalModalBackdrop');
    const closeWithdrawalModalBtn = document.getElementById('closeWithdrawalModalBtn');
    const cancelWithdrawalBtn = document.getElementById('cancelWithdrawalBtn');
    const withdrawalForm = document.getElementById('withdrawalForm');

    const profileModalBackdrop = document.getElementById('profileModalBackdrop');
    const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
    const cancelProfileBtn = document.getElementById('cancelProfileBtn');
    const profileForm = document.getElementById('profileForm');

    const logoutModalBackdrop = document.getElementById('logoutModalBackdrop');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    const toastContainer = document.getElementById('toastContainer');

    // =========================================================================
    // 2. PROFILE & VERIFICATION BANNER INITIALIZATION
    // =========================================================================

    function updateUserProfileDisplay() {
        if (!currentUser) return;
        const initials = (currentUser.name || "AH").substring(0, 2).toUpperCase();

        if (adminNameEl) adminNameEl.textContent = currentUser.name;
        if (adminRoleEl) adminRoleEl.innerHTML = `${currentUser.role || 'Freelancer'} &bull; ${currentUser.verified ? '<span class="text-emerald">Verified</span>' : '<span class="text-amber">Pending</span>'}`;
        if (avatarInitialsEl) avatarInitialsEl.textContent = initials;
        if (profileCardAvatar) profileCardAvatar.textContent = initials;
        if (profileCardName) profileCardName.textContent = currentUser.name;
        if (profileCardEmail) profileCardEmail.textContent = currentUser.email;
        if (profileRoleBadge) {
            profileRoleBadge.textContent = currentUser.verified ? 'Verified Freelancer' : 'Pending Verification';
            profileRoleBadge.style.color = currentUser.verified ? 'var(--primary)' : '#f59e0b';
        }

        // T5 Banner state
        if (verificationBanner) {
            if (currentUser.verified) {
                verificationBanner.classList.add('verified');
                if (verificationStatusText) verificationStatusText.textContent = "Account Verified & Active";
            } else {
                verificationBanner.classList.remove('verified');
                if (verificationStatusText) verificationStatusText.textContent = "Account Pending Verification";
            }
        }
    }

    // Toggle Verification Simulation
    if (toggleVerificationSimBtn) {
        toggleVerificationSimBtn.addEventListener('click', () => {
            const db = getDB();
            if (db && currentUser && currentUser.id) {
                const updated = db.toggleUserVerification(currentUser.id);
                if (updated) {
                    currentUser.verified = updated.verified;
                    updateUserProfileDisplay();
                    showToast(currentUser.verified ? "Profile marked as VERIFIED! Proposal bidding enabled." : "Profile marked as UNVERIFIED. Proposal bidding restricted.", currentUser.verified ? "success" : "warning");
                }
            } else {
                currentUser.verified = !currentUser.verified;
                updateUserProfileDisplay();
                showToast(currentUser.verified ? "Simulated: Profile Verified!" : "Simulated: Profile Unverified.", "info");
            }
        });
    }

    if (startVerificationBtn) {
        startVerificationBtn.addEventListener('click', () => {
            if (verificationModalBackdrop) verificationModalBackdrop.classList.remove('hidden');
        });
    }

    // =========================================================================
    // 3. MY PROJECTS TABLE RENDERING (Wireframe T6 - T9)
    // =========================================================================

    function renderMyProjects() {
        if (!myProjectsTableBody) return;
        const db = getDB();
        const allProjects = db ? db.getFreelancerProjects(currentUser ? currentUser.email : '') : [];

        const filtered = allProjects.filter(item => {
            let statusMatches = false;
            if (activeFilter === 'all') {
                statusMatches = true;
            } else if (activeFilter === 'Active') {
                statusMatches = (item.status === 'Active' || item.status === 'In Progress');
            } else {
                statusMatches = (item.status === activeFilter);
            }

            const searchMatches = searchQuery === '' ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase());

            return statusMatches && searchMatches;
        });

        if (myProjectsCountBadge) {
            myProjectsCountBadge.textContent = `${filtered.length} Projects`;
        }

        if (projectsSummaryInfo) {
            projectsSummaryInfo.textContent = `Showing ${filtered.length} of ${allProjects.length} projects`;
        }

        // T9: Empty State Handling
        if (filtered.length === 0) {
            myProjectsTableBody.innerHTML = '';
            if (myProjectsTable) myProjectsTable.classList.add('hidden');
            if (emptyStateDashedBox) emptyStateDashedBox.classList.remove('hidden');
            return;
        } else {
            if (myProjectsTable) myProjectsTable.classList.remove('hidden');
            if (emptyStateDashedBox) emptyStateDashedBox.classList.add('hidden');
        }

        myProjectsTableBody.innerHTML = filtered.map(proj => {
            const milestones = proj.milestones || [];
            const paidCount = milestones.filter(m => m.done || m.status === 'Paid' || m.status === 'Approved').length;
            const totalCount = milestones.length || 1;
            const percent = Math.round((paidCount / totalCount) * 100);

            let statusBadgeClass = 'badge-in-progress';
            if (proj.status === 'Completed') statusBadgeClass = 'badge-completed';
            if (proj.status === 'Proposed' || proj.status === 'Pending Approval') statusBadgeClass = 'badge-pending';

            return `
                <tr>
                    <td>
                        <div class="project-title-cell">
                            <span class="project-name-bold">${escapeHtml(proj.name)}</span>
                            <span class="project-id-sub">${proj.id} &bull; ${proj.budget}</span>
                        </div>
                    </td>
                    <td>
                        <div class="client-info-cell">
                            <div class="client-mini-avatar">${proj.clientInitials || (proj.client ? proj.client.substring(0, 2).toUpperCase() : 'CL')}</div>
                            <span class="client-name-text">${escapeHtml(proj.client)}</span>
                        </div>
                    </td>
                    <td>
                        <span class="badge ${statusBadgeClass}">
                            <span class="badge-dot"></span>
                            ${proj.status}
                        </span>
                    </td>
                    <td>
                        <div class="milestones-cell-wrap">
                            <span class="milestones-ratio-text">${paidCount} / ${totalCount} paid</span>
                            <div class="mini-progress-track">
                                <div class="mini-progress-fill" style="width: ${percent}%;"></div>
                            </div>
                        </div>
                    </td>
                    <td style="text-align: right;">
                        <button class="btn-open-project" data-id="${proj.id}" aria-label="Open project ${proj.name}">
                            <span>Open</span>
                            <i class="ph-bold ph-caret-right" style="font-size: 0.8rem;"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Wire "Open" buttons
        const openButtons = myProjectsTableBody.querySelectorAll('.btn-open-project');
        openButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const projId = btn.getAttribute('data-id');
                openProjectWorkspace(projId);
            });
        });
    }

    projectStatusFilters.forEach(pill => {
        pill.addEventListener('click', () => {
            projectStatusFilters.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeFilter = pill.getAttribute('data-status');
            renderMyProjects();
        });
    });

    if (myProjectsSearch) {
        myProjectsSearch.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderMyProjects();
        });
    }

    if (emptyBrowseBtn) {
        emptyBrowseBtn.addEventListener('click', () => {
            switchToTab('browse');
        });
    }

    // =========================================================================
    // 4. PROJECT WORKSPACE & MILESTONE SUBMISSION MODAL
    // =========================================================================

    function openProjectWorkspace(projectId) {
        const db = getDB();
        const project = db ? db.getProjectById(projectId) : null;
        if (!project) return;

        currentWorkspaceProject = project;

        modalProjectId.textContent = project.id;
        modalProjectTitle.textContent = project.name;
        modalClientName.textContent = project.client;
        modalContractBudget.textContent = project.budget;
        modalProjectStatus.textContent = project.status;
        modalProjectStatus.className = `badge ${project.status === 'Completed' ? 'badge-completed' : 'badge-in-progress'}`;

        const milestones = project.milestones || [];
        const paidCount = milestones.filter(m => m.done || m.status === 'Approved' || m.status === 'Paid').length;
        modalPaidRatio.textContent = `${paidCount} / ${milestones.length} Paid`;
        modalProjectDesc.textContent = project.description || "Contract specifications and milestones.";
        modalMilestoneCount.textContent = `${milestones.length} Milestones`;

        modalMilestonesList.innerHTML = milestones.map((m, idx) => {
            const isDone = m.done || m.status === 'Paid' || m.status === 'Approved';
            const isUnderReview = m.status === 'Under Review' || m.status === 'Under Client Review';

            return `
                <div class="milestone-timeline-item ${isDone ? 'completed' : ''}">
                    <div class="milestone-num-circle">${idx + 1}</div>
                    <div class="milestone-meta-info">
                        <div class="milestone-title-row">
                            <span class="m-title">${escapeHtml(m.title)}</span>
                            <span class="m-amount">${m.amount}</span>
                        </div>
                        <div class="m-status-row">
                            <span class="m-status-pill ${isDone ? 'done' : (isUnderReview ? 'review' : 'pending')}">
                                ${isDone ? 'Paid &amp; Released' : (isUnderReview ? 'Submitted - Under Review' : 'Deliverables Pending')}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Configure milestone submission button
        const nextSubmittable = milestones.findIndex(m => !m.done && m.status !== 'Approved' && m.status !== 'Under Review');
        if (nextSubmittable !== -1) {
            modalSubmitWorkBtn.disabled = false;
            modalSubmitWorkBtn.innerHTML = `<i class="ph ph-cloud-arrow-up"></i><span>Submit Work for Milestone ${nextSubmittable + 1}</span>`;
            modalSubmitWorkBtn.onclick = () => {
                submitMilestoneWork(project.id, nextSubmittable);
            };
        } else {
            modalSubmitWorkBtn.disabled = true;
            modalSubmitWorkBtn.innerHTML = `<i class="ph ph-check-circle"></i><span>No Milestones Pending Submission</span>`;
        }

        projectModalBackdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function submitMilestoneWork(projectId, milestoneIndex) {
        const db = getDB();
        if (db) {
            const res = db.submitMilestoneWork(projectId, milestoneIndex);
            if (res) {
                renderMyProjects();
                openProjectWorkspace(projectId);
                showToast("Deliverables successfully submitted! Administrator notified for escrow approval.", "success");
            }
        }
    }

    function closeProjectModal() {
        projectModalBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
        currentWorkspaceProject = null;
    }

    if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
    if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeProjectModal);
    if (projectModalBackdrop) {
        projectModalBackdrop.addEventListener('click', (e) => {
            if (e.target === projectModalBackdrop) closeProjectModal();
        });
    }

    // =========================================================================
    // 5. MARKETPLACE (TAB 2) & PROPOSAL SUBMISSION
    // =========================================================================

    function renderMarketplace(category = 'all', search = '') {
        if (!marketplaceGrid) return;
        const db = getDB();
        const projects = db ? db.getMarketplaceProjects() : [];

        const normCat = (category || 'all').toString().trim().toLowerCase();
        const normSearch = (search || '').toString().trim().toLowerCase();

        const filtered = projects.filter(item => {
            const itemCat = (item.category || '').toString().trim().toLowerCase();
            const itemSkills = Array.isArray(item.skills) ? item.skills.map(s => s.toString().toLowerCase()) : [];

            const matchCat = normCat === 'all' ||
                             itemCat === normCat ||
                             itemCat.includes(normCat) ||
                             normCat.includes(itemCat) ||
                             itemSkills.some(s => s.includes(normCat));

            const matchSearch = !normSearch ||
                (item.name && item.name.toLowerCase().includes(normSearch)) ||
                (item.client && item.client.toLowerCase().includes(normSearch)) ||
                (item.category && item.category.toLowerCase().includes(normSearch)) ||
                (item.description && item.description.toLowerCase().includes(normSearch)) ||
                itemSkills.some(s => s.includes(normSearch));

            return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
            marketplaceGrid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
                    <i class="ph ph-magnifying-glass" style="font-size: 2.75rem; margin-bottom: 0.75rem; display: block; color: var(--text-muted);"></i>
                    <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.5rem;">No matching projects found</h4>
                    <p style="font-size: 0.9rem; margin-bottom: 1.25rem;">No open marketplace projects match "${escapeHtml(search || category)}".</p>
                    <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-secondary btn-sm" id="resetMarketplaceFiltersBtn">
                            <i class="ph ph-arrow-counter-clockwise"></i>
                            <span>View All Projects</span>
                        </button>
                        <button class="btn btn-primary btn-sm" id="emptyMarketplacePostBtn">
                            <i class="ph-bold ph-plus"></i>
                            <span>Post a Project</span>
                        </button>
                    </div>
                </div>
            `;

            const resetBtn = document.getElementById('resetMarketplaceFiltersBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    marketplaceCategoryPills.forEach(p => p.classList.remove('active'));
                    const allPill = document.querySelector('#marketplaceCategoryPills .filter-pill[data-category="all"], #marketplaceCategoryPills .filter-pill[data-cat="all"]');
                    if (allPill) allPill.classList.add('active');
                    if (marketplaceSearch) marketplaceSearch.value = '';
                    renderMarketplace('all', '');
                });
            }

            const postBtn = document.getElementById('emptyMarketplacePostBtn');
            if (postBtn) {
                postBtn.addEventListener('click', openClientUploadModal);
            }
            return;
        }

        marketplaceGrid.innerHTML = filtered.map(item => `
            <div class="marketplace-card">
                <div>
                    <div class="card-top">
                        <span class="card-category-tag">${escapeHtml(item.category || 'General')}</span>
                        <span class="card-budget-val">${item.budget}</span>
                    </div>
                    <h3 class="marketplace-title">${escapeHtml(item.name)}</h3>
                    <p class="marketplace-desc">${escapeHtml(item.description || 'Project deliverables and client requirements.')}</p>
                    <div class="marketplace-skills-wrap">
                        ${(item.skills || ['Professional Deliverables']).map(s => `<span class="skill-pill">${escapeHtml(s)}</span>`).join('')}
                    </div>
                </div>
                <div class="marketplace-card-footer">
                    <div class="client-meta">
                        <i class="ph ph-user-circle"></i>
                        <span>${escapeHtml(item.client)} &bull; <span class="text-emerald">100% Escrow Funded</span></span>
                    </div>
                    <button class="btn btn-primary btn-sm btn-submit-bid" data-id="${item.id}">
                        <i class="ph-bold ph-paper-plane-tilt"></i>
                        <span>Send Proposal</span>
                    </button>
                </div>
            </div>
        `).join('');

        const bidBtns = marketplaceGrid.querySelectorAll('.btn-submit-bid');
        bidBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                initiateProposal(id);
            });
        });
    }

    function initiateProposal(projectId) {
        // Verification enforcement check
        if (!currentUser.verified) {
            showToast("Identity verification is required before submitting project proposals.", "warning");
            if (verificationModalBackdrop) verificationModalBackdrop.classList.remove('hidden');
            return;
        }

        const db = getDB();
        const project = db ? db.getProjectById(projectId) : null;
        if (!project) return;

        selectedMarketplaceProject = project;
        if (proposalTargetTitle) proposalTargetTitle.textContent = `${project.name} (${project.budget})`;

        const bidInput = document.getElementById('proposalBid');
        if (bidInput) bidInput.value = project.budgetValue || 2000;

        proposalModalBackdrop.classList.remove('hidden');
    }

    function closeProposalModal() {
        proposalModalBackdrop.classList.add('hidden');
        if (proposalForm) proposalForm.reset();
        selectedMarketplaceProject = null;
    }

    if (closeProposalModalBtn) closeProposalModalBtn.addEventListener('click', closeProposalModal);
    if (cancelProposalBtn) cancelProposalBtn.addEventListener('click', closeProposalModal);
    if (proposalModalBackdrop) {
        proposalModalBackdrop.addEventListener('click', (e) => {
            if (e.target === proposalModalBackdrop) closeProposalModal();
        });
    }

    if (proposalForm) {
        proposalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!selectedMarketplaceProject) return;

            const bid = parseFloat(document.getElementById('proposalBid').value);
            const timeline = document.getElementById('proposalTimeline').value;
            const cover = document.getElementById('proposalCover').value.trim();

            if (isNaN(bid) || bid <= 0 || !cover) {
                alert("Please provide a valid bid amount and cover letter.");
                return;
            }

            const db = getDB();
            if (db) {
                const res = db.createProposal({
                    projectId: selectedMarketplaceProject.id,
                    projectTitle: selectedMarketplaceProject.name,
                    freelancer: currentUser.name,
                    freelancerEmail: currentUser.email,
                    bidAmount: bid,
                    timeline: timeline,
                    coverLetter: cover
                });

                if (!res.success) {
                    alert(res.message);
                    return;
                }

                closeProposalModal();
                showToast(`Proposal sent for ${selectedMarketplaceProject.name}! Administrator will review.`, "success");
            }
        });
    }

    // Category Filter Pills Handler
    marketplaceCategoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            marketplaceCategoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const cat = pill.getAttribute('data-category') || pill.getAttribute('data-cat') || 'all';
            const search = marketplaceSearch ? marketplaceSearch.value.trim() : '';
            renderMarketplace(cat, search);
        });
    });

    // Marketplace Search Handler
    if (marketplaceSearch) {
        marketplaceSearch.addEventListener('input', (e) => {
            const activePill = document.querySelector('#marketplaceCategoryPills .filter-pill.active');
            const cat = activePill ? (activePill.getAttribute('data-category') || activePill.getAttribute('data-cat') || 'all') : 'all';
            renderMarketplace(cat, e.target.value.trim());
        });
    }

    if (refreshMarketplaceBtn) {
        refreshMarketplaceBtn.addEventListener('click', () => {
            renderMarketplace();
            showToast("Marketplace projects refreshed.", "info");
        });
    }

    // =========================================================================
    // CLIENT PROJECT POSTING / UPLOAD TO MARKETPLACE
    // =========================================================================

    function openClientUploadModal() {
        if (clientUploadForm) {
            clientUploadForm.reset();
            const clientInput = document.getElementById('clientUploadClient');
            if (clientInput && currentUser && currentUser.name) {
                clientInput.value = currentUser.name;
            }
            const deadlineInput = document.getElementById('clientUploadDeadline');
            if (deadlineInput) {
                const d = new Date();
                d.setDate(d.getDate() + 30);
                deadlineInput.value = d.toISOString().split('T')[0];
            }
        }
        if (clientUploadModalBackdrop) {
            clientUploadModalBackdrop.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeClientUploadModal() {
        if (clientUploadModalBackdrop) {
            clientUploadModalBackdrop.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    if (clientUploadProjectBtn) clientUploadProjectBtn.addEventListener('click', openClientUploadModal);
    if (closeClientUploadModalBtn) closeClientUploadModalBtn.addEventListener('click', closeClientUploadModal);
    if (cancelClientUploadBtn) cancelClientUploadBtn.addEventListener('click', closeClientUploadModal);
    if (clientUploadModalBackdrop) {
        clientUploadModalBackdrop.addEventListener('click', (e) => {
            if (e.target === clientUploadModalBackdrop) closeClientUploadModal();
        });
    }

    if (clientUploadForm) {
        clientUploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('clientUploadTitle').value.trim();
            const category = document.getElementById('clientUploadCategory').value;
            const budget = parseFloat(document.getElementById('clientUploadBudget').value);
            const client = document.getElementById('clientUploadClient').value.trim();
            const deadline = document.getElementById('clientUploadDeadline').value;
            const skillsStr = document.getElementById('clientUploadSkills').value.trim();
            const desc = document.getElementById('clientUploadDesc').value.trim();

            if (!title || !client || isNaN(budget) || budget <= 0) {
                alert("Please provide a valid project title, budget, and client name.");
                return;
            }

            const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : [category, 'Deliverables'];

            const db = getDB();
            if (db) {
                const newProject = db.createProject({
                    name: title,
                    category: category,
                    budget: budget,
                    client: client,
                    clientEmail: (currentUser && currentUser.email) ? currentUser.email : "client@milestones.com",
                    deadline: deadline || "In 30 Days",
                    skills: skills,
                    description: desc || "Client requirements and project deliverables.",
                    freelancer: "Unassigned",
                    status: "Open Marketplace"
                });

                closeClientUploadModal();
                showToast(`Project "${title}" (${newProject.id}) published to Marketplace!`, "success");

                // Reset pills to "All Fields"
                marketplaceCategoryPills.forEach(p => p.classList.remove('active'));
                const allPill = document.querySelector('#marketplaceCategoryPills .filter-pill[data-category="all"], #marketplaceCategoryPills .filter-pill[data-cat="all"]');
                if (allPill) allPill.classList.add('active');
                if (marketplaceSearch) marketplaceSearch.value = '';

                renderMarketplace('all', '');
            }
        });
    }

    // =========================================================================
    // 6. PAYMENTS & ESCROW LEDGER (TAB 3)
    // =========================================================================

    function renderTransactions() {
        if (!freelancerTransactionsBody) return;
        const db = getDB();
        const transactions = db ? db.getTransactions() : [];

        // Filter transactions involving freelancer
        const filtered = transactions.filter(t => 
            (t.freelancerEmail && t.freelancerEmail.toLowerCase() === (currentUser.email || '').toLowerCase()) ||
            (t.party && t.party.toLowerCase().includes('freelancer')) ||
            (t.party && t.party.toLowerCase().includes((currentUser.name || '').toLowerCase()))
        );

        if (filtered.length === 0) {
            freelancerTransactionsBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
                        No transaction history found. Completed milestones will appear here.
                    </td>
                </tr>
            `;
            return;
        }

        freelancerTransactionsBody.innerHTML = filtered.map(tx => `
            <tr>
                <td><strong>${tx.id}</strong></td>
                <td>${escapeHtml(tx.project)}</td>
                <td><span style="font-size: 0.8rem; color: var(--text-muted);">${tx.type || 'Escrow'}</span></td>
                <td>${escapeHtml(tx.client || 'Milestones Escrow')}</td>
                <td><strong class="text-emerald">${tx.amount}</strong></td>
                <td>${tx.date}</td>
                <td><span class="badge badge-completed"><i class="ph ph-check"></i> ${tx.status}</span></td>
            </tr>
        `).join('');

        // Update Balance displays
        refreshCurrentUser();
        const avail = currentUser.availableBalance !== undefined ? currentUser.availableBalance : 2150.00;
        const totalEarn = currentUser.totalEarned !== undefined ? currentUser.totalEarned : 7850.00;
        const inEsc = currentUser.inEscrow !== undefined ? currentUser.inEscrow : 3400.00;

        if (availableBalanceDisplay) availableBalanceDisplay.textContent = `$${avail.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (withdrawModalBalance) withdrawModalBalance.textContent = `$${avail.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (statTotalEarnings) statTotalEarnings.textContent = `$${totalEarn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (statInEscrow) statInEscrow.textContent = `$${inEsc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function openWithdrawalModal() {
        refreshCurrentUser();
        const avail = currentUser.availableBalance || 2150.00;
        if (withdrawModalBalance) withdrawModalBalance.textContent = `$${avail.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const withdrawInput = document.getElementById('withdrawAmount');
        if (withdrawInput) {
            withdrawInput.value = avail > 0 ? avail : 0;
            withdrawInput.max = avail;
        }
        withdrawalModalBackdrop.classList.remove('hidden');
    }

    function closeWithdrawalModal() {
        withdrawalModalBackdrop.classList.add('hidden');
        if (withdrawalForm) withdrawalForm.reset();
    }

    if (requestPayoutBtn) requestPayoutBtn.addEventListener('click', openWithdrawalModal);
    if (withdrawNowBtn) withdrawNowBtn.addEventListener('click', openWithdrawalModal);
    if (quickWithdrawBtn) quickWithdrawBtn.addEventListener('click', openWithdrawalModal);
    if (closeWithdrawalModalBtn) closeWithdrawalModalBtn.addEventListener('click', closeWithdrawalModal);
    if (cancelWithdrawalBtn) cancelWithdrawalBtn.addEventListener('click', closeWithdrawalModal);
    if (withdrawalModalBackdrop) {
        withdrawalModalBackdrop.addEventListener('click', (e) => {
            if (e.target === withdrawalModalBackdrop) closeWithdrawalModal();
        });
    }

    if (withdrawalForm) {
        withdrawalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('withdrawAmount').value);
            const method = document.getElementById('withdrawMethod').selectedOptions[0].text;

            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid withdrawal amount.");
                return;
            }

            const db = getDB();
            if (db) {
                const res = db.requestWithdrawal(currentUser.email, amount, method);
                if (!res.success) {
                    alert(res.message);
                    return;
                }

                refreshCurrentUser();
                renderTransactions();
                closeWithdrawalModal();
                showToast(`Withdrawal of $${amount.toLocaleString()} initiated via ${method}.`, "success");
            }
        });
    }

    // =========================================================================
    // 7. FREELANCER PROFILE SETTINGS MODAL (Account Management)
    // =========================================================================

    function openProfileModal() {
        refreshCurrentUser();
        document.getElementById('profileFullName').value = currentUser.name || '';
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileVerificationStatus').value = currentUser.verified ? 'Verified Freelancer (Full Access)' : 'Pending Verification (Restricted Bidding)';
        document.getElementById('profileSkills').value = (currentUser.skills || []).join(', ');
        document.getElementById('profileBio').value = currentUser.bio || '';

        if (freelancerDropdown) freelancerDropdown.classList.add('hidden');
        profileModalBackdrop.classList.remove('hidden');
    }

    function closeProfileModal() {
        profileModalBackdrop.classList.add('hidden');
    }

    if (myProfileMenuBtn) myProfileMenuBtn.addEventListener('click', openProfileModal);
    if (paymentSettingsBtn) {
        paymentSettingsBtn.addEventListener('click', () => {
            if (freelancerDropdown) freelancerDropdown.classList.add('hidden');
            switchToTab('payments');
        });
    }
    if (closeProfileModalBtn) closeProfileModalBtn.addEventListener('click', closeProfileModal);
    if (cancelProfileBtn) cancelProfileBtn.addEventListener('click', closeProfileModal);
    if (profileModalBackdrop) {
        profileModalBackdrop.addEventListener('click', (e) => {
            if (e.target === profileModalBackdrop) closeProfileModal();
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('profileFullName').value.trim();
            const phone = document.getElementById('profilePhone').value.trim();
            const skillsStr = document.getElementById('profileSkills').value.trim();
            const bio = document.getElementById('profileBio').value.trim();

            if (!name) {
                alert("Full name is required.");
                return;
            }

            const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

            const db = getDB();
            if (db && currentUser && currentUser.id) {
                const updated = db.updateUser(currentUser.id, { name, phone, skills, bio });
                if (updated) {
                    currentUser = updated;
                    updateUserProfileDisplay();
                    closeProfileModal();
                    showToast("Profile details updated successfully!", "success");
                }
            }
        });
    }

    // Verification Form Submission
    if (verificationForm) {
        verificationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const portfolio = document.getElementById('verifyPortfolio').value.trim();
            if (!portfolio) {
                alert("Please provide a valid portfolio or GitHub link.");
                return;
            }

            const db = getDB();
            if (db && currentUser && currentUser.id) {
                db.updateUser(currentUser.id, { verified: true, portfolioUrl: portfolio });
                currentUser.verified = true;
                updateUserProfileDisplay();
                if (verificationModalBackdrop) verificationModalBackdrop.classList.add('hidden');
                showToast("Verification documents accepted! Account verified.", "success");
            }
        });
    }

    if (closeVerificationModalBtn) closeVerificationModalBtn.addEventListener('click', () => verificationModalBackdrop.classList.add('hidden'));
    if (cancelVerificationBtn) cancelVerificationBtn.addEventListener('click', () => verificationModalBackdrop.classList.add('hidden'));

    // =========================================================================
    // 8. SIDEBAR NAVIGATION & TAB SWITCHING
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

        if (tabId === 'dashboard') {
            renderMyProjects();
        } else if (tabId === 'browse') {
            renderMarketplace();
        } else if (tabId === 'payments') {
            renderTransactions();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            switchToTab(tabId);
        });
    });

    // Support direct deep-linking via URL parameters or hashes (e.g. freelancer.html?tab=browse or #browse)
    function checkUrlNavigation() {
        const hash = (window.location.hash || '').replace('#', '').replace('tab-', '').toLowerCase();
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = (urlParams.get('tab') || hash).toLowerCase();
        if (tabParam === 'browse' || tabParam === 'marketplace') {
            switchToTab('browse');
        } else if (tabParam === 'payments') {
            switchToTab('payments');
        } else if (tabParam === 'dashboard' || tabParam === 'projects') {
            switchToTab('dashboard');
        }

        if (urlParams.get('action') === 'post-project' || hash === 'post-project' || hash === 'create') {
            switchToTab('browse');
            setTimeout(openClientUploadModal, 150);
        }
    }

    // =========================================================================
    // 9. SIDEBAR TOGGLE (Ctrl+B & Drawer)
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
                localStorage.setItem('milestones_freelancer_sidebar_collapsed', isCollapsed ? 'true' : 'false');
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
                    localStorage.setItem('milestones_freelancer_sidebar_collapsed', 'true');
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
                localStorage.setItem('milestones_freelancer_sidebar_collapsed', 'false');
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
            const savedState = localStorage.getItem('milestones_freelancer_sidebar_collapsed');
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
    // 10. NOTIFICATION & PROFILE DROPDOWNS
    // =========================================================================

    if (notificationBtn) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (freelancerDropdown) freelancerDropdown.classList.add('hidden');
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
            if (unreadPill) unreadPill.textContent = '0 new';
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
            if (unreadPill) unreadPill.textContent = '0 new';
        });
    }

    if (freelancerProfileBtn) {
        freelancerProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (notificationDropdown) notificationDropdown.classList.add('hidden');
            const isHidden = freelancerDropdown.classList.contains('hidden');
            freelancerDropdown.classList.toggle('hidden', !isHidden);
            freelancerProfileBtn.setAttribute('aria-expanded', isHidden);
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item-dropdown-wrap')) {
            if (notificationDropdown) notificationDropdown.classList.add('hidden');
            if (freelancerDropdown) freelancerDropdown.classList.add('hidden');
        }
    });

    // =========================================================================
    // 11. LOGOUT FLOW
    // =========================================================================

    function openLogoutModal() {
        if (logoutModalBackdrop) logoutModalBackdrop.classList.remove('hidden');
        if (freelancerDropdown) freelancerDropdown.classList.add('hidden');
    }

    function closeLogoutModal() {
        if (logoutModalBackdrop) logoutModalBackdrop.classList.add('hidden');
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
            showToast("Freelancer workspace session closed. Returning to home page...", "info");
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        });
    }

    // =========================================================================
    // 12. TOAST NOTIFICATIONS UTILITY
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
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // =========================================================================
    // 13. INITIAL RENDERING & CROSS-TAB LIVE SYNCHRONIZATION
    // =========================================================================
    updateUserProfileDisplay();
    renderMyProjects();
    renderMarketplace();
    renderTransactions();
    checkUrlNavigation();

    window.addEventListener('hashchange', checkUrlNavigation);

    // Cross-tab live synchronization (e.g. When Admin creates a project in admin.html or Client posts a project)
    window.addEventListener('storage', (e) => {
        if (!e.key || e.key.includes('milestones')) {
            refreshCurrentUser();
            renderMyProjects();
            renderMarketplace();
            renderTransactions();
        }
    });

    window.addEventListener('pageshow', () => {
        refreshCurrentUser();
        renderMyProjects();
        renderMarketplace();
        renderTransactions();
        checkUrlNavigation();
    });
});
