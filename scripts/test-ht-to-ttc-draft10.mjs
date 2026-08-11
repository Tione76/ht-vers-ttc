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
    if (id.startsWith("./") || id.startsWith("../")) {
      const resolved = path.resolve(path.dirname(tsFilePath), id);
      const candidates = [`${resolved}.ts`, `${resolved}.tsx`, resolved];
      for (const candidate of candidates) {
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
const amounts = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-amounts.ts"));
const publish = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-publish.ts"));
const paths = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-paths.ts"));
const rates = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-rates.ts"));

const mockLinks = {
  getHtToTtcSiteLinks: () => ({
    mainCalculator: { path: "/", title: "Calculateur HT → TTC", description: "" },
    marginCalculator: {
      path: "/calculateurs/calculateur-marge-ht-ttc",
      title: "Calculateur de marge HT / TTC",
      description: "",
    },
    guideTaux: {
      path: "/guides/quels-sont-les-taux-de-tva-en-france",
      slug: "quels-sont-les-taux-de-tva-en-france",
    },
    guideDeductible: {
      path: "/guides/tva-deductible-et-tva-collectee",
      slug: "tva-deductible-et-tva-collectee",
    },
  }),
  HT_TO_TTC_GUIDE_SLUGS: {
    taux: "quels-sont-les-taux-de-tva-en-france",
    deductible: "tva-deductible-et-tva-collectee",
  },
};

const contentMod = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-content.ts"), {
  "./ht-to-ttc-calc": calc,
  "./ht-to-ttc-rates": rates,
  "./ht-to-ttc-paths": paths,
  "./ht-to-ttc-site-links": mockLinks,
});

// ── Inventaire 1000 montants ──
const all = amounts.getAllHtToTtcAmounts();
assert.equal(all.length, 1000);
assert.equal(amounts.HT_TO_TTC_AMOUNT_COUNT, 1000);
assert.equal(all[0], 10);
assert.equal(all[all.length - 1], 10000);
assert.equal(new Set(all).size, 1000);
for (let i = 1; i < all.length; i += 1) {
  assert.equal(all[i] - all[i - 1], 10);
}

// ── Validation ──
assert.equal(amounts.isValidHtToTtcAmount(10), true);
assert.equal(amounts.isValidHtToTtcAmount(10000), true);
assert.equal(amounts.isValidHtToTtcAmount(0), false);
assert.equal(amounts.isValidHtToTtcAmount(5), false);
assert.equal(amounts.isValidHtToTtcAmount(11), false);
assert.equal(amounts.isValidHtToTtcAmount(15), false);
assert.equal(amounts.isValidHtToTtcAmount(10001), false);
assert.equal(amounts.isValidHtToTtcAmount(-10), false);

assert.equal(amounts.parseHtToTtcSlug("10-euros-ht-en-ttc"), 10);
assert.equal(amounts.parseHtToTtcSlug("1000-euros-ht-en-ttc"), 1000);
assert.equal(amounts.parseHtToTtcSlug("10000-euros-ht-en-ttc"), 10000);
assert.equal(amounts.parseHtToTtcSlug("11-euros-ht-en-ttc"), null);
assert.equal(amounts.parseHtToTtcSlug("0150-euros-ht-en-ttc"), null);
assert.equal(amounts.parseHtToTtcSlug("abc"), null);
assert.equal(amounts.parseHtToTtcSlug("10-euro-ht-en-ttc"), null);

// ── Draft / published (lot 1 : 10 → 500) ──
const expectedLotCount =
  Math.floor(
    (publish.HT_TO_TTC_FIRST_LOT_MAX - publish.HT_TO_TTC_FIRST_LOT_MIN) / amounts.HT_TO_TTC_STEP
  ) + 1;
assert.equal(expectedLotCount, 50, "first lot must be exactly 50 amounts");
assert.equal(publish.countHtToTtcPublished(), 50);
assert.equal(publish.countHtToTtcDrafts(), 950);
assert.equal(publish.HT_TO_TTC_PUBLISHED.length, 50);
assert.equal(publish.getPublishedHtToTtcAmounts().length, 50);
assert.equal(publish.getPublishedHtToTtcAmounts()[0], 10);
assert.equal(publish.getPublishedHtToTtcAmounts()[49], 500);
assert.equal(publish.getDraftHtToTtcAmounts()[0], 510);
assert.equal(publish.getDraftHtToTtcAmounts().at(-1), 10000);

