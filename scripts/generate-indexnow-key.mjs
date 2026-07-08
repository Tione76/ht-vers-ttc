#!/usr/bin/env node
import { randomBytes } from "node:crypto";

const key = randomBytes(16).toString("hex");

console.log("Clé IndexNow générée :\n");
console.log(key);
console.log("\nÉtapes suivantes :");
console.log("1. Ajoutez la variable d'environnement INDEXNOW_KEY sur Vercel (Production).");
console.log("2. Redéployez le site : le fichier de vérification sera servi à :");
console.log(`   https://<votre-domaine>/${key}.txt`);
console.log("3. Testez l'URL : le contenu doit être exactement la clé, sans retour à la ligne.");
console.log("\nExemple local (.env.local, non versionné) :");
console.log(`INDEXNOW_KEY=${key}`);
