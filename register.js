document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleBtns = document.querySelectorAll('.toggle-password');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

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

    // Validation Functions
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
        
        let isValid = true;

        // Reset all errors
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
        successMessage.classList.add('hidden');

        // Validate Email
        if (!validateField(emailInput, emailInput.value.trim() !== '' && isValidEmail(emailInput.value.trim()))) {
            isValid = false;
        }

        // Validate Name
        if (!validateField(nameInput, nameInput.value.trim() !== '')) {
            isValid = false;
        }

        // Validate Password
        if (!validateField(passwordInput, passwordInput.value.length >= 8)) {
            isValid = false;
        }

        // Validate Confirm Password
        if (!validateField(confirmPasswordInput, confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value !== '')) {
            isValid = false;
        }

        if (isValid) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
            
            const roleSelect = document.getElementById('role');
            const selectedRole = roleSelect ? roleSelect.value : 'Freelancer';

            if (window.MilestonesDB) {
                const existing = window.MilestonesDB.getUserByEmail(emailInput.value.trim());
                if (existing) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Create Account';
                    emailInput.closest('.form-group').classList.add('error');
                    const errSpan = emailInput.closest('.form-group').querySelector('.error-msg');
                    if (errSpan) errSpan.textContent = 'An account with this email already exists.';
                    return;
                }

                window.MilestonesDB.createUser({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                    role: selectedRole,
                    status: 'Active',
                    verified: true
                });
            }

            setTimeout(() => {
                successMessage.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Account Created!';
                form.reset();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }, 500);
        }
    });

    // Real-time validation clear on input
    [emailInput, nameInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.form-group').classList.remove('error');
        });
    });
});
