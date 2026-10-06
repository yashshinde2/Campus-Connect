// View Transitions API & Navigation Progress Bar
document.addEventListener('DOMContentLoaded', () => {
    let progressBar = document.getElementById('pageProgressBar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'pageProgressBar';
        progressBar.className = 'page-progress-bar';
        document.body.appendChild(progressBar);
    }

    function triggerProgressBar() {
        progressBar.style.width = '0%';
        progressBar.style.opacity = '1';
        setTimeout(() => { progressBar.style.width = '70%'; }, 50);
    }

    function finishProgressBar() {
        progressBar.style.width = '100%';
        setTimeout(() => { progressBar.style.opacity = '0'; }, 300);
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') return;
        if (link.hostname !== window.location.hostname) return;

        // Same origin navigation
        if (document.startViewTransition) {
            e.preventDefault();
            triggerProgressBar();
            document.startViewTransition(() => {
                window.location.href = href;
            });
        } else {
            triggerProgressBar();
        }
    });

    window.addEventListener('pageshow', () => {
        finishProgressBar();
    });
});
