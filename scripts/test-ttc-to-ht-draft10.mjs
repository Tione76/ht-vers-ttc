import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(process.cwd());

function requireTsModule(tsFilePath, extraShims = {}) {
  const source = fs.readFileSync(tsFilePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    reportDiagnostics: false,
  }).outputText;

  const module = { exports: {} };
  const script = new vm.Script(output, { filename: tsFilePath });
  const localRequire = (id) => {
    if (extraShims[id]) return extraShims[id];
    if (id.startsWith("@/")) {
      const aliasPath = id.replace("@/", "");
      const resolved = path.join(repoRoot, "src", aliasPath);
      for (const candidate of [`${resolved}.ts`, `${resolved}.tsx`, resolved]) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return requireTsModule(candidate, extraShims);
        }
      }
    }
    if (id.startsWith("./") || id.startsWith("../")) {
      const resolved = path.resolve(path.dirname(tsFilePath), id);
      for (const candidate of [`${resolved}.ts`, `${resolved}.tsx`, resolved]) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return requireTsModule(candidate, extraShims);
        }
      }
    }
    return require(id);
  };
  const context = vm.createContext({
    module,
    exports: module.exports,
    require: localRequire,
    __dirname: path.dirname(tsFilePath),
    __filename: tsFilePath,
    console,
  });
  script.runInContext(context);
  return module.exports;
}

const calc = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-calc.ts"));
const rates = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-rates.ts"));
const htAmounts = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-amounts.ts"));
const htPublish = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-publish.ts"));
const amounts = requireTsModule(path.join(repoRoot, "src/site/ttc-to-ht/ttc-to-ht-amounts.ts"));
const publish = requireTsModule(path.join(repoRoot, "src/site/ttc-to-ht/ttc-to-ht-publish.ts"));
const paths = requireTsModule(path.join(repoRoot, "src/site/ttc-to-ht/ttc-to-ht-paths.ts"), {
  "./ttc-to-ht-amounts": amounts,
  "./ttc-to-ht-publish": publish,
});

const mockLinks = {
  getTtcToHtSiteLinks: () => ({
    mainCalculator: { path: "/", title: "Calculateur HT → TTC", description: "" },
    marginCalculator: { path: "/calculateurs/calculateur-marge-ht-ttc", title: "Marge", description: "" },
    guideTaux: {
      path: "/guides/quels-sont-les-taux-de-tva-en-france",
      slug: "quels-sont-les-taux-de-tva-en-france",
    },
    guideDeductible: {
      path: "/guides/tva-deductible-et-tva-collectee",
      slug: "tva-deductible-et-tva-collectee",
    },
  }),
  TTC_TO_HT_GUIDE_SLUGS: {
    taux: "quels-sont-les-taux-de-tva-en-france",
    deductible: "tva-deductible-et-tva-collectee",
  },
};

const contentMod = requireTsModule(path.join(repoRoot, "src/site/ttc-to-ht/ttc-to-ht-content.ts"), {
  "../ht-to-ttc/ht-to-ttc-calc": calc,
  "../ht-to-ttc/ht-to-ttc-rates": rates,
  "./ttc-to-ht-paths": paths,
  "./ttc-to-ht-site-links": mockLinks,
});

const coversShim = {
  TTC_TO_HT_SERIES_COVER: {
    src: "/images/og/Montants-TTC-en-HT.webp",
    alt: "Vue de dessus d'une calculatrice, d'une loupe, d'un marqueur et de formulaires fiscaux sur un bureau en bois",
    width: 1200,
    height: 800,
    credit: "Photo de Mikhail Nilov via Pexels",
  },
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,
  coverCreditToOgShort: (credit) => {
    const match = /^Photo de (.+) via Pexels$/.exec(credit);
    if (match) return `Photo : ${match[1]} / Pexels`;
    return credit;
  },
};

const ogMod = requireTsModule(path.join(repoRoot, "src/site/ttc-to-ht/ttc-to-ht-og.ts"), {
  "./ttc-to-ht-amounts": amounts,
  "./ttc-to-ht-content": contentMod,
  "@/site/guides/covers": coversShim,
});

