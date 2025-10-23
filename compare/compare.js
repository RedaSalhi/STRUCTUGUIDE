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
    navCompare: 'Comparison Lab',
    navQuiz: 'Quiz',
    headerTitle: 'Comparison Lab',
    pageTitle: 'Strategy Comparator - Structured Products & Options',
    heroTitle: 'Structured & Options Strategy Comparator',
    heroDescription: 'Compare two strategies instantly, overlay payoffs, benchmark key metrics and discover tailored recommendations.',
    tabComparison: 'Comparison',
    tabRecommendations: 'Recommendations',
    strategy1Title: 'Strategy 1',
    strategy2Title: 'Strategy 2',
    strategy1Type: 'Structured',
    strategy2Type: 'Options',
    detailsButton: 'View details',
    metricLabel: 'Metric',
    chartLoading: 'Loading chart...',
    footerDisclaimer: 'Information provided for educational purposes.',
    footerCopyright: '© 2025 REDA SALHI - Tous droits réservés.',
    modalTitle: 'Strategy details',
    toggleLabel: 'Change language',
    scoreLabelSuffix: ':',
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
    headerTitle: 'Comparaison Lab',
    pageTitle: 'Comparateur Stratégies - Produits Structurés & Options',
    heroTitle: 'Comparateur Stratégies Structurées & Options',
    heroDescription: 'Analysez instantanément deux stratégies, visualisez leurs payoffs, comparez leurs métriques clés et découvrez des recommandations adaptées.',
    tabComparison: 'Comparaison',
    tabRecommendations: 'Recommandations',
    strategy1Title: 'Stratégie 1',
    strategy2Title: 'Stratégie 2',
    strategy1Type: 'Structuré',
    strategy2Type: 'Options',
    detailsButton: 'Voir les détails',
    metricLabel: 'Métrique',
    chartLoading: 'Chargement du graphique...',
    footerDisclaimer: 'Informations fournies à titre pédagogique.',
    footerCopyright: '© 2025 REDA SALHI - Tous droits réservés.',
    modalTitle: 'Détails de la stratégie',
    toggleLabel: 'Changer de langue',
    scoreLabelSuffix: ' :',
    riskLabel: 'Risque',
    underlyingReference: 'Sous-jacent (référence)',
    noDataChip: 'Aucune donnée',
    noDataType: 'N/D'
  }
};

let currentLanguage = 'en';

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


  const dom = {};
  let comparisonChart;
  let lastFocusedTrigger = null;

  document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    buildRecommendations();
    populateSelects();
    setupTabs();
    initChart();
    initComparison();
    initModal();
    updateCurrentYear();
    initializeLanguage();
  });

  function cacheDom() {
    dom.headerTitle = document.getElementById('header-title');
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

    if (dom.headerTitle) dom.headerTitle.textContent = t.headerTitle;
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

    if (dom.footerDisclaimer) dom.footerDisclaimer.textContent = t.footerDisclaimer;
    if (dom.footerCopyright) {
      dom.footerCopyright.innerHTML = t.footerCopyright;
      updateCurrentYear();
    }

    if (dom.modalTitle) dom.modalTitle.textContent = t.modalTitle;

    underlyingReferenceLabel = t.underlyingReference || UI_TRANSLATIONS.en.underlyingReference;

    buildRecommendations();

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
            labels: {
              color: '#e2e8f0'
            }
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const value = items[0]?.parsed?.x;
                return value != null ? `Spot: ${value}%` : '';
              },
              label: (item) => {
                const dataset = item.dataset;
                const yValue = item.parsed.y;
                return `${dataset.label}: ${yValue.toFixed(2)}%`;
              }
            }
          },
          annotation: {
            annotations: {}
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
    if (comparisonChart.options.plugins.annotation) {
      comparisonChart.options.plugins.annotation.annotations = annotations;
    }
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

})();
