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
      headerTagline: 'Earn XP on structured notes, vanilla and exotic options',
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
      footerDisclaimer: 'Information provided for educational purposes. Past performance is not indicative of future results.',
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
      headerTagline: 'Gagne de l’XP sur les notes structurées, vanilles et options exotiques',
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
      footerDisclaimer: 'Informations fournies à titre pédagogique. Les performances passées ne préjugent pas des performances futures.',
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
      id: 'income-boost',
      name: {
        en: 'Coupon Boosters',
        fr: 'Boosters de coupons'
      },
      badge: {
        en: 'Autocalls & Income',
        fr: 'Autocalls & revenu'
      },
      level: {
        en: 'Level 2 • Yield tactics',
        fr: 'Niveau 2 • Tactiques de rendement'
      },
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
            en: 'Why do high dividends hurt autocall pricing?',
            fr: 'Pourquoi des dividendes élevés pénalisent-ils le pricing d’un autocall ?'
          },
          options: [
            { en: 'They increase forward prices', fr: 'Ils augmentent les forwards' },
            { en: 'They require higher coupons to compensate the short forward', fr: 'Ils exigent un coupon plus élevé pour compenser le short forward' },
            { en: 'They reduce implied volatility', fr: 'Ils réduisent la volatilité implicite' },
            { en: 'They trigger early redemption automatically', fr: 'Ils déclenchent un remboursement automatique' }
          ],
          correct: 1,
          explanation: {
            en: 'Foregone dividends are priced via the short forward component, demanding higher coupons.',
            fr: 'Les dividendes perdus via le short forward exigent des coupons plus élevés pour compenser.'
          }
        },
        {
          question: {
            en: 'Which market regime favours selling downside risk for yield?',
            fr: 'Quel régime de marché favorise la vente de risque de baisse pour générer du rendement ?'
          },
          options: [
            { en: 'Range-bound with elevated volatility', fr: 'Marché en range avec volatilité élevée' },
            { en: 'Steep bull market', fr: 'Marché haussier fort' },
            { en: 'Crash in progress', fr: 'Krach en cours' },
            { en: 'Ultra-low volatility grind', fr: 'Volatilité ultra faible' }
          ],
          correct: 0,
          explanation: {
            en: 'Rich option premiums in a range deliver attractive coupons if barriers hold.',
            fr: 'Des primes élevées en range offrent de bons coupons tant que les barrières tiennent.'
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
    }
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