// ── Inventaire 1000 montants ──
const all = amounts.getAllTtcToHtAmounts();
assert.equal(all.length, 1000);
assert.equal(amounts.TTC_TO_HT_AMOUNT_COUNT, 1000);
assert.equal(amounts.TTC_TO_HT_STEP, 10);
assert.equal(all[0], 10);
assert.equal(all[1], 20);
assert.equal(all[all.length - 1], 10000);
assert.equal(new Set(all).size, 1000);
for (let i = 1; i < all.length; i += 1) {
  assert.equal(all[i] - all[i - 1], 10);
}

// ── Validation montants ──
assert.equal(amounts.isValidTtcToHtAmount(10), true);
assert.equal(amounts.isValidTtcToHtAmount(10000), true);
assert.equal(amounts.isValidTtcToHtAmount(0), false);
assert.equal(amounts.isValidTtcToHtAmount(1), false);
assert.equal(amounts.isValidTtcToHtAmount(5), false);
assert.equal(amounts.isValidTtcToHtAmount(11), false);
assert.equal(amounts.isValidTtcToHtAmount(15), false);
assert.equal(amounts.isValidTtcToHtAmount(99), false);
assert.equal(amounts.isValidTtcToHtAmount(10001), false);
assert.equal(amounts.isValidTtcToHtAmount(-10), false);

// ── Slugs valides / invalides ──
const validSlugs = [10, 20, 150, 500, 1000, 5000, 10000];
for (const amount of validSlugs) {
  assert.equal(amounts.parseTtcToHtSlug(`${amount}-euros-ttc-en-ht`), amount);
  assert.equal(amounts.ttcToHtSlugFromAmount(amount), `${amount}-euros-ttc-en-ht`);
  assert.equal(paths.ttcToHtPath(amount), `/${amount}-euros-ttc-en-ht`);
}

const invalidSlugs = [
  "0-euros-ttc-en-ht",
  "5-euros-ttc-en-ht",
  "11-euros-ttc-en-ht",
  "15-euros-ttc-en-ht",
  "10001-euros-ttc-en-ht",
  "abc-euros-ttc-en-ht",
  "0150-euros-ttc-en-ht",
  "10-euros-ht-en-ttc",
  "10-euro-ttc-en-ht",
];
for (const slug of invalidSlugs) {
  assert.equal(amounts.parseTtcToHtSlug(slug), null, `invalid ${slug}`);
}

// ── Draft / published (0 published, 1000 drafts) ──
assert.equal(publish.TTC_TO_HT_PUBLISHED.length, 0);
assert.equal(publish.countTtcToHtPublished(), 0);
assert.equal(publish.countTtcToHtDrafts(), 1000);
assert.equal(publish.getPublishedTtcToHtAmounts().length, 0);
assert.equal(publish.getDraftTtcToHtAmounts().length, 1000);
assert.equal(publish.getDraftTtcToHtAmounts()[0], 10);
assert.equal(publish.getDraftTtcToHtAmounts().at(-1), 10000);
assert.equal(publish.isTtcToHtHubPublished(), false);
assert.equal(publish.getTtcToHtHubRobots().index, false);

for (const amount of [10, 150, 500, 1000, 5000, 10000]) {
  assert.equal(publish.getTtcToHtStatus(amount), "draft", `status ${amount}`);
  assert.equal(publish.getTtcToHtPublishRecord(amount), null, `no datePublished ${amount}`);
  const robots = publish.getTtcToHtRobots(amount);
  assert.equal(robots.index, false, `robots index ${amount}`);
  assert.equal(robots.follow, false, `robots follow ${amount}`);
}

assert.equal(publish.TTC_TO_HT_PUBLISH_LOT_SIZE, 50);
const nextLotDefault = publish.getNextTtcToHtPublishLot();
const nextLot50 = publish.getNextTtcToHtPublishLot(50);
assert.deepEqual(nextLotDefault, nextLot50);
assert.equal(nextLot50.length, 50);
assert.equal(nextLot50[0], 10);
assert.equal(nextLot50[49], 500);

// ── Nearby : masqué tant qu'aucun published ──
assert.equal(paths.getNearbyTtcToHtAmounts(10).length, 0);
assert.equal(paths.getNearbyTtcToHtAmounts(5000).length, 0);
assert.equal(paths.getNearbyTtcToHtAmounts(10000).length, 0);

