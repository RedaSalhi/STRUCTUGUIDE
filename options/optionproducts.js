// Options library content (EN / FR) - Updated with classic strategies

(function() {
    const OPTION_PRODUCTS = {
        en: {
            "vanilla": {
                title: "Vanilla Options",
                badge: "Core Instruments",
                products: [
                    {
                        name: "European Call Option",
                        short: "Unlimited upside participation with loss limited to the premium.",
                        hasPayoff: true,
                        definition: "A European call grants the right, not the obligation, to buy the underlying at expiry for a predefined strike. It monetises bullish views with convex exposure.",
                        characteristics: {
                            underlying: "Equities, indices, FX, commodities",
                            strike: "ATM / ITM / OTM depending on view",
                            maturity: "From weekly to multi-year expiries",
                            premium: "Upfront; increases with volatility and tenor",
                            delta: "Positive (0 → 1)",
                            payoffNature: "Convex, long gamma"
                        },
                        payoff: "\\text{Payoff} = \\max(S_T - K, 0) - \\text{Premium}",
                        advantages: [
                            "Gains rise with no cap",
                            "Loss limited to premium",
                            "Highly liquid benchmark contract"
                        ],
                        risks: [
                            "Time decay if spot stagnates",
                            "Premium can be expensive in high vol regimes",
                            "Implied volatility drop hurts valuation"
                        ],
                        investorType: "Directional investors seeking convex upside with defined downside.",
                        example: {
                            title: "ATM Call on Stock XYZ",
                            parameters: {
                                spot: "100",
                                strike: "100",
                                maturity: "3 months",
                                impliedVol: "22%",
                                premium: "5"
                            },
                            scenarios: [
                                "S_T = 120 → payoff = +15",
                                "S_T = 105 → payoff = 0 (breakeven)",
                                "S_T = 90 → payoff = −5 (loss limited to premium)"
                            ]
                        }
                    },
                    {
                        name: "European Put Option",
                        short: "Downside protection or bearish speculation with finite cost.",
                        hasPayoff: true,
                        definition: "A European put delivers the right to sell the underlying at the strike on expiry. It hedges or monetises bearish moves while capping the loss at the premium.",
                        characteristics: {
                            underlying: "Same as call",
                            strike: "Often near spot for hedging",
                            maturity: "Days to years",
                            premium: "Upfront; reflects downside skew",
                            delta: "Negative (0 → −1)",
                            payoffNature: "Concave, long gamma"
                        },
                        payoff: "\\text{Payoff} = \\max(K - S_T, 0) - \\text{Premium}",
                        advantages: [
                            "Defines worst-case loss",
                            "Convex protection during drawdowns",
                            "Simple to implement"
                        ],
                        risks: [
                            "Premium drag in calm markets",
                            "Deep puts expensive due to skew",
                            "Short-dated hedges require rolling"
                        ],
                        investorType: "Investors hedging long books or expressing downside views with controlled loss.",
                        example: {
                            title: "ATM Put on Stock XYZ",
                            parameters: {
                                spot: "100",
                                strike: "100",
                                maturity: "3 months",
                                impliedVol: "25%",
                                premium: "4.8"
                            },
                            scenarios: [
                                "S_T = 80 → payoff = +15.2",
                                "S_T = 100 → payoff = −4.8",
                                "S_T = 110 → payoff = −4.8"
                            ]
                        }
                    }
                ]
            },
            "spreads": {
                title: "Option Spreads",
                badge: "Structured Views",
                products: [
                    {
                        name: "Bull Call Spread",
                        short: "Lower-cost bullish exposure with capped upside.",
                        hasPayoff: true,
                        definition: "Buy a call at strike K1 and sell a call at a higher strike K2. Net premium is reduced in exchange for a cap on profits.",
                        characteristics: {
                            construction: "Long call (K1) + short call (K2 > K1)",
                            maxGain: "K2 − K1 − net premium",
                            maxLoss: "Net premium",
                            delta: "Positive but < long call",
                            theta: "Less negative than outright call",
                            useCase: "Targeted upside scenarios"
                        },
                        payoff: "\\text{Payoff} = \\min\\{\\max(S_T - K_1, 0), K_2 - K_1\\} - \\text{Net Premium}",
                        replication: "\\text{Bull Call Spread} = \\text{Call}(K_1) - \\text{Call}(K2) \\n\\n \\text{With } K_1 < K_2",
                        advantages: [
                            "Significant premium reduction",
                            "Clear payoff diagram",
                            "Leverage tuned to target"
                        ],
                        risks: [
                            "Profits capped above K2",
                            "Requires spot to end inside targeted zone",
                            "Still suffers from theta if spot drifts"
                        ],
                        investorType: "Investors with defined bullish targets and premium discipline.",
                        example: {
                            title: "Buy 100C / Sell 120C",
                            parameters: {
                                K1: "100",
                                K2: "120",
                                netPremium: "6",
                                maturity: "3 months"
                            },
                            scenarios: [
                                "S_T = 95 → payoff = −6",
                                "S_T = 115 → payoff = +9",
                                "S_T = 140 → payoff = +14 (capped)"
                            ]
                        }
                    },
                    {
                        name: "Bear Put Spread",
                        short: "Cost-effective protection against moderate declines.",
                        hasPayoff: true,
                        definition: "Buy a put at K2 and sell a put at a lower strike K1. Protects against measured downside while reducing the hedge cost.",
                        characteristics: {
                            construction: "Long put (K2) + short put (K1 < K2)",
                            maxGain: "K2 − K1 − net premium",
                            maxLoss: "Net premium",
                            delta: "Negative",
                            useCase: "Portfolio hedging or bearish view",
                            margin: "None for long spread"
                        },
                        payoff: "\\text{Payoff} = \\min\\{\\max(K_2 - S_T, 0), K_2 - K_1\\} - \\text{Net Premium}",
                        replication: "\\text{Bear Spread} = \\text{Put}(K_2) - \\text{Put}(K_1)",
                        advantages: [
                            "Cheaper than outright puts",
                            "Defines protection window",
                            "Simple to execute"
                        ],
                        risks: [
                            "No benefit beyond lower strike",
                            "Still loses premium if market stays flat",
                            "Active management required at expiry"
                        ],
                        investorType: "Investors hedging downside while accepting limited protection.",
                        example: {
                            title: "Buy 100P / Sell 80P",
                            parameters: {
                                K2: "100",
                                K1: "80",
                                netPremium: "6",
                                maturity: "2 months"
                            },
                            scenarios: [
                                "S_T = 90 → payoff = −1",
                                "S_T = 70 → payoff = +14",
                                "S_T = 110 → payoff = −6"
                            ]
                        }
                    },
                    {
                        name: "Risk Reversal",
                        short: "Zero-cost skew trade: short downside put, long upside call.",
                        hasPayoff: true,
                        definition: "Sell an OTM put and buy an OTM call of similar delta. Often used in FX and equities to monetise skew.",
                        characteristics: {
                            construction: "Short put (Kput) + long call (Kcall)",
                            premium: "Near zero for symmetric strikes",
                            delta: "Positive",
                            vega: "Long upside / short downside skew",
                            useCase: "Hedge or express skew views",
                            risk: "Large losses if spot collapses"
                        },
                        payoff: "\\text{Payoff} = \\max(0, S_T - K_{call}) - \\max(0, K_{put} - S_T)",
                        replication: "\\text{Risk Reversal} = \\text{Call OTM}(K_1) - \\text{Put OTM}(K_2) \\n\\n \\text{With } K_2 < K_1",
                        advantages: [
                            "Little to no upfront cost",
                            "Captures upside skew",
                            "Common hedge for exporter FX flows"
                        ],
                        risks: [
                            "Short downside tail via the put",
                            "Margin requirements possible",
                            "Sensitive to skew repricing"
                        ],
                        investorType: "Hedgers trading skew or substituting cash forwards with optionality.",
                        example: {
                            title: "Sell 95P / Buy 105C",
                            parameters: {
                                Kput: "95",
                                Kcall: "105",
                                premium: "≈0",
                                maturity: "1 month"
                            },
                            scenarios: [
                                "S_T = 110 → payoff ≈ +5",
                                "S_T = 95 → payoff ≈ 0",
                                "S_T = 85 → payoff ≈ −10"
                            ]
                        }
                    }
                ]
            },
            "barrier": {
                title: "Barrier & Digital Structures",
                badge: "Path Features",
                products: [
                    {
                        name: "Cash-or-Nothing Call",
                        short: "Binary payout if the underlying finishes above the strike.",
                        hasPayoff: true,
                        definition: "Pays a fixed amount if spot settles above strike, otherwise zero. Used for event-driven trades with binary outcomes.",
                        characteristics: {
                            payout: "Fixed cash amount",
                            strike: "Event level",
                            premium: "Depends on implied probability",
                            delta: "Peaked around strike",
                            useCase: "Binary event, structured coupons",
                            settlement: "Cash only"
                        },
                        payoff: "\\text{Payoff} = \\mathbf{1}_{\\{S_T>K\\}}\\,Q - \\text{Premium}",
                        replication: "\\text{Digital} = \\lim_{\\epsilon\\to 0} \\frac{1}{\\epsilon}[C(K) - C(K+\\epsilon)]",
                        advantages: [
                            "All-or-nothing clarity",
                            "Direct mapping to probabilities",
                            "Useful for bonus coupons"
                        ],
                        risks: [
                            "Total premium loss if strike not breached",
                            "Very volatility sensitive",
                            "Wide bid/ask in OTC names"
                        ],
                        investorType: "Event-driven traders targeting binary outcomes."
                    },
                    {
                        name: "Asset-or-Nothing Call",
                        short: "Delivers the underlying value itself once the strike is exceeded.",
                        hasPayoff: true,
                        definition: "A binary option paying the terminal asset price if the option ends in the money. Offers high leverage per unit of premium.",
                        characteristics: {
                            payout: "Spot price S_T when activated",
                            strike: "Activation threshold",
                            premium: "Lower than vanilla call",
                            delta: "Peaks near the strike",
                            useCase: "Structured coupons, leveraged directional trades",
                            settlement: "Cash"
                        },
                        payoff: "\\text{Payoff} = \\mathbf{1}_{\\{S_T>K\\}} S_T - \\text{Premium}",
                        advantages: [
                            "Maximises upside leverage for a given premium",
                            "Simple binary trigger",
                            "Common building block for structured payouts"
                        ],
                        risks: [
                            "Premium lost if strike not exceeded",
                            "Highly sensitive to implied volatility",
                            "Potentially wide OTC spreads"
                        ],
                        investorType: "Investors seeking leveraged upside exposure around a key level."
                    },
                    {
                        name: "Up-and-Out Barrier Call",
                        short: "Cheaper call that knocks out if the barrier is hit.",
                        hasPayoff: true,
                        definition: "A vanilla call with an upper barrier; if breached, the option ceases to exist. Offers discounted upside exposure.",
                        characteristics: {
                            strike: "ATM or OTM",
                            barrier: "Upper level, continuous monitoring",
                            premium: "Lower than vanilla",
                            rebate: "Optional",
                            useCase: "Moderate bullish view",
                            greeks: "Path-dependent"
                        },
                        payoff: "\\text{Payoff} = \\mathbf{1}_{\\{\\text{KO not triggered}\\}}\\max(S_T-K, 0) - \\text{Premium}",
                        replication: "\\text{CUO} = \\text{Call}(K_1) - \\text{Call}(K_2) - \\text{Call Digit}(K_2) \\n\\n With K_2 > K_1",
                        advantages: [
                            "Reduced cost versus vanilla",
                            "Customisable barriers/rebates",
                            "Efficient for range-bound upside"
                        ],
                        risks: [
                            "Barrier breach cancels payoff",
                            "Gap risk near the barrier",
                            "Model dependence for pricing"
                        ],
                        investorType: "Cost-sensitive investors expecting upside without runaway rallies."
                    },
                    {
                        name: "Up-and-In Barrier Call",
                        short: "Call that only becomes active after an upside barrier is touched.",
                        hasPayoff: true,
                        definition: "Starts dormant and turns into a vanilla call only if the underlying trades at or above the barrier during the life of the option.",
                        characteristics: {
                            strike: "Typically ATM",
                            barrier: "Upper knock-in level",
                            premium: "Cheaper than vanilla but dearer than up-and-out",
                            useCase: "Breakout trades",
                            greeks: "Low delta until knock-in",
                            settlement: "Cash"
                        },
                        payoff: "\\text{Payoff} = \\mathbf{1}_{\\{\\text{barrier hit}\\}}\\max(S_T-K,0) - \\text{Premium}",
                        replication: "\\text{CUI} = \\text{Call} - \\text{CUO}",
                        advantages: [
                            "Targeted upside exposure",
                            "Cheaper than vanilla in calm markets",
                            "Barrier level customisable"
                        ],
                        risks: [
                            "Expires worthless if barrier never reached",
                            "Greeks jump upon activation",
                            "Sensitive to gap moves"
                        ],
                        investorType: "Traders expecting upside only after a defined breakout."
                    },
                    {
                        name: "Down-and-In Barrier Put",
                        short: "Tail hedge activated only if a downside barrier is hit.",
                        hasPayoff: true,
                        definition: "A put that only becomes active if the underlying touches a lower barrier. Provides cheap crash protection.",
                        characteristics: {
                            strike: "Near spot",
                            barrier: "Below spot",
                            premium: "Lower than vanilla",
                            useCase: "Crash insurance",
                            greeks: "Low delta before knock-in",
                            settlement: "Cash or physical"
                        },
                        payoff: "\\text{Payoff} = \\mathbf{1}_{\\{\\text{KI triggered}\\}}\\max(K-S_T,0) - \\text{Premium}",
                        replication: "\\text{Down-and-In} = \\text{Put} - \\text{PDO}",
                        advantages: [
                            "Cheaper tail risk hedge",
                            "Activates only in stressed scenario",
                            "Flexible barrier choice"
                        ],
                        risks: [
                            "No protection if barrier untouched",
                            "Sudden gaps may activate unexpectedly",
                            "Complex hedging profile"
                        ],
                        investorType: "Hedgers wanting economical crash protection."
                    },
                    {
                        name: "Down-and-Out Barrier Put",
                        short: "Put protection that disappears if a downside barrier is breached.",
                        hasPayoff: true,
                        definition: "Behaves like a vanilla put unless the underlying touches the barrier. Provides cheaper hedging when extreme sell-offs are deemed unlikely.",
                        characteristics: {
                            strike: "Near spot",
                            barrier: "Lower KO level",
                            premium: "Lower than vanilla put",
                            useCase: "Cost-efficient downside hedge",
                            settlement: "Cash or physical",
                            greeks: "Path dependent"
                        },
                        payoff: "\\text{Payoff} = \\mathbf{1}_{\\{\\text{KO non déclenché}\\}}\\max(K-S_T,0) - \\text{Premium}",
                        replication: "\\text{PDO} = \\text{Put}(K_1) - \\text{Put}(K_2) - \\text{Put Digit}(K_2) \\n\\n \\text{With} K_2 < K_1",
                        advantages: [
                            "Cheaper than standard puts",
                            "Targets moderate declines",
                            "Flexible barrier placement"
                        ],
                        risks: [
                            "Loss of hedge if barrier broken",
                            "Gap risk",
                            "Pricing sensitive to volatility surface"
                        ],
                        investorType: "Investors willing to forgo protection in extreme sell-offs for lower cost."
                    }
                ]
            },
            "path": {
                title: "Path-Dependent Options",
                badge: "Exotic Payoffs",
                products: [
                    {
                        name: "Arithmetic Asian Call",
                        short: "Payoff based on the average price, reducing timing risk.",
                        hasPayoff: true,
                        definition: "Settles on the arithmetic average of scheduled fixings. Smooths volatility and suits commodity/FX hedges tied to rolling purchases.",
                        characteristics: {
                            averaging: "Arithmetic mean",
                            premium: "Lower than vanilla",
                            useCase: "Commodity procurement, FX budgets",
                            volatility: "Lower effective vol",
                            settlement: "Cash",
                            monitoring: "Discrete schedule"
                        },
                        payoff: "\\text{Payoff} = \\max(\\bar{S} - K, 0) - \\text{Premium}",
                        replication: "\\text{Approximated via strip of forward-start options.}",
                        advantages: [
                            "Less sensitive to final-day noise",
                            "Captures average acquisition price",
                            "Lower premium cost"
                        ],
                        risks: [
                            "Forgoes benefit from late spikes",
                            "Path dependency adds modelling complexity",
                            "Fixing schedule must be managed"
                        ],
                        investorType: "Corporate hedgers and structured traders smoothing purchase price risk."
                    },
                    {
                        name: "Floating Strike Lookback Call",
                        short: "Strike resets to the minimum price observed, capturing full rallies.",
                        hasPayoff: true,
                        definition: "Allows the holder to buy at the lowest price reached during the option life. Provides maximum participation in rebounds.",
                        characteristics: {
                            monitoring: "Continuous or discrete",
                            premium: "Higher than vanilla",
                            delta: "Highly path-dependent",
                            gamma: "Large when new lows form",
                            useCase: "Opportunistic accumulation",
                            settlement: "Cash"
                        },
                        payoff: "\\text{Payoff} = (S_T - \\min S_t) - \\text{Premium}",
                        replication: "\\text{Combination of forward-start and barrier options.}",
                        advantages: [
                            "Eliminates entry timing risk",
                            "Captures entire rebound move",
                            "Attractive overlay for tactical long strategies"
                        ],
                        risks: [
                            "Expensive premium",
                            "Complex hedging of path-dependent Greeks",
                            "Valuation sensitive to modelling assumptions"
                        ],
                        investorType: "Sophisticated investors wanting guaranteed participation in rebounds."
                    }
                ]
            },
            "strategies": {
                title: "Multi-Option Strategies",
                badge: "Portfolio Overlays",
                products: [
                    {
                        name: "Long Straddle",
                        short: "Bet on high volatility by buying both call and put at same strike.",
                        hasPayoff: true,
                        definition: "Buy an ATM call and ATM put with identical strike and expiry. Profits from large moves in either direction, paying for both options upfront.",
                        characteristics: {
                            construction: "Long call + long put (same strike K)",
                            view: "High volatility expected",
                            premium: "Both options paid upfront",
                            breakeven: "K ± total premium",
                            vega: "Positive (long volatility)",
                            theta: "Negative (time decay hurts)"
                        },
                        payoff: "\\text{Payoff} = \\max(S_T - K, 0) + \\max(K - S_T, 0)",
                        replication: "\\text{Straddle} = \\text{Call}(K) + \\text{Put}(K)",
                        advantages: [
                            "Unlimited profit potential both ways",
                            "Defined maximum loss (total premium)",
                            "Simple volatility play"
                        ],
                        risks: [
                            "Expensive in high IV environments",
                            "Loses from time decay if spot stagnates",
                            "Requires large move to profit"
                        ],
                        investorType: "Volatility traders expecting significant market moves before expiry."
                    },
                    {
                        name: "Long Strangle",
                        short: "Lower-cost volatility play with wider breakeven points.",
                        hasPayoff: true,
                        definition: "Buy OTM call and OTM put with different strikes. Cheaper than straddle but requires larger moves to profit.",
                        characteristics: {
                            construction: "Long OTM call + long OTM put",
                            premium: "Lower than straddle",
                            breakeven: "Outside both strikes ± premium",
                            vega: "Positive",
                            theta: "Negative but less severe",
                            delta: "Initially near zero"
                        },
                        payoff: "\\text{Payoff} = \\max(S_T - K_{call}, 0) + \\max(K_{put} - S_T, 0)",
                        replication: "\\text{Strangle} = \\text{OTM Call} + \\text{OTM Put}",
                        advantages: [
                            "Lower upfront cost than straddle",
                            "Unlimited upside and downside profit",
                            "Works well before binary events"
                        ],
                        risks: [
                            "Wider breakeven range required",
                            "Total loss if spot stays between strikes",
                            "Time decay accelerates near expiry"
                        ],
                        investorType: "Volatility traders seeking cheaper exposure with wider profit zones."
                    },
                    {
                        name: "Short Strangle",
                        short: "Collect premium betting on low volatility.",
                        hasPayoff: true,
                        definition: "Sell OTM call and OTM put simultaneously. Profit from premium if market stays range-bound, but unlimited risk on breakouts.",
                        characteristics: {
                            construction: "Short OTM call + short OTM put",
                            premium: "Collected upfront",
                            profit: "Maximum premium if spot stays between strikes",
                            risk: "Unlimited on both tails",
                            vega: "Negative (short volatility)",
                            theta: "Positive (benefits from decay)"
                        },
                        payoff: "\\text{Payoff} = \\text{Premium} - \\max(S_T - K_{call}, 0) - \\max(K_{put} - S_T, 0)",
                        advantages: [
                            "Immediate premium income",
                            "Profits in range-bound markets",
                            "High probability of some profit"
                        ],
                        risks: [
                            "Unlimited loss potential",
                            "Margin requirements",
                            "Dangerous in volatile markets"
                        ],
                        investorType: "Sophisticated traders comfortable with tail risk in calm markets."
                    },
                    {
                        name: "Long Butterfly",
                        short: "Limited risk bet on low volatility around a target price.",
                        hasPayoff: true,
                        definition: "Buy 1 lower strike call, sell 2 middle strike calls, buy 1 upper strike call. Profits if spot stays near middle strike at expiry.",
                        characteristics: {
                            construction: "Long call K1, short 2 calls K2, long call K3",
                            strikes: "Equidistant: K2 - K1 = K3 - K2",
                            premium: "Net debit (paid)",
                            maxProfit: "At K2 at expiry",
                            maxLoss: "Net premium paid",
                            vega: "Negative near K2"
                        },
                        payoff: "\\text{Payoff} = \\max(S_T - K_1, 0) - 2\\max(S_T - K_2, 0) + \\max(S_T - K_3, 0) - \\text{Net Cost}",
                        replication: "\\text{Butterfly} = \\text{Bull Spread} + \\text{Bear Spread}",
                        advantages: [
                            "Limited risk (known upfront)",
                            "Profits from low volatility",
                            "Lower cost than selling straddle"
                        ],
                        risks: [
                            "Limited profit potential",
                            "Requires precise price target",
                            "Multiple legs = higher commissions"
                        ],
                        investorType: "Range-bound traders with specific price targets."
                    },
                    {
                        name: "Iron Condor",
                        short: "Credit strategy profiting from range-bound markets.",
                        hasPayoff: true,
                        definition: "Sell OTM put spread and OTM call spread simultaneously. Collects premium if underlying stays within a range.",
                        characteristics: {
                            construction: "Bull put spread + bear call spread",
                            premium: "Net credit received",
                            maxProfit: "Full premium if spot stays between middle strikes",
                            maxLoss: "Wing width - premium",
                            bestCase: "Low volatility",
                            margin: "Required due to short options"
                        },
                        payoff: "\\text{Payoff} = \\text{Premium} - \\max(0, K_{put2} - S_T) + \\max(0, K_{put1} - S_T) - \\max(0, S_T - K_{call1}) + \\max(0, S_T - K_{call2})",
                        replication: "\\text{Iron Condor} = \\text{Short Strangle} + \\text{Call}(K_2) + \\text{Put}(K_1)",
                        advantages: [
                            "Defined risk with protective wings",
                            "Premium collected upfront",
                            "High probability strategies"
                        ],
                        risks: [
                            "Limited profit potential",
                            "Requires active management",
                            "Assignment risk on short legs"
                        ],
                        investorType: "Income traders comfortable with range-bound scenarios and defined risk."
                    },
                    {
                        name: "Covered Call",
                        short: "Generate income by writing calls against long stock.",
                        hasPayoff: true,
                        definition: "Hold 100 shares and sell 1 call contract. Collect premium as income while capping upside at the strike. If called away, keep premium plus capital gain to strike.",
                        characteristics: {
                            construction: "Long 100 shares + short 1 call",
                            view: "Neutral to mildly bullish",
                            income: "Call premium",
                            protection: "Premium received",
                            maxGain: "(Strike - purchase price) + premium",
                            risk: "Full downside minus premium"
                        },
                        payoff: "\\text{Payoff} = (S_T - S_0) + \\text{Premium} - \\max(0, S_T - K)",
                        replication: "\\text{Covered Call} = \\text{Long Stock} + \\text{Short Call}",
                        advantages: [
                            "Generates consistent income",
                            "Lowers cost basis over time",
                            "Simple to execute and manage"
                        ],
                        risks: [
                            "Upside capped at strike",
                            "Stock can still decline significantly",
                            "Opportunity cost if stock rallies"
                        ],
                        investorType: "Income-focused investors willing to cap upside for premium income.",
                        example: {
                            title: "Monthly covered call on AAPL",
                            parameters: {
                                spot: "175",
                                shares: "100 shares owned",
                                strike: "180",
                                premium: "$3.50 per share = $350 total",
                                maturity: "30 days"
                            },
                            scenarios: [
                                "S_T = 170: Keep stock + $350 premium (cushions $500 loss)",
                                "S_T = 178: Keep stock + $350 premium (gain $650 total)",
                                "S_T = 185: Stock called at 180, realize $500 gain + $350 premium = $850 total",
                                "S_T = 200: Stock called at 180, miss $2000 upside but still gain $850"
                            ]
                        }
                    },
                    {
                        name: "Protective Collar",
                        short: "Zero-cost hedge: buy put protection, sell call for financing.",
                        hasPayoff: true,
                        definition: "Hold stock, buy protective put, sell call at higher strike. The call premium finances the put, creating a defined risk/return range at minimal or zero cost.",
                        characteristics: {
                            construction: "Long stock + long put + short call",
                            cost: "Near zero (call premium offsets put cost)",
                            floor: "Put strike defines downside protection",
                            cap: "Call strike caps upside",
                            useCase: "Capital preservation with some upside",
                            holding: "Typically rolled quarterly"
                        },
                        payoff: "\\text{Payoff} = \\begin{cases} K_{call} - S_0 \\pm \\text{net cost} & \\text{if } S_T > K_{call} \\\\ S_T - S_0 \\pm \\text{net cost} & \\text{if } K_{put} < S_T \\leq K_{call} \\\\ K_{put} - S_0 \\pm \\text{net cost} & \\text{if } S_T \\leq K_{put} \\end{cases}",
                        replication: "\\text{Collar} = \\text{Long Stock} + \\text{Put} - \\text{Call}",
                        advantages: [
                            "Downside protected at known level",
                            "Zero or minimal cost",
                            "Allows participation up to call strike"
                        ],
                        risks: [
                            "Upside capped",
                            "Requires roll management",
                            "Three-leg complexity"
                        ],
                        investorType: "Conservative investors protecting gains or hedging concentrated positions.",
                        example: {
                            title: "Protective collar on concentrated position",
                            parameters: {
                                spot: "100",
                                shares: "1000 shares owned",
                                putStrike: "95 (5% protection)",
                                callStrike: "110 (10% cap)",
                                netCost: "~$0 (put cost = call premium)"
                            },
                            scenarios: [
                                "S_T = 80: Protected at 95, avoid $20k loss",
                                "S_T = 105: Keep stock + $5k gain",
                                "S_T = 120: Capped at 110, gain $10k (miss extra $10k)"
                            ]
                        }
                    },
                    {
                        name: "Calendar Spread",
                        short: "Profit from time decay and volatility term structure.",
                        hasPayoff: true,
                        definition: "Sell near-term option, buy same-strike longer-dated option. Benefits from faster decay of short option and potential volatility expansion in longer term.",
                        characteristics: {
                            construction: "Short near option + long far option",
                            view: "Neutral near-term, volatility play longer-term",
                            theta: "Positive from short leg",
                            vega: "Net positive from longer expiry",
                            risk: "Maximum loss = net debit paid",
                            management: "Close or roll before short expiry"
                        },
                        payoff: "\\text{Payoff} = V_{long}(T_2, \\sigma_2) - V_{short}(T_1, \\sigma_1) - \\text{Initial Cost}",
                        advantages: [
                            "Benefits from term structure of volatility",
                            "Limited risk (net debit)",
                            "Flexible adjustments possible"
                        ],
                        risks: [
                            "Short gamma into near expiry",
                            "Losses if volatility collapses",
                            "Execution complexity with two expirations"
                        ],
                        investorType: "Advanced traders managing theta and vega exposure across time.",
                        example: {
                            title: "Earnings volatility calendar",
                            parameters: {
                                spot: "50",
                                shortCall: "50 strike, 1 week (earnings), sell $2",
                                longCall: "50 strike, 5 weeks, buy $4",
                                netCost: "$200 debit"
                            },
                            scenarios: [
                                "Post-earnings IV crush benefits long dated option",
                                "If spot stays near 50, capture theta from short leg",
                                "Roll short leg weekly to continue collecting decay"
                            ]
                        }
                    },
                    {
                        name: "Box Spread",
                        short: "Arbitrage strategy combining bull and bear spreads.",
                        hasPayoff: true,
                        definition: "Simultaneously execute bull call spread and bear put spread with same strikes. Creates synthetic long/short position with no market risk, used for arbitrage.",
                        characteristics: {
                            construction: "Bull call spread + bear put spread",
                            payoff: "Fixed = difference between strikes",
                            risk: "Execution and early assignment",
                            use: "Locking in arbitrage or borrowing/lending",
                            margin: "May require margin depending on broker",
                            value: "Should equal PV of strike difference"
                        },
                        payoff: "\\text{Payoff} = (K_2 - K_1) \\text{ regardless of } S_T",
                        replication: "\\text{Box} = [\\text{Call}(K_1) - \\text{Call}(K_2)] + [\\text{Put}(K_2) - \\text{Put}(K_1)]",
                        advantages: [
                            "Market-neutral position",
                            "Guaranteed fixed payoff",
                            "Useful for mispricing arbitrage"
                        ],
                        risks: [
                            "Early assignment risk",
                            "Pin risk at expiration",
                            "Limited opportunity in liquid markets"
                        ],
                        investorType: "Arbitrageurs and sophisticated traders exploiting pricing inefficiencies."
                    }
                ]
            }
        },
        fr: {
            "vanilla": {
                title: "Options Vanilles",
                badge: "Instruments de Base",
                products: [
                    {
                        name: "Option Call Européenne",
                        short: "Profite d'une hausse avec perte limitée à la prime.",
                        hasPayoff: true,
                        definition: "Le call européen donne le droit d'acheter le sous-jacent au strike à l'échéance. Idéal pour exprimer une vue haussière avec risque maîtrisé.",
                        characteristics: {
                            underlying: "Actions, indices, devises, matières premières",
                            strike: "À la monnaie ou ajusté selon la vue",
                            maturity: "Quelques jours à plusieurs années",
                            premium: "Prime payée upfront",
                            delta: "Positif (0 à 1)",
                            settlement: "Cash ou livraison"
                        },
                        payoff: "\\text{Payoff} = \\max(S_T - K, 0) - \\text{Prime}",
                        advantages: [
                            "Upside illimité",
                            "Perte maximale connue",
                            "Produit très liquide"
                        ],
                        risks: [
                            "Décote temporelle si le sous-jacent stagne",
                            "Prime parfois élevée en forte volatilité"
                        ],
                        investorType: "Investisseurs recherchant un payoff convexe haussier."
                    },
                    {
                        name: "Option Put Européenne",
                        short: "Protection baissière à coût prédéfini.",
                        hasPayoff: true,
                        definition: "Le put offre le droit de vendre au strike. Il sécurise un portefeuille ou permet de spéculer sur une baisse contrôlée.",
                        characteristics: {
                            underlying: "Même univers que le call",
                            strike: "Souvent proche du spot pour couverture",
                            maturity: "Alignée sur l'horizon de risque",
                            premium: "Prime upfront",
                            delta: "Négatif",
                            settlement: "Cash ou livraison"
                        },
                        payoff: "\\text{Payoff} = \\max(K - S_T, 0) - \\text{Prime}",
                        advantages: [
                            "Plancher de protection explicite",
                            "Convexité utile en cas de chute"
                        ],
                        risks: [
                            "Prime pénalisante si marché stable",
                            "Sensibilité à la skew"
                        ],
                        investorType: "Couverture de portefeuilles ou vue baissière maîtrisée."
                    }
                ]
            },
            "spreads": {
                title: "Spreads d'Options",
                badge: "Vue Ciblée",
                products: [
                    {
                        name: "Bull Call Spread",
                        short: "Vue haussière modérée avec prime réduite.",
                        hasPayoff: true,
                        definition: "Achat d'un call à K1 et vente d'un call à K2 > K1 : la prime est réduite au prix d'un gain plafonné.",
                        characteristics: {
                            construction: "Long call K1 + short call K2",
                            strike: "K2 > K1",
                            maturity: "Même échéance",
                            premium: "Prime nette réduite",
                            maxGain: "K2 − K1 − prime nette",
                            maxLoss: "Prime nette"
                        },
                        payoff: "\\text{Payoff} = \\min\\{\\max(S_T - K_1,0), K_2 - K_1\\} - \\text{Prime nette}",
                        replication: "\\text{Bull Call Spread} = \\text{Call}(K_1) - \\text{Call}(K2) \\n\\n \\text{With } K_1 < K_2",
                        advantages: [
                            "Coût inférieur au call simple",
                            "Profil de gain/perte borné"
                        ],
                        risks: [
                            "Gain limité au-dessus de K2",
                            "Toujours sensible au theta"
                        ],
                        investorType: "Investisseurs haussiers mais disciplinés sur le coût."
                    },
                    {
                        name: "Bear Put Spread",
                        short: "Couverture baissière à coût maîtrisé.",
                        hasPayoff: true,
                        definition: "Achat d'un put K2 et vente d'un put K1 < K2. Permet une protection ciblée moins onéreuse.",
                        characteristics: {
                            construction: "Long put K2 + short put K1",
                            premium: "Prime nette limitée",
                            maxGain: "K2 − K1 − prime nette",
                            maxLoss: "Prime nette",
                            maturity: "Identique",
                            delta: "Négatif"
                        },
                        payoff: "\\text{Payoff} = \\min\\{\\max(K_2 - S_T, 0), K_2 - K_1\\} - \\text{Prime nette}",
                        replication: "\\text{Bear Put Spread} = \\text{Put}(K_2) - \\text{Put}(K_1) \\n\\n \\text{With } K_1 < K_2",
                        advantages: [
                            "Protection contre une baisse modérée",
                            "Prime contenue"
                        ],
                        risks: [
                            "Plus de protection sous K1",
                            "Valeur temps négative"
                        ],
                        investorType: "Couverture tactique de portefeuilles."
                    },
                    {
                        name: "Risk Reversal",
                        short: "Vente de put contre achat de call, prime quasi nulle.",
                        hasPayoff: true,
                        definition: "Vendre un put OTM et acheter un call OTM de delta équivalent pour capter la skew.",
                        characteristics: {
                            premium: "Souvent proche de zéro",
                            delta: "Positif",
                            strike: "Put < spot < Call",
                            maturity: "Identique",
                            useCase: "Skew FX / overlay actions"
                        },
                        payoff: "\\text{Payoff} = \\max(0, S_T - K_{call}) - \\max(0, K_{put} - S_T)",
                        replication: "\\text{Risk Reversal} = \\text{Call OTM}(K_1) - \\text{Put OTM}(K_2) \\n\\n \\text{With } K_2 < K_1",
                        advantages: [
                            "Peu de prime upfront",
                            "Capture la skew haussière"
                        ],
                        risks: [
                            "Perte importante si forte baisse",
                            "Exposition queue négative"
                        ],
                        investorType: "Exportateurs ou investisseurs tolérant une queue baissière."
                    }
                ]
            },
            "barrier": {
                title: "Digitales & Barrières",
                badge: "Dépendance au Chemin",
                products: [
                    {
                        name: "Digital Call",
                        short: "Payout fixe si le strike est dépassé.",
                        hasPayoff: true,
                        definition: "Verse un montant déterminé si S_T > K, sinon zéro.",
                        characteristics: {
                            payout: "Montant fixe Q",
                            strike: "Niveau cible",
                            premium: "Fonction de la probabilité implicite",
                            settlement: "Cash"
                        },
                        payoff: "\\text{Payoff} = \\mathbf{1}_{\\{S_T>K\\}}Q - \\text{Prime}",
                        replication: "\\text{Binary Call} = \\lim_{dK \\to 0} \\frac{1}{2\\, dK} \\big[ Call(K - dK) - Call(K + dK) \\big]",
                        advantages: [
                            "Lecture directe des probabilités",
                            "Structure simple"
                        ],
                        risks: [
                            "Prime perdue si l'événement ne se produit pas",
                            "Forte sensibilité à la volatilité"
                        ],
                        investorType: "Pari binaire sur un niveau précis."
                    },
                    {
                        name: "Call Barrière Up-and-Out",
                        short: "Call moins cher knock-out au franchissement de la barrière.",
                        hasPayoff: true,
                        definition: "Call classique tant que la barrière n'est pas touchée. Le payoff disparaît sinon.",
                        characteristics: {
                            strike: "Souvent ATM",
                            barrier: "KO au-dessus du spot",
                            premium: "Inférieure au call",
                            rebate: "Optionnel"
                        },
                        payoff: "\\text{Payoff} = \\mathbf{1}_{\\{KO\\,non\\,déclenché\\}}\\max(S_T-K,0) - \\text{Prime}",
                        replication: "\\text{CUO} = \\text{Call}(K_1) - \\text{Call}(K_2) - \\text{Call Digit}(K_2) \\n\\n \\text{With} K_2 > K_1",
                        advantages: [
                            "Prime réduite",
                            "Customisation via rebated"
                        ],
                        risks: [
                            "Perte totale si KO",
                            "Risque de gap"
                        ],
                        investorType: "Vue haussière modérée."
                    },
                    {
                        name: "Put Barrière Down-and-In",
                        short: "Protection tail activée sous un seuil.",
                        hasPayoff: true,
                        definition: "Se déclenche uniquement si la barrière basse est touchée, offrant une couverture crash économique.",
                        characteristics: {
                            strike: "Proche du spot",
                            barrier: "KI sous le spot",
                            premium: "Inférieure au put classique",
                            settlement: "Cash ou livraison"
                        },
                        payoff: "\\text{Payoff} = \\mathbf{1}_{\\{KI\\}}\\max(K-S_T,0) - \\text{Prime}",
                        replication: "\\text{PDI} = \\text{Put} - \\text{PDO}",
                        advantages: [
                            "Couverture peu coûteuse",
                            "Protection dans scénarios extrêmes"
                        ],
                        risks: [
                            "Pas de protection si barrière intacte",
                            "Activation potentielle sur gap"
                        ],
                        investorType: "Portefeuilles acceptant un déclencheur de crise."
                    }
                ]
            },
            "path": {
                title: "Options de Chemin",
                badge: "Payoffs Exotiques",
                products: [
                    {
                        name: "Option Asiatique (Call)",
                        short: "Payoff basé sur la moyenne des fixings.",
                        hasPayoff: true,
                        definition: "Le payoff dépend de la moyenne arithmétique des observations. Idéal pour lisser un programme d'achats.",
                        characteristics: {
                            averaging: "Moyenne arithmétique",
                            strike: "Appliqué à la moyenne",
                            premium: "Moins chère qu'un call classique",
                            useCase: "Flux matières/FX"
                        },
                        payoff: "\\text{Payoff} = \\max(\\bar{S} - K, 0) - \\text{Prime}",
                        advantages: [
                            "Réduit le timing risk",
                            "Prime plus faible"
                        ],
                        risks: [
                            "Ne profite pas d'un pic final",
                            "Modélisation plus complexe"
                        ],
                        investorType: "Couverture moyenne pour corporates."
                    },
                    {
                        name: "Option Lookback (Strike flottant)",
                        short: "Capture la hausse maximale observée.",
                        hasPayoff: true,
                        definition: "Le strike correspond au minimum observé pendant la vie de l'option, assurant la meilleure entrée.",
                        characteristics: {
                            monitoring: "Continu ou discret",
                            premium: "Élevée",
                            delta: "Très dépendant du chemin",
                            settlement: "Cash"
                        },
                        payoff: "\\text{Payoff} = (S_T - \\min S_t) - \\text{Prime}",
                        advantages: [
                            "Élimine le risque de timing",
                            "Capture complète du rebond"
                        ],
                        risks: [
                            "Prime élevée",
                            "Gestion des greeks complexe"
                        ],
                        investorType: "Investisseurs sophistiqués cherchant une capture maximale."
                    }
                ]
            },
            "strategies": {
                title: "Stratégies Multi-Options",
                badge: "Overlays de Portefeuille",
                products: [
                    {
                        name: "Long Straddle",
                        short: "Pari sur forte volatilité via achat de call et put ATM.",
                        hasPayoff: true,
                        definition: "Acheter un call et un put ATM avec même strike et échéance. Profite des mouvements importants dans les deux sens moyennant prime élevée.",
                        characteristics: {
                            construction: "Call long + put long (même strike K)",
                            view: "Forte volatilité attendue",
                            premium: "Double prime payée d'avance",
                            breakeven: "K ± prime totale",
                            vega: "Positif (long volatilité)",
                            theta: "Négatif (érosion temporelle)"
                        },
                        payoff: "\\text{Payoff} = \\max(S_T - K, 0) + \\max(K - S_T, 0)",
                        replication: "\\text{Straddle} = \\text{Call}(K) + \\text{Put}(K)",
                        advantages: [
                            "Profit illimité dans les deux sens",
                            "Perte maximale définie (prime totale)",
                            "Stratégie de volatilité simple"
                        ],
                        risks: [
                            "Coûteux en environnement de forte IV",
                            "Perte due au theta si stagnation",
                            "Nécessite mouvement important pour profit"
                        ],
                        investorType: "Traders de volatilité anticipant des mouvements significatifs."
                    },
                    {
                        name: "Long Strangle",
                        short: "Volatilité moins chère avec points morts plus larges.",
                        hasPayoff: true,
                        definition: "Acheter call et put OTM avec strikes différents. Moins cher que le straddle mais nécessite mouvements plus importants.",
                        characteristics: {
                            construction: "Call OTM long + put OTM long",
                            premium: "Inférieure au straddle",
                            breakeven: "Au-delà des deux strikes ± prime",
                            vega: "Positif",
                            theta: "Négatif mais moins sévère",
                            delta: "Initialement proche de zéro"
                        },
                        payoff: "\\text{Payoff} = \\max(S_T - K_{call}, 0) + \\max(K_{put} - S_T, 0)",
                        replication: "\\text{Strangle} = \\text{Call OTM} + \\text{Put OTM}",
                        advantages: [
                            "Coût initial inférieur au straddle",
                            "Profit illimité haut et bas",
                            "Efficace avant événements binaires"
                        ],
                        risks: [
                            "Zone de breakeven plus large nécessaire",
                            "Perte totale si spot reste entre strikes",
                            "Décote temporelle accélère près expiration"
                        ],
                        investorType: "Traders volatilité cherchant exposition moins chère avec zones profit plus larges."
                    },
                    {
                        name: "Short Strangle",
                        short: "Encaisser la prime en pariant sur faible volatilité.",
                        hasPayoff: true,
                        definition: "Vendre call et put OTM simultanément. Profit de la prime si marché reste dans range, mais risque illimité sur cassures.",
                        characteristics: {
                            construction: "Call OTM court + put OTM court",
                            premium: "Encaissée d'avance",
                            profit: "Prime maximale si spot entre strikes",
                            risk: "Illimité des deux côtés",
                            vega: "Négatif (short volatilité)",
                            theta: "Positif (bénéfice de la décote)"
                        },
                        payoff: "\\text{Payoff} = \\text{Prime} - \\max(S_T - K_{call}, 0) - \\max(K_{put} - S_T, 0)",
                        replication: "\\text{Short Strangle = - Long Strangle}",
                        advantages: [
                            "Revenu de prime immédiat",
                            "Profits en marchés range-bound",
                            "Haute probabilité de profit partiel"
                        ],
                        risks: [
                            "Potentiel de perte illimité",
                            "Exigences de marge",
                            "Dangereux en marchés volatils"
                        ],
                        investorType: "Traders sophistiqués acceptant risque de queue en marchés calmes."
                    },
                    {
                        name: "Long Butterfly",
                        short: "Pari à risque limité sur faible volatilité autour prix cible.",
                        hasPayoff: true,
                        definition: "Acheter 1 call strike bas, vendre 2 calls strike moyen, acheter 1 call strike haut. Profite si spot reste près du strike moyen à expiration.",
                        characteristics: {
                            construction: "Call long K1, 2 calls courts K2, call long K3",
                            strikes: "Équidistants: K2 - K1 = K3 - K2",
                            premium: "Débit net (payé)",
                            maxProfit: "À K2 à l'expiration",
                            maxLoss: "Prime nette payée",
                            vega: "Négatif près de K2"
                        },
                        payoff: "\\text{Payoff} = \\max(S_T - K_1, 0) - 2\\max(S_T - K_2, 0) + \\max(S_T - K_3, 0) - \\text{Coût net}",
                        replication: "\\text{Butterfly} = \\text{Bull Spread} + \\text{Bear Spread}",
                        advantages: [
                            "Risque limité (connu d'avance)",
                            "Profite de faible volatilité",
                            "Coût inférieur à vente de straddle"
                        ],
                        risks: [
                            "Potentiel de profit limité",
                            "Nécessite prix cible précis",
                            "Multiples jambes = commissions élevées"
                        ],
                        investorType: "Traders range-bound avec objectifs de prix spécifiques."
                    },
                    {
                        name: "Iron Condor",
                        short: "Stratégie crédit profitant de marchés range-bound.",
                        hasPayoff: true,
                        definition: "Vendre spread put OTM et spread call OTM simultanément. Encaisse prime si sous-jacent reste dans range.",
                        characteristics: {
                            construction: "Bull put spread + bear call spread",
                            premium: "Crédit net reçu",
                            maxProfit: "Prime complète si spot entre strikes moyens",
                            maxLoss: "Largeur aile - prime",
                            bestCase: "Faible volatilité",
                            margin: "Requise pour options courtes"
                        },
                        payoff: "\\text{Payoff} = \\text{Prime} - \\max(0, K_{put2} - S_T) + \\max(0, K_{put1} - S_T) - \\max(0, S_T - K_{call1}) + \\max(0, S_T - K_{call2})",
                        replication: "\\text{Iron Condor} = \\text{Short Strangle} + \\text{Call}(K_2) + \\text{Put}(K_1)",
                        advantages: [
                            "Risque défini avec ailes protectrices",
                            "Prime encaissée d'avance",
                            "Stratégies haute probabilité"
                        ],
                        risks: [
                            "Potentiel profit limité",
                            "Nécessite gestion active",
                            "Risque d'assignment sur jambes courtes"
                        ],
                        investorType: "Traders revenu acceptant scénarios range-bound et risque défini."
                    },
                    {
                        name: "Covered Call",
                        short: "Générer revenu en vendant calls sur position actions longue.",
                        hasPayoff: true,
                        definition: "Détenir 100 actions et vendre 1 contrat call. Encaisser prime comme revenu tout en plafonnant hausse au strike. Si exercé, conserver prime + gain capital jusqu'au strike.",
                        characteristics: {
                            construction: "100 actions longues + 1 call court",
                            view: "Neutre à légèrement haussier",
                            income: "Prime du call",
                            protection: "Prime reçue",
                            maxGain: "(Strike - prix achat) + prime",
                            risk: "Baisse complète moins prime"
                        },
                        payoff: "\\text{Payoff} = (S_T - S_0) + \\text{Prime} - \\max(0, S_T - K)",
                        replication: "\\text{Covered Call} = \\text{Action longue} + \\text{Call court}",
                        advantages: [
                            "Génère revenu constant",
                            "Réduit coût de base dans le temps",
                            "Simple à exécuter et gérer"
                        ],
                        risks: [
                            "Hausse plafonnée au strike",
                            "Actions peuvent toujours baisser significativement",
                            "Coût d'opportunité si action monte"
                        ],
                        investorType: "Investisseurs orientés revenu prêts à plafonner hausse pour prime.",
                        example: {
                            title: "Covered call mensuel sur AAPL",
                            parameters: {
                                spot: "175",
                                shares: "100 actions détenues",
                                strike: "180",
                                premium: "3,50$ par action = 350$ total",
                                maturity: "30 jours"
                            },
                            scenarios: [
                                "S_T = 170: Conserver actions + 350$ prime (amortit 500$ perte)",
                                "S_T = 178: Conserver actions + 350$ prime (gain 650$ total)",
                                "S_T = 185: Actions exercées à 180, gain 500$ + 350$ prime = 850$ total",
                                "S_T = 200: Actions exercées à 180, manque 2000$ hausse mais gain 850$ quand même"
                            ]
                        }
                    },
                    {
                        name: "Protective Collar",
                        short: "Couverture coût zéro: acheter protection put, vendre call pour financement.",
                        hasPayoff: true,
                        definition: "Détenir actions, acheter put protecteur, vendre call à strike supérieur. Prime du call finance le put, créant range risque/rendement défini à coût minimal ou nul.",
                        characteristics: {
                            construction: "Actions longues + put long + call court",
                            cost: "Proche de zéro (prime call compense coût put)",
                            floor: "Strike put définit protection baisse",
                            cap: "Strike call plafonne hausse",
                            useCase: "Préservation capital avec hausse limitée",
                            holding: "Typiquement renouvelé trimestriellement"
                        },
                        payoff: "\\text{Payoff} = \\begin{cases} K_{call} - S_0 \\pm \\text{coût net} & \\text{si } S_T > K_{call} \\\\ S_T - S_0 \\pm \\text{coût net} & \\text{si } K_{put} < S_T \\leq K_{call} \\\\ K_{put} - S_0 \\pm \\text{coût net} & \\text{si } S_T \\leq K_{put} \\end{cases}",
                        replication: "\\text{Collar} = \\text{Actions longues} + \\text{Put} - \\text{Call}",
                        advantages: [
                            "Baisse protégée à niveau connu",
                            "Coût zéro ou minimal",
                            "Permet participation jusqu'au strike call"
                        ],
                        risks: [
                            "Hausse plafonnée",
                            "Nécessite gestion renouvellement",
                            "Complexité trois jambes"
                        ],
                        investorType: "Investisseurs conservateurs protégeant gains ou couvrant positions concentrées.",
                        example: {
                            title: "Collar protecteur sur position concentrée",
                            parameters: {
                                spot: "100",
                                shares: "1000 actions détenues",
                                putStrike: "95 (protection 5%)",
                                callStrike: "110 (plafond 10%)",
                                netCost: "~0$ (coût put = prime call)"
                            },
                            scenarios: [
                                "S_T = 80: Protégé à 95, évite 20k$ perte",
                                "S_T = 105: Conserver actions + 5k$ gain",
                                "S_T = 120: Plafonné à 110, gain 10k$ (manque 10k$ extra)"
                            ]
                        }
                    },
                    {
                        name: "Calendar Spread",
                        short: "Profiter de décote temporelle et structure terme volatilité.",
                        hasPayoff: true,
                        definition: "Vendre option court terme, acheter option même strike long terme. Bénéficie de décote plus rapide option courte et expansion potentielle volatilité long terme.",
                        characteristics: {
                            construction: "Option courte proche + option longue lointaine",
                            view: "Neutre court terme, jeu volatilité long terme",
                            theta: "Positif de jambe courte",
                            vega: "Net positif d'expiration longue",
                            risk: "Perte maximale = débit net payé",
                            management: "Fermer ou renouveler avant expiration courte"
                        },
                        payoff: "\\text{Payoff} = V_{long}(T_2, \\sigma_2) - V_{short}(T_1, \\sigma_1) - \\text{Coût initial}",
                        advantages: [
                            "Bénéficie structure terme volatilité",
                            "Risque limité (débit net)",
                            "Ajustements flexibles possibles"
                        ],
                        risks: [
                            "Gamma court vers expiration proche",
                            "Pertes si volatilité s'effondre",
                            "Complexité exécution deux expirations"
                        ],
                        investorType: "Traders avancés gérant exposition theta et vega dans le temps.",
                        example: {
                            title: "Calendar volatilité résultats",
                            parameters: {
                                spot: "50",
                                shortCall: "Strike 50, 1 semaine (résultats), vendre 2$",
                                longCall: "Strike 50, 5 semaines, acheter 4$",
                                netCost: "200$ débit"
                            },
                            scenarios: [
                                "Écrasement IV post-résultats bénéficie option longue",
                                "Si spot reste près 50, capturer theta de jambe courte",
                                "Renouveler jambe courte hebdo pour continuer collecter décote"
                            ]
                        }
                    },
                    {
                        name: "Box Spread",
                        short: "Stratégie arbitrage combinant spreads bull et bear.",
                        hasPayoff: true,
                        definition: "Exécuter simultanément bull call spread et bear put spread avec mêmes strikes. Crée position synthétique long/short sans risque marché, utilisé pour arbitrage.",
                        characteristics: {
                            construction: "Bull call spread + bear put spread",
                            payoff: "Fixe = différence entre strikes",
                            risk: "Exécution et assignment anticipé",
                            use: "Verrouillage arbitrage ou emprunt/prêt",
                            margin: "Peut nécessiter marge selon courtier",
                            value: "Devrait égaler VA différence strikes"
                        },
                        payoff: "\\text{Payoff} = (K_2 - K_1) \\text{ quel que soit } S_T",
                        replication: "\\text{Box} = [\\text{Call}(K_1) - \\text{Call}(K_2)] + [\\text{Put}(K_2) - \\text{Put}(K_1)]",
                        advantages: [
                            "Position neutre au marché",
                            "Payoff fixe garanti",
                            "Utile pour arbitrage mispricing"
                        ],
                        risks: [
                            "Risque assignment anticipé",
                            "Risque pin à expiration",
                            "Opportunité limitée marchés liquides"
                        ],
                        investorType: "Arbitragistes et traders sophistiqués exploitant inefficiences prix."
                    }
                ]
            }
        }
    };

    window.OPTION_PRODUCTS = OPTION_PRODUCTS;
    if (!window.PRODUCTS_DATA) {
        window.PRODUCTS_DATA = OPTION_PRODUCTS;
    }
    if (!window.getPayoffData && window.getOptionPayoffData) {
        window.getPayoffData = window.getOptionPayoffData;
    }
    if (!window.calculatePayoffArray && window.calculateOptionPayoffArray) {
        window.calculatePayoffArray = window.calculateOptionPayoffArray;
    }
    if (!window.renderPayoffChart) {
        window.renderPayoffChart = function(name, containerId) {
            if (window.optionRenderPayoffChart) {
                return window.optionRenderPayoffChart(name, containerId);
            }
        };
    }
})();
