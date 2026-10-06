// Main entry point for Campus Connect Client-Side Interactivity
document.addEventListener('DOMContentLoaded', () => {
    // 1. Glass Navbar Scroll Effect & Sliding Active Indicator
    const navbar = document.querySelector('.navbar-glass');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 15) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Sliding indicator on navbar
    const navContainer = document.querySelector('.navbar-nav-container');
    if (navContainer) {
        let indicator = navContainer.querySelector('.nav-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'nav-indicator';
            navContainer.appendChild(indicator);
        }

        const activeLink = navContainer.querySelector('.nav-link-aurora.active');
        function moveIndicator(target) {
            if (!target || !indicator) return;
            const containerRect = navContainer.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            indicator.style.width = `${targetRect.width}px`;
            indicator.style.left = `${targetRect.left - containerRect.left}px`;
            indicator.style.opacity = '1';
        }

        if (activeLink) {
            moveIndicator(activeLink);
        } else {
            if (indicator) indicator.style.opacity = '0';
        }

        const navLinks = navContainer.querySelectorAll('.nav-link-aurora');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => moveIndicator(link));
        });

        navContainer.addEventListener('mouseleave', () => {
            if (activeLink) moveIndicator(activeLink);
            else if (indicator) indicator.style.opacity = '0';
        });
    }

    // 2. Announcement Bar Dismissal (Persisted)
    const announcementBar = document.getElementById('siteAnnouncementBar');
    const dismissAnnouncement = document.getElementById('dismissAnnouncement');
    if (announcementBar && dismissAnnouncement) {
        const isDismissed = localStorage.getItem('announcement_dismissed_v1');
        if (isDismissed === 'true') {
            announcementBar.style.display = 'none';
        } else {
            dismissAnnouncement.addEventListener('click', () => {
                announcementBar.style.display = 'none';
                localStorage.setItem('announcement_dismissed_v1', 'true');
            });
        }
    }

    // 3. Password Toggle & Password Strength Meter
    const togglePassButtons = document.querySelectorAll('.toggle-password');
    togglePassButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.querySelector(targetId);
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('bi-eye');
                    icon.classList.toggle('bi-eye-slash');
                }
            }
        });
    });

    const passwordInput = document.getElementById('passwordInput');
    const strengthMeter = document.getElementById('passwordStrengthMeter');
    const strengthText = document.getElementById('passwordStrengthText');

    if (passwordInput && strengthMeter) {
        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            let score = 0;
            if (val.length >= 8) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            const colors = ['bg-danger', 'bg-warning', 'bg-info', 'bg-success'];
            const labels = ['Weak', 'Fair', 'Good', 'Strong'];
            const percent = (score / 4) * 100;

            strengthMeter.style.width = `${percent}%`;
            strengthMeter.className = `progress-bar ${colors[score - 1] || 'bg-danger'}`;
            if (strengthText) strengthText.innerText = val ? labels[score - 1] || 'Weak' : '';
        });
    }

    // 4. Global AJAX Handlers (Bookmark, RSVP, Like, Copy Link)
    document.addEventListener('click', async (e) => {
        // Bookmark Toggle Button
        const bookmarkBtn = e.target.closest('.btn-bookmark');
        if (bookmarkBtn) {
            e.preventDefault();
            const id = bookmarkBtn.getAttribute('data-id');
            try {
                const res = await fetch(`/api/bookmark/${id}`, { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    const icon = bookmarkBtn.querySelector('i');
                    if (icon) {
                        icon.className = data.bookmarked ? 'bi bi-bookmark-fill text-primary' : 'bi bi-bookmark text-muted';
                    }
                    if (window.showToast) {
                        window.showToast(data.bookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks', 'info');
                    }
                }
            } catch (err) { console.error(err); }
        }

        // RSVP Toggle Button
        const rsvpBtn = e.target.closest('.btn-rsvp');
        if (rsvpBtn) {
            e.preventDefault();
            const id = rsvpBtn.getAttribute('data-id');
            try {
                const res = await fetch(`/api/rsvp/${id}`, { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    if (data.isAttending) {
                        rsvpBtn.className = 'btn btn-success btn-rsvp rounded-pill px-3';
                        rsvpBtn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Attending';
                    } else {
                        rsvpBtn.className = 'btn btn-aurora btn-rsvp rounded-pill px-3';
                        rsvpBtn.innerHTML = '<i class="bi bi-calendar-check me-1"></i> RSVP Event';
                    }
                    const countEl = document.querySelector(`#attendeeCount-${id}`);
                    if (countEl) countEl.innerText = data.count;
                    if (window.showToast) {
                        window.showToast(data.isAttending ? 'RSVP Confirmed!' : 'RSVP Cancelled', data.isAttending ? 'success' : 'info');
                    }
                }
            } catch (err) { console.error(err); }
        }

        // Like Button (Community Post)
        const likeBtn = e.target.closest('.btn-like');
        if (likeBtn) {
            e.preventDefault();
            const id = likeBtn.getAttribute('data-id');
            try {
                const res = await fetch(`/community/like/${id}`, { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    const icon = likeBtn.querySelector('i');
                    if (icon) {
                        icon.className = data.liked ? 'bi bi-heart-fill text-danger animate-heart-pop' : 'bi bi-heart text-muted';
                    }
                    const countEl = likeBtn.querySelector('.like-count');
                    if (countEl) countEl.innerText = data.likesCount;
                }
            } catch (err) { console.error(err); }
        }

        // Copy Link Button
        const copyBtn = e.target.closest('.btn-copy-link');
        if (copyBtn) {
            e.preventDefault();
            const url = copyBtn.getAttribute('data-url') || window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                if (window.showToast) window.showToast('Link copied to clipboard!', 'success');
            }).catch(() => {});
        }
    });

    // 5. IntersectionObserver Scroll Reveal
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));
});