// ── Calculs TTC → HT ──
function assertRate(ttc, ratePct, expectedHt, expectedVat) {
  const result = calc.calculateTtcToHt(ttc, ratePct);
  assert.equal(result.ht, expectedHt, `HT ${ttc} @${ratePct}%`);
  assert.equal(result.vatAmount, expectedVat, `TVA ${ttc} @${ratePct}%`);
}

assertRate(10, 20, 8.33, 1.67);
assertRate(10, 10, 9.09, 0.91);
assertRate(10, 5.5, 9.48, 0.52);
assertRate(10, 2.1, 9.79, 0.21);
assertRate(120, 20, 100, 20);
assertRate(1000, 20, 833.33, 166.67);
assertRate(1200, 20, 1000, 200);
assertRate(10000, 20, 8333.33, 1666.67);

// ── SEO dynamique (plusieurs montants, tous draft) ──
const seoSamples = [10, 150, 1000, 5000, 10000];
for (const amount of seoSamples) {
  const page = contentMod.buildTtcToHtPageContent(amount);
  const amountShort = calc.formatHtEditorial(amount);
  assert.equal(page.title, `Combien font ${amountShort} TTC en HT ?`);
  assert.equal(page.h1, `Conversion de ${amountShort} TTC en HT`);
  assert.equal(
    page.metaDescription,
    `Convertissez ${amountShort} TTC en HT selon les différents taux de TVA : 20 %, 10 %, 5,5 % et 2,1 %. Calcul, tableau et convertisseur TTC/HT.`,
  );
  assert.ok(!page.metaDescription.includes(calc.formatEuro2(page.primary.ht)), `meta leak ${amount}`);
  assert.equal(page.path, `/${amount}-euros-ttc-en-ht`);
  assert.equal(publish.getTtcToHtRobots(amount).index, false);
  assert.equal(publish.getTtcToHtRobots(amount).follow, false);
}

assert.equal(calc.formatHtEditorial(1000), "1 000 €");
assert.equal(calc.formatHtEditorial(5000), "5 000 €");
assert.equal(calc.formatHtEditorial(10000), "10 000 €");

// ── Cover / OG TTC → HT ──
assert.equal(ogMod.TTC_TO_HT_OG_BASE_SRC, "/images/og/Montants-TTC-en-HT-og-base.jpg");
assert.equal(ogMod.TTC_TO_HT_OG_CREDIT_SHORT, "Photo : Mikhail Nilov / Pexels");
assert.ok(fs.existsSync(path.join(repoRoot, "public/images/og/Montants-TTC-en-HT.webp")));
assert.ok(fs.existsSync(path.join(repoRoot, "public/images/og/Montants-TTC-en-HT-og-base.jpg")));

for (const amount of [10, 1000, 10000]) {
  const ogInput = ogMod.ttcToHtOgImageInput(amount);
  assert.equal(ogInput.url, `/og/ttc-en-ht/${amount}-euros-ttc-en-ht`);
  assert.equal(ogInput.type, "image/png");
  const visual = ogMod.getTtcToHtOgVisualData(amount);
  assert.equal(visual.coverSrc, "/images/og/Montants-TTC-en-HT.webp");
  assert.equal(visual.ogBaseSrc, "/images/og/Montants-TTC-en-HT-og-base.jpg");
  assert.equal(visual.credit, "Photo : Mikhail Nilov / Pexels");
  assert.ok(!visual.credit.includes("Pavel"));
  const expected = contentMod.buildTtcToHtPageContent(amount);
  assert.equal(visual.htShort, expected.primary.htShort);
}

// ── Pas de dossiers statiques par montant ──
const appDir = path.join(repoRoot, "src/app");
const seriesDirs = fs
  .readdirSync(appDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d+-euros-ttc-en-ht$/.test(entry.name));
assert.equal(seriesDirs.length, 0, "No static per-amount TTC→HT folders");

