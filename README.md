# StructuGuide – Contribution Guide

Thanks for helping grow the catalogue. The project is plain HTML + JavaScript, so everything is edited by hand – no build tools or frameworks. This guide walks you through the tasks contributors perform most often, even if you have little or no front‑end background.

---

## 1. Project Layout

| Folder / File | Purpose |
| --- | --- |
| `index.html` | Landing page linking to all sections |
| `structu/structured.html` | Structured products library page |
| `structu/products.js` | All structured product descriptions (EN & FR) |
| `structu/payoff-data.js` & `structu/payoff-chart.js` | Payoff chart definitions and rendering helpers |
| `options/options.html` | Options library |
| `options/optionproducts.js` | Options descriptions (EN & FR) |
| `options/optionsdata.js` & `options/optioncharts.js` | Payoff chart settings and chart utilities |
| `compare/compare.html` | Comparator UI |
| `compare/compare.js` | Comparator data (strategies, recommendations, quiz) |

> 💡 Tip: open the page you’re editing directly in your browser (`File → Open`) to preview changes instantly.

---

## 2. General Contribution Workflow

1. **Create a copy** of the repo (fork or duplicate the folder).
2. **Work on a new branch** if you’re using Git: `git checkout -b feature/my-change`.
3. **Edit the relevant JS file(s)** with your favourite editor.
4. **Refresh the corresponding HTML page** in your browser to check the result.
5. **Commit** when you’re happy, write a clear message, and open a pull request or share the branch.

---

## 3. Structured Products Library (`structu/`)

### 3.1 Adding a new product

1. Open `structu/products.js`.
2. Locate the correct category inside both language blocks (`window.PRODUCTS_DATA.en[...]` and `.fr[...]`).
3. Copy an existing product block and update the fields.

Here is a minimal template – replace the placeholder text and keep the same keys:

```js
{
    name: "Product Name",
    short: "One-sentence elevator pitch.",
    hasPayoff: true,              // false if you do NOT have a math formula
    definition: "Long-form description.",
    characteristics: {
        underlying: "...",
        maturity: "...",
        protection: "...",
        barriers: "...",
        coupon: "...",
        participation: "..."
    },
    payoff: "\\text{Payoff} = ...",      // KaTeX formula, escape backslashes
    replication: "\\text{...}",
    advantages: [ "Bullet 1", "Bullet 2" ],
    risks: [ "Risk 1", "Risk 2" ],
    investorType: "Who should use it?",
    example: {
        title: "Example title",
        parameters: { key: "value", ... },
        scenarios: [ "Scenario 1", "Scenario 2" ]
    }
}
```

4. Repeat the same block in the French section (`window.PRODUCTS_DATA.fr`) with translated text.
5. If the product should display a chart in the modal, add a matching entry to `structu/payoff-data.js`. Use an existing product as reference – you mainly set:
   * `xRange` / `yRange` for the axes,
   * any parameters (`params`) the calculation uses,
   * the `calculate` function (simple JS formula),
   * optional `annotations` and `zones` for highlights.

### 3.2 Removing or editing a product

* Delete the object from both `en` and `fr` sections of `products.js`.
* Remove the corresponding entry from `payoff-data.js` (otherwise charts will try to draw stale data).

---

## 4. Options Library (`options/`)

### 4.1 Adding a new option strategy

1. Open `options/optionproducts.js`.
2. Identify the desired category in both language objects (`OPTION_PRODUCTS.en` and `.fr`).
3. Copy an existing product block and update the details. The structure matches the structured products template (same keys: `name`, `short`, `definition`, etc.).
4. For a payoff chart, add a new configuration to `options/optionsdata.js`. Use a simple formula inside the `calculate` function; the helper outputs payoffs for the chart.

### 4.2 Updating or removing

* Edit the text directly in `optionproducts.js`.
* If you change or remove a product that has a chart, adjust or delete its entry in `options/optionsdata.js`.

---

## 5. Comparator (`compare/`)

Everything is centralised in `compare/compare.js`.

### 5.1 Strategy universe (dropdowns + chart)

* `strategyUniverse.structured` — structured products list.
* `strategyUniverse.options` — options strategies list.

Each strategy needs:

```js
{
  id: 'unique-id',
  name: 'Display Name',
  typeLabel: 'Structuré' or 'Options',
  category: 'Leverage',              // used for styling
  meta: ['Chip 1', 'Chip 2'],
  complexity: 3,                     // 0-5 -> stars in the table
  risk: 'Medium',
  metrics: { 'Profil de rendement': '...', ... },
  annotations: [ { type: 'strike', value: 100, label: '...' } ],
  description: 'Short paragraph for the modal',
  bullets: [ 'Detail 1', 'Detail 2' ],
  payoff: (spot) => {                // chart payoff logic
     // return profit/loss in % (use clamp helper already in file)
  }
}
```

> 🔁 Whenever you add or rename a strategy, search for that name in `compare.js` to update recommendations and translations that reference it.

### 5.2 Recommendations

* Located in `const recommendationsData = [...]`.
* Each card accepts bilingual text. Use strings for monolingual values or `{ en: '...', fr: '...' }` for translated ones (names now support this).

### 5.3 Quiz

* Defined in `const quizCategories = [...]`.
* Every text field is an object `{ en: 'English text', fr: 'Texte français' }`.
* Provide translations for `question`, each `option`, and `explanation`.

### 5.4 Language helper

* Use the existing `resolveLocalized()` helper. If you introduce new text in objects, set them up as `{ en: ..., fr: ... }` so the helper works automatically.

---

## 6. Templates & Quick Copy Blocks

For convenience, keep a small library of ready-to-copy snippets (feel free to extend this list if you add new patterns):

* **Structured product block:** see section 3.1.
* **Comparator strategy stub:**

```js
{
  id: 'example-strategy',
  name: 'Example Strategy',
  typeLabel: 'Structuré',
  category: 'Income',
  meta: ['Meta 1', 'Meta 2'],
  complexity: 2,
  risk: 'Medium',
  metrics: {
    'Profil de rendement': '...',
    'Protection': '...',
    'Rendement potentiel': '...',
    'Sensibilité volatilité': '...',
    'Horizon': '...',
    'Complexité': '...'
  },
  annotations: [],
  description: 'Short description.',
  bullets: ['Point 1', 'Point 2', 'Point 3'],
  payoff: (spot) => clamp(spot - 100)
}
```

* **Quiz question template:**

```js
{
  question: { en: 'Question?', fr: 'Question ?' },
  options: [
    { en: 'Answer A', fr: 'Réponse A' },
    { en: 'Answer B', fr: 'Réponse B' },
    { en: 'Answer C', fr: 'Réponse C' },
    { en: 'Answer D', fr: 'Réponse D' }
  ],
  correct: 1,   // index starting at 0
  explanation: {
    en: 'Why the answer is correct.',
    fr: 'Pourquoi la réponse est correcte.'
  }
}
```

---

## 7. Testing Checklist

Before you submit your changes:

- [ ] Refresh the affected HTML page(s) in the browser and inspect the console for errors.
- [ ] Switch the language toggle (EN/FR) to confirm translations display correctly.
- [ ] For comparator changes, select the new strategies in both dropdowns and ensure the chart renders (no NaN values).
- [ ] Review the structured/options pages to confirm payoffs and charts appear (no missing KaTeX formula).

---

## 8. Asking for Help

If something is unclear:

1. Add a TODO or comment directly in the JS file explaining what blocks you.
2. Tag a maintainer in your pull request or message with a short summary.

Happy structuring! 🎯
