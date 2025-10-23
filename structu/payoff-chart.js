// Payoff Chart Generator using Chart.js
// This module creates interactive payoff diagrams for structured products

let currentChart = null;

// Initialize or update payoff chart for a product
window.renderPayoffChart = function(productName, containerId = 'payoff-chart-container') {
    const config = window.getPayoffData(productName);
    if (!config || config.noChart) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="no-chart-placeholder">No payoff chart available for this product</div>';
        }
        return;
    }

    // Destroy existing chart if any
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }

    // Clear and setup canvas
    container.innerHTML = '<canvas id="payoff-chart"></canvas>';
    const canvas = document.getElementById('payoff-chart');
    const ctx = canvas.getContext('2d');

    // Build datasets (special handling for autocall/phoenix)
    const datasets = [];

    // Helper: create color for each line
    function lineColor(i, total) {
        const start = [99, 102, 241]; // indigo-500
        const end = [168, 85, 247];   // purple-500
        const t = total <= 1 ? 0 : i / (total - 1);
        const r = Math.round(start[0] + (end[0] - start[0]) * t);
        const g = Math.round(start[1] + (end[1] - start[1]) * t);
        const b = Math.round(start[2] + (end[2] - start[2]) * t);
        return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    // Helper: compute payoff array with optional year parameter
    function computePayoffArrayForYear(config, xRange, S0, points, year) {
        const [xMin, xMax] = xRange;
        const step = (xMax - xMin) / points;
        const data = [];
        for (let i = 0; i <= points; i++) {
            const S = xMin + (i * step);
            const payoff = typeof year === 'number'
                ? config.calculate(S, S0, year)
                : config.calculate(S, S0);
            data.push({ x: S, y: payoff });
        }
        return data;
    }

    // Autocallable: draw one line per year (coupon accumulation + autocall)
    if (config.type === 'phoenix') {
        const yearsToShow = 6; // display up to 6 observation dates
        for (let y = 1; y <= yearsToShow; y++) {
            const data = computePayoffArrayForYear(config, config.xRange, 100, 150, y);
            datasets.push({
                label: `Year ${y}`,
                data,
                borderColor: lineColor(y - 1, yearsToShow),
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 2,
                fill: false,
                tension: 0.25,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#6366f1',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            });
        }
    } else {
        // Default: single payoff line
        const payoffData = window.calculatePayoffArray(productName, 100, 150);
        if (!payoffData) return;

        // Create gradient for line
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 1)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.8)');

        datasets.push({
            label: 'Payoff',
            data: payoffData,
            borderColor: gradient,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#6366f1',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
        });

        if (config.extraCurves && config.extraCurves.length) {
            const [xMin, xMax] = config.xRange;
            const points = 150;
            const step = (xMax - xMin) / points;

            config.extraCurves.forEach((curve, idx) => {
                const data = [];
                for (let i = 0; i <= points; i++) {
                    const S = xMin + (i * step);
                    const payoff = typeof curve.calculate === 'function'
                        ? curve.calculate.call(config, S, 100)
                        : config.calculate(S, 100);
                    data.push({ x: S, y: payoff });
                }

                datasets.push({
                    label: curve.label || `Scenario ${idx + 2}`,
                    data,
                    borderColor: lineColor(idx, config.extraCurves.length),
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.25,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#6366f1',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                });
            });
        }
    }

    // Add diagonal reference line (1:1)
    // For diagonal reference, use the x-range from config
    const [dxMin, dxMax] = config.xRange;
    const diagonalData = [];
    const dSteps = 150;
    const dStep = (dxMax - dxMin) / dSteps;
    for (let i = 0; i <= dSteps; i++) {
        const x = dxMin + i * dStep;
        diagonalData.push({ x, y: x });
    }
    datasets.push({
        label: 'Direct Investment',
        data: diagonalData,
        borderColor: 'rgba(226, 232, 240, 0.6)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        tension: 0
    });

    // Configure chart
    const chartConfig = {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#f8fafc',
                        font: {
                            size: 12,
                            weight: '600'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'line'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#bfdbfe',
                    borderColor: 'rgba(99, 102, 241, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return `Underlying: ${context[0].parsed.x.toFixed(1)}`;
                        },
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Payoff: ${context.parsed.y.toFixed(2)}%`;
                            }
                            return `Direct: ${context.parsed.y.toFixed(1)}%`;
                        }
                    }
                },
                annotation: {
                    annotations: createAnnotations(config)
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Underlying at Maturity (%)',
                        color: '#e5e7eb',
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    },
                    min: config.xRange[0],
                    max: config.xRange[1],
                    ticks: {
                        color: '#cbd5f5',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
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
                        text: 'Product Value (%)',
                        color: '#e5e7eb',
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    },
                    min: config.yRange ? config.yRange[0] : undefined,
                    max: config.yRange ? config.yRange[1] : undefined,
                    ticks: {
                        color: '#cbd5f5',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(226, 232, 240, 0.15)',
                        drawBorder: false
                    }
                }
            }
        }
    };

    // Create chart
    currentChart = new Chart(ctx, chartConfig);
};

// Create annotation objects for key levels
function createAnnotations(config) {
    const annotations = {};

    // Add vertical lines for strikes/barriers
    if (config.annotations) {
        config.annotations.forEach((ann, idx) => {
            if (ann.x !== undefined) {
                annotations[`vline${idx}`] = {
                    type: 'line',
                    xMin: ann.x,
                    xMax: ann.x,
                    borderColor: ann.color || '#6366f1',
                    borderWidth: 2,
                    borderDash: [3, 3],
                    label: {
                        content: ann.label,
                        enabled: true,
                        position: 'start',
                        backgroundColor: ann.color || '#6366f1',
                        color: '#fff',
                        font: {
                            size: 10,
                            weight: '600'
                        },
                        padding: 4
                    }
                };
            }
            if (ann.y !== undefined) {
                annotations[`hline${idx}`] = {
                    type: 'line',
                    yMin: ann.y,
                    yMax: ann.y,
                    borderColor: ann.color || '#10b981',
                    borderWidth: 2,
                    borderDash: [3, 3],
                    label: {
                        content: ann.label,
                        enabled: true,
                        position: 'end',
                        backgroundColor: ann.color || '#10b981',
                        color: '#fff',
                        font: {
                            size: 10,
                            weight: '600'
                        },
                        padding: 4
                    }
                };
            }
        });
    }

    return annotations;
}

// Clean up chart when modal closes
window.destroyPayoffChart = function() {
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
};