// ── Routing / generateStaticParams ──
const slugPage = fs.readFileSync(path.join(repoRoot, "src/app/[slug]/page.tsx"), "utf8");
assert.ok(slugPage.includes("parseTtcToHtSlug"));
assert.ok(slugPage.includes("TtcToHtAmountPage"));
assert.ok(slugPage.includes("getPublishedTtcToHtAmounts"));
assert.ok(slugPage.includes("getTtcToHtRobots"));
assert.ok(fs.existsSync(path.join(repoRoot, "src/app/og/ttc-en-ht/[slug]/route.tsx")));

const ogRouteTxt = fs.readFileSync(
  path.join(repoRoot, "src/app/og/ttc-en-ht/[slug]/route.tsx"),
  "utf8",
);
assert.ok(ogRouteTxt.includes("TTC_TO_HT_OG_BASE_SRC"));
assert.ok(!ogRouteTxt.includes("HT_TO_TTC_OG_BASE_SRC"));

// ── Sitemap / plan du site (0 published → Hub non indexable) ──
const publicPagesMod = requireTsModule(path.join(repoRoot, "src/site/public-pages.ts"), {
  "./guides/registry": { guides: [] },
  "./navigation/calculators-registry": { getAllCalculators: () => [] },
  "./seo/entities": { getAuthorSlugs: () => [], getAuthor: () => undefined },
  "./seo.config": {
    seoConfig: {
      guidesHub: { path: "/guides", title: "Guides" },
      toolsHub: { path: "/nos-outils", title: "Outils" },
      legal: {
        sitemap: { title: "Plan" },
        contact: { title: "Contact" },
        mentions: { title: "Mentions" },
        privacy: { title: "Confidentialité" },
        cookies: { title: "Cookies" },
      },
      extraPages: [],
    },
  },
  "./ht-to-ttc/ht-to-ttc-publish": htPublish,
  "./ht-to-ttc/ht-to-ttc-table-index": {
    getHtToTtcTableIndexMeta: () => ({
      path: "/tableau-conversion-ht-ttc",
      h1: "Tableau HT TTC",
    }),
  },
  "./ttc-to-ht/ttc-to-ht-publish": publish,
});

const allPublic = publicPagesMod.getAllPublicPages();
const ttcHubEntry = allPublic.find((p) => p.path === "/montants-ttc-en-ht");
assert.ok(ttcHubEntry, "TTC hub registered in public-pages");
assert.equal(ttcHubEntry.indexable, false, "TTC hub not indexable with 0 published");
assert.equal(publish.getPublishedTtcToHtPublicPages().length, 0);
assert.ok(!allPublic.some((p) => p.path === "/10-euros-ttc-en-ht"));
assert.ok(!allPublic.some((p) => p.path === "/500-euros-ttc-en-ht"));
assert.ok(!allPublic.some((p) => p.path === "/10000-euros-ttc-en-ht"));

const sitemapPaths = publicPagesMod.getSitemapEntries().map((e) => e.path);
assert.ok(!sitemapPaths.includes("/montants-ttc-en-ht"));
assert.ok(!sitemapPaths.some((p) => p.includes("ttc-en-ht")));

// ── Hub TTC → HT ──
const hubContent = requireTsModule(path.join(repoRoot, "src/site/ttc-to-ht/ttc-to-ht-hub-content.ts"), {
  "../ht-to-ttc/ht-to-ttc-calc": calc,
  "./ttc-to-ht-publish": publish,
  "./ttc-to-ht-site-links": mockLinks,
  "./ttc-to-ht-content": contentMod,
  "@/site/guides/registry": {
    getGuideBySlug: (slug) => {
      const titles = {
        "quels-sont-les-taux-de-tva-en-france": "Les taux de TVA en France",
        "tva-deductible-et-tva-collectee": "TVA déductible et collectée",
        "tva-et-auto-entrepreneur": "TVA et auto-entrepreneur",
      };
      if (!titles[slug]) return undefined;
      return { slug, title: titles[slug], description: `Desc ${slug}` };
    },
  },
});

const hubMeta = publish.getTtcToHtHubMeta();
assert.equal(hubMeta.title, "Liste des montants TTC en HT : toutes les conversions");
assert.equal(hubMeta.h1, "Liste des montants TTC en HT");
assert.equal(
  hubMeta.description,
  "Retrouvez les conversions TTC en HT par montant et accédez aux fiches détaillées selon les taux de TVA de 20 %, 10 %, 5,5 % et 2,1 %.",
);
assert.equal(hubMeta.path, "/montants-ttc-en-ht");
assert.ok(hubMeta.title.length >= 40 && hubMeta.title.length <= 65);
assert.ok(hubMeta.description.length >= 100 && hubMeta.description.length <= 180);

