// Campus Connect Theme Initialization & Switcher
(function() {
    function getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    const theme = getInitialTheme();
    document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Dispatch custom event for modules that need theme change notifications (e.g. charts)
    window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: newTheme } }));
}
