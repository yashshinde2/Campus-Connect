// Signup 3-Step Interactive Form Stepper
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupFormStepper');
    if (!signupForm) return;

    const steps = signupForm.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator-item');
    const progressLine = document.getElementById('stepProgressLine');
    const prevBtn = document.getElementById('stepPrevBtn');
    const nextBtn = document.getElementById('stepNextBtn');
    const submitBtn = document.getElementById('stepSubmitBtn');

    let currentStep = 0;

    function updateStepUI() {
        steps.forEach((step, idx) => {
            if (idx === currentStep) {
                step.classList.remove('d-none');
                step.classList.add('animate-fade-in');
            } else {
                step.classList.add('d-none');
                step.classList.remove('animate-fade-in');
            }
        });

        stepIndicators.forEach((ind, idx) => {
            if (idx <= currentStep) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });

        if (progressLine) {
            const percentage = (currentStep / (steps.length - 1)) * 100;
            progressLine.style.width = `${percentage}%`;
        }

        if (prevBtn) prevBtn.classList.toggle('d-none', currentStep === 0);
        if (nextBtn) nextBtn.classList.toggle('d-none', currentStep === steps.length - 1);
        if (submitBtn) submitBtn.classList.toggle('d-none', currentStep !== steps.length - 1);
    }

    function validateCurrentStep() {
        const currentStepEl = steps[currentStep];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                valid = false;
            }
        });
        return valid;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                currentStep = Math.min(currentStep + 1, steps.length - 1);
                updateStepUI();
            } else {
                const stepCard = signupForm.closest('.card-aurora');
                if (stepCard) {
                    stepCard.classList.add('animate-error-shake');
                    setTimeout(() => stepCard.classList.remove('animate-error-shake'), 400);
                }
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentStep = Math.max(currentStep - 1, 0);
            updateStepUI();
        });
    }

    updateStepUI();
});
