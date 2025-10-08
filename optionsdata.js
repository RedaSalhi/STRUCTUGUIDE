// Payoff configurations for listed and OTC options

(function() {
    const OPTION_PAYOFF_DATA = {
        "European Call Option": {
            type: "vanilla",
            xRange: [60, 140],
            yRange: [-25, 60],
            params: {
                strike: 100,
                premium: 5
            },
            calculate: function(S) {
                const intrinsic = Math.max(0, S - this.params.strike);
                return intrinsic - this.params.premium;
            },
            annotations: [
                { x: 100, label: "Strike", color: "#6366f1" },
                { y: -5, label: "Premium", color: "#f97316", horizontal: true }
            ],
            zones: [
                { from: 100, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "In the money" },
                { from: 60, to: 100, color: "rgba(239, 68, 68, 0.12)", label: "Premium at risk" }
            ]
        },

        "European Put Option": {
            type: "vanilla",
            xRange: [60, 140],
            yRange: [-25, 60],
            params: {
                strike: 100,
                premium: 5
            },
            calculate: function(S) {
                const intrinsic = Math.max(0, this.params.strike - S);
                return intrinsic - this.params.premium;
            },
            annotations: [
                { x: 100, label: "Strike", color: "#6366f1" },
                { y: -5, label: "Premium", color: "#f97316", horizontal: true }
            ],
            zones: [
                { from: 60, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "In the money" },
                { from: 100, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Premium at risk" }
            ]
        },

        "Long Straddle": {
            type: "volatility",
            xRange: [60, 140],
            yRange: [-40, 80],
            params: {
                strike: 100,
                premium: 12
            },
            calculate: function(S) {
                const intrinsic = Math.abs(S - this.params.strike);
                return intrinsic - this.params.premium;
            },
            annotations: [
                { x: 100, label: "Strike", color: "#6366f1" },
                { y: -12, label: "Total Premium", color: "#f97316", horizontal: true }
            ],
            zones: [
                { from: 60, to: 140, color: "rgba(59, 130, 246, 0.12)", label: "Volatility payout" }
            ]
        },

        "Bull Call Spread": {
            type: "spread",
            xRange: [60, 140],
            yRange: [-20, 40],
            params: {
                lowerStrike: 100,
                upperStrike: 120,
                netPremium: 6
            },
            calculate: function(S) {
                const intrinsic = Math.min(Math.max(S - this.params.lowerStrike, 0), this.params.upperStrike - this.params.lowerStrike);
                return intrinsic - this.params.netPremium;
            },
            annotations: [
                { x: 100, label: "Long Call K1", color: "#6366f1" },
                { x: 120, label: "Short Call K2", color: "#f97316" }
            ],
            zones: [
                { from: 100, to: 120, color: "rgba(16, 185, 129, 0.12)", label: "Rising gains" },
                { from: 120, to: 140, color: "rgba(251, 191, 36, 0.12)", label: "Capped payoff" }
            ]
        },

        "Bear Put Spread": {
            type: "spread",
            xRange: [60, 140],
            yRange: [-20, 40],
            params: {
                lowerStrike: 80,
                upperStrike: 100,
                netPremium: 6
            },
            calculate: function(S) {
                const intrinsic = Math.min(Math.max(this.params.upperStrike - S, 0), this.params.upperStrike - this.params.lowerStrike);
                return intrinsic - this.params.netPremium;
            },
            annotations: [
                { x: 80, label: "Short Put K1", color: "#f97316" },
                { x: 100, label: "Long Put K2", color: "#6366f1" }
            ],
            zones: [
                { from: 60, to: 100, color: "rgba(16, 185, 129, 0.12)", label: "Downside hedge" },
                { from: 100, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Premium loss" }
            ]
        },

        "Cash-or-Nothing Call": {
            type: "digital",
            xRange: [60, 140],
            yRange: [-10, 120],
            params: {
                strike: 100,
                payout: 100,
                premium: 12,
                netPayout: 88
            },
            calculate: function(S) {
                const payoff = S >= this.params.strike ? this.params.payout : 0;
                return payoff - this.params.premium;
            },
            annotations: [
                { x: 100, label: "Digital Strike", color: "#6366f1" },
                { y: 88, label: "Net Payout", color: "#22c55e", horizontal: true }
            ]
        },

        "Asset-or-Nothing Call": {
            type: "digital",
            xRange: [60, 140],
            yRange: [-20, 160],
            params: {
                strike: 100,
                premium: 10
            },
            calculate: function(S) {
                const payoff = S >= this.params.strike ? S : 0;
                return payoff - this.params.premium;
            },
            annotations: [
                { x: 100, label: "Activation", color: "#6366f1" },
                { y: -10, label: "Premium", color: "#f97316", horizontal: true }
            ],
            zones: [
                { from: 60, to: 100, color: "rgba(239, 68, 68, 0.12)", label: "Premium at risk" },
                { from: 100, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Asset payout" }
            ]
        },

        "Up-and-Out Barrier Call": {
            type: "barrier",
            xRange: [60, 140],
            yRange: [-25, 60],
            params: {
                strike: 100,
                barrier: 130,
                premium: 4
            },
            calculate: function(S) {
                if (S >= this.params.barrier) {
                    return -this.params.premium;
                }
                const intrinsic = Math.max(0, S - this.params.strike);
                return intrinsic - this.params.premium;
            },
            annotations: [
                { x: 100, label: "Strike", color: "#6366f1" },
                { x: 130, label: "Knock-Out", color: "#ef4444" }
            ],
            zones: [
                { from: 60, to: 130, color: "rgba(16, 185, 129, 0.12)", label: "Active region" },
                { from: 130, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "KO zone" }
            ]
        },

        "Up-and-In Barrier Call": {
            type: "barrier",
            xRange: [60, 140],
            yRange: [-25, 80],
            params: {
                strike: 100,
                barrier: 120,
                premium: 6
            },
            calculate: function(S) {
                const barrierHit = S >= this.params.barrier;
                if (!barrierHit) {
                    return -this.params.premium;
                }
                const intrinsic = Math.max(0, S - this.params.strike);
                return intrinsic - this.params.premium;
            },
            annotations: [
                { x: 120, label: "Knock-In", color: "#ef4444" },
                { x: 100, label: "Strike", color: "#6366f1" }
            ],
            zones: [
                { from: 60, to: 120, color: "rgba(239, 68, 68, 0.12)", label: "Dormant" },
                { from: 120, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Active payoff" }
            ]
        },

        "Down-and-In Barrier Put": {
            type: "barrier",
            xRange: [60, 140],
            yRange: [-25, 60],
            params: {
                strike: 100,
                barrier: 85,
                premium: 3
            },
            calculate: function(S) {
                if (S > this.params.barrier) {
                    return -this.params.premium;
                }
                const intrinsic = Math.max(0, this.params.strike - S);
                return intrinsic - this.params.premium;
            },
            annotations: [
                { x: 85, label: "Knock-In", color: "#ef4444" },
                { x: 100, label: "Strike", color: "#6366f1" }
            ],
            zones: [
                { from: 60, to: 85, color: "rgba(16, 185, 129, 0.12)", label: "Activated" },
                { from: 85, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Premium loss" }
            ]
        },

        "Down-and-Out Barrier Put": {
            type: "barrier",
            xRange: [60, 140],
            yRange: [-25, 60],
            params: {
                strike: 100,
                barrier: 80,
                premium: 4
            },
            calculate: function(S) {
                if (S <= this.params.barrier) {
                    return -this.params.premium;
                }
                const intrinsic = Math.max(0, this.params.strike - S);
                return intrinsic - this.params.premium;
            },
            annotations: [
                { x: 80, label: "Knock-Out", color: "#ef4444" },
                { x: 100, label: "Strike", color: "#6366f1" }
            ],
            zones: [
                { from: 60, to: 80, color: "rgba(239, 68, 68, 0.12)", label: "Knocked out" },
                { from: 80, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Active payoff" }
            ]
        },

        "Arithmetic Asian Call": {
            type: "path-dependent",
            xRange: [60, 140],
            yRange: [-20, 60],
            params: {
                strike: 100,
                premium: 4,
                smoothing: 0.6
            },
            calculate: function(S, S0 = 100) {
                const averaged = 100 + this.params.smoothing * (S - S0);
                const intrinsic = Math.max(0, averaged - this.params.strike);
                return intrinsic - this.params.premium;
            },
            annotations: [
                { x: 100, label: "Strike", color: "#6366f1" },
                { y: -4, label: "Premium", color: "#f97316", horizontal: true }
            ],
            zones: [
                { from: 60, to: 140, color: "rgba(99, 102, 241, 0.12)", label: "Averaged payoff" }
            ]
        },

        "Floating Strike Lookback Call": {
            type: "path-dependent",
            xRange: [60, 160],
            yRange: [-10, 90],
            params: {
                premium: 8,
                participation: 1
            },
            calculate: function(S, S0 = 100) {
                const bestLevel = Math.max(S, S0);
                const intrinsic = Math.max(0, bestLevel - S0) * this.params.participation;
                return intrinsic - this.params.premium;
            },
            annotations: [
                { y: -8, label: "Premium", color: "#f97316", horizontal: true },
                { x: 100, label: "Reference", color: "#6366f1" }
            ],
            zones: [
                { from: 60, to: 160, color: "rgba(16, 185, 129, 0.12)", label: "Max performance" }
            ]
        },

        "Risk Reversal": {
            type: "volatility",
            xRange: [60, 140],
            yRange: [-20, 60],
            params: {
                longCallStrike: 105,
                shortPutStrike: 95,
                netPremium: 0
            },
            calculate: function(S) {
                const callValue = Math.max(0, S - this.params.longCallStrike);
                const shortPut = Math.max(0, this.params.shortPutStrike - S);
                return callValue - shortPut - this.params.netPremium;
            },
            annotations: [
                { x: 105, label: "Long Call", color: "#6366f1" },
                { x: 95, label: "Short Put", color: "#f97316" }
            ],
            zones: [
                { from: 60, to: 95, color: "rgba(239, 68, 68, 0.12)", label: "Short put risk" },
                { from: 105, to: 140, color: "rgba(16, 185, 129, 0.12)", label: "Upside participation" }
            ]
        },

        "Long Strangle": {
            type: "volatility",
            xRange: [60, 140],
            yRange: [-40, 80],
            params: {
                callStrike: 110,
                putStrike: 90,
                totalPremium: 8
            },
            calculate: function(S) {
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
            calculate: function(S) {
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
            calculate: function(S) {
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
            calculate: function(S) {
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
            calculate: function(S) {
                const call1 = Math.max(0, S - this.params.putStrike1);
                const call2 = Math.max(0, S - this.params.putStrike2);
                const call3 = Math.max(0, S - this.params.callStrike1);
                const call4 = Math.max(0, S - this.params.callStrike2);
                return call1 - call2 - call3 + call4;
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
            calculate: function(S) {
                const call1 = Math.max(0, S - this.params.putStrike1);
                const call2 = Math.max(0, S - this.params.putStrike2);
                const call3 = Math.max(0, S - this.params.callStrike1);
                const call4 = Math.max(0, S - this.params.callStrike2);
                return -(call1 - call2 - call3 + call4);
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
            calculate: function(S) {
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
            calculate: function(S) {
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
            calculate: function(S) {
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
            calculate: function(S) {
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
            calculate: function(S) {
                const longCall = Math.max(0, S - this.params.lowerStrike);
                const shortCall = Math.max(0, S - this.params.upperStrike);
                const shortPut = Math.max(0, this.params.upperStrike - S);
                const longPut = Math.max(0, this.params.lowerStrike - S);
                return longCall - shortCall + shortPut - longPut;
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
            calculate: function(S) {
                const shortCall = Math.max(0, S - this.params.lowerStrike);
                const longCall = Math.max(0, S - this.params.upperStrike);
                const longPut = Math.max(0, this.params.upperStrike - S);
                const shortPut = Math.max(0, this.params.lowerStrike - S);
                return - shortCall + longCall + longPut - shortPut;
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

        "Covered Call": {
            type: "income",
            xRange: [60, 140],
            yRange: [-20, 60],
            params: {
                S0: 100,
                strike: 110,
                premium: 5
            },
            calculate: function(S) {
                const stockValue = S - this.params.S0;
                const callValue = -Math.max(0, S - this.params.strike);
                return stockValue + callValue + this.params.premium;
            },
            annotations: [
                { x: 110, label: "Call Strike", color: "#f97316" },
                { y: 5, label: "Premium Received", color: "#22c55e", horizontal: true }
            ],
            zones: [
                { from: 60, to: 110, color: "rgba(16, 185, 129, 0.12)", label: "Premium zone" },
                { from: 110, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Capped upside" }
            ]
        },

        "Protective Collar": {
            type: "volatility",
            xRange: [60, 140],
            yRange: [-20, 60],
            params: {
                S0: 100,
                putStrike: 90,
                callStrike: 110,
                netCost: 2
            },
            calculate: function(S) {
                const stockValue = S - this.params.S0;
                const putValue = Math.max(0, this.params.putStrike - S);
                const callValue = -Math.max(0, S - this.params.callStrike);
                return stockValue + putValue + callValue - this.params.netCost;
            },
            annotations: [
                { x: 90, label: "Put Strike", color: "#6366f1" },
                { x: 110, label: "Call Strike", color: "#f97316" },
                { y: -2, label: "Net Cost", color: "#ef4444", horizontal: true }
            ],
            zones: [
                { from: 60, to: 90, color: "rgba(16, 185, 129, 0.12)", label: "Protected downside" },
                { from: 90, to: 110, color: "rgba(16, 185, 129, 0.12)", label: "Premium zone" },
                { from: 110, to: 140, color: "rgba(239, 68, 68, 0.12)", label: "Capped upside" }
            ]
        }
    };

    function cloneValue(value) {
        if (Array.isArray(value)) {
            return value.map(cloneValue);
        }
        if (value && typeof value === 'object') {
            const copy = {};
            Object.keys(value).forEach(k => {
                copy[k] = cloneValue(value[k]);
            });
            return copy;
        }
        return value;
    }

    function getOptionPayoffData(name) {
        if (!name) return null;
        const normalized = String(name)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        const exactKey = Object.keys(OPTION_PAYOFF_DATA).find(k => k.toLowerCase() === normalized);
        if (exactKey) return cloneValue(OPTION_PAYOFF_DATA[exactKey]);

        if (normalized.includes('call') && (normalized.includes('european') || normalized.includes('europeenne'))) {
            return cloneValue(OPTION_PAYOFF_DATA["European Call Option"]);
        }
        if (normalized.includes('put') && (normalized.includes('european') || normalized.includes('europeenne'))) {
            return cloneValue(OPTION_PAYOFF_DATA["European Put Option"]);
        }
        if (normalized.includes('straddle')) return cloneValue(OPTION_PAYOFF_DATA["Long Straddle"]);
        if (normalized.includes('strangle')) {
            if (normalized.includes('short')) return cloneValue(OPTION_PAYOFF_DATA["Short Strangle"]);
            return cloneValue(OPTION_PAYOFF_DATA["Long Strangle"]);
        }
        if (normalized.includes('butterfly') || normalized.includes('papillon')) {
            if (normalized.includes('short')) return cloneValue(OPTION_PAYOFF_DATA["Short Butterfly Call"]);
            return cloneValue(OPTION_PAYOFF_DATA["Long Butterfly Call"]);
        }
        if (normalized.includes('iron condor') || normalized.includes('condor de fer')) {
            if (normalized.includes('short')) return cloneValue(OPTION_PAYOFF_DATA["Short Iron Condor"]);
            return cloneValue(OPTION_PAYOFF_DATA["Long Iron Condor"]);
        }
        if (normalized.includes('iron butterfly') || normalized.includes('papillon de fer')) {
            if (normalized.includes('short')) return cloneValue(OPTION_PAYOFF_DATA["Short Iron Butterfly"]);
            return cloneValue(OPTION_PAYOFF_DATA["Long Iron Butterfly"]);
        }
        if (normalized.includes('calendar spread') || normalized.includes('spread calendaire')) {
            if (normalized.includes('short')) return cloneValue(OPTION_PAYOFF_DATA["Short Calendar Spread"]);
            return cloneValue(OPTION_PAYOFF_DATA["Long Calendar Spread"]);
        }
        if (normalized.includes('box spread') || normalized.includes('spread boite')) {
            if (normalized.includes('short')) return cloneValue(OPTION_PAYOFF_DATA["Short Box Spread"]);
            return cloneValue(OPTION_PAYOFF_DATA["Long Box Spread"]);
        }
        if (normalized.includes('bull') && normalized.includes('spread')) return cloneValue(OPTION_PAYOFF_DATA["Bull Call Spread"]);
        if (normalized.includes('bear') && normalized.includes('spread')) return cloneValue(OPTION_PAYOFF_DATA["Bear Put Spread"]);
        if ((normalized.includes('digital') || normalized.includes('cash')) && normalized.includes('nothing')) return cloneValue(OPTION_PAYOFF_DATA["Cash-or-Nothing Call"]);
        if (normalized.includes('asset') && normalized.includes('nothing')) return cloneValue(OPTION_PAYOFF_DATA["Asset-or-Nothing Call"]);
        if (normalized.includes('up') && normalized.includes('out')) return cloneValue(OPTION_PAYOFF_DATA["Up-and-Out Barrier Call"]);
        if (normalized.includes('up') && normalized.includes('in')) return cloneValue(OPTION_PAYOFF_DATA["Up-and-In Barrier Call"]);
        if (normalized.includes('down') && normalized.includes('in')) return cloneValue(OPTION_PAYOFF_DATA["Down-and-In Barrier Put"]);
        if (normalized.includes('down') && normalized.includes('out')) return cloneValue(OPTION_PAYOFF_DATA["Down-and-Out Barrier Put"]);
        if (normalized.includes('asian') || normalized.includes('asiatique')) return cloneValue(OPTION_PAYOFF_DATA["Arithmetic Asian Call"]);
        if (normalized.includes('lookback')) return cloneValue(OPTION_PAYOFF_DATA["Floating Strike Lookback Call"]);
        if (normalized.includes('risk reversal')) return cloneValue(OPTION_PAYOFF_DATA["Risk Reversal"]);

        return null;
    }

    function calculateOptionPayoffArray(productName, S0 = 100, points = 120) {
        const config = getOptionPayoffData(productName);
        if (!config) return null;
        const [xMin, xMax] = config.xRange;
        const step = (xMax - xMin) / points;
        const data = [];
        for (let i = 0; i <= points; i++) {
            const S = xMin + step * i;
            const payoff = config.calculate(S, S0);
            data.push({ x: S, y: payoff });
        }
        return data;
    }

    window.OPTION_PAYOFF_DATA = OPTION_PAYOFF_DATA;
    window.getOptionPayoffData = getOptionPayoffData;
    window.calculateOptionPayoffArray = calculateOptionPayoffArray;

    // Compatibility for shared scripts on this page
    window.PAYOFF_DATA = OPTION_PAYOFF_DATA;
    window.getPayoffData = getOptionPayoffData;
    window.calculatePayoffArray = calculateOptionPayoffArray;
})();