for (let i = 1; i < publish.HT_TO_TTC_PUBLISHED.length; i += 1) {
  const prev = publish.HT_TO_TTC_PUBLISHED[i - 1];
  const curr = publish.HT_TO_TTC_PUBLISHED[i];
  assert.equal(curr.amount - prev.amount, 10, `no hole around ${curr.amount}`);
  assert.equal(curr.datePublished, "2026-08-11");
}
assert.equal(publish.HT_TO_TTC_PUBLISHED[0].datePublished, "2026-08-11");

assert.equal(publish.isHtToTtcHubPublished(), true);
assert.equal(publish.getHtToTtcRobots(10).index, true);
assert.equal(publish.getHtToTtcRobots(10).follow, true);
assert.equal(publish.getHtToTtcRobots(500).index, true);
assert.equal(publish.getHtToTtcRobots(510).index, false);
assert.equal(publish.getHtToTtcRobots(510).follow, false);
assert.equal(publish.getHtToTtcRobots(1000).index, false);
assert.equal(publish.getHtToTtcRobots(10000).index, false);
assert.equal(publish.getHtToTtcHubRobots().index, true);
assert.equal(publish.getHtToTtcHubRobots().follow, true);

assert.equal(publish.getHtToTtcStatus(500), "published");
assert.equal(publish.getHtToTtcStatus(510), "draft");
assert.equal(publish.getHtToTtcPublishRecord(500)?.datePublished, "2026-08-11");
assert.equal(publish.getHtToTtcPublishRecord(510), null);

const nearby100 = paths.getNearbyHtToTtcAmounts(100);
assert.ok(nearby100.length >= 4 && nearby100.length <= 6);
assert.ok(nearby100.every((v) => publish.isHtToTtcPublished(v)));
assert.ok(!nearby100.includes(100));
assert.deepEqual(
  nearby100.slice().sort((a, b) => Math.abs(a - 100) - Math.abs(b - 100) || a - b),
  nearby100
);

const nearby500 = paths.getNearbyHtToTtcAmounts(500);
assert.ok(nearby500.length >= 4 && nearby500.length <= 6);
assert.ok(nearby500.every((v) => v <= 500 && publish.isHtToTtcPublished(v)));
assert.ok(!nearby500.includes(510));
assert.ok(!nearby500.includes(520));

const nearby510 = paths.getNearbyHtToTtcAmounts(510);
assert.ok(nearby510.every((v) => publish.isHtToTtcPublished(v)));
assert.ok(!nearby510.includes(510));
assert.ok(!nearby510.includes(520));

assert.equal(publish.HT_TO_TTC_PUBLISH_LOT_SIZE, 50);
const nextLotDefault = publish.getNextHtToTtcPublishLot();
const nextLot50 = publish.getNextHtToTtcPublishLot(50);
assert.deepEqual(nextLotDefault, nextLot50);
assert.equal(nextLotDefault.length, 50);
assert.equal(nextLotDefault[0], 510);
assert.equal(nextLotDefault[49], 1000);

// ── Calculs + SEO pour montants clés ──
const samples = [
  { amount: 10, ttc20: 12, vat20: 2, ttc10: 11, ttc55: 10.55, ttc21: 10.21 },
  { amount: 20, ttc20: 24, vat20: 4, ttc10: 22, ttc55: 21.1, ttc21: 20.42 },
  { amount: 150, ttc20: 180, vat20: 30, ttc10: 165, ttc55: 158.25, ttc21: 153.15 },
  { amount: 300, ttc20: 360, vat20: 60, ttc10: 330, ttc55: 316.5, ttc21: 306.3 },
  { amount: 1000, ttc20: 1200, vat20: 200, ttc10: 1100, ttc55: 1055, ttc21: 1021 },
  { amount: 5000, ttc20: 6000, vat20: 1000, ttc10: 5500, ttc55: 5275, ttc21: 5105 },
  { amount: 9990, ttc20: 11988, vat20: 1998, ttc10: 10989, ttc55: 10539.45, ttc21: 10199.79 },
  { amount: 10000, ttc20: 12000, vat20: 2000, ttc10: 11000, ttc55: 10550, ttc21: 10210 },
];

