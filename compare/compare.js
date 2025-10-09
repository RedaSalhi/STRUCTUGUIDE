(() => {
  const SPOT_RANGE = Array.from({ length: 141 }, (_, i) => 30 + i); // 30 -> 170
  const STRATEGY_ONE_COLOR = '#2563eb';
  const STRATEGY_TWO_COLOR = '#7c3aed';
  const UNDERLYING_COLOR = '#94a3b8';

  const clamp = (value) => Math.max(-30, Math.min(70, Number.isFinite(value) ? value : 0));

  if (typeof window !== 'undefined' && window.Chart) {
    const annotationPlugin = window['chartjs-plugin-annotation'] || window.chartjsPluginAnnotation;
    if (annotationPlugin) {
      window.Chart.register(annotationPlugin);
    }
  }


const UI_TRANSLATIONS = {
  en: {
    navHome: 'Home',
    navStructured: 'Structured',
    navOptions: 'Options',
    navCompare: 'Comparator',
    pageTitle: 'Strategy Comparator - Structured Products & Options',
    heroTitle: 'Structured & Options Strategy Comparator',
    heroDescription: 'Compare two strategies instantly, overlay payoffs, benchmark key metrics, discover tailored recommendations and test yourself with an interactive quiz.',
    tabComparison: 'Comparison',
    tabRecommendations: 'Recommendations',
    tabQuiz: 'Interactive Quiz',
    strategy1Title: 'Strategy 1',
    strategy2Title: 'Strategy 2',
    strategy1Type: 'Structured',
    strategy2Type: 'Options',
    detailsButton: 'View details',
    metricLabel: 'Metric',
    chartLoading: 'Loading chart...',
    quizValidate: 'Validate',
    quizSkip: 'Skip',
    quizNext: 'Next',
    quizResultsTitle: 'Results',
    quizErrorsTitle: 'Questions to review',
    quizRestart: 'Restart',
    quizReviewErrors: 'Review mistakes',
    quizSkippedLabel: 'Question skipped',
    userAnswerLabel: 'Your answer:',
    correctAnswerLabel: 'Correct answer:',
    footerDisclaimer: 'Information provided for educational purposes. Past performance is not indicative of future results.',
    footerCopyright: '&copy; <span id="current-year"></span> REDA SALHI - All rights reserved.',
    modalTitle: 'Strategy details',
    toggleLabel: 'Change language',
    scoreLabel: 'Score',
    scoreLabelSuffix: ':',
    finalScoreLabel: 'Overall score',
    badgeLabel: 'Badge',
    feedbackSelect: 'Please select an answer before validating.',
    feedbackCorrectPrefix: '✅ Correct! ',
    feedbackIncorrectPrefix: '❌ Incorrect! ',
    feedbackIncorrectAnswer: 'Answer: ',
    quizRestartConfirm: 'Do you really want to reset the quiz? Your progress will be lost.',
    quizNoErrors: 'No mistakes to review, great job!',
    riskLabel: 'Risk',
    underlyingReference: 'Underlying (reference)',
    noDataChip: 'No data',
    noDataType: 'N/A'
  },
  fr: {
    navHome: 'Accueil',
    navStructured: 'Structurés',
    navOptions: 'Options',
    navCompare: 'Comparateur',
    pageTitle: 'Comparateur Stratégies - Produits Structurés & Options',
    heroTitle: 'Comparateur Stratégies Structurées & Options',
    heroDescription: 'Analysez instantanément deux stratégies, visualisez leurs payoffs, comparez leurs métriques clés, découvrez des recommandations adaptées et testez vos connaissances via un quiz interactif.',
    tabComparison: 'Comparaison',
    tabRecommendations: 'Recommandations',
    tabQuiz: 'Quiz interactif',
    strategy1Title: 'Stratégie 1',
    strategy2Title: 'Stratégie 2',
    strategy1Type: 'Structuré',
    strategy2Type: 'Options',
    detailsButton: 'Voir les détails',
    metricLabel: 'Métrique',
    chartLoading: 'Chargement du graphique...',
    quizValidate: 'Valider',
    quizSkip: 'Passer',
    quizNext: 'Suivant',
    quizResultsTitle: 'Résultats',
    quizErrorsTitle: 'Questions à revoir',
    quizRestart: 'Recommencer',
    quizReviewErrors: 'Revoir mes erreurs',
    quizSkippedLabel: 'Question passée',
    userAnswerLabel: 'Votre réponse :',
    correctAnswerLabel: 'Bonne réponse :',
    footerDisclaimer: 'Informations fournies à titre pédagogique. Les performances passées ne préjugent pas des performances futures.',
    footerCopyright: '&copy; <span id="current-year"></span> REDA SALHI - Tous droits réservés.',
    modalTitle: 'Détails de la stratégie',
    toggleLabel: 'Changer de langue',
    scoreLabel: 'Score',
    scoreLabelSuffix: ' :',
    finalScoreLabel: 'Score global',
    badgeLabel: 'Badge',
    feedbackSelect: 'Veuillez sélectionner une réponse avant de valider.',
    feedbackCorrectPrefix: '✅ Correct ! ',
    feedbackIncorrectPrefix: '❌ Incorrect ! ',
    feedbackIncorrectAnswer: 'Réponse : ',
    quizRestartConfirm: 'Voulez-vous vraiment réinitialiser le quiz ? Votre progression sera perdue.',
    quizNoErrors: 'Aucune erreur à revoir, bravo !',
    riskLabel: 'Risque',
    underlyingReference: 'Sous-jacent (référence)',
    noDataChip: 'Aucune donnée',
    noDataType: 'N/D'
  }
};

let currentLanguage = 'en';
let quizState;
const BADGE_LABELS = {
  en: {
    beginner: 'Beginner 🌀',
    intermediate: 'Intermediate 🚀',
    expert: 'Expert 🏆'
  },
  fr: {
    beginner: 'Débutant 🌀',
    intermediate: 'Intermédiaire 🚀',
    expert: 'Expert 🏆'
  }
};

let underlyingReferenceLabel = UI_TRANSLATIONS.en.underlyingReference;

  const strategyUniverse = {
    structured: [
      {
        id: 'capital-protection',
        name: 'Capital Protection Note',
        typeLabel: 'Structuré',
        category: 'Capital Protection',
        meta: ['Capital garanti', 'Participation 80%', 'Défensif'],
        complexity: 2,
        risk: 'Low',
        metrics: {
          'Profil de rendement': 'Participation 80% à la hausse, capital protégé',
          'Protection': '100% du nominal à maturité',
          'Rendement potentiel': 'Limité par la participation',
          'Sensibilité volatilité': 'Faible (dominé par le bond)',
          'Horizon': '3 à 5 ans'
        },
        annotations: [
          { type: 'strike', value: 100, label: 'Strike 100' }
        ],
        description: 'Produit défensif offrant une protection intégrale du capital avec une participation linéaire à la hausse de l’actif sous-jacent.',
        bullets: [
          'Utilise un zéro coupon pour sécuriser le capital initial.',
          'Participation de 80 % à la hausse du sous-jacent au-delà du strike.',
          'Idéal pour les investisseurs prudents cherchant un accès au marché actions.'
        ],
        payoff: (spot) => {
          if (spot <= 100) return 0;
          return clamp((spot - 100) * 0.8);
        }
      },
      {
        id: 'phoenix-memory',
        name: 'Phoenix Autocall Mémoire',
        typeLabel: 'Structuré',
        category: 'Autocalls',
        meta: ['Coupons 10%', 'Barrière 60%', 'Effet mémoire'],
        complexity: 3,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Coupons conditionnels + remboursement anticipé',
          'Protection': 'Barrière capital 60% en observation finale',
          'Rendement potentiel': 'Jusqu’à 10% annuel avec mémoire',
          'Sensibilité volatilité': 'Moyenne (options digitales/barrières)',
          'Horizon': '1 à 5 ans'
        },
        annotations: [
          { type: 'call', value: 100, label: 'Niveau autocall' },
          { type: 'barrier', value: 60, label: 'Barrière de protection 60' }
        ],
        description: 'Produit de rendement offrant des coupons mémorisés si le sous-jacent reste au-dessus de la barrière. Possibilité de remboursement anticipé.',
        bullets: [
          'Coupons de 10 % versés si le niveau est ≥ 70 % aux dates de constatation.',
          'Autocall immédiat si le sous-jacent ≥ 100 % à une date de constatation.',
          'Capital protégé conditionnellement si la barrière 60 % n’est pas franchie en finale.'
        ],
        payoff: (spot) => {
          if (spot >= 110) return clamp(30);
          if (spot >= 100) return clamp(20);
          if (spot >= 70) return clamp(10);
          if (spot >= 60) return 0;
          return clamp((spot - 60) * 0.6 - 10);
        }
      },
      {
        id: 'reverse-convertible',
        name: 'Reverse Convertible',
        typeLabel: 'Structuré',
        category: 'Income',
        meta: ['Coupon 12%', 'Exposition short put', 'Barrière 75%'],
        complexity: 3,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Coupon fixe + exposition short put',
          'Protection': 'Barrière capital 75% en observation finale',
          'Rendement potentiel': 'Coupon garanti 12%',
          'Sensibilité volatilité': 'Elevée (short option)',
          'Horizon': '12 à 18 mois'
        },
        annotations: [
          { type: 'barrier', value: 75, label: 'Barrière 75' }
        ],
        description: 'Produit de rendement générant un coupon fixe élevé en échange d’une exposition à la baisse via une option put vendue.',
        bullets: [
          'Coupon de 12 % versé quels que soient les scénarios.',
          'Remboursement du nominal si le sous-jacent ≥ 75 % en finale.',
          'Sinon livraison physique ou cash-settlement basé sur le niveau final.'
        ],
        payoff: (spot) => {
          if (spot >= 75) return clamp(12);
          return clamp((spot - 100));
        }
      },
      {
        id: 'bonus-cert',
        name: 'Bonus Certificate',
        typeLabel: 'Structuré',
        category: 'Bonus',
        meta: ['Bonus 15%', 'Barrière 70%', 'Cap 130'],
        complexity: 2,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Participation linéaire + bonus si barrière non touchée',
          'Protection': 'Barrière désactivante 70%',
          'Rendement potentiel': 'Bonus 15% plafonné à 130%',
          'Sensibilité volatilité': 'Modérée',
          'Horizon': '18 à 24 mois'
        },
        annotations: [
          { type: 'barrier', value: 70, label: 'Barrière désactivante' },
          { type: 'cap', value: 130, label: 'Cap bonus' }
        ],
        description: 'Certificat offrant un rendement bonus si la barrière n’est pas touchée, sinon il réplique l’action à la baisse.',
        bullets: [
          'Bonus de 15 % si la barrière 70 % n’est jamais franchie.',
          'Participation linéaire à la hausse jusqu’au cap 130 %.',
          'Si la barrière est touchée, retour au profil linéaire classique.'
        ],
        payoff: (spot) => {
          if (spot <= 70) return clamp(spot - 100);
          if (spot >= 130) return clamp(30);
          return clamp(Math.max(spot - 100, 15));
        }
      },
      {
        id: 'shark-fin',
        name: 'Shark Fin',
        typeLabel: 'Structuré',
        category: 'Leverage',
        meta: ['Effet levier 200%', 'Floor 90%', 'KO 140%'],
        complexity: 4,
        risk: 'High',
        metrics: {
          'Profil de rendement': 'Participation amplifiée avec KO possible',
          'Protection': 'Floor 90% si KO',
          'Rendement potentiel': 'Participation 200% tant que KO pas atteint',
          'Sensibilité volatilité': 'Forte (cliquets + barrières)',
          'Horizon': '3 ans'
        },
        annotations: [
          { type: 'floor', value: 90, label: 'Floor 90%' },
          { type: 'barrier', value: 140, label: 'KO 140%' }
        ],
        description: 'Structure à effet de levier avec barrière knockout : floor garanti en cas de KO mais upside limité.',
        bullets: [
          'Participation 200 % entre 100 et 140.',
          'Si KO à 140 %, remboursement floor 90 % + coupon résiduel.',
          'Si pas de KO, payoff linéaire amplifié.'
        ],
        payoff: (spot) => {
          if (spot >= 140) return clamp(-10);
          if (spot <= 90) return clamp(spot - 100);
          return clamp((spot - 100) * 2);
        }
      }
    ],
    options: [
      {
        id: 'bull-call-spread',
        name: 'Bull Call Spread',
        typeLabel: 'Options',
        category: 'Haussier',
        meta: ['Debit spread', 'Strike 95/110', 'Risque limité'],
        complexity: 2,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Haussier modéré, en escalier',
          'Protection': 'Perte limitée à la prime',
          'Rendement potentiel': 'Plafonné par la call vendue',
          'Sensibilité volatilité': 'Faible',
          'Horizon': '3 à 6 mois'
        },
        annotations: [
          { type: 'strike', value: 95, label: 'Strike call achetée' },
          { type: 'strike', value: 110, label: 'Strike call vendue' }
        ],
        description: 'Stratégie haussière à budget maîtrisé combinant achat de call et revente d’un call plus haut.',
        bullets: [
          'Payoff positif si le sous-jacent dépasse 95 %.',
          'Gains plafonnés au-dessus de 110 %.',
          'Perte maximale égale à la prime nette.'
        ],
        payoff: (spot) => {
          if (spot <= 95) return clamp(-8);
          if (spot >= 110) return clamp(7);
          return clamp(spot - 95 - 8);
        }
      },
      {
        id: 'bear-put-spread',
        name: 'Bear Put Spread',
        typeLabel: 'Options',
        category: 'Baissier',
        meta: ['Debit spread', 'Strike 105/90', 'Risque limité'],
        complexity: 2,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Baissier modéré',
          'Protection': 'Perte limitée à la prime',
          'Rendement potentiel': 'Plafonné par la put vendue',
          'Sensibilité volatilité': 'Faible à modérée',
          'Horizon': '3 à 6 mois'
        },
        annotations: [
          { type: 'strike', value: 105, label: 'Strike put achetée' },
          { type: 'strike', value: 90, label: 'Strike put vendue' }
        ],
        description: 'Stratégie visant à profiter d’une baisse modérée par achat de put et revente d’une put plus basse.',
        bullets: [
          'Gain maximum si le spot ≤ 90 % à échéance.',
          'Perte limitée si le sous-jacent reste au-dessus de 105 %.'
        ],
        payoff: (spot) => {
          if (spot >= 105) return clamp(-7);
          if (spot <= 90) return clamp(8);
          return clamp(90 - spot - 7);
        }
      },
      {
        id: 'long-straddle',
        name: 'Long Straddle',
        typeLabel: 'Options',
        category: 'Volatilité',
        meta: ['Volatilité', 'Strike 100', 'Delta neutre'],
        complexity: 3,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Convexe, profite de mouvements importants',
          'Protection': 'Perte limitée à la prime',
          'Rendement potentiel': 'Illimité à la hausse/baisse',
          'Sensibilité volatilité': 'Très élevée',
          'Horizon': '1 à 3 mois'
        },
        annotations: [
          { type: 'strike', value: 100, label: 'Call & put strike' }
        ],
        description: 'Stratégie directionnellement neutre qui mise sur une forte volatilité future via l’achat d’un call et d’un put.',
        bullets: [
          'Perte limitée si le sous-jacent reste proche du strike.',
          'Gains illimités si mouvement important dans un sens ou l’autre.'
        ],
        payoff: (spot) => clamp(Math.abs(spot - 100) - 12)
      },
      {
        id: 'iron-condor',
        name: 'Iron Condor',
        typeLabel: 'Options',
        category: 'Range',
        meta: ['Crédit', 'Stratégie neutre', 'Quatre strikes'],
        complexity: 4,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Neutre, vise faible volatilité',
          'Protection': 'Perte limitée par les options achetées',
          'Rendement potentiel': 'Prime encaissée limitée',
          'Sensibilité volatilité': 'Négative (short vega)',
          'Horizon': '1 à 2 mois'
        },
        annotations: [
          { type: 'range', value: 90, label: 'Borne basse 90' },
          { type: 'range', value: 110, label: 'Borne haute 110' }
        ],
        description: 'Montage neutre vendant un strangle protégé par des options plus éloignées pour capitaliser sur la stagnation.',
        bullets: [
          'Prime encaissée si le spot reste dans le corridor 90-110.',
          'Pertes limitées grâce aux options achetées.'
        ],
        payoff: (spot) => {
          if (spot >= 110 && spot <= 120) return clamp(-8 + (120 - spot));
          if (spot <= 90 && spot >= 80) return clamp(-8 + (spot - 80));
          if (spot > 120) return clamp(-8);
          if (spot < 80) return clamp(-8);
          if (spot >= 95 && spot <= 105) return clamp(4);
          return clamp(-2);
        }
      },
      {
        id: 'protective-put',
        name: 'Protective Put',
        typeLabel: 'Options',
        category: 'Protection',
        meta: ['Hedge', 'Strike 95', 'Cost 5%'],
        complexity: 1,
        risk: 'Low',
        metrics: {
          'Profil de rendement': 'Participation à la hausse + protection',
          'Protection': 'Planche à 95 %',
          'Rendement potentiel': 'Illimité, net de la prime',
          'Sensibilité volatilité': 'Positive (long vega)',
          'Horizon': '6 à 12 mois'
        },
        annotations: [
          { type: 'floor', value: 95, label: 'Floor 95%' }
        ],
        description: 'Assurance de portefeuille simple combinant l’actif sous-jacent et l’achat d’une option put.',
        bullets: [
          'Limite la perte à environ -5 %.',
          'Contribution à la hausse entière moins la prime payée.'
        ],
        payoff: (spot) => {
          if (spot < 95) return clamp(-5);
          return clamp((spot - 100) - 5);
        }
      },
      {
        id: 'covered-call',
        name: 'Covered Call',
        typeLabel: 'Options',
        category: 'Revenus',
        meta: ['Prime 6%', 'Strike 110', 'Income'],
        complexity: 2,
        risk: 'Low',
        metrics: {
          'Profil de rendement': 'Génération de revenus, cap à la hausse',
          'Protection': 'Prime amortit une partie de la baisse',
          'Rendement potentiel': 'Limité par la call vendue',
          'Sensibilité volatilité': 'Faible',
          'Horizon': '1 à 3 mois renouvelable'
        },
        annotations: [
          { type: 'strike', value: 110, label: 'Strike call vendue' }
        ],
        description: 'Stratégie de portage consistant à vendre une option call contre un portefeuille actions afin de générer du revenu.',
        bullets: [
          'Encaissement immédiat d’une prime de 6 %.',
          'Upside limité au strike 110 % + prime.'
        ],
        payoff: (spot) => {
          if (spot >= 110) return clamp(16);
          return clamp(spot - 100 + 6);
        }
      }
    ]
  };

  const metricsOrder = [
    'Profil de rendement',
    'Protection',
    'Rendement potentiel',
    'Sensibilité volatilité',
    'Horizon',
    'Complexité'
  ];

  const recommendationsData = [
    {
      id: 'bullish',
      title: { en: 'Bullish view', fr: 'Vue BULLISH' },
      color: 'linear-gradient(135deg, rgba(34,197,94,0.35), rgba(74,222,128,0.25))',
      level: 'medium',
      risk: { en: 'Medium', fr: 'Moyen' },
      strategies: [
        {
          name: 'Bull Call Spread',
          reason: {
            en: 'Limit the cost while benefiting from a moderate upside.',
            fr: 'Limiter le coût tout en profitant d’une hausse modérée.'
          }
        },
        {
          name: 'Autocall Phoenix',
          reason: {
            en: 'Conditional coupons with early redemption when the market rebounds.',
            fr: 'Coupons conditionnels avec remboursement anticipé si le marché rebondit.'
          }
        },
        {
          name: 'Turbo Long',
          reason: {
            en: 'Direct leverage with a predefined stop.',
            fr: 'Effet levier direct avec stop pré-déterminé.'
          }
        }
      ]
    },
    {
      id: 'bearish',
      title: { en: 'Bearish view', fr: 'Vue BEARISH' },
      color: 'linear-gradient(135deg, rgba(248,113,113,0.35), rgba(239,68,68,0.25))',
      level: 'medium-high',
      risk: { en: 'Medium-High', fr: 'Moyen-Élevé' },
      strategies: [
        {
          name: 'Bear Put Spread',
          reason: {
            en: 'Capture a controlled downside with limited risk.',
            fr: 'Capturer une baisse contrôlée avec risque borné.'
          }
        },
        {
          name: 'Reverse Convertible',
          reason: {
            en: 'Collect a high coupon as long as the decline remains contained.',
            fr: 'Encaisser un coupon élevé si la baisse reste limitée.'
          }
        },
        {
          name: 'Turbo Short',
          reason: {
            en: 'Play a rapid market drop with leverage.',
            fr: 'Jouer une baisse rapide avec levier.'
          }
        }
      ]
    },
    {
      id: 'range',
      title: { en: 'Neutral / range view', fr: 'Vue NEUTRE / RANGE' },
      color: 'linear-gradient(135deg, rgba(59,130,246,0.35), rgba(96,165,250,0.25))',
      level: 'medium',
      risk: { en: 'Medium', fr: 'Moyen' },
      strategies: [
        {
          name: 'Iron Condor',
          reason: {
            en: 'Profit from a market trading within a corridor.',
            fr: 'Profiter d’un marché stagnant entre deux bornes.'
          }
        },
        {
          name: 'Discount Certificate',
          reason: {
            en: 'Buy at a discount in exchange for a capped upside.',
            fr: 'Acheter avec décote en échange d’un cap limité.'
          }
        },
        {
          name: 'Range Accrual',
          reason: {
            en: 'Generate coupons while the underlying remains in the target range.',
            fr: 'Générer du coupon tant que le sous-jacent reste dans la zone cible.'
          }
        }
      ]
    },
    {
      id: 'volatility',
      title: { en: 'Volatility anticipation', fr: 'Anticipation VOLATILITÉ' },
      color: 'linear-gradient(135deg, rgba(249,115,22,0.35), rgba(234,88,12,0.25))',
      level: 'high',
      risk: { en: 'High', fr: 'Élevé' },
      strategies: [
        {
          name: 'Long Straddle',
          reason: {
            en: 'Capture large moves in either direction.',
            fr: 'Capturer des mouvements extrêmes dans les deux sens.'
          }
        },
        {
          name: 'Bonus Certificate',
          reason: {
            en: 'Bonus if volatility stays contained, with conditional protection.',
            fr: 'Bonus si la volatilité reste maîtrisée mais protection conditionnelle.'
          }
        },
        {
          name: 'Vega Swap',
          reason: {
            en: 'Take a direct view on implied volatility.',
            fr: 'Positionner directement sur la volatilité implicite.'
          }
        }
      ]
    },
    {
      id: 'protection',
      title: { en: 'Protection focus', fr: 'Recherche PROTECTION' },
      color: 'linear-gradient(135deg, rgba(192,132,252,0.35), rgba(168,85,247,0.25))',
      level: 'low',
      risk: { en: 'Low', fr: 'Faible' },
      strategies: [
        {
          name: 'Protective Put',
          reason: {
            en: 'Insure a portfolio against a severe drawdown.',
            fr: 'Assurer un portefeuille contre une baisse sévère.'
          }
        },
        {
          name: 'Capital Protection Note',
          reason: {
            en: 'Guarantee principal while keeping market participation.',
            fr: 'Garantir le nominal tout en conservant une participation au marché.'
          }
        },
        {
          name: 'Collar',
          reason: {
            en: 'Frame performance by buying a put and selling a call.',
            fr: 'Encadrer les performances via achat de put et vente de call.'
          }
        }
      ]
    },
    {
      id: 'income',
      title: { en: 'Income generation', fr: 'Génération REVENUS' },
      color: 'linear-gradient(135deg, rgba(16,185,129,0.35), rgba(5,150,105,0.25))',
      level: 'medium',
      risk: { en: 'Medium', fr: 'Moyen' },
      strategies: [
        {
          name: 'Covered Call',
          reason: {
            en: 'Earn regular premium in exchange for capping the upside.',
            fr: 'Prime régulière contre un plafond sur la hausse.'
          }
        },
        {
          name: 'Reverse Convertible',
          reason: {
            en: 'High coupon as long as the decline remains contained.',
            fr: 'Coupon élevé tant que la baisse reste contenue.'
          }
        },
        {
          name: 'Autocall Step-Down',
          reason: {
            en: 'Early redemption and coupons if the market holds its level.',
            fr: 'Remboursement anticipé et coupons si le marché se maintient.'
          }
        }
      ]
    }
  ];

  const quizCategories = [
    {
      id: 'capital-protection',
      name: 'Capital Protection',
      color: 'rgba(37,99,235,0.4)',
      questions: [
        {
          question: 'Quel est l’avantage principal d’une Capital Protection Note ?',
          options: [
            'Rendement élevé garanti',
            'Protection du capital à 100%',
            'Pas de frais',
            'Liquidité totale'
          ],
          correct: 1,
          explanation: 'La Capital Protection Note garantit le remboursement du capital initial à maturité.'
        },
        {
          question: 'Dans un CPPI, que se passe-t-il si le coussin devient négatif ?',
          options: [
            'Le produit devient short',
            'La stratégie se cash-out',
            'On augmente le levier',
            'Rien ne change'
          ],
          correct: 1,
          explanation: 'Si le coussin devient négatif, la stratégie se désalloue des actifs risqués (cash-lock).'
        },
        {
          question: 'Quel instrument est combiné avec un zéro coupon pour structurer un produit garanti ?',
          options: ['Option call', 'Option put', 'Swap de taux', 'Futures'],
          correct: 0,
          explanation: 'On achète un call pour capter l’upside tout en garantissant le nominal.'
        },
        {
          question: 'Quel est le principal risque résiduel d’un produit à capital garanti ?',
          options: [
            'Volatilité',
            'Risque de crédit de l’émetteur',
            'Risque de change',
            'Fiscalité'
          ],
          correct: 1,
          explanation: 'La garantie dépend de la solvabilité de l’émetteur (risque de crédit).'
        },
        {
          question: 'Quel paramètre de marché rend la protection moins chère ?',
          options: ['Taux élevés', 'Volatilité élevée', 'Taux bas', 'Dividendes élevés'],
          correct: 0,
          explanation: 'Des taux élevés permettent d’acheter le zéro coupon moins cher, libérant du budget.'
        }
      ]
    },
    {
      id: 'autocalls',
      name: 'Autocalls',
      color: 'rgba(124,58,237,0.4)',
      questions: [
        {
          question: 'Qu’est-ce qu’un autocall ?',
          options: [
            'Un call automatique',
            'Un produit à remboursement anticipé conditionnel',
            'Une option barrière',
            'Un warrant listé'
          ],
          correct: 1,
          explanation: 'L’autocall peut se rembourser avant maturité si le sous-jacent dépasse un niveau.'
        },
        {
          question: 'Quelle est la différence principale entre un Autocall et un Phoenix ?',
          options: [
            'Pas de différence',
            'Phoenix a une barrière KO',
            'Phoenix a un effet mémoire sur coupons',
            'Phoenix est plus cher'
          ],
          correct: 2,
          explanation: 'Le Phoenix mémorise les coupons manqués et les verse si le sous-jacent remonte.'
        },
        {
          question: 'Quelle observation déclenche un autocall classique ?',
          options: [
            'Sous-jacent < barrière',
            'Sous-jacent ≥ niveau de rappel',
            'Volatilité augmente',
            'Temps restant < 3 mois'
          ],
          correct: 1,
          explanation: 'Le remboursement est déclenché si le sous-jacent atteint le niveau de rappel fixé.'
        },
        {
          question: 'Quel est le principal risque d’un Autocall en marché baissier ?',
          options: [
            'Perte du capital intégral',
            'Non paiement des coupons',
            'Hausse de volatilité',
            'Risque de liquidité'
          ],
          correct: 1,
          explanation: 'Si le sous-jacent reste sous la barrière, les coupons ne sont pas versés.'
        },
        {
          question: 'Quel paramètre rend les coupons autocall plus attractifs ?',
          options: [
            'Volatilité implicite élevée',
            'Taux d’intérêt bas',
            'Dividendes faibles',
            'Sous-jacent très stable'
          ],
          correct: 0,
          explanation: 'La vente d’options dans la structure bénéficie d’une volatilité implicite élevée.'
        }
      ]
    },
    {
      id: 'income',
      name: 'Stratégies de revenu',
      color: 'rgba(16,185,129,0.4)',
      questions: [
        {
          question: 'Quel produit offre un coupon fixe élevé en échange d’un risque de baisse ?',
          options: ['Bonus', 'Reverse Convertible', 'Autocall', 'Discount'],
          correct: 1,
          explanation: 'Le Reverse Convertible encaisse un coupon fixe contre un short put implicite.'
        },
        {
          question: 'Quel est l’objectif d’un Covered Call ?',
          options: [
            'Protéger le portefeuille',
            'Générer un revenu régulier',
            'Amplifier la hausse',
            'Réduire la volatilité'
          ],
          correct: 1,
          explanation: 'La vente de call permet d’encaisser une prime et de générer du revenu.'
        },
        {
          question: 'Lequel de ces produits est le plus sensible aux dividendes ?',
          options: ['Reverse Convertible', 'Autocall', 'Bonus Certificate', 'Discount'],
          correct: 3,
          explanation: 'Les Discount Certificates sont très sensibles aux dividendes anticipés.'
        },
        {
          question: 'Quel risque additionnel prend-on sur un produit de revenu structuré ?',
          options: [
            'Risque de crédit émetteur',
            'Risque de change systématique',
            'Risque de taux exclusivement',
            'Risque de corrélation'
          ],
          correct: 0,
          explanation: 'Les produits structurés sont des titres de créance soumis au risque de crédit.'
        },
        {
          question: 'Quel environnement de marché favorise les stratégies de revenu ?',
          options: [
            'Volatilité élevée et range',
            'Trend haussier fort',
            'Trend baissier fort',
            'Marché totalement plat'
          ],
          correct: 0,
          explanation: 'Les primes optionnelles élevées augmentent les coupons offerts.'
        }
      ]
    },
    {
      id: 'barriers',
      name: 'Structures à barrière',
      color: 'rgba(234,179,8,0.4)',
      questions: [
        {
          question: 'Qu’est-ce qu’une barrière knock-in ?',
          options: [
            'Un niveau qui déclenche le payoff',
            'Un niveau qui active une option',
            'Une barrière de désactivation',
            'Un niveau de cap'
          ],
          correct: 1,
          explanation: 'La knock-in active une option seulement si la barrière est touchée.'
        },
        {
          question: 'Quelle structure dépend de l’absence de franchissement de barrière ?',
          options: ['Bonus', 'Straddle', 'Bull Spread', 'Put couvert'],
          correct: 0,
          explanation: 'Le Bonus requiert que la barrière de désactivation ne soit jamais touchée.'
        },
        {
          question: 'Quelles sont les implications d’une barrière continue ?',
          options: [
            'Observation uniquement finale',
            'Observation à tout instant',
            'Barrière plus basse',
            'Moins de risque'
          ],
          correct: 1,
          explanation: 'La barrière continue est surveillée en tout temps, augmentant le risque de déclenchement.'
        },
        {
          question: 'Quel produit typique comporte une barrière de knock-out ?',
          options: [
            'Turbo',
            'Straddle',
            'Put spread',
            'Zero coupon'
          ],
          correct: 0,
          explanation: 'Les turbos possèdent une barrière de knock-out qui clôt la position.'
        },
        {
          question: 'Que devient la valeur temps après knock-out ?',
          options: [
            'Elle augmente',
            'Elle disparaît',
            'Elle est neutre',
            'Elle devient négative'
          ],
          correct: 1,
          explanation: 'Après KO, la position est close, la valeur temps résiduelle s annule.'
        }
      ]
    },
    {
      id: 'leverage',
      name: 'Effet de levier',
      color: 'rgba(59,130,246,0.4)',
      questions: [
        {
          question: 'Quel instrument offre un levier dynamique via delta ?',
          options: ['Option call', 'Zero coupon', 'Deposit', 'Swap de change'],
          correct: 0,
          explanation: 'L’option call voit son delta évoluer avec le sous-jacent, offrant un levier dynamique.'
        },
        {
          question: 'Quel est le principal risque d’un Turbo Long ?',
          options: [
            'Hausse du sous-jacent',
            'Déclenchement de la barrière KO',
            'Baisse des taux',
            'Volatilité basse'
          ],
          correct: 1,
          explanation: 'Si la barrière KO est touchée, la position est soldée avec perte majeure.'
        },
        {
          question: 'Quel paramètre amplifiera le levier d’un call très in-the-money ?',
          options: ['Delta proche de 1', 'Theta positif', 'Vega négatif', 'Rho élevé'],
          correct: 0,
          explanation: 'Un delta proche de 1 rend le call équivalent à l’actif sous-jacent.'
        },
        {
          question: 'Quel montage structurel procure un levier asymétrique ?',
          options: ['Shark Fin', 'Covered Call', 'Straddle', 'Strangle short'],
          correct: 0,
          explanation: 'La Shark Fin combine levier à la hausse et floor KO.'
        },
        {
          question: 'Comment réduire le coût d’une stratégie levier ?',
          options: [
            'Vendre une option plus éloignée',
            'Acheter plus d’options',
            'Allonger la maturité',
            'Ignorer le risque'
          ],
          correct: 0,
          explanation: 'La vente d’une option plus éloignée (spread) finance partiellement la prime.'
        }
      ]
    },
    {
      id: 'vanilla',
      name: 'Options vanilles',
      color: 'rgba(148,163,184,0.4)',
      questions: [
        {
          question: 'Quelle lettre grecque mesure la sensibilité au temps ?',
          options: ['Delta', 'Gamma', 'Theta', 'Vega'],
          correct: 2,
          explanation: 'Theta mesure l érosion de la valeur temps.'
        },
        {
          question: 'Un call est dans la monnaie si :',
          options: [
            'Strike > spot',
            'Strike = spot',
            'Strike < spot',
            'Strike = 0'
          ],
          correct: 2,
          explanation: 'Pour un call, être ITM signifie que le spot est supérieur au strike.'
        },
        {
          question: 'Que fait Gamma ?',
          options: [
            'Sensibilité au spot',
            'Sensibilité du delta',
            'Sensibilité à la volatilité',
            'Sensibilité aux taux'
          ],
          correct: 1,
          explanation: 'Gamma mesure la variation du delta pour un mouvement de spot.'
        },
        {
          question: 'Quelle position profite d’une hausse de volatilité ?',
          options: [
            'Long straddle',
            'Short straddle',
            'Covered call',
            'Put couvert'
          ],
          correct: 0,
          explanation: 'Être long sur options (straddle) est positif vega.'
        },
        {
          question: 'Quel paramètre influence Vega ?',
          options: [
            'Taux',
            'Temps avant échéance',
            'Dividendes',
            'Rho'
          ],
          correct: 1,
          explanation: 'Plus la maturité est longue, plus Vega est élevé.'
        }
      ]
    },
    {
      id: 'volatility',
      name: 'Gestion de volatilité',
      color: 'rgba(249,115,22,0.4)',
      questions: [
        {
          question: 'Quel produit capture une normalisation de volatilité ?',
          options: [
            'Calendar spread short',
            'Straddle long',
            'Risk reversal long',
            'Butterfly long'
          ],
          correct: 0,
          explanation: 'Vendre la vol à court terme et acheter la longue permet de jouer l’aplatissement.'
        },
        {
          question: 'Quel risque porte un short straddle ?',
          options: [
            'Risque limité',
            'Risque illimité',
            'Pas de risque',
            'Risque de taux uniquement'
          ],
          correct: 1,
          explanation: 'La vente d’un straddle expose à des pertes illimitées.'
        },
        {
          question: 'Quel instrument suit la variance réalisée ?',
          options: ['Variance swap', 'Forward', 'Future', 'Swap de taux'],
          correct: 0,
          explanation: 'Un variance swap verse la différence entre variance réalisée et strike.'
        },
        {
          question: 'Comment couvrir Vega d un straddle long ?',
          options: [
            'Short vega via vente d options',
            'Acheter plus d options',
            'Rallonger la maturité',
            'Shorter le sous-jacent'
          ],
          correct: 0,
          explanation: 'La couverture de Vega nécessite souvent des options vendues.'
        },
        {
          question: 'Quel environnement nuit à un long straddle ?',
          options: [
            'Volatilité chute après achat',
            'Volatilité monte',
            'Gros mouvement sur le spot',
            'Hausse des taux'
          ],
          correct: 0,
          explanation: 'Une baisse de volatilité ou un spot immobile érode la prime payée.'
        }
      ]
    },
    {
      id: 'protection',
      name: 'Couverture & hedging',
      color: 'rgba(168,85,247,0.4)',
      questions: [
        {
          question: 'Quel montage protège un portefeuille tout en vendant la hausse ?',
          options: ['Collar', 'Straddle', 'Strangle', 'Spread'],
          correct: 0,
          explanation: 'Un collar combine achat de put et vente de call.'
        },
        {
          question: 'Pourquoi rouler une couverture ?',
          options: [
            'Pour réduire le coût',
            'Pour augmenter le risque',
            'Pour spéculer',
            'Pour éliminer le delta'
          ],
          correct: 0,
          explanation: 'On peut vendre la put existante et en racheter une plus longue pour gérer le coût.'
        },
        {
          question: 'Quel instrument couvre le risque de change ?',
          options: ['Forward FX', 'Swap de taux', 'Option equity', 'Futures commodities'],
          correct: 0,
          explanation: 'Le forward de change neutralise le FX futur.'
        },
        {
          question: 'Comment réduire la prime d’une put protectrice ?',
          options: [
            'Vendre un call',
            'Acheter plus cher',
            'Raccourcir la maturité',
            'Ignorer le risque'
          ],
          correct: 0,
          explanation: 'La vente d’un call convertit la stratégie en collar, réduisant la prime nette.'
        },
        {
          question: 'Quel indicateur suit l’efficience d’une couverture ?',
          options: ['Ratio de couverture', 'Gamma', 'Theta', 'Vega'],
          correct: 0,
          explanation: 'Le hedge ratio (beta/delta) mesure la qualité de la couverture.'
        }
      ]
    },
    {
      id: 'income-options',
      name: 'Yield enhancement',
      color: 'rgba(5,150,105,0.4)',
      questions: [
        {
          question: 'Quel montage optionnel encaisse une prime en échange d’un cap ?',
          options: ['Covered Call', 'Protective Put', 'Long Straddle', 'Calendar long'],
          correct: 0,
          explanation: 'La vente de call couvre génère un revenu mais plafonne la hausse.'
        },
        {
          question: 'Quel est le payoff d’un Reverse Convertible si la barrière est respectée ?',
          options: [
            'Perte totale',
            'Coupon + nominal',
            'Livraison du sous-jacent',
            'Zéro'
          ],
          correct: 1,
          explanation: 'Le coupon est garanti et le nominal est remboursé si la barrière tient.'
        },
        {
          question: 'Quel produit listé reproduit un Discount Certificate ?',
          options: [
            'Short call + long action',
            'Long call + short put',
            'Long put seule',
            'Futures'
          ],
          correct: 0,
          explanation: 'Un discount équivaut à un covered call.'
        },
        {
          question: 'Quel risque est clé pour une stratégie de revenu ?',
          options: ['Risque de gap', 'Risque de taux', 'Risque de change', 'Risque réglementaire'],
          correct: 0,
          explanation: 'Un gap peut déclencher la barrière et annuler le coupon attendu.'
        },
        {
          question: 'Quelle variable rend une vente d’option plus attractive ?',
          options: ['Volatilité implicite élevée', 'Temps court', 'Taux bas', 'Dividendes élevés'],
          correct: 0,
          explanation: 'Une volatilité implicite élevée augmente le prix de l’option vendue.'
        }
      ]
    },
    {
      id: 'hybrids',
      name: 'Exotiques & hybrides',
      color: 'rgba(99,102,241,0.4)',
      questions: [
        {
          question: 'Quel produit combine plusieurs sous-jacents via corrélation ?',
          options: ['Basket autocall', 'Vanilla call', 'Put spread', 'Forward'],
          correct: 0,
          explanation: 'Les autocalls baskets reposent sur la corrélation entre sous-jacents.'
        },
        {
          question: 'Quel payoff dépend d’un chemin spécifique ?',
          options: ['Asian option', 'Vanilla', 'Forward', 'Swap'],
          correct: 0,
          explanation: 'Les options asiatiques sont path-dependent.'
        },
        {
          question: 'Quelle caractéristique distingue les cliquets ?',
          options: [
            'Fixation de coupons par paliers',
            'Strike unique',
            'Pas de barrière',
            'Linearité'
          ],
          correct: 0,
          explanation: 'Les cliquets enregistrent des coupons/performances successives.'
        },
        {
          question: 'Quel est le principal risque d’un produit hybride commodity/action ?',
          options: [
            'Corrélation incertaine',
            'Absence de volatilité',
            'Taux négatifs',
            'Dividendes'
          ],
          correct: 0,
          explanation: 'La corrélation entre actifs peut se dégrader et impacter le payoff.'
        },
        {
          question: 'Quel produit utilise la variance réalisée comme sous-jacent ?',
          options: [
            'Variance swap',
            'Autocall',
            'Zero coupon',
            'Forward FX'
          ],
          correct: 0,
          explanation: 'La variance réalisée est l’actif sous-jacent d’un variance swap.'
        }
      ]
    }
  ];

  const dom = {};
  let comparisonChart;
  let lastFocusedTrigger = null;

  document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    populateSelects();
    setupTabs();
    initChart();
    initComparison();
    initModal();
    initQuiz();
    updateCurrentYear();
    initializeLanguage();
  });

  function cacheDom() {
    dom.navHome = document.getElementById('nav-home');
    dom.navStructured = document.getElementById('nav-structured');
    dom.navOptions = document.getElementById('nav-options');
    dom.navCompare = document.getElementById('nav-compare');
    dom.langToggle = document.getElementById('lang-toggle');
    dom.langText = document.getElementById('lang-text');
    dom.heroTitle = document.getElementById('compare-hero-title');
    dom.heroDescription = document.getElementById('compare-hero-description');
    dom.tabComparisonLabel = document.getElementById('tab-comparison-label');
    dom.tabRecommendationsLabel = document.getElementById('tab-recommendations-label');
    dom.tabQuizLabel = document.getElementById('tab-quiz-label');
    dom.strategy1Title = document.getElementById('strategy-1-title');
    dom.strategy2Title = document.getElementById('strategy-2-title');
    dom.detailsButton1 = document.getElementById('details-button-1');
    dom.detailsButton2 = document.getElementById('details-button-2');
    dom.metricLabel = document.getElementById('table-metric-label');
    dom.footerDisclaimer = document.getElementById('footer-disclaimer');
    dom.footerCopyright = document.getElementById('footer-copyright');
    dom.strategySelect1 = document.getElementById('strategy-select-1');
    dom.strategySelect2 = document.getElementById('strategy-select-2');
    dom.strategy1Meta = document.getElementById('strategy-1-meta');
    dom.strategy2Meta = document.getElementById('strategy-2-meta');
    dom.strategy1Type = document.getElementById('strategy-1-type');
    dom.strategy2Type = document.getElementById('strategy-2-type');
    dom.strategy1Label = document.getElementById('strategy-1-label');
    dom.strategy2Label = document.getElementById('strategy-2-label');
    dom.comparisonTableBody = document.getElementById('comparison-table-body');
    dom.chartLoading = document.getElementById('chart-loading');
    dom.tabButtons = Array.from(document.querySelectorAll('.tab-button'));
    dom.tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
    dom.recommendationsGrid = document.getElementById('recommendations-grid');
    dom.modal = document.getElementById('strategy-modal');
    dom.modalClose = document.getElementById('modal-close');
    dom.modalTitle = document.getElementById('modal-title');
    dom.modalDescription = document.getElementById('modal-description');
    dom.modalPoints = document.getElementById('modal-points');
    dom.quizCategoryTitle = document.getElementById('quiz-category-title');
    dom.quizCategoryBadge = document.getElementById('quiz-category-badge');
    dom.quizProgressCount = document.getElementById('quiz-progress-count');
    dom.quizScore = document.getElementById('quiz-score');
    dom.quizQuestion = document.getElementById('quiz-question-text');
    dom.quizOptions = document.getElementById('quiz-options-container');
    dom.quizFeedback = document.getElementById('quiz-feedback');
    dom.quizValidate = document.getElementById('quiz-validate');
    dom.quizSkip = document.getElementById('quiz-skip');
    dom.quizResultsTitle = document.getElementById('quiz-results-title');
    dom.quizResults = document.getElementById('quiz-results');
    dom.quizFinalScore = document.getElementById('quiz-final-score');
    dom.quizBadge = document.getElementById('quiz-badge');
    dom.resultsBreakdown = document.getElementById('results-breakdown');
    dom.quizRestart = document.getElementById('quiz-restart');
    dom.quizReviewErrors = document.getElementById('quiz-review-errors');
    dom.quizErrorsTitle = document.getElementById('quiz-errors-title');
    dom.quizErrorsSection = document.getElementById('quiz-errors');
    dom.quizErrorsContainer = document.getElementById('errors-container');
  }

  function initializeLanguage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('preferredLanguage');
        if (saved && UI_TRANSLATIONS[saved]) {
          currentLanguage = saved;
        }
      } catch (error) {
        // ignore storage access issues
      }
    }

    if (!UI_TRANSLATIONS[currentLanguage]) {
      currentLanguage = 'en';
    }

    if (dom.langToggle) {
      dom.langToggle.addEventListener('click', toggleLanguage);
    }

    applyTranslations();
  }

  function applyTranslations() {
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    document.documentElement.lang = currentLanguage;

    if (dom.langText) {
      dom.langText.textContent = currentLanguage === 'en' ? 'FR' : 'EN';
    }

    if (dom.langToggle) {
      dom.langToggle.setAttribute('aria-label', t.toggleLabel);
    }

    if (dom.navHome) dom.navHome.textContent = t.navHome;
    if (dom.navStructured) dom.navStructured.textContent = t.navStructured;
    if (dom.navOptions) dom.navOptions.textContent = t.navOptions;
    if (dom.navCompare) dom.navCompare.textContent = t.navCompare;

    if (t.pageTitle) document.title = t.pageTitle;
    if (dom.heroTitle) dom.heroTitle.textContent = t.heroTitle;
    if (dom.heroDescription) dom.heroDescription.textContent = t.heroDescription;

    if (dom.tabComparisonLabel) dom.tabComparisonLabel.textContent = t.tabComparison;
    if (dom.tabRecommendationsLabel) dom.tabRecommendationsLabel.textContent = t.tabRecommendations;
    if (dom.tabQuizLabel) dom.tabQuizLabel.textContent = t.tabQuiz;

    if (dom.strategy1Title) dom.strategy1Title.textContent = t.strategy1Title;
    if (dom.strategy2Title) dom.strategy2Title.textContent = t.strategy2Title;
    if (dom.strategy1Type) dom.strategy1Type.textContent = t.strategy1Type;
    if (dom.strategy2Type) dom.strategy2Type.textContent = t.strategy2Type;

    if (dom.detailsButton1) dom.detailsButton1.textContent = t.detailsButton;
    if (dom.detailsButton2) dom.detailsButton2.textContent = t.detailsButton;

    if (dom.metricLabel) dom.metricLabel.textContent = t.metricLabel;
    if (dom.strategy1Label) dom.strategy1Label.textContent = t.strategy1Title;
    if (dom.strategy2Label) dom.strategy2Label.textContent = t.strategy2Title;
    if (dom.chartLoading) dom.chartLoading.textContent = t.chartLoading;

    if (dom.quizValidate) dom.quizValidate.textContent = t.quizValidate;
    if (dom.quizSkip) dom.quizSkip.textContent = t.quizSkip;
    if (dom.quizResultsTitle) dom.quizResultsTitle.textContent = t.quizResultsTitle;
    if (dom.quizErrorsTitle) dom.quizErrorsTitle.textContent = t.quizErrorsTitle;
    if (dom.quizRestart) dom.quizRestart.textContent = t.quizRestart;
    if (dom.quizReviewErrors) dom.quizReviewErrors.textContent = t.quizReviewErrors;

    if (dom.footerDisclaimer) dom.footerDisclaimer.textContent = t.footerDisclaimer;
    if (dom.footerCopyright) {
      dom.footerCopyright.innerHTML = t.footerCopyright;
      updateCurrentYear();
    }

    if (dom.modalTitle) dom.modalTitle.textContent = t.modalTitle;

    underlyingReferenceLabel = t.underlyingReference || UI_TRANSLATIONS.en.underlyingReference;

    buildRecommendations();
    updateQuizScoreDisplay();
    updateFinalScoreDisplay();

    if (dom.strategySelect1 && dom.strategySelect1.options.length && dom.strategySelect2 && dom.strategySelect2.options.length) {
      initComparison();
    }
  }

  function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('preferredLanguage', currentLanguage);
      } catch (error) {
        // ignore storage write issues
      }
    }
    applyTranslations();
  }

  function updateQuizScoreDisplay() {
    if (!dom.quizScore || !quizState) return;
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    const answered = quizState.answered;
    const percent = answered === 0 ? 0 : Math.round((quizState.totalCorrect / answered) * 100);
    dom.quizScore.textContent = `${t.scoreLabel}${t.scoreLabelSuffix} ${quizState.totalCorrect} / ${answered} (${percent}%)`;
  }

  function updateFinalScoreDisplay(scorePercent = null) {
    if (!dom.quizFinalScore || !quizState) return;
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    const total = quizState.totalQuestions || 0;
    const percent = scorePercent !== null ? scorePercent : (total === 0 ? 0 : Math.round((quizState.totalCorrect / total) * 100));
    dom.quizFinalScore.textContent = `${t.finalScoreLabel}${t.scoreLabelSuffix} ${quizState.totalCorrect} / ${total} (${percent}%)`;
    if (dom.quizBadge) {
      dom.quizBadge.textContent = `${t.badgeLabel}${t.scoreLabelSuffix} ${resolveBadge(percent)}`;
    }
  }

  function populateSelects() {
    const structuredOptions = strategyUniverse.structured
      .map((strategy) => `<option value="${strategy.id}">${strategy.name}</option>`)
      .join('');
    dom.strategySelect1.innerHTML = structuredOptions;

    const optionStrategies = strategyUniverse.options
      .map((strategy) => `<option value="${strategy.id}">${strategy.name}</option>`)
      .join('');
    dom.strategySelect2.innerHTML = optionStrategies;

    dom.strategySelect1.addEventListener('change', initComparison);
    dom.strategySelect2.addEventListener('change', initComparison);
  }

  function setupTabs() {
    dom.tabButtons.forEach((button) => {
      button.setAttribute('tabindex', button.getAttribute('aria-selected') === 'true' ? '0' : '-1');
      button.addEventListener('click', handleTabClick);
      button.addEventListener('keydown', handleTabKeydown);
    });
  }

  function handleTabClick(event) {
    const target = event.currentTarget;
    const panelId = target.getAttribute('aria-controls');
    switchTab(target, panelId);
  }

  function handleTabKeydown(event) {
    const { key } = event;
    const currentIndex = dom.tabButtons.indexOf(event.currentTarget);
    let newIndex = currentIndex;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      newIndex = (currentIndex + 1) % dom.tabButtons.length;
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      newIndex = (currentIndex - 1 + dom.tabButtons.length) % dom.tabButtons.length;
    } else if (key === 'Home') {
      newIndex = 0;
    } else if (key === 'End') {
      newIndex = dom.tabButtons.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    dom.tabButtons[newIndex].focus();
    dom.tabButtons[newIndex].click();
  }

  function switchTab(button, panelId) {
    dom.tabButtons.forEach((btn) => {
      const isActive = btn === button;
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    dom.tabPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === panelId);
    });

    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
      targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function initChart() {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;

    comparisonChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            type: 'linear',
            min: 30,
            max: 170,
            title: {
              display: true,
              text: 'Spot (% du niveau initial)',
              color: '#cbd5f5'
            },
            grid: {
              color: 'rgba(148,163,184,0.15)'
            },
            ticks: {
              color: '#e2e8f0',
              callback: (value) => `${value}%`
            }
          },
          y: {
            min: -30,
            max: 70,
            title: {
              display: true,
              text: 'Payoff (% du nominal)',
              color: '#cbd5f5'
            },
            grid: {
              color: 'rgba(148,163,184,0.15)'
            },
            ticks: {
              color: '#e2e8f0',
              callback: (value) => `${value}%`
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e2e8f0'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
            }
          },
          annotation: {
            annotations: {}
          }
        },
        elements: {
          line: {
            tension: 0.22
          },
          point: {
            radius: 0,
            hoverRadius: 4
          }
        }
      }
    });
  }

  function initComparison() {
    const strategy1 = getStrategyById('structured', dom.strategySelect1.value);
    const strategy2 = getStrategyById('options', dom.strategySelect2.value);

    updateStrategyCard(dom.strategy1Meta, dom.strategy1Type, strategy1);
    updateStrategyCard(dom.strategy2Meta, dom.strategy2Type, strategy2);

    updateStrategyLabels(strategy1, strategy2);
    updateComparisonTable(strategy1, strategy2);
    updateChart(strategy1, strategy2);
  }

  function getStrategyById(group, id) {
    return strategyUniverse[group].find((strategy) => strategy.id === id) || null;
  }

  function updateStrategyCard(metaContainer, typeBadge, strategy) {
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    if (!strategy) {
      metaContainer.innerHTML = `<span class="meta-chip">${t.noDataChip}</span>`;
      typeBadge.textContent = t.noDataType;
      return;
    }

    if (typeBadge === dom.strategy1Type) {
      typeBadge.textContent = t.strategy1Type;
    } else if (typeBadge === dom.strategy2Type) {
      typeBadge.textContent = t.strategy2Type;
    } else {
      typeBadge.textContent = strategy.typeLabel || '';
    }

    metaContainer.innerHTML = strategy.meta
      .map((label) => `<span class="meta-chip">${label}</span>`)
      .join('');
  }

  function updateStrategyLabels(strategy1, strategy2) {
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    dom.strategy1Label.textContent = strategy1 ? strategy1.name : t.strategy1Title;
    dom.strategy2Label.textContent = strategy2 ? strategy2.name : t.strategy2Title;
  }

  function updateComparisonTable(strategy1, strategy2) {
    const rows = metricsOrder.map((metric) => {
      if (metric === 'Complexité') {
        const s1Stars = strategy1 ? buildStars(strategy1.complexity) : '—';
        const s2Stars = strategy2 ? buildStars(strategy2.complexity) : '—';
        return `
          <tr>
            <td>${metric}</td>
            <td><span class="stars">${s1Stars}</span></td>
            <td><span class="stars">${s2Stars}</span></td>
          </tr>
        `;
      }

      const s1Value = strategy1 ? strategy1.metrics[metric] : '—';
      const s2Value = strategy2 ? strategy2.metrics[metric] : '—';
      return `
        <tr>
          <td>${metric}</td>
          <td>${s1Value}</td>
          <td>${s2Value}</td>
        </tr>
      `;
    });

    dom.comparisonTableBody.innerHTML = rows.join('');
  }

  function buildStars(level = 0) {
    const clamped = Math.max(0, Math.min(5, level));
    const filled = '★'.repeat(clamped);
    const empty = '☆'.repeat(5 - clamped);
    return `${filled}${empty}`;
  }

  function buildDataset(strategy, color) {
    return {
      label: strategy.name,
      data: SPOT_RANGE.map((spot) => ({ x: spot, y: strategy.payoff(spot) })),
      borderColor: color,
      backgroundColor: 'transparent',
      borderWidth: 2.5,
      borderDash: strategy.category === 'Range' ? [6, 4] : [],
      pointRadius: 0,
      hoverRadius: 4
    };
  }

  function buildUnderlyingDataset() {
    return {
      label: underlyingReferenceLabel,
      data: SPOT_RANGE.map((spot) => ({ x: spot, y: clamp(spot - 100) })),
      borderColor: UNDERLYING_COLOR,
      borderWidth: 2,
      borderDash: [6, 6],
      pointRadius: 0,
      hoverRadius: 0
    };
  }

  function buildAnnotations(strategy, color, suffix) {
    if (!strategy || !Array.isArray(strategy.annotations)) return {};
    return strategy.annotations.reduce((acc, annotation, index) => {
      if (typeof annotation.value !== 'number') return acc;
      const key = `${strategy.id}-${suffix}-${index}`;
      acc[key] = {
        type: 'line',
        xMin: annotation.value,
        xMax: annotation.value,
        borderColor: annotation.type === 'barrier' ? 'rgba(248, 113, 113, 0.9)' : color,
        borderWidth: 2,
        borderDash: annotation.type === 'barrier' || annotation.type === 'cap' ? [8, 6] : [],
        label: {
          display: true,
          content: annotation.label,
          rotation: -90,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          color: '#e2e8f0',
          padding: 6,
          borderRadius: 8
        }
      };
      return acc;
    }, {});
  }

  function updateChart(strategy1, strategy2) {
    if (!comparisonChart) return;

    dom.chartLoading.classList.add('visible');

    const datasets = [buildUnderlyingDataset()];
    const annotations = {};

    if (strategy1) {
      datasets.push(buildDataset(strategy1, STRATEGY_ONE_COLOR));
      Object.assign(annotations, buildAnnotations(strategy1, STRATEGY_ONE_COLOR, 'first'));
    }

    if (strategy2) {
      datasets.push(buildDataset(strategy2, STRATEGY_TWO_COLOR));
      Object.assign(annotations, buildAnnotations(strategy2, STRATEGY_TWO_COLOR, 'second'));
    }

    comparisonChart.data.datasets = datasets;
    comparisonChart.options.plugins.annotation.annotations = annotations;
    comparisonChart.update();

    requestAnimationFrame(() => {
      dom.chartLoading.classList.remove('visible');
    });
  }

  function buildRecommendations() {
    if (!dom.recommendationsGrid) return;
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    const language = UI_TRANSLATIONS[currentLanguage] ? currentLanguage : 'en';
    const localize = (value) => {
      if (typeof value === 'string') return value;
      if (value && typeof value === 'object') {
        return value[language] ?? value.en ?? value.fr ?? Object.values(value)[0];
      }
      return '';
    };

    dom.recommendationsGrid.innerHTML = recommendationsData
      .map((card) => {
        const title = localize(card.title);
        const riskText = localize(card.risk);
        const riskColorMap = {
          high: 'rgba(239, 68, 68, 0.2)',
          'medium-high': 'rgba(249, 115, 22, 0.2)',
          medium: 'rgba(34, 197, 94, 0.2)',
          low: 'rgba(59, 130, 246, 0.2)'
        };
        const riskColor = riskColorMap[card.level] || riskColorMap.medium;

        return `
          <article class="recommendation-card" style="background:${card.color}">
            <h3>${title}</h3>
            <ul>
              ${card.strategies
                .map((item) => {
                  const reason = localize(item.reason);
                  return `<li><strong>${item.name}</strong><span>${reason}</span></li>`;
                })
                .join('')}
            </ul>
            <span class="risk-badge" style="background:${riskColor}; border-color:${riskColor}">${t.riskLabel}${t.scoreLabelSuffix} ${riskText}</span>
          </article>
        `;
      })
      .join('');
  }

  function initModal() {
    const detailButtons = document.querySelectorAll('.details-button');
    detailButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const role = event.currentTarget.dataset.strategyRole;
        const strategy =
          role === 'first'
            ? getStrategyById('structured', dom.strategySelect1.value)
            : getStrategyById('options', dom.strategySelect2.value);
        if (!strategy) return;
        lastFocusedTrigger = event.currentTarget;
        openModal(strategy);
      });
    });

    dom.modalClose.addEventListener('click', closeModal);
    dom.modal.addEventListener('click', (event) => {
      if (event.target === dom.modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && dom.modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function openModal(strategy) {
    dom.modalTitle.textContent = strategy.name;
    dom.modalDescription.textContent = strategy.description;
    dom.modalPoints.innerHTML = `
      <ul>
        ${strategy.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
      </ul>
    `;
    dom.modal.classList.add('active');
    dom.modalClose.focus();
  }

  function closeModal() {
    dom.modal.classList.remove('active');
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
    }
  }

  function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  quizState = {
    categoryIndex: 0,
    questionIndex: 0,
    totalCorrect: 0,
    totalQuestions: quizCategories.reduce((acc, cat) => acc + cat.questions.length, 0),
    answered: 0,
    history: [],
    validated: false
  };

  function initQuiz() {
    dom.quizValidate.addEventListener('click', handleQuizValidate);
    dom.quizSkip.addEventListener('click', handleQuizSkip);
    dom.quizRestart.addEventListener('click', handleQuizRestart);
    dom.quizReviewErrors.addEventListener('click', handleQuizReviewErrors);

    renderQuizQuestion();
  }

  function getCurrentQuestion() {
    const category = quizCategories[quizState.categoryIndex];
    const question = category.questions[quizState.questionIndex];
    return { category, question };
  }

  function renderQuizQuestion() {
    const { category, question } = getCurrentQuestion();
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

    dom.quizCategoryTitle.textContent = category.name;
    dom.quizCategoryBadge.textContent = category.name;
    dom.quizCategoryBadge.style.backgroundColor = category.color;
    dom.quizProgressCount.textContent = `Question ${quizState.questionIndex + 1} / ${category.questions.length}`;
    dom.quizQuestion.textContent = question.question;

    dom.quizOptions.innerHTML = question.options
      .map(
        (option, index) => `
          <label class="quiz-option">
            <input type="radio" name="quiz-option" value="${index}" aria-label="${option}">
            <span>${option}</span>
          </label>
        `
      )
      .join('');

    dom.quizFeedback.classList.add('hidden');
    dom.quizFeedback.textContent = '';
    dom.quizFeedback.classList.remove('success', 'error');

    quizState.validated = false;
    dom.quizValidate.textContent = t.quizValidate;
    dom.quizSkip.textContent = t.quizSkip;
    dom.quizSkip.disabled = false;

    updateQuizScoreDisplay();
  }

  function handleQuizValidate() {
    if (quizState.validated) {
      goToNextQuizStep();
      return;
    }

    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    const selected = dom.quizOptions.querySelector('input[name="quiz-option"]:checked');
    if (!selected) {
      dom.quizFeedback.classList.remove('hidden', 'success');
      dom.quizFeedback.classList.add('error');
      dom.quizFeedback.textContent = t.feedbackSelect;
      return;
    }

    const selectedIndex = Number(selected.value);
    const { category, question } = getCurrentQuestion();
    const isCorrect = selectedIndex === question.correct;

    quizState.answered += 1;
    if (isCorrect) {
      quizState.totalCorrect += 1;
    }

    quizState.history.push({
      category: category.name,
      question: question.question,
      selected: question.options[selectedIndex],
      correctAnswer: question.options[question.correct],
      explanation: question.explanation,
      isCorrect
    });

    dom.quizFeedback.classList.remove('hidden');
    dom.quizOptions.querySelectorAll('input').forEach((input) => {
      input.disabled = true;
    });

    if (isCorrect) {
      dom.quizFeedback.classList.add('success');
      dom.quizFeedback.textContent = `${t.feedbackCorrectPrefix}${question.explanation}`;
    } else {
      dom.quizFeedback.classList.add('error');
      dom.quizFeedback.textContent = `${t.feedbackIncorrectPrefix}${t.feedbackIncorrectAnswer}${question.options[question.correct]}. ${question.explanation}`;
    }

    quizState.validated = true;
    dom.quizValidate.textContent = t.quizNext;
    dom.quizSkip.disabled = true;

    updateQuizScoreDisplay();
  }

  function handleQuizSkip() {
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    if (!quizState.validated) {
      quizState.history.push({
        category: quizCategories[quizState.categoryIndex].name,
        question: getCurrentQuestion().question.question,
        selected: t.quizSkippedLabel,
        correctAnswer: quizCategories[quizState.categoryIndex].questions[quizState.questionIndex].options[
          quizCategories[quizState.categoryIndex].questions[quizState.questionIndex].correct
        ],
        explanation: quizCategories[quizState.categoryIndex].questions[quizState.questionIndex].explanation,
        isCorrect: false
      });
    }
    goToNextQuizStep();
  }

  function goToNextQuizStep() {
    const category = quizCategories[quizState.categoryIndex];
    if (quizState.questionIndex < category.questions.length - 1) {
      quizState.questionIndex += 1;
      renderQuizQuestion();
      return;
    }

    if (quizState.categoryIndex < quizCategories.length - 1) {
      quizState.categoryIndex += 1;
      quizState.questionIndex = 0;
      renderQuizQuestion();
      return;
    }

    finalizeQuiz();
  }

  function finalizeQuiz() {
    dom.quizResults.classList.add('active');
    const scorePercent = Math.round((quizState.totalCorrect / quizState.totalQuestions) * 100);
    updateFinalScoreDisplay(scorePercent);
    dom.quizValidate.disabled = true;
    dom.quizSkip.disabled = true;

    buildResultsBreakdown();
  }

  function resolveBadge(scorePercent) {
    const labels = BADGE_LABELS[currentLanguage] || BADGE_LABELS.en;
    if (scorePercent > 80) return labels.expert;
    if (scorePercent >= 60) return labels.intermediate;
    return labels.beginner;
  }

  function buildResultsBreakdown() {
    const perCategory = quizCategories.map((category, index) => {
      const history = quizState.history.slice(index * category.questions.length, (index + 1) * category.questions.length);
      const correctAnswers = history.filter((item) => item.isCorrect).length;
      const percent = Math.round((correctAnswers / category.questions.length) * 100);
      return { category, correctAnswers, percent };
    });

    dom.resultsBreakdown.innerHTML = perCategory
      .map(
        ({ category, correctAnswers, percent }) => `
          <div class="breakdown-card">
            <strong>${category.name}</strong>
            <p>${correctAnswers} / ${category.questions.length}</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${percent}%; background:${category.color};"></div>
            </div>
          </div>
        `
      )
      .join('');
  }

  function handleQuizRestart() {
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    const confirmation = window.confirm(t.quizRestartConfirm);
    if (!confirmation) return;
    resetQuizState();
    dom.quizResults.classList.remove('active');
    dom.quizErrorsSection.classList.remove('active');
    renderQuizQuestion();
    updateFinalScoreDisplay();
  }

  function resetQuizState() {
    quizState.categoryIndex = 0;
    quizState.questionIndex = 0;
    quizState.totalCorrect = 0;
    quizState.answered = 0;
    quizState.history = [];
    quizState.validated = false;
    dom.quizValidate.disabled = false;
    dom.quizSkip.disabled = false;
  }

  function handleQuizReviewErrors() {
    const mistakes = quizState.history.filter((item) => !item.isCorrect);
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    if (!mistakes.length) {
      dom.quizErrorsSection.classList.add('active');
      dom.quizErrorsContainer.innerHTML = `<p>${t.quizNoErrors}</p>`;
      return;
    }

    dom.quizErrorsSection.classList.add('active');
    dom.quizErrorsContainer.innerHTML = mistakes
      .map(
        (item) => `
          <div class="error-item">
            <strong>${item.category}</strong>
            <p>${item.question}</p>
            <p><em>${t.userAnswerLabel}</em> ${item.selected || '—'}</p>
            <p><em>${t.correctAnswerLabel}</em> ${item.correctAnswer}</p>
            <p>${item.explanation}</p>
          </div>
        `
      )
      .join('');
  }
})();
