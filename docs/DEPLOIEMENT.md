# 🚀 Déploiement gratuit (Netlify ou Vercel)

Foxling est une PWA 100 % statique (build Vite → `dist/`, chemins relatifs, aucune variable d'environnement, aucune donnée côté serveur : tout reste sur l'appareil de l'enfant). Elle se déploie donc gratuitement en quelques clics.

## Option A — Netlify (recommandé, fichier `netlify.toml` déjà prêt)

1. Sur [app.netlify.com](https://app.netlify.com), « Add new site » → « Import an existing project » → connecte le dépôt GitHub `Askl31/foxling`.
2. Netlify détecte `netlify.toml` : commande `npm run build`, dossier publié `dist`. Laisse les valeurs par défaut.
3. Déploie. L'URL publique est du type `https://foxling-xxxx.netlify.app`.

Ou en CLI :
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist   # après npm run build
```

## Option B — Vercel (fichier `vercel.json` déjà prêt)

1. Sur [vercel.com/new](https://vercel.com/new), importe le dépôt GitHub `Askl31/foxling`.
2. Vercel détecte Vite automatiquement ; `vercel.json` fixe `outputDirectory: dist` + le fallback SPA. Aucune configuration manuelle.
3. Déploie. L'URL est du type `https://foxling-xxxx.vercel.app`.

Ou en CLI :
```bash
npm install -g vercel
vercel login
vercel --prod    # à la racine du projet
```

## Ce qui est configuré automatiquement

- **Fallback SPA** : toutes les routes servent `index.html` (Netlify `[[redirects]]`, Vercel `rewrites`).
- **PWA correcte** : `sw.js` et `manifest.webmanifest` en `no-cache` (les mises à jour sont vues immédiatement), assets hashés en cache immuable 1 an.
- **Chemins relatifs** (`base: './'` dans `vite.config.ts`) : fonctionne aussi bien à la racine qu'en sous-chemin.

## Mise à jour continue

Chaque `git push` sur `main` déclenche un nouveau build automatique sur les deux plateformes (branche de production = `main`). La PWA installée sur les tablettes se met à jour au prochain lancement grâce au `no-cache` du service worker.

## Vérification après déploiement

- Ouvrir l'URL, puis « Ajouter à l'écran d'accueil » sur la tablette → l'app s'installe comme une vraie app.
- Couper le Wi-Fi après le premier chargement → l'app fonctionne encore (offline complet, service worker).
- `Lighthouse` (onglet Application des devtools) → score PWA > 90 attendu.
