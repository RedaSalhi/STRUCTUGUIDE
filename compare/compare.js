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
    navQuiz: 'Quiz',
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
    footerCopyright: '© 2025 REDA SALHI - Tous droits réservés.',
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
    navQuiz: 'Quiz',
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
    footerCopyright: '© 2025 REDA SALHI - Tous droits réservés.',
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

  function resolveLocalized(value, languageOverride) {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object') {
      const language = languageOverride || (UI_TRANSLATIONS[currentLanguage] ? currentLanguage : 'en');
      return value[language] ?? value.en ?? value.fr ?? Object.values(value)[0] ?? '';
    }
    return '';
  }

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
      },
      {
        id: 'discount-certificate',
        name: 'Discount Certificate',
        typeLabel: 'Structuré',
        category: 'Discount',
        meta: ['Décote 8%', 'Cap 120%', 'Sans coupons'],
        complexity: 2,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Décote initiale contre cap sur la hausse',
          'Protection': 'Amortit une baisse modérée via la décote',
          'Rendement potentiel': 'Plafonné au cap 120%',
          'Sensibilité volatilité': 'Négative (short call implicite)',
          'Horizon': '6 à 18 mois'
        },
        annotations: [
          { type: 'cap', value: 120, label: 'Cap 120' }
        ],
        description: 'Certificat de rendement permettant d’acheter le sous-jacent avec décote en échange d’un plafond sur la hausse.',
        bullets: [
          'Décote de 8 % qui amortit les baisses modérées.',
          'Participation linéaire jusqu’au cap fixé à 120 %.',
          'Pas de coupon, payoff dépend uniquement du niveau final.'
        ],
        payoff: (spot) => {
          const cap = 120;
          const discount = 8;
          const effective = Math.min(spot, cap);
          return clamp(effective - 100 + discount);
        }
      },
      {
        id: 'autocall-stepdown',
        name: 'Autocall Step-Down',
        typeLabel: 'Structuré',
        category: 'Autocalls',
        meta: ['Coupons 9%', 'Trigger décroissant', 'Barrière 60%'],
        complexity: 4,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Coupons conditionnels avec niveau de rappel décroissant',
          'Protection': 'Barrière de capital à 60 % en finale',
          'Rendement potentiel': 'Jusqu’à 9 % annuel si autocall',
          'Sensibilité volatilité': 'Élevée (barrières continues)',
          'Horizon': '1 à 3 ans'
        },
        annotations: [
          { type: 'call', value: 100, label: 'Autocall initial 100' },
          { type: 'call', value: 95, label: 'Step-down 95' },
          { type: 'barrier', value: 60, label: 'Barrière 60%' }
        ],
        description: 'Autocall avec niveau de rappel qui diminue dans le temps, offrant des coupons réguliers tant que le sous-jacent reste au-dessus de la barrière.',
        bullets: [
          'Niveau de rappel qui baisse de 5 % à chaque constatation.',
          'Coupons de 9 % versés si le sous-jacent dépasse le niveau step-down.',
          'Protection conditionnelle du capital avec barrière 60 % observée en finale.'
        ],
        payoff: (spot) => {
          if (spot >= 100) return clamp(18);
          if (spot >= 95) return clamp(12);
          if (spot >= 80) return clamp(6);
          if (spot >= 60) return 0;
          return clamp((spot - 60) * 0.5 - 12);
        }
      },
      {
        id: 'capital-protection-barrier',
        name: 'Capital Protection + Barrier',
        typeLabel: 'Structuré',
        category: 'Capital Protection',
        meta: ['Participation 90%', 'Barrière 140%', 'Rebate 5%'],
        complexity: 3,
        risk: 'Low',
        metrics: {
          'Profil de rendement': 'Participation à 90 % tant que la barrière reste intacte',
          'Protection': 'Capital garanti + coupon minimum si barrière franchie',
          'Rendement potentiel': 'Upside modéré plafonné par la barrière',
          'Sensibilité volatilité': 'Faible à modérée',
          'Horizon': '3 à 5 ans'
        },
        annotations: [
          { type: 'strike', value: 100, label: 'Strike 100' },
          { type: 'barrier', value: 140, label: 'Barrière 140%' }
        ],
        description: 'Note à capital garanti qui capte 90 % de la hausse tant que la barrière 140 % n’est pas touchée. En cas de franchissement, un coupon forfaitaire de 5 % est servi.',
        bullets: [
          'Participation linéaire de 90 % à la hausse jusqu’à la barrière.',
          'Capital garanti à maturité même si le marché recule.',
          'En cas de barrière franchie, versement d’un coupon fixe de 5 %.'
        ],
        payoff: (spot) => {
          const barrier = 140;
          if (spot <= 100) return 0;
          if (spot >= barrier) return clamp(5);
          return clamp((spot - 100) * 0.9);
        }
      },
      {
        id: 'wedding-cake',
        name: 'Wedding Cake',
        typeLabel: 'Structuré',
        category: 'Range',
        meta: ['Coupon 12%', 'Range 90-110', 'Capital garanti'],
        complexity: 3,
        risk: 'Low',
        metrics: {
          'Profil de rendement': 'Coupons fixes si le sous-jacent reste dans un couloir',
          'Protection': 'Capital garanti à maturité',
          'Rendement potentiel': '12 % dans le couloir principal',
          'Sensibilité volatilité': 'Négative (structure range)',
          'Horizon': '2 ans'
        },
        annotations: [
          { type: 'range', value: 90, label: 'Borne 1 90%' },
          { type: 'range', value: 110, label: 'Borne 2 110%' }
        ],
        description: 'Structure de rendement défensive qui verse un coupon élevé si le sous-jacent reste dans un tunnel serré, avec coupon réduit si le marché sort légèrement de la zone.',
        bullets: [
          'Coupon de 12 % si le spot termine entre 90 % et 110 %.',
          'Coupon réduit de 5 % si le spot reste entre 80 % et 120 %.',
          'Capital protégé à 100 % hors du couloir élargi.'
        ],
        payoff: (spot) => {
          if (spot >= 90 && spot <= 110) return clamp(12);
          if (spot >= 80 && spot <= 120) return clamp(5);
          return 0;
        }
      },
      {
        id: 'range-accrual',
        name: 'Range Accrual Note',
        typeLabel: 'Structuré',
        category: 'Income',
        meta: ['Coupons 8%', 'Observation mensuelle', 'Corridor 85-115'],
        complexity: 3,
        risk: 'Medium',
        metrics: {
          'Profil de rendement': 'Coupon proportionnel au temps passé dans la zone cible',
          'Protection': 'Pas de garantie en capital, amortit via prime',
          'Rendement potentiel': 'Jusqu’à 8 % si range respectée',
          'Sensibilité volatilité': 'Forte à la sortie du corridor',
          'Horizon': '1 à 2 ans'
        },
        annotations: [
          { type: 'range', value: 85, label: 'Borne basse 85%' },
          { type: 'range', value: 115, label: 'Borne haute 115%' }
        ],
        description: 'Note de revenu ciblée qui accumule des coupons tant que le sous-jacent reste dans un corridor prédéfini, offrant un rendement attractif sur marché stable.',
        bullets: [
          'Observation mensuelle du spot pour calculer le coupon final.',
          'Jusqu’à 8 % de coupon si le corridor est respecté toute la période.',
          'En dehors du corridor, coupon réduit et perte potentielle de performance.'
        ],
        payoff: (spot) => {
          if (spot >= 90 && spot <= 110) return clamp(8);
          if (spot >= 85 && spot <= 115) return clamp(3);
          return clamp(-5);
        }
      },
      {
        id: 'turbo-long',
        name: 'Turbo Long 4x',
        typeLabel: 'Structuré',
        category: 'Leverage',
        meta: ['Levier 4x', 'KO 85%', 'Financement 75%'],
        complexity: 3,
        risk: 'High',
        metrics: {
          'Profil de rendement': 'Levier linéaire sur la hausse avec KO',
          'Protection': 'Aucune, perte totale après knock-out',
          'Rendement potentiel': 'Amplifie la performance haussière',
          'Sensibilité volatilité': 'Faible (produit delta one)',
          'Horizon': 'Très court terme'
        },
        annotations: [
          { type: 'barrier', value: 85, label: 'KO 85%' }
        ],
        description: 'Certificat à effet de levier qui réplique 4 fois la performance du sous-jacent jusqu’à un niveau de knock-out fixé à 85 %.',
        bullets: [
          'Effet levier 4x tant que le niveau de KO n’est pas touché.',
          'Perte totale en cas de passage sous 85 % (knock-out).',
          'Idéal pour trader un rebond tactique à court terme.'
        ],
        payoff: (spot) => {
          const ko = 85;
          if (spot <= ko) return clamp(-30);
          return clamp((spot - 100) * 4);
        }
      },
      {
        id: 'turbo-short',
        name: 'Turbo Short 3x',
        typeLabel: 'Structuré',
        category: 'Leverage',
        meta: ['Levier -3x', 'KO 115%', 'Vue baissière'],
        complexity: 3,
        risk: 'High',
        metrics: {
          'Profil de rendement': 'Levier sur la baisse avec barrière désactivante',
          'Protection': 'Aucune, perte totale au-dessus de la barrière',
          'Rendement potentiel': 'Amplifie une correction du marché',
          'Sensibilité volatilité': 'Faible (delta proche de -1)',
          'Horizon': 'Trading court terme'
        },
        annotations: [
          { type: 'barrier', value: 115, label: 'KO 115%' }
        ],
        description: 'Turbo baissier offrant une exposition -3x sur le sous-jacent avec un knock-out positionné à 115 % du niveau initial.',
        bullets: [
          'Profite d’une baisse rapide avec effet levier.',
          'Barrière KO à 115 % : perte totale si franchie.',
          'Convient à des stratégies de couverture ou de trading court terme.'
        ],
        payoff: (spot) => {
          const ko = 115;
          if (spot >= ko) return clamp(-30);
          return clamp((100 - spot) * 3);
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
        id: 'vega-swap',
        name: 'Vega Swap',
        typeLabel: 'Options',
        category: 'Volatilité',
        meta: ['Pure vega', 'OTC', 'Variance strike'],
        complexity: 4,
        risk: 'High',
        metrics: {
          'Profil de rendement': 'Parie sur l’écart entre volatilité implicite et réalisée',
          'Protection': 'Aucune, exposition directionnelle à la variance',
          'Rendement potentiel': 'Proportionnel à la variance réalisée au-delà du strike',
          'Sensibilité volatilité': 'Extrêmement élevée (sigma/variance)',
          'Horizon': '1 à 12 mois'
        },
        annotations: [],
        description: 'Swap de volatilité permettant de recevoir la variance réalisée et de payer un strike fixé, idéal pour jouer une détente ou une poussée de volatilité.',
        bullets: [
          'Position pure sur la volatilité sans exposition delta.',
          'Pertes si la volatilité réalisée reste sous le strike.',
          'Outil privilégié des desks pour couvrir ou exposer un book d’options.'
        ],
        payoff: (spot) => {
          const realizedVariance = Math.min(40, Math.abs(spot - 100) / 2 + 10);
          const strikeVariance = 20;
          return clamp(realizedVariance - strikeVariance);
        }
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
      },
      {
        id: 'risk-reversal',
        name: 'Risk Reversal',
        typeLabel: 'Options',
        category: 'Skew',
        meta: ['Zéro coût', 'Put 90%', 'Call 110%'],
        complexity: 3,
        risk: 'High',
        metrics: {
          'Profil de rendement': 'Position haussière financée par la vente d’une put.',
          'Protection': 'Perte potentiellement forte sous 90 %.',
          'Rendement potentiel': 'Illimité à la hausse.',
          'Sensibilité volatilité': 'Long vega sur la call, short vega sur la put.',
          'Horizon': '1 à 6 mois'
        },
        annotations: [
          { type: 'strike', value: 90, label: 'Put vendue 90' },
          { type: 'strike', value: 110, label: 'Call achetée 110' }
        ],
        description: 'Montage directionnel consistant à vendre une put hors de la monnaie pour financer l’achat d’une call OTM et capter une reprise tout en acceptant l’exposition à la baisse.',
        bullets: [
          'Delta positif financé par la vente d’une put 90 %.',
          'Pas de débours initial si les strikes sont symétriques.',
          'Pertes importantes si le sous-jacent chute sous la put vendue.'
        ],
        payoff: (spot) => {
          const call = Math.max(0, spot - 110);
          const put = Math.max(0, 90 - spot);
          return clamp(call - put);
        }
      },
      {
        id: 'collar',
        name: 'Collar',
        typeLabel: 'Options',
        category: 'Protection',
        meta: ['Floor 95%', 'Cap 110%', 'Coût réduit'],
        complexity: 2,
        risk: 'Low',
        metrics: {
          'Profil de rendement': 'Encadre la performance entre un floor et un cap.',
          'Protection': 'Floor 95 % grâce à la put achetée.',
          'Rendement potentiel': 'Limité au cap 110 % + prime nette.',
          'Sensibilité volatilité': 'Mix long put / short call.',
          'Horizon': '6 à 12 mois'
        },
        annotations: [
          { type: 'floor', value: 95, label: 'Floor 95%' },
          { type: 'cap', value: 110, label: 'Cap 110%' }
        ],
        description: 'Stratégie de couverture combinant achat de put et vente de call pour encadrer la performance d’un portefeuille tout en réduisant le coût de la protection.',
        bullets: [
          'Protège le capital sous 95 % tout en laissant participer à la hausse.',
          'La vente de call finance la put mais plafonne la performance au-dessus de 110 %.',
          'Coût net faible voire nul selon les strikes retenus.'
        ],
        payoff: (spot) => {
          if (spot <= 95) return clamp(-5);
          if (spot >= 110) return clamp(10);
          return clamp(spot - 100);
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
          name: { en: 'Phoenix Memory Autocall', fr: 'Phoenix Autocall Mémoire' },
          reason: {
            en: 'Conditional coupons with early redemption when the market rebounds.',
            fr: 'Coupons conditionnels avec remboursement anticipé si le marché rebondit.'
          }
        },
        {
          name: { en: 'Turbo Long 4x', fr: 'Turbo Long 4x' },
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
          name: { en: 'Turbo Short 3x', fr: 'Turbo Short 3x' },
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
          name: { en: 'Range Accrual Note', fr: 'Range Accrual Note' },
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
      name: {
        en: 'Capital Protection',
        fr: 'Protection du capital'
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
      name: {
        en: 'Autocalls',
        fr: 'Autocalls'
      },
      color: 'rgba(124,58,237,0.4)',
      questions: [
        {
          question: {
            en: 'What is an autocall?',
            fr: 'Qu’est-ce qu’un autocall ?'
          },
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
            fr: 'une volatilité plus forte augmente la probabilité que le sous-jacent ne franchisse pas les barrières d’autocall, ce qui retarde l’autocall. Pour compenser ce risque, le coupon offert à l’investisseur est plus élevé.'
          }
        }
      ]
    },
    {
      id: 'income',
      name: {
        en: 'Income Strategies',
        fr: 'Stratégies de revenu'
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
      name: {
        en: 'Barrier Structures',
        fr: 'Structures à barrière'
      },
      color: 'rgba(234,179,8,0.4)',
      questions: [
        {
          question: {
            en: 'What is a knock-in barrier?',
            fr: 'Qu’est-ce qu’une barrière knock-in ?'
          },
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
            fr: 'Après KO, la position est close, la valeur temps résiduelle s annule.'
          }
        }
      ]
    },
    {
      id: 'leverage',
      name: {
        en: 'Leverage',
        fr: 'Effet de levier'
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
      name: {
        en: 'Vanilla Options',
        fr: 'Options vanilles'
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
            fr: 'Theta mesure l érosion de la valeur temps.'
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
            fr: 'Pour un call, être ITM signifie que le spot est supérieur au strike.'
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
            fr: 'Gamma mesure la variation du delta pour un mouvement de spot.'
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
            fr: 'Être long sur options (straddle) est long vega.'
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
            fr: 'Plus la maturité est longue, plus Vega est élevé.'
          }
        }
      ]
    },
    {
      id: 'volatility',
      name: {
        en: 'Volatility Management',
        fr: 'Gestion de volatilité'
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
            fr: 'Être long calendrier (short vol court terme / long vol long terme) joue l’aplatissement de la courbe de volatilité.'
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
            fr: 'La vente d’un straddle expose à des pertes illimitées.'
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
            fr: 'Un variance swap verse la différence entre variance réalisée et strike.'
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
            fr: 'La couverture de Vega nécessite souvent des options vendues.'
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
      name: {
        en: 'Hedging & Protection',
        fr: 'Couverture & hedging'
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
            fr: 'Un collar combine achat de protected put et de covered call.'
          }
        },
        {
          question: {
            en: 'A client holds European equities and fears a drop in the euro. What could you propose?',
            fr: 'Un client détient un portefeuille d’actions européennes et craint une baisse de l’euro. Que proposer ?'
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
            fr: 'Pour couvrir le risque de change, il peut acheter un forward USD/EUR afin de verrouiller son taux de conversion futur.'
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
            fr: 'Le forward de change neutralise le FX futur.'
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
            fr: 'La vente d’un call convertit la stratégie en collar, réduisant la prime nette.'
          }
        },
        {
          question: {
            en: 'If a delta-neutral portfolio still loses money, what could be the cause?',
            fr: 'Lorsqu’un portefeuille est couvert delta-neutre mais perd quand même de l’argent, que peut-on suspecter ?'
          },
          options: [
            { en: 'Incorrect risk-free rate', fr: 'Un mauvais calcul du taux sans risque' },
            { en: 'Unhedged gamma or vega exposure', fr: 'Un effet de Gamma ou de Vega non couvert' },
            { en: 'Error in the risk premium', fr: 'Une erreur dans la prime de risque' },
            { en: 'Currency mismatch', fr: 'Un problème de taux de change' }
          ],
          correct: 1,
          explanation: {
            en: 'Delta hedging does not protect against gamma (convexity) or vega (volatility) risks.',
            fr: 'Une couverture delta-neutre ne protège pas des variations de Gamma (convexité) ni de Vega (volatilité). Ces risques peuvent expliquer une perte résiduelle.'
          }
        }
      ]
    },
    {
      id: 'income-options',
      name: {
        en: 'Yield Enhancement',
        fr: 'Optimisation de rendement'
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
            fr: 'La vente de call couvre génère un revenu mais plafonne la hausse.'
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
            fr: 'Le coupon est garanti et le nominal est remboursé si la barrière tient.'
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
            fr: 'Un discount équivaut à un covered call, de même un ZCB + short put'
          }
        },
        {
          question: {
            en: 'Why do reverse convertible coupons increase with implied volatility?',
            fr: 'Pourquoi les coupons offerts par un Reverse Convertible augmentent-ils avec la volatilité implicite ?'
          },
          options: [
            { en: 'Because the issuer sells more puts', fr: 'Parce que l’émetteur vend plus d’options put' },
            { en: 'Because the sold option premium is higher when volatility rises', fr: 'Parce que la prime d’option vendue vaut plus cher quand la volatilité augmente' },
            { en: 'Because correlation drops', fr: 'Parce que la corrélation diminue' },
            { en: 'Because rates rise', fr: 'Parce que les taux montent' }
          ],
          correct: 1,
          explanation: {
            en: 'Higher implied volatility increases the value of the short puts in the structure, boosting coupons.',
            fr: 'Une volatilité implicite plus élevée augmente la valeur des puts vendues dans la structure, donc le coupon potentiel. (même raisonnement pourautres paramétres)'
          }
        },
        {
          question: {
            en: 'Which variable makes selling options more attractive?',
            fr: 'Quelle variable rend une vente d’option plus attractive ?'
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
            fr: 'Une volatilité implicite élevée augmente le prix de l’option vendue.'
          }
        }
      ]
    },
    {
      id: 'hybrids',
      name: {
        en: 'Exotic & Hybrid',
        fr: 'Exotiques & hybrides'
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
            fr: 'Les autocalls baskets reposent sur la corrélation entre sous-jacents.'
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
            fr: 'Les options asiatiques sont path-dependent. (Moyenne)'
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
            fr: 'Les cliquets enregistrent des coupons/performances successives.'
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
            fr: 'La corrélation entre actifs peut se dégrader et impacter le payoff.'
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
            fr: 'La variance réalisée est l’actif sous-jacent d’un variance swap.'
          }
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
    dom.navQuiz = document.getElementById('nav-quiz');
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
    if (dom.navQuiz) dom.navQuiz.textContent = t.navQuiz;

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

    dom.recommendationsGrid.innerHTML = recommendationsData
      .map((card) => {
        const title = resolveLocalized(card.title);
        const riskText = resolveLocalized(card.risk);
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
                  const reason = resolveLocalized(item.reason);
                  const strategyName = resolveLocalized(item.name);
                  return `<li><strong>${strategyName}</strong><span>${reason}</span></li>`;
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

    const localizedCategoryName = resolveLocalized(category.name);
    dom.quizCategoryTitle.textContent = localizedCategoryName;
    dom.quizCategoryBadge.textContent = localizedCategoryName;
    dom.quizCategoryBadge.style.backgroundColor = category.color;
    dom.quizProgressCount.textContent = `Question ${quizState.questionIndex + 1} / ${category.questions.length}`;
    dom.quizQuestion.textContent = resolveLocalized(question.question);

    dom.quizOptions.innerHTML = question.options
      .map((option, index) => {
        const optionText = resolveLocalized(option);
        const ariaLabel = optionText.replace(/"/g, '&quot;');
        return `
          <label class="quiz-option">
            <input type="radio" name="quiz-option" value="${index}" aria-label="${ariaLabel}">
            <span>${optionText}</span>
          </label>
        `;
      })
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

    const selectedOption = question.options[selectedIndex];
    const correctOption = question.options[question.correct];
    quizState.history.push({
      categoryName: category.name,
      question: question.question,
      selectedOption,
      selectedIndex,
      correctOption,
      correctIndex: question.correct,
      explanation: question.explanation,
      isCorrect,
      skipped: false
    });

    dom.quizFeedback.classList.remove('hidden');
    dom.quizOptions.querySelectorAll('input').forEach((input) => {
      input.disabled = true;
    });

    const explanationText = resolveLocalized(question.explanation);
    if (isCorrect) {
      dom.quizFeedback.classList.add('success');
      dom.quizFeedback.textContent = `${t.feedbackCorrectPrefix}${explanationText}`;
    } else {
      dom.quizFeedback.classList.add('error');
      const correctAnswerText = resolveLocalized(correctOption);
      dom.quizFeedback.textContent = `${t.feedbackIncorrectPrefix}${t.feedbackIncorrectAnswer}${correctAnswerText}. ${explanationText}`;
    }

    quizState.validated = true;
    dom.quizValidate.textContent = t.quizNext;
    dom.quizSkip.disabled = true;

    updateQuizScoreDisplay();
  }

  function handleQuizSkip() {
    if (!quizState.validated) {
      const { category, question } = getCurrentQuestion();
      quizState.history.push({
        categoryName: category.name,
        question: question.question,
        selectedOption: null,
        selectedIndex: null,
        correctOption: question.options[question.correct],
        correctIndex: question.correct,
        explanation: question.explanation,
        isCorrect: false,
        skipped: true
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
      .map(({ category, correctAnswers, percent }) => {
        const localizedName = resolveLocalized(category.name);
        return `
          <div class="breakdown-card">
            <strong>${localizedName}</strong>
            <p>${correctAnswers} / ${category.questions.length}</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${percent}%; background:${category.color};"></div>
            </div>
          </div>
        `
        ;
      })
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
      .map((item) => {
        const categoryName = resolveLocalized(item.categoryName);
        const questionText = resolveLocalized(item.question);
        const userAnswer = item.skipped ? t.quizSkippedLabel : resolveLocalized(item.selectedOption);
        const correctAnswer = resolveLocalized(item.correctOption);
        const explanationText = resolveLocalized(item.explanation);
        const displayedAnswer = userAnswer || '—';
        return `
          <div class="error-item">
            <strong>${categoryName}</strong>
            <p>${questionText}</p>
            <p><em>${t.userAnswerLabel}</em> ${displayedAnswer}</p>
            <p><em>${t.correctAnswerLabel}</em> ${correctAnswer}</p>
            <p>${explanationText}</p>
          </div>
        `
        ;
      })
      .join('');
  }
})();
