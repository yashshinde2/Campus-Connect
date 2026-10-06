// SVG Admin Dashboard Charts System (No external JS chart library required)
document.addEventListener('DOMContentLoaded', () => {
    function initLineChart() {
        const container = document.getElementById('lineChartSignups');
        if (!container) return;

        const data = [12, 19, 25, 32, 45, 60, 85, 110, 140, 180, 210, 260];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const width = 500;
        const height = 200;
        const padding = 30;
        const maxVal = Math.max(...data);

        const points = data.map((val, idx) => {
            const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - (val / maxVal) * (height - 2 * padding);
            return `${x},${y}`;
        }).join(' ');

        const pathD = `M ${points}`;
        const areaD = `M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`;

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" class="w-100 h-100" style="overflow: visible;">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#2563EB" />
                        <stop offset="50%" stop-color="#4F46E5" />
                        <stop offset="100%" stop-color="#06B6D4" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="rgba(37, 99, 235, 0.25)" />
                        <stop offset="100%" stop-color="rgba(37, 99, 235, 0.0)" />
                    </linearGradient>
                </defs>
                <path d="${areaD}" fill="url(#areaGrad)" />
                <path d="${pathD}" fill="none" stroke="url(#lineGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="chart-line-path" />
                ${data.map((val, idx) => {
                    const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
                    const y = height - padding - (val / maxVal) * (height - 2 * padding);
                    return `
                        <circle cx="${x}" cy="${y}" r="4" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" class="chart-point">
                            <title>${months[idx]}: ${val} signups</title>
                        </circle>
                    `;
                }).join('')}
            </svg>
        `;
    }

    function initDonutChart() {
        const container = document.getElementById('donutChartResources');
        if (!container) return;

        const categories = [
            { label: 'PDF Notes', count: 45, color: '#2563EB' },
            { label: 'Question Papers', count: 30, color: '#06B6D4' },
            { label: 'Syllabus', count: 15, color: '#4F46E5' },
            { label: 'Lab Manuals', count: 10, color: '#8B5CF6' }
        ];

        const total = categories.reduce((acc, c) => acc + c.count, 0);
        let accumulatedPercent = 0;

        const slices = categories.map(cat => {
            const percent = (cat.count / total) * 100;
            const strokeDasharray = `${percent} ${100 - percent}`;
            const strokeDashoffset = -accumulatedPercent;
            accumulatedPercent += percent;
            return { ...cat, percent, strokeDasharray, strokeDashoffset };
        });

        container.innerHTML = `
            <div class="d-flex align-items-center justify-content-center gap-4 flex-wrap">
                <div style="position: relative; width: 140px; height: 140px;">
                    <svg viewBox="0 0 42 42" class="w-100 h-100" style="transform: rotate(-90deg); border-radius: 50%;">
                        ${slices.map(s => `
                            <circle cx="21" cy="21" r="15.91549430918954" fill="transparent"
                                stroke="${s.color}" stroke-width="6"
                                stroke-dasharray="${s.strokeDasharray}"
                                stroke-dashoffset="${s.strokeDashoffset}">
                            </circle>
                        `).join('')}
                    </svg>
                    <div class="position-absolute top-50 start-50 translate-middle text-center">
                        <div class="fw-bold fs-5">${total}</div>
                        <div class="small text-muted" style="font-size: 0.7rem;">Files</div>
                    </div>
                </div>
                <div class="d-flex flex-column gap-2">
                    ${categories.map(c => `
                        <div class="d-flex align-items-center gap-2 small">
                            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${c.color};"></span>
                            <span class="text-secondary-custom">${c.label}:</span>
                            <span class="fw-bold ms-auto">${c.count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function initBarChart() {
        const container = document.getElementById('barChartNotices');
        if (!container) return;

        const data = [
            { category: 'Exam', count: 28, color: '#EF4444' },
            { category: 'Academic', count: 42, color: '#2563EB' },
            { category: 'Event', count: 35, color: '#8B5CF6' },
            { category: 'General', count: 18, color: '#8492A6' },
            { category: 'Placement', count: 22, color: '#10B981' }
        ];

        const max = Math.max(...data.map(d => d.count));

        container.innerHTML = `
            <div class="d-flex flex-column gap-3 w-100">
                ${data.map(d => {
                    const percent = (d.count / max) * 100;
                    return `
                        <div>
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="fw-semibold">${d.category}</span>
                                <span class="fw-bold text-muted">${d.count} notices</span>
                            </div>
                            <div class="progress" style="height: 10px; background: var(--surface-2); border-radius: var(--radius-pill);">
                                <div class="progress-bar" role="progressbar" style="width: ${percent}%; background: ${d.color}; border-radius: var(--radius-pill); transition: width 1s ease;" aria-valuenow="${d.count}" aria-valuemin="0" aria-valuemax="${max}"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    initLineChart();
    initDonutChart();
    initBarChart();
});
