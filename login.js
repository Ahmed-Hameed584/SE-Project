document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const toggleBtns = document.querySelectorAll('.toggle-password');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    const errorBanner = document.getElementById('errorBanner');
    const errorBannerText = document.getElementById('errorBannerText');
    const submitBtn = document.getElementById('submitBtn');
    const quickFillAdminBtn = document.getElementById('quickFillAdminBtn');
    const quickFillFreelancerBtn = document.getElementById('quickFillFreelancerBtn');

    // Hardcoded Admin & Freelancer Credentials
    const ADMIN_CREDENTIALS = {
        email: 'admin@milestones.com',
        alias: 'admin',
        password: 'admin123',
        aliasPassword: 'admin'
    };

    const FREELANCER_CREDENTIALS = {
        email: 'freelancer@milestones.com',
        alias: 'freelancer',
        password: 'freelancer123',
        aliasPassword: 'freelancer'
    };

    // Toggle Password Visibility
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.currentTarget.previousElementSibling;
            const icon = e.currentTarget.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('ph-eye');
                icon.classList.add('ph-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('ph-eye-slash');
                icon.classList.add('ph-eye');
            }
        });
    });

    // Quick Fill Admin Credentials
    if (quickFillAdminBtn) {
        quickFillAdminBtn.addEventListener('click', () => {
            emailInput.value = ADMIN_CREDENTIALS.email;
            passwordInput.value = ADMIN_CREDENTIALS.password;
            
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
            if (errorBanner) errorBanner.classList.add('hidden');
            
            quickFillAdminBtn.textContent = 'Filled!';
            quickFillAdminBtn.style.backgroundColor = '#34d399';
            setTimeout(() => {
                quickFillAdminBtn.textContent = 'Admin Fill';
                quickFillAdminBtn.style.backgroundColor = '';
            }, 1200);

            passwordInput.focus();
        });
    }

    // Quick Fill Freelancer Credentials
    if (quickFillFreelancerBtn) {
        quickFillFreelancerBtn.addEventListener('click', () => {
            emailInput.value = FREELANCER_CREDENTIALS.email;
            passwordInput.value = FREELANCER_CREDENTIALS.password;
            
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
            if (errorBanner) errorBanner.classList.add('hidden');
            
            quickFillFreelancerBtn.textContent = 'Filled!';
            quickFillFreelancerBtn.style.backgroundColor = '#10B981';
            setTimeout(() => {
                quickFillFreelancerBtn.textContent = 'Freelancer Fill';
                quickFillFreelancerBtn.style.backgroundColor = '#8b5cf6';
            }, 1200);

            passwordInput.focus();
        });
    }

    // Validation Functions
    const isValidEmailOrUsername = (val) => {
        if (!val || val.trim() === '') return false;
        const trimmed = val.trim().toLowerCase();
        if (trimmed === 'admin' || trimmed === 'freelancer') return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    };

    const validateField = (input, condition) => {
        const group = input.closest('.form-group');
        if (!condition) {
            group.classList.add('error');
            return false;
        } else {
            group.classList.remove('error');
            return true;
        }
    };

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailVal = emailInput.value.trim().toLowerCase();
        const passwordVal = passwordInput.value.trim();

        // Reset banners
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
        if (successMessage) successMessage.classList.add('hidden');
        if (errorBanner) errorBanner.classList.add('hidden');

        let isValid = true;

        // Validate Email
        if (!validateField(emailInput, isValidEmailOrUsername(emailVal))) {
            isValid = false;
        }

        // Validate Password
        if (!validateField(passwordInput, passwordVal.length > 0)) {
            isValid = false;
        }

        if (!isValid) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';

        // Check with MilestonesDB if available
        if (window.MilestonesDB) {
            const authResult = window.MilestonesDB.login(emailVal, passwordVal);
            if (authResult.success) {
                const user = authResult.user;
                // Also set legacy key for safety
                sessionStorage.setItem('milestones_user', JSON.stringify(user));

                setTimeout(() => {
                    const role = (user.role || '').toLowerCase();
                    if (role === 'admin') {
                        if (successText) successText.textContent = 'Welcome back, Administrator! Loading Admin Dashboard...';
                        submitBtn.textContent = 'Access Granted!';
                        if (successMessage) successMessage.classList.remove('hidden');
                        setTimeout(() => { window.location.href = 'admin.html'; }, 600);
                    } else if (role === 'freelancer') {
                        if (successText) successText.textContent = `Welcome back, ${user.name}! Loading Freelancer Workspace...`;
                        submitBtn.textContent = 'Access Granted!';
                        if (successMessage) successMessage.classList.remove('hidden');
                        setTimeout(() => { window.location.href = 'freelancer.html'; }, 600);
                    } else {
                        if (successText) successText.textContent = `Welcome, ${user.name}! Loading Projects & Marketplace...`;
                        submitBtn.textContent = 'Access Granted!';
                        if (successMessage) successMessage.classList.remove('hidden');
                        setTimeout(() => { window.location.href = 'freelancer.html?tab=browse'; }, 600);
                    }
                }, 400);
                return;
            } else {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Login';
                    if (errorBannerText) {
                        errorBannerText.textContent = authResult.message || 'Invalid email or password. Please try again.';
                    }
                    if (errorBanner) errorBanner.classList.remove('hidden');
                    passwordInput.closest('.form-group').classList.add('error');
                    passwordInput.focus();
                }, 300);
                return;
            }
        }

        // Fallback if MilestonesDB not loaded
        const isAdminEmail = (emailVal === ADMIN_CREDENTIALS.email.toLowerCase() || emailVal === ADMIN_CREDENTIALS.alias);
        const isAdminPassword = (passwordVal === ADMIN_CREDENTIALS.password || passwordVal === ADMIN_CREDENTIALS.aliasPassword);

        const isFreelancerEmail = (emailVal === FREELANCER_CREDENTIALS.email.toLowerCase() || emailVal === FREELANCER_CREDENTIALS.alias);
        const isFreelancerPassword = (passwordVal === FREELANCER_CREDENTIALS.password || passwordVal === FREELANCER_CREDENTIALS.aliasPassword);

        if (isAdminEmail) {
            if (isAdminPassword) {
                setTimeout(() => {
                    sessionStorage.setItem('milestones_user', JSON.stringify({
                        role: 'admin',
                        name: 'Administrator',
                        email: 'admin@milestones.com'
                    }));
                    if (successText) successText.textContent = 'Welcome back, Administrator! Loading Admin Dashboard...';
                    if (successMessage) successMessage.classList.remove('hidden');
                    submitBtn.textContent = 'Access Granted!';
                    setTimeout(() => { window.location.href = 'admin.html'; }, 800);
                }, 600);
            } else {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Login';
                    if (errorBannerText) errorBannerText.textContent = 'Incorrect password for administrator. (Hint: admin123)';
                    if (errorBanner) errorBanner.classList.remove('hidden');
                    passwordInput.closest('.form-group').classList.add('error');
                    passwordInput.focus();
                }, 400);
            }
        } else if (isFreelancerEmail) {
            if (isFreelancerPassword) {
                setTimeout(() => {
                    sessionStorage.setItem('milestones_user', JSON.stringify({
                        role: 'freelancer',
                        name: 'Ali Hassan',
                        email: 'freelancer@milestones.com'
                    }));
                    if (successText) successText.textContent = 'Welcome back, Freelancer! Loading your workspace...';
                    if (successMessage) successMessage.classList.remove('hidden');
                    submitBtn.textContent = 'Access Granted!';
                    setTimeout(() => { window.location.href = 'freelancer.html'; }, 800);
                }, 600);
            } else {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Login';
                    if (errorBannerText) errorBannerText.textContent = 'Incorrect password for freelancer. (Hint: freelancer123)';
                    if (errorBanner) errorBanner.classList.remove('hidden');
                    passwordInput.closest('.form-group').classList.add('error');
                    passwordInput.focus();
                }, 400);
            }
        } else {
            setTimeout(() => {
                sessionStorage.setItem('milestones_user', JSON.stringify({
                    role: 'user',
                    name: emailVal.split('@')[0],
                    email: emailVal
                }));
                if (successText) successText.textContent = 'Logged in as user! Redirecting to home...';
                if (successMessage) successMessage.classList.remove('hidden');
                submitBtn.textContent = 'Success!';
                setTimeout(() => { window.location.href = 'index.html'; }, 1000);
            }, 600);
        }
    });

    // Real-time validation clear on input
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.form-group').classList.remove('error');
            if (errorBanner) errorBanner.classList.add('hidden');
        });
    });
});
