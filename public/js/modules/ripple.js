// Button Click Ripple Micro-interaction
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-aurora, .btn-aurora-secondary, .btn-aurora-soft, .btn-ripple');

    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            const rect = this.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple-effect');

            const existingRipple = this.querySelector('.ripple-effect');
            if (existingRipple) existingRipple.remove();

            this.appendChild(circle);
        });
    });
});
