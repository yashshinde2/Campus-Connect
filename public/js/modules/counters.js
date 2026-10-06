// Number Count-Up Animation module using IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target') || el.innerText, 10);
        if (isNaN(target)) return;
        
        const duration = 1200; // ms
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const counterInterval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // easeOutQuad curve
            const currentCount = Math.round(target * (1 - (1 - progress) * (1 - progress)));
            el.innerText = currentCount.toLocaleString();

            if (frame === totalFrames) {
                clearInterval(counterInterval);
                el.innerText = target.toLocaleString();
            }
        }, frameRate);
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.counter').forEach(el => observer.observe(el));
});
