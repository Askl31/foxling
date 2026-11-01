# ☁️ Configuration pas à pas sur Netlify (gratuit)

Tout ce qu'il faut faire **dans la console Netlify** après avoir importé le dépôt — aucune ligne de commande requise.

---

## 0. ✅ Déjà fait depuis l'agent (résumé)

Le site **foxling** existe déjà sur ton compte Netlify (team `clemmb`, site id `fc31ff81-3728-4f01-8226-75f51f45f8b2`) et un premier déploiement est en ligne :

- **URL publique** : https://foxling.netlify.app (deploy `6ae7302103174afa2c8ff7cc`, état `ready`, 339 fichiers, 2 fonctions déployées : `generate-story` et `tts`)
- Admin : https://app.netlify.com/projects/foxling

Pour redéployer après un changement : `npx -y @netlify/mcp@latest --site-id fc31ff81-3728-4f01-8226-75f51f45f8b2` dans le dépôt (ou importe le dépôt GitHub pour du continu).

---

## 1. Créer le site (une fois)

1. Allez sur [app.netlify.com](https://app.netlify.com) et connectez-vous (compte GitHub OK).
2. **Add new site → Import an existing project**.
3. Choisissez **GitHub** → dépôt `Askl31/foxling` → branche `main`.
4. Netlify détecte automatiquement `netlify.toml` :
   - Build command : `npm run build` (laisser tel quel)
   - Publish directory : `dist` (laisser tel quel)
5. Cliquez **Deploy site**. Le premier build prend ~1 min.
6. L'URL est du type `https://foxling-xxxxx.netlify.app`. Vous pouvez la renommer :
   **Site settings → Site details → Change site name** → ex. `foxling-famille`.

✅ Déploiement continu actif : chaque `git push` sur `main` redéploie automatiquement.

---

## 2. Variables d'environnement (chemin 2026)

Dans l'UI 2026, on parle de **« Project »**, pas « Site » :

1. [app.netlify.com](https://app.netlify.com) → ton team `clemmb` → projet **`foxling`**.
2. Menu de gauche : **Project configuration → Environment variables** → **Add a variable** :

| Clé | Valeur | Portée (Scope) à cocher |
|---|---|---|
| `MISTRAL_API_KEY` | ta clé `sk-...` | ✅ Functions + ✅ Runtime (Edge) — **PAS** builds si tu veux la garder hors logs |
| `SITE_PASSWORD` | mot de passe visiteur | ✅ Runtime (Edge) |
| `AUTH_SECRET` | `openssl rand -hex 32` | ✅ Runtime (Edge) |
| `MISTRAL_TTS_VOICE` | ex. `gb_jane_neutral` (optionnel) | ✅ Functions |

> ⚠️ Ne mets JAMAIS ces clés dans `netlify.toml` (commité) : les variables déclarées dans
> `netlify.toml` ne sont de toute façon PAS disponibles aux fonctions/edge en runtime.

## 3. Redéployer (chemin 2026)

Les variables d'environnement ne s'appliquent qu'à un **nouveau deploy**.

### Cas A — le site a été déployé MANUELLEMENT (upload zip/API, comme foxling actuellement)

Pas de bouton « Trigger deploy » (il n'y a pas de source Git). Deux façons de redéployer :

**A1. Depuis ton Mac (recommandé, ~20 s)** — re-upload le dépôt entier (Netlify rebuild) :
```bash
cd foxling
npx -y @netlify/mcp@latest --site-id fc31ff81-3728-4f01-8226-75f51f45f8b2
```

**A2. Depuis la console** : onglet **Deploys** du projet → **Add new deploy → Deploy manually**
→ glisse le dossier `dist/` (après `npm run build`) — note : cette méthode n'exécute PAS
les fonctions/edge avec les nouvelles env vars de build, donc préfère A1 ou le cas B.

### Cas B — connecter le dépôt GitHub `Askl31/foxling` (déploiement continu)

Le dépôt `foxling` est **privé** : il faut d'abord donner accès à l'app Netlify GitHub.

**Étape B1 — autoriser l'app Netlify sur le dépôt (une fois)** :
1. Sur GitHub : https://github.com/settings/installations → l'installation de l'app Netlify
   (ou https://github.com/apps/netlify/installations/new) → choisis le compte `Askl31` →
   sélectionne **Only select repositories** → coche **`foxling`** → Install/Authorize.

**Étape B2 — lier le projet Netlify au dépôt** :
1. [app.netlify.com](https://app.netlify.com) → projet **`foxling`** →
   **Project configuration → Build & deploy → Continuous deployment → Link repository**.
2. Choisis **GitHub**, sélectionne `Askl31/foxling`, branche de production **`main`**.
3. Laisse les réglages build détectés via `netlify.toml` (commande `npm run build`, publish `dist`).
4. **Save** → un premier deploy se lance automatiquement depuis `main`.

Dès lors : chaque `git push origin main` redéploie automatiquement, et le bouton
**Deploys → Trigger deploy → Deploy site** fonctionne (rebuild du dernier commit).

> Les variables d'environnement (étape 2) restent à définir dans
> **Project configuration → Environment variables** — elles ne se mettent pas dans `netlify.toml`.

## 4. Protéger l'accès (gratuit, 2026)

« Password protection » du dashboard = plan Pro seulement depuis 2026. En gratuit, l'app
contient déjà une **edge function** : `netlify/edge-functions/auth.ts`.

Après avoir renseigné `SITE_PASSWORD` + `AUTH_SECRET` (étape 2) puis redéployé (étape 3) :
- ouvrir https://foxling.netlify.app en navigation privée → page 🔒 (401), aucun contenu servi ;
- saisir le mot de passe → cookie signé HMAC valable 7 jours → accès à l'app.

Si un jour tu passes en Pro : **Project configuration → Access & security → Visitor access → Password Protection**.

## 5. (Optionnel) Nom de domaine personnalisé

**Site settings → Domain management → Add custom domain** → suivez la procédure DNS (CNAME vers `foxling-xxxxx.netlify.app`). Le certificat HTTPS est automatique et gratuit.

---

## 6. Vérifications après déploiement

| Test | Comment | Résultat attendu |
|---|---|---|
| Site en ligne | ouvrir l'URL | page 🔒 edge function si SITE_PASSWORD est défini (étape 4), sinon sélection de profil |
| PWA installable | « Ajouter à l'écran d'accueil » sur tablette | icône Foxy, lancement plein écran |
| Offline | couper le Wi-Fi après 1er chargement, rouvrir l'app | l'app fonctionne encore (service worker) |
| Voix pré-générées lues | jouer un mot / une histoire avec les MP3 déployés | le son vient des MP3 Voxtral (pas du TTS robotique navigateur) — sinon voir « Ancien service worker » ci-dessous |

### Ancien service worker (si les MP3 ne sont pas lus)

Un service worker déjà installé garde l'ancienne version de l'app en cache. Sur la tablette :
1. Ouvrez l'app déployée → DevTools (ou Safari Web Inspector) → Application → Service Workers → **Unregister** ;
2. Videz le cache : Application → Clear storage → cochez tout → Clear ;
3. Rechargez la page (ou réinstallez la PWA) → le nouveau SW `foxling-v2` sert les MP3 pré-générés en priorité.
| Proxy histoires | espace parent → onglet enfant → « Générer une histoire » | histoire validée (liste blanche) ou message d'erreur clair si clé absente |
| Proxy voix | lire une histoire avec prénom | MP3 généré puis rejoué offline |
| Gate edge function | ouvrir l'URL en navigation privée | page 🔒 puis accès après mot de passe |

---

## 7. Si quelque chose ne marche pas

- **Build en échec** : Deploys → cliquez le build → onglet « Deploy log ». Classiques : `npm ci` échoue → le `netlify.toml` retombe sur `npm install` automatiquement.
- **404 sur une route** : le fallback SPA (`[[redirects]]` dans `netlify.toml`) doit renvoyer `index.html` — vérifiez que `netlify.toml` est bien à la racine du dépôt.
- **Fonction `/api/*` 404** : vérifiez que `netlify/functions/` contient `generate-story.mjs` et `tts.mjs` (déployées via l'alias `config.path`), et que les variables d'env sont bien au niveau **Site** (pas seulement « branch deploy »).
- **Clé refusée (401/403 Mistral)** : la clé a peut-être des restrictions d'usage — créez une clé dédiée sans restriction sur console.mistral.ai.

---

## Récapitulatif des réglages console

```
Site settings
├── Site details → Change site name        → renommer l'URL
├── Environment variables                  → MISTRAL_API_KEY, MISTRAL_TTS_VOICE
├── Password protection → Set password     → Basic Auth (tout le site)
└── Domain management → Add custom domain  → domaine perso (optionnel)
```
