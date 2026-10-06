// Command Palette Modal & Global Keyboard Shortcuts
document.addEventListener('DOMContentLoaded', () => {
    const paletteBackdrop = document.getElementById('commandPaletteModal');
    const input = document.getElementById('commandPaletteInput');
    const resultsContainer = document.getElementById('commandPaletteResults');
    const triggers = document.querySelectorAll('.trigger-command-palette, #searchTrigger');

    if (!paletteBackdrop) return;

    let selectedIndex = -1;

    function openPalette() {
        paletteBackdrop.classList.add('active');
        if (input) {
            input.value = '';
            input.focus();
            renderInitialState();
        }
    }

    function closePalette() {
        paletteBackdrop.classList.remove('active');
        selectedIndex = -1;
    }

    triggers.forEach(t => t.addEventListener('click', openPalette));

    document.addEventListener('keydown', (e) => {
        // Ctrl+K / Cmd+K or Slash (when not in input)
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (paletteBackdrop.classList.contains('active')) closePalette(); else openPalette();
        } else if (e.key === '/' && !isInput) {
            e.preventDefault();
            openPalette();
        } else if (e.key === 'Escape' && paletteBackdrop.classList.contains('active')) {
            closePalette();
        }
    });

    paletteBackdrop.addEventListener('click', (e) => {
        if (e.target === paletteBackdrop) closePalette();
    });

    if (input) {
        let debounceTimer;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value.trim();
            if (!query) {
                renderInitialState();
                return;
            }
            debounceTimer = setTimeout(() => {
                fetchSearchResults(query);
            }, 200);
        });

        input.addEventListener('keydown', (e) => {
            const items = resultsContainer.querySelectorAll('.command-item');
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateSelection(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    items[selectedIndex].click();
                }
            }
        });
    }

    function updateSelection(items) {
        items.forEach((item, idx) => {
            if (idx === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    function renderInitialState() {
        selectedIndex = -1;
        resultsContainer.innerHTML = `
            <div class="px-3 py-2 text-muted small fw-bold text-uppercase">Quick Navigation & Actions</div>
            <a href="/dashboard" class="command-item">
                <div class="d-flex align-items-center gap-2"><i class="bi bi-grid-1x2 text-primary"></i> <span>Dashboard</span></div>
                <span class="badge bg-light text-muted border">Page</span>
            </a>
            <a href="/notices" class="command-item">
                <div class="d-flex align-items-center gap-2"><i class="bi bi-megaphone text-info"></i> <span>Notices</span></div>
                <span class="badge bg-light text-muted border">Page</span>
            </a>
            <a href="/events" class="command-item">
                <div class="d-flex align-items-center gap-2"><i class="bi bi-calendar-event text-warning"></i> <span>Events</span></div>
                <span class="badge bg-light text-muted border">Page</span>
            </a>
            <a href="/resources" class="command-item">
                <div class="d-flex align-items-center gap-2"><i class="bi bi-folder2-open text-success"></i> <span>Study Hub</span></div>
                <span class="badge bg-light text-muted border">Page</span>
            </a>
            <a href="/community" class="command-item">
                <div class="d-flex align-items-center gap-2"><i class="bi bi-chat-square-text text-secondary"></i> <span>Community</span></div>
                <span class="badge bg-light text-muted border">Page</span>
            </a>
            <div class="command-item" onclick="toggleTheme();">
                <div class="d-flex align-items-center gap-2"><i class="bi bi-moon-stars text-primary"></i> <span>Toggle Dark / Light Theme</span></div>
                <span class="badge bg-light text-muted border">Action</span>
            </div>
            <a href="/auth/logout" class="command-item">
                <div class="d-flex align-items-center gap-2"><i class="bi bi-box-arrow-right text-danger"></i> <span>Sign Out</span></div>
                <span class="badge bg-light text-danger border border-danger-subtle">Action</span>
            </a>
        `;
    }

    function fetchSearchResults(query) {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                selectedIndex = -1;
                let html = '';
                const items = [];

                if (data.notices && data.notices.length) {
                    data.notices.forEach(n => items.push({ title: n.title, url: `/notices/${n._id}`, type: 'Notice', icon: 'bi-megaphone text-info' }));
                }
                if (data.events && data.events.length) {
                    data.events.forEach(e => items.push({ title: e.title, url: `/events/${e._id}`, type: 'Event', icon: 'bi-calendar-event text-warning' }));
                }
                if (data.resources && data.resources.length) {
                    data.resources.forEach(r => items.push({ title: r.title, url: `/resources`, type: 'Resource', icon: 'bi-file-earmark-text text-success' }));
                }
                if (data.posts && data.posts.length) {
                    data.posts.forEach(p => items.push({ title: p.title, url: `/community/${p._id}`, type: 'Post', icon: 'bi-chat-left-text text-primary' }));
                }

                if (items.length === 0) {
                    resultsContainer.innerHTML = `<div class="text-center py-4 text-muted">No results found for "${query}"</div>`;
                    return;
                }

                html = `<div class="px-3 py-2 text-muted small fw-bold text-uppercase">Search Results (${items.length})</div>`;
                items.forEach(item => {
                    const highlightedTitle = item.title.replace(new RegExp(`(${query})`, 'gi'), '<span class="highlight">$1</span>');
                    html += `
                        <a href="${item.url}" class="command-item">
                            <div class="d-flex align-items-center gap-2"><i class="bi ${item.icon}"></i> <span class="text-truncate" style="max-width: 380px;">${highlightedTitle}</span></div>
                            <span class="badge bg-light text-muted border">${item.type}</span>
                        </a>
                    `;
                });
                resultsContainer.innerHTML = html;
            })
            .catch(() => {
                resultsContainer.innerHTML = `<div class="text-center py-3 text-muted">Error fetching search results.</div>`;
            });
    }

    window.openCommandPalette = openPalette;
    window.closeCommandPalette = closePalette;
});
