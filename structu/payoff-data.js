// Payoff Data Configuration for Structured Products
// Each product has a configuration for generating its payoff chart

window.PAYOFF_DATA = {
    // Capital Protection Products
    "Capital Protection Note": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [60, 170],
        params: {
            strike: 100,
            participation: 100,
            protection: 100
        },
        calculate: function(S, S0 = 100) {
            const perf = ((S - S0) / S0) * 100;
            if (S >= S0) {
                return 100 + (this.params.participation / 100) * perf;
            }
            return this.params.protection;
        },
        annotations: [
            { x: 100, label: "Initial Level", color: "#6366f1" },
            { y: 100, label: "Capital Protection", color: "#10b981", horizontal: true }
        ],
        zones: [
            { from: 0, to: 100, color: "rgba(16, 185, 129, 0.1)", label: "Protected" },
            { from: 100, to: 200, color: "rgba(99, 102, 241, 0.1)", label: "Participation" }
        ]
    },

    "Discount Certificate": {
        type: "discount",
        xRange: [40, 160],
        yRange: [40, 140],
        params: {
            strike: 120,
            entryDiscount: 10
        },
        calculate: function(S, S0 = 100) {
            if (S >= this.params.strike) {
                return (this.params.strike / S0) * 100;
            }
            return (S / S0) * 100;
        },
        annotations: [
            { x: 100, label: "Initial", color: "#6366f1" },
            { x: 120, label: "Strike (Cap)", color: "#f59e0b" }
        ],
        zones: [
            { from: 100, to: 120, color: "rgba(16, 185, 129, 0.1)", label: "Optimal Zone" }
        ]
    },

    "Barrier Discount Certificate": {
        type: "discount",
        xRange: [30, 170],
        yRange: [20, 140],
        params: {
            capitalBarrier: 70,  // expressed as % of S0
            cap: 100             // redemption capped at par
        },
        calculate: function(S, S0 = 100) {
            const level = (S / S0) * 100;
            if (level >= this.params.capitalBarrier) {
                return this.params.cap;
            }
            return level;
        },
        annotations: [
            { x: 70, label: "Barrier", color: "#ef4444" },
            { y: 100, label: "Capped Redemption", color: "#10b981", horizontal: true }
        ],
        zones: [
            { from: 0, to: 70, color: "rgba(239, 68, 68, 0.15)", label: "Loss if barrier hit" },
            { from: 70, to: 120, color: "rgba(16, 185, 129, 0.1)", label: "Protected zone" }
        ]
    },

    "Trigger Barrier Discount Certificate": {
        type: "discount",
        xRange: [30, 170],
        yRange: [20, 140],
        params: {
            trigger: 100,         // coupon / early redemption trigger
            capitalBarrier: 60,   // capital protection barrier
            coupon: 8,            // coupon paid if trigger met (% of nominal)
            cap: 108              // capped redemption including coupon
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;

            if (level >= p.trigger) {
                return Math.min(p.cap, 100 + p.coupon);
            }
            if (level >= p.capitalBarrier) {
                return 100;
            }
            return level;
        },
        annotations: [
            { x: 100, label: "Trigger", color: "#6366f1" },
            { x: 60, label: "Capital Barrier", color: "#ef4444" },
            { y: 108, label: "Max Redemption", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 0, to: 60, color: "rgba(239, 68, 68, 0.15)", label: "Loss zone" },
            { from: 60, to: 100, color: "rgba(251, 191, 36, 0.1)", label: "Capital protected" },
            { from: 100, to: 120, color: "rgba(16, 185, 129, 0.1)", label: "Trigger / coupon" }
        ]
    },

    "Bonus Certificate": {
        type: "bonus",
        xRange: [40, 160],
        yRange: [40, 180],
        params: {
            kiBarrier: 70,
            bonusLevel: 120
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= p.kiBarrier) {
                return Math.max(level, p.bonusLevel);
            }
            return level;
        },
        annotations: [
            { x: 70, label: "Barrier", color: "#ef4444" },
            { y: 120, label: "Bonus Level", color: "#10b981", horizontal: true }
        ],
        zones: [
            { from: 0, to: 70, color: "rgba(239, 68, 68, 0.15)", label: "Barrier breached" },
            { from: 70, to: 150, color: "rgba(16, 185, 129, 0.12)", label: "Bonus protected" }
        ]
    },

    "Capped Bonus Certificate": {
        type: "bonus",
        xRange: [40, 160],
        yRange: [40, 180],
        params: {
            kiBarrier: 70,
            bonusLevel: 120,
            capLevel: 140
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= p.kiBarrier) {
                const protectedValue = Math.max(level, p.bonusLevel);
                return Math.min(p.capLevel, protectedValue);
            }
            return level;
        },
        annotations: [
            { x: 70, label: "Barrier", color: "#ef4444" },
            { y: 120, label: "Bonus Level", color: "#10b981", horizontal: true },
            { y: 140, label: "Cap Level", color: "#6366f1", horizontal: true }
        ],
        zones: [
            { from: 0, to: 70, color: "rgba(239, 68, 68, 0.15)", label: "Barrier breached" },
            { from: 70, to: 150, color: "rgba(16, 185, 129, 0.12)", label: "Bonus / Cap" }
        ]
    },

    "Airbag Bonus Certificate": {
        type: "bonus",
        xRange: [40, 160],
        yRange: [40, 180],
        params: {
            kiBarrier: 70,
            bonusLevel: 115,
            airbagFactor: 0.6,
            capLevel: 140
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= p.kiBarrier) {
                let payoff = Math.max(level, p.bonusLevel);
                if (p.capLevel) {
                    payoff = Math.min(p.capLevel, payoff);
                }
                return payoff;
            }
            const slope = p.bonusLevel / p.kiBarrier;
            return Math.max(0, slope * level);
        },
        annotations: [
            { x: 70, label: "Barrier", color: "#ef4444" },
            { y: 115, label: "Airbag Bonus", color: "#10b981", horizontal: true },
            { y: 140, label: "Cap (optional)", color: "#6366f1", horizontal: true }
        ],
        zones: [
            { from: 0, to: 70, color: "rgba(251, 191, 36, 0.12)", label: "Airbag exposure" },
            { from: 70, to: 150, color: "rgba(16, 185, 129, 0.12)", label: "Bonus protected" }
        ]
    },

    "Option on Dynamic Basket (ODB) – Alternative Investment Note": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [60, 190],
        params: {
            participation: 120,
            floor: 100
        },
        calculate: function(S, S0 = 100) {
            const level = (S / S0) * 100;
            if (level <= 100) return this.params.floor;
            const upside = (level - 100) * (this.params.participation / 100);
            return this.params.floor + upside;
        },
        annotations: [
            { x: 100, label: "Initial Level", color: "#6366f1" },
            { y: 100, label: "Capital Floor", color: "#10b981", horizontal: true },
            { y: 160, label: "Dynamic Upside", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 40, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Protected Capital" },
            { from: 100, to: 160, color: "rgba(99, 102, 241, 0.12)", label: "Leveraged Allocation" }
        ]
    },

    "CPPI (Constant Proportion Portfolio Insurance)": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [40, 180],
        params: {
            floor: 90,
            multiplier: 3,
            cap: 170
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level <= 100) {
                return Math.max(p.floor, level);
            }
            const cushion = level - 100;
            const boosted = 100 + Math.min(p.cap - 100, p.multiplier * cushion);
            return boosted;
        },
        annotations: [
            { y: 90, label: "Protection Floor", color: "#0ea5e9", horizontal: true },
            { x: 100, label: "Reference", color: "#6366f1" },
            { y: 170, label: "Max Allocation", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 40, to: 100, color: "rgba(14, 165, 233, 0.12)", label: "Capital Preservation" },
            { from: 100, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "Leverage Zone" }
        ]
    },

    "Predator": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [100, 180],
        params: {
            baseCoupon: 6,
            leverage: 1.2,
            cap: 150
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= 100) {
                const payoff = 100 + p.baseCoupon + p.leverage * (level - 100);
                return Math.min(p.cap, payoff);
            }
            return 100 + p.baseCoupon;
        },
        annotations: [
            { y: 106, label: "Fixed Coupons", color: "#22c55e", horizontal: true },
            { y: 150, label: "Lock-in Cap", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 40, to: 100, color: "rgba(251, 191, 36, 0.12)", label: "Coupons maintained" },
            { from: 100, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "Locked in gains" }
        ]
    },

    "Stellar": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [100, 180],
        params: {
            baseCoupon: 5,
            participation: 1,
            cap: 140
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= 100) {
                const payoff = 100 + p.baseCoupon + p.participation * (level - 100);
                return Math.min(p.cap, payoff);
            }
            return 100 + p.baseCoupon;
        },
        annotations: [
            { y: 105, label: "Floor Coupon", color: "#22c55e", horizontal: true },
            { y: 140, label: "Coupon Cap", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 40, to: 100, color: "rgba(251, 191, 36, 0.12)", label: "Minimum payout" },
            { from: 100, to: 160, color: "rgba(99, 102, 241, 0.12)", label: "Average gains" }
        ]
    },

    "Cliquet": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [100, 190],
        params: {
            participation: 1.5,
            cap: 150
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= 100) {
                const payoff = 100 + p.participation * (level - 100);
                return Math.min(p.cap, payoff);
            }
            return 100;
        },
        annotations: [
            { y: 100, label: "Capital Guarantee", color: "#10b981", horizontal: true },
            { y: 150, label: "Capped Sum of Gains", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 40, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Protected" },
            { from: 100, to: 160, color: "rgba(59, 130, 246, 0.12)", label: "Accumulated Upside" }
        ]
    },

    "Ariane": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [100, 160],
        params: {
            bonusHigh: 8,
            bonusBase: 4,
            softBarrier: 80,
            hardBarrier: 60
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= 100) {
                return 100 + p.bonusHigh;
            }
            if (level >= p.softBarrier) {
                return 100 + p.bonusBase;
            }
            if (level >= p.hardBarrier) {
                return 100;
            }
            return 100;
        },
        annotations: [
            { y: 108, label: "Full Coupon", color: "#22c55e", horizontal: true },
            { y: 104, label: "Base Coupon", color: "#f59e0b", horizontal: true },
            { x: 80, label: "Soft Barrier", color: "#f97316" },
            { x: 60, label: "Hard Barrier", color: "#ef4444" }
        ],
        zones: [
            { from: 40, to: 60, color: "rgba(239, 68, 68, 0.12)", label: "Coupon reduced" },
            { from: 60, to: 80, color: "rgba(251, 191, 36, 0.12)", label: "Base coupon only" },
            { from: 80, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "Full coupon" }
        ]
    },

    "Profiler": {
        type: "capital-protection",
        xRange: [60, 150],
        yRange: [100, 190],
        params: {
            participation: 140
        },
        calculate: function(S, S0 = 100) {
            const level = (S / S0) * 100;
            if (level <= 100) return 100;
            const upside = (level - 100) * (this.params.participation / 100);
            return 100 + upside;
        },
        annotations: [
            { y: 100, label: "Capital Guarantee", color: "#10b981", horizontal: true },
            { y: 160, label: "Best-portfolio Boost", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 60, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Capital protected" },
            { from: 100, to: 150, color: "rgba(99, 102, 241, 0.12)", label: "Best-of upside" }
        ]
    },

    "Capuccino": {
        type: "capital-protection",
        xRange: [80, 160],
        yRange: [100, 170],
        params: {
            conditionLevel: 120,
            participation: 80,
            cap: 160
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level <= p.conditionLevel) {
                return 100;
            }
            const upside = (p.participation / 100) * (level - p.conditionLevel);
            return Math.min(p.cap, 100 + upside);
        },
        annotations: [
            { x: 120, label: "Condition Level", color: "#f97316" },
            { y: 100, label: "Capital Floor", color: "#10b981", horizontal: true },
            { y: 160, label: "Conditional Cap", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 80, to: 120, color: "rgba(251, 191, 36, 0.12)", label: "No transform" },
            { from: 120, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "Conditional upside" }
        ]
    },

    "Quanto-style Option": {
        type: "capital-protection",
        xRange: [60, 160],
        yRange: [100, 200],
        params: {
            participation: 120
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level <= 100) return 100;
            const upside = (p.participation / 100) * (level - 100);
            return 100 + upside;
        },
        annotations: [
            { x: 100, label: "Initial (FX hedged)", color: "#6366f1" },
            { y: 100, label: "Capital Protected", color: "#10b981", horizontal: true },
            { y: 160, label: "120% Participation", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 60, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Capital floor" },
            { from: 100, to: 160, color: "rgba(99, 102, 241, 0.12)", label: "Quanto upside" }
        ]
    },

    "Rainbow": {
        type: "capital-protection",
        xRange: [60, 160],
        yRange: [100, 160],
        params: {
            multiplier: 80,
            cap: 160
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level <= 100) return 100;
            const payoff = 100 + (p.multiplier / 100) * (level - 100);
            return Math.min(p.cap, payoff);
        },
        annotations: [
            { y: 100, label: "Capital", color: "#10b981", horizontal: true },
            { y: 150, label: "Scaled Basket", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 60, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Protected" },
            { from: 100, to: 160, color: "rgba(59, 130, 246, 0.12)", label: "Weighted upside" }
        ]
    },

    "Lookback": {
        type: "capital-protection",
        xRange: [60, 160],
        yRange: [100, 200],
        params: {
            participation: 150,
            cap: 190
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level <= 100) return 100;
            const payoff = 100 + (p.participation / 100) * (level - 100);
            return Math.min(p.cap, payoff);
        },
        annotations: [
            { y: 100, label: "Capital Guarantee", color: "#10b981", horizontal: true },
            { y: 190, label: "Lookback Cap", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 60, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Protected" },
            { from: 100, to: 160, color: "rgba(129, 140, 248, 0.12)", label: "Max performance" }
        ]
    },

    "Starlight": {
        type: "capital-protection",
        xRange: [60, 160],
        yRange: [100, 150],
        params: {
            autocallBarrier: 110,
            participation: 80,
            cap: 135
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            const participationPayoff = 100 + (p.participation / 100) * Math.max(0, level - 100);
            if (level >= p.autocallBarrier) {
                return Math.min(p.cap, Math.max(participationPayoff, 110));
            }
            return Math.max(100, Math.min(p.cap, participationPayoff));
        },
        annotations: [
            { x: 110, label: "Autocall Barrier", color: "#10b981" },
            { y: 110, label: "Early Redemption", color: "#22c55e", horizontal: true },
            { y: 135, label: "Maturity Cap", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 60, to: 110, color: "rgba(251, 191, 36, 0.12)", label: "Running coupons" },
            { from: 110, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "Autocall region" }
        ]
    },

    "Titan": {
        type: "capital-protection",
        xRange: [60, 160],
        yRange: [100, 200],
        params: {
            linearParticipation: 120,
            kickerStart: 120,
            convexFactor: 0.6,
            cap: 190
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level <= 100) return 100;
            const linear = 100 + (p.linearParticipation / 100) * (level - 100);
            let kicker = 0;
            if (level > p.kickerStart) {
                kicker = p.convexFactor * Math.pow(level - p.kickerStart, 2) / 100;
            }
            return Math.min(p.cap, linear + kicker);
        },
        annotations: [
            { y: 100, label: "Capital", color: "#10b981", horizontal: true },
            { x: 120, label: "Kicker Start", color: "#f97316" },
            { y: 190, label: "Convex Cap", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 60, to: 120, color: "rgba(16, 185, 129, 0.12)", label: "Linear participation" },
            { from: 120, to: 160, color: "rgba(59, 130, 246, 0.12)", label: "Quadratic boost" }
        ]
    },

    "Commola": {
        type: "capital-protection",
        xRange: [60, 150],
        yRange: [90, 170],
        params: {
            participation: 110,
            floor: 100,
            cap: 165
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level <= 100) return p.floor;
            const payoff = 100 + (p.participation / 100) * (level - 100);
            return Math.min(p.cap, payoff);
        },
        annotations: [
            { y: 100, label: "Capital Floor", color: "#10b981", horizontal: true },
            { y: 165, label: "Dynamic Cap", color: "#8b5cf6", horizontal: true }
        ],
        zones: [
            { from: 60, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Principal preserved" },
            { from: 100, to: 150, color: "rgba(251, 191, 36, 0.12)", label: "Overweighted winners" }
        ]
    },

    "Equity Linked Note (ELN)": {
        type: "income",
        xRange: [40, 160],
        yRange: [40, 140],
        params: {
            strike: 95,
            discountCoupon: 3
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= p.strike) {
                return 100 + p.discountCoupon;
            }
            const redemption = (level / p.strike) * 100;
            return Math.max(0, redemption);
        },
        annotations: [
            { x: 95, label: "Strike", color: "#6366f1" },
            { y: 103, label: "Discounted Redemption", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 40, to: 95, color: "rgba(239, 68, 68, 0.12)", label: "Share delivery zone" },
            { from: 95, to: 160, color: "rgba(251, 191, 36, 0.12)", label: "Cash redemption" }
        ]
    },

    "Dual Currency Deposit (SuperBall)": {
        type: "fx-structured",
        xRange: [80, 120],
        yRange: [80, 115],
        params: {
            strike: 100,
            coupon: 2
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= p.strike) {
                return 100 + p.coupon;
            }
            return (level / p.strike) * 100;
        },
        annotations: [
            { x: 100, label: "Conversion Strike", color: "#6366f1" },
            { y: 102, label: "Coupon in base currency", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 80, to: 100, color: "rgba(239, 68, 68, 0.12)", label: "Repaid in alternate currency" },
            { from: 100, to: 120, color: "rgba(16, 185, 129, 0.12)", label: "Par + coupon" }
        ]
    },

    // Capital Protection Note with Barrier (Call Up-and-Out with rebate, no leverage)
    "Capital Protection Note with Barrier": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [80, 140],
        params: {
            koBarrier: 120,      // Up-and-Out barrier as % of S0
            participation: 100,  // No leverage
            rebate: 3            // Fixed coupon if KO occurs
        },
        calculate: function(S, S0 = 100) {
            const perfPct = (S / S0) * 100;
            if (perfPct >= this.params.koBarrier) {
                // Knocked out → capital plus rebate
                return 100 + this.params.rebate;
            }
            // Not knocked out → vanilla call participation from strike 100%
            const upside = Math.max(0, perfPct - 100);
            return 100 + (this.params.participation / 100) * upside;
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { x: 120, label: "KO Barrier", color: "#f43f5e" },
            { y: 100, label: "Capital", color: "#10b981" },
            { y: 103, label: "+Rebate (KO)", color: "#f59e0b" }
        ]
    },

    // Wedding Cake (Capital-protected range coupons)
    "Wedding Cake": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [80, 140],
        params: {
            lowerRange1: 90,   // tighter high-coupon range lower bound (% of S0)
            upperRange1: 110,  // tighter high-coupon range upper bound
            lowerRange2: 80,   // wider reduced-coupon range lower bound
            upperRange2: 120,  // wider reduced-coupon range upper bound
            couponHigh: 12,    // high coupon paid if inside [lowerRange1, upperRange1]
            couponLow: 5       // reduced coupon if inside [lowerRange2, upperRange2] only
        },
        calculate: function(S, S0 = 100) {
            const perfPct = (S / S0) * 100;
            const p = this.params;
            if (perfPct >= p.lowerRange1 && perfPct <= p.upperRange1) {
                return 100 + p.couponHigh;
            }
            if (perfPct >= p.lowerRange2 && perfPct <= p.upperRange2) {
                return 100 + p.couponLow;
            }
            return 100; // capital protected at maturity
        },
        annotations: [
            { x: 90, label: "L1", color: "#f59e0b" },
            { x: 110, label: "U1", color: "#f59e0b" },
            { x: 80, label: "L2", color: "#a3e635" },
            { x: 120, label: "U2", color: "#a3e635" },
            { y: 112, label: "+High Coupon", color: "#f59e0b" },
            { y: 105, label: "+Low Coupon", color: "#a3e635" },
            { y: 100, label: "Capital", color: "#10b981" }
        ]
    },

    // Shark Fin (Capital-protected Call Up-and-Out)
    "Shark Fin": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [80, 140],
        params: {
            koBarrier: 120,      // Up-and-Out barrier as % of S0
            participation: 150    // Upside participation (%) while barrier not breached
        },
        calculate: function(S, S0 = 100) {
            const perfPct = (S / S0) * 100;
            // Path dependency (KO) approximated by terminal level for visualization
            if (perfPct >= this.params.koBarrier) {
                // Knocked out: only capital is returned (capital-protected structure)
                return 100;
            }
            // Not knocked out: vanilla call participation on the upside
            const upside = Math.max(0, perfPct - 100);
            return 100 + (this.params.participation / 100) * upside;
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { x: 120, label: "KO Barrier", color: "#f43f5e" },
            { y: 100, label: "Capital", color: "#10b981" }
        ]
    },

    // Selection products (generic approximations for visualization)
    "Magic Asian": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [80, 150],
        params: {
            participation: 100
        },
        calculate: function(S, S0 = 100) {
            const perfPct = (S / S0) * 100;
            if (perfPct <= 100) return 100; // capital protection at maturity
            // Asian averaging dampens upside: model as 70% participation beyond the strike
            return 100 + 0.7 * (perfPct - 100);
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { y: 100, label: "Capital", color: "#10b981" }
        ]
    },

    "Himalaya": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [80, 160],
        params: {
            participation: 100
        },
        calculate: function(S, S0 = 100) {
            const perfPct = (S / S0) * 100;
            if (perfPct <= 100) return 100;
            // Simplified: show upside participation; real path lock-ins not modeled here
            return 100 + (perfPct - 100);
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { y: 100, label: "Capital", color: "#10b981" }
        ]
    },

    "Captibasket": {
        type: "capital-protection",
        xRange: [40, 160],
        yRange: [80, 150],
        params: {
            cap: 45 // cap on averaged performance (illustrative)
        },
        calculate: function(S, S0 = 100) {
            const perfPct = (S / S0) * 100;
            if (perfPct <= 100) return 100;
            const upside = perfPct - 100;
            return 100 + Math.min(upside, this.params.cap);
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { y: 100, label: "Capital", color: "#10b981" },
            { y: 145, label: "Cap (avg)", color: "#f59e0b" }
        ]
    },

    "Twin Win": {
        type: "leverage",
        xRange: [30, 150],
        yRange: [20, 180],
        params: {
            kiBarrier: 60,
            strike: 100
        },
        calculate: function(S, S0 = 100, kiTriggered = false) {
            const perf = ((S - S0) / S0) * 100;
            // Simulate KI based on S value (simplified - in reality it's path dependent)
            const actualKI = kiTriggered || S < this.params.kiBarrier;
            
            if (actualKI) {
                // KI triggered: linear payoff
                return 100 + perf;
            } else {
                // No KI: mirror effect
                return 100 + Math.abs(perf);
            }
        },
        annotations: [
            { x: 60, label: "KI Barrier", color: "#ef4444" },
            { x: 100, label: "Strike", color: "#6366f1" }
        ],
        zones: [
            { from: 0, to: 60, color: "rgba(239, 68, 68, 0.15)", label: "KI Zone" },
            { from: 60, to: 140, color: "rgba(16, 185, 129, 0.1)", label: "Mirror Zone" }
        ],
        dualLine: true // Special flag for products with conditional payoff
    },

    "KIKO (Knock-In Knock-Out)": {
        type: "phoenix",
        xRange: [40, 120],
        yRange: [40, 150],
        params: {
            couponBarrier: 80,
            koBarrier: 105,
            kiBarrier: 60,
            coupon: 12
        },
        calculate: function(S, S0 = 100, year = 3) {
            const p = this.params;
            const level = (S / S0) * 100;
            const couponsAccrued = year * p.coupon;

            if (level >= p.koBarrier) {
                return 100 + couponsAccrued;
            }
            if (level >= p.kiBarrier) {
                const couponComponent = level >= p.couponBarrier ? p.coupon : 0;
                return 100 + couponComponent;
            }
            return level;
        },
        annotations: [
            { x: 105, label: "KO", color: "#10b981" },
            { x: 80, label: "Coupon Barrier", color: "#f59e0b" },
            { x: 60, label: "KI", color: "#ef4444" }
        ],
        zones: [
            { from: 0, to: 60, color: "rgba(239, 68, 68, 0.15)", label: "Knock-In loss" },
            { from: 60, to: 105, color: "rgba(251, 191, 36, 0.12)", label: "Coupons accrue" },
            { from: 105, to: 120, color: "rgba(16, 185, 129, 0.12)", label: "Autocall zone" }
        ]
    },

    "Targeted Accrual Redemption Note (TARN)": {
        type: "phoenix",
        xRange: [40, 160],
        yRange: [40, 160],
        params: {
            couponBarrier: 100,
            capitalBarrier: 70,
            couponPerYear: 6,
            target: 18,
            maxCoupons: 4
        },
        calculate: function(S, S0 = 100, year = 3) {
            const p = this.params;
            const level = (S / S0) * 100;
            const coupons = Math.min(year * p.couponPerYear, p.target);

            if (level >= p.couponBarrier) {
                return 100 + coupons;
            }
            if (level >= p.capitalBarrier) {
                return 100 + Math.min(coupons, p.target * 0.5);
            }
            return level;
        },
        annotations: [
            { x: 100, label: "Coupon Trigger", color: "#6366f1" },
            { x: 70, label: "Capital Barrier", color: "#ef4444" },
            { y: 118, label: "Target Reached", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 0, to: 70, color: "rgba(239, 68, 68, 0.15)", label: "Capital at risk" },
            { from: 70, to: 100, color: "rgba(251, 191, 36, 0.12)", label: "Accrual continues" },
            { from: 100, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "Target accrual" }
        ]
    },

    "Outperformer": {
        type: "leverage",
        xRange: [40, 160],
        yRange: [0, 220],
        params: {
            participation: 200, // leveraged upside (% of underlying move)
            cap: 160
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= 100) {
                const leveraged = 100 + (p.participation / 100) * (level - 100);
                return p.cap ? Math.min(p.cap, leveraged) : leveraged;
            }
            return level; // full downside participation (no capital protection)
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { y: 160, label: "Cap", color: "#10b981", horizontal: true }
        ],
        zones: [
            { from: 40, to: 100, color: "rgba(239, 68, 68, 0.12)", label: "Full downside" },
            { from: 100, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "Leveraged upside" }
        ],
        extraCurves: [
            {
                label: "Outperformer (Uncapped)",
                calculate: function(S, S0 = 100) {
                    const p = this.params;
                    const level = (S / S0) * 100;
                    if (level >= 100) {
                        return 100 + (p.participation / 100) * (level - 100);
                    }
                    return level;
                }
            }
        ]
    },

    "Tracker": {
        type: "tracker",
        xRange: [60, 140],
        yRange: [60, 140],
        params: {},
        calculate: function(S, S0 = 100) {
            return (S / S0) * 100;
        },
        annotations: [
            { x: 100, label: "Initial", color: "#6366f1" }
        ],
        zones: [
            { from: 60, to: 140, color: "rgba(99, 102, 241, 0.08)", label: "Direct replication" }
        ]
    },

    // Vertical spreads (options strategies)
    "Call Spread / Put Spread": {
        type: "options-spread",
        xRange: [60, 140],
        yRange: [-20, 25],
        params: {
            lowerStrike: 100,
            upperStrike: 115,
            netPremium: 4 // net premium paid (in % of notional)
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const intrinsic = Math.min(Math.max(S - p.lowerStrike, 0), p.upperStrike - p.lowerStrike);
            const payoffPct = (intrinsic / S0) * 100;
            return payoffPct - p.netPremium;
        },
        annotations: [
            { x: 100, label: "Long Call K1", color: "#6366f1" },
            { x: 104, label: "Break-even", color: "#6b7280" },
            { x: 115, label: "Short Call K2", color: "#f97316" },
            { y: 11, label: "Max Gain", color: "#10b981", horizontal: true },
            { y: -4, label: "Max Loss", color: "#ef4444", horizontal: true }
        ],
        zones: [
            { from: 100, to: 115, color: "rgba(59, 130, 246, 0.12)", label: "Rising payoff" },
            { from: 115, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Capped gain" }
        ]
    },

    // Options Strategies
    "Long Strangle": {
        type: "volatility",
        xRange: [60, 140],
        yRange: [-40, 80],
        params: {
            callStrike: 110,
            putStrike: 90,
            totalPremium: 8
        },
        calculate: function(S, S0 = 100) {
            const callValue = Math.max(0, S - this.params.callStrike);
            const putValue = Math.max(0, this.params.putStrike - S);
            return callValue + putValue - this.params.totalPremium;
        },
        annotations: [
            { x: 90, label: "Put Strike", color: "#6366f1" },
            { x: 110, label: "Call Strike", color: "#6366f1" },
            { y: -8, label: "Total Premium", color: "#f97316", horizontal: true }
        ],
        zones: [
            { from: 60, to: 90, color: "rgba(16, 185, 129, 0.12)", label: "Put profit" },
            { from: 90, to: 110, color: "rgba(239, 68, 68, 0.12)", label: "Premium loss" },
            { from: 110, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Call profit" }
        ]
    },

    "Short Strangle": {
        type: "volatility",
        xRange: [60, 140],
        yRange: [-80, 40],
        params: {
            callStrike: 110,
            putStrike: 90,
            totalPremium: 8
        },
        calculate: function(S, S0 = 100) {
            const callValue = Math.max(0, S - this.params.callStrike);
            const putValue = Math.max(0, this.params.putStrike - S);
            return this.params.totalPremium - callValue - putValue;
        },
        annotations: [
            { x: 90, label: "Short Put", color: "#f97316" },
            { x: 110, label: "Short Call", color: "#f97316" },
            { y: 8, label: "Premium Collected", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 60, to: 90, color: "rgba(239, 68, 68, 0.12)", label: "Put loss" },
            { from: 90, to: 110, color: "rgba(16, 185, 129, 0.12)", label: "Premium zone" },
            { from: 110, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Call loss" }
        ]
    },

    "Long Butterfly Call": {
        type: "volatility",
        xRange: [60, 140],
        yRange: [-20, 40],
        params: {
            lowerStrike: 90,
            middleStrike: 100,
            upperStrike: 110,
            netCost: 3
        },
        calculate: function(S, S0 = 100) {
            const longCall1 = Math.max(0, S - this.params.lowerStrike);
            const shortCall2 = 2 * Math.max(0, S - this.params.middleStrike);
            const longCall3 = Math.max(0, S - this.params.upperStrike);
            return longCall1 - shortCall2 + longCall3 - this.params.netCost;
        },
        annotations: [
            { x: 90, label: "Long Call K1", color: "#6366f1" },
            { x: 100, label: "Short Call K2", color: "#f97316" },
            { x: 110, label: "Long Call K3", color: "#6366f1" },
            { y: 7, label: "Max Profit", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 90, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Rising profit" },
            { from: 100, to: 110, color: "rgba(16, 185, 129, 0.12)", label: "Peak profit" },
            { from: 110, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Declining profit" }
        ]
    },

    "Short Butterfly Call": {
        type: "volatility",
        xRange: [60, 140],
        yRange: [-40, 20],
        params: {
            lowerStrike: 90,
            middleStrike: 100,
            upperStrike: 110,
            netCredit: 3
        },
        calculate: function(S, S0 = 100) {
            const shortCall1 = Math.max(0, S - this.params.lowerStrike);
            const longCall2 = 2 * Math.max(0, S - this.params.middleStrike);
            const shortCall3 = Math.max(0, S - this.params.upperStrike);
            return this.params.netCredit - shortCall1 + longCall2 - shortCall3;
        },
        annotations: [
            { x: 90, label: "Short Call K1", color: "#f97316" },
            { x: 100, label: "Long Call K2", color: "#6366f1" },
            { x: 110, label: "Short Call K3", color: "#f97316" },
            { y: 3, label: "Max Profit", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 60, to: 90, color: "rgba(16, 185, 129, 0.12)", label: "Premium zone" },
            { from: 90, to: 100, color: "rgba(239, 68, 68, 0.12)", label: "Declining profit" },
            { from: 100, to: 110, color: "rgba(239, 68, 68, 0.12)", label: "Peak loss" },
            { from: 110, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Rising profit" }
        ]
    },

    "Long Iron Condor": {
        type: "volatility",
        xRange: [60, 140],
        yRange: [-20, 40],
        params: {
            putStrike1: 85,
            putStrike2: 90,
            callStrike1: 110,
            callStrike2: 115,
            netCredit: 2
        },
        calculate: function(S, S0 = 100) {
            const call1 = Math.max(0, S - this.params.putStrike1);
            const call2 = Math.max(0, S - this.params.putStrike2);
            const call3 = Math.max(0, S - this.params.callStrike1);
            const call4 = Math.max(0, S - this.params.callStrike2);
            return call1 - call2 - call3 + call4 + this.params.netCredit;
        },
        annotations: [
            { x: 85, label: "Long Put", color: "#6366f1" },
            { x: 90, label: "Short Put", color: "#f97316" },
            { x: 110, label: "Long Call", color: "#6366f1" },
            { x: 115, label: "Short Call", color: "#f97316" },
            { y: 2, label: "Max Profit", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 60, to: 90, color: "rgba(16, 185, 129, 0.12)", label: "Put profit" },
            { from: 90, to: 110, color: "rgba(16, 185, 129, 0.12)", label: "Premium zone" },
            { from: 110, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Call profit" }
        ]
    },

    "Short Iron Condor": {
        type: "volatility",
        xRange: [60, 140],
        yRange: [-40, 20],
        params: {
            putStrike1: 85,
            putStrike2: 90,
            callStrike1: 110,
            callStrike2: 115,
            netDebit: 2
        },
        calculate: function(S, S0 = 100) {
            const call1 = Math.max(0, S - this.params.putStrike1);
            const call2 = Math.max(0, S - this.params.putStrike2);
            const call3 = Math.max(0, S - this.params.callStrike1);
            const call4 = Math.max(0, S - this.params.callStrike2);
            return -(call1 - call2 - call3 + call4) + this.params.netDebit;
        },
        annotations: [
            { x: 85, label: "Short Put", color: "#f97316" },
            { x: 90, label: "Long Put", color: "#6366f1" },
            { x: 110, label: "Short Call", color: "#f97316" },
            { x: 115, label: "Long Call", color: "#6366f1" },
            { y: -2, label: "Max Loss", color: "#ef4444", horizontal: true }
        ],
        zones: [
            { from: 60, to: 90, color: "rgba(239, 68, 68, 0.12)", label: "Put loss" },
            { from: 90, to: 110, color: "rgba(16, 185, 129, 0.12)", label: "Premium zone" },
            { from: 110, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Call loss" }
        ]
    },

    "Long Iron Butterfly": {
        type: "volatility",
        xRange: [60, 140],
        yRange: [-20, 40],
        params: {
            putStrike: 90,
            callStrike: 100,
            putStrike2: 100,
            callStrike2: 110,
            netCredit: 2
        },
        calculate: function(S, S0 = 100) {
            const shortPut = Math.max(0, this.params.putStrike2 - S);
            const longPut = Math.max(0, this.params.putStrike - S);
            const longCall = Math.max(0, S - this.params.callStrike);
            const shortCall = Math.max(0, S - this.params.callStrike2);
            return this.params.netCredit - shortPut + longPut + longCall - shortCall;
        },
        annotations: [
            { x: 90, label: "Long Put", color: "#6366f1" },
            { x: 100, label: "Short Put/Call", color: "#f97316" },
            { x: 110, label: "Long Call", color: "#6366f1" },
            { y: 2, label: "Max Profit", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 60, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Put profit" },
            { from: 100, to: 110, color: "rgba(16, 185, 129, 0.12)", label: "Call profit" }
        ]
    },

    "Short Iron Butterfly": {
        type: "volatility",
        xRange: [60, 140],
        yRange: [-40, 20],
        params: {
            putStrike: 90,
            callStrike: 100,
            putStrike2: 100,
            callStrike2: 110,
            netDebit: 2
        },
        calculate: function(S, S0 = 100) {
            const longPut = Math.max(0, this.params.putStrike2 - S);
            const shortPut = Math.max(0, this.params.putStrike - S);
            const shortCall = Math.max(0, S - this.params.callStrike);
            const longCall = Math.max(0, S - this.params.callStrike2);
            return longPut - shortPut - shortCall + longCall - this.params.netDebit;
        },
        annotations: [
            { x: 90, label: "Short Put", color: "#f97316" },
            { x: 100, label: "Long Put/Call", color: "#6366f1" },
            { x: 110, label: "Short Call", color: "#f97316" },
            { y: -2, label: "Max Loss", color: "#ef4444", horizontal: true }
        ],
        zones: [
            { from: 60, to: 100, color: "rgba(239, 68, 68, 0.12)", label: "Put loss" },
            { from: 100, to: 110, color: "rgba(239, 68, 68, 0.12)", label: "Call loss" }
        ]
    },

    "Long Calendar Spread": {
        type: "time-decay",
        xRange: [60, 140],
        yRange: [-20, 40],
        params: {
            strike: 100,
            shortPremium: 3,
            longPremium: 5,
            timeValue: 2
        },
        calculate: function(S, S0 = 100) {
            const intrinsic = Math.max(0, S - this.params.strike);
            const shortValue = intrinsic + this.params.shortPremium;
            const longValue = intrinsic + this.params.longPremium + this.params.timeValue;
            return longValue - shortValue;
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { y: 2, label: "Time Value", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 60, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Time decay benefit" }
        ]
    },

    "Short Calendar Spread": {
        type: "time-decay",
        xRange: [60, 140],
        yRange: [-40, 20],
        params: {
            strike: 100,
            longPremium: 3,
            shortPremium: 5,
            timeValue: 2
        },
        calculate: function(S, S0 = 100) {
            const intrinsic = Math.max(0, S - this.params.strike);
            const longValue = intrinsic + this.params.longPremium;
            const shortValue = intrinsic + this.params.shortPremium - this.params.timeValue;
            return shortValue - longValue;
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { y: -2, label: "Time Decay", color: "#ef4444", horizontal: true }
        ],
        zones: [
            { from: 60, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Time decay cost" }
        ]
    },

    "Long Box Spread": {
        type: "arbitrage",
        xRange: [60, 140],
        yRange: [-10, 30],
        params: {
            lowerStrike: 90,
            upperStrike: 110,
            netCost: 18
        },
        calculate: function(S, S0 = 100) {
            const longCall = Math.max(0, S - this.params.lowerStrike);
            const shortCall = Math.max(0, S - this.params.upperStrike);
            const shortPut = Math.max(0, this.params.upperStrike - S);
            const longPut = Math.max(0, this.params.lowerStrike - S);
            return longCall - shortCall + shortPut - longPut - this.params.netCost;
        },
        annotations: [
            { x: 90, label: "Long Call/Put", color: "#6366f1" },
            { x: 110, label: "Short Call/Put", color: "#f97316" },
            { y: 2, label: "Risk-Free Profit", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 60, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Arbitrage profit" }
        ]
    },

    "Short Box Spread": {
        type: "arbitrage",
        xRange: [60, 140],
        yRange: [-30, 10],
        params: {
            lowerStrike: 90,
            upperStrike: 110,
            netCredit: 18
        },
        calculate: function(S, S0 = 100) {
            return this.params.netCredit - (this.params.upperStrike - this.params.lowerStrike);
        },
        annotations: [
            { x: 90, label: "Short Call/Put", color: "#f97316" },
            { x: 110, label: "Long Call/Put", color: "#6366f1" },
            { y: -2, label: "Arbitrage Loss", color: "#ef4444", horizontal: true }
        ],
        zones: [
            { from: 60, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Arbitrage loss" }
        ]
    },

    "Warrant": {
        type: "leverage",
        xRange: [60, 160],
        yRange: [0, 800],
        params: {
            strike: 110,
            premium: 8
        },
        calculate: function(S) {
            const intrinsic = Math.max(0, S - this.params.strike);
            return (intrinsic / this.params.premium) * 100;
        },
        annotations: [
            { x: 110, label: "Strike", color: "#6366f1" },
            { x: 118, label: "Break-even", color: "#6b7280" }
        ],
        zones: [
            { from: 110, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "In the money" },
            { from: 60, to: 110, color: "rgba(239, 68, 68, 0.12)", label: "Premium at risk" }
        ]
    },

    "Warrant with Knock-Out": {
        type: "leverage",
        xRange: [60, 160],
        yRange: [0, 800],
        params: {
            strike: 110,
            premium: 5,
            knockOutBarrier: 150
        },
        calculate: function(S) {
            if (S >= this.params.knockOutBarrier) {
                return 0;
            }
            const intrinsic = Math.max(0, S - this.params.strike);
            return (intrinsic / this.params.premium) * 100;
        },
        annotations: [
            { x: 110, label: "Strike", color: "#6366f1" },
            { x: 115, label: "Break-even", color: "#6b7280" },
            { x: 150, label: "Knock-Out", color: "#ef4444" }
        ],
        zones: [
            { from: 110, to: 150, color: "rgba(251, 191, 36, 0.12)", label: "Active" },
            { from: 150, to: 160, color: "rgba(239, 68, 68, 0.12)", label: "KO triggered" },
            { from: 60, to: 110, color: "rgba(239, 68, 68, 0.12)", label: "Premium at risk" }
        ]
    },

    "Target Redemption Forward (TARF) - FX": {
        type: "fx-structured",
        xRange: [85, 120],
        yRange: [70, 140],
        params: {
            strike: 100,
            target: 12,
            upsideGearing: 1.5,
            downsideGearing: 2,
            floor: 70
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            if (level >= p.strike) {
                const upside = 100 + p.upsideGearing * (level - p.strike);
                return Math.min(100 + p.target, upside);
            }
            const downside = 100 - p.downsideGearing * (p.strike - level);
            return Math.max(p.floor, downside);
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { y: 112, label: "Target Knock-out", color: "#22c55e", horizontal: true },
            { y: 70, label: "Loss Floor", color: "#ef4444", horizontal: true }
        ],
        zones: [
            { from: 85, to: 100, color: "rgba(239, 68, 68, 0.12)", label: "Loss leg (2×)" },
            { from: 100, to: 120, color: "rgba(16, 185, 129, 0.12)", label: "Accrual towards target" }
        ]
    },

    "Pivot Target Redemption Forward (Pivot TRF) - FX": {
        type: "fx-structured",
        xRange: [85, 125],
        yRange: [75, 130],
        params: {
            pivot: 100,
            rangeWidth: 6,
            target: 10,
            rangeParticipation: 1.2,
            penalty: 1.8,
            floor: 70
        },
        calculate: function(S, S0 = 100) {
            const p = this.params;
            const level = (S / S0) * 100;
            const deviation = Math.abs(level - p.pivot);
            if (deviation <= p.rangeWidth) {
                const gain = Math.min(p.target, p.rangeParticipation * (p.rangeWidth - deviation));
                return 100 + gain;
            }
            const loss = p.penalty * (deviation - p.rangeWidth);
            return Math.max(p.floor, 100 - loss);
        },
        annotations: [
            { x: 100, label: "Pivot", color: "#6366f1" },
            { x: 94, label: "K1", color: "#10b981" },
            { x: 106, label: "K2", color: "#10b981" },
            { y: 110, label: "Target", color: "#22c55e", horizontal: true }
        ],
        zones: [
            { from: 94, to: 106, color: "rgba(16, 185, 129, 0.12)", label: "Profitable range" },
            { from: 85, to: 94, color: "rgba(239, 68, 68, 0.12)", label: "Downside" },
            { from: 106, to: 125, color: "rgba(239, 68, 68, 0.12)", label: "Downside" }
        ]
    },

    "Autocallable (Athena Classic)": {
        type: "phoenix",
        xRange: [40, 160],
        yRange: [20, 180],
        params: {
            autocallBarrier: 100,
            protectionBarrier: 60,
            coupon: 9
        },
        calculate: function(S, S0 = 100, year = 3) {
            const perfPct = (S / S0) * 100;
            
            if (perfPct >= this.params.autocallBarrier) {
                // Autocalled: return 100 + accumulated coupons
                return 100 + (year * this.params.coupon);
            } else if (perfPct >= this.params.protectionBarrier) {
                // At maturity, above protection: return 100
                return 100;
            } else {
                // Below protection: linear loss
                return perfPct;
            }
        },
        annotations: [
            { x: 100, label: "Autocall", color: "#10b981" },
            { x: 60, label: "Protection", color: "#ef4444" }
        ],
        zones: [
            { from: 0, to: 60, color: "rgba(239, 68, 68, 0.15)", label: "Loss Zone" },
            { from: 60, to: 100, color: "rgba(251, 191, 36, 0.1)", label: "Protected" },
            { from: 100, to: 140, color: "rgba(16, 185, 129, 0.1)", label: "Autocall" }
        ]
    },

    "Autocallable (Athena Airbag)": {
        type: "phoenix",
        xRange: [40, 160],
        yRange: [20, 180],
        params: {
            autocallBarrier: 100,
            protectionBarrier: 60,
            coupon: 9,
            airbagFactor: 0.6
        },
        calculate: function(S, S0 = 100, year = 3) {
            const p = this.params;
            const perfPct = (S / S0) * 100;

            if (perfPct >= p.autocallBarrier) {
                return 100 + (year * p.coupon);
            }
            if (perfPct >= p.protectionBarrier) {
                return 100;
            }

            const factor = p.airbagFactor && p.airbagFactor > 0 ? p.airbagFactor : 1;
            const cushioned = perfPct / factor;
            return Math.max(0, Math.min(100, cushioned));
        },
        annotations: [
            { x: 100, label: "Autocall", color: "#10b981" },
            { x: 60, label: "Airbag Barrier", color: "#ef4444" },
            { y: 100, label: "Capital @ Barrier", color: "#6366f1", horizontal: true }
        ],
        zones: [
            { from: 0, to: 60, color: "rgba(251, 191, 36, 0.12)", label: "Airbag cushioning" },
            { from: 60, to: 100, color: "rgba(251, 191, 36, 0.1)", label: "Protected" },
            { from: 100, to: 140, color: "rgba(16, 185, 129, 0.1)", label: "Autocall" }
        ]
    },

    // Phoenix (Memory) - generic config
    "Phoenix (Memory)": {
        type: "phoenix",
        xRange: [40, 160],
        yRange: [20, 180],
        params: {
            couponBarrier: 60,
            autocallBarrier: 100,
            protectionBarrier: 60,
            coupon: 8
        },
        calculate: function(S, S0 = 100, year = 3) {
            const perfPct = (S / S0) * 100;
            if (perfPct >= this.params.autocallBarrier) {
                return 100 + (year * this.params.coupon);
            }
            if (perfPct >= this.params.protectionBarrier) {
                return 100;
            }
            return perfPct;
        },
        annotations: [
            { x: 100, label: "Autocall", color: "#10b981" },
            { x: 60, label: "Coupon/Prot", color: "#f59e0b" }
        ],
        zones: [
            { from: 0, to: 60, color: "rgba(239, 68, 68, 0.15)", label: "Loss Zone" },
            { from: 60, to: 100, color: "rgba(251, 191, 36, 0.1)", label: "Coupons/Protected" },
            { from: 100, to: 140, color: "rgba(16, 185, 129, 0.1)", label: "Autocall" }
        ]
    }
    ,
    // =============================
    // Income Products (Reverse Convertibles family)
    // =============================
    "Barrier Reverse Convertible": {
        type: "income",
        xRange: [40, 160],
        yRange: [20, 180],
        params: {
            capitalBarrier: 60, // capital KI barrier (% of S0)
            couponPerYear: 10,  // % p.a.
            years: 2            // illustrative total years for coupon accumulation
        },
        calculate: function(S, S0 = 100) {
            const perfPct = (S / S0) * 100;
            const coupons = this.params.years * this.params.couponPerYear;
            if (perfPct >= this.params.capitalBarrier) {
                return 100 + coupons;
            }
            return perfPct + coupons;
        },
        annotations: [
            { x: 60, label: "Capital Barrier", color: "#ef4444" },
            { y: 100, label: "Principal", color: "#10b981" },
            { y: 120, label: "+Coupons (2y × 10%)", color: "#f59e0b" }
        ]
    },

    "Standard Reverse Convertible": {
        type: "income",
        xRange: [40, 160],
        yRange: [20, 180],
        params: {
            strike: 100,
            couponPerYear: 9,
            years: 2
        },
        calculate: function(S, S0 = 100) {
            const perfPct = (S / S0) * 100;
            const coupons = this.params.years * this.params.couponPerYear;
            if (perfPct >= this.params.strike) {
                return 100 + coupons;
            }
            return perfPct + coupons;
        },
        annotations: [
            { x: 100, label: "Strike", color: "#6366f1" },
            { y: 100, label: "Principal", color: "#10b981" }
        ]
    },

    "Callable BRC": {
        type: "income",
        xRange: [40, 160],
        yRange: [20, 180],
        params: {
            capitalBarrier: 60,
            couponPerYear: 11,
            years: 3
        },
        calculate: function(S, S0 = 100) {
            // Visualization approximates terminal redemption; issuer call not explicitly modeled
            const perfPct = (S / S0) * 100;
            const coupons = this.params.years * this.params.couponPerYear;
            if (perfPct >= this.params.capitalBarrier) {
                return 100 + coupons;
            }
            return perfPct + coupons;
        },
        annotations: [
            { x: 60, label: "Capital Barrier", color: "#ef4444" },
            { y: 133, label: "+Coupons (3y × 11%)", color: "#f59e0b" }
        ]
    },

    "Trigger BRC": {
        type: "phoenix", // use multi-line rendering per observation year
        xRange: [40, 160],
        yRange: [20, 180],
        params: {
            trigger: 100,         // autocall trigger
            capitalBarrier: 60,   // protection threshold at maturity
            couponPerYear: 9
        },
        calculate: function(S, S0 = 100, year = 3) {
            const perfPct = (S / S0) * 100;
            const coupons = year * this.params.couponPerYear;
            if (perfPct >= this.params.trigger) {
                // Autocalled on/before this year
                return 100 + coupons;
            }
            if (perfPct >= this.params.capitalBarrier) {
                // Not called; at maturity protected + coupons
                return 100 + coupons;
            }
            // Below capital barrier → proportional loss plus coupons
            return perfPct + coupons;
        },
        annotations: [
            { x: 100, label: "Trigger", color: "#10b981" },
            { x: 60, label: "Capital Barrier", color: "#ef4444" }
        ]
    },

    "Barrier Reverse (Conditional Coupons)": {
        type: "phoenix", // show how coupons accumulate conditionally per year
        xRange: [40, 160],
        yRange: [20, 180],
        params: {
            couponBarrier: 80,    // coupon paid if S_t ≥ this level
            capitalBarrier: 60,   // maturity protection
            couponPerYear: 7
        },
        calculate: function(S, S0 = 100, year = 3) {
            const perfPct = (S / S0) * 100;
            // Approximate: if terminal ≥ coupon barrier, assume coupons paid each year
            const coupons = (perfPct >= this.params.couponBarrier ? year : 0) * this.params.couponPerYear;
            if (perfPct >= this.params.capitalBarrier) {
                return 100 + coupons;
            }
            return perfPct + coupons;
        },
        annotations: [
            { x: 80, label: "Coupon Barrier", color: "#f59e0b" },
            { x: 60, label: "Capital Barrier", color: "#ef4444" }
        ]
    },

    // Hybrid income/autocall with conditional protection
    "Neptune": {
        type: "phoenix",
        xRange: [40, 160],
        yRange: [20, 180],
        params: {
            autocallBarrier: 108,
            capitalBarrier: 50,
            couponPerYear: 8
        },
        calculate: function(S, S0 = 100, year = 6) {
            const perfPct = (S / S0) * 100;
            const coupons = year * this.params.couponPerYear;
            if (perfPct >= this.params.autocallBarrier) {
                return 100 + coupons; // called earlier
            }
            if (perfPct >= this.params.capitalBarrier) {
                return 100 + coupons; // not called, protected at maturity
            }
            return perfPct; // barrier breached → proportional loss (ignore coupons)
        },
        annotations: [
            { x: 108, label: "Autocall", color: "#10b981" },
            { x: 50, label: "Capital Barrier", color: "#ef4444" }
        ]
    },

    "Fixed Coupon Callable Note (FCN)": {
        type: "phoenix",
        xRange: [40, 160],
        yRange: [20, 200],
        params: {
            koBarrier: 100,          // knock-out / autocall barrier (% of S0)
            protectionStrike: 70,    // protection strike (% of S0)
            couponPerYear: 12,       // fixed coupon per year (% of nominal)
            maxCoupons: 6            // limit observation lines
        },
        calculate: function(S, S0 = 100, year = 3) {
            const p = this.params;
            const level = (S / S0) * 100;
            const couponsAccrued = Math.min(year, p.maxCoupons) * p.couponPerYear;

            if (level >= p.koBarrier) {
                // Early redemption with coupon
                return 100 + couponsAccrued;
            }
            if (level > p.protectionStrike) {
                // Capital protected at maturity if worst-of stays above strike
                return 100;
            }
            // Below strike → redemption scales linearly with level/strike
            const payoff = (level / p.protectionStrike) * 100;
            return Math.max(0, payoff);
        },
        annotations: [
            { x: 100, label: "KO / Autocall", color: "#10b981" },
            { x: 70, label: "Protection Strike", color: "#f97316" }
        ],
        zones: [
            { from: 0, to: 70, color: "rgba(239, 68, 68, 0.15)", label: "Share delivery zone" },
            { from: 70, to: 100, color: "rgba(251, 191, 36, 0.12)", label: "Capital protected" },
            { from: 100, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "Autocall region" }
        ]
    }
};

// Helper function to get payoff data for a product
window.getPayoffData = function(productName) {
    if (!productName) return null;

    // Helper: normalize string (lowercase, remove accents, punctuation, extra spaces)
    function normalize(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // strip diacritics
            .replace(/[^a-z0-9]+/g, ' ')       // non-alphanum to space
            .trim()
            .replace(/\s+/g, ' ');
    }

    // Helper: deep clone preserving function references (JSON clone drops calculate)
    function cloneValue(value) {
        if (Array.isArray(value)) {
            return value.map(cloneValue);
        }
        if (value && typeof value === 'object') {
            const copy = {};
            Object.keys(value).forEach(key => {
                copy[key] = cloneValue(value[key]);
            });
            return copy;
        }
        return value;
    }

    // Helper to safely clone a config (avoid mutating base while keeping functions)
    function cloneConfig(baseKey) {
        const base = window.PAYOFF_DATA[baseKey];
        if (!base) return null;
        return cloneValue(base);
    }

    // 1) Exact key match first (raw)
    if (window.PAYOFF_DATA[productName]) return window.PAYOFF_DATA[productName];

    const nameRaw = String(productName);
    const name = nameRaw.toLowerCase();
    const nameNorm = normalize(nameRaw);

    // 2) Exact match by normalized keys
    const normalizedKeyToOriginal = {};
    Object.keys(window.PAYOFF_DATA).forEach(k => {
        normalizedKeyToOriginal[normalize(k)] = k;
    });
    if (normalizedKeyToOriginal[nameNorm]) {
        return cloneConfig(normalizedKeyToOriginal[nameNorm]);
    }

    // 3) Keyword-based mapping to generic configs (supports EN/FR and common aliases)
    // Capital protection family
    if (/capital protection|protection du capital|protected|capital-protected/.test(name) || /protected/.test(name)) {
        return cloneConfig('Capital Protection Note');
    }

    // Discount certificates
    if (/discount/.test(nameNorm)) {
        if (/trigger/.test(nameNorm) && /barrier/.test(nameNorm)) {
            return cloneConfig('Trigger Barrier Discount Certificate');
        }
        if (/barrier/.test(nameNorm)) {
            return cloneConfig('Barrier Discount Certificate');
        }
        return cloneConfig('Discount Certificate');
    }

    // Capital-protected allocation / themed notes
    if (/option\s*on\s*dynamic\s*basket|alternative\s*investment|\\bodb\\b/.test(nameNorm)) {
        return cloneConfig('Option on Dynamic Basket (ODB) – Alternative Investment Note');
    }
    if (/cppi|constant\s*proportion\s*portfolio/.test(nameNorm)) {
        return cloneConfig('CPPI (Constant Proportion Portfolio Insurance)');
    }
    if (/profiler/.test(nameNorm)) {
        return cloneConfig('Profiler');
    }
    if (/capuccino/.test(nameNorm)) {
        return cloneConfig('Capuccino');
    }
    if (/quanto/.test(nameNorm)) {
        return cloneConfig('Quanto-style Option');
    }
    if (/rainbow/.test(nameNorm)) {
        return cloneConfig('Rainbow');
    }
    if (/lookback/.test(nameNorm)) {
        return cloneConfig('Lookback');
    }
    if (/starlight/.test(nameNorm)) {
        return cloneConfig('Starlight');
    }
    if (/titan/.test(nameNorm)) {
        return cloneConfig('Titan');
    }
    if (/commola/.test(nameNorm)) {
        return cloneConfig('Commola');
    }
    if (/predator/.test(nameNorm)) {
        return cloneConfig('Predator');
    }
    if (/stellar/.test(nameNorm)) {
        return cloneConfig('Stellar');
    }
    if (/cliquet/.test(nameNorm)) {
        return cloneConfig('Cliquet');
    }
    if (/ariane/.test(nameNorm)) {
        return cloneConfig('Ariane');
    }

    // Income / hybrid discount notes
    if (/equity\s*linked\s*note|\\beln\\b/.test(nameNorm)) {
        return cloneConfig('Equity Linked Note (ELN)');
    }

    if (/targeted\s*accrual|\\btarn\\b/.test(nameNorm)) {
        return cloneConfig('Targeted Accrual Redemption Note (TARN)');
    }

    // Capital-protected allocations and structured notes
    if (/option\s*on\s*dynamic\s*basket|alternative\s*investment\s*note|\\bodb\\b/.test(nameNorm)) {
        return cloneConfig('Option on Dynamic Basket (ODB) – Alternative Investment Note');
    }
    if (/cppi|constant\s*proportion\s*portfolio/.test(nameNorm)) {
        return cloneConfig('CPPI (Constant Proportion Portfolio Insurance)');
    }
    if (/predator/.test(nameNorm)) {
        return cloneConfig('Predator');
    }
    if (/stellar/.test(nameNorm)) {
        return cloneConfig('Stellar');
    }
    if (/cliquet/.test(nameNorm)) {
        return cloneConfig('Cliquet');
    }
    if (/ariane/.test(nameNorm)) {
        return cloneConfig('Ariane');
    }

    // Income / hybrid discount notes
    if (/equity\s*linked\s*note|\\beln\\b/.test(nameNorm)) {
        return cloneConfig('Equity Linked Note (ELN)');
    }

    // Dual Currency Deposits (FX)
    if (/dual\s*currency|superball|\\bdcd\\b/.test(nameNorm)) {
        return cloneConfig('Dual Currency Deposit (SuperBall)');
    }

    // KIKO structures
    if (/kiko/.test(nameNorm)) {
        return cloneConfig('KIKO (Knock-In Knock-Out)');
    }

    // Outperformer
    if (/outperformer/.test(nameNorm)) {
        return cloneConfig('Outperformer');
    }

    // Trackers
    if (/tracker/.test(nameNorm)) {
        return cloneConfig('Tracker');
    }

    // Bonus certificates
    if (/airbag/.test(nameNorm) && /bonus/.test(nameNorm)) {
        return cloneConfig('Airbag Bonus Certificate');
    }
    if ((/bonus certificate|certificat bonus/.test(nameNorm)) && !/airbag/.test(nameNorm)) {
        if (/capped|plafonn/.test(nameNorm)) {
            return cloneConfig('Capped Bonus Certificate');
        }
        return cloneConfig('Bonus Certificate');
    }

    // Fixed Coupon Callable Notes
    if (/fixed\s*coupon\s*callable|fcn/.test(nameNorm)) {
        return cloneConfig('Fixed Coupon Callable Note (FCN)');
    }

    // Targeted accrual structures
    if (/targeted\s*accrual|\\btarn\\b/.test(nameNorm)) {
        return cloneConfig('Targeted Accrual Redemption Note (TARN)');
    }

    // Phoenix / Autocall family (Athena, Apollon, Express, Premium Express, Crescendo, etc.) including Memory
    const isPhoenix = /phoenix|memoire|memoir|memory/.test(nameNorm);
    const isAutocall = /autocall|auto call|auto-call|athena|apollon|express|crescendo|escalator|bonus plus|premium express|performance auto call/.test(nameNorm);
    const hasAirbag = /airbag/.test(nameNorm);
    if (isPhoenix || isAutocall) {
        if (isPhoenix) return cloneConfig('Phoenix (Memory)');
        if (hasAirbag) return cloneConfig('Autocallable (Athena Airbag)');
        return cloneConfig('Autocallable (Athena Classic)');
    }

    // Reverse Convertibles family (Income)
    if (/barrier\s*reverse.*coupon/.test(nameNorm)) {
        return cloneConfig('Barrier Reverse (Conditional Coupons)');
    }

    if (/reverse convertible|rev\. convertible|rev convertible|brc/.test(nameNorm)) {
        if (/barrier/.test(nameNorm)) {
            if (/trigger|autocall/.test(nameNorm)) return cloneConfig('Trigger BRC');
            if (/callable|issuer/.test(nameNorm)) return cloneConfig('Callable BRC');
            if (/conditional\s*coupon|coupon\s*barrier|conditional\s*coupons/.test(nameNorm)) return cloneConfig('Barrier Reverse (Conditional Coupons)');
            return cloneConfig('Barrier Reverse Convertible');
        }
        return cloneConfig('Standard Reverse Convertible');
    }

    // Neptune (hybrid income/autocall)
    if (/neptune/.test(nameNorm)) {
        return cloneConfig('Neptune');
    }

    // FX Pivot TRF family
    if (/pivot\s*trf/.test(nameNorm)) {
        if (/axki|one\s*sided|one sided/.test(nameNorm)) {
            }
        return cloneConfig('Pivot Target Redemption Forward (Pivot TRF) - FX');
    }

    if (/target\s*redemption\s*forward|\\btarf\\b/.test(nameNorm)) {
        return cloneConfig('Target Redemption Forward (TARF) - FX');
    }

    // Warrants family
    if (/knock[\s-]*out\s*warrant|warrant\s*with\s*knock[\s-]*out|ko\s*warrant/.test(nameNorm)) {
        return cloneConfig('Warrant with Knock-Out');
    }
    if (/(^|\s)warrant(\s|$)/.test(nameNorm) && !nameNorm.includes('trace')) {
        return cloneConfig('Warrant');
    }

    // Dual Currency Deposit (FX)
    if (/dual\s*currency|superball|dcd|fx\s*deposit|forex/.test(nameNorm)) {
        return cloneConfig('Dual Currency Deposit (SuperBall)');
    }

    // Twin Win
    if (nameNorm.includes('twin win')) {
        return cloneConfig('Twin Win');
    }

    // Call/Put vertical spreads
    if (/call\s*spread|put\s*spread|vertical\s*spread/.test(nameNorm)) {
        const spreadConfig = cloneConfig('Call Spread / Put Spread');
        if (!spreadConfig) return null;

        if (/put\s*spread/.test(nameNorm)) {
            spreadConfig.params = {
                lowerStrike: 85,
                upperStrike: 100,
                netPremium: 4
            };
            spreadConfig.calculate = function(S, S0 = 100) {
                const p = this.params;
                const intrinsic = Math.min(Math.max(p.upperStrike - S, 0), p.upperStrike - p.lowerStrike);
                const payoffPct = (intrinsic / S0) * 100;
                return payoffPct - p.netPremium;
            };
            spreadConfig.annotations = [
                { x: 85, label: "Short Put K1", color: "#f97316" },
                { x: 96, label: "Break-even", color: "#6b7280" },
                { x: 100, label: "Long Put K2", color: "#6366f1" },
                { y: 11, label: "Max Gain", color: "#10b981", horizontal: true },
                { y: -4, label: "Max Loss", color: "#ef4444", horizontal: true }
            ];
            spreadConfig.zones = [
                { from: 60, to: 85, color: "rgba(59, 130, 246, 0.12)", label: "Gain capped" },
                { from: 96, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Loss beyond break-even" }
            ];
        }

        return spreadConfig;
    }

    // Options Strategies
    if (/strangle/.test(nameNorm)) {
        if (/short/.test(nameNorm)) return cloneConfig('Short Strangle');
        return cloneConfig('Long Strangle');
    }

    if (/butterfly|papillon/.test(nameNorm)) {
        if (/short/.test(nameNorm)) return cloneConfig('Short Butterfly Call');
        return cloneConfig('Long Butterfly Call');
    }

    if (/iron\s*condor|condor\s*de\s*fer/.test(nameNorm)) {
        if (/short/.test(nameNorm)) return cloneConfig('Short Iron Condor');
        return cloneConfig('Long Iron Condor');
    }

    if (/iron\s*butterfly|papillon\s*de\s*fer/.test(nameNorm)) {
        if (/short/.test(nameNorm)) return cloneConfig('Short Iron Butterfly');
        return cloneConfig('Long Iron Butterfly');
    }

    if (/calendar\s*spread|spread\s*calendaire/.test(nameNorm)) {
        if (/short/.test(nameNorm)) return cloneConfig('Short Calendar Spread');
        return cloneConfig('Long Calendar Spread');
    }

    if (/box\s*spread|spread\s*boite/.test(nameNorm)) {
        if (/short/.test(nameNorm)) return cloneConfig('Short Box Spread');
        return cloneConfig('Long Box Spread');
    }

    // 4) Known non-chart products: Credit-Linked Notes (CLN), Credit products, etc.
    // These often do not have a simple terminal payoff chart comparable to equity structures.
    if (/(^|\s)cln(\s|$)|credit\s*linked|credit-linked|credit\s*note|credit default|cdo|cdo squared/.test(nameNorm)) {
        return {
            type: 'none',
            noChart: true,
            reason: 'credit-linked',
            xRange: [80, 120],
            yRange: [80, 120],
            calculate: function() { return 100; }
        };
    }

    // 5) Generic fallback: no known mapping → return a stub config so UI can still open gracefully
    return {
        type: 'none',
        noChart: true,
        reason: 'unknown-product',
        xRange: [80, 120],
        yRange: [80, 120],
        calculate: function() { return 100; }
    };
};

// Helper function to calculate payoff array for charting
window.calculatePayoffArray = function(productName, S0 = 100, points = 100) {
    // Resolve config using flexible resolver first (supports keyword mappings)
    const config = window.getPayoffData(productName);
    if (!config) return null;

    const [xMin, xMax] = config.xRange;
    const step = (xMax - xMin) / points;
    const data = [];

    for (let i = 0; i <= points; i++) {
        const S = xMin + (i * step);
        const payoff = config.calculate(S, S0);
        data.push({ x: S, y: payoff });
    }

    return data;
};
