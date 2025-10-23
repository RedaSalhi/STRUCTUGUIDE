(() => {
  const doc = document;

  let currentLanguage = 'en';
  let currentTrack = null;
  let questionIndex = 0;
  let answered = 0;
  let correct = 0;
  let streak = 0;
  let bestStreak = 0;
  let awaitingValidation = true;

  const dom = {};

  const ui = {
    en: {
      navHome: 'Home',
      navStructured: 'Structured',
      navOptions: 'Options',
      navCompare: 'Comparator',
      navQuiz: 'Quiz',
      headerTitle: 'Quiz Lab',
      headerTagline: '',
      heroTitle: 'Turn market interviews into a game',
      heroDescription: 'Sharpen your structuring reflexes with themed drills covering capital protection, autocalls, vanilla mechanics and exotic puzzles.',
      heroCta: 'Pick your track',
      tracksTitle: 'Choose your playground',
      tracksSubtitle: 'Start with structured foundations, climb to income boosters, then unlock the exotic dojo.',
      cardQuestions: 'questions',
      startTrack: 'Start',
      scoreLabel: 'Score',
      streakLabel: '🔥 Streak',
      bestLabel: 'best',
      progressLabel: 'Question',
      validate: 'Validate',
      next: 'Next',
      finish: 'View summary',
      skip: 'Skip',
      exit: 'Change track',
      selectPrompt: 'Pick an answer before validating.',
      correctPrefix: 'Right on! ',
      incorrectPrefix: 'Not quite. ',
      correctAnswerLabel: 'Correct answer:',
      explanationLabel: 'Explanation:',
      summaryTitle: 'Track completed',
      summaryScore: 'You scored {score} / {total} ({percent}%).',
      summaryBadgePrefix: 'Badge unlocked:',
      summaryRetry: 'Replay track',
      summaryHome: 'Pick another track',
      badgeBeginner: 'Apprentice Structurer 🌀',
      badgeIntermediate: 'Deal Maker ⚡️',
      badgeAdvanced: 'Structuring Pro 🛡️',
      badgeMaster: 'Market Wizard 🧠',
      footerDisclaimer: 'Information provided for educational purposes.',
      footerCopyright: '© 2025 REDA SALHI - All rights reserved.',
      skipMessage: 'Skipped — you can revisit it later in another run.',
      streakReset: 'Streak reset.',
      trackComplete: 'Track already completed. Replaying resets your streak.'
    },
    fr: {
      navHome: 'Accueil',
      navStructured: 'Structurés',
      navOptions: 'Options',
      navCompare: 'Comparateur',
      navQuiz: 'Quiz',
      headerTitle: 'Quiz Lab',
      headerTagline: '',
      heroTitle: 'Transforme les entretiens de marché en jeu',
      heroDescription: 'Affûte tes réflexes de structuration avec des drills thématiques : protection, autocalls, vanilles et énigmes exotiques.',
      heroCta: 'Choisis ta piste',
      tracksTitle: 'Choisis ton terrain',
      tracksSubtitle: 'Commence par les fondamentaux, booste ton revenu, puis entre dans le dojo des exotiques.',
      cardQuestions: 'questions',
      startTrack: 'Lancer',
      scoreLabel: 'Score',
      streakLabel: '🔥 Série',
      bestLabel: 'record',
      progressLabel: 'Question',
      validate: 'Valider',
      next: 'Suivante',
      finish: 'Voir le récap',
      skip: 'Passer',
      exit: 'Changer de piste',
      selectPrompt: 'Sélectionne une réponse avant de valider.',
      correctPrefix: 'Bravo ! ',
      incorrectPrefix: 'Presque. ',
      correctAnswerLabel: 'Bonne réponse :',
      explanationLabel: 'Explication :',
      summaryTitle: 'Piste terminée',
      summaryScore: 'Tu as obtenu {score} / {total} ({percent} %).',
      summaryBadgePrefix: 'Badge débloqué :',
      summaryRetry: 'Rejouer la piste',
      summaryHome: 'Choisir une autre piste',
      badgeBeginner: 'Apprenti Structurer 🌀',
      badgeIntermediate: 'Deal Maker ⚡️',
      badgeAdvanced: 'Pro de la structure 🛡️',
      badgeMaster: 'Magicien des marchés 🧠',
      footerDisclaimer: 'Informations fournies à titre pédagogique.',
      footerCopyright: '© 2025 REDA SALHI - Tous droits réservés.',
      skipMessage: 'Question passée — tu pourras y revenir lors d’une autre session.',
      streakReset: 'Série remise à zéro.',
      trackComplete: 'Piste déjà terminée. Rejouer réinitialise ta série.'
    }
  };

  const tracks = [
    {
      id: 'capital-shield',
      name: {
        en: 'Capital Shield',
        fr: 'Bouclier Capital'
      },
      badge: {
        en: 'Capital Protection',
        fr: 'Protection du capital'
      },
      level: {
        en: 'Level 1 • Fundamentals',
        fr: 'Niveau 1 • Fondamentaux'
      },
      description: {
        en: 'Guarantee the nominal, mix zeros and calls, and tame CPPI cash locks.',
        fr: 'Garantis le nominal, mixe zéro-coupon et call, dompte les cash-locks du CPPI.'
      },
      color: 'rgba(37,99,235,0.45)',
      questions: [
        {
          question: {
            en: 'Which building blocks create a capital guaranteed note at maturity?',
            fr: 'Quels blocs de construction créent une note à capital garanti à maturité ?'
          },
          options: [
            { en: 'Zero-coupon bond + call option', fr: 'Zéro-coupon + option call' },
            { en: 'Coupon bond + put option', fr: 'Obligation coupon + option put' },
            { en: 'Forward + swap', fr: 'Forward + swap' },
            { en: 'Deposit + futures', fr: 'Dépôt + futures' }
          ],
          correct: 0,
          explanation: {
            en: 'The zero-coupon locks the principal, the call delivers upside participation.',
            fr: 'Le zéro-coupon sécurise le nominal et le call apporte la participation à la hausse.'
          }
        },
        {
          question: {
            en: 'In a CPPI, what happens when the cushion hits zero?',
            fr: 'Dans un CPPI, que se passe-t-il lorsque le coussin devient nul ?'
          },
          options: [
            { en: 'The strategy leverages more risk assets', fr: 'La stratégie accroît le levier sur les actifs risqués' },
            { en: 'The allocation shifts fully to the risk-free asset', fr: 'Toute l’allocation part sur l’actif sans risque' },
            { en: 'Coupons are forfeited', fr: 'Les coupons sont perdus' },
            { en: 'Strike is reset', fr: 'Le strike est réinitialisé' }
          ],
          correct: 1,
          explanation: {
            en: 'Once the cushion is zero the portfolio goes risk-off (cash-lock) to preserve capital.',
            fr: 'Coussin nul = désallocation vers le sans risque (cash-lock) pour préserver le capital.'
          }
        },
        {
          question: {
            en: 'Higher interest rates typically make capital protection…',
            fr: 'Des taux d’intérêt plus élevés rendent la protection du capital…'
          },
          options: [
            { en: 'Cheaper because the zero-coupon costs less', fr: 'Moins chère car le zéro-coupon coûte moins' },
            { en: 'More expensive because carry is higher', fr: 'Plus chère car le carry est plus élevé' },
            { en: 'Unaffected', fr: 'Sans impact' },
            { en: 'Impossible to structure', fr: 'Impossible à structurer' }
          ],
          correct: 0,
          explanation: {
            en: 'Discounting at higher rates lowers the price of the zero-coupon, freeing option budget.',
            fr: 'Un taux d’actualisation élevé baisse le prix du zéro-coupon et libère du budget optionnel.'
          }
        },
        {
          question: {
            en: 'Main residual risk on a “100% protected” note?',
            fr: 'Risque résiduel principal sur une note « 100 % protégée » ?'
          },
          options: [
            { en: 'Issuer credit risk', fr: 'Risque de crédit de l’émetteur' },
            { en: 'Gamma risk', fr: 'Risque de gamma' },
            { en: 'Liquidity of the underlying', fr: 'Liquidité du sous-jacent' },
            { en: 'FX translation', fr: 'Conversion de change' }
          ],
          correct: 0,
          explanation: {
            en: 'Capital protection is a promise of the issuer, so it is exposed to its credit risk.',
            fr: 'La protection dépend de la signature de l’émetteur, donc du risque de crédit.'
          }
        }
      ]
    },
    {
      id: 'vanilla-core',
      name: {
        en: 'Vanilla Core',
        fr: 'Vanilles Essentielles'
      },
      badge: {
        en: 'Calls & Puts',
        fr: 'Calls & puts'
      },
      level: {
        en: 'Level 3 • Option intuition',
        fr: 'Niveau 3 • Intuition options'
      },
      description: {
        en: 'Refresh delta-gamma thinking, moneyness intuition and payoff sketches.',
        fr: 'Revois delta, gamma, notion de moneyness et sketches de payoff.'
      },
      color: 'rgba(16,185,129,0.45)',
      questions: [
        {
          question: {
            en: 'Delta of an at-the-money call on a non-dividend stock is closest to…',
            fr: 'Le delta d’un call at-the-money sur une action sans dividende est proche de…'
          },
          options: [
            { en: '0', fr: '0' },
            { en: '0.5', fr: '0,5' },
            { en: '1', fr: '1' },
            { en: '-0.5', fr: '-0,5' }
          ],
          correct: 1,
          explanation: {
            en: 'ATM calls typically have delta ~0.5 because the move up is half likely.',
            fr: 'Un call ATM a en général un delta proche de 0,5 (probabilité de finir dans la monnaie ~50 %).'
          }
        },
        {
          question: {
            en: 'Selling a covered call (long stock + short call) limits…',
            fr: 'Vendre un covered call (long action + call short) limite…'
          },
          options: [
            { en: 'Downside below zero', fr: 'La baisse sous zéro' },
            { en: 'Upside beyond the strike', fr: 'La hausse au-delà du strike' },
            { en: 'Gamma risk', fr: 'Le risque de gamma' },
            { en: 'Theta decay', fr: 'La perte de thêta' }
          ],
          correct: 1,
          explanation: {
            en: 'Covered calls cap the upside at the strike in exchange for the premium.',
            fr: 'Le covered call plafonne la hausse au strike en échange de la prime encaissée.'
          }
        },
        {
          question: {
            en: 'Which Greek measures sensitivity to volatility?',
            fr: 'Quel grec mesure la sensibilité à la volatilité ?'
          },
          options: [
            { en: 'Gamma', fr: 'Gamma' },
            { en: 'Vega', fr: 'Vega' },
            { en: 'Theta', fr: 'Thêta' },
            { en: 'Rho', fr: 'Rho' }
          ],
          correct: 1,
          explanation: {
            en: 'Vega captures the change in option value for a 1% change in implied volatility.',
            fr: 'Le vega traduit la variation de valeur pour 1 % de volatilité implicite en plus ou en moins.'
          }
        },
        {
          question: {
            en: 'Buying a straddle (ATM call + ATM put) performs best when…',
            fr: 'Acheter un straddle (call ATM + put ATM) performe surtout lorsque…'
          },
          options: [
            { en: 'Realized volatility exceeds implied volatility', fr: 'La volatilité réalisée dépasse la volatilité implicite' },
            { en: 'Rates fall sharply', fr: 'Les taux chutent fortement' },
            { en: 'Dividends surprise on the upside', fr: 'Les dividendes surprennent à la hausse' },
            { en: 'The market drifts slowly upward', fr: 'Le marché monte doucement' }
          ],
          correct: 0,
          explanation: {
            en: 'Straddles need big moves. Realized volatility above implied pays the long premium.',
            fr: 'Un straddle vit de grands mouvements : si la vol réalisée dépasse l’implicite, la prime est rentabilisée.'
          }
        }
      ]
    },
    {
      id: 'exotic-mastery',
      name: {
        en: 'Master the Exotics',
        fr: 'Maîtrise les Exotiques'
      },
      badge: {
        en: 'Exotic Lab',
        fr: 'Exotic Lab'
      },
      level: {
        en: 'Level 4 • Path wisdom',
        fr: 'Niveau 4 • Path dependent'
      },
      description: {
        en: 'Decode barriers, lookbacks and digitals — the interview classics.',
        fr: 'Décode barrières, lookbacks et digitals — les incontournables d’entretien.'
      },
      color: 'rgba(234,179,8,0.45)',
      questions: [
        {
          question: {
            en: 'A knock-in barrier option only becomes active if…',
            fr: 'Une option knock-in ne devient active que si…'
          },
          options: [
            { en: 'The barrier is never touched', fr: 'La barrière n’est jamais touchée' },
            { en: 'The barrier is touched during the life', fr: 'La barrière est touchée pendant la vie de l’option' },
            { en: 'Spot closes beyond the strike', fr: 'Le spot clôt au-delà du strike' },
            { en: 'Interest rates move', fr: 'Les taux bougent' }
          ],
          correct: 1,
          explanation: {
            en: 'Knock-ins activate on a touch of the barrier; without it they expire worthless.',
            fr: 'Une knock-in s’active dès que la barrière est touchée; sinon elle expire sans effet.'
          }
        },
        {
          question: {
            en: 'Which payoff depends on the maximum price reached during the option life?',
            fr: 'Quel payoff dépend du prix maximum atteint pendant la vie de l’option ?'
          },
          options: [
            { en: 'Lookback call', fr: 'Lookback call' },
            { en: 'Binary put', fr: 'Put digital' },
            { en: 'As-you-like-it note', fr: 'Produit flexi' },
            { en: 'Rainbow option', fr: 'Option arc-en-ciel' }
          ],
          correct: 0,
          explanation: {
            en: 'A lookback call pays off using the highest spot observed, making it path dependent.',
            fr: 'Un lookback call paie selon le spot maximum observé : c’est une option path-dependent.'
          }
        },
        {
          question: {
            en: 'Digital (binary) options are most sensitive to…',
            fr: 'Les options digitales (binaires) sont surtout sensibles à…'
          },
          options: [
            { en: 'Gamma near maturity', fr: 'Le gamma proche de l’échéance' },
            { en: 'Rho at initiation', fr: 'Le rho à l’initiation' },
            { en: 'Dividend forecasts', fr: 'Les dividendes anticipés' },
            { en: 'Spot drift', fr: 'La dérive du spot' }
          ],
          correct: 0,
          explanation: {
            en: 'Digitals have explosive gamma around the strike as maturity approaches.',
            fr: 'Les digitales ont un gamma très élevé autour du strike à l’approche de l’échéance.'
          }
        },
        {
          question: {
            en: 'Structured shark fins combine…',
            fr: 'Les produits « shark fin » combinent…'
          },
          options: [
            { en: 'Capital floor with boosted upside above a cap', fr: 'Plancher de capital + upside boosté sous plafond' },
            { en: 'Pure digital payoff', fr: 'Payoff purement digital' },
            { en: 'Only linear participation', fr: 'Uniquement de la participation linéaire' },
            { en: 'Fixed coupon regardless of path', fr: 'Coupon fixe quel que soit le chemin' }
          ],
          correct: 0,
          explanation: {
            en: 'Shark fins secure a floor yet deliver leveraged gains up to a knockout cap.',
            fr: 'Les shark fins sécurisent un plancher et offrent un levier jusqu’à un cap de knockout.'
          }
        }
      ]
    },
    {
      id: 'capital-protection',
      name: {
        en: 'Capital Protection',
        fr: 'Protection du capital'
      },
      badge: {
        en: 'Capital Guarantee',
        fr: 'Garantie du capital'
      },
      level: {
        en: 'Level 1 • Fundamentals',
        fr: 'Niveau 1 • Fondamentaux'
      },
      description: {
        en: 'Master capital-protected payoffs, CPPI mechanics and issuer risk checks.',
        fr: 'Maîtrise les payoffs garantis, la mécanique CPPI et le risque émetteur.'
      },
      color: 'rgba(37,99,235,0.4)',
      questions: [
        {
          question: {
            en: 'What is the main advantage of a Capital Protection Note?',
            fr: 'Quel est l’avantage principal d’une Capital Protection Note ?'
          },
          options: [
            { en: 'Guaranteed high return', fr: 'Rendement élevé garanti' },
            { en: '100% capital protection', fr: 'Protection du capital à 100%' },
            { en: 'No fees', fr: 'Pas de frais' },
            { en: 'Full liquidity', fr: 'Liquidité totale' }
          ],
          correct: 1,
          explanation: {
            en: 'The Capital Protection Note guarantees repayment of the initial capital at maturity.',
            fr: 'La Capital Protection Note garantit le remboursement du capital initial à maturité.'
          }
        },
        {
          question: {
            en: 'In a CPPI, what happens if the cushion becomes negative?',
            fr: 'Dans un CPPI, que se passe-t-il si le coussin devient négatif ?'
          },
          options: [
            { en: 'The product turns short', fr: 'Le produit devient short' },
            { en: 'The strategy shifts into risk-free assets', fr: 'La stratégie passe en désallocation vers sans-risque' },
            { en: 'Leverage is increased', fr: 'On augmente le levier' },
            { en: 'Nothing changes', fr: 'Rien ne change' }
          ],
          correct: 1,
          explanation: {
            en: 'If the cushion turns negative, the strategy deallocates from risky assets (cash lock).',
            fr: 'Si le coussin devient négatif, la stratégie se désalloue des actifs risqués (cash-lock).'
          }
        },
        {
          question: {
            en: 'Which instrument is combined with a zero-coupon bond to structure a guaranteed product?',
            fr: 'Quel instrument est combiné avec un zéro coupon pour structurer un produit garanti ?'
          },
          options: [
            { en: 'Call option', fr: 'Option call' },
            { en: 'Put option', fr: 'Option put' },
            { en: 'Interest rate swap', fr: 'Swap de taux' },
            { en: 'Futures', fr: 'Futures' }
          ],
          correct: 0,
          explanation: {
            en: 'A call is purchased to capture upside while securing the principal.',
            fr: 'On achète un call pour capter l’upside tout en garantissant le nominal.'
          }
        },
        {
          question: {
            en: 'What is the main residual risk of a capital-guaranteed product?',
            fr: 'Quel est le principal risque résiduel d’un produit à capital garanti ?'
          },
          options: [
            { en: 'Volatility', fr: 'Volatilité' },
            { en: 'Issuer credit risk', fr: 'Risque de crédit de l’émetteur' },
            { en: 'Currency risk', fr: 'Risque de change' },
            { en: 'Taxation', fr: 'Fiscalité' }
          ],
          correct: 1,
          explanation: {
            en: 'The guarantee depends on the issuer’s solvency, hence credit risk.',
            fr: 'La garantie dépend de la solvabilité de l’émetteur (risque de crédit).'
          }
        },
        {
          question: {
            en: 'Which market parameter makes protection cheaper?',
            fr: 'Quel paramètre de marché rend la protection moins chère ?'
          },
          options: [
            { en: 'High interest rates', fr: 'Taux élevés' },
            { en: 'High volatility', fr: 'Volatilité élevée' },
            { en: 'Low rates', fr: 'Taux bas' },
            { en: 'High dividends', fr: 'Dividendes élevés' }
          ],
          correct: 0,
          explanation: {
            en: 'Higher rates reduce the cost of the zero-coupon bond, freeing budget for options.',
            fr: 'Des taux élevés permettent d’acheter le zéro coupon moins cher, libérant du budget.'
          }
        }
      ]
    },
    {
      id: 'autocalls',
      name: { en: 'Autocalls', fr: 'Autocalls' },
      badge: {
        en: 'Autocall Lab',
        fr: 'Lab Autocall'
      },
      level: {
        en: 'Level 2 • Yield tactics',
        fr: 'Niveau 2 • Tactiques de rendement'
      },
      description: {
        en: 'Trigger early redemptions, balance barriers, calibrate coupons and downside buffers.',
        fr: 'Déclenche des remboursements anticipés, équilibre barrières, coupons et coussins de baisse.'
      },
      color: 'rgba(124,58,237,0.45)',
      questions: [
        {
          question: { en: 'What is an autocall?', fr: 'Qu’est-ce qu’un autocall ?' },
          options: [
            { en: 'An automatic call', fr: 'Un call automatique' },
            { en: 'A conditional early-redemption product', fr: 'Un produit à remboursement anticipé conditionnel' },
            { en: 'A barrier option', fr: 'Une option barrière' },
            { en: 'A listed warrant', fr: 'Un warrant listé' }
          ],
          correct: 1,
          explanation: {
            en: 'An autocall can redeem before maturity if the underlying meets the trigger level.',
            fr: 'L’autocall peut se rembourser avant maturité si le sous-jacent dépasse un niveau.'
          }
        },
        {
          question: {
            en: 'What is the impact of a lower protection barrier on an autocall’s potential return?',
            fr: 'Quel impact a une barrière de protection plus basse sur le rendement potentiel d’un Autocall ?'
          },
          options: [
            { en: 'It increases the offered return', fr: 'Elle augmente le rendement offert' },
            { en: 'It reduces the offered return', fr: 'Elle réduit le rendement offert' },
            { en: 'No impact', fr: 'Elle n’a aucun impact' },
            { en: 'It removes any capital loss risk', fr: 'Elle supprime le risque de perte en capital' }
          ],
          correct: 1,
          explanation: {
            en: 'Lower barriers mean more protection for investors, so issuers offer lower coupons.',
            fr: 'Plus la barrière de protection est basse, plus la protection du capital est élevée — l’émetteur prend moins de risque, donc le rendement offert (coupon potentiel) est plus faible.'
          }
        },
        {
          question: {
            en: 'Which observation triggers a classic autocall?',
            fr: 'Quelle observation déclenche un autocall classique ?'
          },
          options: [
            { en: 'Underlying below the protection barrier', fr: 'Sous-jacent < barrière' },
            { en: 'Underlying at or above the call level', fr: 'Sous-jacent ≥ niveau de rappel' },
            { en: 'Volatility spikes higher', fr: 'Volatilité augmente' },
            { en: 'Time to maturity below three months', fr: 'Temps restant < 3 mois' }
          ],
          correct: 1,
          explanation: {
            en: 'Redemption is triggered if the underlying reaches the predetermined call level.',
            fr: 'Le remboursement est déclenché si le sous-jacent atteint le niveau de rappel fixé.'
          }
        },
        {
          question: {
            en: 'What is the main risk for an autocall in a bearish market?',
            fr: 'Quel est le principal risque d’un Autocall en marché baissier ?'
          },
          options: [
            { en: 'Capital loss', fr: 'Perte en capital' },
            { en: 'Non-payment of coupons', fr: 'Non paiement des coupons' },
            { en: 'Higher volatility', fr: 'Hausse de volatilité' },
            { en: 'Liquidity risk', fr: 'Risque de liquidité' }
          ],
          correct: 0,
          explanation: {
            en: 'If the protection barrier is breached and the underlying finishes low, capital losses occur.',
            fr: 'Si la barrière de protection est touchée et que le sous-jacent reste bas à maturité, il peut y avoir perte en capital.'
          }
        },
        {
          question: {
            en: 'Which parameter makes autocall coupons more attractive?',
            fr: 'Quel paramètre rend les coupons autocall plus attractifs ?'
          },
          options: [
            { en: 'High implied volatility', fr: 'Volatilité implicite élevée' },
            { en: 'Low interest rates', fr: 'Taux d’intérêt bas' },
            { en: 'Low dividends', fr: 'Dividendes faibles' },
            { en: 'A very stable underlying', fr: 'Sous-jacent très stable' }
          ],
          correct: 0,
          explanation: {
            en: 'Higher implied volatility increases the coupon offered to compensate for stronger barrier risk.',
            fr: 'Une volatilité plus forte augmente la probabilité que le sous-jacent ne franchisse pas les barrières d’autocall, ce qui retarde l’autocall. Pour compenser ce risque, le coupon offert à l’investisseur est plus élevé.'
          }
        }
      ]
    },
    {
      id: 'income',
      name: { en: 'Income Strategies', fr: 'Stratégies de revenu' },
      // meta optionnelle (si tu veux homogénéiser)
      badge: { en: 'Coupons & Carry', fr: 'Coupons & carry' },
      level: { en: 'Level 2 • Yield tactics', fr: 'Niveau 2 • Tactiques de rendement' },
      description: {
        en: 'Harvest option premia with downside trade-offs; focus on RC, covered calls, and discounts.',
        fr: 'Capte des primes d’option avec compromis de baisse ; focus RC, covered calls et discounts.'
      },
      color: 'rgba(16,185,129,0.4)',
      questions: [
        {
          question: {
            en: 'Which product offers a high fixed coupon in exchange for downside risk?',
            fr: 'Quel produit offre un coupon fixe élevé en échange d’un risque de baisse ?'
          },
          options: [
            { en: 'Bonus Certificate', fr: 'Bonus' },
            { en: 'Reverse Convertible', fr: 'Reverse Convertible' },
            { en: 'Autocall', fr: 'Autocall' },
            { en: 'Discount Certificate', fr: 'Discount' }
          ],
          correct: 1,
          explanation: {
            en: 'The reverse convertible collects a fixed coupon while taking on short put exposure.',
            fr: 'Le Reverse Convertible encaisse un coupon fixe contre un short put implicite.'
          }
        },
        {
          question: {
            en: 'What is the objective of a covered call?',
            fr: 'Quel est l’objectif d’un Covered Call ?'
          },
          options: [
            { en: 'Protect the portfolio', fr: 'Protéger le portefeuille' },
            { en: 'Generate income (a premium)', fr: 'Générer un revenu (une prime)' },
            { en: 'Amplify upside', fr: 'Amplifier la hausse' },
            { en: 'Reduce volatility', fr: 'Réduire la volatilité' }
          ],
          correct: 1,
          explanation: {
            en: 'Selling the call brings in a premium and creates additional income.',
            fr: 'La vente de call permet d’encaisser une prime et de générer du revenu.'
          }
        },
        {
          question: {
            en: 'Which product is the most sensitive to dividend expectations?',
            fr: 'Lequel de ces produits est le plus sensible aux dividendes ?'
          },
          options: [
            { en: 'Reverse Convertible', fr: 'Reverse Convertible' },
            { en: 'Autocall', fr: 'Autocall' },
            { en: 'Bonus Certificate', fr: 'Bonus Certificate' },
            { en: 'Discount Certificate', fr: 'Discount' }
          ],
          correct: 3,
          explanation: {
            en: 'Discount certificates are highly sensitive to expected dividends (reverse convertibles also at pricing).',
            fr: 'Les Discount Certificates sont très sensibles aux dividendes anticipés (RC également qu’au pricing).'
          }
        },
        {
          question: {
            en: 'Which additional risk do you take with a structured income product?',
            fr: 'Quel risque additionnel prend-on sur un produit de revenu structuré ?'
          },
          options: [
            { en: 'Issuer credit risk', fr: 'Risque de crédit émetteur' },
            { en: 'Systematic currency risk', fr: 'Risque de change systématique' },
            { en: 'Interest-rate risk only', fr: 'Risque de taux exclusivement' },
            { en: 'Correlation risk', fr: 'Risque de corrélation' }
          ],
          correct: 0,
          explanation: {
            en: 'Structured notes are debt instruments subject to the issuer’s credit risk.',
            fr: 'Les produits structurés sont des titres de créance soumis au risque de crédit.'
          }
        },
        {
          question: {
            en: 'Which market environment favours income strategies?',
            fr: 'Quel environnement de marché favorise les stratégies de revenu ?'
          },
          options: [
            { en: 'High volatility within a range', fr: 'Volatilité élevée et range' },
            { en: 'Strong bull trend', fr: 'Trend haussier fort' },
            { en: 'Strong bear trend', fr: 'Trend baissier fort' },
            { en: 'Completely flat market', fr: 'Marché totalement plat' }
          ],
          correct: 0,
          explanation: {
            en: 'Elevated option premiums increase the coupons offered.',
            fr: 'Les primes optionnelles élevées augmentent les coupons offerts.'
          }
        }
      ]
    },
    {
      id: 'barriers',
      name: { en: 'Barrier Structures', fr: 'Structures à barrière' },
      badge: { en: 'Path & Barriers', fr: 'Chemins & barrières' },
      level: { en: 'Level 2 • Path risks', fr: 'Niveau 2 • Risques de trajectoire' },
      description: {
        en: 'Work with knock-in/out, continuous monitoring, and deactivation logic (e.g., bonus).',
        fr: 'Travaille les knock-in/out, la surveillance continue et la logique de désactivation (ex. bonus).'
      },
      color: 'rgba(234,179,8,0.4)',
      questions: [
        {
          question: { en: 'What is a knock-in barrier?', fr: 'Qu’est-ce qu’une barrière knock-in ?' },
          options: [
            { en: 'A level that deactivates an option', fr: 'Un niveau qui désactive une option' },
            { en: 'A level that activates an option', fr: 'Un niveau qui active une option' },
            { en: 'A deactivation barrier', fr: 'Une barrière de désactivation' },
            { en: 'A cap level', fr: 'Un niveau de cap' }
          ],
          correct: 1,
          explanation: {
            en: 'A knock-in only activates the option if the barrier is touched.',
            fr: 'La knock-in active une option seulement si la barrière est touchée.'
          }
        },
        {
          question: {
            en: 'Which structure depends on the barrier never being breached?',
            fr: 'Quelle structure dépend de l’absence de franchissement de barrière ?'
          },
          options: [
            { en: 'Bonus certificate', fr: 'Bonus' },
            { en: 'Straddle', fr: 'Straddle' },
            { en: 'Bull spread', fr: 'Bull Spread' },
            { en: 'Covered put', fr: 'Put couvert' }
          ],
          correct: 0,
          explanation: {
            en: 'The bonus certificate requires the deactivation barrier never to be hit.',
            fr: 'Le Bonus requiert que la barrière de désactivation ne soit jamais touchée.'
          }
        },
        {
          question: {
            en: 'What are the implications of a continuously monitored barrier?',
            fr: 'Quelles sont les implications d’une barrière continue ?'
          },
          options: [
            { en: 'Observation only at maturity', fr: 'Observation uniquement finale' },
            { en: 'Observation at any time', fr: 'Observation à tout instant' },
            { en: 'Lower barrier level', fr: 'Barrière plus basse' },
            { en: 'Less risk', fr: 'Moins de risque' }
          ],
          correct: 1,
          explanation: {
            en: 'A continuous barrier is monitored at all times, increasing the chance of activation.',
            fr: 'La barrière continue est surveillée en tout temps, augmentant le risque de déclenchement.'
          }
        },
        {
          question: {
            en: 'Which product typically has a knock-out barrier?',
            fr: 'Quel produit typique comporte une barrière de knock-out ?'
          },
          options: [
            { en: 'Turbo certificate', fr: 'Tracker (Turbo)' },
            { en: 'Straddle', fr: 'Straddle' },
            { en: 'Put spread', fr: 'Put spread' },
            { en: 'Zero-coupon bond', fr: 'Zero coupon' }
          ],
          correct: 0,
          explanation: {
            en: 'Turbos include a knock-out barrier that closes the position.',
            fr: 'Les turbos possèdent une barrière de knock-out qui clôt la position.'
          }
        },
        {
          question: {
            en: 'What happens to time value after a knock-out event?',
            fr: 'Que devient la valeur temps après knock-out ?'
          },
          options: [
            { en: 'It increases', fr: 'Elle augmente' },
            { en: 'It disappears', fr: 'Elle disparaît' },
            { en: 'It stays neutral', fr: 'Elle est neutre' },
            { en: 'It turns negative', fr: 'Elle devient négative' }
          ],
          correct: 1,
          explanation: {
            en: 'Once knocked out, the position is closed and the remaining time value drops to zero.',
            fr: 'Après KO, la position est close, la valeur temps résiduelle s’annule.'
          }
        }
      ]
    },
    {
      id: 'leverage',
      name: { en: 'Leverage', fr: 'Effet de levier' },
      badge: { en: 'Leverage & Tactics', fr: 'Levier & tactiques' },
      level: { en: 'Level 2 • Leverage tools', fr: 'Niveau 2 • Outils de levier' },
      description: {
        en: 'Use warrants, outperformance notes, and spreads to shape convex payoffs efficiently.',
        fr: 'Utilise warrants, outperformance notes et spreads pour façonner des payoffs convexes efficacement.'
      },
      color: 'rgba(59,130,246,0.4)',
      questions: [
        {
          question: {
            en: 'Which structured product replicates a fixed daily leverage on an index performance?',
            fr: 'Quel type de produit structuré permet de répliquer un levier quotidien fixe sur la performance d’un indice ?'
          },
          options: [
            { en: 'Outperformance certificate', fr: 'Outperformance Certificate' },
            { en: 'Autocall', fr: 'Autocall' },
            { en: 'Reverse convertible', fr: 'Reverse Convertible' },
            { en: 'Capped bonus', fr: 'Bonus Cappé' }
          ],
          correct: 0,
          explanation: {
            en: 'Outperformance certificates deliver a fixed daily leverage, such as +3x.',
            fr: 'Les Outperformance Certificates appliquent un levier fixe quotidien sur la performance du sous-jacent, par exemple +3x ou +2x.'
          }
        },
        {
          question: {
            en: 'What is the main risk for an investor holding a call warrant?',
            fr: 'Quel est le principal risque pour un investisseur sur un Call Warrant ?'
          },
          options: [
            { en: 'Underlying decline', fr: 'Baisse du sous-jacent' },
            { en: 'Rise in implied volatility', fr: 'Hausse de la volatilité implicite' },
            { en: 'Higher interest rates', fr: 'Hausse des taux d’intérêt' },
            { en: 'Lower dividends', fr: 'Baisse du dividende' }
          ],
          correct: 0,
          explanation: {
            en: 'If the underlying falls, the warrant quickly loses value as delta drops and time value erodes.',
            fr: 'Le Call Warrant donne le droit d’acheter un sous-jacent à un prix fixé. Si le sous-jacent baisse, le warrant perd rapidement de la valeur car son delta diminue et sa valeur temps s’érode, pouvant devenir nulle à l’échéance.'
          }
        },
        {
          question: {
            en: 'Which parameter reduces the leverage of a deep in-the-money call?',
            fr: 'Quel paramètre réduit le levier d’un call très in-the-money ?'
          },
          options: [
            { en: 'Delta close to 1', fr: 'Delta proche de 1' },
            { en: 'Positive theta', fr: 'Theta positif' },
            { en: 'Negative vega', fr: 'Vega négatif' },
            { en: 'High rho', fr: 'Rho élevé' }
          ],
          correct: 0,
          explanation: {
            en: 'A call that is very ITM behaves like the underlying and therefore loses its leverage effect.',
            fr: 'Un call très ITM a un delta proche de 1 et se comporte comme le sous-jacent, ce qui réduit l’effet de levier.'
          }
        },
        {
          question: {
            en: 'Which structure provides asymmetric leverage?',
            fr: 'Quel montage structurel procure un levier asymétrique ?'
          },
          options: [
            { en: 'Shark fin', fr: 'Shark Fin' },
            { en: 'Covered call', fr: 'Covered Call' },
            { en: 'Straddle', fr: 'Straddle' },
            { en: 'Short strangle', fr: 'Strangle short' }
          ],
          correct: 0,
          explanation: {
            en: 'The bullish or bearish shark fin mixes leverage with a knock-out feature.',
            fr: 'La Bullish/Bearish Shark Fin combine levier à la hausse/baisse et KO. (Sauf Sharkfin Twin Win)'
          }
        },
        {
          question: {
            en: 'How can you reduce the cost of a leverage strategy?',
            fr: 'Comment réduire le coût d’une stratégie levier ?'
          },
          options: [
            { en: 'Sell a further-out option', fr: 'Vendre une option plus éloignée' },
            { en: 'Buy more options', fr: 'Acheter plus d’options' },
            { en: 'Extend the maturity', fr: 'Allonger la maturité' },
            { en: 'Ignore the risk', fr: 'Ignorer le risque' }
          ],
          correct: 0,
          explanation: {
            en: 'Selling a further strike (forming a spread) helps finance part of the premium.',
            fr: 'La vente d’une option plus éloignée (spread) finance partiellement la prime.'
          }
        }
      ]
    },
    {
      id: 'vanilla',
      name: { en: 'Vanilla Options', fr: 'Options vanilles' },
      badge: { en: 'Greeks & Basics', fr: 'Grecs & fondamentaux' },
      level: { en: 'Level 1 • Option basics', fr: 'Niveau 1 • Bases des options' },
      description: {
        en: 'Master core Greeks (delta, gamma, theta, vega) and basic moneyness.',
        fr: 'Maîtrise les grecs (delta, gamma, theta, vega) et la moneyness de base.'
      },
      color: 'rgba(148,163,184,0.4)',
      questions: [
        {
          question: {
            en: 'Which Greek letter measures sensitivity to time decay?',
            fr: 'Quelle lettre grecque mesure la sensibilité au temps ?'
          },
          options: [
            { en: 'Delta', fr: 'Delta' },
            { en: 'Gamma', fr: 'Gamma' },
            { en: 'Theta', fr: 'Theta' },
            { en: 'Vega', fr: 'Vega' }
          ],
          correct: 2,
          explanation: {
            en: 'Theta captures the erosion of time value.',
            fr: 'Theta mesure l’érosion de la valeur temps.'
          }
        },
        {
          question: {
            en: 'A call is in the money when:',
            fr: 'Un call est dans la monnaie si :'
          },
          options: [
            { en: 'Strike > spot', fr: 'Strike > spot' },
            { en: 'Strike = spot', fr: 'Strike = spot' },
            { en: 'Strike < spot', fr: 'Strike < spot' },
            { en: 'Strike = 0', fr: 'Strike = 0' }
          ],
          correct: 2,
          explanation: {
            en: 'A call is ITM when the spot exceeds the strike.',
            fr: 'Un call est ITM lorsque le spot est supérieur au strike.'
          }
        },
        {
          question: {
            en: 'What does Gamma measure?',
            fr: 'Que fait Gamma ?'
          },
          options: [
            { en: 'Sensitivity to spot', fr: 'Sensibilité au spot' },
            { en: 'Sensitivity of delta', fr: 'Sensibilité du delta' },
            { en: 'Sensitivity to volatility', fr: 'Sensibilité à la volatilité' },
            { en: 'Sensitivity to rates', fr: 'Sensibilité aux taux' }
          ],
          correct: 1,
          explanation: {
            en: 'Gamma measures how much delta changes for a move in the underlying.',
            fr: 'Gamma mesure la variation du delta pour un mouvement du sous-jacent.'
          }
        },
        {
          question: {
            en: 'Which position benefits from a rise in volatility?',
            fr: 'Quelle position profite d’une hausse de volatilité ?'
          },
          options: [
            { en: 'Long straddle', fr: 'Long straddle' },
            { en: 'Short straddle', fr: 'Short straddle' },
            { en: 'Covered call', fr: 'Covered call' },
            { en: 'Covered put', fr: 'Put couvert' }
          ],
          correct: 0,
          explanation: {
            en: 'Being long options (for example a straddle) means being long vega.',
            fr: 'Être long options (straddle) revient à être long vega.'
          }
        },
        {
          question: {
            en: 'Which parameter affects Vega?',
            fr: 'Quel paramètre influence Vega ?'
          },
          options: [
            { en: 'Interest rates', fr: 'Taux' },
            { en: 'Time to maturity', fr: 'Temps avant échéance' },
            { en: 'Dividends', fr: 'Dividendes' },
            { en: 'Rho', fr: 'Rho' }
          ],
          correct: 1,
          explanation: {
            en: 'Longer maturities increase Vega.',
            fr: 'Des maturités plus longues augmentent Vega.'
          }
        }
      ]
    },
    {
      id: 'volatility',
      name: { en: 'Volatility Management', fr: 'Gestion de volatilité' },
      badge: { en: 'Vol Premia', fr: 'Primes de volatilité' },
      level: { en: 'Level 3 • Vol tactics', fr: 'Niveau 3 • Tactiques de vol' },
      description: {
        en: 'Trade term-structure and convexity: calendars, straddles, and variance swaps.',
        fr: 'Joue la term-structure et la convexité : calendars, straddles et variance swaps.'
      },
      color: 'rgba(249,115,22,0.4)',
      questions: [
        {
          question: {
            en: 'Which product captures a normalisation of volatility?',
            fr: 'Quel produit capture une normalisation de volatilité ?'
          },
          options: [
            { en: 'Long calendar spread', fr: 'Calendar spread long' },
            { en: 'Long straddle', fr: 'Straddle long' },
            { en: 'Long risk reversal', fr: 'Risk reversal long' },
            { en: 'Long butterfly', fr: 'Butterfly long' }
          ],
          correct: 0,
          explanation: {
            en: 'A long calendar (short near-term vol / long longer-term vol) plays the flattening of the vol curve.',
            fr: 'Un long calendar (short vol court terme / long vol long terme) joue l’aplatissement de la courbe de vol.'
          }
        },
        {
          question: {
            en: 'What is the key risk of a short straddle?',
            fr: 'Quel risque porte un short straddle ?'
          },
          options: [
            { en: 'Limited risk', fr: 'Risque limité' },
            { en: 'Unlimited risk', fr: 'Risque illimité' },
            { en: 'No risk', fr: 'Pas de risque' },
            { en: 'Interest-rate risk only', fr: 'Risque de taux uniquement' }
          ],
          correct: 1,
          explanation: {
            en: 'Selling a straddle exposes you to theoretically unlimited losses.',
            fr: 'La vente d’un straddle expose à des pertes théoriquement illimitées.'
          }
        },
        {
          question: {
            en: 'Which instrument tracks realised volatility?',
            fr: 'Quel instrument suit la volatilité réalisée ?'
          },
          options: [
            { en: 'Variance swap', fr: 'Variance swap' },
            { en: 'Forward', fr: 'Forward' },
            { en: 'Future', fr: 'Future' },
            { en: 'Interest rate swap', fr: 'Swap de taux' }
          ],
          correct: 0,
          explanation: {
            en: 'A variance swap pays the difference between realised variance and the strike.',
            fr: 'Un variance swap paie la différence entre variance réalisée et strike.'
          }
        },
        {
          question: {
            en: 'How do you hedge the vega of a long straddle?',
            fr: 'Comment couvrir Vega d’un straddle long ?'
          },
          options: [
            { en: 'Buy more options', fr: 'Acheter plus d’options' },
            { en: 'Extend the maturity', fr: 'Rallonger la maturité' },
            { en: 'Short the underlying', fr: 'Shorter le sous-jacent' },
            { en: 'Short vega by selling options', fr: 'Short vega via vente d’options' }
          ],
          correct: 3,
          explanation: {
            en: 'Vega hedging typically requires selling options (short vega).',
            fr: 'La couverture de Vega requiert souvent la vente d’options (short vega).'
          }
        },
        {
          question: {
            en: 'Which environment hurts a long straddle?',
            fr: 'Quel environnement nuit à un long straddle ?'
          },
          options: [
            { en: 'Volatility increases', fr: 'Volatilité monte' },
            { en: 'Large move in the spot', fr: 'Gros mouvement sur le spot' },
            { en: 'Volatility drops after purchase', fr: 'Volatilité chute après achat' },
            { en: 'Higher rates', fr: 'Hausse des taux' }
          ],
          correct: 2,
          explanation: {
            en: 'A drop in volatility or a static spot erodes the premium paid.',
            fr: 'Une baisse de volatilité ou un spot immobile érode la prime payée.'
          }
        }
      ]
    },
    {
      id: 'protection',
      name: { en: 'Hedging & Protection', fr: 'Couverture & hedging' },
      badge: { en: 'Risk Shields', fr: 'Boucliers de risque' },
      level: { en: 'Level 2 • Hedging basics', fr: 'Niveau 2 • Bases du hedging' },
      description: {
        en: 'Build practical hedges: collars, FX forwards, and delta/gamma/vega diagnostics.',
        fr: 'Construis des couvertures pratiques : collars, forwards de change et diagnostics delta/gamma/vega.'
      },
      color: 'rgba(168,85,247,0.4)',
      questions: [
        {
          question: {
            en: 'Which setup protects a portfolio while capping upside?',
            fr: 'Quel montage protège un portefeuille tout en vendant la hausse ?'
          },
          options: [
            { en: 'Collar', fr: 'Collar' },
            { en: 'Straddle', fr: 'Straddle' },
            { en: 'Strangle', fr: 'Strangle' },
            { en: 'Spread', fr: 'Spread' }
          ],
          correct: 0,
          explanation: {
            en: 'A collar combines a protective put with a covered call.',
            fr: 'Un collar combine l’achat d’un put protecteur et la vente d’un call couvert.'
          }
        },
        {
          question: {
            en: 'A client holds European equities and fears a drop in the euro. What could you propose?',
            fr: 'Un client détient des actions européennes et craint une baisse de l’euro. Que proposer ?'
          },
          options: [
            { en: 'Buy EUR/USD calls', fr: 'Achat de call EUR/USD' },
            { en: 'Sell EUR/USD futures', fr: 'Vente de futures EUR/USD' },
            { en: 'Buy EUR/USD puts', fr: 'Achat de put EUR/USD' },
            { en: 'Buy a USD/EUR forward', fr: 'Achat de forward USD/EUR' }
          ],
          correct: 3,
          explanation: {
            en: 'Buying a USD/EUR forward locks the future conversion rate and hedges the FX risk.',
            fr: 'Un forward USD/EUR verrouille le taux de conversion futur et couvre le risque de change.'
          }
        },
        {
          question: {
            en: 'Which instrument hedges currency risk?',
            fr: 'Quel instrument couvre le risque de change ?'
          },
          options: [
            { en: 'FX forward', fr: 'Forward FX' },
            { en: 'Interest rate swap', fr: 'Swap de taux' },
            { en: 'Equity option', fr: 'Option equity' },
            { en: 'Commodity futures', fr: 'Futures commodities' }
          ],
          correct: 0,
          explanation: {
            en: 'An FX forward neutralises future foreign exchange exposure.',
            fr: 'Le forward de change neutralise l’exposition future au FX.'
          }
        },
        {
          question: {
            en: 'How can you reduce the premium of a protective put?',
            fr: 'Comment réduire la prime d’une put protectrice ?'
          },
          options: [
            { en: 'Sell a call', fr: 'Vendre un call' },
            { en: 'Buy a higher-priced option', fr: 'Acheter plus cher' },
            { en: 'Shorten the maturity', fr: 'Raccourcir la maturité' },
            { en: 'Ignore the risk', fr: 'Ignorer le risque' }
          ],
          correct: 0,
          explanation: {
            en: 'Selling a call creates a collar and lowers the net premium.',
            fr: 'La vente d’un call crée un collar et réduit la prime nette.'
          }
        },
        {
          question: {
            en: 'If a delta-neutral portfolio still loses money, what could be the cause?',
            fr: 'Lorsqu’un portefeuille delta-neutre perd quand même de l’argent, que suspecter ?'
          },
          options: [
            { en: 'Incorrect risk-free rate', fr: 'Mauvais taux sans risque' },
            { en: 'Unhedged gamma or vega exposure', fr: 'Gamma ou Vega non couverts' },
            { en: 'Error in the risk premium', fr: 'Erreur de prime de risque' },
            { en: 'Currency mismatch', fr: 'Problème de change' }
          ],
          correct: 1,
          explanation: {
            en: 'Delta hedging does not protect against gamma (convexity) or vega (volatility) risks.',
            fr: 'La couverture delta ne protège pas des risques de gamma (convexité) ni de vega (volatilité).'
          }
        }
      ]
    },
    {
      id: 'income-options',
      name: { en: 'Yield Enhancement', fr: 'Optimisation de rendement' },
      badge: { en: 'Covered & Discount', fr: 'Couverts & discount' },
      level: { en: 'Level 2 • Yield tactics', fr: 'Niveau 2 • Tactiques de rendement' },
      description: {
        en: 'Earn premia with covered calls, reverse convertibles, and discount certificates.',
        fr: 'Encaisse des primes via covered calls, reverse convertibles et discounts.'
      },
      color: 'rgba(5,150,105,0.4)',
      questions: [
        {
          question: {
            en: 'Which option structure collects a premium in exchange for a cap?',
            fr: 'Quel montage optionnel encaisse une prime en échange d’un cap ?'
          },
          options: [
            { en: 'Covered call', fr: 'Covered Call' },
            { en: 'Protective put', fr: 'Protective Put' },
            { en: 'Long straddle', fr: 'Long Straddle' },
            { en: 'Long calendar', fr: 'Calendar long' }
          ],
          correct: 0,
          explanation: {
            en: 'Selling a covered call generates income but caps the upside.',
            fr: 'La vente d’un call couvert génère un revenu mais plafonne la hausse.'
          }
        },
        {
          question: {
            en: 'What is the payoff of a reverse convertible if the barrier holds?',
            fr: 'Quel est le payoff d’un Reverse Convertible si la barrière est respectée ?'
          },
          options: [
            { en: 'Total loss', fr: 'Perte totale' },
            { en: 'Coupon plus nominal', fr: 'Coupon + nominal' },
            { en: 'Delivery of the underlying', fr: 'Livraison du sous-jacent' },
            { en: 'Zero', fr: 'Zéro' }
          ],
          correct: 1,
          explanation: {
            en: 'The coupon is guaranteed and the nominal is repaid if the barrier remains untouched.',
            fr: 'Le coupon est garanti et le nominal remboursé si la barrière n’est pas touchée.'
          }
        },
        {
          question: {
            en: 'Which listed position replicates a discount certificate?',
            fr: 'Quel produit listé reproduit un Discount Certificate ?'
          },
          options: [
            { en: 'Long call + short put', fr: 'Long call + short put' },
            { en: 'Long put only', fr: 'Long put seule' },
            { en: 'Short call + long stock', fr: 'Short call + long action' },
            { en: 'Futures', fr: 'Futures' }
          ],
          correct: 0,
          explanation: {
            en: 'A discount certificate equals a covered call; likewise a zero-coupon plus short put.',
            fr: 'Un discount équivaut à un covered call ; un zéro-coupon + short put aussi.'
          }
        },
        {
          question: {
            en: 'Why do reverse convertible coupons increase with implied volatility?',
            fr: 'Pourquoi les coupons d’un Reverse Convertible augmentent-ils avec la volatilité implicite ?'
          },
          options: [
            { en: 'Because the issuer sells more puts', fr: 'Parce que l’émetteur vend plus de puts' },
            { en: 'Because the sold option premium is higher when volatility rises', fr: 'Parce que la prime de l’option vendue augmente avec la volatilité' },
            { en: 'Because correlation drops', fr: 'Parce que la corrélation baisse' },
            { en: 'Because rates rise', fr: 'Parce que les taux montent' }
          ],
          correct: 1,
          explanation: {
            en: 'Higher implied volatility increases the value of short puts in the structure, boosting coupons.',
            fr: 'Une volatilité implicite plus élevée renchérit la valeur des puts vendus, ce qui augmente le coupon.'
          }
        },
        {
          question: {
            en: 'Which variable makes selling options more attractive?',
            fr: 'Quelle variable rend une vente d’options plus attractive ?'
          },
          options: [
            { en: 'High implied volatility', fr: 'Volatilité implicite élevée' },
            { en: 'Short time to expiry', fr: 'Temps court' },
            { en: 'Low rates', fr: 'Taux bas' },
            { en: 'High dividends', fr: 'Dividendes élevés' }
          ],
          correct: 0,
          explanation: {
            en: 'Higher implied volatility increases the premium received when selling options.',
            fr: 'Une volatilité implicite élevée augmente la prime reçue lors d’une vente d’options.'
          }
        }
      ]
    },
    {
      id: 'hybrids',
      name: { en: 'Exotic & Hybrid', fr: 'Exotiques & hybrides' },
      badge: { en: 'Path & Correlation', fr: 'Chemins & corrélations' },
      level: { en: 'Level 3 • Hybrid payoffs', fr: 'Niveau 3 • Payoffs hybrides' },
      description: {
        en: 'Combine assets and paths: baskets, cliquets, Asians, and variance-linked notes.',
        fr: 'Combine actifs et trajectoires : baskets, cliquets, asiatiques et produits indexés à la variance.'
      },
      color: 'rgba(99,102,241,0.4)',
      questions: [
        {
          question: {
            en: 'Which product combines several underlyings through correlation?',
            fr: 'Quel produit combine plusieurs sous-jacents via corrélation ?'
          },
          options: [
            { en: 'Basket autocall', fr: 'Basket autocall' },
            { en: 'Vanilla call', fr: 'Vanilla call' },
            { en: 'Put spread', fr: 'Put spread' },
            { en: 'Forward', fr: 'Forward' }
          ],
          correct: 0,
          explanation: {
            en: 'Basket autocalls rely on the correlation between underlyings.',
            fr: 'Les autocalls baskets s’appuient sur la corrélation entre sous-jacents.'
          }
        },
        {
          question: {
            en: 'Which payoff depends on a specific path?',
            fr: 'Quel payoff dépend d’un chemin spécifique ?'
          },
          options: [
            { en: 'Vanilla option', fr: 'Vanilla' },
            { en: 'Forward', fr: 'Forward' },
            { en: 'Asian option', fr: 'Asian option' },
            { en: 'Swap', fr: 'Swap' }
          ],
          correct: 2,
          explanation: {
            en: 'Asian options are path-dependent because they average the underlying.',
            fr: 'Les options asiatiques sont path-dependent car elles moyennent le sous-jacent.'
          }
        },
        {
          question: {
            en: 'Which feature distinguishes cliquet notes?',
            fr: 'Quelle caractéristique distingue les cliquets ?'
          },
          options: [
            { en: 'Single strike', fr: 'Strike unique' },
            { en: 'Coupons fixed step by step', fr: 'Fixation de coupons par paliers' },
            { en: 'No barrier', fr: 'Pas de barrière' },
            { en: 'Linearity', fr: 'Linearité' }
          ],
          correct: 1,
          explanation: {
            en: 'Cliquet structures record successive performances or coupons.',
            fr: 'Les cliquets enregistrent des performances/coupons successifs.'
          }
        },
        {
          question: {
            en: 'What is the main risk of a commodity/equity hybrid product?',
            fr: 'Quel est le principal risque d’un produit hybride commodity/action ?'
          },
          options: [
            { en: 'Uncertain correlation', fr: 'Corrélation incertaine' },
            { en: 'Lack of volatility', fr: 'Absence de volatilité' },
            { en: 'Negative rates', fr: 'Taux négatifs' },
            { en: 'Dividends', fr: 'Dividendes' }
          ],
          correct: 0,
          explanation: {
            en: 'The correlation between assets can deteriorate and hurt the payoff.',
            fr: 'La corrélation entre actifs peut se dégrader et pénaliser le payoff.'
          }
        },
        {
          question: {
            en: 'Which product uses realised variance as the underlying?',
            fr: 'Quel produit utilise la variance réalisée comme sous-jacent ?'
          },
          options: [
            { en: 'Variance swap', fr: 'Variance swap' },
            { en: 'Autocall', fr: 'Autocall' },
            { en: 'Zero-coupon bond', fr: 'Zero coupon' },
            { en: 'FX forward', fr: 'Forward FX' }
          ],
          correct: 0,
          explanation: {
            en: 'A variance swap has realised variance as its underlying.',
            fr: 'La variance réalisée est le sous-jacent d’un variance swap.'
          }
        }
      ]
    },
    {
      id: 'income-boost',
      name: { en: 'Coupon Boosters', fr: 'Boosters de coupons' },
      badge: { en: 'Autocalls & Income', fr: 'Autocalls & revenu' },
      level: { en: 'Level 2 • Yield tactics', fr: 'Niveau 2 • Tactiques de rendement' },
      description: {
        en: 'Trigger coupons, monitor barriers, balance step-down memory triggers.',
        fr: 'Déclenche des coupons, surveille les barrières, gère les triggers step-down et la mémoire.'
      },
      color: 'rgba(124,58,237,0.45)',
      questions: [
        {
          question: {
            en: 'An autocall typically redeems early when…',
            fr: 'Un autocall se rembourse généralement anticipativement lorsque…'
          },
          options: [
            { en: 'Volatility spikes above a level', fr: 'La volatilité dépasse un seuil' },
            { en: 'The underlying trades at or above the trigger on a fixing date', fr: 'Le sous-jacent dépasse le trigger à une date de constat' },
            { en: 'A coupon barrier is breached on the downside', fr: 'La barrière coupon est franchie à la baisse' },
            { en: 'Interest rates fall below zero', fr: 'Les taux passent sous zéro' }
          ],
          correct: 1,
          explanation: {
            en: 'Autocalls monitor observation dates and redeem when the trigger is met or exceeded.',
            fr: 'L’autocall observe des dates et rembourse si le trigger est atteint ou dépassé.'
          }
        },
        {
          question: {
            en: 'The payoff of a reverse convertible at maturity is equivalent to being short…',
            fr: 'Le payoff d’un reverse convertible à maturité revient à être short…'
          },
          options: [
            { en: 'A call spread', fr: 'Un call spread' },
            { en: 'A put', fr: 'Un put' },
            { en: 'A digital call', fr: 'Un call digital' },
            { en: 'A forward', fr: 'Un forward' }
          ],
          correct: 1,
          explanation: {
            en: 'Collecting the coupon mirrors selling a put on the underlying.',
            fr: 'Encaisser le coupon équivaut à vendre un put sur le sous-jacent.'
          }
        },
        {
          question: {
            en: 'A best-of call on two indices becomes more valuable when…',
            fr: 'Un best-of call sur deux indices gagne en valeur lorsque…'
          },
          options: [
            { en: 'Correlation drops, because dispersion rises', fr: 'La corrélation baisse, la dispersion augmente' },
            { en: 'Correlation spikes higher, aligning both assets', fr: 'La corrélation s’envole, les actifs se déplacent ensemble' },
            { en: 'Dividends fall sharply', fr: 'Les dividendes chutent fortement' },
            { en: 'Rates surge', fr: 'Les taux montent fortement' }
          ],
          correct: 0,
          explanation: {
            en: 'Best-of payoffs benefit from low correlation: more dispersion boosts the odds one index outperforms.',
            fr: 'Le best-of profite d’une corrélation faible : plus de dispersion augmente la probabilité qu’un indice surclasse les autres.'
          }
        },
        {
          question: {
            en: 'Which market regime favours selling downside risk for yield?',
            fr: 'Quel régime de marché favorise la vente de risque de baisse pour générer du rendement ?'
          },
          options: [
            { en: 'Range-bound', fr: 'Marché en range' },
            { en: 'Steep bull market', fr: 'Marché haussier fort' },
            { en: 'Crash in progress', fr: 'Krach en cours' },
            { en: 'Ultra-low volatility grind', fr: 'Volatilité ultra faible' }
          ],
          correct: 0,
          explanation: {
            en: 'Rich option premiums in a range deliver attractive coupons if barriers hold.',
            fr: 'Des primes élevées en range offrent de bons coupons tant que les barrières tiennent.'
          }
        },
        {
          question: {
            en: 'How do higher dividends impact the embedded option structure of an autocall?',
            fr: 'Quel est l’impact d’une hausse des dividendes sur la structure optionnelle intégrée d’un autocall ?'
          },
          options: [
            { 
              en: 'They cheapen the short put, improving the issuer’s margin', 
              fr: 'Ils rendent le put vendu moins cher, améliorant la marge de l’émetteur' 
            },
            { 
              en: 'They lower the forward, making the short put more expensive and reducing pricing efficiency', 
              fr: 'Ils font baisser le forward, rendant le put vendu plus cher et réduisant l’efficacité du pricing' 
            },
            { 
              en: 'They increase the probability of early redemption', 
              fr: 'Ils augmentent la probabilité de remboursement anticipé' 
            },
            { 
              en: 'They have no impact on the embedded option because coupons offset dividends', 
              fr: 'Ils n’ont aucun impact car les coupons compensent les dividendes' 
            }
          ],
          correct: 1,
          explanation: {
            en: 'Higher dividends reduce the forward price of the underlying, which increases the value of the short put embedded in the autocall. This makes the structure more expensive to issue, compressing potential coupons.',
            fr: 'Des dividendes plus élevés font baisser le prix forward du sous-jacent, ce qui augmente la valeur du put vendu dans la structure. Cela renchérit le coût de l’autocall pour l’émetteur et réduit les coupons potentiels offerts au client.'
          }
        }        
      ]
    },
  ];

  function cacheDom() {
    dom.navHome = doc.getElementById('nav-home');
    dom.navStructured = doc.getElementById('nav-structured');
    dom.navOptions = doc.getElementById('nav-options');
    dom.navCompare = doc.getElementById('nav-compare');
    dom.navQuiz = doc.getElementById('nav-quiz');
    dom.headerTitle = doc.getElementById('header-title');
    dom.headerTagline = doc.getElementById('header-tagline');
    dom.heroTitle = doc.getElementById('hero-title');
    dom.heroDescription = doc.getElementById('hero-description');
    dom.heroCtaLabel = doc.getElementById('hero-cta-label');
    dom.langText = doc.getElementById('lang-text');
    dom.tracksTitle = doc.getElementById('tracks-title');
    dom.tracksSubtitle = doc.getElementById('tracks-subtitle');
    dom.trackGrid = doc.getElementById('quiz-track-grid');
    dom.quizSection = doc.getElementById('quiz-section');
    dom.tracksSection = doc.getElementById('tracks-section');
    dom.summarySection = doc.getElementById('summary-section');
    dom.quizTopicTitle = doc.getElementById('quiz-topic-title');
    dom.quizTopicBadge = doc.getElementById('quiz-topic-badge');
    dom.quizProgress = doc.getElementById('quiz-progress-count');
    dom.quizScore = doc.getElementById('quiz-score');
    dom.quizStreak = doc.getElementById('quiz-streak');
    dom.quizQuestion = doc.getElementById('quiz-question-text');
    dom.quizOptions = doc.getElementById('quiz-options-container');
    dom.quizFeedback = doc.getElementById('quiz-feedback');
    dom.quizPrimary = doc.getElementById('quiz-primary');
    dom.quizSecondary = doc.getElementById('quiz-secondary');
    dom.quizExit = doc.getElementById('quiz-exit');
    dom.summaryTitle = doc.getElementById('summary-title');
    dom.summaryScore = doc.getElementById('summary-score');
    dom.summaryBadge = doc.getElementById('summary-badge');
    dom.summaryRetry = doc.getElementById('summary-retry');
    dom.summaryHome = doc.getElementById('summary-home');
    dom.footerDisclaimer = doc.getElementById('footer-disclaimer');
    dom.footerCopyright = doc.getElementById('footer-copyright');
  }

  function renderTracks() {
    if (!dom.trackGrid) return;
    dom.trackGrid.innerHTML = '';

    tracks.forEach((track) => {
      const card = doc.createElement('article');
      card.className = 'quiz-track-card';
      card.style.setProperty('--track-accent', track.color);
      card.dataset.trackId = track.id;

      const questionsCount = track.questions.length;

      card.innerHTML = `
        <div class="track-header">
          <span class="meta-chip">${track.badge[currentLanguage]}</span>
          <span class="track-level">${track.level[currentLanguage]}</span>
        </div>
        <h3>${track.name[currentLanguage]}</h3>
        <p>${track.description[currentLanguage]}</p>
        <div class="track-footer">
          <span class="track-count">${questionsCount} ${ui[currentLanguage].cardQuestions}</span>
          <button class="primary-button track-start">${ui[currentLanguage].startTrack}</button>
        </div>
      `;

      const button = card.querySelector('.track-start');
      button.addEventListener('click', () => startTrack(track.id));
      dom.trackGrid.appendChild(card);
    });
  }

  function startTrack(trackId) {
    const track = tracks.find((item) => item.id === trackId);
    if (!track) return;

    currentTrack = track;
    questionIndex = 0;
    answered = 0;
    correct = 0;
    streak = 0;
    bestStreak = 0;
    awaitingValidation = true;

    dom.tracksSection.classList.add('hidden');
    dom.summarySection.classList.add('hidden');
    dom.quizSection.classList.remove('hidden');

    updateTrackHeader();
    updateButtons();
    renderQuestion();
    updateScoreboard();
    updateStreak();
  }

  function updateTrackHeader() {
    if (!currentTrack) return;
    dom.quizTopicTitle.textContent = currentTrack.name[currentLanguage];
    dom.quizTopicBadge.textContent = currentTrack.badge[currentLanguage];
    dom.quizTopicBadge.style.backgroundColor = currentTrack.color;
  }

  function renderQuestion() {
    if (!currentTrack) return;
    const t = ui[currentLanguage];
    const total = currentTrack.questions.length;
    const question = currentTrack.questions[questionIndex];

    dom.quizQuestion.textContent = question.question[currentLanguage];
    dom.quizOptions.innerHTML = '';

    question.options.forEach((option, index) => {
      const optionId = `quiz-option-${index}`;
      const wrapper = doc.createElement('label');
      wrapper.className = 'quiz-option';
      wrapper.innerHTML = `
        <input type="radio" name="quiz-option" value="${index}" id="${optionId}">
        <span>${option[currentLanguage]}</span>
      `;
      dom.quizOptions.appendChild(wrapper);
    });

    dom.quizProgress.textContent = `${t.progressLabel} ${questionIndex + 1} / ${total}`;
    dom.quizFeedback.classList.add('hidden');
    dom.quizFeedback.textContent = '';
    dom.quizFeedback.classList.remove('success', 'error');

    awaitingValidation = true;
    dom.quizPrimary.textContent = questionIndex === total - 1 ? t.finish : t.validate;
    dom.quizSecondary.textContent = t.skip;
    dom.quizSecondary.disabled = false;
  }

  function updateScoreboard() {
    if (!dom.quizScore) return;
    const t = ui[currentLanguage];
    const percent = answered === 0 ? 0 : Math.round((correct / answered) * 100);
    dom.quizScore.textContent = `${t.scoreLabel}: ${correct} / ${answered} (${percent}%)`;
  }

  function updateStreak() {
    if (!dom.quizStreak) return;
    const t = ui[currentLanguage];
    const suffix = bestStreak > 1 ? ` (${t.bestLabel} ${bestStreak})` : '';
    dom.quizStreak.textContent = `${t.streakLabel}: ${streak}${suffix}`;
  }

  function handlePrimaryClick() {
    if (!currentTrack) return;

    if (awaitingValidation) {
      const selected = dom.quizOptions.querySelector('input[name="quiz-option"]:checked');
      if (!selected) {
        showFeedback(ui[currentLanguage].selectPrompt, false, false);
        return;
      }

      const choice = Number.parseInt(selected.value, 10);
      validateAnswer(choice);
    } else {
      goToNextStep();
    }
  }

  function validateAnswer(choice) {
    const question = currentTrack.questions[questionIndex];
    const t = ui[currentLanguage];
    const options = Array.from(dom.quizOptions.querySelectorAll('.quiz-option'));

    answered += 1;

    options.forEach((optionEl, index) => {
      if (index === question.correct) {
        optionEl.classList.add('correct');
      }
      if (index === choice && index !== question.correct) {
        optionEl.classList.add('incorrect');
      }
      optionEl.classList.add('resolved');
      const input = optionEl.querySelector('input');
      if (input) input.disabled = true;
    });

    dom.quizSecondary.disabled = true;

    if (choice === question.correct) {
      correct += 1;
      streak += 1;
      if (streak > bestStreak) {
        bestStreak = streak;
      }
      showFeedback(`${t.correctPrefix}${t.explanationLabel} ${question.explanation[currentLanguage]}`, true, true);
    } else {
      streak = 0;
      showFeedback(
        `${t.incorrectPrefix}${t.correctAnswerLabel} ${question.options[question.correct][currentLanguage]}. ${t.explanationLabel} ${question.explanation[currentLanguage]}`,
        false,
        true
      );
    }

    awaitingValidation = false;
    const total = currentTrack.questions.length;
    dom.quizPrimary.textContent = questionIndex === total - 1 ? t.finish : t.next;
    updateScoreboard();
    updateStreak();
  }

  function goToNextStep() {
    if (!currentTrack) return;
    const total = currentTrack.questions.length;

    if (questionIndex < total - 1) {
      questionIndex += 1;
      renderQuestion();
      return;
    }

    showSummary();
  }

  function handleSkip() {
    if (!currentTrack || !awaitingValidation) return;
    const options = Array.from(dom.quizOptions.querySelectorAll('.quiz-option'));
    options.forEach((optionEl) => {
      optionEl.classList.add('resolved');
      const input = optionEl.querySelector('input');
      if (input) input.disabled = true;
    });
    streak = 0;
    bestStreak = Math.max(bestStreak, streak);
    answered += 1;
    const t = ui[currentLanguage];
    showFeedback(`${t.skipMessage} ${t.streakReset}`, false, true);
    dom.quizSecondary.disabled = true;
    awaitingValidation = false;
    dom.quizPrimary.textContent = t.next;
    updateScoreboard();
    updateStreak();
  }

  function handleExit() {
    currentTrack = null;
    dom.quizSection.classList.add('hidden');
    dom.summarySection.classList.add('hidden');
    dom.tracksSection.classList.remove('hidden');
    window.scrollTo({
      top: dom.tracksSection.offsetTop - 80,
      behavior: 'smooth'
    });
  }

  function showSummary() {
    if (!currentTrack) return;
    dom.quizSection.classList.add('hidden');
    dom.summarySection.classList.remove('hidden');
    refreshSummary();
  }

  function resolveBadge(percent) {
    if (percent >= 90) return ui[currentLanguage].badgeMaster;
    if (percent >= 70) return ui[currentLanguage].badgeAdvanced;
    if (percent >= 50) return ui[currentLanguage].badgeIntermediate;
    return ui[currentLanguage].badgeBeginner;
  }

  function showFeedback(message, isSuccess, persistent) {
    if (!dom.quizFeedback) return;
    dom.quizFeedback.textContent = message;
    dom.quizFeedback.classList.remove('hidden', 'success', 'error');
    dom.quizFeedback.classList.add(isSuccess ? 'success' : 'error');
    if (!persistent) {
      setTimeout(() => {
        dom.quizFeedback.classList.add('hidden');
      }, 2000);
    }
  }

  function updateButtons() {
    const t = ui[currentLanguage];
    if (dom.quizPrimary) dom.quizPrimary.textContent = t.validate;
    if (dom.quizSecondary) dom.quizSecondary.textContent = t.skip;
    if (dom.quizExit) dom.quizExit.textContent = t.exit;
  }

  function refreshActiveQuestionLanguage() {
    if (!currentTrack || !dom.quizOptions) return;
    const t = ui[currentLanguage];
    const total = currentTrack.questions.length;
    const question = currentTrack.questions[questionIndex];

    if (dom.quizQuestion) {
      dom.quizQuestion.textContent = question.question[currentLanguage];
    }

    const optionSpans = dom.quizOptions.querySelectorAll('span');
    optionSpans.forEach((span, index) => {
      const option = question.options[index];
      if (option) {
        span.textContent = option[currentLanguage];
      }
    });

    if (dom.quizProgress) {
      dom.quizProgress.textContent = `${t.progressLabel} ${questionIndex + 1} / ${total}`;
    }

    if (dom.quizPrimary) {
      if (awaitingValidation) {
        dom.quizPrimary.textContent = questionIndex === total - 1 ? t.finish : t.validate;
      } else {
        dom.quizPrimary.textContent = questionIndex === total - 1 ? t.finish : t.next;
      }
    }

    if (dom.quizSecondary) {
      dom.quizSecondary.textContent = t.skip;
      dom.quizSecondary.disabled = !awaitingValidation;
    }

    if (dom.quizExit) {
      dom.quizExit.textContent = t.exit;
    }

    updateScoreboard();
    updateStreak();
  }

  function updateStaticText() {
    const t = ui[currentLanguage];
    doc.documentElement.lang = currentLanguage;

    if (dom.navHome) dom.navHome.textContent = t.navHome;
    if (dom.navStructured) dom.navStructured.textContent = t.navStructured;
    if (dom.navOptions) dom.navOptions.textContent = t.navOptions;
    if (dom.navCompare) dom.navCompare.textContent = t.navCompare;
    if (dom.navQuiz) dom.navQuiz.textContent = t.navQuiz;
    if (dom.headerTitle) dom.headerTitle.textContent = t.headerTitle;
    if (dom.headerTagline) dom.headerTagline.textContent = t.headerTagline;
    if (dom.heroTitle) dom.heroTitle.textContent = t.heroTitle;
    if (dom.heroDescription) dom.heroDescription.textContent = t.heroDescription;
    if (dom.heroCtaLabel) dom.heroCtaLabel.textContent = t.heroCta;
    if (dom.tracksTitle) dom.tracksTitle.textContent = t.tracksTitle;
    if (dom.tracksSubtitle) dom.tracksSubtitle.textContent = t.tracksSubtitle;
    if (dom.footerDisclaimer) dom.footerDisclaimer.textContent = t.footerDisclaimer;
    if (dom.footerCopyright) dom.footerCopyright.textContent = t.footerCopyright;

    dom.langText.textContent = currentLanguage === 'en' ? 'FR' : 'EN';

    renderTracks();

    if (currentTrack && dom.quizSection && !dom.quizSection.classList.contains('hidden')) {
      updateTrackHeader();
      refreshActiveQuestionLanguage();
    } else {
      updateButtons();
    }

    refreshSummary();
  }

  function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    updateStaticText();
  }

  function refreshSummary() {
    if (!currentTrack || !dom.summarySection || dom.summarySection.classList.contains('hidden')) return;
    const t = ui[currentLanguage];
    const total = currentTrack.questions.length;
    const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
    const scoreText = t.summaryScore
      .replace('{score}', String(correct))
      .replace('{total}', String(total))
      .replace('{percent}', String(percent));

    dom.summaryTitle.textContent = t.summaryTitle;
    dom.summaryScore.textContent = scoreText;
    dom.summaryBadge.textContent = `${t.summaryBadgePrefix} ${resolveBadge(percent)}`;
    dom.summaryRetry.textContent = t.summaryRetry;
    dom.summaryHome.textContent = t.summaryHome;
  }

  function attachEvents() {
    if (dom.quizPrimary) dom.quizPrimary.addEventListener('click', handlePrimaryClick);
    if (dom.quizSecondary) dom.quizSecondary.addEventListener('click', handleSkip);
    if (dom.quizExit) dom.quizExit.addEventListener('click', handleExit);
    if (dom.summaryRetry) dom.summaryRetry.addEventListener('click', () => {
      if (!currentTrack) return;
      startTrack(currentTrack.id);
    });
    if (dom.summaryHome) dom.summaryHome.addEventListener('click', handleExit);
  }

  function init() {
    cacheDom();
    renderTracks();
    updateButtons();
    updateStaticText();
    attachEvents();
  }

  function scrollToTracks() {
    if (!dom.tracksSection) return;
    dom.tracksSection.scrollIntoView({ behavior: 'smooth' });
  }

  window.scrollToTracks = scrollToTracks;
  window.toggleLanguage = toggleLanguage;

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
