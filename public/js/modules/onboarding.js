// First-login onboarding tour modal for Dashboard
document.addEventListener('DOMContentLoaded', () => {
    const tourModal = document.getElementById('onboardingTourModal');
    if (!tourModal) return;

    // Check if dismissed before
    const isDismissed = localStorage.getItem('onboarding_tour_dismissed');
    if (isDismissed === 'true') return;

    // Show tour modal after 800ms
    setTimeout(() => {
        const modalInstance = new bootstrap.Modal(tourModal);
        modalInstance.show();
    }, 800);

    const steps = tourModal.querySelectorAll('.onboarding-step');
    const nextBtn = document.getElementById('tourNextBtn');
    const prevBtn = document.getElementById('tourPrevBtn');
    const finishBtn = document.getElementById('tourFinishBtn');
    const indicators = tourModal.querySelectorAll('.tour-step-dot');

    let currentStep = 0;

    function renderStep() {
        steps.forEach((s, idx) => s.classList.toggle('d-none', idx !== currentStep));
        indicators.forEach((ind, idx) => ind.classList.toggle('active', idx === currentStep));

        if (prevBtn) prevBtn.classList.toggle('d-none', currentStep === 0);
        if (nextBtn) nextBtn.classList.toggle('d-none', currentStep === steps.length - 1);
        if (finishBtn) finishBtn.classList.toggle('d-none', currentStep !== steps.length - 1);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentStep = Math.min(currentStep + 1, steps.length - 1);
            renderStep();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentStep = Math.max(currentStep - 1, 0);
            renderStep();
        });
    }

    function dismissTour() {
        localStorage.setItem('onboarding_tour_dismissed', 'true');
        const modalInstance = bootstrap.Modal.getInstance(tourModal);
        if (modalInstance) modalInstance.hide();
    }

    if (finishBtn) finishBtn.addEventListener('click', dismissTour);

    const skipBtns = tourModal.querySelectorAll('.tour-skip-btn');
    skipBtns.forEach(b => b.addEventListener('click', dismissTour));

    renderStep();
});
