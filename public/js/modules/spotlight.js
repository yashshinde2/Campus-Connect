// Spotlight Card Hover Glow effect
document.addEventListener('DOMContentLoaded', () => {
    function initSpotlight() {
        const cards = document.querySelectorAll('.spotlight-card, .bento-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mx', `${x}px`);
                card.style.setProperty('--my', `${y}px`);
            });
        });
    }
    initSpotlight();
    window.initSpotlight = initSpotlight;
});