for (const row of samples) {
  const c20 = calc.calculateHtToTtc(row.amount, 20);
  const c10 = calc.calculateHtToTtc(row.amount, 10);
  const c55 = calc.calculateHtToTtc(row.amount, 5.5);
  const c21 = calc.calculateHtToTtc(row.amount, 2.1);
  assert.equal(c20.ttc, row.ttc20, `ttc20 ${row.amount}`);
  assert.equal(c20.vatAmount, row.vat20, `vat20 ${row.amount}`);
  assert.equal(c10.ttc, row.ttc10, `ttc10 ${row.amount}`);
  assert.equal(c55.ttc, row.ttc55, `ttc55 ${row.amount}`);
  assert.equal(c21.ttc, row.ttc21, `ttc21 ${row.amount}`);

  const page = contentMod.buildHtToTtcPageContent(row.amount);
  const amountShort = calc.formatHtEditorial(row.amount);
  assert.equal(page.title, `Combien font ${amountShort} HT en TTC ?`);
  assert.equal(page.h1, `Conversion de ${amountShort} HT en TTC`);
  assert.equal(
    page.metaDescription,
    `Convertissez ${amountShort} HT en TTC selon les différents taux de TVA : 20 %, 10 %, 5,5 % et 2,1 %. Calcul, tableau et convertisseur HT/TTC.`
  );
  assert.ok(!page.metaDescription.includes(`${row.ttc20}`), "meta must not leak TTC");
  assert.equal(page.path, `/${row.amount}-euros-ht-en-ttc`);
  assert.equal(paths.htToTtcPath(row.amount), `/${row.amount}-euros-ht-en-ttc`);
  const expectedStatus = row.amount <= 500 ? "published" : "draft";
  assert.equal(publish.getHtToTtcStatus(row.amount), expectedStatus);
}

assert.equal(calc.formatHtEditorial(1000), "1 000 €");
assert.equal(calc.formatHtEditorial(5000), "5 000 €");
assert.equal(calc.formatHtEditorial(10000), "10 000 €");
assert.equal(paths.htToTtcPath(1000), "/1000-euros-ht-en-ttc");
assert.equal(paths.htToTtcPath(10000), "/10000-euros-ht-en-ttc");

// ── Échantillons published / draft ──
const sampleStatuses = [
  { amount: 10, status: "published" },
  { amount: 50, status: "published" },
  { amount: 100, status: "published" },
  { amount: 250, status: "published" },
  { amount: 490, status: "published" },
  { amount: 500, status: "published" },
  { amount: 510, status: "draft" },
  { amount: 1000, status: "draft" },
  { amount: 10000, status: "draft" },
];
for (const row of sampleStatuses) {
  assert.equal(publish.getHtToTtcStatus(row.amount), row.status, `status ${row.amount}`);
  const robots = publish.getHtToTtcRobots(row.amount);
  const expectIndex = row.status === "published";
  assert.equal(robots.index, expectIndex);
  assert.equal(robots.follow, expectIndex);
  if (expectIndex) {
    assert.equal(publish.getHtToTtcPublishRecord(row.amount)?.datePublished, "2026-08-11");
  } else {
    assert.equal(publish.getHtToTtcPublishRecord(row.amount), null);
  }
}

// ── Sitemap / Hub : published only ──
const seriesPublic = publish.getPublishedHtToTtcPublicPages();
assert.equal(seriesPublic.length, 50);
assert.ok(seriesPublic.every((page) => page.indexable));
assert.ok(seriesPublic.some((page) => page.path === "/10-euros-ht-en-ttc"));
assert.ok(seriesPublic.some((page) => page.path === "/500-euros-ht-en-ttc"));
assert.ok(!seriesPublic.some((page) => page.path === "/510-euros-ht-en-ttc"));
assert.ok(!seriesPublic.some((page) => page.path === "/1000-euros-ht-en-ttc"));
assert.ok(!seriesPublic.some((page) => page.path === "/10000-euros-ht-en-ttc"));