const hubPagePath = path.join(repoRoot, "src/app/montants-ttc-en-ht/page.tsx");
assert.ok(fs.existsSync(hubPagePath));
const hubRouteTxt = fs.readFileSync(hubPagePath, "utf8");
assert.ok(hubRouteTxt.includes("getTtcToHtHubRobots"));
assert.ok(hubRouteTxt.includes("buildFaqPageSchema"));
assert.ok(hubRouteTxt.includes("getTtcToHtHubFaqSchemaItems"));
assert.ok(hubRouteTxt.includes("TTC_TO_HT_SERIES_COVER"));

const hubPageTxt = fs.readFileSync(
  path.join(repoRoot, "src/site/ttc-to-ht/TtcToHtHubPage.tsx"),
  "utf8",
);
assert.ok(hubPageTxt.includes("getPublishedTtcToHtAmounts"));
assert.ok(hubPageTxt.includes("buildTtcToHtHubRanges"));
assert.ok(hubPageTxt.includes("getTtcToHtCommonPublishedAmounts"));
assert.ok(hubPageTxt.includes("ttcToHtPath"));
assert.ok(hubPageTxt.includes("aria-label"));
assert.ok(!hubPageTxt.includes("getDraftTtcToHtAmounts"));
assert.ok(!hubPageTxt.includes("getAllTtcToHtAmounts"));
assert.ok(!hubPageTxt.includes("tableau-conversion-ttc-ht"));
assert.ok(hubPageTxt.includes("Calculer un montant TTC → HT"));

const commonIdx = hubPageTxt.indexOf('id="ht-hub-common-title"');
const findIdx = hubPageTxt.indexOf('id="ht-hub-find-title"');
const ctaIdx = hubPageTxt.indexOf('id="ht-hub-cta-title"');
assert.ok(commonIdx > 0 && findIdx > commonIdx && ctaIdx > findIdx, "section order: common → find → cta");

const hubFaq = hubContent.buildTtcToHtHubFaqItems();
assert.equal(hubFaq.length, 4);
const hubFaqSchema = hubContent.getTtcToHtHubFaqSchemaItems();
assert.equal(hubFaqSchema.length, hubFaq.length);
assert.equal(hubFaqSchema[0].question, hubFaq[0].question);

const diffParagraph = hubContent.getTtcToHtHubDiffParagraph();
assert.ok(diffParagraph.includes("100"));
assert.ok(diffParagraph.includes("120"));

function simulatePublished(count) {
  const list = [];
  for (let amount = 10; amount <= 10 + (count - 1) * 10; amount += 10) list.push(amount);
  return list;
}

function assertNoDraftInRanges(ranges, publishedSet) {
  for (const range of ranges) {
    assert.ok(range.amounts.every((a) => publishedSet.has(a)));
    assert.equal(new Set(range.amounts).size, range.amounts.length);
    for (let i = 1; i < range.amounts.length; i += 1) {
      assert.equal(range.amounts[i] - range.amounts[i - 1], 10);
    }
  }
}

// 0 published
assert.equal(hubContent.buildTtcToHtHubRanges([]).length, 0);
assert.equal(hubContent.getTtcToHtCommonPublishedAmounts(10).length, 0, "common uses live registry");

// 50 published (10→500)
const sim50 = simulatePublished(50);
const ranges50 = hubContent.buildTtcToHtHubRanges(sim50);
assert.equal(ranges50.length, 5);
assert.equal(ranges50[0].min, 10);
assert.equal(ranges50[0].max, 100);
assert.equal(ranges50[4].max, 500);
assert.equal(ranges50.reduce((s, r) => s + r.amounts.length, 0), 50);
assert.ok(!ranges50.some((r) => r.amounts.includes(510)));
assertNoDraftInRanges(ranges50, new Set(sim50));

