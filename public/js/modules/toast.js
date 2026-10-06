// Aurora Stacked Toast Notifications Module
(function() {
    function getContainer() {
        let container = document.getElementById('toastAuroraContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastAuroraContainer';
            container.className = 'toast-aurora-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(message, type = 'info', duration = 4000) {
        const container = getContainer();
        const toast = document.createElement('div');
        toast.className = `toast-aurora border-${type}`;

        const iconMap = {
            success: 'bi-check-circle-fill text-success',
            error: 'bi-exclamation-triangle-fill text-danger',
            danger: 'bi-exclamation-triangle-fill text-danger',
            warning: 'bi-exclamation-circle-fill text-warning',
            info: 'bi-info-circle-fill text-primary'
        };

        const iconClass = iconMap[type] || iconMap.info;

        toast.innerHTML = `
            <i class="bi ${iconClass} fs-5"></i>
            <div class="flex-grow-1 fs-6">${message}</div>
            <button type="button" class="btn-close ms-auto small" aria-label="Close"></button>
        `;

        const closeBtn = toast.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => dismissToast(toast));

        container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => dismissToast(toast), duration);
        }
    }

    function dismissToast(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s cubic-bezier(.22,.8,.3,1)';
        setTimeout(() => toast.remove(), 300);
    }

    window.showToast = showToast;
})();