const publicPagesTxt = fs.readFileSync(path.join(repoRoot, "src/site/public-pages.ts"), "utf8");
assert.ok(publicPagesTxt.includes("getPublishedHtToTtcPublicPages"));
assert.ok(publicPagesTxt.includes("isHtToTtcHubPublished"));
assert.ok(!publicPagesTxt.includes('path: "/10-euros-ht-en-ttc"'));
assert.ok(!publicPagesTxt.includes('path: "/510-euros-ht-en-ttc"'));

const slugPageTxt = fs.readFileSync(path.join(repoRoot, "src/app/[slug]/page.tsx"), "utf8");
assert.ok(slugPageTxt.includes("parseHtToTtcSlug"));
assert.ok(slugPageTxt.includes("HtToTtcAmountPage"));
assert.ok(slugPageTxt.includes("getHtToTtcRobots"));

const hubPagePath = path.join(repoRoot, "src/app/montants-ht-en-ttc/page.tsx");
assert.ok(fs.existsSync(hubPagePath));
const hubRouteTxt = fs.readFileSync(hubPagePath, "utf8");
assert.ok(hubRouteTxt.includes("getHtToTtcHubRobots"));
assert.ok(hubRouteTxt.includes("buildFaqPageSchema"));
assert.ok(hubRouteTxt.includes("getHtToTtcHubFaqSchemaItems"));

const hubPageTxt = fs.readFileSync(
  path.join(repoRoot, "src/site/ht-to-ttc/HtToTtcHubPage.tsx"),
  "utf8"
);
assert.ok(hubPageTxt.includes("getPublishedHtToTtcAmounts"));
assert.ok(hubPageTxt.includes("buildHtToTtcHubRanges"));
assert.ok(hubPageTxt.includes("getHtToTtcCommonPublishedAmounts"));
assert.ok(hubPageTxt.includes("htToTtcPath"));
assert.ok(hubPageTxt.includes("aria-label"));
assert.ok(!hubPageTxt.includes("getDraftHtToTtcAmounts"));
assert.ok(!hubPageTxt.includes("getAllHtToTtcAmounts"));
assert.ok(hubPageTxt.includes('href="/tableau-conversion-ht-ttc"'));
assert.ok(hubPageTxt.includes("Voir le tableau de conversion HT en TTC"));
assert.ok(!hubPageTxt.includes("HUB_RANGES"));

const hubContent = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-hub-content.ts"), {
  "./ht-to-ttc-calc": calc,
  "./ht-to-ttc-publish": publish,
  "./ht-to-ttc-site-links": mockLinks,
  "./ht-to-ttc-content": contentMod,
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

const hubMeta = publish.getHtToTtcHubMeta();
assert.equal(hubMeta.title, "Liste des montants HT en TTC : toutes les conversions");
assert.equal(hubMeta.h1, "Liste des montants HT en TTC");
assert.equal(
  hubMeta.description,
  "Retrouvez les conversions HT en TTC par montant et accédez aux fiches détaillées selon les taux de TVA de 20 %, 10 %, 5,5 % et 2,1 %."
);
assert.equal(hubMeta.path, "/montants-ht-en-ttc");
assert.ok(hubPageTxt.includes("Accédez directement à une sélection de montants courants."));
assert.ok(!hubPageTxt.includes("les plus souvent convertis"));
const commonIdx = hubPageTxt.indexOf('id="ht-hub-common-title"');
const findIdx = hubPageTxt.indexOf('id="ht-hub-find-title"');
const ctaIdx = hubPageTxt.indexOf('id="ht-hub-cta-title"');
assert.ok(commonIdx > 0 && findIdx > commonIdx && ctaIdx > findIdx, "section order: common → find → cta");

