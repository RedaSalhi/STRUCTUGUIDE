// Payoff chart generator for options library

(function() {
    let currentChart = null;

    window.renderPayoffChart = function(productName, containerId = 'payoff-chart-container') {
        const config = window.getOptionPayoffData(productName);
        if (!config || config.noChart) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<div class="no-chart-placeholder">No payoff chart available for this option</div>';
            }
            return;
        }

        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }

        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '<canvas id="payoff-chart"></canvas>';
        const canvas = document.getElementById('payoff-chart');
        const ctx = canvas.getContext('2d');

        const payoffData = window.calculateOptionPayoffArray(productName, 100, 160);
        if (!payoffData) return;

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(14, 165, 233, 1)');
        gradient.addColorStop(1, 'rgba(30, 64, 175, 0.85)');

        const datasets = [{
            label: 'Option Payoff',
            data: payoffData,
            borderColor: gradient,
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            borderWidth: 3,
            fill: true,
            tension: 0.25,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#1d4ed8',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
        }];

        const [dxMin, dxMax] = config.xRange;
        const diagonal = [];
        const step = (dxMax - dxMin) / 120;
        for (let i = 0; i <= 120; i++) {
            const x = dxMin + i * step;
            diagonal.push({ x, y: Math.max(0, x - 100) });
        }
        datasets.push({
            label: 'Underlying Δ (reference)',
            data: diagonal,
            borderColor: 'rgba(148, 163, 184, 0.55)',
            borderWidth: 2,
            borderDash: [6, 6],
            fill: false,
            pointRadius: 0,
            tension: 0
        });

        const chartConfig = {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#f8fafc',
                            font: { size: 12, weight: '600' },
                            usePointStyle: true,
                            padding: 14
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#cbd5f5',
                        borderColor: 'rgba(99, 102, 241, 0.4)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            title: ctx => `Underlying: ${ctx[0].parsed.x.toFixed(2)}`,
                            label: ctx => `Payoff: ${ctx.parsed.y.toFixed(2)}`
                        }
                    },
                    annotation: {
                        annotations: buildAnnotations(config)
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Underlying price at expiry',
                            color: '#e5e7eb',
                            font: { size: 13, weight: '600' }
                        },
                        min: config.xRange[0],
                        max: config.xRange[1],
                        ticks: {
                            color: '#cbd5f5',
                            font: { size: 11 }
                        },
                        grid: {
                            color: 'rgba(226, 232, 240, 0.15)',
                            drawBorder: false
                        }
                    },
                    y: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Option payoff',
                            color: '#e5e7eb',
                            font: { size: 13, weight: '600' }
                        },
                        min: config.yRange ? config.yRange[0] : undefined,
                        max: config.yRange ? config.yRange[1] : undefined,
                        ticks: {
                            color: '#cbd5f5',
                            font: { size: 11 }
                        },
                        grid: {
                            color: 'rgba(226, 232, 240, 0.15)',
                            drawBorder: false
                        }
                    }
                }
            }
        };

        currentChart = new Chart(ctx, chartConfig);
    };

    function buildAnnotations(config) {
        const annotations = {};
        if (config.annotations) {
            config.annotations.forEach((ann, idx) => {
                if (ann.x !== undefined) {
                    annotations[`v-${idx}`] = {
                        type: 'line',
                        xMin: ann.x,
                        xMax: ann.x,
                        borderColor: ann.color || '#6366f1',
                        borderWidth: 2,
                        borderDash: [4, 4],
                        label: {
                            content: ann.label,
                            enabled: true,
                            position: 'start',
                            backgroundColor: ann.color || '#6366f1',
                            color: '#fff',
                            font: { size: 10, weight: '600' },
                            padding: 4
                        }
                    };
                }
                if (ann.y !== undefined) {
                    annotations[`h-${idx}`] = {
                        type: 'line',
                        yMin: ann.y,
                        yMax: ann.y,
                        borderColor: ann.color || '#10b981',
                        borderWidth: 2,
                        borderDash: [4, 4],
                        label: {
                            content: ann.label,
                            enabled: true,
                            position: 'end',
                            backgroundColor: ann.color || '#10b981',
                            color: '#fff',
                            font: { size: 10, weight: '600' },
                            padding: 4
                        }
                    };
                }
            });
        }
        return annotations;
    }

    window.destroyPayoffChart = function() {
        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }
    };

    window.optionRenderPayoffChart = window.renderPayoffChart;
})();
