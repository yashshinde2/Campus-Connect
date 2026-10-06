// Main entry point for client-side JavaScript modules
document.addEventListener('DOMContentLoaded', () => {
    // 1. Glass Navbar Scroll Effect
    const navbar = document.querySelector('.navbar-glass');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 2. Animated Stat Counters
    const counters = document.querySelectorAll('.stat-counter');
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    let count = 0;
                    const speed = target / 50;

                    const updateCount = () => {
                        count += speed;
                        if (count < target) {
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCount, 30);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    // 3. Password Toggle Visibility
    const togglePassButtons = document.querySelectorAll('.toggle-password');
    togglePassButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.querySelector(btn.getAttribute('data-target'));
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                btn.querySelector('i').classList.toggle('bi-eye');
                btn.querySelector('i').classList.toggle('bi-eye-slash');
            }
        });
    });

    // 4. Live Search AJAX Overlay
    const searchTrigger = document.querySelector('#searchTrigger');
    const searchOverlay = document.querySelector('#searchOverlay');
    const searchInput = document.querySelector('#searchInput');
    const searchResults = document.querySelector('#searchResults');

    if (searchTrigger && searchOverlay) {
        searchTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.remove('d-none');
            if (searchInput) searchInput.focus();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                searchOverlay.classList.remove('d-none');
                if (searchInput) searchInput.focus();
            }
            if (e.key === 'Escape' && !searchOverlay.classList.contains('d-none')) {
                searchOverlay.classList.add('d-none');
            }
        });

        const closeSearch = document.querySelector('#closeSearch');
        if (closeSearch) {
            closeSearch.addEventListener('click', () => searchOverlay.classList.add('d-none'));
        }

        if (searchInput && searchResults) {
            let debounceTimer;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                const query = searchInput.value.trim();
                if (query.length < 2) {
                    searchResults.innerHTML = '<div class="text-center text-muted p-3">Type at least 2 characters to search...</div>';
                    return;
                }

                debounceTimer = setTimeout(async () => {
                    try {
                        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                        const data = await res.json();
                        
                        if (!data.results || data.results.length === 0) {
                            searchResults.innerHTML = '<div class="text-center text-muted p-3">No results found.</div>';
                            return;
                        }

                        searchResults.innerHTML = data.results.map(item => `
                            <a href="${item.url}" class="list-group-item list-group-item-action border-0 mb-1 rounded-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold">${item.title}</span>
                                    <span class="badge bg-light text-primary border">${item.type}</span>
                                </div>
                                <small class="text-muted d-block text-truncate">${item.snippet}</small>
                            </a>
                        `).join('');
                    } catch (err) {
                        searchResults.innerHTML = '<div class="text-center text-danger p-3">Search error occurred.</div>';
                    }
                }, 300);
            });
        }
    }

    // 5. Global AJAX Handlers (Bookmark, RSVP, Like, Group Join)
    document.addEventListener('click', async (e) => {
        // Bookmark Toggle
        if (e.target.closest('.btn-bookmark')) {
            const btn = e.target.closest('.btn-bookmark');
            const id = btn.getAttribute('data-id');
            try {
                const res = await fetch(`/api/bookmark/${id}`, { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    const icon = btn.querySelector('i');
                    if (data.bookmarked) {
                        icon.className = 'bi bi-bookmark-fill text-primary';
                    } else {
                        icon.className = 'bi bi-bookmark text-muted';
                    }
                }
            } catch (err) { console.error(err); }
        }

        // RSVP Toggle
        if (e.target.closest('.btn-rsvp')) {
            const btn = e.target.closest('.btn-rsvp');
            const id = btn.getAttribute('data-id');
            try {
                const res = await fetch(`/api/rsvp/${id}`, { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    if (data.isAttending) {
                        btn.className = 'btn btn-success btn-rsvp';
                        btn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Attending';
                    } else {
                        btn.className = 'btn btn-primary-gradient btn-rsvp';
                        btn.innerHTML = '<i class="bi bi-calendar-check me-1"></i> RSVP Event';
                    }
                    const countEl = document.querySelector(`#attendeeCount-${id}`);
                    if (countEl) countEl.innerText = data.count;
                }
            } catch (err) { console.error(err); }
        }
    });
});