const ranges = hubContent.buildHtToTtcHubRanges(publish.getPublishedHtToTtcAmounts());
assert.equal(ranges.length, 5);
assert.equal(ranges[0].min, 10);
assert.equal(ranges[0].max, 100);
assert.equal(ranges[0].amounts.length, 10);
assert.equal(ranges[4].min, 410);
assert.equal(ranges[4].max, 500);
assert.ok(ranges.every((range) => range.amounts.every((amount) => publish.isHtToTtcPublished(amount))));
assert.ok(!ranges.some((range) => range.amounts.includes(510)));

const common = hubContent.getHtToTtcCommonPublishedAmounts(10);
assert.ok(common.length >= 6 && common.length <= 10);
assert.equal(common.join(","), "10,20,50,100,150,200,250,300,400,500");
assert.ok(common.every((amount) => publish.isHtToTtcPublished(amount)));
assert.ok(!common.includes(510));
assert.ok(!common.includes(1000));

const hubFaq = hubContent.buildHtToTtcHubFaqItems();
assert.ok(hubFaq.length >= 3 && hubFaq.length <= 5);
const hubFaqSchema = hubContent.getHtToTtcHubFaqSchemaItems();
assert.equal(hubFaqSchema.length, hubFaq.length);
assert.equal(hubFaqSchema[0].question, hubFaq[0].question);

const future1000 = [];
for (let amount = 10; amount <= 10000; amount += 10) future1000.push(amount);
const futureRanges = hubContent.buildHtToTtcHubRanges(future1000);
assert.ok(futureRanges.length >= 8 && futureRanges.length <= 20);
assert.equal(
  futureRanges.reduce((sum, range) => sum + range.amounts.length, 0),
  1000
);

assert.ok(!fs.existsSync(path.join(repoRoot, "src/app/10-euros-ht-en-ttc/page.tsx")));

const seriesDirs = fs
  .readdirSync(path.join(repoRoot, "src/app"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d+-euros-ht-en-ttc$/.test(d.name));
assert.equal(seriesDirs.length, 0, "No static per-amount folders should remain");

// ── Photo série + OG dynamique ──
const covers = requireTsModule(path.join(repoRoot, "src/site/guides/covers.ts"));
const ogMod = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-og.ts"), {
  "@/site/guides/covers": covers,
  "./ht-to-ttc-amounts": amounts,
  "./ht-to-ttc-content": contentMod,
});

const coverFile = path.join(repoRoot, "public/images/og/Montants-HT-en-TTC.webp");
assert.ok(fs.existsSync(coverFile), "series WebP must exist");
const ogBaseFile = path.join(repoRoot, "public/images/og/Montants-HT-en-TTC-og-base.jpg");
assert.ok(fs.existsSync(ogBaseFile), "OG JPEG base derived from WebP must exist");
assert.equal(covers.HT_TO_TTC_SERIES_COVER.src, "/images/og/Montants-HT-en-TTC.webp");
assert.equal(ogMod.HT_TO_TTC_OG_BASE_SRC, "/images/og/Montants-HT-en-TTC-og-base.jpg");
assert.equal(covers.HT_TO_TTC_SERIES_COVER.credit, "Photo de Pavel Danilyuk via Pexels");
assert.ok(
  covers.HT_TO_TTC_SERIES_COVER.alt.includes("calculatrice"),
  "alt must describe the real photo"
);
assert.ok(!covers.HT_TO_TTC_SERIES_COVER.alt.includes("Pavel"), "credit must not be in alt");
assert.ok(!covers.HT_TO_TTC_SERIES_COVER.alt.includes("10 €"), "alt must be amount-agnostic");

const schemaImg = covers.coverToSchemaImage(covers.HT_TO_TTC_SERIES_COVER);
assert.equal(schemaImg.creditText, "Photo de Pavel Danilyuk via Pexels");
assert.equal(schemaImg.caption, covers.HT_TO_TTC_SERIES_COVER.alt);

const amountPageTxt = fs.readFileSync(
  path.join(repoRoot, "src/site/ht-to-ttc/HtToTtcAmountPage.tsx"),
  "utf8"
);
assert.ok(amountPageTxt.includes("GuideHeroImage"));
assert.ok(amountPageTxt.includes("HT_TO_TTC_SERIES_COVER"));
assert.ok(amountPageTxt.includes("coverToSchemaImage"));
const miniIdx = amountPageTxt.indexOf("<MiniHtToTtcCalculator");
const photoIdx = amountPageTxt.indexOf("<GuideHeroImage");
const editorialIdx = amountPageTxt.indexOf('id="ht-to-ttc-h2-20"');
assert.ok(miniIdx > 0 && photoIdx > miniIdx && editorialIdx > photoIdx, "photo after mini-calc");

