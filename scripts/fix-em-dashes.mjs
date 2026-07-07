/**
 * Remplace les tirets cadratin (—) par une ponctuation naturelle.
 * Usage : node scripts/fix-em-dashes.mjs [--dry-run]
 */
import fs from "fs";
import path from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const ROOT = path.resolve(import.meta.dirname, "..");
const EM_DASH = "\u2014";

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && !full.endsWith("fix-em-dashes.mjs")) {
      const content = fs.readFileSync(full, "utf8");
      if (content.includes(EM_DASH)) acc.push(path.relative(ROOT, full).replace(/\\/g, "/"));
    }
  }
  return acc;
}

const files = walk(ROOT);

const changes = [];

function isCommentLine(line) {
  const t = line.trim();
  return (
    t.startsWith("//") ||
    t.startsWith("*") ||
    t.startsWith("/*") ||
    t.startsWith("*/") ||
    (t.includes("/*") && !t.includes("*/") && t.indexOf("/*") < t.indexOf(EM_DASH))
  );
}

function transformLine(line, filePath) {
  if (!line.includes(EM_DASH)) return line;

  const ext = path.extname(filePath);
  let result = line;
  const comment = isCommentLine(line) || (ext === ".css" && line.includes("/*"));

  if (comment) {
    result = result.replace(/ — /g, " : ").replace(new RegExp(EM_DASH, "g"), ": ");
    return result;
  }

  // Placeholder calculateur (résultat vide)
  if (result.includes('result-primary-value">—<')) {
    result = result.replace('result-primary-value">—<', 'result-primary-value">-<');
  }

  // Cellules de tableau sans valeur
  result = result.replace(/"—"/g, '"-"');
  result = result.replace(/'—'/g, "'-'");

  // Légendes et titres d'illustrations
  const captionPatterns = [
    [/Exemple — /g, "Exemple : "],
    [/exemple — /g, "exemple : "],
    [/Exemple numérique — /g, "Exemple numérique : "],
    [/Cas pratiques — /g, "Cas pratiques : "],
    [/Erreurs fréquentes — /g, "Erreurs fréquentes : "],
    [/Correspondance simplifiée CA3 — /g, "Correspondance simplifiée CA3 : "],
    [/Mois type — /g, "Mois type : "],
    [/Chantier rénovation — /g, "Chantier rénovation : "],
    [/Quel taux appliquer \? — /g, "Quel taux appliquer ? "],
    [/Territoire d'imposition — /g, "Territoire d'imposition : "],
    [/Reversement à l'administration — ou/g, "Reversement à l'administration, ou"],
    [/Annulation — /g, "Annulation : "],
    [/Mission conseil stratégique — /g, "Mission conseil stratégique, "],
    [/Accompagnement stratégique — /g, "Accompagnement stratégique, "],
    [/Illustration à ajouter — /g, "Illustration à ajouter : "],
    [/Seuils de franchise en base de TVA — /g, "Seuils de franchise en base de TVA : "],
    [/Comparatif TVA métropole vs DOM — /g, "Comparatif TVA métropole vs DOM : "],
    [/Flux territorial — /g, "Flux territorial : "],
    [/Flux TVA collectée \/ déductible — /g, "Flux TVA collectée / déductible : "],
    [/Arbre de décision — /g, "Arbre de décision : "],
    [/Facture réaliste — /g, "Facture réaliste : "],
  ];
  for (const [pat, repl] of captionPatterns) {
    result = result.replace(pat, repl);
  }

  // Titres SEO (sous-titre après tiret cadratin)
  result = result.replace(
    /(title: "[^"]+) — ([^"]+")/g,
    "$1 : $2",
  );

  // Listes à puces éditoriales **Label** —
  result = result.replace(/\*\*([^*]+)\*\* — /g, "**$1** : ");

  // Coordonnées facture (nom — SIRET / adresse)
  result = result.replace(
    /([A-Za-zÀ-ÿ0-9 ]+) — (SIRET|TVA FR|10 rue)/g,
    "$1, $2",
  );

  // Mécanique complète — de ... à ... —
  result = result.replace(
    /mécanique complète — (de [^—]+) — avec/g,
    "mécanique complète ($1), avec",
  );

  // formulaire CA3 — auprès
  result = result.replace(/formulaire CA3 — auprès/g, "formulaire CA3, auprès");

  // le formulaire CA3 —
  result = result.replace(/CA3 — auprès/g, "CA3, auprès");

  // déclaration périodique de TVA — le formulaire
  result = result.replace(
    /déclaration périodique de TVA — le formulaire/g,
    "déclaration périodique de TVA (le formulaire",
  );

  // Collecter de la TVA en franchise (art. ...) —
  result = result.replace(/\(art\. [^)]+\) — /g, (m) => m.replace(" — ", ", "));

  // Phrases courantes : suite en minuscule → virgule
  result = result.replace(/ — ([a-zàâäéèêëïîôùûüç«])/g, ", $1");

  // Suite en majuscule ou chiffre → deux-points
  result = result.replace(/ — ([A-Z0-9«])/g, " : $1");

  // Parenthèses fermantes avant tiret
  result = result.replace(/\)( — )/g, ") : ");

  // Reste : deux-points ou tiret simple selon contexte
  result = result.replace(/ — /g, " : ");
  result = result.replace(/—/g, "-");

  return result;
}

let totalBefore = 0;
let totalAfter = 0;

for (const rel of files) {
  const filePath = path.join(ROOT, rel);
  const original = fs.readFileSync(filePath, "utf8");
  const beforeCount = (original.match(new RegExp(EM_DASH, "g")) || []).length;
  if (beforeCount === 0) continue;

  totalBefore += beforeCount;

  const lines = original.split("\n");
  const newLines = lines.map((line) => {
    const next = transformLine(line, rel);
    if (next !== line && changes.length < 80) {
      changes.push({ file: rel, before: line.trim(), after: next.trim() });
    }
    return next;
  });

  const updated = newLines.join("\n");
  const afterCount = (updated.match(new RegExp(EM_DASH, "g")) || []).length;
  totalAfter += afterCount;

  if (!DRY_RUN && updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
  }
}

console.log(JSON.stringify({ totalBefore, totalAfter, files: files.length, changes }, null, 2));