// common50 via simulation (registry live = 0 published)
const common50Sim = hubContent.TTC_TO_HT_COMMON_AMOUNT_CANDIDATES.filter((a) => sim50.includes(a)).slice(0, 10);
assert.deepEqual(common50Sim.join(","), "10,20,50,100,150,200,250,300,400,500");

// 100 published
const sim100 = simulatePublished(100);
const ranges100 = hubContent.buildTtcToHtHubRanges(sim100);
assert.equal(ranges100.reduce((s, r) => s + r.amounts.length, 0), 100);
assert.ok(!ranges100.some((r) => r.amounts.includes(1010)));
assertNoDraftInRanges(ranges100, new Set(sim100));

// 150 published (bucket 500 € → 3 plages : 10–500, 510–1 000, 1 010–1 500)
const sim150 = simulatePublished(150);
const ranges150 = hubContent.buildTtcToHtHubRanges(sim150);
assert.equal(ranges150.reduce((s, r) => s + r.amounts.length, 0), 150);
assert.equal(ranges150.length, 3);
assert.equal(ranges150[0].max, 500);
assert.equal(ranges150[2].max, 1500);
assertNoDraftInRanges(ranges150, new Set(sim150));

// 500 published (bucket 1 000 € → 5 plages)
const sim500 = simulatePublished(500);
const ranges500 = hubContent.buildTtcToHtHubRanges(sim500);
assert.equal(ranges500.reduce((s, r) => s + r.amounts.length, 0), 500);
assert.equal(ranges500.length, 5);
assertNoDraftInRanges(ranges500, new Set(sim500));

// 1 000 published (bucket 1 000 € → 10 plages)
const sim1000 = simulatePublished(1000);
const ranges1000 = hubContent.buildTtcToHtHubRanges(sim1000);
assert.equal(ranges1000.reduce((s, r) => s + r.amounts.length, 0), 1000);
assert.equal(ranges1000.length, 10);
assertNoDraftInRanges(ranges1000, new Set(sim1000));

// Simulated lot 50 : 510 must never appear
assert.ok(!ranges50.some((r) => r.amounts.includes(510)));

// ── Non-régression HT → TTC (lot 2 publié : 100 fiches) ──
assert.equal(htPublish.countHtToTtcPublished(), 100);
assert.equal(htPublish.countHtToTtcDrafts(), 900);
assert.equal(htPublish.HT_TO_TTC_PUBLISHED.length, 100);
assert.equal(htPublish.getHtToTtcRobots(500).index, true);
assert.equal(htPublish.getHtToTtcRobots(1000).index, true);
assert.equal(htPublish.getHtToTtcRobots(1010).index, false);
assert.equal(all.length, htAmounts.getAllHtToTtcAmounts().length);
assert.notEqual(amounts.TTC_TO_HT_SLUG_SUFFIX, htAmounts.HT_TO_TTC_SLUG_SUFFIX);

const htOgMod = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-og.ts"), {
  "./ht-to-ttc-amounts": htAmounts,
  "./ht-to-ttc-content": requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-content.ts"), {
    "./ht-to-ttc-calc": calc,
    "./ht-to-ttc-rates": rates,
    "./ht-to-ttc-paths": requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-paths.ts")),
    "./ht-to-ttc-site-links": {
      getHtToTtcSiteLinks: mockLinks.getTtcToHtSiteLinks,
      HT_TO_TTC_GUIDE_SLUGS: mockLinks.TTC_TO_HT_GUIDE_SLUGS,
    },
  }),
  "@/site/guides/covers": {
    HT_TO_TTC_SERIES_COVER: {
      src: "/images/og/Montants-HT-en-TTC.webp",
      alt: "HT",
      width: 1200,
      height: 630,
      credit: "Photo de Pavel Danilyuk via Pexels",
    },
    OG_IMAGE_WIDTH: 1200,
    OG_IMAGE_HEIGHT: 630,
  },
});
assert.equal(htOgMod.getHtToTtcOgVisualData(10).coverSrc, "/images/og/Montants-HT-en-TTC.webp");

const htHubMeta = htPublish.getHtToTtcHubMeta();
assert.equal(htHubMeta.title, "Liste des montants HT en TTC : toutes les conversions");

console.log("OK: test-ttc-to-ht-draft10 (1000 drafts, 0 published, hub ready)");