assert.ok(slugPageTxt.includes("htToTtcOgImageInput"));
assert.ok(fs.existsSync(path.join(repoRoot, "src/app/og/ht-en-ttc/[slug]/route.tsx")));

const ogSamples = [
  { amount: 10, ht: "10 €", ttc: "12 €" },
  { amount: 150, ht: "150 €", ttc: "180 €" },
  { amount: 1000, ht: "1 000 €", ttc: "1 200 €" },
  { amount: 5000, ht: "5 000 €", ttc: "6 000 €" },
  { amount: 10000, ht: "10 000 €", ttc: "12 000 €" },
];

for (const row of ogSamples) {
  const visual = ogMod.getHtToTtcOgVisualData(row.amount);
  assert.equal(visual.amountShort, row.ht, `OG HT ${row.amount}`);
  assert.equal(visual.ttcShort, row.ttc, `OG TTC ${row.amount}`);
  assert.equal(visual.vatBadge, "TVA 20 %");
  assert.equal(visual.coverSrc, covers.HT_TO_TTC_SERIES_COVER.src);
  assert.equal(visual.credit, "Photo : Pavel Danilyuk / Pexels");

  const ogInput = ogMod.htToTtcOgImageInput(row.amount);
  assert.equal(ogInput.url, `/og/ht-en-ttc/${row.amount}-euros-ht-en-ttc`);
  assert.equal(ogInput.width, 1200);
  assert.equal(ogInput.height, 630);
  assert.equal(ogInput.type, "image/png");
  assert.ok(ogInput.alt.includes(row.ht));
  assert.ok(ogInput.alt.includes(row.ttc));

  const page = contentMod.buildHtToTtcPageContent(row.amount);
  assert.equal(page.title, `Combien font ${row.ht} HT en TTC ?`);
  assert.ok(!ogInput.alt.includes("10 €") || row.amount === 10, "no hardcoded 10€ leak");
}

assert.equal(ogMod.htToTtcOgImagePath(11), "/og/ht-en-ttc/11-euros-ht-en-ttc");
assert.equal(amounts.parseHtToTtcSlug("11-euros-ht-en-ttc"), null);
assert.equal(amounts.parseHtToTtcSlug("5-euros-ht-en-ttc"), null);
assert.equal(amounts.parseHtToTtcSlug("10001-euros-ht-en-ttc"), null);

// ── Tableau Index /tableau-conversion-ht-ttc ──
const tableIndex = requireTsModule(path.join(repoRoot, "src/site/ht-to-ttc/ht-to-ttc-table-index.ts"), {
  "./ht-to-ttc-calc": calc,
  "./ht-to-ttc-paths": paths,
  "./ht-to-ttc-publish": publish,
  "./ht-to-ttc-rates": rates,
  "./ht-to-ttc-content": contentMod,
  "./ht-to-ttc-site-links": mockLinks,
  "./ht-to-ttc-amounts": amounts,
});

const tableMeta = tableIndex.getHtToTtcTableIndexMeta();
assert.equal(tableMeta.path, "/tableau-conversion-ht-ttc");
assert.equal(tableMeta.title, "Tableau de conversion HT en TTC : tous les montants");
assert.equal(tableMeta.h1, "Tableau de conversion HT en TTC");
assert.ok(tableMeta.description.includes("tableau de conversion HT en TTC"));
assert.ok(tableMeta.title.length <= 65);

const view = tableIndex.getHtToTtcTableIndexView();
assert.equal(view.rows.length, 50);
assert.equal(view.truncated, false);
assert.ok(view.rows.every((row) => row.isPublished));
assert.ok(view.rows.some((row) => row.amountHt === 500));
assert.ok(!view.rows.some((row) => row.amountHt === 510));
assert.ok(view.rows.every((row) => row.path === `/${row.amountHt}-euros-ht-en-ttc`));

const row10 = view.rows.find((row) => row.amountHt === 10);
const row100 = view.rows.find((row) => row.amountHt === 100);
const row150 = view.rows.find((row) => row.amountHt === 150);
const row500 = view.rows.find((row) => row.amountHt === 500);
assert.equal(row10.ttc20, calc.formatEuro2(12));
assert.equal(row10.ttc10, calc.formatEuro2(11));
assert.equal(row10.ttc55, calc.formatEuro2(10.55));
assert.equal(row10.ttc21, calc.formatEuro2(10.21));
assert.equal(row100.ttc20, calc.formatEuro2(120));
assert.equal(row100.ttc10, calc.formatEuro2(110));
assert.equal(row100.ttc55, calc.formatEuro2(105.5));
assert.equal(row100.ttc21, calc.formatEuro2(102.1));
assert.equal(row150.ttc20, calc.formatEuro2(180));
assert.equal(row150.ttc10, calc.formatEuro2(165));
assert.equal(row150.ttc55, calc.formatEuro2(158.25));
assert.equal(row150.ttc21, calc.formatEuro2(153.15));
assert.equal(row500.ttc20, calc.formatEuro2(600));
assert.equal(row500.ttc10, calc.formatEuro2(550));
assert.equal(row500.ttc55, calc.formatEuro2(527.5));
assert.equal(row500.ttc21, calc.formatEuro2(510.5));

for (const size of [100, 500, 1000, 5000, 10000]) {
  const scale = Array.from({ length: size }, (_, i) => i + 1);
  const scaled = tableIndex.getHtToTtcTableIndexView(scale);
  assert.ok(scaled.rows.length <= tableIndex.HT_TO_TTC_TABLE_INDEX_MAX_ROWS, `cap @${size}`);
  assert.equal(new Set(scaled.rows.map((r) => r.amountHt)).size, scaled.rows.length, `uniq @${size}`);
  for (let i = 1; i < scaled.rows.length; i += 1) {
    assert.ok(scaled.rows[i].amountHt > scaled.rows[i - 1].amountHt, `sorted @${size}`);
  }
  const covered = new Set(scaled.ranges.flatMap((r) => r.amounts));
  assert.equal(covered.size, size, `no loss in ranges @${size}`);
  if (size > tableIndex.HT_TO_TTC_TABLE_INDEX_MAX_ROWS) {
    assert.equal(scaled.truncated, true, `truncated @${size}`);
    assert.ok(scaled.deferredRanges.length > 0, `deferred @${size}`);
  }
}

const scale1 = Array.from({ length: 10000 }, (_, i) => i + 1);
const bigView = tableIndex.getHtToTtcTableIndexView(scale1);
assert.ok(bigView.truncated);
assert.ok(bigView.rows.length <= tableIndex.HT_TO_TTC_TABLE_INDEX_MAX_ROWS);
assert.ok(bigView.deferredRanges.length > 0);
assert.equal(
  bigView.displayedRanges.reduce((sum, range) => sum + range.amounts.length, 0),
  bigView.rows.length
);
assert.equal(tableIndex.htToTtcTableRangePath(101, 200), "/tableau-conversion-ht-ttc/101-a-200");
assert.ok(!fs.existsSync(path.join(repoRoot, "src/app/tableau-conversion-ht-ttc/101-a-200")));

const tableRoute = path.join(repoRoot, "src/app/tableau-conversion-ht-ttc/page.tsx");
assert.ok(fs.existsSync(tableRoute));
const tableRouteTxt = fs.readFileSync(tableRoute, "utf8");
assert.ok(tableRouteTxt.includes("buildFaqPageSchema"));
assert.ok(tableRouteTxt.includes("coverToOgInput"));
assert.ok(tableRouteTxt.includes("index: true"));

const publicPagesTxt2 = fs.readFileSync(path.join(repoRoot, "src/site/public-pages.ts"), "utf8");
assert.ok(publicPagesTxt2.includes("getHtToTtcTableIndexMeta"));

console.log("OK: test-ht-to-ttc-draft10 (hub + table index + series photo/OG)");
